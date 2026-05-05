/* Generates Lanced for Companies — PRD (matches the framework of
   PRD-Showcase-Complete.docx for the agency app).
   Run: node build-company-prd.js */
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, PageNumber, Bookmark, InternalHyperlink,
} = require("docx");

const FONT = "Arial";
const ACCENT = "604DFF";
const MUTED = "5A5A66";
const BORDER = { style: BorderStyle.SINGLE, size: 4, color: "DDDDDD" };
const cellBorders = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };

const t = (text, opts = {}) => new TextRun({ text, font: FONT, ...opts });
const p = (text = "", opts = {}) => new Paragraph({
  children: typeof text === "string" ? [t(text)] : text,
  spacing: { after: 120, line: 320 },
  ...opts,
});
const h1 = (text, anchor) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  pageBreakBefore: true,
  children: anchor ? [new Bookmark({ id: anchor, children: [t(text)] })] : [t(text)],
});
const h2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [t(text)], spacing: { before: 240, after: 120 } });
const h3 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [t(text)], spacing: { before: 200, after: 100 } });
const h4 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_4, children: [t(text)], spacing: { before: 160, after: 80 } });
const lead = (text) => new Paragraph({ children: [t(text, { italics: true, color: MUTED })], spacing: { after: 200 } });
const bullet = (text, level = 0) => new Paragraph({
  numbering: { reference: "bullets", level },
  children: typeof text === "string" ? [t(text)] : text,
  spacing: { after: 60 },
});
const kv = (k, v) => new Paragraph({
  children: [t(k + ": ", { bold: true }), t(v)],
  spacing: { after: 60 },
});
const code = (text) => new Paragraph({
  children: [new TextRun({ text, font: "Courier New", size: 18 })],
  shading: { fill: "F4F3FA", type: ShadingType.CLEAR },
  spacing: { before: 80, after: 120, line: 280 },
});

function table(headers, rows, widthsParam) {
  const widths = widthsParam || headers.map(() => Math.floor(9360 / headers.length));
  const total = widths.reduce((a, b) => a + b, 0);
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((label, i) => new TableCell({
      borders: cellBorders,
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill: "F1EFFA", type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [t(label, { bold: true, size: 19 })] })],
    })),
  });
  const bodyRows = rows.map(r => new TableRow({
    children: r.map((cell, i) => new TableCell({
      borders: cellBorders,
      width: { size: widths[i], type: WidthType.DXA },
      margins: { top: 70, bottom: 70, left: 120, right: 120 },
      children: [new Paragraph({ children: [t(String(cell), { size: 18 })] })],
    })),
  }));
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...bodyRows],
  });
}

const c = []; // children

// ─── COVER ────────────────────────────────────────────────────────
c.push(
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 2400, after: 200 },
    children: [t("Product Requirements Document: Lanced for Companies", { size: 48, bold: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 },
    children: [t("Complete Platform Specification — Company App", { size: 28, color: ACCENT })] }),
  new Paragraph({ alignment: AlignmentType.CENTER,
    children: [t("Companion build spec covering every page, feature, data model, permission and integration in the Company app side of the Lanced platform.", { italics: true, color: MUTED })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400 },
    children: [t("Version 1.0  ·  May 2026", { color: MUTED })] }),
);

// ─── 1. PRODUCT OVERVIEW ──────────────────────────────────────────
c.push(h1("1. Product Overview", "s1"));
c.push(p([
  t("Product Name: ", { bold: true }), t("Lanced for Companies"),
]));
c.push(p([
  t("Type: ", { bold: true }), t("Recruitment & casting management platform for performing-arts companies (theaters, dance companies, opera houses, festivals, ensembles, production houses)"),
]));
c.push(p([
  t("Tech Stack: ", { bold: true }), t("React 19 + Vite 8, single monolithic component (AgencyShell.jsx, ~17,500 lines), CSS-in-JS with glassmorphism design system, Leaflet for maps, d3-geo + topojson for choropleth, mock data with localStorage persistence"),
]));
c.push(p([
  t("Primary Accent: ", { bold: true }), t("#7A66FF (purple) — companies can override per-profile via accentColor"),
]));
c.push(p([
  t("Typography: ", { bold: true }), t("Inter / Manrope (UI), Playfair Display (serif headings on showcase pages — N/A here), DM Sans (body), JetBrains Mono (data)"),
]));
c.push(p("Lanced for Companies is the recruitment + casting workflow side of the Lanced platform. It is used by production-side organisations to find, hire and manage performing-arts talent. It complements:"));
c.push(bullet("The Artist app — where artists build their profile, follow companies, apply to opportunities."));
c.push(bullet("The Agency app — for talent / casting agencies who represent rosters of artists and curate Showcases for clients."));
c.push(bullet("Both apps speak through shared entities (Artist, Application, Opportunity, Conversation)."));

c.push(h2("Differences from the Agency app"));
c.push(p("This app shares ~90% of its surface with the Agency app, with these key changes:"));
c.push(bullet("No Showcases. Companies do not curate-and-share rosters; they post castings and hire."));
c.push(bullet("Castings (Auditions / Job Calls / Open Calls / Residencies) are the primary workflow — what Showcases are for agencies."));
c.push(bullet("Castings have multi-stage Rounds for callbacks / final selections."));
c.push(bullet("Public Company Profile is a first-class surface — branded recruitment portal embeddable on the company's own site."));
c.push(bullet("Artists DB is called \"Artists\" or \"Ensemble\" (depending on company type) — same component as Agency's roster, but used for cast members rather than represented talent."));
c.push(bullet("Comp Card section in candidate detail is removed (it's a casting-agency artifact — physical measurements, etc.)."));

c.push(h2("Top jobs the Company app must do"));
[
  "Run a casting end-to-end: post → receive applications → review (alone or as a team) → shortlist → schedule callbacks (Rounds) → make offers.",
  "Maintain an Artists database (the company's ensemble + freelance pool) the team can search, filter, tag, and reuse across castings.",
  "Publish a public Company Profile that doubles as a recruitment portal — open roles, news, team, media — embeddable on the company's own site.",
  "Promote opportunities on the public Open Board for visibility beyond the company's own following.",
  "Collaborate internally and with external reviewers (guest panel, choreographers, artistic directors who don't work full-time at the company).",
  "Surface signal — applications, response rates, conversion funnel, where applicants are coming from — on a dashboard.",
  "Be useful from a phone (a lot of casting decisions happen between rehearsals, on the bus, before a show).",
].forEach(s => c.push(bullet(s)));

c.push(h2("Naming & terminology"));
c.push(table(["Code term", "Public name", "Notes"], [
  ["Room", "Casting", "Public name is one of: Audition / Casting / Job Call / Open Call / Residency, depending on opportunityType."],
  ["Candidate", "Application / Applicant", "An Artist (or guest applicant) who applied to a Casting."],
  ["Artist", "Artist / Ensemble member", "A person represented in the company's database. Either has a Lanced account (linked artistId) or is a guest applicant the company added."],
  ["Opportunity", "Opportunity", "External-facing item promoted on the Open Board. Often (but not always) backed by a Casting."],
  ["Application Form", "Application Form", "The public application surface artists see when they click an Opportunity."],
  ["Public Company Profile", "Company Profile", "The branded public-facing surface for the company, includes Jobs/Discover/People/News tabs."],
], [1900, 2400, 5060]));

// ─── 2. AUTH & ONBOARDING ─────────────────────────────────────────
c.push(h1("2. Authentication & Onboarding", "s2"));

c.push(h2("2.1 Auth States"));
c.push(p("Three authentication states managed via auth state variable:"));
c.push(table(["State", "Fields", "Behavior"], [
  ["Login", "Email + Password", "Standard login form. OAuth (Google / Apple) available."],
  ["Sign Up", "Full Name + Email + Password + Company Name + Company Type", "Registration creates User + Company + Owner Membership."],
  ["App", "—", "Authenticated workspace (demo auto-logs in)."],
], [1700, 3500, 4160]));

c.push(h2("2.2 Onboarding"));
c.push(bullet("Welcome screen on first login."));
c.push(bullet("Dismissable onboarding checklists tracked in state: \"Set up your public profile\", \"Post your first casting\", \"Invite your team\", \"Add your first artist\"."));
c.push(bullet("Quick-start tips embedded in the dashboard."));
c.push(bullet("First-run wizard collects: company name, type (Theater / Dance Company / Opera / Casting Agency / Talent Agency / Studio / Production Company / Other), email, optional logo, accent color (preset palette of 8), founded year. Skippable except name/type/email."));
c.push(bullet("Multi-company support: a User can belong to several Companies. UI shows a Company switcher in the top bar."));

// ─── 3. GLOBAL LAYOUT & NAVIGATION ────────────────────────────────
c.push(h1("3. Global Layout & Navigation", "s3"));

c.push(h2("3.1 Shell Structure"));
c.push(code(`┌──────────┬────────────────────────────────────────────┐
│          │  Top Bar (page title, actions, bell, avatar) │
│          ├────────────────────────────────────────────┤
│ Sidebar  │                                            │
│ (240px)  │              Main Content Area              │
│          │                                            │
│          │                                            │
└──────────┴────────────────────────────────────────────┘`));

c.push(h2("3.2 Sidebar Navigation"));
c.push(p("The sidebar collapses between full (240px) and compact (64px) modes. It shows different navigation items depending on context:"));

c.push(h3("Workspace Context (default)"));
c.push(table(["Icon", "Label", "Page Key", "Description"], [
  ["Home", "Dashboard", "dashboard", "Overview & quick stats"],
  ["Inbox", "Castings", "rooms", "Castings list"],
  ["Users", "Artists", "artist-db", "Artist database"],
  ["Chat", "Messages", "messages", "All conversations (with unread badge)"],
  ["Board", "Analytics", "analytics", "Performance dashboard"],
  ["Share", "Network", "network", "People & companies discovery"],
  ["Globe", "Promote", "promote", "Boosts & Open Board listings"],
  ["Aria", "Aria", "aria", "AI artist recommendation (special styling with gradient bg + \"AI\" pill)"],
  ["Settings", "Settings", "agency-settings", "Company profile, team & branding"],
], [800, 1700, 1800, 5060]));
c.push(p([t("Note: ", { bold: true }), t("There is no \"Showcases\" entry. The Company app does not have Showcases as a feature.")]));

