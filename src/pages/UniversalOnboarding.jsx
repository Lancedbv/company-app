import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

/* ━━━ TYPEWRITER HOOK ━━━ */
function useTypewriter(text, speed = 35, startDelay = 0, enabled = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!enabled) { setDisplayed(""); setDone(false); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const delayTimer = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(delayTimer);
  }, [text, speed, startDelay, enabled]);
  return { displayed, done };
}

/* ━━━ BRUSH BACKGROUND (matches the auth/login page — animated brush-stroke sweeps) ━━━ */
function OnboardingBlobBg() {
  return (
    <div className="ob-brush-field" aria-hidden="true">
      <div className="ob-brush a" />
      <div className="ob-brush b" />
      <div className="ob-brush c" />
      <div className="ob-brush d" />
      <div className="ob-brush e" />
      <div className="ob-brush f" />
      <div className="ob-brush-grain" />
    </div>
  );
}

/* ━━━ CONFETTI BURST (fires once on mount) ━━━ */
const CONFETTI_COLORS = ["#604DFF", "#8B7AFF", "#A294FF", "#1DB954", "#FFD166", "#FF6B9D", "#4ECDC4"];
function ConfettiBurst() {
  const pieces = useRef(
    Array.from({ length: 44 }, () => ({
      tx: (Math.random() * 2 - 1) * 260,
      ty: Math.random() * 420 - 120,
      r: Math.random() * 720 - 360,
      delay: Math.random() * 0.12,
      dur: 0.9 + Math.random() * 0.7,
      w: 6 + Math.random() * 7,
      h: 9 + Math.random() * 9,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      radius: Math.random() > 0.5 ? "2px" : "50%",
    }))
  ).current;
  return createPortal(
    <div className="ob-confetti">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="ob-confetti-piece"
          style={{
            "--tx": `${p.tx}px`, "--ty": `${p.ty}px`, "--r": `${p.r}deg`,
            animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
            width: p.w, height: p.h, background: p.color, borderRadius: p.radius,
          }}
        />
      ))}
    </div>,
    document.body
  );
}

/* ━━━ ICONS ━━━ */
const OI = ({ n, s = 20 }) => {
  const p = { width: s, height: s, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
  const icons = {
    check: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    arrow: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    chevron: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="6 9 12 15 18 9"/></svg>,
    skip: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>,
    play: <svg style={p} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    home: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    users: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    globe: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    mail: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    card: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
    image: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    inbox: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
    star: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    building: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9.01" y2="6"/><line x1="15" y1="6" x2="15.01" y2="6"/><line x1="9" y1="10" x2="9.01" y2="10"/><line x1="15" y1="10" x2="15.01" y2="10"/><line x1="9" y1="14" x2="9.01" y2="14"/><line x1="15" y1="14" x2="15.01" y2="14"/><path d="M9 22v-4h6v4"/></svg>,
    upload: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    sparkle: <svg style={p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>,
    settings: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    chart: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    briefcase: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    folder: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  };
  return icons[n] || null;
};

/* ━━━ LANCED MARK (app-icon avatar — real logo glyph on white) ━━━ */
function LancedMark({ size = 34, className = "ob-msg-avatar" }) {
  return (
    <span className={className} aria-label="Lanced" style={{ width: size, height: size }}>
      <svg viewBox="0 0 695 695" width="62%" height="62%" aria-hidden="true">
        <defs>
          <linearGradient id="ob-mark-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#604DFF" />
            <stop offset="0.55" stopColor="#8B7AFF" />
            <stop offset="1" stopColor="#A294FF" />
          </linearGradient>
        </defs>
        <path
          fill="url(#ob-mark-grad)"
          d="M548.51,591.55c-53.38-44.75-123.94-71.84-201.01-71.84s-147.64,27.09-201.01,71.84c169.77-173.27,201.01-335.73,201.01-488.09,0,152.36,23.02,316.32,201.01,488.09Z"
        />
      </svg>
    </span>
  );
}

/* ━━━ STEP ICON RESOLVER ━━━ */
function stepIconName(step) {
  if (step.icon && typeof step.icon === "string") return step.icon;
  const id = (step.id || "").toLowerCase();
  if (/business|agency|company|detail/.test(id)) return "building";
  if (/logo|photo|image|media|portfolio/.test(id)) return "image";
  if (/team|member|client/.test(id)) return "users";
  if (/plan|billing|pay|card/.test(id)) return "card";
  if (/verif|email/.test(id)) return "mail";
  if (/physical|spec|professional|skill|stage|resume/.test(id)) return "star";
  return "star";
}

/* ━━━ WELCOME SCREEN ━━━ */
function OnboardingWelcome({ config, firstName, userType, onContinue }) {
  const welcomeConfig = userType === "existing" ? config.welcome.existingUser : config.welcome.newUser;
  const lines = welcomeConfig.lines.map(l => ({ ...l, text: l.text.replace("{firstName}", firstName || "there") }));
  const [lineIdx, setLineIdx] = useState(0);     // line currently being typed
  const [typed, setTyped] = useState(() => lines.map(() => ""));
  const [showCta, setShowCta] = useState(false);

  // Type each line in sequence, like the Studio Entrance prompt
  useEffect(() => {
    if (lineIdx >= lines.length) {
      const t = setTimeout(() => setShowCta(true), 500);
      return () => clearTimeout(t);
    }
    const text = lines[lineIdx].text;
    const startDelay = lineIdx === 0 ? 450 : 280;
    let ci = 0;
    let iv = null;
    const startT = setTimeout(() => {
      iv = setInterval(() => {
        ci++;
        setTyped(prev => { const n = [...prev]; n[lineIdx] = text.slice(0, ci); return n; });
        if (ci >= text.length) {
          clearInterval(iv);
          setTimeout(() => setLineIdx(i => i + 1), 480);
        }
      }, 38);
    }, startDelay);
    return () => { clearTimeout(startT); if (iv) clearInterval(iv); };
  }, [lineIdx]);

  return (
    <div className="ob-welcome">
      <div className="ob-welcome-content">
        {lines.map((line, idx) => {
          if (idx > lineIdx) return null;
          const variant = line.type === "hero" ? " ob-welcome-hero"
            : line.type === "brand" ? " ob-welcome-brand"
            : line.type === "tagline" ? " ob-welcome-tagline" : "";
          const isTyping = idx === lineIdx && idx < lines.length;
          return (
            <div key={idx} className={`ob-welcome-line${variant}`}>
              <span>{typed[idx]}</span>
              {isTyping && <span className="ob-cursor" />}
            </div>
          );
        })}
        {showCta && (
          <button className="ob-welcome-cta ob-fade-up ob-visible" onClick={onContinue}>
            {welcomeConfig.cta} <OI n="arrow" s={16} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ━━━ PURPOSE SELECTION ━━━ */
function OnboardingPurpose({ config, selected, onSelect, onContinue }) {
  const tw = useTypewriter("What would you like to use Lanced for?", 30, 200, true);
  const [showCards, setShowCards] = useState(false);
  useEffect(() => { if (tw.done) setTimeout(() => setShowCards(true), 300); }, [tw.done]);

  return (
    <div className="ob-purpose">
      <div className="ob-purpose-content">
      <div className="ob-purpose-header">
        <span className="ob-purpose-typed">{tw.displayed}</span>
        {!tw.done && <span className="ob-cursor" />}
      </div>
      <div className="ob-purpose-sub ob-fade-up" style={{ opacity: showCards ? 1 : 0 }}>Select all that apply</div>
      <div className={`ob-purpose-grid${showCards ? " ob-show" : ""}`}>
        {config.purposes.map((p, i) => (
          <button
            key={p.id}
            className={`ob-purpose-card${selected.includes(p.id) ? " ob-selected" : ""}`}
            style={{ animationDelay: `${i * 60}ms` }}
            onClick={() => onSelect(p.id)}
          >
            <span className="ob-purpose-icon"><OI n={p.icon} s={19} /></span>
            <span className="ob-purpose-label">{p.label}</span>
            {selected.includes(p.id) && <span className="ob-purpose-check"><OI n="check" s={14} /></span>}
          </button>
        ))}
      </div>
      {selected.length > 0 && (
        <button className="ob-purpose-continue ob-fade-up ob-visible" onClick={onContinue}>
          Continue <OI n="arrow" s={16} />
        </button>
      )}
      </div>
    </div>
  );
}

/* ━━━ CONVERSATION MESSAGE ━━━ */
function ConversationMessage({ text, delay = 0, onDone }) {
  const [show, setShow] = useState(false);
  const tw = useTypewriter(text, 25, 0, show);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t); }, [delay]);
  useEffect(() => { if (tw.done && onDone) onDone(); }, [tw.done]);

  if (!show) return null;
  return (
    <div className="ob-msg ob-msg-lanced ob-chat-in">
      <LancedMark />
      <div className="ob-msg-bubble">
        <span>{tw.displayed}</span>
        {!tw.done && <span className="ob-cursor ob-cursor-sm" />}
      </div>
    </div>
  );
}

/* ━━━ CONVERSATION ACTION (user clicks) ━━━ */
function ConversationAction({ label, onClick, secondary, secondaryLabel, onSecondary, delay = 0 }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t); }, [delay]);
  if (!show) return null;
  return (
    <div className="ob-msg ob-msg-actions ob-chat-in">
      <button className="ob-action-btn ob-action-primary" onClick={onClick}>{label} <OI n="arrow" s={14} /></button>
      {secondary && <button className="ob-action-btn ob-action-secondary" onClick={onSecondary}>{secondaryLabel}</button>}
    </div>
  );
}

