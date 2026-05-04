/* Generates Lanced for Companies — Product Requirements Document (PRD).
   Run: node build-prd.js */
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  TabStopType, TabStopPosition, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, Bookmark, InternalHyperlink,
} = require("docx");

/* ────────────────────────────────────────────────────────────────────
   Helpers
─────────────────────────────────────────────────────────────────── */
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
  children: anchor
    ? [new Bookmark({ id: anchor, children: [t(text)] })]
    : [t(text)],
});
const h2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [t(text)], spacing: { before: 240, after: 120 } });
const h3 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [t(text)], spacing: { before: 180, after: 80 } });
const h4 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_4, children: [t(text)], spacing: { before: 140, after: 60 } });
const lead = (text) => new Paragraph({ children: [t(text, { italics: true, color: MUTED })], spacing: { after: 200 } });
const bullet = (text, level = 0) => new Paragraph({
  numbering: { reference: "bullets", level },
  children: typeof text === "string" ? [t(text)] : text,
  spacing: { after: 60 },
});
const numbered = (text, level = 0) => new Paragraph({
  numbering: { reference: "numbers", level },
  children: typeof text === "string" ? [t(text)] : text,
  spacing: { after: 60 },
});
const kv = (k, v) => new Paragraph({
  children: [t(k + ": ", { bold: true }), t(v)],
  spacing: { after: 60 },
});