c.push(h3("Casting Context (inside a casting)"));
c.push(bullet("Title of the current casting at the top."));
c.push(bullet("Tabs: Overview, Candidates, Rounds (when enabled), Materials, Questions, Marketing, Settings."));
c.push(bullet("\"Back to workspace\" at bottom."));

c.push(h3("Sidebar header"));
c.push(bullet("Top of sidebar: company logo + name + type."));
c.push(bullet("Click the logo opens the public Company Profile (in owner / preview mode)."));
c.push(bullet("On collapsed sidebar, click expands the sidebar instead."));

c.push(h2("3.3 Top Bar"));
c.push(bullet("Page title (dynamic based on context)."));
c.push(bullet("Breadcrumbs when inside a casting."));
c.push(bullet("Search bar."));
c.push(bullet("Notification bell — round 38px circle with unread count badge."));
c.push(bullet("User avatar dropdown (profile, settings, dark mode toggle, logout)."));

c.push(h2("3.4 Dark Mode"));
c.push(bullet("Full light/dark theme toggle."));
c.push(bullet("Persisted to localStorage."));
c.push(bullet("CSS variable switching for all colors."));
c.push(bullet("Glass morphism effects adapt (lighter glass in light mode, darker in dark mode)."));
c.push(bullet("Subtle background radial gradients shift to purple tones in dark mode."));

c.push(h2("3.5 Mobile Navigation"));
c.push(bullet("Bottom tab bar replaces sidebar on small screens: Home, Castings, Artists, Messages, More."));
c.push(bullet("More popup contains: Company Profile, Settings, Network, Promote, Analytics."));
c.push(bullet("Hamburger menu inside More for additional items."));
c.push(bullet("Mobile-specific overlays and sheet-style modals (right-anchored panes become bottom sheets)."));

c.push(h2("3.6 Notification Center"));
c.push(p("Accessible from the bell icon in the top bar:"));
c.push(bullet("Right-anchored panel with all notifications."));
c.push(bullet("Category filtering via chips: All | Team | System | Castings | Clients."));
c.push(bullet("Each notification has: icon, color, title, body text, timestamp, read/unread state, clickable link to relevant context."));
c.push(bullet("Mark all as read action."));

c.push(h3("Notification Types"));
c.push(table(["Category", "Examples"], [
  ["Team", "Notes, comments, status changes by team members on candidates."],
  ["System", "Application deadline approaching, daily digest, publish confirmations, follow alerts (new opportunity from a company you follow)."],
  ["Casting", "New applications, daily summaries, reviewer activity, vote tallies."],
  ["Client", "External reviewer activity, messages from artists who applied or follow you."],
], [1600, 7760]));

c.push(h2("3.7 Toast Notifications"));
c.push(bullet("Temporary success / error / info messages."));
c.push(bullet("Auto-dismiss after timeout."));
c.push(bullet("Stack in bottom-right corner."));

// ─── 4. DASHBOARD ─────────────────────────────────────────────────
c.push(h1("4. Dashboard", "s4"));
c.push(lead("The landing page after login. Displays an overview of the company's activity."));

c.push(h2("4.1 Welcome Section"));
c.push(bullet("Personalized greeting: \"Good morning, [User Name]\"."));
c.push(bullet("Date display."));
c.push(bullet("Subtitle that reflects current state (e.g. \"You've got 12 unreviewed candidates across 3 castings\")."));
c.push(bullet("Quick navigation chips: Castings, Artists, Public Profile."));

c.push(h2("4.2 Active Castings Summary"));
c.push(bullet("Cards for each active casting showing:"));
c.push(bullet("Casting title", 1));
c.push(bullet("Banner thumbnail", 1));
c.push(bullet("Total candidates / reviewed count", 1));
c.push(bullet("Progress bar (reviewed percentage)", 1));
c.push(bullet("Status badge (Draft / Published / Closed)", 1));
c.push(bullet("Deadline countdown", 1));
c.push(bullet("Click to enter the casting context."));

c.push(h2("4.3 Pending Requests"));
c.push(bullet("Profile-update requests from artists, application invitations, team invitations."));
c.push(bullet("Each row has approve / decline."));

c.push(h2("4.4 Recent Activity"));
c.push(bullet("Mixed feed: new applications, comments from team, votes, status changes, follows."));
c.push(bullet("Same shape as notifications but condensed."));

c.push(h2("4.5 Quick Stats"));
c.push(bullet("Total artists in database."));
c.push(bullet("Active castings count."));
c.push(bullet("Open positions across all castings."));
c.push(bullet("Profile followers count."));
c.push(bullet("Unread messages count."));

c.push(h2("4.6 Team Members Panel"));
c.push(bullet("Online team members with status indicators."));
c.push(bullet("Quick chat access."));
c.push(bullet("Recent activity per member."));

c.push(h2("4.7 Tracking"));
c.push(bullet("Profile-page views, application source breakdown, conversion stats."));
c.push(bullet("Click into Analytics for full view."));

// ─── 5. CASTINGS (LIST PAGE) ──────────────────────────────────────
c.push(h1("5. Castings (List Page)", "s5"));

c.push(h2("5.1 Overview"));
c.push(p("The Castings page lists all castings the company has created. This is the primary workflow surface — equivalent to Showcases for the Agency app."));

c.push(h2("5.2 Features"));
c.push(bullet("View Toggle: Grid / List layout."));
c.push(bullet("Search: Filter by casting title."));
c.push(bullet("Date Filter: Sort by date range."));
c.push(bullet("Sort: Newest first (default), deadline, most applicants."));
c.push(bullet("Create: \"New Casting\" button opens the creation wizard."));
c.push(bullet("Tabs: Active / Drafts / Closed / Archived."));
c.push(bullet("Templates: Save and apply casting templates."));

c.push(h2("5.3 Casting Card"));
c.push(p("Each card displays:"));
c.push(bullet("Banner image (16:9 thumbnail)."));
c.push(bullet("Title and description."));
c.push(bullet("Type pill: Audition / Casting / Job Call / Open Call / Residency."));
c.push(bullet("Candidate stats (total, shortlisted, potential, rejected, offered, reviewed)."));
c.push(bullet("Format: In-person / Online / Hybrid / Self-tape."));
c.push(bullet("Status badge: Draft / Published / Closed."));
c.push(bullet("Deadline date with countdown."));
c.push(bullet("Quick action menu (archive, duplicate, pin as featured, delete)."));

c.push(h2("5.4 Create Casting Modal / Wizard"));
c.push(p("Multi-step wizard:"));
[
  "Type — pick opportunityType (Audition / Casting / Job Call / Open Call / Residency).",
  "Basics — title, description, opportunityType, format, contracts, banner image, location.",
  "What we're looking for — bullet list (lookingFor) + optional offer text.",
  "Roles — list of role names + optional slot counts per role.",
  "Dates — deadline, results date, casting / rehearsal / fitting / shooting dates. Switch single-day vs multi-date.",
  "Materials — enable preset materials (Headshot, Showreel, CV, Motivation Letter) and add custom items. Each is required y/n.",
  "Questions — text / yesno / multi-choice. Multi-choice has its own options array.",
  "Profile fields — which artist-profile fields to request from applicants (age, gender, location, languages, agency rep).",
  "Workflow toggles — Shortlist, Waitlist, Early Invites, Voting (text or numeric), Batches (assign a number range to each reviewer), Rounds (multi-stage callbacks).",
  "Team — who can review (Members + Externals). Per-person scope set when added.",
  "Sharing — shareId, password / login gate, welcome message.",
].forEach(s => c.push(bullet(s)));

c.push(h2("5.5 Casting Data Model"));
c.push(code(`id, title, description, lookingFor[], offer,
opportunityType (audition | casting | job_call | open_call | residency),
roles[], contracts[], format (in_person | online | hybrid | self_tape),
location, status (draft | published | closed | archived), featured,
banner / coverImage, deadline, resultsDate,
castingDate, rehearsalDates, fittingDates, shootingDates, whenIs,
auditionFormat (single | multi_date),
enableShortlist, enableWaitlist, enableEarlyInvites,
enableVotes, voteType (text | numeric), voteOptions[], voteMax,
enableBatches, enableRounds,
teamMemberIds[], shareId, collaborationShareId,
shareSettings { requireLogin, requirePassword, password, welcomeMessage },
stats { total, shortlisted, potential, rejected, offered, reviewed },
createdAt, updatedAt, publishedAt, closedAt`));

// ─── 6. CASTING CONTEXT (INSIDE A CASTING) ────────────────────────
c.push(h1("6. Casting Context (Inside a Casting)", "s6"));
c.push(p("When a user clicks into a casting, the entire layout switches to casting-specific navigation. This is the deepest part of the Company app."));

c.push(h2("6.1 Overview Tab"));
c.push(bullet("Casting title, description, opportunityType pill."));
c.push(bullet("Status badge with publish toggle (Draft → Published → Closed)."));
c.push(bullet("Stats summary (total / reviewed / shortlisted / selected / not selected)."));
c.push(bullet("Banner preview."));
c.push(bullet("Quick links to other tabs (Candidates, Marketing, Settings)."));
c.push(bullet("Share and Preview buttons in the content header bar."));
c.push(bullet("Pin as Featured toggle (single-pin policy — only one casting per company can be featured at a time)."));

c.push(h2("6.2 Candidates Tab"));
c.push(p("The heart of the casting — managing applicants."));

