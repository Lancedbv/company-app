import { useEntitlements } from "./entitlements";
import { FEATURE_LABELS, getAddon } from "../data/plans";

const LockIcon = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" style={{flexShrink:0}}>
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

// Inline lock badge: small pill, click → opens the prompt.
export function LockPill({ children = "Upgrade", onClick, style = {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "2px 8px", borderRadius: 999,
        background: "linear-gradient(135deg,#FFD86B,#F5A623)",
        color: "#3A2A00", fontSize: 10, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: ".5px",
        border: "none", cursor: "pointer", whiteSpace: "nowrap",
        ...style,
      }}
    >
      <LockIcon size={10} color="#3A2A00" /> {children}
    </button>
  );
}

// Inline banner: full-width strip explaining why a feature is locked.
export function UpgradeBanner({ feature, message, onUpgrade, compact = false }) {
  const { recommendUnlock, upgradeCost, auditionPassCreditActive, plan } = useEntitlements();
  const rec = feature ? recommendUnlock(feature) : null;
  const label = FEATURE_LABELS[feature] || feature;
  const msg = message || `${label} isn't available on ${plan.display_name}.`;

  let cta = "Upgrade plan";
  let detail = "";
  if (rec?.type === "addon") {
    cta = `Add ${rec.target.display_name} — €${rec.target.price_eur}/yr`;
    detail = "Or upgrade to Company for everything bundled.";
  } else if (rec?.type === "upgrade") {
    const cost = upgradeCost(rec.target.plan_id);
    if (cost.amount == null) cta = `Talk to ${rec.target.display_name}`;
    else if (cost.credit > 0) cta = `Upgrade to ${rec.target.display_name} — €${cost.amount} (with €${cost.credit} credit)`;
    else cta = `Upgrade to ${rec.target.display_name} — €${cost.amount}/yr`;
    if (auditionPassCreditActive) detail = "Your €500 Audition Pass credit is applied.";
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: compact ? "8px 12px" : "12px 16px",
      borderRadius: 12,
      background: "linear-gradient(135deg, rgba(245,166,35,.10), rgba(96,77,255,.10))",
      border: "1px solid rgba(245,166,35,.35)",
      fontSize: 12,
    }}>
      <LockIcon size={16} color="#B5760E" />
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontWeight:600, color:"var(--tx)"}}>{msg}</div>
        {detail && <div style={{fontSize:11, color:"var(--g4)", marginTop:2}}>{detail}</div>}
      </div>
      <button className="btn btn-p btn-sm" onClick={onUpgrade} style={{whiteSpace:"nowrap"}}>{cta}</button>
    </div>
  );
}