/* Build a key-value table for entity field specs. */
function fieldsTable(rows) {
  const widths = [2400, 1900, 1200, 4000];
  const total = widths.reduce((a, b) => a + b, 0);
  const head = ["Field", "Type", "Required", "Notes"];
  const headerRow = new TableRow({
    tableHeader: true,
    children: head.map((label, i) => new TableCell({
      borders: cellBorders,
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill: "F1EFFA", type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [t(label, { bold: true, size: 20 })] })],
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

/* Spacer paragraph */
const sp = (n = 1) => Array.from({ length: n }, () => new Paragraph({ children: [t("")] }));

/* ────────────────────────────────────────────────────────────────────
   Content
─────────────────────────────────────────────────────────────────── */
const children = [];

// Cover
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 2400, after: 200 },
    children: [t("Lanced for Companies", { size: 56, bold: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 600 },
    children: [t("Product Requirements Document", { size: 32, color: ACCENT })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [t("Companion build spec for the Company app — every page, feature, data model, permission, and API surface needed to ship.", { italics: true, color: MUTED })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400 },
    children: [t("Version 1.0  ·  May 2026", { color: MUTED })],
  }),
);

// ───────────────────────────────────────────────────────────────────
// 0. Table of contents (manual list)
// ───────────────────────────────────────────────────────────────────
children.push(h1("Contents", "toc"));
[
  ["1. Product Overview", "overview"],
  ["2. Personas & User Roles", "personas"],
  ["3. Data Model", "data-model"],
  ["4. Authentication & Onboarding", "auth"],
  ["5. Information Architecture", "ia"],
  ["6. Dashboard", "dashboard"],
  ["7. Showcases", "showcases"],
  ["8. Rooms (Castings)", "rooms"],
  ["9. Artist Database", "artists"],
  ["10. Network", "network"],
  ["11. Public Company Profile", "profile"],
  ["12. Promote (Open Board)", "promote"],
  ["13. Marketing (room-level)", "marketing"],
  ["14. Analytics", "analytics"],
  ["15. Aria — AI Casting Assistant", "aria"],
  ["16. Messages", "messages"],
  ["17. Notifications", "notifications"],
  ["18. Settings", "settings"],
  ["19. Permissions & Sharing", "permissions"],
  ["20. Mobile Experience", "mobile"],
  ["21. Integrations & Public Endpoints", "integrations"],
  ["22. Non-Functional Requirements", "nfr"],
  ["23. Open Questions & Roadmap", "open"],
].forEach(([label, anchor]) =>
  children.push(new Paragraph({
    children: [new InternalHyperlink({ anchor, children: [t(label, { color: ACCENT })] })],
    spacing: { after: 60 },
  }))
);

// ───────────────────────────────────────────────────────────────────
// 1. Product Overview
// ───────────────────────────────────────────────────────────────────
children.push(h1("1. Product Overview", "overview"));
children.push(lead("Lanced for Companies is the recruitment + casting management platform for performing-arts companies (theaters, dance companies, opera houses, festivals) and casting agencies."));

children.push(h2("Mission"));
children.push(p("Replace the patchwork of email threads, spreadsheets, and PDFs that performing-arts hiring runs on today with a single, branded, in-app experience for both sides — companies casting roles and artists applying to them — that feels native to how the industry actually works."));

children.push(h2("Two-sided value"));
children.push(p("Lanced has two products that share data: the Artist app (artist profile, applications, showcases) and the Company app (this PRD). They speak through shared entities — Artist, Application, Opportunity, Showcase, Conversation."));

children.push(h2("Top jobs the Company app must do"));
[
  "Run a casting / audition end-to-end: post → receive applications → review (alone or as a team) → shortlist → schedule callbacks → make offers.",
  "Maintain a roster / artist database the team can search, filter, tag, and reuse across castings.",
  "Build curated artist Showcases for clients (commercial casting agencies and creative companies) with a branded share link.",
  "Publish a public Company Profile that doubles as a recruitment portal — open roles, news, team, media — embeddable on the company's own site.",
  "Promote opportunities on the public Open Board for visibility beyond the company's own network.",
  "Collaborate internally and with external reviewers (clients, guest panel members).",
  "Surface signal — application stats, response rates, where applicants are coming from — on a dashboard.",
  "Be useful from a phone (a lot of casting decisions happen between rehearsals, on the bus, before a show).",
].forEach(s => children.push(bullet(s)));

children.push(h2("Naming & terminology"));
children.push(p("The codebase uses some terms that need fixed product naming. The PRD uses the public-facing names:"));
[
  ["Room", "the database name. Public name: Casting (or Audition / Job Call / Open Call / Residency depending on the room's opportunityType)."],
  ["Candidate", "an Application linked to an Artist (or guest applicant) for a given Room."],
  ["Artist", "a person represented in the database. Either has a Lanced account (linked artistId) or is a guest applicant the company added."],
  ["Showcase", "a curated collection of artists shared with a client via a branded link."],
  ["Opportunity", "an external-facing item promoted on the Open Board. Often (but not always) backed by a Room."],
  ["Application Form", "the public application surface artists see when they click an Opportunity."],
].forEach(([k, v]) => children.push(kv(k, v)));

// ───────────────────────────────────────────────────────────────────
// 2. Personas
// ───────────────────────────────────────────────────────────────────
children.push(h1("2. Personas & User Roles", "personas"));

children.push(h2("Personas"));
children.push(h3("Mira — Artistic Director (Theater company)"));
children.push(p("Owns the creative vision. Posts auditions, makes final selections. Wants to skim quickly, watch showreels, leave notes for the producer. Reviews mostly on phone between rehearsals."));
children.push(h3("Daniel — Casting Director (Theater company / Casting agency)"));
children.push(p("The power user. Lives in the Rooms candidates view all day. Cares about advanced filters, batches, voting, multi-round audition flows, and team collaboration."));
children.push(h3("Anya — Producer / Company Manager"));
children.push(p("Coordinates schedule and contracts after selection. Cares about exporting selected lists, contract types per applicant, and notifying applicants of outcome."));
children.push(h3("Sasha — Talent Agent (Casting agency)"));
children.push(p("Builds Showcases for brand clients. Lives in Artists DB and Showcases. Doesn't always run her own castings; clients often run them, with her artists submitted."));
children.push(h3("External reviewer"));
children.push(p("A client (brand creative director), a guest choreographer, a panel member. Doesn't have an account in the company; granted scoped access to one or more Rooms via an external invite."));
children.push(h3("Amara — the Artist (other side of the marketplace)"));
children.push(p("Uses the Artist app. Applies to opportunities. Their experience of the Company app is via Public Company Profile + Application Form — both must look first-class."));

children.push(h2("Roles inside one Company"));
children.push(fieldsTable([
  ["Owner", "1 per company", "Yes", "Created at signup. Billing, delete company, manage all permissions."],
  ["Admin", "n", "Yes", "Manage all rooms / artists / settings / team. Cannot delete the company."],
  ["Member", "n", "Yes", "Can be invited to specific rooms; default access to Artists DB read+write, Network, etc."],
  ["External Reviewer", "n", "Per-room", "No company-wide access. Email-link login. Sees only invited rooms with a configurable scope (review-only / vote-only / view-shortlist)."],
  ["Pending invite", "n", "Email", "Invite sent, not yet accepted."],
]));
children.push(p("All role-based access checks happen at the API layer; the UI hints what's permitted but is not the source of truth."));

children.push(h2("Account boundaries"));
[
  "A user (one Lanced login) can belong to multiple Companies. UI must support a Company switcher.",
  "An Artist account on the Artist app and a Member account on the Company app can share an email but are separate principals from the user's perspective. Backend may unify them under a single User identity with two profile records.",
  "External Reviewers are scoped credentials — they don't show up in the company's team list except in a small \"External\" section.",
].forEach(s => children.push(bullet(s)));

// ───────────────────────────────────────────────────────────────────
// 3. Data Model
// ───────────────────────────────────────────────────────────────────
children.push(h1("3. Data Model", "data-model"));
children.push(lead("Source of truth. Field names are how they're written in the React state today; rename freely for the database schema. Times stored UTC ISO-8601 unless noted."));

children.push(h2("Top-level entities"));
[
  ["Company", "Tenant. The PRD's main subject. Owns Rooms, Showcases, Artists, Team, Settings."],
  ["User", "Authenticated principal. Joins Company through Membership."],
  ["Membership", "User × Company × role. With per-room overrides for External Reviewers."],
  ["Artist", "Person represented in the company's database. May be linked to an external Artist account on the Artist app."],
  ["Room", "A casting / audition. Lifecycle: draft → published → closed → archived."],
  ["Application (Candidate)", "Artist × Room with status, votes, notes, materials, answers."],
  ["Showcase", "Curated list of artists with a brand and a share link."],
  ["Opportunity", "Public listing for the Open Board. May reference a Room."],
  ["Conversation / Message", "Internal team chat + DMs to artists."],
  ["Notification", "Activity feed entries surfaced via the bell."],
  ["Notice/News post", "Company news posts shown on the public profile."],
  ["MediaItem", "Photo / video on company profile or artist profile."],
  ["TeamMember (PublicTeam)", "Display-only team member shown on public profile."],
].forEach(([k, v]) => children.push(kv(k, v)));

children.push(h2("Company"));
children.push(fieldsTable([
  ["id", "uuid", "Yes", "PK"],
  ["name", "string", "Yes", "Display name."],
  ["slug", "string", "Yes", "URL slug, unique. Used for /c/<slug> and embed widget URLs."],
  ["type", "enum", "Yes", "Company / Theater / Dance Company / Casting Agency / Talent Agency / Studio / Production Company / Other."],
  ["address", "string", "No", "Free text or structured address."],
  ["website", "url", "No", ""],
  ["email", "email", "Yes", "Public contact email."],
  ["instagram, tiktok, linkedin, twitter", "string", "No", "Social handles."],
  ["logo", "url", "No", "Square logo. Falls back to initialsLogo() server-side if missing."],
  ["banner", "url", "No", "16:5 banner."],
  ["accentColor", "hex", "Yes", "Drives banner gradient fallback, button accents, profile underline. Default #7A66FF."],
  ["tagline", "string", "No", "One line shown under name on public profile."],
  ["founded", "int", "No", "Year founded."],
  ["about", "richtext", "No", "Long-form description shown on public profile."],
  ["verified", "bool", "Yes", "Verification badge."],
  ["followerCount", "int", "Yes", "Aggregated count of artists who follow."],
  ["messageEnabled", "bool", "Yes", "Whether the public profile shows a Message button."],
  ["hideArtists / hideTeam / hideMedia / hideNews", "bool", "Yes", "Section visibility on public profile."],
  ["createdAt, updatedAt", "timestamp", "Yes", ""],
]));

children.push(h2("User"));
children.push(fieldsTable([
  ["id", "uuid", "Yes", "PK"],
  ["email", "email", "Yes", "Unique."],
  ["name", "string", "Yes", ""],
  ["avatar", "url", "No", ""],
  ["passwordHash", "string", "Yes (or)", "Or one of OAuth provider IDs."],
  ["lastLoginAt", "timestamp", "No", ""],
  ["createdAt", "timestamp", "Yes", ""],
]));

children.push(h2("Membership"));
children.push(fieldsTable([
  ["id", "uuid", "Yes", "PK"],
  ["userId", "uuid (FK User)", "Yes", ""],
  ["companyId", "uuid (FK Company)", "Yes", ""],
  ["role", "enum", "Yes", "owner / admin / member / external."],
  ["jobTitle", "string", "No", "Optional title shown internally (\"Casting Director\", etc.)."],
  ["status", "enum", "Yes", "active / pending_invite / disabled."],
  ["roomScopes", "json[]", "No", "For external role only — list of {roomId, scope} where scope ∈ review / vote / read."],
  ["createdAt", "timestamp", "Yes", ""],
]));

children.push(h2("Artist"));
children.push(p("The Artist record in the company's database. Two flavors:"));
children.push(bullet("Linked: artistAccountId points to a Lanced Artist on the Artist app — fields are read-through and request-able for updates."));
children.push(bullet("Local: the company added the artist manually. Fully editable by the company. Optionally promoted to a Lanced account later (invite flow)."));
children.push(fieldsTable([
  ["id", "uuid", "Yes", "PK"],
  ["companyId", "uuid (FK)", "Yes", "Which company owns this record."],
  ["artistAccountId", "uuid", "No", "If linked. Null = local."],
  ["name", "string", "Yes", ""],
  ["role", "string", "No", "Headline role / job title (\"Lead Dancer\")."],
  ["speciality", "string", "No", "Sub-discipline (\"Contemporary & Afro-fusion\")."],
  ["age", "int", "No", ""],
  ["height", "string", "No", "\"5'8\\\"\""],
  ["nationality", "string", "No", ""],
  ["gender", "string", "No", ""],
  ["pronouns", "string", "No", ""],
  ["ethnicity", "string", "No", ""],
  ["hairColor, eyeColor, skinTone, buildType", "string", "No", "Physical attributes."],
  ["styles", "string[]", "No", "Tags."],
  ["skills", "string[]", "No", ""],
  ["location", "string", "No", "City, country."],
  ["languages", "string[]", "No", ""],
  ["agencyRep", "string", "No", "Representation status."],
  ["bio", "richtext", "No", "Deprecated for display — kept as fallback."],
  ["experiences", "Experience[]", "No", "Structured work history (see below)."],
  ["educations", "Education[]", "No", "Structured training & education."],
  ["specs", "json", "No", "Comp-card measurements (bust/waist/hips/dressSize/suitSize/shoeSize/tattoos/piercings). Casting-agency context."],
  ["media", "MediaItem[]", "No", "Headshots, full-body, showreels."],
  ["rating", "decimal", "No", "Internal rating, 0–5."],
  ["createdAt, updatedAt", "timestamp", "Yes", ""],
]));

children.push(h3("Experience (sub-record)"));
children.push(fieldsTable([
  ["title", "string", "Yes", "Role / position (\"Lead Dancer\")."],
  ["company", "string", "No", "Where it happened (\"Akram Khan Company\")."],
  ["from", "string", "No", "\"Sep 2022\""],
  ["to", "string", "No", "\"Current\" or end date."],
  ["location", "string", "No", ""],
  ["description", "richtext", "No", "Optional details."],
]));
children.push(h3("Education (sub-record)"));
children.push(fieldsTable([
  ["title", "string", "Yes", "Programme / degree."],
  ["school", "string", "No", "Institution."],
  ["from, to, location, description", "string", "No", "Same shape as Experience."],
]));

children.push(h2("Room (Casting)"));
children.push(fieldsTable([
  ["id", "uuid", "Yes", "PK"],
  ["companyId", "uuid", "Yes", ""],
  ["title", "string", "Yes", ""],
  ["description", "richtext", "No", ""],
  ["lookingFor", "string[]", "No", "Bullet points: \"Strong contemporary technique\", etc."],
  ["offer", "richtext", "No", "Pay / contract terms."],
  ["opportunityType", "enum", "Yes", "audition / casting / job_call / residency / open_call."],
  ["roles", "string[]", "No", "List of roles being cast (\"Contemporary Dancer\", \"Ensemble\")."],
  ["contracts", "string[]", "No", "Full Time / Apprenticeship / Freelance / Internship / Project-Based."],
  ["format", "enum", "Yes", "in_person / online / self_tape."],
  ["location", "string", "No", "Where the casting happens."],
  ["status", "enum", "Yes", "draft / published / closed / archived."],
  ["featured", "bool", "Yes", "Pinned-as-featured on company's public profile (single-pin policy enforced server-side)."],
  ["banner / coverImage", "url", "No", "Hero image."],
  ["deadline", "date", "No", "Application deadline."],
  ["resultsDate", "date", "No", "When applicants will hear back."],
  ["castingDate, rehearsalDates, fittingDates, shootingDates", "string", "No", "Free text date ranges."],
  ["whenIs", "string", "No", "Free text period (used by Open Board listings)."],
  ["auditionFormat", "enum", "No", "single / multi_date — controls which fields show."],
  ["enableShortlist, enableWaitlist, enableEarlyInvites, enableVotes, enableBatches, enableRounds", "bool", "Yes", "Workflow feature flags per room."],
  ["voteType", "enum", "No", "text (\"yes/maybe/no\") or numeric (1–5)."],
  ["voteOptions", "string[]", "No", "When voteType=text."],
  ["voteMax", "int", "No", "When voteType=numeric."],
  ["shareId", "string", "Yes", "Public shareable id used in the public application URL."],
  ["collaborationShareId", "string", "Yes", "External-reviewer shareable id."],
  ["shareSettings", "json", "Yes", "{requireLogin, requirePassword, password, welcomeMessage}."],
  ["teamMemberIds", "uuid[]", "No", "Who can review this room."],
  ["createdAt, updatedAt, publishedAt, closedAt", "timestamp", "Yes/No", ""],
]));

children.push(h3("Room sub-records"));
children.push(h4("RoomMaterial"));
children.push(fieldsTable([
  ["id", "uuid", "Yes", "PK"],
  ["roomId", "uuid", "Yes", ""],
  ["type", "enum", "Yes", "photo / video / document."],
  ["title", "string", "Yes", "\"Headshot\", \"Showreel\", \"CV\"."],
  ["enabled", "bool", "Yes", ""],
  ["required", "bool", "Yes", ""],
  ["custom", "bool", "Yes", "Differentiates owner-created from preset."],
]));
children.push(h4("RoomQuestion"));
children.push(fieldsTable([
  ["id", "uuid", "Yes", "PK"],
  ["roomId", "uuid", "Yes", ""],
  ["question", "string", "Yes", ""],
  ["answerType", "enum", "Yes", "text / yesno / multi."],
  ["options", "string[]", "Conditional", "Required when answerType=multi."],
  ["required", "bool", "Yes", ""],
  ["placeholder", "string", "No", ""],
  ["order", "int", "Yes", "Sort order."],
]));
children.push(h4("RoomProfileReqs"));
children.push(p("A boolean map on the room itself rather than a sub-table. Tracks which artist-profile fields the company wants to see/collect on application: age, gender, pronouns, ethnicity, nationality, location, languages, agencyRep."));

children.push(h2("Application (Candidate)"));
children.push(fieldsTable([
  ["id", "uuid", "Yes", "PK"],
  ["roomId", "uuid", "Yes", ""],
  ["artistId", "uuid", "No", "Linked artist record (null for external guest applicants)."],
  ["externalApplicant", "json", "No", "{name, email, age, height, nationality, gender, location, img}. Set when artistId is null."],
  ["number", "int", "Yes", "Display number within the room (#1, #2…). Auto-incremented at apply."],
  ["status", "enum", "Yes", "new / shortlisted / potential (waitlist) / selected / not_selected."],
  ["labels", "string[]", "No", "Free-form tags (\"Full Time\", \"Apprenticeship\", \"Internship\")."],
  ["rejectionReason", "string", "No", "Required when status=not_selected if rejection-reason picker is enabled."],
  ["motivation", "richtext", "No", "Cover letter / pitch."],
  ["videos", "json[]", "No", "[{label, url, thumb}]."],
  ["materials", "json[]", "No", "Submitted materials matched against RoomMaterial."],
  ["answers", "{[questionId]: answer}", "No", "Per-question answers."],
  ["availability", "json", "Yes", "{available: bool, conflicts: string[]}."],
  ["reviewedBy", "uuid[]", "Yes", "Members who've reviewed."],
  ["votes", "{[memberId]: option}", "No", "When room.enableVotes."],
  ["notes", "Note[]", "No", "Inline notes on the candidate."],
  ["appliedAt", "timestamp", "Yes", ""],
]));
children.push(h4("Note (sub)"));
children.push(p("{ id, fromMemberId, text, createdAt }"));

children.push(h2("Showcase"));
children.push(fieldsTable([
  ["id", "uuid", "Yes", "PK"],
  ["companyId", "uuid", "Yes", ""],
  ["title", "string", "Yes", ""],
  ["description", "richtext", "No", ""],
  ["artistIds", "uuid[]", "Yes", "Ordered."],
  ["status", "enum", "Yes", "draft / published."],
  ["shareId", "string", "Yes", "Public URL: showcase.lanced.app/{shareId}."],
  ["shareSettings", "json", "Yes", "{requireLogin, requirePassword, password, welcomeMessage, allowRespond, allowComments, allowRequests, shareSpecs}."],
  ["branding", "json", "Yes", "{accentColor, bgColor, titleColor, bodyColor, titleFont, bodyFont, layout, bannerStyle}. Drives client-facing skin."],
  ["analytics", "json (computed)", "Yes", "{views, uniqueVisitors, lastViewedAt, perArtistViews, selections, comments}."],
  ["createdAt, updatedAt, publishedAt", "timestamp", "Yes/No", ""],
]));

children.push(h2("Opportunity (Open Board listing)"));
children.push(fieldsTable([
  ["id", "uuid", "Yes", "PK"],
  ["companyId", "uuid", "Yes", ""],
  ["roomId", "uuid", "No", "Optional link to a Room. If set, applications flow into the room."],
  ["title", "string", "Yes", ""],
  ["coverImage", "url", "No", ""],
  ["opportunityType", "string", "Yes", "Audition / Casting / Open Call / Residency / Workshop."],
  ["category", "string", "Yes", "Free-text taxonomy (mirrors opportunityType in most cases)."],
  ["artistType", "string", "No", "Dancer / Choreographer / Actor / etc."],
  ["employmentType", "string", "No", "Full Time / Project-Based / etc."],
  ["location", "string", "No", "Or \"Online\"."],
  ["whenIs", "string", "No", ""],
  ["deadline", "date", "Yes", ""],
  ["description", "richtext", "Yes", ""],
  ["lookingFor", "string[]", "No", "Bullet points."],
  ["offer", "richtext", "No", ""],
  ["applyTo", "string", "Yes", "Email or external URL when no Room is linked."],
  ["adType", "enum", "Yes", "Regular / Spotlight (paid)."],
  ["price", "decimal", "Yes", "Charge for promotion. 0 for non-paid."],
  ["premium", "bool", "Yes", "Subscriber boost."],
  ["status", "enum", "Yes", "pending / live / paused / expired."],
  ["featured", "bool", "Yes", "Pinned to top of company's public profile."],
  ["submittedDate, expiresAt", "date", "Yes/No", ""],
  ["views, applicants", "int", "Yes", "Aggregated counters."],
]));

children.push(h2("Conversation & Message"));
children.push(p("Conversation: id, companyId, kind (\"team_dm\" / \"team_room\" / \"artist_dm\"), participantIds[], unreadByMember{}, lastMessageAt."));
children.push(p("Message: id, conversationId, fromMemberId (or fromArtistId), text, attachments[], createdAt, readBy[]."));

children.push(h2("Notification"));
children.push(p("id, companyId, recipientMemberId, cat (team / system / room / client), icon, color, title, body, link {context, id}, read, createdAt. Created by triggers on application submit, vote, follow, message, status change, deadline approaching, etc."));

children.push(h2("News post"));
children.push(p("id, companyId, title, excerpt, body, coverImage, externalUrl, publishedAt, hidden. External-URL posts open in a new tab; in-app posts have a full-text reader (post-MVP)."));

children.push(h2("MediaItem"));
children.push(p("id, ownerType (\"company\" / \"artist\"), ownerId, type (photo / video), url, thumbnail, title, description, location, tags[], pinnedToTop, order, createdAt."));

children.push(h2("PublicTeam member"));
children.push(p("id, companyId, name, role, photo, artistId (optional link to an Artist), order. Display-only — distinct from Membership."));

children.push(h2("Cardinal relationships"));
[
  "Company has many Memberships, Rooms, Artists, Showcases, Opportunities, NewsPosts, Conversations, Notifications, MediaItems, PublicTeam.",
  "User has many Memberships (one per company they belong to).",
  "Room has many Applications, RoomMaterials, RoomQuestions; can have one linked Opportunity.",
  "Application belongs to one Room and (optionally) one Artist.",
  "Showcase belongs to one Company and references many Artists (m:n).",
  "Artist belongs to one Company; may also be linked across companies via artistAccountId on the Artist app.",
].forEach(s => children.push(bullet(s)));

// ───────────────────────────────────────────────────────────────────
// 4. Auth & Onboarding
// ───────────────────────────────────────────────────────────────────
children.push(h1("4. Authentication & Onboarding", "auth"));

children.push(h2("Sign up"));
[
  "Email + password (with email verification), plus Google / Apple OAuth.",
  "Brand-new company sign-up creates a Company record + the user's Membership as Owner.",
  "Onboarding wizard captures: company name, type (enum), email, optional logo, accent color (preset palette), founded year. Skippable except name/type/email.",
  "After onboarding, drop into the Dashboard with empty states inviting first action (\"Create your first room\").",
].forEach(s => children.push(bullet(s)));

children.push(h2("Sign in"));
[
  "Email + password, Google / Apple OAuth, magic link (post-MVP).",
  "Password reset via email link.",
  "If user is in multiple companies → company switcher right after login. Stored as last-active in localStorage.",
  "Session: HTTPOnly secure cookie, JWT refresh, 30-day default with rolling expiry.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Invite team members"));
[
  "Owner / Admin invites by email + role (Admin / Member / External).",
  "External invites must specify scope (review-only, vote-only, view-shortlist) and at least one Room.",
  "Pending invite lives as a Membership with status=pending_invite. Resend / revoke supported.",
  "Accepting an invite for a user who already has a Lanced login adds the new Membership; otherwise sign-up flow runs first.",
].forEach(s => children.push(bullet(s)));

children.push(h2("External-reviewer login"));
[
  "External Reviewer receives a magic link with their invite token.",
  "On click, prompts for their name (first time) and lands them directly inside the assigned Room(s).",
  "They cannot navigate to other parts of the company app — sidebar is replaced with an \"External\" banner. They can switch back if they're also a regular member elsewhere.",
].forEach(s => children.push(bullet(s)));

// ───────────────────────────────────────────────────────────────────
// 5. IA
// ───────────────────────────────────────────────────────────────────
children.push(h1("5. Information Architecture", "ia"));
children.push(h2("Sidebar (left rail)"));
[
  "Top: company logo + name + type. Click = open public profile preview (\"self\" view).",
  "Primary nav: Dashboard, Showcases, Rooms, Artists, Network, Promote, Analytics, Aria, Messages.",
  "Bottom: Settings, Help, Notifications bell, current user avatar with sign-out menu.",
  "Collapsible — collapsed shows icons only (and tooltip on hover).",
].forEach(s => children.push(bullet(s)));

children.push(h2("Top bar (within page)"));
[
  "Page title, page-level actions (e.g. New Room, New Showcase).",
  "Notifications bell (round, with unread badge).",
  "Universal Aria search trigger (post-MVP).",
].forEach(s => children.push(bullet(s)));

children.push(h2("Mobile nav"));
[
  "Bottom tab bar: Home (Dashboard), Rooms, Artists, Messages, More.",
  "More popup contains: Company Profile, Settings, Network, Promote, Analytics.",
  "No left sidebar on mobile.",
].forEach(s => children.push(bullet(s)));

// ───────────────────────────────────────────────────────────────────
// 6. Dashboard
// ───────────────────────────────────────────────────────────────────
children.push(h1("6. Dashboard", "dashboard"));
children.push(lead("Default landing page. The company's home base — surfaces what needs attention today."));

children.push(h2("Sections"));
children.push(h3("Hero greeting"));
children.push(p("\"Good morning, {first name}\" + a subtitle that reflects current state (\"You've got 12 unreviewed candidates across 3 rooms\")."));

children.push(h3("Quick actions"));
children.push(p("Cards for: Create Room, Add Artist, Build Showcase, Post on Open Board, View Analytics."));

children.push(h3("Active rooms"));
children.push(p("Top 3–5 published rooms with: title, banner thumbnail, status, total applicants, unreviewed count, deadline countdown. Click → open the room."));

children.push(h3("Pending requests"));
children.push(p("Client showcase requests, profile-update requests artists have sent, application invitations. Each row has approve/decline."));

children.push(h3("Recent activity"));
children.push(p("Mixed feed: new applications, comments from team, votes, status changes. Same shape as notifications but condensed."));

children.push(h3("Tracking"));
children.push(p("Showcase share-link views, application source breakdown, conversion stats. Click into Analytics for full view."));

children.push(h2("Empty states"));
[
  "First room: a guided 3-step wizard (post → invite team → preview application form).",
  "First showcase: \"Build a curated set of artists for clients\" with sample.",
].forEach(s => children.push(bullet(s)));

children.push(h2("API endpoints"));
[
  "GET /companies/:id/dashboard — composite payload covering all sections (rooms, requests, activity, tracking).",
  "WebSocket subscription on activity for live updates.",
].forEach(s => children.push(bullet(s)));

// ───────────────────────────────────────────────────────────────────
// 7. Showcases
// ───────────────────────────────────────────────────────────────────
children.push(h1("7. Showcases", "showcases"));
children.push(lead("Curated list of artists shared with a client via a branded link. Primarily used by casting agencies and talent agencies."));

children.push(h2("Showcase list page"));
[
  "Grid or list view of showcases.",
  "Card shows: title, cover image, artist count, status (draft/published), share-link copy button, view count, last viewed by.",
  "Filters: status, sort (recent / most-viewed / a-z).",
  "Top action: New Showcase.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Showcase editor (in-context)"));