c.push(h3("6.2.1 View Modes"));
c.push(table(["View", "Description"], [
  ["Cards", "4-col grid (responsive 3 / 2). Each card shows photo, candidate number, status badge, name, role/labels, hover-on-grayscale-off media."],
  ["List", "Dense table with photo, name, role, location, applied date, reviewed-by avatars, status, labels."],
  ["Kanban / Board", "Columns by status (New / Shortlisted / Potential / Selected / Not Selected). Drag-and-drop to change status."],
  ["Pool (when batches enabled)", "Chip row of reviewers; selecting a reviewer scopes to their assigned batch."],
], [2200, 7160]));

c.push(h3("6.2.2 Filtering"));
c.push(p("Filter Panel (right-anchored sheet) with sections:"));
c.push(bullet("Role & Skills: type, style, skills (free text)."));
c.push(bullet("Location: city or country."));
c.push(bullet("Personal: gender, ethnicity, nationality, age min/max, height min/max."));
c.push(bullet("Casting extras: employment (Full Time / Freelance / Internship), availability (Available / Has Conflicts), \"only candidates assigned to me\", \"still to vote\"."));
c.push(bullet("Question answers (NEW): for each multi-choice or yes/no question on the casting, show chip toggles for each option. Selecting one or more options narrows the list to applicants who answered that way."));
c.push(p("Logic: multiple questions AND together; multiple options within a question OR. Filter chips collapse when not in use; \"Clear All\" resets everything including question answers."));

c.push(h3("6.2.3 Candidate Card (Grid View)"));
c.push(bullet("3:4 photo aspect ratio."));
c.push(bullet("Candidate number (#1, #2…) overlaid top-left."));
c.push(bullet("Status badge top-right (color-coded by status)."));
c.push(bullet("Hover: grayscale to color, slight scale up."));
c.push(bullet("Bottom-overlay: name + role/labels (gradient background)."));
c.push(bullet("Click → opens the candidate detail view."));
c.push(bullet("Long-press / shift-click → multi-select (for bulk actions)."));

c.push(h3("6.2.4 Candidate Actions"));
c.push(bullet("Status change: Selected / Shortlisted / Potential (Waitlist) / Not Selected. With optional rejection reason picker (uses Message Templates)."));
c.push(bullet("Add label (Full Time / Freelance / etc — free-form)."));
c.push(bullet("Add note (with @-mention to other team members)."));
c.push(bullet("Vote (when room.enableVotes — text vote yes/maybe/no, or numeric 1–5)."));
c.push(bullet("Send Quick Message to applicant."));
c.push(bullet("Request Missing Materials."));
c.push(bullet("Add to artist Database (for guest applicants — promotes them to a full Artist record)."));
c.push(bullet("Move between rounds (when room.enableRounds)."));

c.push(h3("6.2.5 Batch Operations"));
c.push(bullet("Bulk select via checkbox or shift-click."));
c.push(bullet("Bulk: change status, add label, send rejection template, send a quick message, archive."));

c.push(h3("6.2.6 Kanban Board"));
c.push(bullet("Columns: New / Shortlisted / Potential / Selected / Not Selected."));
c.push(bullet("Drag to reassign status."));
c.push(bullet("Quick filters at top of each column (sort by votes, applied date, name)."));
c.push(bullet("Counter per column."));

c.push(h3("6.2.7 Candidate Detail (full-page view inside the casting)"));
c.push(p("Three-column layout on desktop (stacks on mobile):"));

c.push(h4("Top bar"));
c.push(bullet("Back, candidate name + #number, prev/next arrows."));
c.push(bullet("Kebab menu: Send Quick Message, Request Missing Materials, Add to Database, Add to other casting, Mark as duplicate, Delete."));

c.push(h4("Left column — media"));
c.push(bullet("Photo carousel (headshots, full-body, etc)."));
c.push(bullet("Video tabs with thumbnails — plays inline."));

c.push(h4("Center column — content"));
c.push(bullet("Motivation / cover letter."));
c.push(bullet([
  t("Additional Questions ", { bold: true }),
  t("(NEW): numbered list of every room question the applicant answered. Each item shows the question above and the answer below in a soft card."),
]));
c.push(bullet([
  t("Experiences & Training/Education ", { bold: true }),
  t("(NEW): two-column structured cards. Each entry: bold \"Role — Company\" or \"Programme — School\", italic \"From - To | Location\", optional description. Stacks on mobile. Replaces the old freeform Bio paragraph (which is now removed)."),
]));
c.push(bullet([
  t("Comp Card: ", { bold: true }),
  t("REMOVED in the Company app (it's a casting-agency artifact)."),
]));

c.push(h4("Right column — actions"));
c.push(bullet("Status buttons (Selected / Shortlisted / Potential / Not Selected) with rejection-reason picker."));
c.push(bullet("Team votes (when enabled) — your vote + visible team votes."));
c.push(bullet("Reviewers list."));
c.push(bullet("Labels."));
c.push(bullet("Notes (timeline of team comments)."));

c.push(h3("6.2.8 Candidate Data Model"));
c.push(code(`id, roomId, artistId (or externalApplicant {name,email,age,height,
  nationality,gender,location,img}),
number, status (new | shortlisted | potential | selected | not_selected),
labels[], rejectionReason, motivation,
videos[], materials[], answers {[questionId]: answer},
availability { available, conflicts[] },
reviewedBy[], votes {[memberId]: option},
notes [{ id, fromMemberId, text, createdAt }],
appliedAt`));

c.push(h2("6.3 Rounds Tab"));
c.push(p("When room.enableRounds is on, a Rounds tab appears. Rounds support multi-stage casting (initial review → callbacks → final selections)."));

c.push(h3("6.3.1 Round Structure"));
c.push(bullet("Each Round has: name (\"First callbacks\", \"Final round\"), date, location, slots, participantIds[]."));
c.push(bullet("Participants are drawn from the casting's current candidates (e.g. all shortlisted), or added as walk-ins."));
c.push(bullet("Round-level voting: yes / maybe / no per voter, plus notes per voter."));
c.push(bullet("\"Share results\" toggle creates the next round — selected candidates carry forward."));

c.push(h3("6.3.2 Walk-ins"));
c.push(bullet("Artists not in the casting can be added at the round level (e.g. someone the team invited at the last minute)."));
c.push(bullet("Walk-ins have basic info (name, image, location). Optionally promoted to a full Application after the round."));

c.push(h3("6.3.3 Round Results page"));
c.push(bullet("Vote tallies per participant."));
c.push(bullet("Reviewer-by-reviewer view (who voted what)."));
c.push(bullet("Quick-promote selected to next round."));

c.push(h3("6.3.4 Rounds Data Model"));
c.push(code(`id, roomId, name, date, location, slots,
participantIds[] (mix of artistIds + walk-ins),
walkIns[] [{ id, name, img, location }],
status (planned | in_progress | complete),
nextRoundId (when promoted)

auditionVotes [{ artistId, roundId, voterId, value (yes|maybe|no), notes }]`));

c.push(h2("6.4 Materials Tab"));
c.push(p("Manage the materials applicants must (or may optionally) submit when applying."));
c.push(bullet("Preset materials: Headshot Photo, Dance Reel / Video, CV / Resume, Motivation Letter."));
c.push(bullet("Add custom: type (photo / video / document) + title + required toggle."));
c.push(bullet("Drag to reorder."));
c.push(bullet("Each material renders as a corresponding upload field on the public Application Form."));

c.push(h3("6.4.1 Material Data Model"));
c.push(code(`id, roomId, type (photo | video | document),
title, enabled, required, custom, order`));

c.push(h2("6.5 Questions Tab"));
c.push(p("Manage the application questions."));
c.push(bullet("Add Question: question text + answerType (text / yesno / multi) + required toggle."));
c.push(bullet("For answerType=multi: define options array."));
c.push(bullet("Drag to reorder."));
c.push(bullet("Preview: see exactly how the question renders on the public Application Form."));
c.push(bullet("Inline edit / delete per question."));

c.push(h3("6.5.1 Question Data Model"));
c.push(code(`id, roomId, question, answerType (text | yesno | multi),
options[] (when multi), required, placeholder, order`));

c.push(h2("6.6 Marketing Tab"));
c.push(p("Inside a casting, the Marketing sub-tab is where the company turns the casting into outbound content."));

c.push(h3("6.6.1 Apply Preview"));
c.push(p("Inline preview of the public Application Form for this casting. Owner sees it as artists will. Same RoomApplicationView component as the Public Profile popup and the full-page route."));

c.push(h3("6.6.2 Assets"));
c.push(p("Auto-generated social-media graphics in three formats:"));
c.push(bullet("Story (1080×1920, 9:16) — Instagram / TikTok story."));
c.push(bullet("Feed (864×1080, 4:5) — Instagram feed / square-tall."));
c.push(bullet("Square (1080×1080, 1:1)."));
c.push(p("Each generated by a canvas-rendered template using the casting's banner + title + deadline + a CTA. Download as PNG."));

c.push(h3("6.6.3 Analytics"));
c.push(bullet("Public-page views, application source, conversion rate."));
c.push(bullet("Aggregated per-channel data."));

c.push(h3("6.6.4 Promote shortcut"));
c.push(p("CTA to create / link an Open Board listing pre-filled from this casting."));

c.push(h2("6.7 Settings Tab"));
c.push(p("Same wizard from §5.4, presented in-place as a series of editable groups:"));
c.push(bullet("Post Settings: title, description, lookingFor bullets, opportunityType, format, contracts, banner."));
c.push(bullet("Config Settings: dates, deadline, resultsDate, casting/rehearsal/fitting/shooting dates."));
c.push(bullet("Workflow: enableShortlist, enableWaitlist, enableEarlyInvites, enableVotes (and voteType + options), enableBatches, enableRounds."));
c.push(bullet("Access Settings: shareSettings (requireLogin, requirePassword, password, welcomeMessage)."));
c.push(bullet("Team Settings: which Members + External Reviewers can review this casting; per-external scope (review / vote / read-only)."));
c.push(bullet("Danger zone: archive, delete (with confirmation)."));