// Modal variant — used by upgrade triggers and hard blocks.
export function UpgradeModal({ open, onClose, feature, title, body, trigger, onGoToBilling }) {
  const { recommendUnlock, upgradeCost, auditionPassCreditActive, plan, PLANS } = useEntitlements();
  if (!open) return null;

  const rec = feature ? recommendUnlock(feature) : null;
  let recommendedPlans = [];
  if (rec?.type === "upgrade") {
    recommendedPlans = [rec.target];
  } else if (trigger === "season_to_company_soft" || trigger === "season_to_company_urgent") {
    recommendedPlans = [PLANS.find(p => p.plan_id === "company")];
  } else if (trigger === "company_to_institution") {
    recommendedPlans = [PLANS.find(p => p.plan_id === "institution")];
  } else if (trigger === "audition_pass_block") {
    recommendedPlans = [PLANS.find(p => p.plan_id === "season"), PLANS.find(p => p.plan_id === "company")];
  } else if (!rec) {
    // Default — show next plan up
    const order = ["audition_pass","season","company","institution"];
    const next = order[Math.min(order.indexOf(plan.plan_id)+1, order.length-1)];
    recommendedPlans = [PLANS.find(p => p.plan_id === next)];
  }

  const titleText = title || (feature ? `${FEATURE_LABELS[feature] || feature} is a paid feature` : "Upgrade required");

  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,.5)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
      animation:"fadeIn .15s ease",
    }}>
      <div onClick={(e)=>e.stopPropagation()} style={{
        background:"var(--bg)", borderRadius:18, padding:28, width:"100%", maxWidth:560,
        maxHeight:"90vh", overflowY:"auto", border:"1px solid var(--g2)",
        boxShadow:"0 20px 60px rgba(0,0,0,.3)",
      }}>
        <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:8}}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background:"linear-gradient(135deg,#FFD86B,#F5A623)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}><LockIcon size={18} color="#3A2A00" /></div>
          <h2 style={{margin:0, fontSize:18, color:"var(--tx)"}}>{titleText}</h2>
        </div>
        {body && <p style={{margin:"0 0 16px", color:"var(--g5)", fontSize:13, lineHeight:1.5}}>{body}</p>}
        {auditionPassCreditActive && (
          <div style={{
            padding:"8px 12px", borderRadius:10,
            background:"rgba(96,77,255,.08)", border:"1px solid rgba(96,77,255,.25)",
            fontSize:12, color:"var(--ac)", marginBottom:14,
          }}>
            Your €500 Audition Pass credit will be applied to any upgrade (60-day window).
          </div>
        )}
        <div style={{display:"grid", gridTemplateColumns:`repeat(${recommendedPlans.length}, 1fr)`, gap:12, marginBottom:16}}>
          {recommendedPlans.filter(Boolean).map(p => {
            const cost = upgradeCost(p.plan_id);
            return (
              <div key={p.plan_id} style={{
                padding:16, borderRadius:14, border:"2px solid var(--ac)",
                background:"var(--sf)",
              }}>
                <div style={{fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".5px", color:"var(--ac)"}}>
                  {p.display_name}
                </div>
                <div style={{display:"flex", alignItems:"baseline", gap:6, margin:"4px 0"}}>
                  <span style={{fontSize:22, fontWeight:700, color:"var(--tx)"}}>
                    {cost.amount == null ? "Custom" : `€${cost.amount.toLocaleString("nl-NL")}`}
                  </span>
                  <span style={{fontSize:11, color:"var(--g4)"}}>
                    {cost.amount == null ? "" : `/ yr · excl. VAT`}
                  </span>
                </div>
                {cost.credit > 0 && (
                  <div style={{fontSize:11, color:"var(--ac)", marginBottom:6, fontWeight:600}}>
                    €{p.price_eur.toLocaleString("nl-NL")} − €{cost.credit} Audition Pass credit
                  </div>
                )}
                <div style={{fontSize:12, color:"var(--g5)", marginBottom:10, lineHeight:1.5}}>{p.tagline}</div>
                <div style={{fontSize:11, color:"var(--g5)", lineHeight:1.6}}>
                  • {p.limits.calls_per_year === -1 ? "Unlimited" : p.limits.calls_per_year}{p.plan_id==="institution"?"+":""} calls / year<br/>
                  • {p.limits.team_members_max === -1 ? "Unlimited" : p.limits.team_members_max} team members<br/>
                  • {p.limits.artist_database_size === -1 ? "Unlimited" : p.limits.artist_database_size} saved artists
                </div>
              </div>
            );
          })}
        </div>
        <div style={{display:"flex", gap:10, justifyContent:"flex-end"}}>
          <button className="btn btn-s btn-sm" onClick={onClose}>Maybe later</button>
          <button className="btn btn-p btn-sm" onClick={() => { onClose(); onGoToBilling?.(); }}>
            See all plans
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook-style helper: returns { promptUpgrade, modal } — drop modal into JSX.
import { useState } from "react";
export function useUpgradePrompt() {
  const [state, setState] = useState({ open: false, feature: null, title: null, body: null, trigger: null });
  const promptUpgrade = (opts = {}) => setState({ open: true, ...opts });
  const close = () => setState(s => ({ ...s, open: false }));
  return { promptUpgrade, state, close };
}