[
  "Tabs / sections: Artists, Layout & Branding, Share & Permissions, Analytics, Comments, Activity.",
  "Artists: add/remove from artist DB, drag to reorder, set the featured artist (rendered first on client view).",
  "Layout & Branding: choose template (PRESENT_TEMPLATES — preset combinations of bg / accent / fonts), accent color, background color, title color, body color, title font, body font, layout (grid / masonry / story), banner style.",
  "Share & Permissions: shareable URL, require login (email gate), require password, welcome message, toggles for: allow client to respond per-artist (selected/declined/maybe), allow comments, allow per-artist requests (e.g. comp card request), share specs (comp card visibility), expiry (post-MVP).",
  "Analytics: view count, unique visitors, average time on page, per-artist view distribution, selection breakdown (selected / declined), comment count.",
  "Comments: timeline of client-submitted comments, threaded by artist when applicable. Replies from team supported.",
  "Activity: log of who viewed when (login required mode only).",
].forEach(s => children.push(bullet(s)));

children.push(h2("Client-facing showcase page"));
[
  "Custom branded — uses showcase.branding for colors, fonts, layout.",
  "Login gate (if enabled): email + optional password. \"Welcome message\" shown above gate.",
  "Hero: showcase title, optional intro. \"Interested?\" floating button (post-MVP marketing).",
  "Artist gallery in chosen layout. Click an artist → detail view: media carousel (photos + videos), bio, experiences/educations as cards, comp card (if shareSpecs), client-action toolbar.",
  "Client actions per artist: Select / Decline / Maybe (if allowRespond), Comment (if allowComments), Request comp card (if allowRequests).",
  "Footer: \"Powered by Lanced\".",
  "Real-time chat between client and team (post-MVP).",
].forEach(s => children.push(bullet(s)));