c.push(h2("6.8 Casting Share Modal"));
c.push(p("Share button in the top bar opens a modal with sharing options:"));
c.push(table(["Feature", "Description"], [
  ["Public link", "Generate and copy a unique application URL (lanced.app/apply/{shareId})."],
  ["Email Invite", "Send invitation emails to specific artists."],
  ["Login Settings", "Require email login (toggle), optional password protection."],
  ["Welcome Message", "Customize the greeting applicants see."],
  ["Embed snippet", "iframe + JS-widget snippet to embed on your own website (single opportunity)."],
  ["Collaboration link", "Separate URL for external reviewers (uses collaborationShareId)."],
], [1900, 7460]));

c.push(h2("6.9 Message Templates"));
c.push(p("Per-casting templates for status-change emails and bulk messages."));
c.push(bullet("Categories: rejection, shortlist invite, callback invite, request materials, custom."));
c.push(bullet("Variables supported: [first_name], [room_title], [casting_date], [agency_name]."));
c.push(bullet("Activate / deactivate per template."));

c.push(h3("6.9.1 Template Data Model"));
c.push(code(`id, roomId, category, name, message, active`));

// ─── 7. PUBLIC COMPANY PROFILE ────────────────────────────────────
c.push(h1("7. Public Company Profile", "s7"));
c.push(p("UNIQUE TO THE COMPANY APP. The public-facing branded profile. Doubles as a recruitment portal — companies can embed open jobs on their own website. Replaces what would be \"Showcases\" for agencies."));

c.push(h2("7.1 Overview"));
c.push(bullet("Full-screen overlay rendered when publicCompany state is set."));
c.push(bullet("Same component used for the company's own preview (\"self\" — owner mode) and for any other company in the network (artist viewer mode)."));
c.push(bullet("Loaded via getCompanyProfile(id, mockAgency, allArtists) — returns a unified profile shape."));

c.push(h2("7.2 Entry Points"));
c.push(bullet("Sidebar logo click (own profile, owner mode)."));
c.push(bullet("Mobile More popup → Company Profile."));
c.push(bullet("Network company card click (other company, artist mode)."));
c.push(bullet("\"You might also like\" side-panel link from another open profile."));
c.push(bullet("Future: deep link /c/:slug (post-MVP public web)."));

c.push(h2("7.3 Hero & Floating Identity Card"));
c.push(bullet("16:5 banner (image or accent-color gradient fallback)."));
c.push(bullet("Floating identity card (translucent blur, bottom-left of banner) holds: 64px logo, name + verified tick, type · location · followers, tagline, ● Hiring pill that scrolls to Jobs tab."));
c.push(bullet("Parallax: banner translates at 0.35× scroll, card lifts at 0.12× and fades only when reaching the topbar."));
c.push(bullet("Owner mode: \"Edit banner\" chip in top-right of banner."));

c.push(h2("7.4 Sticky Tab Bar"));
c.push(p("Tabs (only those with content show):"));
c.push(table(["Tab", "Always shown", "Description"], [
  ["Jobs", "Yes", "Open castings & opportunities."],
  ["Discover", "When media exists", "Photo + video gallery."],
  ["People", "When team or artists exist", "Team subsection (top) + Artists/Ensemble subsection (bottom)."],
  ["News", "When news exists or owner", "Company updates."],
], [1300, 1500, 6560]));
c.push(p("Sticks flush to topbar (top: var(--pcp-topbar-h)). Active tab gets accent underline."));

c.push(h2("7.5 Two-Column Body"));

c.push(h3("7.5.1 Main Column — Jobs Tab"));
c.push(bullet("Section header: \"Open roles & opportunities\" + count, list/calendar view toggle, \"Embed on your site\" chip (owner only)."));
c.push(bullet("List view: featured opportunity hero card at top + remaining opportunities below as compact cards."));
c.push(bullet("Heart icon on each card (artist viewer) toggles save state."));
c.push(bullet("Calendar view: month grid Mon→Sun with prev/next/Today nav and a 3-color legend (Deadline / Casting / Period). Event pills clickable to open the application popup."));
c.push(bullet("Each opportunity click opens the Application popup."));

c.push(h3("7.5.2 Main Column — Discover Tab"));
c.push(bullet("4-column media grid (responsive 3 / 2). Photos + videos."));
c.push(bullet("Video tiles show a translucent play overlay."));
c.push(bullet("Click any tile → fullscreen lightbox with prev/next arrow keys, ESC close, title / description / location / tags below the media."));
c.push(bullet("Owner: \"+ Add\" chip opens an Add to Media right-anchored pane (drop zone, title, description, location, chip-tag input, current-media list with delete)."));

c.push(h3("7.5.3 Main Column — People Tab"));
c.push(bullet("Team subsection (when team members exist) followed by Artists subsection (when artists exist)."));
c.push(bullet("Both render as 4-col 3:4 candidate-style cards with name + role pill overlay. Click → artist profile."));
c.push(bullet("Subtitle adapts: \"Currently in our ensemble\" (company) vs \"Currently represented\" (agency-type companies)."));

c.push(h3("7.5.4 Main Column — News Tab"));
c.push(bullet("Cards: 200px cover thumbnail + body (date pill + title + 2-line excerpt + Read more)."));
c.push(bullet("External-URL posts get an \"External\" pill and open in a new tab."));
c.push(bullet("Owner: \"+ Add post\" pane (title, excerpt, optional external URL, optional cover upload)."));
c.push(bullet("News content: companies can write internal updates or embed external blog articles."));

c.push(h2("7.6 Right Rail (Sticky)"));
c.push(bullet("About card: 240-char preview + Read more (opens centered modal with full text)."));
c.push(bullet("Links & contact: chip pills for Website / Email / IG / TikTok / LinkedIn. Below: \"Message {FirstName}\" primary button (artist viewer, when messageEnabled is on)."));
c.push(bullet("You might also like: list of 4 other companies from the network. Click → opens that company's profile (re-mounts via key)."));
c.push(bullet("16px gap between rail cards."));
c.push(bullet("On mobile (≤980px) the rail reorders to appear above the main column via grid-template-areas."));

c.push(h2("7.7 Application Popup"));
c.push(p("Renders the shared RoomApplicationView component. Used in three places: the public profile popup, the full-page apply page, and the marketing tab preview."));
c.push(bullet("Cover banner (16:6, gradient fallback)."));
c.push(bullet("Type chip · title · company byline."));
c.push(bullet("Date strip pinned at top: Deadline (red) · Casting · Rehearsals · Fittings · Period · Results."));
c.push(bullet("Description (full)."));
c.push(bullet("What we're looking for: lookingFor bullets + structured kv (Roles / Format / Contracts / Location / Requested profile info)."));
c.push(bullet("Offer (accent block)."));
c.push(bullet("Materials we'll ask for: list with type icons + Required/Optional pills."));
c.push(bullet("Questions in the application: numbered list with answer-type hint."));
c.push(bullet("AI fit suggestion (artist viewer only): \"Why this matches you\" with up to 3 reasons (Aria-branded card)."));
c.push(bullet("Two-stage Apply flow: stage 1 = single Apply button. Click wipes form area → stage 2 \"Sign in to apply\" card with Sign in with Lanced / Create new account, Back to opportunity link."));
c.push(bullet("Owner mode: Preview tag + \"Pin as featured\" / \"Embed this role\" buttons."));
c.push(bullet("ESC + backdrop close."));

c.push(h2("7.8 Owner-Side Editing"));
c.push(bullet("Each section has an Edit / + Add chip visible only to owner."));
c.push(bullet("All edit actions open the same right-anchored overlay pane (matches FilterPanel idiom)."));
c.push(bullet("Settings pane covers section visibility toggles (Artists / Team / Media / News) + accent color picker + messageEnabled toggle."));

c.push(h2("7.9 Embed Widget"));
c.push(p("Owner can generate copyable HTML snippets to embed open roles on their own website."));

c.push(h3("7.9.1 All Roles Widget"));
c.push(bullet("Trigger: \"Embed on your site\" chip in the Jobs tab section header (owner only)."));
c.push(bullet("Modal (max 1480px wide) with: live preview (light/dark theme switcher, compact 3 / full 5), copyable iframe + JS widget snippets."));
c.push(bullet("URL: https://lanced.app/embed/jobs/{slug}?theme=…&size=…."));
c.push(bullet("JS widget: <div data-lanced-jobs=\"{slug}\" …></div> + <script async src=\"https://lanced.app/embed.js\"></script>."));

c.push(h3("7.9.2 Single-Role Widget"));
c.push(bullet("Trigger: \"Embed this role\" button next to the Preview tag inside any opportunity's application popup (owner only)."));
c.push(bullet("Same modal but in singleOpp mode: title becomes \"Embed this opportunity\", preview becomes a single-card layout (cover + type + title + company + meta + Apply CTA in brand color)."));
c.push(bullet("URL: https://lanced.app/embed/job/{slug}/{oppId}?theme=…."));

c.push(h2("7.10 Settings & Branding"));
c.push(p("Edit profile pane (settings type) covers:"));
c.push(bullet("Banner image upload."));
c.push(bullet("Tagline."));
c.push(bullet("About text (long form)."));
c.push(bullet("Contact links (website, email, IG, TikTok, LinkedIn)."));
c.push(bullet("Section visibility toggles (Artists, Team, Media, News)."));
c.push(bullet("Allow visitors to message (messageEnabled)."));
c.push(bullet("Accent color picker (8 preset Lanced colors)."));

