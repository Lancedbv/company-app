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
    { id: "starter", name: "Starter", price: "Free", desc: "For small companies getting started" },
    { id: "professional", name: "Professional", price: "€49/mo", desc: "For growing companies with active hiring" },
    { id: "enterprise", name: "Enterprise", price: "€149/mo", desc: "For large organizations with multiple teams" },
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
                padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${data.plan === plan.id ? "var(--ac)" : "var(--g2)"}`,
                background: data.plan === plan.id ? "rgba(96,77,255,.06)" : "var(--bg)",
                cursor: "pointer", textAlign: "left", fontFamily: "var(--sans)", transition: "all .2s",
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--tx)" }}>{plan.name}</div>
                <div style={{ fontSize: 12, color: "var(--g4)", marginTop: 2 }}>{plan.desc}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: data.plan === plan.id ? "var(--ac)" : "var(--tx)", whiteSpace: "nowrap" }}>
                {plan.price}
              </div>
            </button>
          ))}
        </div>
        {errors.plan && <div className="ob-field-error">{errors.plan}</div>}
      </div>
      {data.plan && data.plan !== "starter" && (
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
    </>
  );
}

function VerificationForm({ data, onChange }) {
  const [sent, setSent] = useState(false);

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
        { text: "Welcome, {firstName},", type: "hero", delay: 0 },
        { text: "to Lanced.", type: "brand", delay: 900 },
        { text: "Where you discover and hire extraordinary talent.", type: "tagline", delay: 1900 },
      ],
      cta: "Let's go",
    },
    existingUser: {
      lines: [
        { text: "Welcome back, {firstName},", type: "hero", delay: 0 },
        { text: "to the new Lanced.", type: "brand", delay: 900 },
        { text: "A lot has changed. Let us show you around.", type: "tagline", delay: 1900 },
      ],
      cta: "Show me what's new",
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

  dataSteps: [
    {
      id: "business-details",
      title: "Business Details",
      intro: "Great choices! Let's start with the basics.",
      prompt: "First, tell us about your company.",
      cta: "Let's do it",
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
      skipLabel: "I'll do this later",
      skippable: true,
      component: TeamSetupForm,
      validate: () => ({ valid: true, errors: {} }),
      mapFromProfile: () => ({}),
      successMessage: "Perfect. Your team invites are ready.",
    },
    {
      id: "plan-billing",
      title: "Plan & Billing",
      prompt: "Let's pick a plan that works for you.",
      cta: "Choose a plan",
      skippable: false,
      component: PlanBillingForm,
      validate: (data) => {
        const errors = {};
        if (!data.plan) errors.plan = "Please select a plan";
        return { valid: Object.keys(errors).length === 0, errors };
      },
      mapFromProfile: () => ({}),
      successMessage: "Great choice. You're all set with the essentials.",
    },
    {
      id: "verification",
      title: "Verification",
      prompt: "One last thing — let's verify your account.",
      cta: "Verify now",
      skippable: false,
      component: VerificationForm,
      validate: (data) => ({ valid: data.verified === true, errors: data.verified ? {} : { verified: "Please verify your email" } }),
      mapFromProfile: () => ({}),
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

  whatsNew: {
    videoSrc: null,
    features: [
      { title: "Hiring Rooms", description: "Run auditions, castings, and job calls end-to-end.", targetSelector: "[data-tour='rooms']" },
      { title: "Open Board", description: "Post opportunities publicly and reach new artists.", targetSelector: "[data-tour='promote']" },
      { title: "Analytics", description: "Track views, applications, and hiring funnel.", targetSelector: "[data-tour='analytics']" },
    ],
  },
};