children.push(h2("API endpoints"));
[
  "GET /showcases — list",
  "POST /showcases — create",
  "GET /showcases/:id — detail (for editor)",
  "PATCH /showcases/:id — update meta + branding",
  "POST /showcases/:id/artists — set ordered artist list",
  "POST /showcases/:id/share — generate / regenerate share URL",
  "DELETE /showcases/:id",
  "Public: GET /s/:shareId — fetch showcase for client (validates auth/password against shareSettings)",
  "Public: POST /s/:shareId/select — record select/decline/maybe",
  "Public: POST /s/:shareId/comment — leave comment",
  "Public: POST /s/:shareId/request — submit a request (e.g. comp card)",
].forEach(s => children.push(bullet(s)));

children.push(h2("Edge cases"));
[
  "Removing an artist from the database mid-showcase: showcase row marked \"unavailable\" with the artist's last-known card snapshot, not a 404.",
  "Toggling shareSpecs after the showcase is shared invalidates client-cached responses.",
  "Hard-deleting a showcase requires confirm if any client has interacted with it (preserves analytics for the company even if the link 410s).",
].forEach(s => children.push(bullet(s)));

// ───────────────────────────────────────────────────────────────────
// 8. Rooms
// ───────────────────────────────────────────────────────────────────
children.push(h1("8. Rooms (Castings)", "rooms"));
children.push(lead("The biggest surface in the app. End-to-end audition / casting management."));

children.push(h2("Room lifecycle"));
[
  "draft — being created, not visible to applicants.",
  "published — accepting applications. Shows up on company's public profile, on the open board if linked, and on share URL.",
  "closed — past deadline, no new applications. Selections continue.",
  "archived — read-only. Hidden from default lists.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Rooms list page"));
[
  "Tabs: Active / Drafts / Closed / Archived.",
  "Card per room: banner thumbnail, title, type, status pill, total applicants, unreviewed count, deadline (with countdown), last activity.",
  "Search bar, filter (artist type, format, status, employment).",
  "Sort: recent / deadline / most applicants.",
  "Top action: Create Room.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Create / edit a Room"));