c.push(h2("7.11 Public Company Profile Data Model"));
c.push(code(`Company {
  id, name, slug, type (Theater | Dance Company | Opera | Casting Agency
    | Talent Agency | Studio | Production Company | Other),
  address, website, email, instagram, tiktok, linkedin, twitter,
  logo, banner, accentColor, tagline, founded, about,
  verified, followerCount, messageEnabled,
  hideArtists, hideTeam, hideMedia, hideNews,
  team [{ name, role, photo, artistId? }],
  media [MediaItem],
  news [NewsPost],
  createdAt, updatedAt
}

NewsPost { id, title, excerpt, body, coverImage, externalUrl,
  publishedAt, hidden }

MediaItem { id, type (photo | video), url, thumbnail,
  title, description, location, tags[], pinnedToTop, order, createdAt }`));

// ─── 8. ARTIST DATABASE ───────────────────────────────────────────
c.push(h1("8. Artist Database", "s8"));

c.push(h2("8.1 Overview"));
c.push(p("The company's roster — for theaters, this is the ensemble + freelance pool; for production companies, contractors and frequent collaborators. Same component as the Agency app's Showcase artists, used differently here."));

c.push(h2("8.2 Features"));
c.push(bullet("Toolbar: search, view toggle (cards / list), Add Artist, filter, sort."));
c.push(bullet("Cards: 3:4 photo, grayscale-to-color hover, name + role + city pills overlay, click → detail."));
c.push(bullet("Filter sheet (right-anchored): artistType, style, skills, gender, ethnicity, nationality, location, age range, height range. Multi-select with chip toggles where applicable."));
c.push(bullet("Sort: name a–z, recently added, rating."));
c.push(bullet("Add Artist (manual): full form."));
c.push(bullet("Invite to Lanced toggle: sends an invite to claim/own their profile."));
c.push(bullet("Bulk actions: tag, archive, export, message."));

c.push(h2("8.3 Artist Detail View"));
c.push(bullet("Header: photo, name, role, location, contact, edit / delete / send-invite."));
c.push(bullet("Tabs: Profile (all fields), Media (gallery), Experiences, Training & Education, Specs (Comp card — only shown for relevant types), Castings (history of castings applied), Notes, Activity."));
c.push(bullet("Edit modal: covers all fields below."));
c.push(bullet("If linked to a Lanced Artist account: profile fields are read-through; edit button → \"Request profile update\" sends a request to the artist."));
c.push(bullet("Add to Casting from kebab menu (links into the candidates pool of an active casting)."));
c.push(bullet("Move to archive (kept in DB but hidden from default views)."));

c.push(h2("8.4 Artist Data Model"));
c.push(code(`id, companyId, artistAccountId (nullable — null = local artist),
name, role, speciality, age, height, nationality, gender, pronouns,
ethnicity, hairColor, eyeColor, skinTone, buildType,
styles[], skills[], location, languages[], agencyRep,
bio (deprecated — kept as fallback),
experiences [{ title, company, from, to, location, description }],
educations [{ title, school, from, to, location, description }],
specs { eyeColor, shoeSize, bust, waist, hips, dressSize, suitSize,
  tattoos, piercings, skinTone, buildType },
media [{ type (photo | video), url, label, duration }],
rating (decimal 0–5),
createdAt, updatedAt`));

c.push(h2("8.5 Artist Roles"));
c.push(bullet("Lead Dancer / Ensemble / Soloist / Choreographer / Movement Director / Movement Coach / Singer / Actor / Model / Resident Artist / Apprentice / etc."));
c.push(bullet("Free-text — companies can use their own taxonomy."));

c.push(h2("8.6 Spec Fields (Comp Card)"));
c.push(p("Detailed measurements — tracked but not surfaced in the candidate detail view in the Company app. Available on the artist detail page for context."));

// ─── 9. MESSAGES ──────────────────────────────────────────────────
c.push(h1("9. Messages", "s9"));

c.push(h2("9.1 Overview"));
c.push(p("Internal team chat + DMs to artists who follow / applied. Two list segments — Team and Artists."));

c.push(h2("9.2 Layout"));
c.push(bullet("Two-column: conversation list left, message thread right."));
c.push(bullet("List shows: avatar / group icon, last-message preview, time, unread badge."));
c.push(bullet("Thread: standard chat — message bubbles, timestamps, file attachments."));
c.push(bullet("Compose: rich text light, paperclip, send."));
c.push(bullet("Header in thread: participant info, link to artist profile / casting context."));

c.push(h2("9.3 Conversation Types"));
c.push(table(["Type", "Description"], [
  ["team_dm", "1:1 between members."],
  ["team_room", "Casting-scoped group chat (auto-created when a casting has team members)."],
  ["artist_dm", "Between a member and an artist (only if the artist follows the company OR has applied to one of its castings)."],
], [2000, 7360]));

c.push(h2("9.4 Features"));
c.push(bullet("Quick message from candidate detail (kebab menu → Send Quick Message)."));
c.push(bullet("Bulk-message applicants from a casting (e.g. all shortlisted)."));
c.push(bullet("Message templates from §6.9 surfaced inline."));
c.push(bullet("Search across all conversations."));
c.push(bullet("Mark unread / archive."));

c.push(h2("9.5 Conversation Data Model"));
c.push(code(`id, companyId, kind (team_dm | team_room | artist_dm),
participantIds[] (or [memberId, artistId]),
unreadByMember {[memberId]: count},
lastMessageAt, lastMessagePreview

Message { id, conversationId,
  fromMemberId (or fromArtistId),
  text, attachments[], createdAt, readBy[] }`));

// ─── 10. COMPANY SETTINGS ─────────────────────────────────────────
c.push(h1("10. Company Settings", "s10"));

c.push(h2("10.1 Sub-tabs"));

c.push(h3("10.1.1 Profile Tab"));
c.push(p("Internal company profile (separate from Public Company Profile)."));
c.push(bullet("Company name, type, address, website, email, instagram, tiktok."));
c.push(bullet("Logo upload."));

c.push(h3("10.1.2 Public Profile Tab"));
c.push(p("Drives §7 (Public Company Profile)."));
c.push(bullet("Banner upload."));
c.push(bullet("Tagline, accent color picker."));
c.push(bullet("Founded year, about (long-form)."));
c.push(bullet("Section visibility toggles (Artists, Team, Media, News)."));
c.push(bullet("messageEnabled toggle."));
c.push(bullet("Public team management (add/edit team members shown on profile — distinct from Membership)."));
c.push(bullet("Live preview on the right."));

c.push(h3("10.1.3 Account Tab"));
c.push(bullet("Personal profile: name, email, avatar, password change, 2FA."));
c.push(bullet("Sign out everywhere."));
c.push(bullet("Delete account."));

c.push(h3("10.1.4 Plan Tab"));
c.push(bullet("Subscription tier (Free / Pro / Premium)."));
c.push(bullet("Payment method, invoices."));
c.push(bullet("Usage (active castings, team seats, Open Board credits)."));
c.push(bullet("Upgrade / downgrade. Stripe-backed."));

c.push(h3("10.1.5 Team Tab"));
c.push(p("List of Memberships."));
c.push(bullet("Add Member (email + role + optional jobTitle)."));
c.push(bullet("Edit role / jobTitle."));
c.push(bullet("Resend / revoke invite."));
c.push(bullet("Remove member (confirmation modal — what happens to their reviews? Default: anonymized as \"Former member\")."));
c.push(bullet("External Reviewers sub-section."));

c.push(h3("10.1.6 Notifications Tab"));
c.push(bullet("Per-category toggles for in-app vs email: Team activity, Casting updates, Client interactions, System alerts."));
c.push(bullet("Per-casting mute."));
c.push(bullet("Quiet hours (post-MVP)."));

c.push(h3("10.1.7 Integrations Tab"));
c.push(bullet("API keys (post-MVP)."));
c.push(bullet("Webhooks."));
c.push(bullet("Calendar export iCal feed."));
c.push(bullet("Embed widget management (manage embedded snippets)."));

c.push(h2("10.2 Tag Categories"));
c.push(p("Companies can define their own tag taxonomy for artists / labels (e.g. \"Full Time\", \"Internship\", \"Resident\", \"Touring\")."));

// ─── 11. NETWORK ──────────────────────────────────────────────────
c.push(h1("11. Network", "s11"));

c.push(h2("11.1 Overview"));
c.push(p("Discovery surface — both for finding artists outside the company's own DB and for finding companies (collaborators, clients, peers)."));

c.push(h2("11.2 Tabs"));
c.push(bullet("People — artists from the broader Lanced network."));
c.push(bullet("Companies — other companies on Lanced."));

c.push(h2("11.3 View Modes"));
c.push(bullet("List — dense table."));
c.push(bullet("Cards — visual grid (5 cols for People, 3 cols for Companies, responsive)."));
c.push(bullet("Map — Leaflet with custom pins (initials avatar + accent ring). Popup shows mini card; click pin → open card / profile."));

c.push(h2("11.4 Filtering"));
c.push(h3("People mode"));
c.push(p("Type, style, skills, gender, ethnicity, nationality, location, age, height."));

c.push(h3("Company mode"));
c.push(bullet("Type (Company / Casting Agency / Talent Agency / Studio / Theater / etc)."));
c.push(bullet("Hiring status (chip toggle: All / Currently hiring / Not hiring)."));
c.push(bullet("Location (text)."));
c.push(bullet("Styles & genres (chip multi-select)."));

c.push(h2("11.5 People Data Model"));
c.push(code(`id, name, role, company (string), location (city, country),
lat, lng, photo, styles[], mutual (mutual connections count)`));

c.push(h2("11.6 Company Data Model"));
c.push(code(`id, name, type, location (city, country),
lat, lng, logo (or initialsLogo fallback),
banner, styles[], openPositions, verified, followerCount`));

c.push(h2("11.7 Card Variants"));
c.push(h3("People card"));
c.push(bullet("3:4 photo with bottom gradient overlay (name + role + city + styles chips)."));
c.push(bullet("Footer: mutual connections + Connect button."));

c.push(h3("Company card"));
c.push(bullet("16:7 banner + circular 54px logo half-overlapping."));
c.push(bullet("Name, type · location."));
c.push(bullet("Up to 2 style chips."));
c.push(bullet("Footer: \"X open roles\" + Follow button."));
c.push(bullet("Active Hiring chip in top-right of banner when openPositions > 0 (with pulsing green dot)."));

