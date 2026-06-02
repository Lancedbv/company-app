// =============================================================================
// LANCED — COMPANY PRICING (revised June 2026)
// =============================================================================
// Positioning:
//   Audition Pass — "For a single audition without the full workspace."
//   Season        — "For companies running auditions throughout the season."
//   Company       — "For organizations managing multiple productions, teams, and hires."
//   Institution   — "For large institutions with complex workflows, data, AI, and support needs."
//
// Conventions:
//    -1  = unlimited
//     0  = feature not included on plan
//   null = not applicable
// =============================================================================

export const FEATURE_FLAGS = [
  "company_workspace",
  "member_activity_tracking", // who reviewed/voted/scored what, per-member analytics
  "applicant_history_tracking",
  "multiple_roles_per_call",
  "multiple_locations_per_call",
  "early_invites",
  "multiple_rejection_reasons",
  "team_role_assignment",
  "annual_review",
  "guided_onboarding",
  "custom_application_forms",
  "multi_department_access",
  "aria_ai_access",
  "priority_sla",
  "credits_toward_upgrade",
  "contract_signing",
  "new_hire_onboarding_workflow",
  "document_collection",
  "gdpr_tools",
  "audit_logs",
  "custom_retention_policies",
  "sso_access",
  "data_residency_choice",
  "custom_dpa",
];

export const LIMIT_KEYS = [
  "calls_per_year",
  "team_members_max",
  "artist_database_size",
  "network_messages_per_month",
  "max_additional_media_requirements",
];

export const FEATURE_LABELS = {
  company_workspace: "Company Workspace",
  member_activity_tracking: "Activity Tracking",
  applicant_history_tracking: "Applicant History",
  multiple_roles_per_call: "Multiple Roles per Call",
  multiple_locations_per_call: "Multi-Location Calls",
  early_invites: "Early Invites",
  multiple_rejection_reasons: "Multiple Rejection Reasons",
  team_role_assignment: "Team Role Assignment",
  annual_review: "Annual Review",
  guided_onboarding: "Guided Onboarding",
  custom_application_forms: "Custom Application Forms",
  multi_department_access: "Multi-Department Access",
  aria_ai_access: "ARIA AI Assistant",
  priority_sla: "Priority SLA",
  contract_signing: "Contract Signing",
  new_hire_onboarding_workflow: "New-Hire Onboarding",
  document_collection: "Document Collection",
  audit_logs: "Audit Logs",
  custom_retention_policies: "Custom Retention Policies",
  sso_access: "Single Sign-On (SSO)",
  data_residency_choice: "Data Residency Choice",
  custom_dpa: "Custom DPA",
  artist_pools: "Artist Pools",
};