children.push(h3("Wizard pages (collapsable groups within Room → Settings)"));
[
  "Basics: title, description, opportunityType, format, contracts, banner image, location.",
  "What we're looking for: bullet list (lookingFor) + free description.",
  "Roles: list of role names + slot counts.",
  "Dates: deadline, results date, casting / rehearsal / fitting / shooting dates. Switch single-day vs multi-date.",
  "Materials: enable preset materials (Headshot, Showreel, CV, Motivation Letter) and add custom items. Each is required y/n.",
  "Questions: text / yesno / multi-choice. Multi-choice has its own options array.",
  "Profile fields: which artist-profile fields to request from applicants (age, gender, location, languages, agency rep).",
  "Workflow: enable Shortlist, Waitlist, Early Invites, Voting (text or numeric), Batches (assign a number range to each reviewer), Rounds (multi-stage callbacks).",
  "Team: who can review (Members + Externals). Per-person scope set when added.",
  "Sharing: shareId, password / login gate, welcome message.",
  "Marketing (separate tab — see chapter 13).",
].forEach(s => children.push(bullet(s)));

children.push(h2("Inside a Room (single-room view)"));
children.push(h3("Top bar"));
children.push(p("Back · room title (with status pill) · Share · Publish (toggles to Published label) · Preview (opens public Application Form). Bell on the far right."));

children.push(h3("Sub-tabs"));
[
  "Candidates — primary workflow.",
  "Rounds — when room.enableRounds.",
  "Marketing — apply preview, social-asset generator, analytics.",
  "Settings — the wizard from above, in-place.",
].forEach(s => children.push(bullet(s)));

children.push(h3("Candidates view (the heart of the app)"));
[
  "Toolbar: search, filter (advanced), view toggle (cards / list / pool / batches), Add Candidate (manual), Export.",
  "Status chips along the top: New / Shortlisted / Potential / Selected / Not Selected. Click filters by status.",
  "Cards view (default): 4-col grid (responsive). Each card shows: photo, candidate number, status badge, name, role/labels, hover-on-grayscale-off media. Click → candidate detail.",
  "List view: dense table with photo, name, role, location, applied date, reviewed-by avatars, status, labels.",
  "Pool view (when batches enabled): chip row of reviewers; selecting a reviewer scopes to their assigned batch.",
  "Batches view: assigned ranges shown in a Kanban-like swim-lane.",
  "Filters (advanced): role, artist type, style, skills, gender, ethnicity, nationality, location, age min/max, height min/max, employment, availability, assigned-to-me, still-to-vote, plus question-answers (each multi/yesno question becomes a chip-multi filter).",
  "Bulk actions: change status, add label, bulk-message, send rejection template.",
].forEach(s => children.push(bullet(s)));

children.push(h3("Candidate detail (full-page view inside the room)"));
[
  "Top: back, candidate name + #number, prev/next arrows, kebab menu (Send Quick Message, Request Missing Materials, Add to Showcase, Add to Database, …).",
  "Three-column layout on desktop:",
].forEach(s => children.push(bullet(s)));
children.push(bullet("Left: media (photo carousel, video tabs with thumbnails, plays inline).", 1));
children.push(bullet("Center: motivation, Comp Card (specs — agency app only), Additional Questions (numbered Q&A from the room's questions), Experiences + Training & Education side-by-side as structured cards.", 1));
children.push(bullet("Right: status buttons (Selected / Shortlisted / Potential / Not Selected with rejection-reason picker), team votes (when enabled), reviewers list, labels, notes.", 1));
[
  "Mobile: stacked.",
  "Comp Card: company app hides this; agency app shows it because comp-card data is the agency's bread-and-butter.",
  "Additional Questions: pulls from the room's questions and the candidate's answers map; numbered.",
].forEach(s => children.push(bullet(s)));

children.push(h3("Rounds (callbacks / multi-stage)"));
[
  "When room.enableRounds, a Rounds tab appears.",
  "Each Round has: name (\"Final callbacks\"), date, slots, participantIds (drawn from candidates).",
  "Per-round voting (yes / maybe / no) and notes per voter.",
  "Walk-ins: artists not in the room added at the round level.",
  "Round-level results page lists vote tallies and a \"share results\" toggle that creates Round 2 etc.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Public Application Form (artist side)"));
children.push(p("Rendered from the same RoomApplicationView component used inside the modal popup on the public profile and the full-page route at /apply/:shareId. See chapter 11 for layout. Submitting creates an Application record."));

children.push(h2("API endpoints"));
[
  "GET /rooms — list (with filters).",
  "POST /rooms — create.",
  "GET /rooms/:id — detail.",
  "PATCH /rooms/:id — update.",
  "POST /rooms/:id/publish, /close, /archive.",
  "GET /rooms/:id/candidates?filters — list candidates.",
  "POST /rooms/:id/candidates — add manual candidate.",
  "GET /candidates/:id — detail.",
  "PATCH /candidates/:id — status / labels / rejectionReason / notes / votes.",
  "POST /candidates/:id/notes, /materials, /requestMissingMaterials.",
  "POST /rooms/:id/rounds, /rounds/:id/participants, /rounds/:id/votes.",
  "Public (no auth): GET /apply/:shareId, POST /apply/:shareId.",
  "Realtime: subscribe per-room for vote / status / note / new-application updates.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Edge cases"));
[
  "Two reviewers updating the same candidate's status concurrently: server resolves via last-write-wins with a small toast on the loser's client.",
  "Closing a room: prevents new applications immediately, preserves all existing data.",
  "Deleting a candidate is soft (status='deleted', kept for analytics).",
  "Multi-pin: only one room per company can be featured at a time. Pinning a new one unpins the previous (server-enforced).",
].forEach(s => children.push(bullet(s)));

// ───────────────────────────────────────────────────────────────────
// 9. Artists DB
// ───────────────────────────────────────────────────────────────────
children.push(h1("9. Artist Database", "artists"));
children.push(lead("The company's roster (agency: artists they represent; company: ensemble + freelance pool)."));

children.push(h2("List page"));
[
  "Toolbar: search, view toggle (cards / list), Add Artist, filter, sort.",
  "Cards: 3:4 photo, grayscale-to-color hover, name + role + city pills overlay, click → detail.",
  "Filter sheet (right-anchored): artistType, style, skills, gender, ethnicity, nationality, location, age range, height range. Multi-select with chip toggles where applicable.",
  "Sort: name a-z, recently added, rating.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Artist detail"));
[
  "Header: photo, name, role, location, contact, edit / delete / send-invite.",
  "Tabs: Profile (all fields), Media (gallery), Experiences, Training & Education, Specs (Comp card), Castings (history of rooms applied), Notes, Activity.",
  "Edit modal mirrors the field map in chapter 3.",
  "If linked to a Lanced Artist account: profile fields are read-through; edit button → opens \"Request profile update\" — sends a request to the artist account.",
  "Add to Showcase from kebab.",
  "Add Artist (from form): manual entry. \"Invite to Lanced\" toggle sends them an invite to claim/own their profile.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Aria integration"));
children.push(p("Artists DB is one of Aria's primary search surfaces. Free-form query (\"a tall male contemporary dancer based in Berlin available in October\") returns ranked artist matches with rationale. See chapter 15."));

children.push(h2("API endpoints"));
[
  "GET /artists — list with filters",
  "POST /artists — create (manual)",
  "GET /artists/:id — detail",
  "PATCH /artists/:id — update",
  "DELETE /artists/:id — soft delete",
  "POST /artists/:id/invite — send invite to claim profile",
  "POST /artists/:id/request-update — ask linked Artist account to refresh profile",
].forEach(s => children.push(bullet(s)));

// ───────────────────────────────────────────────────────────────────
// 10. Network
// ───────────────────────────────────────────────────────────────────
children.push(h1("10. Network", "network"));
children.push(lead("Discovery surface — both for finding artists outside the company's own DB and for finding companies (collaborators, clients, peers)."));

children.push(h2("Tabs"));
children.push(p("People (artists from the broader Lanced network) | Companies (other companies on Lanced)."));

children.push(h2("Layout"));
[
  "Toolbar: search, view toggle (list / cards / map), filters.",
  "People grid: 5 columns (responsive 4 / 3 / 2). Card matches Artists DB style.",
  "Companies grid: 3 columns (responsive 2 / 1). Card has 16:7 banner + circular logo + name + type · location + style chips + footer with X open roles + Follow.",
  "Active Hiring chip on company banner when openPositions > 0.",
  "Map view: Leaflet with custom pins (initials avatar + accent ring). Popup shows mini card; click pin → open card / profile.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Filters"));
children.push(h3("People mode"));
children.push(p("Type, style, skills, gender, ethnicity, nationality, location, age, height."));
children.push(h3("Company mode"));
[
  "Type (Company / Casting Agency / Talent Agency / Studio / Theater / etc).",
  "Hiring status (chip toggle: All / Currently hiring / Not hiring).",
  "Location (text).",
  "Styles & genres (chip multi-select).",
].forEach(s => children.push(bullet(s)));

children.push(h2("Card click"));
[
  "Person card → opens the artist's public profile (Artist app).",
  "Company card → opens the Public Company Profile overlay (chapter 11).",
].forEach(s => children.push(bullet(s)));