c.push(h2("11.8 Actions"));
c.push(bullet("Person card click → opens the artist's public profile (Artist app)."));
c.push(bullet("Company card click → opens the Public Company Profile overlay (§7)."));
c.push(bullet("Connect (people) — sends a connection request."));
c.push(bullet("Follow (companies) — adds you to their followers; pushes a notification confirming."));

// ─── 12. ARIA ─────────────────────────────────────────────────────
c.push(h1("12. Aria (AI Artist Recommendation)", "s12"));

c.push(h2("12.1 Overview"));
c.push(p("AI-powered artist recommendation engine. Search the company's DB and the broader Lanced network using natural language."));

c.push(h2("12.2 Visual Design"));
c.push(bullet("Centered single-column page, animated background blobs (purple gradients)."));
c.push(bullet("Gradient \"Aria\" badge with sparkle icon."));
c.push(bullet("Reduced-motion respected."));

c.push(h2("12.3 Input Interface"));
c.push(bullet("Hero: \"Aria\" mark + \"Tell me what you're looking for…\" textarea."));
c.push(bullet("Attach (casting context) chip."));
c.push(bullet("Reset / Send buttons."));

c.push(h2("12.4 Query Understanding"));
c.push(p("After submission, an \"What I understood:\" chip strip shows parsed structured fields:"));
c.push(bullet("discipline (Contemporary, Ballet, Hip-Hop, Jazz, Afrobeats, Afro-fusion, Breaking, Modern, Butoh, Tap)."));
c.push(bullet("skills (floorwork, partnering, improvisation, pointe, lifts, stillness, acrobatics, contact)."));
c.push(bullet("style/lineage (Forsythe, NDT, Batsheva/Gaga, Tanztheater)."));
c.push(bullet("gender (Male / Female)."));
c.push(bullet("height (Tall / Short)."));
c.push(bullet("location (Berlin, London, Paris, Amsterdam, Brussels, Tokyo, Milan, Copenhagen, Accra, New York, Los Angeles…)."));
c.push(bullet("availability (month name)."));

c.push(h2("12.5 Results Display"));
c.push(p("Ranked list of artist matches:"));
c.push(bullet("Rank number (#1 – #10)."));
c.push(bullet("Photo (96×112)."));
c.push(bullet("Name + meta (role · location · age · height)."));
c.push(bullet("Match percentage with progress bar."));
c.push(bullet("Highlight (\"Tall (5'11\\\") with the build you're looking for\")."));
c.push(bullet("Rationale text."));
c.push(bullet("Thumbs-up / down feedback button."));

c.push(h2("12.6 Scoring Algorithm"));
c.push(p("Weighted combination of:"));
c.push(bullet("Profile-field overlap (discipline match, location proximity, height/age range)."));
c.push(bullet("Prior collaboration history with this company."));
c.push(bullet("Availability match against the casting's dates (when attached)."));
c.push(bullet("Reverse-rank from feedback (👍 boosts similar; 👎 reduces similar)."));

c.push(h2("12.7 Actions"));
c.push(p("Footer actions:"));
c.push(bullet("\"Send all to a new casting\" — creates a draft casting with these candidates pre-loaded."));
c.push(bullet("\"Add to existing casting\" — picker."));
c.push(bullet("\"Save as a list\" — for later reference (post-MVP)."));

// ─── 13. PROMOTE ──────────────────────────────────────────────────
c.push(h1("13. Promote", "s13"));

c.push(h2("13.1 Overview"));
c.push(p("Public Open Board where companies post opportunities to reach artists outside their own following."));

c.push(h2("13.2 Sub-tabs"));
c.push(bullet("Listings — own opportunities."));
c.push(bullet("Boosts — paid promotion options."));
c.push(bullet("Performance — analytics."));
c.push(bullet("Pricing — tiers and Stripe checkout."));

c.push(h2("13.3 Open Board Listings"));

c.push(h3("13.3.1 Listing Types (Opportunity Types)"));
c.push(table(["Type", "Description"], [
  ["Audition", "Standard audition for a role."],
  ["Casting", "Commercial / film casting."],
  ["Job Call", "Open job posting (e.g. company manager, choreographer)."],
  ["Open Call", "Pitch your idea / commission request."],
  ["Residency", "Artistic residency programme."],
  ["Workshop", "Teaching opportunity."],
], [1700, 7660]));

c.push(h3("13.3.2 New Listing Wizard (5 Steps)"));
[
  "Type — pick opportunityType (sets template defaults).",
  "Basics — title, description, lookingFor bullets, offer, cover image.",
  "Logistics — location, deadline, dates, employmentType, artistType.",
  "Promotion — Regular (free) vs Spotlight (paid). Optional premium boost.",
  "Review & submit — summary view + submit-for-review CTA. Listings go to pending status, then auto-approve unless flagged.",
].forEach(s => c.push(bullet(s)));

c.push(h3("13.3.3 Listing Management"));
c.push(bullet("Status pills: live, pending review, paused, expired."));
c.push(bullet("Inline analytics (views, applicants)."));
c.push(bullet("Edit, pause, duplicate, delete."));
c.push(bullet("Convert to a Casting (creates a backing Room)."));

c.push(h3("13.3.4 Listing Data Model"));
c.push(code(`id, companyId, roomId (nullable — link to Casting),
title, coverImage, opportunityType, category,
artistType, employmentType, location, whenIs,
deadline, description, lookingFor[], offer, applyTo,
adType (Regular | Spotlight), price, premium, status,
featured, submittedDate, expiresAt, views, applicants`));

c.push(h2("13.4 Boosts"));
c.push(h3("13.4.1 Currently Boosted"));
c.push(p("List of own listings currently boosted, with remaining time."));

c.push(h3("13.4.2 Available to Boost"));
c.push(p("Live listings that aren't currently boosted."));

c.push(h3("13.4.3 Boost Packages"));
c.push(bullet("Spotlight — top of board for X days."));
c.push(bullet("Featured — pinned across the network homepage."));
c.push(bullet("Newsletter — included in the weekly Lanced digest."));
c.push(bullet("Social — promoted on Lanced's IG / TikTok (post-MVP)."));

c.push(h2("13.5 Performance"));
c.push(bullet("Charts: views over time, applications over time, conversion rate."));
c.push(bullet("Per-listing breakdown."));
c.push(bullet("Source (organic / boosted / direct)."));

c.push(h2("13.6 Boost Data Model"));
c.push(code(`id, listingId, companyId, package, startedAt, endsAt,
price, status (active | expired | refunded)`));

// ─── 14. ANALYTICS ────────────────────────────────────────────────
c.push(h1("14. Analytics", "s14"));

c.push(h2("14.1 Overview"));
c.push(p("Company-wide metrics surface."));

c.push(h2("14.2 KPI Strip (8 metrics)"));
c.push(bullet("Total applications this month."));
c.push(bullet("Response rate."));
c.push(bullet("Avg time-to-respond."));
c.push(bullet("Profile views."));
c.push(bullet("Followers (with ∆)."));
c.push(bullet("Castings published this month."));
c.push(bullet("Artists in DB."));
c.push(bullet("Open positions."));

c.push(h2("14.3 Applications Over Time"));
c.push(p("Line chart of applications per day for last 30 / 90 / 365 days. Toggle range."));

c.push(h2("14.4 Conversion Funnel"));
c.push(p("Applied → Reviewed → Shortlisted → Selected. Conversion percentages between stages. Per-casting drill-down."));

c.push(h2("14.5 Top Performing Castings"));
c.push(p("Table sorted by applications. Columns: title, type, applications, conversion, deadline."));

c.push(h2("14.6 Applicant Geography"));
c.push(p("Choropleth world map (d3-geo + topojson client-side). Drag/zoom to explore. Color scale based on applicant count per country."));

c.push(h2("14.7 Top Cities"));
c.push(p("Ranked list of cities applicants come from."));

c.push(h2("14.8 Traffic Sources"));
c.push(p("Where applicants found the casting: Public profile / Open Board / Direct link / Embed widget / Aria recommendation / Email invite."));

// ─── 15. PUBLIC CASTING / APPLICATION FORM ────────────────────────
c.push(h1("15. Public Casting / Application Form Page", "s15"));

c.push(h2("15.1 Overview"));
c.push(p("The public-facing application surface artists see. Same RoomApplicationView component as the popup on the public profile and the inline preview in the Marketing tab. Lives at lanced.app/apply/{shareId}."));

c.push(h2("15.2 Layout"));
c.push(p("See §7.7 for the full anatomy. Summary:"));
c.push(bullet("Cover banner."));
c.push(bullet("Type pill + title + company byline (with verified tick)."));
c.push(bullet("Date strip at top: Deadline / Casting / Rehearsals / Fittings / Period / Results."));
c.push(bullet("Description."));
c.push(bullet("What we're looking for (bullets + structured kv)."));
c.push(bullet("Offer (if present)."));
c.push(bullet("Materials we'll ask for."));
c.push(bullet("Questions in the application."));
c.push(bullet("AI fit suggestion (when artist is signed in)."));
c.push(bullet("Apply button → 2-stage flow (Apply → auth → form)."));

c.push(h2("15.3 Submission Flow"));
[
  "Click Apply → wipes the info area, shows \"Sign in to apply\" card with Sign in with Lanced + Create new account.",
  "After auth: prefills with artist profile data (name, email, materials).",
  "Application form: motivation, video link / upload, required materials, room questions.",
  "Submit → creates an Application record, sets status=new, increments room.stats.total, fires notification to room owner.",
  "Confirmation: \"Application submitted. {Company} will review and get back to you.\"",
].forEach(s => c.push(bullet(s)));

c.push(h2("15.4 Login Gate (when shareSettings.requireLogin)"));
c.push(bullet("Email input (required)."));
c.push(bullet("Password input (when shareSettings.requirePassword)."));
c.push(bullet("Welcome message displayed above the gate."));
c.push(bullet("After login, dropped into the application info view."));