export const PLANS = [
  {
    plan_id: "free",
    display_name: "Free",
    price_eur: 0,
    billing_cycle: "free",
    monthly_equivalent_eur: null,
    overage_price_per_call_eur: null,
    purchase_limit_per_year: null,
    is_most_popular: false,
    tagline: "Promote your listings on our open board.",
    description: "Post your hiring opportunities on the Lanced open board — free for the community. No workspace, no applicant management — just visibility on the board.",
    card_subtitle: "Forever free",
    limits: {
      calls_per_year: 0,
      team_members_max: 1,
      artist_database_size: 0,
      network_messages_per_month: 0,
      max_additional_media_requirements: 0,
    },
    features: {
      company_workspace: false,
      member_activity_tracking: false,
      artist_pools: "none",
      applicant_history_tracking: false,
      multiple_roles_per_call: false,
      multiple_locations_per_call: false,
      early_invites: false,
      multiple_rejection_reasons: false,
      team_role_assignment: false,
      annual_review: false,
      guided_onboarding: false,
      custom_application_forms: false,
      multi_department_access: false,
      aria_ai_access: false,
      priority_sla: false,
      credits_toward_upgrade: false,
      contract_signing: false,
      new_hire_onboarding_workflow: false,
      document_collection: false,
      gdpr_tools: true,
      audit_logs: false,
      custom_retention_policies: false,
      sso_access: false,
      data_residency_choice: false,
      custom_dpa: false,
      open_board_listings: true,
    },
    data_privacy_tier: "basic",
    team_member_roles: [],
    allowed_call_types: [],
    support_tier: "community",
    promote_tier: "open_board_only",
  },
  {
    plan_id: "audition_pass",
    display_name: "Audition Pass",
    price_eur: 899,
    billing_cycle: "one_time",
    monthly_equivalent_eur: null,
    overage_price_per_call_eur: null,
    purchase_limit_per_year: 1,
    is_most_popular: false,
    tagline: "Run one call professionally.",
    description: "Run one audition end to end without the full workspace. For companies that only need a single call this year — and want to try Lanced before committing.",
    card_subtitle: "€500 credit toward annual upgrade",
    limits: {
      calls_per_year: 1,
      team_members_max: 3,
      artist_database_size: 0,
      network_messages_per_month: 0,
      max_additional_media_requirements: 3,
    },
    features: {
      company_workspace: false,
      member_activity_tracking: false,
      artist_pools: "none",
      applicant_history_tracking: false,
      multiple_roles_per_call: false,
      multiple_locations_per_call: false,
      early_invites: false,
      multiple_rejection_reasons: false,
      team_role_assignment: false,
      annual_review: false,
      guided_onboarding: false,
      custom_application_forms: false,
      multi_department_access: false,
      aria_ai_access: false,
      priority_sla: false,
      credits_toward_upgrade: true,
      contract_signing: false,
      new_hire_onboarding_workflow: false,
      document_collection: false,
      gdpr_tools: true,
      audit_logs: false,
      custom_retention_policies: false,
      sso_access: false,
      data_residency_choice: false,
      custom_dpa: false,
    },
    data_privacy_tier: "basic",
    team_member_roles: [],
    allowed_call_types: ["audition","casting","job_call","open_call","competition","residency"],
    support_tier: "email",
    promote_tier: "instagram",
  },
  {
    plan_id: "season",
    display_name: "Season",
    price_eur: 1599,
    billing_cycle: "annual",
    monthly_equivalent_eur: 133,
    overage_price_per_call_eur: 499,
    purchase_limit_per_year: null,
    is_most_popular: true,
    tagline: "Your hiring workspace for the season.",
    description: "Your audition workspace for the season. Three calls, a company dashboard, artist database, and live support — built for the seasonal hiring rhythm.",
    limits: {
      calls_per_year: 3,
      team_members_max: 5,
      artist_database_size: 100,
      network_messages_per_month: 25,
      max_additional_media_requirements: -1,
    },
    features: {
      company_workspace: true,
      member_activity_tracking: true,
      artist_pools: "basic",
      applicant_history_tracking: true,
      multiple_roles_per_call: true,
      multiple_locations_per_call: true,
      early_invites: true,
      multiple_rejection_reasons: true,
      team_role_assignment: true,
      annual_review: false,
      guided_onboarding: false,
      custom_application_forms: false,
      multi_department_access: false,
      aria_ai_access: false,
      priority_sla: false,
      credits_toward_upgrade: false,
      contract_signing: false,
      new_hire_onboarding_workflow: false,
      document_collection: false,
      gdpr_tools: true,
      audit_logs: false,
      custom_retention_policies: false,
      sso_access: false,
      data_residency_choice: false,
      custom_dpa: false,
    },
    data_privacy_tier: "basic",
    team_member_roles: ["owner","admin","member"],
    allowed_call_types: ["audition","casting","job_call","open_call","competition","residency"],
    support_tier: "live_chat_and_email",
    promote_tier: "spotlight_1x",
  },
  {
    plan_id: "company",
    display_name: "Company",
    price_eur: 3999,
    billing_cycle: "annual",
    monthly_equivalent_eur: 333,
    overage_price_per_call_eur: 399,
    purchase_limit_per_year: null,
    is_most_popular: false,
    tagline: "Your central hub for all artistic hiring.",
    description: "Lanced as part of your company's operating system. Ten calls, unlimited team, contracts & onboarding included, and dedicated support.",
    limits: {
      calls_per_year: 10,
      team_members_max: -1,
      artist_database_size: 250,
      network_messages_per_month: 75,
      max_additional_media_requirements: -1,
    },
    features: {
      company_workspace: true,
      member_activity_tracking: true,
      artist_pools: "full_plus_custom",
      applicant_history_tracking: true,
      multiple_roles_per_call: true,
      multiple_locations_per_call: true,
      early_invites: true,
      multiple_rejection_reasons: true,
      team_role_assignment: true,
      annual_review: true,
      guided_onboarding: false,
      custom_application_forms: false,
      multi_department_access: false,
      aria_ai_access: false,
      priority_sla: false,
      credits_toward_upgrade: false,
      contract_signing: true,
      new_hire_onboarding_workflow: true,
      document_collection: true,
      gdpr_tools: true,
      audit_logs: true,
      custom_retention_policies: true,
      sso_access: false,
      data_residency_choice: false,
      custom_dpa: false,
    },
    data_privacy_tier: "enhanced",
    team_member_roles: ["owner","admin","member","viewer","external"],
    allowed_call_types: ["audition","casting","job_call","open_call","competition","residency"],
    support_tier: "dedicated",
    promote_tier: "dedicated_campaigns",
  },
  {
    plan_id: "institution", // kept internal id for stability; display name is "Enterprise"
    display_name: "Enterprise",
    price_eur: null,
    price_label: "Custom",
    billing_cycle: "custom_invoice",
    monthly_equivalent_eur: null,
    overage_price_per_call_eur: null,
    purchase_limit_per_year: null,
    is_most_popular: false,
    tagline: "Scoped per contract · scaled to your operation",
    description: "Custom infrastructure for national companies, state institutions, conservatories, and multi-department venues. High-volume calls, SSO, custom DPA, and a priority SLA.",
    limits: {
      calls_per_year: 20,
      team_members_max: -1,
      artist_database_size: -1,
      network_messages_per_month: -1,
      max_additional_media_requirements: -1,
    },
    features: {
      company_workspace: true,
      member_activity_tracking: true,
      artist_pools: "full_plus_custom",
      applicant_history_tracking: true,
      multiple_roles_per_call: true,
      multiple_locations_per_call: true,
      early_invites: true,
      multiple_rejection_reasons: true,
      team_role_assignment: true,
      annual_review: false,
      guided_onboarding: true,
      custom_application_forms: true,
      multi_department_access: true,
      aria_ai_access: true,
      priority_sla: true,
      credits_toward_upgrade: false,
      contract_signing: true,
      new_hire_onboarding_workflow: true,
      document_collection: true,
      gdpr_tools: true,
      audit_logs: true,
      custom_retention_policies: true,
      sso_access: true,
      data_residency_choice: true,
      custom_dpa: true,
    },
    data_privacy_tier: "full",
    team_member_roles: ["owner","admin","member","viewer","external"],
    allowed_call_types: ["audition","casting","job_call","open_call","competition","residency"],
    support_tier: "dedicated_priority_sla",
    promote_tier: "full",
  },
];