// ───────────────────────────────────────────────────────────────────
// 11. Public Company Profile
// ───────────────────────────────────────────────────────────────────
children.push(h1("11. Public Company Profile", "profile"));
children.push(lead("In-app overlay rendered as a full-screen experience. The same component is used for the company's own preview (\"self\") and for any other company in the network (\"artist\" viewer)."));

children.push(h2("Entry points"));
[
  "Sidebar logo click (own profile, owner mode).",
  "Mobile More popup → Company Profile.",
  "Network company card click (other company, artist mode).",
  "Similar Companies side-panel link from another open profile.",
  "Future: deep link /c/:slug (post-MVP public web).",
].forEach(s => children.push(bullet(s)));

children.push(h2("Hero"));
[
  "16:5 banner (image or accent-color gradient fallback).",
  "Floating identity card (translucent blur, bottom-left of banner) holding: 64px logo, name + verified tick, type · location · followers, tagline, ● Hiring pill that scrolls to Jobs.",
  "Parallax: banner translates at 0.35× scroll, card lifts at 0.12× and fades only when reaching the topbar.",
  "Owner mode: \"Edit banner\" chip in top-right of banner.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Sticky tab bar"));
children.push(p("Tabs: Jobs (always) · Discover (when media exists) · People (when team or artists exist) · News (when news exists or owner)."));
children.push(p("Sticks flush to topbar (top: var(--pcp-topbar-h)). Active tab gets accent underline."));

children.push(h2("Two-column body"));
children.push(h3("Main column"));
children.push(p("Renders one tab at a time."));
children.push(h4("Jobs tab"));
[
  "Section header: \"Open roles & opportunities\" + count, list/calendar view toggle, \"Embed on your site\" chip (owner only).",
  "List view: featured opportunity hero card at top + remaining opportunities below as compact cards. Heart icon on each card (artist viewer) toggles save state.",
  "Calendar view: month grid Mon→Sun with prev/next/Today nav and a 3-color legend (Deadline / Casting / Period). Event pills clickable to open the application popup.",
  "Each opportunity click opens the Application popup.",
].forEach(s => children.push(bullet(s)));

children.push(h4("Discover tab"));
[
  "4-column media grid (responsive 3 / 2). Photos + videos.",
  "Video tiles show a translucent play overlay.",
  "Click any tile → fullscreen lightbox with prev/next arrow keys, ESC close, title / description / location / tags below the media.",
  "Owner: \"+ Add\" chip opens an Add to Media right-anchored pane (drop zone, title, description, location, chip-tag input, current-media list with delete).",
].forEach(s => children.push(bullet(s)));

children.push(h4("People tab"));
[
  "Team subsection (if team members exist) followed by Artists subsection (if artists exist).",
  "Both render as 4-col 3:4 candidate-style cards with name + role/city pills overlay. Click → artist profile (toast for now).",
].forEach(s => children.push(bullet(s)));

children.push(h4("News tab"));
[
  "Cards: 200px cover thumbnail + body (date pill + title + 2-line excerpt + Read more).",
  "External-URL posts get an \"External\" pill and open in a new tab.",
  "Owner: \"+ Add post\" pane (title, excerpt, optional external URL, optional cover upload).",
].forEach(s => children.push(bullet(s)));

children.push(h3("Right rail (sticky)"));
[
  "About card: 240-char preview + Read more (opens centered modal with full text).",
  "Links & contact: chip pills for Website / Email / IG / TikTok / LinkedIn. Below: \"Message {FirstName}\" primary button (artist viewer, when messageEnabled is on).",
  "You might also like: list of 4 other companies from the network. Click → opens that company's profile.",
  "On mobile (≤980px) the rail reorders to appear above the main column via grid-template-areas.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Application popup"));
children.push(p("Renders the shared RoomApplicationView component:"));
[
  "Cover banner (16:6, gradient fallback).",
  "Type chip · title · company byline.",
  "Date strip pinned at top: Deadline (red) · Casting · Rehearsals · Fittings · Period · Results.",
  "Description (full).",
  "What we're looking for: lookingFor bullets + structured kv (Roles / Format / Contracts / Location / Requested profile info).",
  "Offer (accent block).",
  "Materials we'll ask for: list with type icons + Required/Optional pills.",
  "Questions in the application: numbered list with answer-type hint.",
  "AI fit suggestion (artist viewer only, top-of-CTA): \"Why this matches you\" with up to 3 reasons.",
  "Two-stage Apply: stage 1 = single Apply button. Click wipes form area → stage 2 \"Sign in to apply\" card with Sign in with Lanced / Create new account, Back to opportunity link.",
  "Owner: Preview tag + \"Pin as featured\" / \"Embed this role\" buttons.",
  "ESC + backdrop close.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Owner-side editing"));
[
  "Each section has an Edit / + Add chip visible only to owner.",
  "All edit actions open the same right-anchored overlay pane (matches FilterPanel idiom).",
  "Settings pane covers section visibility toggles + accent color picker + messageEnabled toggle.",
].forEach(s => children.push(bullet(s)));

children.push(h2("API endpoints"));
[
  "GET /companies/:id/profile — composite payload for the public profile.",
  "PATCH /companies/:id/profile — partial updates (sections, branding, toggles).",
  "POST /companies/:id/media, DELETE /companies/:id/media/:mediaId.",
  "POST /companies/:id/news, PATCH /companies/:id/news/:postId, DELETE /companies/:id/news/:postId.",
  "POST /companies/:id/follow, DELETE /companies/:id/follow.",
  "POST /companies/:id/message — sends a message from artist (must be an Artist principal) to the company.",
  "GET /c/:slug (public, unauthenticated) — same payload, with sensitive fields stripped.",
].forEach(s => children.push(bullet(s)));

// ───────────────────────────────────────────────────────────────────
// 12. Promote
// ───────────────────────────────────────────────────────────────────
children.push(h1("12. Promote (Open Board)", "promote"));
children.push(lead("Public, cross-Lanced board where companies post opportunities to reach artists outside their own following."));

children.push(h2("Promote tab inside the company app"));
[
  "Sub-tabs: Listings (own) / Boosts / Performance / Pricing.",
  "Listings: list of own Opportunity records with filter + sort. Status pills (live, pending review, paused, expired). Inline analytics (views, applicants).",
  "Create New Listing: 5-step wizard — Basics → Description / Looking For / Offer → Logistics (location, deadline, dates) → Promotion (Regular vs Spotlight, premium boost) → Review & submit. Spotlight = paid promotion, Regular = free organic.",
  "Boosts: pricing tiers, what each tier does (top of board, more impressions, etc).",
  "Performance: charts of view counts, application counts, click-through, conversion.",
  "Pricing: marketing copy + Stripe checkout for boost purchases.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Public Open Board (post-MVP web surface)"));
[
  "Lanced.app/board — searchable, filterable feed of all live opportunities.",
  "Filters mirror artist DB: artist type, style, location, deadline, format.",
  "Click an opportunity → public Application Form (same RoomApplicationView).",
].forEach(s => children.push(bullet(s)));

children.push(h2("API endpoints"));
[
  "GET /opportunities — list (own).",
  "POST /opportunities — create.",
  "PATCH /opportunities/:id — update / change status.",
  "POST /opportunities/:id/boost — purchase boost.",
  "Public: GET /board, GET /board/:opportunityId.",
].forEach(s => children.push(bullet(s)));

// ───────────────────────────────────────────────────────────────────
// 13. Marketing tab
// ───────────────────────────────────────────────────────────────────
children.push(h1("13. Marketing (Room-level)", "marketing"));
children.push(lead("Inside a Room, the Marketing sub-tab is where the company turns the casting into outbound content."));

children.push(h2("Sections"));
children.push(h3("Apply preview"));
children.push(p("Inline preview of the public Application Form for this room. Owner sees it as artists will. Edit-in-place sometimes available."));

children.push(h3("Assets"));
children.push(p("Auto-generated social-media graphics in three formats:"));
[
  "Story (1080×1920, 9:16) — Instagram / TikTok story.",
  "Feed (864×1080, 4:5) — Instagram feed / square-tall.",
  "Square (1080×1080, 1:1).",
].forEach(s => children.push(bullet(s)));
children.push(p("Each generated by a canvas-rendered template using the room's banner + title + deadline + a CTA. Download as PNG."));

children.push(h3("Analytics"));
[
  "Public-page views, application source, conversion rate.",
  "Aggregated per-channel data (placeholder for IG / TT / web ref tracking).",
].forEach(s => children.push(bullet(s)));

children.push(h3("Promote-this-room shortcut"));
children.push(p("CTA to create / link an Open Board listing pre-filled from this room."));