c.push(h2("15.5 Edge Cases"));
c.push(bullet("Casting closed / past deadline → form replaced with \"This casting is closed\" + Follow company CTA."));
c.push(bullet("shareId regenerated → old URL 404s gracefully (\"This casting may have moved\")."));
c.push(bullet("Rate-limited per IP + per shareId to prevent spam."));

// ─── 16. TEAM & COLLABORATION ─────────────────────────────────────
c.push(h1("16. Team & Collaboration", "s16"));

c.push(h2("16.1 Team Roles"));
c.push(table(["Role", "Cap", "Permissions"], [
  ["Owner", "1 per company", "Everything, including delete company / billing."],
  ["Admin", "n", "All resources except delete company / billing. Can manage Members but not Owners."],
  ["Member", "n", "Read company-wide; write Artists DB, own Castings (created by them); per-casting reviewer access via teamMemberIds."],
  ["External Reviewer", "n", "Per-casting only. No company-wide access. Email-link login. Scope: review-only / vote-only / view-shortlist."],
  ["Pending invite", "n", "Email sent, not yet accepted."],
], [2200, 1500, 5660]));

c.push(h2("16.2 Voting System"));
c.push(p("When room.enableVotes:"));
c.push(bullet("voteType: text (\"yes / maybe / no\") or numeric (1–5)."));
c.push(bullet("Each reviewer casts one vote per candidate."));
c.push(bullet("Other reviewers' votes visible after you cast yours (anti-bias optional toggle, post-MVP)."));
c.push(bullet("\"Still to vote\" filter shows only candidates where you haven't voted."));
c.push(bullet("Round-level voting works the same way."));

c.push(h2("16.3 Team Chat"));
c.push(bullet("team_room conversation auto-created per casting."));
c.push(bullet("Team members can DM each other (team_dm)."));
c.push(bullet("@-mentions in candidate notes notify the mentioned member."));

c.push(h2("16.4 External Reviewers"));
c.push(bullet("Invited via Settings → Team → Add External."));
c.push(bullet("Required fields: email, name, casting(s), scope."));
c.push(bullet("Receive a magic link with their invite token."));
c.push(bullet("On click, prompted for their name (first time) and dropped directly into the assigned casting(s)."));
c.push(bullet("Cannot navigate elsewhere — sidebar replaced with an \"External\" banner."));
c.push(bullet("If they're also a regular Member elsewhere, they can switch back via the company switcher."));

c.push(h2("16.5 Activity & Audit"));
c.push(bullet("Per-candidate activity log (who voted, who status-changed, who left a note)."));
c.push(bullet("Per-casting activity log (publish, share, settings change)."));
c.push(bullet("Company-wide audit log (Owner / Admin only; post-MVP)."));

// ─── 17. DATA MODELS SUMMARY ──────────────────────────────────────
c.push(h1("17. Data Models Summary", "s17"));

c.push(h2("17.1 Company"));
c.push(code(`id, name, slug, type, address, website, email,
instagram, tiktok, linkedin, twitter,
logo, banner, accentColor, tagline, founded, about,
verified, followerCount, messageEnabled,
hideArtists, hideTeam, hideMedia, hideNews,
team [{ name, role, photo, artistId? }],
media [MediaItem],
news [NewsPost],
createdAt, updatedAt`));

c.push(h2("17.2 User"));
c.push(code(`id, email, name, avatar,
passwordHash (or OAuth providers),
lastLoginAt, createdAt`));

c.push(h2("17.3 Membership"));
c.push(code(`id, userId, companyId,
role (owner | admin | member | external),
jobTitle, status (active | pending_invite | disabled),
roomScopes [{ roomId, scope }] (for external only),
createdAt`));

c.push(h2("17.4 Artist"));
c.push(code(`id, companyId, artistAccountId (nullable),
name, role, speciality, age, height, nationality, gender, pronouns,
ethnicity, hairColor, eyeColor, skinTone, buildType,
styles[], skills[], location, languages[], agencyRep,
bio, experiences [Experience], educations [Education],
specs { eyeColor, shoeSize, bust, waist, hips, dressSize, suitSize,
  tattoos, piercings, skinTone, buildType },
media [MediaItem],
rating, createdAt, updatedAt

Experience { title, company, from, to, location, description }
Education  { title, school,  from, to, location, description }`));

c.push(h2("17.5 Casting (Room)"));
c.push(code(`id, companyId, title, description, lookingFor[], offer,
opportunityType (audition | casting | job_call | open_call | residency),
roles[], contracts[], format (in_person | online | hybrid | self_tape),
location, status (draft | published | closed | archived), featured,
banner / coverImage, deadline, resultsDate,
castingDate, rehearsalDates, fittingDates, shootingDates, whenIs,
auditionFormat (single | multi_date),
enableShortlist, enableWaitlist, enableEarlyInvites,
enableVotes, voteType (text | numeric), voteOptions[], voteMax,
enableBatches, enableRounds,
teamMemberIds[], shareId, collaborationShareId,
shareSettings { requireLogin, requirePassword, password, welcomeMessage },
stats { total, shortlisted, potential, rejected, offered, reviewed },
createdAt, publishedAt, closedAt, archivedAt`));

c.push(h2("17.6 RoomMaterial"));
c.push(code(`id, roomId, type (photo | video | document),
title, enabled, required, custom, order`));

c.push(h2("17.7 RoomQuestion"));
c.push(code(`id, roomId, question,
answerType (text | yesno | multi),
options[] (when multi), required, placeholder, order`));

c.push(h2("17.8 Application (Candidate)"));
c.push(code(`id, roomId, artistId (or externalApplicant {…}),
number, status (new | shortlisted | potential | selected | not_selected),
labels[], rejectionReason, motivation,
videos[], materials[], answers {[questionId]: answer},
availability { available, conflicts[] },
reviewedBy[], votes {[memberId]: option},
notes [Note], appliedAt`));

c.push(h2("17.9 Round"));
c.push(code(`id, roomId, name, date, location, slots,
participantIds[], walkIns [{ id, name, img, location }],
status (planned | in_progress | complete),
nextRoundId

auditionVote { artistId, roundId, voterId,
  value (yes | maybe | no), notes }`));

c.push(h2("17.10 Conversation & Message"));
c.push(code(`Conversation { id, companyId, kind (team_dm | team_room | artist_dm),
  participantIds[], unreadByMember{}, lastMessageAt }

Message { id, conversationId, fromMemberId or fromArtistId,
  text, attachments[], createdAt, readBy[] }`));

c.push(h2("17.11 Opportunity (Open Board)"));
c.push(code(`id, companyId, roomId (nullable),
title, coverImage, opportunityType, category,
artistType, employmentType, location, whenIs,
deadline, description, lookingFor[], offer, applyTo,
adType (Regular | Spotlight), price, premium, status,
featured, submittedDate, expiresAt, views, applicants`));

c.push(h2("17.12 NewsPost"));
c.push(code(`id, companyId, title, excerpt, body,
coverImage, externalUrl, publishedAt, hidden`));

c.push(h2("17.13 MediaItem"));
c.push(code(`id, ownerType (company | artist), ownerId,
type (photo | video), url, thumbnail,
title, description, location, tags[],
pinnedToTop, order, createdAt`));

c.push(h2("17.14 Notification"));
c.push(code(`id, companyId, recipientMemberId,
cat (team | system | room | client),
icon, color, title, body,
link { context, id }, read, createdAt`));

c.push(h2("17.15 MessageTemplate"));
c.push(code(`id, roomId, category (rejection | shortlist | callback | request | custom),
name, message, active`));

c.push(h2("17.16 Boost"));
c.push(code(`id, listingId, companyId, package,
startedAt, endsAt, price,
status (active | expired | refunded)`));

// ─── 18. UI/UX DESIGN SYSTEM ──────────────────────────────────────
c.push(h1("18. UI/UX Design System", "s18"));

c.push(h2("18.1 Theme Variables"));
c.push(code(`--ac:    #7A66FF   /* primary accent */
--ac-d:  #4A35E0   /* darker accent */
--bg:    #FAFAFC   /* page background (light) */
--sf:    #FFFFFF   /* surface (cards, panels) */
--tx:    #1A1A1E   /* text primary */
--g1..g6: greyscale ladder
--green: #1DB954, --red: #FF4757, --amber: #F5A623

Dark mode swaps these via .dark class on root.

--pcp-accent: per-profile override on the public profile (drives banner
gradient fallback, button accents, section underlines).`));

c.push(h2("18.2 Glassmorphism"));
c.push(bullet("Glass surfaces: rgba(255,255,255,.6) + backdrop-filter blur(2–14px)."));
c.push(bullet("Used on: filter panels, identity cards, sticky topbars, embed previews."));
c.push(bullet("Adapts in dark mode — rgba(20,20,30,.6–.85)."));
c.push(bullet("@supports fallback to solid var(--sf) for non-supporting browsers."));

c.push(h2("18.3 Typography Scale"));
c.push(table(["Element", "Size", "Weight"], [
  ["Page title (h1)", "20–24px", "600"],
  ["Section title (h2)", "18px", "600"],
  ["Card title", "14px", "600"],
  ["Body", "13–14px", "400"],
  ["Meta", "11–12px", "500"],
  ["Pill / chip", "9–11px", "500–600"],
  ["Code / mono", "11–12px", "400"],
], [3000, 3160, 3200]));

c.push(h2("18.4 Key UI Patterns"));
c.push(bullet("Round 38px notification bell with red unread badge."));
c.push(bullet("Right-anchored overlay panels for filters + profile section editing (\".filter-side-panel\" idiom)."));
c.push(bullet("Bottom-anchored sheets on mobile."));
c.push(bullet("Pill-style buttons (40px border-radius)."));
c.push(bullet("Gradient brand mark for Aria + accent buttons."));
c.push(bullet("Pulsing dot for live indicators (Active Hiring, Aria thinking)."));
c.push(bullet("Hover: subtle lift + shadow + accent border."));

