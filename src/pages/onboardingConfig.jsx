import { useState } from "react";

/* ━━━ STEP FORM COMPONENTS ━━━ */

const COMPANY_TYPES = ["Studio", "Theater", "Dance Company", "Theater Company", "Opera", "Ballet Company", "Performing Arts Company", "Production Company", "Casting Agency", "Other"];

function BusinessDetailsForm({ data, onChange, errors }) {
  return (
    <>
      <div className="ob-field">
        <label>Company Name *</label>
        <input
          value={data.name || ""}
          onChange={e => onChange("name", e.target.value)}
          placeholder="e.g. Theater Lanced"
          className={errors.name ? "ob-error" : ""}
        />
        {errors.name && <div className="ob-field-error">{errors.name}</div>}
      </div>
      <div className="ob-field">
        <label>Company Type *</label>
        <select value={data.type || ""} onChange={e => onChange("type", e.target.value)} className={errors.type ? "ob-error" : ""}>
          <option value="">Select type...</option>
          {COMPANY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        {errors.type && <div className="ob-field-error">{errors.type}</div>}
      </div>
      <div className="ob-field">
        <label>Address</label>
        <input value={data.address || ""} onChange={e => onChange("address", e.target.value)} placeholder="e.g. 12 Stage Lane, London, UK" />
      </div>
      <div className="ob-field">
        <label>Website</label>
        <input value={data.website || ""} onChange={e => onChange("website", e.target.value)} placeholder="https://yourcompany.com" />
      </div>
      <div className="ob-field">
        <label>Contact Email *</label>
        <input
          type="email"
          value={data.email || ""}
          onChange={e => onChange("email", e.target.value)}
          placeholder="team@yourcompany.com"
          className={errors.email ? "ob-error" : ""}
        />
        {errors.email && <div className="ob-field-error">{errors.email}</div>}
      </div>
    </>
  );
}

function LogoUploadForm({ data, onChange }) {
  return (
    <>
      <div className="ob-field">
        <label>Company Logo</label>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 14, background: data.logo ? `url(${data.logo}) center/cover` : "var(--g1)",
            border: "2px dashed var(--g3)", display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--g4)", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0,
          }}>
            {!data.logo && "Upload"}
          </div>
          <div style={{ fontSize: 13, color: "var(--g4)", lineHeight: 1.5 }}>
            Drag and drop or click to upload.<br />PNG, JPG or SVG. Max 2MB.
          </div>
        </div>
      </div>
      <div className="ob-field">
        <label>Tagline</label>
        <input value={data.tagline || ""} onChange={e => onChange("tagline", e.target.value)} placeholder="A short description of your company" />
      </div>
    </>
  );
}

function TeamSetupForm({ data, onChange }) {
  const [inviteEmail, setInviteEmail] = useState("");
  const emails = data.inviteEmails || [];

  const addEmail = () => {
    if (inviteEmail && inviteEmail.includes("@")) {
      onChange("inviteEmails", [...emails, inviteEmail]);
      setInviteEmail("");
    }
  };

  return (
    <>
      <div className="ob-field">
        <label>Invite Team Members</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addEmail(); } }}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className="ob-action-btn ob-action-secondary"
            onClick={addEmail}
            style={{ padding: "8px 16px", whiteSpace: "nowrap" }}
          >Add</button>
        </div>
      </div>
      {emails.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {emails.map((em, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px",
              background: "rgba(96,77,255,.08)", borderRadius: 8, fontSize: 13, color: "var(--ac)", fontWeight: 500,
            }}>
              {em}
              <button type="button" onClick={() => onChange("inviteEmails", emails.filter((_, j) => j !== i))}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--g4)", fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
            </span>
          ))}
        </div>
      )}
      <div style={{ fontSize: 13, color: "var(--g4)" }}>
        {emails.length === 0 ? "You can always invite team members later." : `${emails.length} invite${emails.length > 1 ? "s" : ""} ready to send.`}
      </div>
    </>
  );
}