// ───────────────────────────────────────────────────────────────────
// 14. Analytics
// ───────────────────────────────────────────────────────────────────
children.push(h1("14. Analytics", "analytics"));
children.push(lead("Company-wide metrics surface."));

children.push(h2("Sections"));
[
  "Overview KPIs: total applications this month, response rate, avg time-to-respond, follower count, profile views.",
  "Applications timeseries — line chart of applications per day for last 30 / 90 / 365 days.",
  "Applicant geography — choropleth world map (already implemented client-side via d3-geo + topojson).",
  "Top performing rooms — table sorted by applications.",
  "Showcase performance — table of recent showcases with views and selection rates.",
  "Recruitment funnel — applied → reviewed → shortlisted → selected. Conversion percentages between stages.",
].forEach(s => children.push(bullet(s)));

children.push(h2("API endpoints"));
[
  "GET /analytics/overview",
  "GET /analytics/applications?range=30d",
  "GET /analytics/geography",
  "GET /analytics/funnel",
  "Caching: analytics queries cached for 5 minutes; recompute on change.",
].forEach(s => children.push(bullet(s)));

// ───────────────────────────────────────────────────────────────────
// 15. Aria
// ───────────────────────────────────────────────────────────────────
children.push(h1("15. Aria — AI Casting Assistant", "aria"));
children.push(lead("Chat-like surface for finding artists from the company's DB and the broader Lanced network using natural language."));

children.push(h2("Page layout"));
[
  "Centered single-column page, animated background blobs.",
  "Hero: \"Aria\" mark + \"Tell me what you're looking for…\" textarea + Attach (room context) + Send button.",
  "Below the input, when a query is run: \"What I understood:\" chip strip showing parsed structured fields (discipline / style / location / gender / availability / etc).",
  "Results: ranked list of artist matches. Each match: rank number, photo, name + meta, match percentage with bar, highlight (\"Tall (5'11\\\") with the build you're looking for\"), rationale text, thumbs-up / down feedback button.",
  "Footer actions: \"Send all to a new room\", \"Add to existing room\", \"Save as Showcase\".",
].forEach(s => children.push(bullet(s)));

children.push(h2("Behavior"));
[
  "Parsing pipeline: tokenize query → extract structured fields (discipline, style, lineage like NDT/Forsythe, location, gender, height, availability month). On the API side use an LLM with function-calling.",
  "Match scoring: weighted combination of profile-field overlap, prior collaboration history, location proximity, availability match.",
  "Feedback (👍/👎) feeds the ranker.",
  "Aria can be pinned to a specific room (Attach) — uses room.lookingFor + roles + format as additional weights.",
].forEach(s => children.push(bullet(s)));

children.push(h2("API endpoints"));
[
  "POST /aria/query — { text, attachedRoomId? } → { understood, results: [{ artistId, score, rationale, highlight }] }.",
  "POST /aria/feedback — { resultId, value: up|down }.",
  "POST /aria/save — convert current results into a new Showcase or Room.",
].forEach(s => children.push(bullet(s)));

// ───────────────────────────────────────────────────────────────────
// 16. Messages
// ───────────────────────────────────────────────────────────────────
children.push(h1("16. Messages", "messages"));
children.push(lead("Internal team chat + DMs to artists who follow / applied. Two list segments — Team and Artists."));

children.push(h2("Layout"));
[
  "Two-column: conversation list left, message thread right.",
  "List shows: avatar / group icon, last-message preview, time, unread badge.",
  "Thread: standard chat — message bubbles, timestamps, typing indicator (post-MVP), file attachments, link previews (post-MVP).",
  "Compose: rich text light, paperclip, send.",
  "Header in thread: participant info, link to artist profile / room context.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Conversation kinds"));
[
  "team_dm: 1:1 between members.",
  "team_room: room-scoped group chat (auto-created when a room has team members).",
  "artist_dm: between a member and an artist (only if the artist follows the company OR has applied to one of its rooms).",
].forEach(s => children.push(bullet(s)));

children.push(h2("Quick message from candidate detail"));
children.push(p("From inside a Room → candidate detail → kebab → Send Quick Message. Composes a message in the artist_dm conversation prefilled with room context."));

children.push(h2("API endpoints"));
[
  "GET /conversations — list (filtered by kind).",
  "GET /conversations/:id/messages?cursor=…",
  "POST /conversations/:id/messages",
  "POST /conversations — create or fetch existing.",
  "Realtime: WebSocket subscription per conversation.",
].forEach(s => children.push(bullet(s)));

// ───────────────────────────────────────────────────────────────────
// 17. Notifications
// ───────────────────────────────────────────────────────────────────
children.push(h1("17. Notifications", "notifications"));

children.push(h2("Bell"));
[
  "Round button (38px circle) in the topbar of every page. Unread badge top-right.",
  "Click → right-anchored panel listing notifications grouped by category.",
  "Filter: All / Team / Rooms / Clients / System.",
  "Mark all as read button at top.",
  "Click a notification → navigates to its link target (room, candidate, showcase, message thread).",
].forEach(s => children.push(bullet(s)));

children.push(h2("Triggers (server-side)"));
[
  "New application submitted → room owner + assigned reviewers.",
  "Status change on an application I reviewed → me.",
  "Comment / vote / note from a teammate on a candidate I'm reviewing → me.",
  "Showcase opened / commented on / select-decline by a client → owner.",
  "Application deadline approaching (T-2 days) → owner.",
  "Daily summary digest (8am local) → opt-in.",
  "Follow confirmation (\"Following X — you'll be notified when X posts new opportunities\") → fired client-side; mirrored server-side when artist follows.",
  "External-reviewer activity → owner (\"Sarah Chen is currently reviewing candidates\").",
].forEach(s => children.push(bullet(s)));

children.push(h2("Preferences"));
children.push(p("Per-category toggles for in-app vs email: Team activity, Room updates, Client interactions, System alerts. Per-room mute. Quiet hours."));

// ───────────────────────────────────────────────────────────────────
// 18. Settings
// ───────────────────────────────────────────────────────────────────
children.push(h1("18. Settings", "settings"));
children.push(lead("Agency / company-level settings. Sub-tabs."));

children.push(h2("Profile"));
children.push(p("Company name, type, address, website, email, instagram, tiktok, logo, banner. Same fields as Company entity."));

children.push(h2("Public profile"));
children.push(p("Tagline, accent color picker, founded year, about (long-form), section-visibility toggles (Artists, Team, Media, News), messageEnabled. Live preview on the right."));

children.push(h2("Team"));
children.push(p("List of Memberships. Add Member (email + role + optional jobTitle). Edit role / jobTitle. Resend / revoke invite. Remove member (confirmation modal — what happens to their reviews? Default: anonymized as \"Former member\")."));

children.push(h2("External reviewers"));
children.push(p("Sub-section of Team. Add new — required: email, name, room(s), scope. List of active externals with last-active timestamp."));

children.push(h2("Public team (display)"));
children.push(p("Manage the team members shown on the Public Company Profile (separate from Membership). Add member (name, role, photo, optional artistId link). Drag to reorder."));

children.push(h2("Branding for showcases (Present)"));
children.push(p("Default brand for all new showcases: accent color, font pair preset, hero media, default layout, banner style."));

children.push(h2("Plans & Billing"));
children.push(p("Subscription tier, payment method, invoices, usage (rooms / showcases / opp board credits), upgrade / downgrade. Stripe-backed."));

children.push(h2("Notifications"));
children.push(p("See chapter 17 — preferences live here."));

children.push(h2("Integrations"));
children.push(p("API keys (post-MVP), webhooks, calendar export iCal feed, embed widget management."));

children.push(h2("Account"));
children.push(p("Personal: name, email, avatar, password change, 2FA. Sign out everywhere."));

// ───────────────────────────────────────────────────────────────────
// 19. Permissions & Sharing
// ───────────────────────────────────────────────────────────────────
children.push(h1("19. Permissions & Sharing", "permissions"));

children.push(h2("Default role caps"));
children.push(fieldsTable([
  ["Owner", "Everything", "—", "Including delete company / billing."],
  ["Admin", "All resources", "Everything except delete company / billing", "Can manage Members but not Owners."],
  ["Member", "Read company-wide; write Artists DB, own Rooms (created by them), Showcases", "Cannot manage Members / billing", "Can be granted per-room reviewer access."],
  ["External", "Per-room read+vote+comment", "Anything else", "Scoped via Membership.roomScopes."],
]));

children.push(h2("Per-room access"));
[
  "teamMemberIds explicit list — only members listed can review.",
  "External Reviewers added via per-room scope.",
  "Sharing settings (shareSettings on the room) control public access.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Showcase sharing"));
[
  "shareId is the only durable URL component; can be regenerated.",
  "shareSettings.requireLogin: client must enter email; tracked per email.",
  "shareSettings.requirePassword: extra password gate.",
  "Per-feature toggles: allowRespond, allowComments, allowRequests, shareSpecs.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Audit log (post-MVP)"));