export const ADDONS = [
  {
    addon_id: "contracts_and_onboarding",
    display_name: "Contracts & Onboarding",
    price_eur: 399,
    billing_cycle: "annual",
    available_for_plans: ["season"],
    included_in_plans: ["company","institution"],
    not_available_for_plans: ["audition_pass"],
    description: "Send and sign artist contracts, collect new-hire documents (tax forms, IDs, insurance), and run an onboarding workflow for newly hired artists.",
    features_unlocked: ["contract_signing","new_hire_onboarding_workflow","document_collection"],
  },
];

export const CREDIT_MECHANIC = {
  enabled: true,
  credit_amount_eur: 500,
  applies_to: ["season","company","institution"],
  expiry_days_from_purchase: 60,
  stacking: false,
  blocks_second_audition_pass: true,
  window_definition: "rolling_12_months_from_first_purchase",
  message: "Need the full season workflow? Upgrade within 60 days and we'll credit €500 of your Audition Pass fee toward your annual plan.",
};

// Upgrade triggers — surfaced in-app
export const UPGRADE_TRIGGERS = {
  season_to_company_soft_at_calls: 6,
  season_to_company_urgent_at_calls: 7,
  season_overage_breakeven_calls: 8, // €1,599 + 5×€499 = €4,094 > €3,999 Company
  company_to_institution_at_calls: 18,
  audition_pass_block_at_calls: 1,
};

// ─── helpers ────────────────────────────────────────────────────────────────
export const getPlan = (planId) => PLANS.find(p => p.plan_id === planId) || PLANS[1];
export const getAddon = (addonId) => ADDONS.find(a => a.addon_id === addonId);

// Cheapest plan-or-addon that grants a feature; null if already entitled.
export function recommendUnlock(featureName, currentPlanId, activeAddonIds = []) {
  const plan = getPlan(currentPlanId);
  if (plan.features?.[featureName]) return null;
  for (const id of activeAddonIds) {
    const a = getAddon(id);
    if (a?.features_unlocked.includes(featureName)) return null;
  }
  for (const a of ADDONS) {
    if (a.features_unlocked.includes(featureName) && a.available_for_plans.includes(currentPlanId)) {
      return { type: "addon", target: a };
    }
  }
  const order = ["audition_pass","season","company","institution"];
  const startIdx = order.indexOf(currentPlanId);
  for (let i = startIdx + 1; i < order.length; i++) {
    const p = getPlan(order[i]);
    if (p.features?.[featureName]) return { type: "upgrade", target: p };
  }
  return null;
}

// Upgrade math — applies Audition Pass credit if eligible.
export function upgradeCost(fromPlanId, toPlanId, hasAuditionPassCredit = false) {
  const to = getPlan(toPlanId);
  if (to.price_eur == null) return { amount: null, currency: "EUR", credit: 0, note: "Custom — talk to us" };
  const credit = (fromPlanId === "audition_pass" && hasAuditionPassCredit && CREDIT_MECHANIC.applies_to.includes(toPlanId))
    ? CREDIT_MECHANIC.credit_amount_eur : 0;
  return { amount: Math.max(0, to.price_eur - credit), currency: "EUR", credit };
}