/* ━━━ CONVERSATION FORM STEP ━━━ */
function ConversationFormStep({ step, data, onChange, onSubmit, onSkip, isEditing, onCancel }) {
  const [errors, setErrors] = useState({});
  const StepComponent = step.component;

  const handleSubmit = () => {
    if (step.validate) {
      const result = step.validate(data);
      if (!result.valid) { setErrors(result.errors); return; }
    }
    setErrors({});
    onSubmit();
  };

  return (
    <div className="ob-msg ob-msg-form ob-chat-in">
      <div className={`ob-form-card${isEditing ? " ob-form-sheet" : ""}`}>
        <StepComponent data={data} onChange={onChange} errors={errors} />
        <div className="ob-form-actions">
          <button className="ob-action-btn ob-action-primary" onClick={handleSubmit}>
            {isEditing ? "Save changes" : "Save & Continue"} <OI n="arrow" s={14} />
          </button>
          {isEditing
            ? <button className="ob-action-btn ob-action-secondary" onClick={onCancel}>Cancel</button>
            : step.skippable && <button className="ob-action-btn ob-action-secondary" onClick={onSkip}>{step.skipLabel || "Skip for now"}</button>}
        </div>
      </div>
    </div>
  );
}

/* ━━━ COMPLETED STEP IN CHAT ━━━ */
function ConversationCompleted({ label }) {
  return (
    <div className="ob-msg ob-msg-done ob-chat-in">
      <span className="ob-done-check"><OI n="check" s={14} /></span>
      <span className="ob-done-label">{label}</span>
    </div>
  );
}

/* ━━━ STEPS PANEL (always-visible right rail — color-coded progress) ━━━ */
function stepDisplayStatus(step, rawStatus, idx, activeStepIdx, data) {
  if (rawStatus === "complete") {
    const verified = /verif|email/.test((step.id || "").toLowerCase()) || data?.verified === true;
    return verified
      ? { kind: "verified", label: "Verified" }
      : { kind: "completed", label: "Completed" };
  }
  if (rawStatus === "skipped") return { kind: "skipped", label: "Skipped" };
  if (idx === activeStepIdx) return { kind: "attention", label: "Need attention" };
  return { kind: "pending", label: "Not yet started" };
}