children.push(p("Server-side log of who changed what, when. Surfaced in Settings → Audit log for Owner / Admin."));

// ───────────────────────────────────────────────────────────────────
// 20. Mobile
// ───────────────────────────────────────────────────────────────────
children.push(h1("20. Mobile Experience", "mobile"));

children.push(h2("Layout differences"));
[
  "No left sidebar. Bottom tab bar (Home / Rooms / Artists / Messages / More).",
  "Top bar simplified — page title + bell + avatar.",
  "Right-anchored panes (filters, edit) become bottom sheets.",
  "Public profile rail re-orders above main content via CSS grid template areas.",
  "Floating identity card on profile becomes near-full-width with truncated tagline.",
  "Tabs scroll horizontally; opportunity cards stack with full-width CTA.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Touch interactions"));
[
  "Long-press on candidate card — multi-select.",
  "Swipe right on candidate in list — Shortlist.",
  "Swipe left — open kebab menu.",
  "Pinch-zoom in candidate media viewer.",
  "Pull to refresh on lists.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Native shell (post-MVP)"));
children.push(p("React Native or Capacitor wrapper. Push notifications via APNs / FCM. Camera / file pickers via native bridges."));

// ───────────────────────────────────────────────────────────────────
// 21. Integrations
// ───────────────────────────────────────────────────────────────────
children.push(h1("21. Integrations & Public Endpoints", "integrations"));

children.push(h2("Embed widgets"));
children.push(h3("Open roles widget (all roles)"));
children.push(p("Iframe + JS-widget options. URL: https://lanced.app/embed/jobs/{slug}?theme=light|dark&size=compact|full. Auto-refreshes content. Two flavors emitted from the modal:"));
[
  "<iframe src=\"…\" width=\"100%\" height=\"360|560\" frameborder=\"0\" …></iframe>",
  "<div data-lanced-jobs=\"{slug}\" data-theme=\"…\" data-size=\"…\"></div> + <script async src=\"https://lanced.app/embed.js\"></script>",
].forEach(s => children.push(bullet(s)));

children.push(h3("Single-opportunity widget"));
children.push(p("URL: https://lanced.app/embed/job/{slug}/{oppId}?theme=…. Card layout (cover + type + title + apply CTA)."));

children.push(h2("Public endpoints (read-only, no-auth)"));
[
  "GET /c/:slug — public profile JSON.",
  "GET /apply/:shareId — application page JSON.",
  "POST /apply/:shareId — submit (rate-limited).",
  "GET /board, GET /board/:id — Open Board.",
  "GET /embed/jobs/:slug — server-rendered HTML widget.",
  "GET /embed/job/:slug/:oppId — server-rendered HTML widget for one opp.",
  "GET /embed.js — small JS that hydrates data-lanced-jobs / data-lanced-job div elements.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Calendar export"));
[
  "Per-company iCal feed of upcoming room dates (deadlines, casting, rehearsals, fittings, period).",
  "Authenticated via signed token URL.",
  "Subscribed in Google Calendar / Outlook / Apple Calendar.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Webhooks (post-MVP)"));
[
  "application.created, application.status_changed, room.published, showcase.opened, opportunity.expired, follow.added.",
  "Configured per company; HMAC-signed.",
].forEach(s => children.push(bullet(s)));

children.push(h2("File storage"));
[
  "Object storage (S3-compatible) with signed-URL uploads from the client.",
  "Image processing pipeline: resize on upload to a small set of variants (avatar 96 / 192, banner 800 / 1600, gallery 1080 / 2160), all served via CDN.",
  "Videos uploaded via tus / multipart, transcoded to HLS for inline playback.",
].forEach(s => children.push(bullet(s)));

// ───────────────────────────────────────────────────────────────────
// 22. NFR
// ───────────────────────────────────────────────────────────────────
children.push(h1("22. Non-Functional Requirements", "nfr"));

children.push(h2("Performance"));
[
  "First contentful paint <1.5s on 4G for the dashboard.",
  "Candidate list of 200 items renders <300ms after data arrives.",
  "Public profile (signed-out) <2s TTFB cached at the edge.",
  "Embed widget <100KB gzipped, single request.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Accessibility"));
[
  "WCAG 2.1 AA target.",
  "Keyboard-first navigation across all panels (filter, edit pane, modals).",
  "ESC closes any modal / pane. Arrow keys navigate lightbox + candidate prev/next.",
  "Reduced-motion media query respected (parallax + animations).",
  "Color contrast ≥ 4.5:1 for body text.",
  "ARIA labels on all icon-only buttons.",
].forEach(s => children.push(bullet(s)));

children.push(h2("Internationalization"));
[
  "All UI strings sourced from a translation table; English first.",
  "Locales: en-GB (default), en-US, fr, de, es, ja (target).",
  "Date / number formatting via Intl APIs.",
  "RTL prep (logical CSS properties; no left/right hardcoded).",
].forEach(s => children.push(bullet(s)));

children.push(h2("Security & privacy"));
[
  "TLS only.",
  "Auth as described in chapter 4.",
  "Per-row authorization checks at the DB query layer (companyId scoping). Never trust client-passed companyId.",
  "GDPR: data export + deletion endpoints for User, Artist (linked or local), Application.",
  "Audit log of admin actions (post-MVP).",
  "PII minimization in logs.",
  "Signed URLs for media (short TTL).",
  "Rate-limit public application submission (per-IP + per-shareId).",
].forEach(s => children.push(bullet(s)));

children.push(h2("Observability"));
[
  "Structured server logs with request IDs.",
  "Client error monitoring (Sentry-style).",
  "Product analytics: page views, feature usage, conversion funnel.",
  "Uptime monitoring on public endpoints (apply, embed, profile).",
].forEach(s => children.push(bullet(s)));

// ───────────────────────────────────────────────────────────────────
// 23. Open questions
// ───────────────────────────────────────────────────────────────────
children.push(h1("23. Open Questions & Roadmap", "open"));

children.push(h2("Open product questions"));
[
  "Pricing model: per-seat, per-room, per-showcase, or flat tiers? Probably flat tiers with seat caps.",
  "How do we treat the same artist showing up across multiple companies' DBs — one canonical Lanced profile? Mostly yes, but agencies want their own enriched data.",
  "Does the Open Board have moderation? MVP: auto-publish + admin review queue for spotlighted listings.",
  "Multi-language room postings: should artists see translated previews or originals only?",
  "What's the retention policy for closed rooms? 24 months? Forever in archive?",
  "Do external reviewers get notification emails by default?",
].forEach(s => children.push(bullet(s)));

children.push(h2("Roadmap signals"));
children.push(h3("Near-term (post-MVP, 1–3 months)"));
[
  "Real-time team collaboration in candidate view (live cursors / typing).",
  "Calendar export iCal feed.",
  "Stripe-backed paid Open Board boosts.",
  "Recently viewed companies on dashboard.",
  "Mutual connections badge on company cards.",
].forEach(s => children.push(bullet(s)));

children.push(h3("Mid-term"));
[
  "Native mobile (RN or Capacitor).",
  "Aria becomes a true conversational agent (multi-turn, refinements).",
  "Custom domains for public profile (theaterlanced.com routes through Lanced).",
  "Webhooks + public API for integrations.",
  "Embed widget customization (CSS variables exposed).",
  "Past productions / Press section on public profile.",
].forEach(s => children.push(bullet(s)));

children.push(h3("Long-term"));
[
  "Two-sided feed: artists discover companies the same way they discover opportunities.",
  "Lanced Marketplace: paid services around casting (legal templates, contract automation, booking flows).",
  "Industry-vertical templates (theater company / commercial agency / festival programmer / dance company).",
].forEach(s => children.push(bullet(s)));

children.push(h2("Definition of done for v1"));
children.push(p("All chapters 4–18 implemented for the Company app, with the Artist app reaching feature-parity for the surfaces it owns. Public profile + Application Form work signed-out. Embed widget renders. Aria delivers ranked artist matches with rationale. Mobile usable for the primary review and apply flows. NFR targets met."));

children.push(sp(2)[0]);
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [t("End of document · Lanced for Companies — PRD v1.0", { italics: true, color: MUTED, size: 18 })],
}));

/* ────────────────────────────────────────────────────────────────────
   Build the document
─────────────────────────────────────────────────────────────────── */
const doc = new Document({
  creator: "Lanced",
  title: "Lanced for Companies — PRD",
  description: "Product Requirements Document for the Company app",
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 40, bold: true, font: FONT, color: "1A1A1E" },
        paragraph: { spacing: { before: 320, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: FONT, color: "1A1A1E" },
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
      { reference: "numbers", levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      ] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 }, // US Letter
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
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("Lanced-Company-PRD.docx", buf);
  console.log("Wrote Lanced-Company-PRD.docx (" + buf.length + " bytes)");
});