c.push(h2("18.5 Responsive Design"));
c.push(table(["Breakpoint", "Behavior"], [
  ["≥1280px", "Full sidebar (240px), 5-col network grid, 4-col candidates."],
  ["1100–1280px", "Public profile rail still visible. Network grid drops to 4."],
  ["980–1100px", "Sidebar can collapse. Network grid 3."],
  ["≤980px", "Public profile rail moves above main content via grid-areas."],
  ["≤760px", "Mobile breakpoint. Bottom tab bar. Candidate cards stack."],
  ["≤560px", "Phone tightening. Floating identity card collapses tagline. Topbar title hidden."],
], [2400, 6960]));

c.push(h2("18.6 Animations"));
c.push(bullet("Page transitions: fade-in 250ms ease."));
c.push(bullet("Modals: scale-in + fade 200ms."));
c.push(bullet("Right-anchored panels: slide-in from right 200ms."));
c.push(bullet("Bottom sheets: slide-up 250ms."));
c.push(bullet("Parallax (public profile): 0.35× banner translate, 0.12× card translate (translate3d for GPU compositing)."));
c.push(bullet("Pulse for live dots: 1.6s ease-out infinite."));
c.push(bullet("@media (prefers-reduced-motion): all animations disabled."));

// ─── 19. STATE MANAGEMENT ─────────────────────────────────────────
c.push(h1("19. State Management", "s19"));
c.push(p("Today the app is a single React component (AgencyShell.jsx) holding all state. For production, split into:"));
c.push(bullet("Server state: TanStack Query (or RTK Query) — Castings, Candidates, Artists, Conversations, Notifications."));
c.push(bullet("Client state: useState for local UI (filters, view modes, modal open/close, hover states)."));
c.push(bullet("Real-time: WebSocket subscriptions per casting + per conversation. Optimistic updates for status changes / votes / notes."));
c.push(bullet("Forms: React Hook Form for the casting wizard + filter panel."));
c.push(bullet("Persistence: localStorage for theme preference, sidebar collapse state, tab preferences."));
c.push(bullet("URL state: query string for filters + view modes (deep-linkable)."));

c.push(h2("19.1 Key state slices today"));
c.push(code(`page                — current top-level page key
viewRoom            — active casting id (or null)
viewShowcase        — N/A (only Agency app)
publicCompany       — overlay state ("self" | companyId | null)
companyProfileEdits — local owner edits (keyed by id)
candidates          — Application[] (rooms)
candidateFilters    — current filter state
candidateVotes      — { [candId]: { [memberId]: vote } }
candidateBatches    — { [memberId]: { from, to } }
auditionVotes       — round-level votes
applicationOpp      — currently-open application popup (or null)
embedOpen / embedSingleOpp — embed widget modal state
showAdvancedFilters — filter sheet open state
notifications       — Notification[]
darkMode, sidebarCollapsed — UI state`));

// ─── 20. CONNECTION MAP ───────────────────────────────────────────
c.push(h1("20. Connection Map — How Everything Links Together", "s20"));

c.push(p("How the major surfaces relate:"));

c.push(h2("20.1 Casting → Application"));
c.push(bullet("Public Application Form (lanced.app/apply/{shareId}) → POST creates an Application."));
c.push(bullet("Application appears in the casting's Candidates tab."));
c.push(bullet("Notification fires to assigned reviewers + casting owner."));
c.push(bullet("Linked to an Artist if the applicant is signed in; otherwise externalApplicant payload."));

c.push(h2("20.2 Casting → Public Profile"));
c.push(bullet("Casting status=published with featured=true → shows as the hero card in the company's Public Profile Jobs tab."));
c.push(bullet("Other published castings show as compact cards below."));
c.push(bullet("Pin/unpin from the application popup (owner-only)."));

c.push(h2("20.3 Public Profile → Application Form"));
c.push(bullet("Click an opportunity card → Application popup (in-place modal, RoomApplicationView)."));
c.push(bullet("Apply button → 2-stage auth → submission → Application record."));

c.push(h2("20.4 Network → Public Profile"));
c.push(bullet("Network company card click → opens that company's Public Profile in artist mode."));
c.push(bullet("\"You might also like\" rail on each profile links to other profiles (re-mounts via key)."));

c.push(h2("20.5 Aria → Casting"));
c.push(bullet("Aria result → \"Send to a new casting\" creates a draft with these candidates pre-loaded."));
c.push(bullet("Aria can be attached to a casting (uses casting.lookingFor + roles for additional ranking weights)."));

c.push(h2("20.6 Open Board → Casting"));
c.push(bullet("Listing on Open Board → linked to a Casting (roomId) so applications flow into the room."));
c.push(bullet("Without a backing Casting, listing uses applyTo (email or external URL)."));

c.push(h2("20.7 Embed Widget → Application Form"));
c.push(bullet("Embed widget on company's own site → Apply button → opens lanced.app/apply/{shareId} in a new tab (or in-iframe modal)."));

c.push(h2("20.8 Notifications hub"));
c.push(bullet("Triggers: application submitted, status change, vote, note (mention), comment, deadline T-2, daily summary, follow, message, external reviewer activity."));
c.push(bullet("Each notification has a deep link back to its source surface."));

c.push(h2("20.9 Messages → Candidate"));
c.push(bullet("Quick Message from candidate detail kebab opens an artist_dm conversation prefilled with casting context."));

// ─── 21. TECH STACK ──────────────────────────────────────────────
c.push(h1("21. Tech Stack", "s21"));

c.push(h2("21.1 Frontend"));
c.push(bullet("React 19 + Vite 8."));
c.push(bullet("Single monolithic component (AgencyShell.jsx, ~17,500 lines) — to be split for production."));
c.push(bullet("CSS-in-JS via inline <style> with CSS variables for theming."));
c.push(bullet("Leaflet for maps."));
c.push(bullet("d3-geo + topojson-client for the choropleth analytics map."));
c.push(bullet("qrcode.react for the share-link QR code."));
c.push(bullet("react-apexcharts for analytics charts."));

c.push(h2("21.2 Backend (target)"));
c.push(bullet("Node.js + TypeScript (Fastify or NestJS)."));
c.push(bullet("Postgres for the relational data model (chapter 17)."));
c.push(bullet("Redis for sessions + cache."));
c.push(bullet("Object storage (S3-compatible) for media uploads."));
c.push(bullet("CDN in front of public surfaces."));
c.push(bullet("Image processing pipeline (sharp) — variants on upload."));
c.push(bullet("Video transcoding (HLS) for inline playback."));

c.push(h2("21.3 Auth"));
c.push(bullet("Auth.js / Clerk / custom JWT."));
c.push(bullet("OAuth: Google, Apple."));
c.push(bullet("Magic-link login for External Reviewers."));

c.push(h2("21.4 Payments"));
c.push(bullet("Stripe for subscriptions + Open Board boost purchases."));

c.push(h2("21.5 Real-time"));
c.push(bullet("WebSocket (or Pusher / Ably) for: candidate updates, votes, notes, conversation messages, notification fan-out."));

c.push(h2("21.6 AI (Aria)"));
c.push(bullet("LLM with function-calling (OpenAI / Anthropic) for query parsing → structured filters."));
c.push(bullet("Vector search (pgvector) for fuzzy matching against artist profiles."));
c.push(bullet("Feedback loop captured in a separate table to improve ranking."));

c.push(h2("21.7 Analytics"));
c.push(bullet("Server-side event log (PostHog / Mixpanel)."));
c.push(bullet("Custom in-app analytics for company-facing metrics."));

c.push(h2("21.8 Embed widget infrastructure"));
c.push(bullet("Server-rendered HTML at lanced.app/embed/jobs/{slug} and /embed/job/{slug}/{oppId}."));
c.push(bullet("embed.js — small (≤100KB gzipped) script that hydrates data-lanced-jobs / data-lanced-job div elements."));
c.push(bullet("Cached at the edge with revalidation on opportunity / casting changes."));

c.push(h2("21.9 Observability"));
c.push(bullet("Structured server logs with request IDs."));
c.push(bullet("Client error monitoring (Sentry-style)."));
c.push(bullet("Uptime monitoring on public endpoints (apply, embed, profile)."));

c.push(h2("21.10 Hosting"));
c.push(bullet("Frontend: Vercel / Netlify."));
c.push(bullet("Backend: Heroku / Fly.io / Railway / AWS ECS."));
c.push(bullet("Database: Supabase / RDS / Neon."));

// ─── ENDING ───────────────────────────────────────────────────────
c.push(new Paragraph({ children: [t("")], spacing: { before: 400 } }));
c.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [t("End of document · Lanced for Companies — PRD v1.0", { italics: true, color: MUTED, size: 18 })],
}));

// ─── BUILD ────────────────────────────────────────────────────────
const doc = new Document({
  creator: "Lanced",
  title: "Lanced for Companies — PRD",
  description: "PRD for the Company app, matching the framework of the Agency PRD.",
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: FONT, color: "1A1A1E" },
        paragraph: { spacing: { before: 320, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: FONT, color: "1A1A1E" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: FONT, color: ACCENT },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
      { id: "Heading4", name: "Heading 4", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: FONT, color: "1A1A1E" },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 3 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
      ] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [t("Lanced for Companies — PRD v1.0", { color: MUTED, size: 18 })],
      })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          t("Page ", { color: MUTED, size: 18 }),
          new TextRun({ children: [PageNumber.CURRENT], font: FONT, color: MUTED, size: 18 }),
          t(" of ", { color: MUTED, size: 18 }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, color: MUTED, size: 18 }),
        ],
      })] }),
    },
    children: c,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("PRD-Company-Complete.docx", buf);
  console.log("Wrote PRD-Company-Complete.docx (" + buf.length + " bytes)");
});
