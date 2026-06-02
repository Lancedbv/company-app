import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { PLANS, ADDONS, CREDIT_MECHANIC, UPGRADE_TRIGGERS, getPlan, getAddon, recommendUnlock, upgradeCost } from "../data/plans";

const STORAGE_KEY = "lanced-company-entitlements";

const DEFAULT_STATE = {
  planId: "season",
  activeAddonIds: [],
  auditionPassPurchasedAt: null, // ISO date — used for credit expiry + 12-month block
  auditionPassCallsUsed: 0,      // hard cap = 1 within rolling 12mo
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    // Migrate legacy plan ids
    if (parsed.planId === "one_off") parsed.planId = "audition_pass";
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

const EntitlementsContext = createContext(null);

export function EntitlementsProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const plan = useMemo(() => getPlan(state.planId), [state.planId]);

  const hasAddon = useCallback((addonId) => {
    if (plan.plan_id === "company" || plan.plan_id === "institution") {
      const a = getAddon(addonId);
      if (a?.included_in_plans.includes(plan.plan_id)) return true;
    }
    return state.activeAddonIds.includes(addonId);
  }, [plan, state.activeAddonIds]);

  const hasFeature = useCallback((flag) => {
    if (plan.features?.[flag]) return true;
    for (const a of ADDONS) {
      if (a.features_unlocked.includes(flag) && hasAddon(a.addon_id)) return true;
    }
    return false;
  }, [plan, hasAddon]);

  // Limits — returns {limit, isUnlimited, isBlocked, remaining, currentUsage}
  const checkLimit = useCallback((limitKey, currentUsage = 0) => {
    const limit = plan.limits?.[limitKey];
    if (limit === -1) {
      return { limit: -1, isUnlimited: true, isBlocked: false, remaining: Infinity, currentUsage };
    }
    const isBlocked = currentUsage >= (limit ?? 0);
    return {
      limit: limit ?? 0,
      isUnlimited: false,
      isBlocked,
      remaining: Math.max(0, (limit ?? 0) - currentUsage),
      currentUsage,
    };
  }, [plan]);

  // Returns the artist_pools tier enum string: 'none' | 'basic' | 'full_plus_custom'
  const poolsTier = plan.features?.artist_pools || "none";

  // Returns artist_pools support level — 'none' on One-off (UI hides pools).
  const canUsePools = poolsTier !== "none";
  // Custom-named pools only on full_plus_custom
  const canCreateCustomPools = poolsTier === "full_plus_custom";

  // Call type entitlement — all plans support all types per current spec.
  const isCallTypeAllowed = useCallback((callType) =>
    plan.allowed_call_types.includes(callType), [plan]);

  // ─── Dev / paywall actions ────────────────────────────────────────────────
  const setPlanId = useCallback((planId) => {
    setState(s => ({ ...s, planId }));
  }, []);

  const toggleAddon = useCallback((addonId) => {
    setState(s => {
      const has = s.activeAddonIds.includes(addonId);
      return {
        ...s,
        activeAddonIds: has
          ? s.activeAddonIds.filter(a => a !== addonId)
          : [...s.activeAddonIds, addonId],
      };
    });
  }, []);

  const recordAuditionPassPurchase = useCallback(() => {
    setState(s => ({
      ...s,
      planId: "audition_pass",
      auditionPassPurchasedAt: new Date().toISOString(),
      auditionPassCallsUsed: 0,
      activeAddonIds: [],
    }));
  }, []);

  const recordAuditionPassCallUsed = useCallback(() => {
    setState(s => ({ ...s, auditionPassCallsUsed: s.auditionPassCallsUsed + 1 }));
  }, []);

  // ─── Credit expiry / one-off window ──────────────────────────────────────
  const auditionPassCreditActive = useMemo(() => {
    if (!state.auditionPassPurchasedAt) return false;
    const purchased = new Date(state.auditionPassPurchasedAt).getTime();
    const expiry = purchased + CREDIT_MECHANIC.expiry_days_from_purchase * 24 * 3600 * 1000;
    return Date.now() < expiry;
  }, [state.auditionPassPurchasedAt]);

  const auditionPassWindowOpen = useMemo(() => {
    if (!state.auditionPassPurchasedAt) return false;
    const purchased = new Date(state.auditionPassPurchasedAt).getTime();
    const yearFromPurchase = purchased + 365 * 24 * 3600 * 1000;
    return Date.now() < yearFromPurchase;
  }, [state.auditionPassPurchasedAt]);

  // ─── Trigger logic — Season/Company upgrade prompts ──────────────────────
  const callUpgradeTrigger = useCallback((callsUsed) => {
    if (plan.plan_id === "season") {
      if (callsUsed >= UPGRADE_TRIGGERS.season_to_company_urgent_at_calls) return "season_to_company_urgent";
      if (callsUsed >= UPGRADE_TRIGGERS.season_to_company_soft_at_calls) return "season_to_company_soft";
    }
    if (plan.plan_id === "company") {
      if (callsUsed >= UPGRADE_TRIGGERS.company_to_institution_at_calls) return "company_to_institution";
    }
    return null;
  }, [plan]);

  const value = useMemo(() => ({
    // state
    planId: state.planId,
    plan,
    activeAddonIds: state.activeAddonIds,
    auditionPassCallsUsed: state.auditionPassCallsUsed,
    auditionPassPurchasedAt: state.auditionPassPurchasedAt,
    auditionPassCreditActive,
    auditionPassWindowOpen,
    // catalogue
    PLANS, ADDONS,
    // queries
    hasFeature, checkLimit, hasAddon, isCallTypeAllowed,
    poolsTier, canUsePools, canCreateCustomPools,
    callUpgradeTrigger,
    recommendUnlock: (flag) => recommendUnlock(flag, state.planId, state.activeAddonIds),
    upgradeCost: (toPlanId) => upgradeCost(state.planId, toPlanId, auditionPassCreditActive),
    // mutators
    setPlanId, toggleAddon, recordAuditionPassPurchase, recordAuditionPassCallUsed,
  }), [state, plan, auditionPassCreditActive, auditionPassWindowOpen, hasFeature, checkLimit, hasAddon, isCallTypeAllowed, poolsTier, canUsePools, canCreateCustomPools, callUpgradeTrigger, setPlanId, toggleAddon, recordAuditionPassPurchase, recordAuditionPassCallUsed]);

  return <EntitlementsContext.Provider value={value}>{children}</EntitlementsContext.Provider>;
}

export function useEntitlements() {
  const ctx = useContext(EntitlementsContext);
  if (!ctx) throw new Error("useEntitlements must be used within EntitlementsProvider");
  return ctx;
}