function PlanBillingForm({ data, onChange, errors }) {
  const plans = [
    { id: "audition_pass", name: "Audition Pass", price: "€899", priceSub: "one-time", desc: "Run one audition professionally — without the full season workspace." },
    { id: "season",        name: "Season",        price: "€1,599", priceSub: "/year", desc: "Make Lanced your audition workspace for the season.", recommended: true },
    { id: "company",       name: "Company",       price: "€3,999", priceSub: "/year", desc: "For teams running auditions across multiple productions." },
    { id: "institution",   name: "Enterprise",    price: "Custom",       priceSub: "talk to us", desc: "For national companies, state institutions, conservatories, and multi-department venues running Lanced at scale." },
  ];

  return (
    <>
      <div className="ob-field">
        <label>Choose Your Plan *</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {plans.map(plan => (
            <button
              key={plan.id}
              type="button"
              onClick={() => onChange("plan", plan.id)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${data.plan === plan.id ? "var(--ac)" : (plan.recommended ? "rgba(245,166,35,.6)" : "var(--g2)")}`,
                background: data.plan === plan.id ? "rgba(96,77,255,.06)" : "var(--bg)",
                cursor: "pointer", textAlign: "left", fontFamily: "var(--sans)", transition: "all .2s",
                position: "relative",
              }}
            >
              {plan.recommended && data.plan !== plan.id && (
                <div style={{
                  position: "absolute", top: -8, right: 14,
                  fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px",
                  padding: "2px 8px", borderRadius: 12,
                  background: "#F5A623", color: "#3A2A00",
                }}>
                  Recommended
                </div>
              )}
              <div style={{flex:1, minWidth:0, paddingRight:12}}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--tx)" }}>{plan.name}</div>
                <div style={{ fontSize: 12, color: "var(--g4)", marginTop: 2 }}>{plan.desc}</div>
              </div>
              <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: data.plan === plan.id ? "var(--ac)" : "var(--tx)" }}>
                  {plan.price}
                </div>
                <div style={{ fontSize: 11, color: "var(--g4)" }}>{plan.priceSub}</div>
              </div>
            </button>
          ))}
        </div>
        {errors.plan && <div className="ob-field-error">{errors.plan}</div>}
      </div>
      {data.plan && data.plan !== "audition_pass" && data.plan !== "institution" && (
        <>
          <div className="ob-field">
            <label>Billing Email</label>
            <input value={data.billingEmail || ""} onChange={e => onChange("billingEmail", e.target.value)} placeholder="billing@company.com" />
          </div>
          <div className="ob-field">
            <label>VAT Number (optional)</label>
            <input value={data.vat || ""} onChange={e => onChange("vat", e.target.value)} placeholder="e.g. NL123456789B01" />
          </div>
        </>
      )}
      {data.plan === "institution" && (
        <div style={{padding:"12px 14px", borderRadius:12, background:"rgba(96,77,255,.06)", border:"1px solid rgba(96,77,255,.25)", fontSize:12, color:"var(--g5)"}}>
          Enterprise plans are scoped per contract. Tell us about your organization and we'll come back with a proposal — usually within a week.
        </div>
      )}
      {data.plan === "audition_pass" && (
        <div style={{padding:"12px 14px", borderRadius:12, background:"rgba(245,166,35,.08)", border:"1px solid rgba(245,166,35,.3)", fontSize:12, color:"var(--g5)"}}>
          One audition, no saved workspace. Upgrade within 60 days and €500 of your Audition Pass fee will credit toward your annual plan.
        </div>
      )}
    </>
  );
}

function VerificationForm({ data, onChange }) {
  const [sent, setSent] = useState(() => !!data.verified);

  return (
    <>
      <div style={{ textAlign: "center", padding: "12px 0" }}>
        {!sent ? (
          <>
            <div style={{ fontSize: 14, color: "var(--g5)", marginBottom: 16, lineHeight: 1.6 }}>
              We'll send a verification email to confirm your account.
            </div>
            <button
              type="button"
              className="ob-action-btn ob-action-primary"
              onClick={() => { setSent(true); onChange("verified", true); }}
            >
              Send Verification Email
            </button>
          </>
        ) : (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: "rgba(29,185,84,.12)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
              color: "var(--green)", fontSize: 24,
            }}>
              ✓
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--green)", marginBottom: 4 }}>
              Email Verified
            </div>
            <div style={{ fontSize: 13, color: "var(--g4)" }}>
              Your account has been confirmed.
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ━━━ CONFIG ━━━ */
export const ONBOARDING_CONFIG = {
  appId: "company",
  appName: "Lanced Company",
  sidebarLabel: "Company",

  navItems: [
    { icon: "home", label: "Dashboard" },
    { icon: "inbox", label: "Hiring Rooms" },
    { icon: "globe", label: "Open Board" },
    { icon: "users", label: "Network" },
    { type: "divider" },
    { icon: "chart", label: "Analytics" },
    { icon: "settings", label: "Settings" },
  ],

  welcome: {
    newUser: {
      lines: [
        { text: "{firstName}, welcome to Lanced!", type: "hero", delay: 0 },
        { text: "Where you discover and hire extraordinary talent.", type: "tagline", delay: 1100 },
      ],
      cta: "Let's go",
    },
    existingUser: {
      lines: [
        { text: "{firstName}, welcome to Lanced 2.0!", type: "hero", delay: 0 },
        { text: "We're excited to show you the new platform. Let's get started.", type: "tagline", delay: 1100 },
      ],
      cta: "Let's get started",
    },
  },

  purposes: [
    { id: "auditions", label: "Auditions", icon: "star" },
    { id: "castings", label: "Castings", icon: "play" },
    { id: "hiring", label: "Hiring", icon: "briefcase" },
    { id: "onboarding", label: "Onboarding new hires", icon: "users" },
    { id: "discovering", label: "Discovering new artists", icon: "globe" },
    { id: "promoting", label: "Promoting my opportunities", icon: "chart" },
    { id: "reaching", label: "Reaching new artists", icon: "inbox" },
    { id: "other", label: "Something else", icon: "sparkle" },
  ],

  // Returning-user ("What's New" / 2.0) profile — pre-fills the review-and-confirm flow.
  existingProfile: {
    purposes: ["castings", "hiring"],
    name: "Theater Lanced",
    type: "Theater Company",
    address: "12 Stage Lane, London, UK",
    website: "https://theaterlanced.com",
    email: "team@theaterlanced.com",
    tagline: "Where bold stories come to life.",
    team: ["sophie@theaterlanced.com", "james@theaterlanced.com"],
    plan: "season",
    billingEmail: "billing@theaterlanced.com",
    vat: "GB123456789",
    verified: true,
  },

  dataSteps: [
    {
      id: "business-details",
      title: "Business Details",
      intro: "Great choices! Let's start with the basics.",
      prompt: "First, tell us about your company.",
      cta: "Let's do it",
      introExisting: "Welcome back! Let's make sure everything's still up to date.",
      promptExisting: "Here are your company details — give them a quick check.",
      ctaExisting: "Review details",
      successMessageExisting: "All confirmed — your details are up to date.",
      skippable: false,
      component: BusinessDetailsForm,
      validate: (data) => {
        const errors = {};
        if (!data.name?.trim()) errors.name = "Company name is required";
        if (!data.type) errors.type = "Please select a company type";
        if (!data.email?.trim() || !data.email?.includes("@")) errors.email = "Valid email is required";
        return { valid: Object.keys(errors).length === 0, errors };
      },
      mapFromProfile: (profile) => ({
        name: profile.name, type: profile.type, address: profile.address,
        website: profile.website, email: profile.email,
      }),
      successMessage: "Got it! Your details are saved.",
    },
    {
      id: "upload-logo",
      title: "Logo & Tagline",
      prompt: "Now let's give your space some personality.",
      cta: "Upload logo",
      promptExisting: "Your logo and tagline — still looking good?",
      ctaExisting: "Review branding",
      skipLabel: "Skip for now",
      skippable: true,
      component: LogoUploadForm,
      validate: () => ({ valid: true, errors: {} }),
      mapFromProfile: (profile) => ({ logo: profile.logo, tagline: profile.tagline }),
      successMessage: "Looking good! Your space is taking shape.",
    },
    {
      id: "team-setup",
      title: "Team Setup",
      prompt: "Want to invite your team? Collaboration is better together.",
      cta: "Invite team",
      promptExisting: "Here's your team. Want to invite anyone new?",
      ctaExisting: "Review team",
      skipLabel: "I'll do this later",
      skippable: true,
      component: TeamSetupForm,
      validate: () => ({ valid: true, errors: {} }),
      mapFromProfile: (profile) => ({ inviteEmails: profile.team || [] }),
      successMessage: "Perfect. Your team invites are ready.",
    },
    {
      id: "plan-billing",
      title: "Plan & Billing",
      prompt: "Let's pick a plan that works for you.",
      cta: "Choose a plan",
      promptExisting: "Here's your current plan. Keep it, or upgrade for the new features.",
      ctaExisting: "Review plan",
      skippable: false,
      component: PlanBillingForm,
      validate: (data) => {
        const errors = {};
        if (!data.plan) errors.plan = "Please select a plan";
        return { valid: Object.keys(errors).length === 0, errors };
      },
      mapFromProfile: (profile) => ({ plan: profile.plan, billingEmail: profile.billingEmail, vat: profile.vat }),
      successMessage: "Great choice. You're all set with the essentials.",
    },
    {
      id: "verification",
      title: "Verification",
      prompt: "One last thing — let's verify your account.",
      cta: "Verify now",
      promptExisting: "Your account's already verified — just confirm to wrap up.",
      ctaExisting: "Confirm",
      successMessageExisting: "All set — welcome back to Lanced 2.0.",
      skippable: false,
      component: VerificationForm,
      validate: (data) => ({ valid: data.verified === true, errors: data.verified ? {} : { verified: "Please verify your email" } }),
      mapFromProfile: (profile) => ({ verified: !!profile.verified }),
      successMessage: "You're verified! Welcome to Lanced.",
    },
  ],

  learningSteps: [
    {
      id: "create-hiring-room",
      purposes: ["auditions", "castings", "hiring"],
      prompt: "Since you're interested in hiring, here's how to create your first hiring room — where you'll manage auditions, castings, and job calls.",
      cta: "Show me how",
      skipLabel: "I'll explore on my own",
    },
    {
      id: "post-open-board",
      purposes: ["hiring", "promoting", "reaching"],
      prompt: "Want to reach more artists? The Open Board lets you post opportunities publicly — think of it as your job board on Lanced.",
      cta: "Learn about Open Board",
      skipLabel: "Maybe later",
    },
    {
      id: "browse-network",
      purposes: ["discovering", "reaching"],
      prompt: "The Network is where you discover new talent — browse artist profiles, filter by style, location, and skills.",
      cta: "Explore the network",
      skipLabel: "I'll check it out later",
    },
    {
      id: "boost-promote",
      purposes: ["promoting"],
      prompt: "Want your opportunities to stand out? Boosts give your listings premium placement across the platform.",
      cta: "Learn about boosts",
      skipLabel: "Skip for now",
    },
    {
      id: "onboard-team",
      purposes: ["onboarding"],
      prompt: "Setting up new team members? Here's how roles and permissions work so everyone has the right access.",
      cta: "Show me",
      skipLabel: "I'll figure it out",
    },
  ],

  learningIntro: "You've got the essentials down. Here are a few quick guides, picked just for you.",
  learningEmpty: "You're all set — no extra guides needed right now. You can always find tutorials in the Academy.",
  learningSuccess: "Nice — you know your way around Lanced now.",

  tips: [
    { id: "tip-search", title: "Quick navigation", prompt: "A little tip — press ⌘K (or Ctrl+K) anywhere to jump straight to any room, artist, or setting." },
    { id: "tip-team", title: "Bring your team in", prompt: "Lanced is better together. Invite colleagues anytime from Settings — roles keep everyone at the right access level." },
    { id: "tip-academy", title: "Learn as you grow", prompt: "The Academy is full of short guides on hiring, casting, and discovery. Pop in whenever you want to go deeper." },
  ],

  completeMessage: "That's everything — your workspace is ready. Time to find your next great artist.",
  completeCta: "Enter Lanced",

  whatsNew: {
    videoSrc: null,
    features: [
      { title: "Hiring Rooms", description: "Run auditions, castings, and job calls end-to-end.", targetSelector: "[data-tour='rooms']" },
      { title: "Open Board", description: "Post opportunities publicly and reach new artists.", targetSelector: "[data-tour='promote']" },
      { title: "Analytics", description: "Track views, applications, and hiring funnel.", targetSelector: "[data-tour='analytics']" },
    ],
  },
};