function OnboardingStepsPanel({ steps, state, activeStepIdx, onJumpTo }) {
  // Collapse the learning step + its trailing tips into ONE expandable "Learn how to use Lanced"
  // panel entry (with subsections), so the rail stays compact.
  const entries = [];
  for (let i = 0; i < steps.length;) {
    const s = steps[i];
    if (s.kind === "learning") {
      const subs = [{ step: s, idx: i }];
      let j = i + 1;
      while (j < steps.length && steps[j].kind === "tip") { subs.push({ step: steps[j], idx: j }); j++; }
      entries.push({ type: "group", id: s.id, title: s.title, icon: stepIconName(s), subs });
      i = j;
    } else {
      entries.push({ type: "single", id: s.id, step: s, idx: i });
      i++;
    }
  }

  const isDoneStatus = (st) => st === "complete" || st === "skipped";
  const entryDone = (e) => e.type === "single"
    ? isDoneStatus(state.steps[e.step.id]?.status)
    : e.subs.every(su => isDoneStatus(state.steps[su.step.id]?.status));

  const total = entries.length;
  const doneCount = entries.filter(entryDone).length;
  const pct = Math.round((doneCount / total) * 100);

  const group = entries.find(e => e.type === "group");
  const groupActive = !!group && group.subs.some(su => su.idx === activeStepIdx);
  const [openGroup, setOpenGroup] = useState(false);
  useEffect(() => { if (groupActive) setOpenGroup(true); }, [groupActive]);

  return (
    <aside className="ob-steps-panel">
      <div className="ob-sp-header">
        <div className="ob-sp-title">Your setup</div>
        <div className="ob-sp-sub">{doneCount} of {total} complete</div>
        <div className="ob-sp-bar"><span style={{ width: `${pct}%` }} /></div>
      </div>
      <div className="ob-sp-list">
        {entries.map((e) => {
          if (e.type === "single") {
            const { step, idx } = e;
            const rawStatus = state.steps[step.id]?.status || "pending";
            const { kind, label } = stepDisplayStatus(step, rawStatus, idx, activeStepIdx, state.steps[step.id]?.data);
            const clickable = idx <= activeStepIdx || rawStatus === "complete" || rawStatus === "skipped";
            const isActive = idx === activeStepIdx;
            return (
              <button
                key={step.id}
                className={`ob-sp-item ob-sp-${kind}${isActive ? " ob-sp-current" : ""}`}
                onClick={() => clickable && onJumpTo(step.id)}
                disabled={!clickable}
              >
                <span className="ob-sp-ic">
                  {kind === "completed" || kind === "verified"
                    ? <OI n="check" s={15} />
                    : <OI n={stepIconName(step)} s={16} />}
                </span>
                <span className="ob-sp-body">
                  <span className="ob-sp-name">{step.title}</span>
                  <span className={`ob-sp-status ob-sp-st-${kind}`}>{label}</span>
                </span>
                {clickable && <span className="ob-sp-chev"><OI n="arrow" s={14} /></span>}
              </button>
            );
          }
          // Grouped "Learn how to use Lanced" entry with expandable subsections
          const done = entryDone(e);
          const active = e.subs.some(su => su.idx === activeStepIdx);
          const kind = done ? "completed" : active ? "attention" : "pending";
          const label = done ? "Completed" : active ? "Need attention" : `${e.subs.length} quick reads`;
          const reachable = e.subs[0].idx <= activeStepIdx || done;
          const open = openGroup && reachable;
          return (
            <div key={e.id} className={`ob-sp-group${open ? " open" : ""}`}>
              <button
                className={`ob-sp-item ob-sp-${kind}${active ? " ob-sp-current" : ""}`}
                onClick={() => reachable && setOpenGroup(o => !o)}
                disabled={!reachable}
                aria-expanded={open}
              >
                <span className="ob-sp-ic">
                  {done ? <OI n="check" s={15} /> : <OI n={e.icon} s={16} />}
                </span>
                <span className="ob-sp-body">
                  <span className="ob-sp-name">{e.title}</span>
                  <span className={`ob-sp-status ob-sp-st-${kind}`}>{label}</span>
                </span>
                {reachable && <span className={`ob-sp-chev ob-sp-chev-toggle${open ? " open" : ""}`}><OI n="chevron" s={16} /></span>}
              </button>
              {open && (
                <div className="ob-sp-subs">
                  {e.subs.map((su) => {
                    const rawStatus = state.steps[su.step.id]?.status || "pending";
                    const ss = stepDisplayStatus(su.step, rawStatus, su.idx, activeStepIdx, state.steps[su.step.id]?.data);
                    const sClickable = su.idx <= activeStepIdx || rawStatus === "complete" || rawStatus === "skipped";
                    const sActive = su.idx === activeStepIdx;
                    const sDone = ss.kind === "completed" || ss.kind === "verified";
                    return (
                      <button
                        key={su.step.id}
                        className={`ob-sp-sub ob-sp-sub-${ss.kind}${sActive ? " ob-sp-sub-current" : ""}`}
                        onClick={() => sClickable && onJumpTo(su.step.id)}
                        disabled={!sClickable}
                      >
                        <span className={`ob-sp-sub-dot${sDone ? " done" : ""}${sActive ? " active" : ""}`}>
                          {sDone ? <OI n="check" s={11} /> : null}
                        </span>
                        <span className="ob-sp-sub-name">{su.step.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

/* ━━━ STATIC MESSAGE (already typed, no animation) ━━━ */
function StaticMessage({ text }) {
  return (
    <div className="ob-msg ob-msg-lanced">
      <LancedMark />
      <div className="ob-msg-bubble">{text}</div>
    </div>
  );
}

/* ━━━ ONBOARDING SIDEBAR (faithful re-creation of the real app sidebar — locked during setup) ━━━ */
const DEFAULT_NAV = [
  { icon: "home", label: "Home" },
  { icon: "inbox", label: "Inbox" },
  { icon: "users", label: "Team" },
  { icon: "chart", label: "Analytics" },
  { icon: "settings", label: "Settings" },
];
function OnboardingSidebar({ config, firstName }) {
  const items = config.navItems && config.navItems.length ? config.navItems : DEFAULT_NAV;
  const [locked, setLocked] = useState(null);
  const timer = useRef(null);

  const flash = (label) => {
    setLocked(label);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLocked(null), 4200);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  const initial = (firstName || "L").trim().charAt(0).toUpperCase();

  return (
    <nav className="sidebar ob-sidebar" aria-label="App navigation (locked during setup)">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sb-mark"><img src="/lanced-logo.svg" alt="Lanced" /></div>
          <div>
            <div className="sb-name">Lanced</div>
            <div className="sb-email">{config.sidebarLabel || config.appName || "App"}</div>
          </div>
        </div>
      </div>

      <div className="sidebar-nav">
        {items.map((it, i) => (
          it.type === "divider"
            ? <div key={`d-${i}`} className="sidebar-divider" />
            : (
              <button
                key={i}
                className={`sidebar-item ob-sidebar-item${locked === it.label ? " ob-sb-buzz" : ""}`}
                onClick={() => flash(it.label)}
              >
                <OI n={it.icon} s={18} />
                <span className="sb-label">{it.label}</span>
                <span className="sb-tip">{it.label}</span>
              </button>
            )
        ))}
      </div>

      <div className="sidebar-acct ob-sidebar-acct" onClick={() => flash("your account")}>
        <div className="sa-avatar ob-sa-avatar">{initial}</div>
        <div className="sa-text" style={{ flex: 1, minWidth: 0 }}>
          <div className="sa-name">{firstName || "Your account"}</div>
          <div className="sa-email">{config.sidebarLabel || config.appName}</div>
        </div>
      </div>

      {locked && createPortal(
        <div className="ob-nav-popup-wrap" onClick={() => setLocked(null)}>
          <div className="ob-nav-popup" onClick={e => e.stopPropagation()}>
            <span className="ob-nav-popup-ic"><OI n="sparkle" s={18} /></span>
            <div className="ob-nav-popup-body">
              <div className="ob-nav-popup-title">Finish your setup first</div>
              <div className="ob-nav-popup-sub">Complete your onboarding to unlock <b>{locked}</b> and the rest of your workspace.</div>
            </div>
            <button className="ob-nav-popup-x" onClick={() => setLocked(null)}>Got it</button>
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
}

/* ━━━ DEFAULT FINAL TIPS (used when a config doesn't supply its own) ━━━ */
const DEFAULT_TIPS = [
  { id: "tip-search", title: "Quick navigation", prompt: "A little tip — press ⌘K (or Ctrl+K) anywhere to jump straight to any section, person, or setting." },
  { id: "tip-help", title: "Help when you need it", prompt: "Ever stuck? The Academy and live chat live in your sidebar — we're always one click away." },
  { id: "tip-mobile", title: "Take it anywhere", prompt: "Lanced works beautifully on mobile too, so you can stay on top of things wherever you are." },
];

/* ━━━ BUILD THE COMBINED FLOW (setup → learning → tips → enter) ━━━ */
function buildFlowSteps(config, state) {
  const existing = state.userType === "existing";
  const dataSteps = config.dataSteps.map(s => ({
    ...s,
    kind: "form",
    // Returning users see a review-and-confirm framing (falls back to the new-user copy).
    intro: existing ? (s.introExisting ?? s.intro) : s.intro,
    prompt: existing ? (s.promptExisting ?? s.prompt) : s.prompt,
    cta: existing ? (s.ctaExisting ?? "Review") : s.cta,
    successMessage: existing ? (s.successMessageExisting ?? s.successMessage) : s.successMessage,
  }));

  const guides = (config.learningSteps || []).filter(ls =>
    ls.purposes.some(p => state.purposes?.includes(p))
  );
  const learningStep = {
    kind: "learning",
    id: "learn-lanced",
    title: "Learn how to use Lanced",
    icon: "star",
    intro: config.learningIntro || "You've got the essentials down. Here are a few quick guides, picked just for you.",
    emptyMessage: config.learningEmpty || "You're all set — no extra guides needed right now. You can always find tutorials in the Academy.",
    guides,
    successMessage: config.learningSuccess || "Nice — you know your way around now.",
  };

  const tips = (config.tips || DEFAULT_TIPS).map(t => ({ ...t, kind: "tip", icon: "sparkle" }));

  const completeStep = {
    kind: "complete",
    id: "enter-lanced",
    title: "Enter Lanced",
    icon: "home",
    prompt: config.completeMessage || "That's everything — your workspace is ready. Welcome aboard.",
    cta: config.completeCta || "Enter Lanced",
  };

  return [...dataSteps, learningStep, ...tips, completeStep];
}

/* ━━━ LEARNING STEP (runs the picked guides as a sub-thread inside the chat) ━━━ */
function LearningStep({ step, state, setState, onDone, scrollToBottom }) {
  const guides = step.guides || [];
  // Resume-safe: skip guides already recorded in state.learning
  const learningMap = state.learning || {};
  const [idx, setIdx] = useState(() => {
    let i = 0;
    while (i < guides.length && learningMap[guides[i].id]) i++;
    return i;
  });
  const [localHist, setLocalHist] = useState(() =>
    guides.filter(g => learningMap[g.id]).map(g => ({
      id: g.id, prompt: g.prompt, mode: learningMap[g.id], label: g.videoTitle || g.cta || "Quick guide",
    }))
  );
  const [msgReady, setMsgReady] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const done = guides.length === 0 || idx >= guides.length;
  const guide = done ? null : guides[idx];

  useEffect(() => { scrollToBottom(); }, [idx, msgReady, showVideo, done, scrollToBottom]);

  const advance = (mode) => {
    if (guide) {
      setLocalHist(h => [...h, { id: guide.id, prompt: guide.prompt, mode, label: guide.videoTitle || guide.cta || "Quick guide" }]);
      setState(prev => ({
        ...prev,
        learning: { ...(prev.learning || {}), [guide.id]: mode },
        learningCompleted: [...new Set([...(prev.learningCompleted || []), guide.id])],
      }));
    }
    setMsgReady(false);
    setShowVideo(false);
    setIdx(i => i + 1);
  };

  return (
    <>
      <StaticMessage text={step.intro} />

      {/* Already-handled guides stay in the thread */}
      {localHist.map(h => (
        <div key={h.id}>
          <StaticMessage text={h.prompt} />
          <ConversationCompleted label={h.mode === "watched" ? `Watched · ${h.label}` : `Skipped · ${h.label}`} />
        </div>
      ))}

      {/* Current guide */}
      {guide && (
        <>
          <ConversationMessage key={guide.id} text={guide.prompt} delay={300} onDone={() => setMsgReady(true)} />
          {msgReady && !showVideo && (
            <div className="ob-msg ob-msg-actions ob-chat-in">
              <button className="ob-action-btn ob-action-primary" onClick={() => setShowVideo(true)}>
                <OI n="play" s={13} /> {guide.cta || "Watch quick guide"}
              </button>
              <button className="ob-action-btn ob-action-secondary" onClick={() => advance("skipped")}>{guide.skipLabel || "I'll explore on my own"}</button>
            </div>
          )}
          {showVideo && (
            <div className="ob-msg ob-msg-video ob-chat-in">
              <div className="ob-video-card">
                <div className="ob-video-frame">
                  {guide.videoSrc ? (
                    <video src={guide.videoSrc} controls autoPlay className="ob-video-el" />
                  ) : (
                    <div className="ob-video-placeholder">
                      <div className="ob-video-play"><OI n="play" s={22} /></div>
                      <div className="ob-video-ph-label">{guide.videoTitle || guide.cta || "Quick guide"}</div>
                      <div className="ob-video-ph-sub">Video coming soon</div>
                    </div>
                  )}
                </div>
                <div className="ob-form-actions">
                  <button className="ob-action-btn ob-action-primary" onClick={() => advance("watched")}>Continue <OI n="arrow" s={14} /></button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* All guides handled → continue into the final tips */}
      {done && (
        <>
          {guides.length === 0 && <StaticMessage text={step.emptyMessage} />}
          <div className="ob-msg ob-msg-actions ob-chat-in">
            <button className="ob-action-btn ob-action-primary" onClick={onDone}>Continue <OI n="arrow" s={14} /></button>
          </div>
        </>
      )}
    </>
  );
}

/* ━━━ MESSAGE + SINGLE CONTINUE (used for tips & the final "enter" step) ━━━ */
function MessageWithContinue({ text, ctaLabel, onContinue, scrollToBottom }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { scrollToBottom(); }, [ready, scrollToBottom]);
  return (
    <>
      <ConversationMessage text={text} delay={300} onDone={() => setReady(true)} />
      {ready && (
        <div className="ob-msg ob-msg-actions ob-chat-in">
          <button className="ob-action-btn ob-action-primary" onClick={onContinue}>{ctaLabel} <OI n="arrow" s={14} /></button>
        </div>
      )}
    </>
  );
}

/* ━━━ HISTORY RENDERER (a completed flow step, frozen in the thread) ━━━ */
function FlowStepHistory({ step, state }) {
  if (step.kind === "form") {
    const status = state.steps[step.id]?.status || "complete";
    return (
      <>
        <ConversationCompleted label={step.title} />
        {status !== "skipped" && step.successMessage && <StaticMessage text={step.successMessage} />}
      </>
    );
  }
  if (step.kind === "learning") {
    const learningMap = state.learning || {};
    return (
      <>
        <StaticMessage text={step.intro} />
        {(step.guides || []).filter(g => learningMap[g.id]).map(g => (
          <div key={g.id}>
            <StaticMessage text={g.prompt} />
            <ConversationCompleted label={learningMap[g.id] === "watched"
              ? `Watched · ${g.videoTitle || g.cta || "Quick guide"}`
              : `Skipped · ${g.videoTitle || g.cta || "Quick guide"}`} />
          </div>
        ))}
        {step.successMessage && <StaticMessage text={step.successMessage} />}
      </>
    );
  }
  if (step.kind === "tip") {
    return <StaticMessage text={step.prompt} />;
  }
  return null;
}

/* ━━━ MAIN CONVERSATION ENGINE (setup + learning + tips + enter — one continuous chat) ━━━ */
function OnboardingConversation({ config, state, setState, onComplete, firstName }) {
  const scrollRef = useRef(null);
  const anchorRef = useRef(null);
  const flowSteps = buildFlowSteps(config, state);

  const firstUnfinished = () => {
    const idx = config.dataSteps.findIndex(s => {
      const st = state.steps[s.id]?.status;
      return !st || st === "pending" || st === "in-progress";
    });
    return idx >= 0 ? idx : 0;
  };

  const [activeStepIdx, setActiveStepIdx] = useState(firstUnfinished);
  const [phase, setPhase] = useState("intro");
  const [showForm, setShowForm] = useState(false);
  const [returnIdx, setReturnIdx] = useState(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const [formData, setFormData] = useState(() => {
    const step = flowSteps[activeStepIdx];
    return { ...(step?.defaults || {}), ...(state.steps[step?.id]?.data || {}) };
  });
  const isEditing = returnIdx !== null;

  // Keep the newest content comfortably centered. Like a chat thread: messages fill
  // downward, and once the latest content drops past ~75% of the viewport (≈25% from the
  // bottom) we glide it back up so it sits around 60% — never glued to the bottom edge.
  const recenter = useCallback((force = false) => {
    const c = scrollRef.current, a = anchorRef.current;
    if (!c || !a) return;
    const cRect = c.getBoundingClientRect();
    const aRect = a.getBoundingClientRect();
    const anchorFromTop = aRect.top - cRect.top;       // anchor's current position in the viewport
    const triggerAt = c.clientHeight * 0.75;            // 25% from the bottom
    if (!force && anchorFromTop <= triggerAt) return;   // still comfortably in view — leave it
    const target = (anchorFromTop + c.scrollTop) - c.clientHeight * 0.6;
    c.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  }, []);

  // Kept name for the many child callsites; now recenters instead of slamming to the bottom.
  const scrollToBottom = useCallback(() => {
    setTimeout(() => recenter(false), 120);
  }, [recenter]);

  useEffect(() => { const t = setTimeout(() => recenter(false), 140); return () => clearTimeout(t); }, [phase, showForm, activeStepIdx, recenter]);

  // React to content growth (typewriter reveals, forms expanding, new messages) so the
  // newest line is nudged up the moment it crosses the threshold — no manual scrolling.
  useEffect(() => {
    const inner = scrollRef.current?.querySelector(".ob-conversation-inner");
    if (!inner || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => recenter(false));
    ro.observe(inner);
    return () => ro.disconnect();
  }, [recenter]);

  const currentStep = flowSteps[activeStepIdx];
  const isLastStep = activeStepIdx >= flowSteps.length - 1;
  const historySteps = flowSteps.slice(0, activeStepIdx);

  const handleFormChange = (field, value) => {
    setFormData(d => ({ ...d, [field]: value }));
  };

  const goToStep = (idx) => {
    const step = flowSteps[idx];
    const st = state.steps[step?.id]?.status;
    const alreadyDone = st === "complete" || st === "skipped";
    setActiveStepIdx(idx);
    setFormData({ ...(step?.defaults || {}), ...(state.steps[step?.id]?.data || {}) });
    // Revisiting a finished form → open it straight away for editing
    const isForm = (step?.kind || "form") === "form";
    setShowForm(isForm && alreadyDone);
    setPhase(isForm && alreadyDone ? "form" : "intro");
  };

  // Mark a step done in state, then move on (or finish)
  const advanceStep = (status = "complete", data = null) => {
    const stepId = currentStep.id;
    setState(prev => ({
      ...prev,
      steps: { ...prev.steps, [stepId]: { status, data: status === "skipped" ? null : data } },
    }));

    if (status === "complete" && currentStep.kind === "form") setConfettiKey(k => k + 1);

    // If editing an earlier step, jump back to where we left off
    if (isEditing && returnIdx > activeStepIdx) {
      const ret = returnIdx;
      setReturnIdx(null);
      goToStep(ret);
      return;
    }
    setReturnIdx(null);

    if (isLastStep) {
      onComplete();
      return;
    }
    goToStep(activeStepIdx + 1);
  };

  const handleJumpTo = (stepId) => {
    const idx = flowSteps.findIndex(s => s.id === stepId);
    if (idx < 0 || idx === activeStepIdx) return;
    if (idx < activeStepIdx) setReturnIdx(prev => Math.max(prev ?? 0, activeStepIdx));
    else setReturnIdx(null);
    goToStep(idx);
  };

  return (
    <div className="ob-conversation-layout">
      {confettiKey > 0 && <ConfettiBurst key={confettiKey} />}
      {currentStep?.kind === "complete" && <ConfettiBurst key={`done-${activeStepIdx}`} />}
      <div className="ob-conversation-main">
      <div className="ob-conversation-area" ref={scrollRef}>
        <div className="ob-conversation-inner">
          {/* Everything already done stays frozen in the thread */}
          {historySteps.map(s => (
            <div key={s.id}><FlowStepHistory step={s} state={state} /></div>
          ))}

          {/* The active step */}
          {currentStep && currentStep.kind === "form" && (
            <>
              {currentStep.intro && (
                <ConversationMessage
                  key={`intro-${currentStep.id}`}
                  text={currentStep.intro}
                  delay={historySteps.length > 0 ? 200 : 400}
                  onDone={() => { if (phase === "intro") setPhase("prompt"); }}
                />
              )}
              {(phase === "prompt" || phase === "action" || phase === "form" || !currentStep.intro) && (
                <ConversationMessage
                  key={`prompt-${currentStep.id}`}
                  text={currentStep.prompt}
                  delay={currentStep.intro ? 300 : (historySteps.length > 0 ? 200 : 400)}
                  onDone={() => { if (phase === "prompt" || phase === "intro") setPhase("action"); }}
                />
              )}
              {(phase === "action" || phase === "form") && !showForm && (
                <ConversationAction
                  key={`action-${currentStep.id}`}
                  label={currentStep.cta || "Let's do it"}
                  onClick={() => { setShowForm(true); setPhase("form"); }}
                  secondary={currentStep.skippable}
                  secondaryLabel={currentStep.skipLabel || "Skip for now"}
                  onSecondary={() => advanceStep("skipped")}
                  delay={200}
                />
              )}
              {showForm && (
                <ConversationFormStep
                  key={`form-${currentStep.id}`}
                  step={currentStep}
                  data={formData}
                  onChange={handleFormChange}
                  onSubmit={() => advanceStep("complete", formData)}
                  onSkip={() => advanceStep("skipped")}
                  isEditing={isEditing}
                  onCancel={isEditing ? () => { const r = returnIdx; setReturnIdx(null); goToStep(r); } : null}
                />
              )}
            </>
          )}

          {currentStep && currentStep.kind === "learning" && (
            <LearningStep
              key={`learning-${currentStep.id}`}
              step={currentStep}
              state={state}
              setState={setState}
              onDone={() => advanceStep("complete")}
              scrollToBottom={scrollToBottom}
            />
          )}

          {currentStep && currentStep.kind === "tip" && (
            <MessageWithContinue
              key={`tip-${currentStep.id}`}
              text={currentStep.prompt}
              ctaLabel="Got it"
              onContinue={() => advanceStep("complete")}
              scrollToBottom={scrollToBottom}
            />
          )}

          {currentStep && currentStep.kind === "complete" && (
            <MessageWithContinue
              key={`complete-${currentStep.id}`}
              text={currentStep.prompt}
              ctaLabel={currentStep.cta}
              onContinue={() => advanceStep("complete")}
              scrollToBottom={scrollToBottom}
            />
          )}
          <div ref={anchorRef} className="ob-conversation-anchor" aria-hidden="true" />
        </div>
      </div>
      </div>

      <OnboardingStepsPanel steps={flowSteps} state={state} activeStepIdx={activeStepIdx} onJumpTo={handleJumpTo} />
    </div>
  );
}

/* ━━━ MAIN ONBOARDING GATE ━━━ */
export default function UniversalOnboarding({ config, state, setState, onComplete, firstName, embedded = false }) {
  if (!state) return null;

  const handleWelcomeContinue = () => {
    setState(prev => ({ ...prev, stage: "purpose" }));
  };

  const handlePurposeSelect = (id) => {
    setState(prev => ({
      ...prev,
      purposes: prev.purposes?.includes(id) ? prev.purposes.filter(p => p !== id) : [...(prev.purposes || []), id],
    }));
  };

  const handlePurposeContinue = () => {
    setState(prev => ({ ...prev, stage: "conversation" }));
  };

  const handleConversationComplete = () => {
    setState(prev => ({ ...prev, stage: "complete" }));
    if (onComplete) onComplete();
  };

  return (
    <div className={embedded ? `ob-root ob-embedded${(state.stage === "welcome" || state.stage === "purpose") ? " ob-fullscreen" : ""}` : "ob-root"}>
      <style>{ONBOARDING_CSS}</style>

      {/* Single, persistent motion background — mounted once at the root so it never
          resets between stages (welcome → purpose → conversation). Elements slide in/out
          over one continuous field. */}
      <OnboardingBlobBg />

      {state.stage === "welcome" && (
        <OnboardingWelcome
          config={config}
          firstName={firstName}
          userType={state.userType}
          onContinue={handleWelcomeContinue}
        />
      )}

      {state.stage === "purpose" && (
        <OnboardingPurpose
          config={config}
          selected={state.purposes || []}
          onSelect={handlePurposeSelect}
          onContinue={handlePurposeContinue}
        />
      )}

      {(state.stage === "conversation" || state.stage === "learning") && (
        <OnboardingConversation
          config={config}
          state={state}
          setState={setState}
          onComplete={handleConversationComplete}
          firstName={firstName}
        />
      )}
    </div>
  );
}

/* ━━━ HELPER: Create initial state ━━━ */
export function createOnboardingState(config, userType = "new", firstName = "") {
  // Returning users (the "What's New" / 2.0 flow) get their existing data pre-filled from a stored
  // profile, so the steps become a quick review-and-confirm rather than blank forms.
  const profile = userType === "existing" ? config.existingProfile : null;
  const steps = {};
  config.dataSteps.forEach(s => {
    const data = profile && typeof s.mapFromProfile === "function" ? s.mapFromProfile(profile) : null;
    steps[s.id] = { status: "pending", data: data && Object.keys(data).length ? data : null };
  });
  return {
    userType,
    firstName,
    stage: "welcome",
    purposes: profile?.purposes ? [...profile.purposes] : [],
    steps,
    learningCompleted: [],
    dismissed: false,
  };
}

/* ━━━ CSS ━━━ */
const ONBOARDING_CSS = `
/* ── Root ── */
.ob-root{position:fixed;inset:0;z-index:200;background:var(--bg);font-family:var(--sans);color:var(--tx);display:flex;flex-direction:column;overflow:hidden}
/* Embedded mode — onboarding lives inside the real app's .main (real sidebar stays visible) */
.ob-embedded{position:fixed;top:0;right:0;bottom:0;left:var(--sb-wc,64px);z-index:80;overflow:hidden}
/* Welcome + purpose: cinematic full-screen takeover (covers the sidebar) within the SAME mount,
   so the motion background carries straight through into the embedded conversation with no reset. */
.ob-embedded.ob-fullscreen{left:0;z-index:200}
.ob-main-host{position:relative}
.ob-embedded .ob-conversation-layout{padding-left:0}

/* ── Brush Background (matches the auth/login page — animated brush-stroke sweeps) ── */
/* Soft off-white greyish base — never goes fully white anywhere, so cards/text stay legible.
   The mask is a gentle vignette that keeps ~85% opacity at the edges (no hard white corners). */
.ob-brush-field{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;background:#ecebf2;--brush-intensity:0.7;-webkit-mask-image:radial-gradient(ellipse at center,#000 50%,rgba(0,0,0,.85) 100%);mask-image:radial-gradient(ellipse at center,#000 50%,rgba(0,0,0,.85) 100%)}
.dark .ob-brush-field{background:var(--bg)}
.ob-brush{position:absolute;top:50%;left:50%;background-repeat:no-repeat;background-size:100% 100%;background-position:center;opacity:0;will-change:transform,opacity;transform:translate3d(-50%,-50%,0);border-radius:50%;filter:blur(40px) saturate(1.5) contrast(1.15);mix-blend-mode:multiply}
.dark .ob-brush{mix-blend-mode:screen}
.ob-brush.a{background-image:radial-gradient(ellipse 60% 45% at 50% 50%,color-mix(in oklab,var(--ac) 95%,transparent) 0%,color-mix(in oklab,var(--ac) 70%,transparent) 35%,color-mix(in oklab,var(--ac) 25%,transparent) 65%,transparent 80%)}
.ob-brush.b{background-image:radial-gradient(ellipse 70% 40% at 45% 55%,color-mix(in oklab,var(--ac) 90%,transparent) 0%,color-mix(in oklab,var(--ac) 60%,transparent) 40%,color-mix(in oklab,var(--ac) 20%,transparent) 70%,transparent 82%)}
.ob-brush.c{background-image:radial-gradient(ellipse 55% 50% at 55% 45%,color-mix(in oklab,var(--ac) 95%,transparent) 0%,color-mix(in oklab,var(--ac) 65%,transparent) 38%,color-mix(in oklab,var(--ac) 25%,transparent) 68%,transparent 80%)}
.ob-brush.d{background-image:radial-gradient(ellipse 65% 35% at 50% 50%,color-mix(in oklab,var(--ac) 85%,transparent) 0%,color-mix(in oklab,var(--ac) 55%,transparent) 42%,color-mix(in oklab,var(--ac) 20%,transparent) 72%,transparent 85%)}
.ob-brush.e{background-image:radial-gradient(ellipse 60% 60% at 50% 50%,color-mix(in oklab,var(--ac) 80%,transparent) 0%,color-mix(in oklab,var(--ac) 40%,transparent) 45%,transparent 78%)}
.ob-brush.f{background-image:radial-gradient(ellipse 65% 55% at 50% 50%,color-mix(in oklab,var(--ac) 75%,transparent) 0%,color-mix(in oklab,var(--ac) 35%,transparent) 50%,transparent 80%)}
.ob-brush-grain{position:absolute;inset:-10%;pointer-events:none;opacity:.28;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")}
@keyframes ob-sweep-a{0%{transform:translate3d(-90%,-40%,0) rotate(-8deg) scale(1.05);opacity:0}15%{opacity:calc(0.85 * var(--brush-intensity))}50%{transform:translate3d(0%,-10%,0) rotate(4deg) scale(1.25);opacity:calc(1 * var(--brush-intensity))}85%{opacity:calc(0.7 * var(--brush-intensity))}100%{transform:translate3d(90%,20%,0) rotate(12deg) scale(1.1);opacity:0}}
@keyframes ob-sweep-b{0%{transform:translate3d(80%,30%,0) rotate(8deg) scale(1.1);opacity:0}20%{opacity:calc(0.8 * var(--brush-intensity))}50%{transform:translate3d(-10%,10%,0) rotate(-6deg) scale(1.3);opacity:calc(1 * var(--brush-intensity))}80%{opacity:calc(0.75 * var(--brush-intensity))}100%{transform:translate3d(-100%,40%,0) rotate(-14deg) scale(1.15);opacity:0}}
@keyframes ob-sweep-c{0%{transform:translate3d(-80%,50%,0) rotate(-4deg) scale(0.95);opacity:0}18%{opacity:calc(0.85 * var(--brush-intensity))}50%{transform:translate3d(20%,30%,0) rotate(6deg) scale(1.2);opacity:calc(0.95 * var(--brush-intensity))}82%{opacity:calc(0.75 * var(--brush-intensity))}100%{transform:translate3d(100%,60%,0) rotate(14deg) scale(1.05);opacity:0}}
@keyframes ob-sweep-d{0%{transform:translate3d(80%,-50%,0) rotate(10deg) scale(1.0);opacity:0}20%{opacity:calc(0.75 * var(--brush-intensity))}50%{transform:translate3d(0%,0%,0) rotate(-8deg) scale(1.25);opacity:calc(0.9 * var(--brush-intensity))}80%{opacity:calc(0.7 * var(--brush-intensity))}100%{transform:translate3d(-90%,30%,0) rotate(-18deg) scale(1.1);opacity:0}}
@keyframes ob-sweep-e{0%{transform:translate3d(-70%,-70%,0) rotate(15deg) scale(0.9);opacity:0}20%{opacity:calc(0.7 * var(--brush-intensity))}50%{transform:translate3d(30%,-50%,0) rotate(-10deg) scale(1.15);opacity:calc(0.85 * var(--brush-intensity))}80%{opacity:calc(0.65 * var(--brush-intensity))}100%{transform:translate3d(110%,-30%,0) rotate(-22deg) scale(1.0);opacity:0}}
@keyframes ob-sweep-f{0%{transform:translate3d(60%,70%,0) rotate(-12deg) scale(1.0);opacity:0}22%{opacity:calc(0.7 * var(--brush-intensity))}50%{transform:translate3d(-20%,50%,0) rotate(8deg) scale(1.2);opacity:calc(0.9 * var(--brush-intensity))}80%{opacity:calc(0.6 * var(--brush-intensity))}100%{transform:translate3d(-100%,30%,0) rotate(20deg) scale(1.05);opacity:0}}
.ob-brush.a{width:80%;aspect-ratio:16/9;animation:ob-sweep-a 32s linear infinite}
.ob-brush.b{width:70%;aspect-ratio:5/3;animation:ob-sweep-b 44s linear infinite;animation-delay:-10s}
.ob-brush.c{width:90%;aspect-ratio:16/9;animation:ob-sweep-c 38s linear infinite;animation-delay:-22s}
.ob-brush.d{width:65%;aspect-ratio:4/3;animation:ob-sweep-d 50s linear infinite;animation-delay:-16s}
.ob-brush.e{width:55%;aspect-ratio:1/1;animation:ob-sweep-e 56s linear infinite;animation-delay:-28s}
.ob-brush.f{width:60%;aspect-ratio:6/5;animation:ob-sweep-f 48s linear infinite;animation-delay:-8s}
@media(prefers-reduced-motion:reduce){.ob-brush{animation:none!important;opacity:.6!important;transform:translate3d(-50%,-50%,0)!important}}

/* ── Welcome Screen ── */
.ob-welcome{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden}
.ob-welcome-content{position:relative;z-index:1;text-align:center;max-width:min(1100px,94vw);padding:40px}
.ob-welcome-line{font-size:clamp(26px,3.6vw,42px);font-weight:300;line-height:1.22;margin-bottom:6px;letter-spacing:-.02em;color:var(--tx);min-height:1.2em;white-space:nowrap}
.ob-welcome-hero{font-size:clamp(30px,4.4vw,50px);font-weight:400;letter-spacing:-.03em;color:var(--tx)}
.ob-welcome-brand{font-size:clamp(38px,5.6vw,64px);font-weight:500;letter-spacing:-.035em;line-height:1.06;margin-bottom:16px;background:linear-gradient(120deg,var(--ac) 0%,#8B7AFF 55%,#A294FF 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.ob-welcome-tagline{font-size:clamp(15px,1.7vw,20px);font-weight:300;letter-spacing:.01em;line-height:1.5;color:var(--g4);max-width:none;margin:14px auto 4px;white-space:nowrap}
.ob-welcome-line.ob-fade-up{animation:ob-welcome-rise .9s cubic-bezier(.16,1,.3,1) both}
@keyframes ob-welcome-rise{from{opacity:0;transform:translateY(26px);filter:blur(6px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
.ob-welcome-cta{display:inline-flex;align-items:center;gap:8px;padding:13px 30px;background:linear-gradient(135deg,#7A66FF,#4A35E0);color:#fff;border:none;border-radius:14px;font-family:var(--sans);font-size:15px;font-weight:500;cursor:pointer;margin-top:30px;transition:transform .2s,box-shadow .2s}
.ob-welcome-cta:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(96,77,255,.3)}

/* ── Typewriter Cursor ── */
.ob-cursor{display:inline-block;width:2px;height:.85em;background:var(--ac);margin-left:2px;vertical-align:middle;animation:ob-blink 1s step-end infinite}
.ob-cursor-sm{height:.7em;width:1.5px}
@keyframes ob-blink{0%,100%{opacity:1}50%{opacity:0}}

/* ── Fade Up Animation ── */
.ob-fade-up{opacity:0;transform:translateY(20px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)}
.ob-fade-up.ob-visible{opacity:1;transform:translateY(0)}

/* ── Purpose Selection ── */
.ob-purpose{position:relative;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;overflow-y:auto}
.ob-purpose-content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;width:100%}
.ob-purpose-header{font-size:clamp(24px,3.6vw,38px);font-weight:400;text-align:center;margin-bottom:8px;letter-spacing:-.025em;color:var(--tx);min-height:1.4em}
.ob-purpose-typed{display:inline}
.ob-purpose-sub{font-size:14px;font-weight:300;color:var(--g4);margin-bottom:32px;transition:opacity .5s}
.ob-purpose-grid{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;max-width:680px}
.ob-purpose-grid:not(.ob-show) .ob-purpose-card{opacity:0;transform:translateY(16px)}
.ob-purpose-grid.ob-show .ob-purpose-card{animation:ob-card-in .4s cubic-bezier(.16,1,.3,1) forwards;animation-delay:var(--d,0ms)}
.ob-purpose-card{position:relative;display:flex;align-items:center;gap:10px;padding:12px 20px;background:rgba(255,255,255,.6);-webkit-backdrop-filter:blur(40px);backdrop-filter:blur(40px);border:1px solid rgba(255,255,255,.65);border-radius:14px;font-family:var(--sans);font-size:14px;font-weight:500;color:var(--tx);cursor:pointer;transition:border-color .2s,background .2s,box-shadow .2s;opacity:0;box-shadow:0 4px 18px rgba(122,102,255,.05)}
.ob-purpose-card:hover{border-color:color-mix(in oklab,var(--ac) 50%,transparent);box-shadow:0 4px 18px rgba(96,77,255,.12)}
.ob-purpose-card.ob-selected{border-color:var(--ac);background:rgba(96,77,255,.08)}
.ob-purpose-icon{display:flex;align-items:center;color:var(--ac)}
.ob-purpose-label{white-space:nowrap}
.ob-purpose-check{position:absolute;top:-6px;right:-6px;width:22px;height:22px;background:var(--ac);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;animation:ob-pop .25s cubic-bezier(.16,1,.3,1)}
.ob-purpose-continue{display:inline-flex;align-items:center;gap:8px;padding:13px 30px;background:linear-gradient(135deg,#7A66FF,#4A35E0);color:#fff;border:none;border-radius:14px;font-family:var(--sans);font-size:15px;font-weight:500;cursor:pointer;margin-top:40px;transition:transform .2s,box-shadow .2s}
.ob-purpose-continue:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(96,77,255,.3)}
@keyframes ob-card-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes ob-pop{from{transform:scale(0)}to{transform:scale(1)}}

/* ── Conversation Layout (sits to the right of the fixed app sidebar) ── */
.ob-conversation-layout{position:relative;width:100%;height:100%;display:flex;flex-direction:row;overflow:hidden;padding-left:var(--sb-w,240px)}
.ob-conversation-main{position:relative;z-index:1;flex:1;min-width:0;display:flex;flex-direction:column;overflow:hidden}
/* Block (not flex) scroll container: a flex parent stretches the inner to the container's
   height (align-items:stretch), so the inner's tall padding-bottom overflows the flex item
   instead of becoming real scroll room — the newest message then can't be lifted off the
   bottom. Block layout + margin-auto centering lets scrollHeight honor the full inner height
   (content + breathing room), so auto-recenter can pull the latest line up to ~60%. */
.ob-conversation-area{position:relative;z-index:1;flex:1;overflow-y:auto;padding:48px 28px 0}
.ob-conversation-inner{width:100%;max-width:640px;margin:0 auto;display:flex;flex-direction:column;gap:16px;padding-bottom:42vh}

/* ── Onboarding Sidebar (real .sidebar classes; locked during setup) ── */
.ob-sidebar{animation:ob-rail-in .5s cubic-bezier(.16,1,.3,1)}
@keyframes ob-rail-in{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
.ob-sidebar-item{cursor:pointer}
.ob-sb-buzz{animation:ob-nav-buzz .4s}
@keyframes ob-nav-buzz{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-3px)}40%,80%{transform:translateX(3px)}}
.ob-sa-avatar{display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;color:#fff;background:linear-gradient(135deg,#7A66FF,#4A35E0)}
.ob-sidebar-acct{cursor:pointer}

/* ── Nav Lock Popup (slides up from below) ── */
.ob-nav-popup-wrap{position:fixed;left:0;right:0;bottom:0;z-index:320;display:flex;justify-content:center;padding:0 16px 26px;pointer-events:none}
.ob-nav-popup{pointer-events:auto;display:flex;align-items:center;gap:14px;max-width:440px;width:100%;padding:14px 16px;background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(48px);backdrop-filter:blur(48px);border:1px solid rgba(255,255,255,.65);border-radius:16px;box-shadow:0 16px 50px rgba(20,18,40,.18),0 3px 10px rgba(20,18,40,.08);animation:ob-popup-up .42s cubic-bezier(.16,1,.3,1)}
@keyframes ob-popup-up{from{opacity:0;transform:translateY(120%)}to{opacity:1;transform:translateY(0)}}
.ob-nav-popup-ic{width:38px;height:38px;flex-shrink:0;border-radius:11px;display:flex;align-items:center;justify-content:center;background:color-mix(in oklab,var(--ac) 14%,transparent);color:var(--ac)}
.ob-nav-popup-body{flex:1;min-width:0}
.ob-nav-popup-title{font-size:14px;font-weight:600;letter-spacing:-.01em}
.ob-nav-popup-sub{font-size:13px;font-weight:300;color:var(--g4);margin-top:1px;line-height:1.4}
.ob-nav-popup-x{flex-shrink:0;padding:8px 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#7A66FF,#4A35E0);color:#fff;font-family:var(--sans);font-size:13px;font-weight:500;cursor:pointer;transition:transform .15s}
.ob-nav-popup-x:hover{transform:translateY(-1px)}

/* ── Chat Messages ── */
.ob-msg{display:flex;gap:10px;align-items:flex-start}
.ob-msg-lanced{align-items:flex-start}
.ob-msg-avatar{width:34px;height:34px;border-radius:10px;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 14px rgba(96,77,255,.18);border:1px solid color-mix(in oklab,var(--g2) 80%,transparent)}
.ob-msg-avatar svg{display:block}
.ob-msg-bubble{background:rgba(255,255,255,.58);-webkit-backdrop-filter:blur(28px) saturate(1.3);backdrop-filter:blur(28px) saturate(1.3);border:1px solid rgba(255,255,255,.6);border-radius:3px 18px 18px 18px;padding:14px 18px;font-size:15px;font-weight:400;line-height:1.55;max-width:80%;box-shadow:0 6px 22px rgba(122,102,255,.06),0 1px 2px rgba(20,18,40,.03)}

/* ── Chat Entrance Animation ── */
.ob-chat-in{animation:ob-chat-enter .35s cubic-bezier(.16,1,.3,1)}
@keyframes ob-chat-enter{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

/* ── Action Buttons ── */
.ob-msg-actions{padding-left:42px;display:flex;gap:8px;flex-wrap:wrap}
.ob-action-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:12px;font-family:var(--sans);font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;border:none}
.ob-action-primary{background:linear-gradient(135deg,var(--ac),#604DFF);color:#fff}
.ob-action-primary:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(96,77,255,.25)}
.ob-action-secondary{background:var(--sf);color:var(--g5);border:1px solid var(--g2)}
.ob-action-secondary:hover{border-color:var(--g3);color:var(--tx)}

/* ── Form Card ── */
.ob-msg-form{padding-left:42px;width:100%}
.ob-form-card{background:rgba(255,255,255,.66);-webkit-backdrop-filter:blur(48px) saturate(1.4);backdrop-filter:blur(48px) saturate(1.4);border:1px solid rgba(255,255,255,.65);border-radius:22px;padding:26px 28px;max-width:660px;width:100%;animation:ob-form-expand .35s cubic-bezier(.16,1,.3,1);box-shadow:0 10px 40px rgba(122,102,255,.08),0 2px 6px rgba(20,18,40,.03)}
@keyframes ob-form-expand{from{opacity:0;transform:scale(.97) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
.ob-form-sheet{animation:ob-form-sheet-up .42s cubic-bezier(.16,1,.3,1)}
@keyframes ob-form-sheet-up{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
.ob-form-card .ob-field{margin-bottom:16px}
.ob-form-card .ob-field:last-of-type{margin-bottom:20px}
.ob-form-card .ob-field label{display:block;font-size:12px;font-weight:600;color:var(--g5);margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em}
.ob-form-card .ob-field input,.ob-form-card .ob-field select,.ob-form-card .ob-field textarea{width:100%;padding:11px 15px;border:1px solid rgba(0,0,0,.07);border-radius:12px;font-family:var(--sans);font-size:14px;background:rgba(255,255,255,.55);color:var(--tx);transition:border-color .2s,box-shadow .2s,background .2s;outline:none}
.ob-form-card .ob-field input:focus,.ob-form-card .ob-field select:focus,.ob-form-card .ob-field textarea:focus{border-color:#7A66FF;background:rgba(255,255,255,.8);box-shadow:0 0 0 3px rgba(122,102,255,.08)}
.ob-form-card .ob-field label{font-weight:500}
.ob-form-card .ob-field input.ob-error,.ob-form-card .ob-field select.ob-error{border-color:var(--red)}
.ob-form-card .ob-field .ob-field-error{font-size:12px;color:var(--red);margin-top:4px}
.ob-form-card .ob-field textarea{min-height:80px;resize:vertical}
.ob-form-actions{display:flex;gap:8px;flex-wrap:wrap}

/* ── In-form interactive selectors (artist types / styles) ── */
.ob-pick-grid{display:flex;flex-wrap:wrap;gap:10px}
.ob-pick-card{position:relative;display:flex;align-items:center;gap:9px;padding:11px 16px;background:var(--bg);border:1.5px solid var(--g2);border-radius:13px;font-family:var(--sans);font-size:14px;font-weight:500;color:var(--tx);cursor:pointer;transition:border-color .18s,background .18s,box-shadow .18s,transform .18s;animation:ob-card-in .38s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0ms)}
.ob-pick-card:hover{border-color:var(--ac);box-shadow:0 2px 12px rgba(96,77,255,.1)}
.ob-pick-card.ob-on{border-color:var(--ac);background:rgba(96,77,255,.07)}
.ob-pick-ic{font-size:19px;line-height:1}
.ob-pick-chk{position:absolute;top:-6px;right:-6px;width:20px;height:20px;background:var(--ac);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;animation:ob-pop .25s cubic-bezier(.16,1,.3,1)}
.ob-styles-reveal{animation:ob-form-expand .4s cubic-bezier(.16,1,.3,1)}
.ob-style-chip{padding:7px 14px;border-radius:20px;font-size:13px;font-weight:500;cursor:pointer;border:1.5px solid var(--g2);background:transparent;color:var(--g5);font-family:var(--sans);transition:all .16s;animation:ob-card-in .34s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0ms)}
.ob-style-chip:hover{border-color:var(--ac);color:var(--ac)}
.ob-style-chip.ob-on{border-color:var(--ac);background:rgba(96,77,255,.08);color:var(--ac)}

/* ── In-form plan cards ── */
.ob-plan-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.ob-plan-card{position:relative;display:flex;flex-direction:column;text-align:left;padding:18px 16px;border-radius:16px;border:1.5px solid var(--g2);background:var(--bg);cursor:pointer;font-family:var(--sans);transition:border-color .2s,box-shadow .2s,transform .2s}
.ob-plan-card:hover{border-color:color-mix(in oklab,var(--ac) 55%,var(--g2));transform:translateY(-2px)}
.ob-plan-card.ob-on{border-color:var(--ac);background:rgba(96,77,255,.05);box-shadow:0 8px 24px rgba(96,77,255,.14)}
.ob-plan-badge{position:absolute;top:-10px;left:16px;background:var(--ac);color:#fff;font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:3px 9px;border-radius:20px}
.ob-plan-name{font-size:15px;font-weight:700;color:var(--tx)}
.ob-plan-tagline{font-size:11.5px;color:var(--g4);line-height:1.4;margin-top:3px;min-height:30px}
.ob-plan-price{font-size:22px;font-weight:800;margin-top:8px;letter-spacing:-.02em}
.ob-plan-price span{font-size:12px;font-weight:600;color:var(--g4)}
.ob-plan-div{height:1px;background:var(--g2);margin:12px 0}
.ob-plan-feat{display:flex;align-items:flex-start;gap:7px;font-size:11.5px;color:var(--g5);line-height:1.45;margin-bottom:6px}
.ob-plan-feat svg{flex-shrink:0;margin-top:2px}
.ob-plan-pick{margin-top:auto;padding-top:12px;font-size:12px;font-weight:700;color:var(--ac);display:flex;align-items:center;gap:6px}
.dark .ob-plan-card,.dark .ob-pick-card{background:var(--g1);border-color:var(--g3)}
.dark .ob-plan-card.ob-on,.dark .ob-pick-card.ob-on{background:rgba(122,102,255,.1);border-color:var(--ac)}
@media(max-width:680px){.ob-plan-grid{grid-template-columns:1fr}}

/* ── Completed Step Marker ── */
.ob-msg-done{display:flex;align-items:center;gap:8px;padding:6px 0;color:var(--green);font-size:13px;font-weight:500}
.ob-done-check{width:24px;height:24px;background:rgba(29,185,84,.12);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--green)}
.ob-done-label{color:var(--g4)}

/* ── Steps Panel (always-visible right rail) ── */
.ob-steps-panel{position:sticky;top:18px;z-index:2;width:320px;flex-shrink:0;align-self:flex-start;display:flex;flex-direction:column;margin:18px 18px 18px 4px;max-height:calc(100% - 36px);border-radius:22px;background:rgba(255,255,255,.62);-webkit-backdrop-filter:blur(48px) saturate(1.4);backdrop-filter:blur(48px) saturate(1.4);border:1px solid rgba(255,255,255,.65);box-shadow:0 18px 50px rgba(20,18,40,.12),0 3px 10px rgba(20,18,40,.05);overflow-y:auto;animation:ob-panel-in .5s cubic-bezier(.16,1,.3,1)}
@keyframes ob-panel-in{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
.ob-sp-header{padding:24px 22px 16px;position:sticky;top:0;z-index:1;background:rgba(255,255,255,.45);-webkit-backdrop-filter:blur(40px) saturate(1.3);backdrop-filter:blur(40px) saturate(1.3);border-bottom:1px solid rgba(255,255,255,.45)}
.ob-sp-title{font-size:16px;font-weight:600;letter-spacing:-.01em}
.ob-sp-sub{font-size:12.5px;color:var(--g4);margin-top:3px}
.ob-sp-bar{margin-top:12px;height:5px;border-radius:3px;background:var(--g2);overflow:hidden}
.ob-sp-bar span{display:block;height:100%;border-radius:3px;background:linear-gradient(90deg,var(--ac),#8B7AFF);transition:width .5s cubic-bezier(.16,1,.3,1)}
.ob-sp-list{display:flex;flex-direction:column;gap:6px;padding:14px 14px 24px}
.ob-sp-item{display:flex;align-items:center;gap:12px;padding:12px 12px;border-radius:13px;background:none;border:1px solid transparent;font-family:var(--sans);cursor:pointer;transition:background .16s,border-color .16s,transform .12s;text-align:left;width:100%;color:var(--tx)}
.ob-sp-item:not(:disabled):hover{background:color-mix(in oklab,var(--g1) 70%,transparent);border-color:color-mix(in oklab,var(--g2) 70%,transparent)}
.ob-sp-item:disabled{cursor:default;opacity:.62}
.ob-sp-current{background:color-mix(in oklab,var(--ac) 8%,transparent)!important;border-color:color-mix(in oklab,var(--ac) 35%,transparent)!important}
.ob-sp-ic{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:var(--g1);color:var(--g5)}
.ob-sp-completed .ob-sp-ic,.ob-sp-verified .ob-sp-ic{background:color-mix(in oklab,var(--green) 16%,transparent);color:var(--green)}
.ob-sp-attention .ob-sp-ic{background:color-mix(in oklab,#E8973A 18%,transparent);color:#E8973A}
.ob-sp-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.ob-sp-name{font-size:14px;font-weight:600;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ob-sp-status{font-size:12px;font-weight:600;letter-spacing:.01em}
.ob-sp-st-completed,.ob-sp-st-verified{color:var(--green)}
.ob-sp-st-attention{color:#E8973A}
.ob-sp-st-skipped{color:var(--g4)}
.ob-sp-st-pending{color:var(--g3)}
.ob-sp-chev{color:var(--g3);flex-shrink:0;display:flex;align-items:center}
.ob-sp-current .ob-sp-chev{color:var(--ac)}
.ob-sp-chev-toggle{transition:transform .22s cubic-bezier(.4,0,.2,1)}
.ob-sp-chev-toggle.open{transform:rotate(180deg)}
/* Grouped "Learn how to use Lanced" subsections */
.ob-sp-group{display:flex;flex-direction:column}
.ob-sp-subs{display:flex;flex-direction:column;gap:2px;margin:4px 0 2px 19px;padding-left:15px;border-left:1.5px solid var(--g2);animation:ob-subs-in .22s cubic-bezier(.16,1,.3,1)}
@keyframes ob-subs-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
.ob-sp-sub{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;background:none;border:1px solid transparent;font-family:var(--sans);cursor:pointer;text-align:left;width:100%;color:var(--g5);transition:background .14s,color .14s}
.ob-sp-sub:not(:disabled):hover{background:color-mix(in oklab,var(--g1) 60%,transparent);color:var(--tx)}
.ob-sp-sub:disabled{cursor:default;opacity:.55}
.ob-sp-sub-current{background:color-mix(in oklab,var(--ac) 7%,transparent);color:var(--tx)}
.ob-sp-sub-dot{width:16px;height:16px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;border:1.5px solid var(--g3);color:#fff;box-sizing:border-box}
.ob-sp-sub-dot.done{background:var(--green);border-color:var(--green)}
.ob-sp-sub-dot.active{border-color:var(--ac);background:color-mix(in oklab,var(--ac) 16%,transparent)}
.ob-sp-sub-name{font-size:12.5px;font-weight:500;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ob-sp-sub-current .ob-sp-sub-name{font-weight:600}
.dark .ob-sp-subs{border-color:var(--g2)}

/* ── Learning Section ── */
.ob-learning,.ob-learning-done{position:relative;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;gap:16px;overflow:hidden}
.ob-learning .ob-msg,.ob-learning-done .ob-msg{position:relative;z-index:1;max-width:640px;width:100%}

/* ── Learning Video Card ── */
.ob-msg-video{padding-left:44px;width:100%;max-width:640px}
.ob-video-card{width:100%;max-width:520px;background:rgba(255,255,255,.66);-webkit-backdrop-filter:blur(48px) saturate(1.4);backdrop-filter:blur(48px) saturate(1.4);border:1px solid rgba(255,255,255,.65);border-radius:20px;padding:14px;animation:ob-form-expand .35s cubic-bezier(.16,1,.3,1);box-shadow:0 10px 40px rgba(122,102,255,.08)}
.ob-video-frame{position:relative;width:100%;aspect-ratio:16/9;border-radius:12px;overflow:hidden;margin-bottom:14px;background:linear-gradient(135deg,rgba(96,77,255,.14),rgba(139,122,255,.06))}
.ob-video-el{width:100%;height:100%;object-fit:cover;display:block}
.ob-video-placeholder{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center}
.ob-video-play{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--ac),#604DFF);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 28px rgba(96,77,255,.4);padding-left:4px;animation:ob-pulse 2.4s ease-in-out infinite}
@keyframes ob-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
.ob-video-ph-label{font-size:15px;font-weight:600;color:var(--tx)}
.ob-video-ph-sub{font-size:12px;color:var(--g4);text-transform:uppercase;letter-spacing:.06em}

/* ── Confetti ── */
.ob-confetti{position:fixed;inset:0;z-index:400;pointer-events:none}
.ob-confetti-piece{position:absolute;top:42%;left:50%;opacity:0;animation-name:ob-confetti-burst;animation-timing-function:cubic-bezier(.2,.7,.3,1);animation-fill-mode:forwards}
@keyframes ob-confetti-burst{0%{transform:translate(-50%,-50%) rotate(0) scale(.6);opacity:0}12%{opacity:1}100%{transform:translate(calc(-50% + var(--tx)),calc(-50% + var(--ty))) rotate(var(--r)) scale(1);opacity:0}}
@media(prefers-reduced-motion:reduce){.ob-confetti{display:none}}

/* ── Demo Trigger Button ── */
.ob-demo-trigger{position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:100;display:inline-flex;align-items:center;gap:8px;padding:8px 20px;background:linear-gradient(135deg,var(--ac),#604DFF);color:#fff;border:none;border-radius:20px;font-family:var(--sans);font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 2px 12px rgba(96,77,255,.25);transition:all .2s;letter-spacing:.01em}
.ob-demo-trigger:hover{transform:translateX(-50%) translateY(-1px);box-shadow:0 4px 20px rgba(96,77,255,.35)}

/* ── Dark Mode Overrides ── */
.dark .ob-root{background:var(--bg)}
.dark .ob-msg-bubble{background:color-mix(in oklab,var(--sf) 80%,transparent);border-color:var(--g2)}
.dark .ob-form-card{background:color-mix(in oklab,var(--sf) 82%,transparent);border-color:var(--g2)}
.dark .ob-video-card{background:color-mix(in oklab,var(--sf) 82%,transparent);border-color:var(--g2)}
.dark .ob-purpose-card{background:color-mix(in oklab,var(--sf) 80%,transparent)}
.dark .ob-form-card .ob-field input,.dark .ob-form-card .ob-field select,.dark .ob-form-card .ob-field textarea{background:var(--g1);border-color:var(--g3);color:var(--tx)}
.dark .ob-form-card .ob-field input:focus,.dark .ob-form-card .ob-field select:focus,.dark .ob-form-card .ob-field textarea:focus{background:var(--sf);border-color:var(--ac)}
.dark .ob-purpose-card{background:var(--sf);border-color:var(--g2)}
.dark .ob-purpose-card:hover{border-color:var(--ac)}
.dark .ob-purpose-card.ob-selected{background:rgba(122,102,255,.1);border-color:var(--ac)}
.dark .ob-action-secondary{background:var(--sf);border-color:var(--g3);color:var(--g5)}
.dark .ob-nav-popup{background:color-mix(in oklab,var(--sf) 82%,transparent);border-color:var(--g2)}
.dark .ob-steps-panel{background:color-mix(in oklab,var(--sf) 72%,transparent);border-color:var(--g2)}
.dark .ob-sp-header{background:color-mix(in oklab,var(--sf) 78%,transparent);border-color:var(--g2)}
.dark .ob-sp-ic{background:var(--g1)}
.dark .ob-msg-avatar{background:#fff}
.dark .ob-done-check{background:rgba(46,204,113,.12)}

/* ── Responsive ── */
@media(max-width:980px){
  .ob-steps-panel{width:288px}
}
@media(max-width:768px){
  .ob-welcome-line{font-size:clamp(22px,6vw,36px);white-space:normal}
  .ob-welcome-tagline{white-space:normal;max-width:32ch}
  .ob-purpose-header{font-size:clamp(20px,5vw,32px)}
  .ob-conversation-layout{flex-direction:column;padding-left:0}
  .ob-embedded{left:0}
  .ob-sidebar{display:none}
  .ob-conversation-main{order:2;flex:1}
  .ob-conversation-area{padding:20px 12px 0}
  .ob-conversation-inner{padding-bottom:40vh}
  .ob-form-card{padding:16px}
  .ob-msg-bubble{max-width:90%}
  .ob-steps-panel{order:1;width:auto;flex-direction:column;max-height:34vh;margin:12px 12px 0;border-radius:18px}
  .ob-sp-list{flex-direction:row;overflow-x:auto;padding:12px;gap:8px}
  .ob-sp-item{flex-direction:column;align-items:flex-start;min-width:150px;width:auto}
  .ob-sp-chev{display:none}
  .ob-sp-group{flex-direction:row}
  .ob-sp-subs{display:none}
}
`;
