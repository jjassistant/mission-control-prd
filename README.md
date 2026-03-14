# PRD: Mission Control Dashboard
**Status:** Draft v0.1  
**Created:** 2026-03-13  
**Owner:** Joey + JJ  
**Tier:** 3 (Full app, multi-week)

---

## Problem Statement

Joey's life runs across multiple domains — work (Snap), church, real estate, fitness, personal projects. Things 3 holds the task data, but it's a flat list manager. There's no unified view of what's actually happening across all domains, no way to see project health at a glance, no JJ-powered intelligence layer baked in.

The goal: a **mission control** — a visual, intelligent dashboard that makes Joey's entire operating system visible and actionable in one place.

---

## Vision

Think NASA mission control meets personal OS. At a glance:
- What are my active projects and their status?
- What's on my plate today, this week, this month?
- Where am I making progress? Where am I stalled?
- What does JJ think I should focus on right now?

Not just a prettier Things — a **live intelligence layer** on top of Joey's life.

---

## Core Principles

1. **Things 3 is the source of truth** — we read from and write to it; never duplicate data
2. **JJ as co-pilot** — the dashboard surfaces AI-driven insights, not just raw data
3. **Domain-aware** — understands that "church website" and "Snap Promote" are fundamentally different kinds of work
4. **Frictionless updates** — updating a task should take seconds, not clicks
5. **Beautiful** — aesthetics matter to Joey; this should feel premium

---

## Domains / Areas

| Domain | Color | Icon |
|--------|-------|------|
| Work (Snap) | Blue | 👻 |
| Church | Gold | ✝️ |
| Real Estate | Green | 🏠 |
| Fitness | Orange | 💪 |
| Personal / Learning | Purple | 🧠 |
| Family | Pink | 👶 |

---

## Core Features

### 1. 🗺️ Command Center (Home View)
The default view. A high-level snapshot:
- **Today's focus** — top 3 tasks JJ thinks matter most right now
- **Domain health meters** — each life area gets a visual status (Active / Stalled / On Fire 🔥)
- **Upcoming** — next 48 hours across all domains
- **JJ's take** — a short AI-written summary of Joey's week: wins, stalls, and what to push

### 2. 📋 Project Board
Kanban-style view of all active projects across all domains:
- Columns: `Backlog → In Progress → Blocked → Done`
- Filter by domain
- Drag to update status (syncs to Things via CLI/API)
- Each card shows: title, domain, due date, task count, last updated

### 3. ✅ Task View
Replaces the raw Things list with a smarter interface:
- Group by domain, project, or date
- Inline edit (title, due date, notes, priority)
- Quick-complete with keyboard shortcut
- Shows subtasks inline
- Natural language input: "Add: finish sermon outline, due Sunday, church"

### 4. 📊 Progress & Analytics
Weekly/monthly metrics:
- Tasks completed per domain (bar chart)
- Completion streaks
- Gym sessions logged (Mon/Wed/Fri)
- Current weight vs. target trend line
- Books read (0 → goal)

### 5. 🤖 JJ Panel (AI Sidebar)
A persistent right-hand panel where JJ:
- Shows the weekly brief / what's been done
- Surfaces stalled items and asks "should we reschedule this?"
- Flags tasks that haven't moved in 7+ days
- Offers to take action: "Want me to draft that church website plan?"

### 6. 🔔 Notification / Alert Feed
A live feed of:
- Tasks due today
- Overdue items
- JJ check-in results
- Trading brief summaries
- Gym check-in status

---

## Stretch Features (v2+)
- Calendar integration (Google Calendar overlay)
- Sermon prep tracker (Obsidian vault sync)
- Real estate deal pipeline (property tracking)
- Habit tracker (reading, gym, prayer)
- Mobile view (PWA or native)
- Voice input ("JJ, add a task…")

---

## Technical Approach

### Option A: Local Web App (Recommended for MVP)
- **Stack:** Next.js (or SvelteKit) + Tailwind CSS
- **Data:** Read from Things 3 SQLite DB directly via Node.js sqlite3
- **Write:** Use `things` CLI + URL scheme for updates
- **AI layer:** OpenClaw / Claude API for JJ panel
- **Hosting:** Local only (localhost), launched via menu bar or shortcut
- **Pros:** Fast, private, full control, no infra cost
- **Cons:** Desktop-only initially

### Option B: Electron App
- Wraps the web app in a native Mac shell
- Menu bar icon → opens dashboard
- Can run in background, show notifications
- More setup but feels more "native"

### Option C: Obsidian Plugin
- Render dashboard inside Obsidian (already open)
- Tighter integration with vault
- Limited in visual flexibility

**Recommendation:** Start with Option A (local Next.js app). Ship fast, iterate. Electron wrapper can come in v2.

---

## Data Architecture

```
Things 3 SQLite (read/write)
    ↓
Node.js API layer (Express or Next.js API routes)
    ↓
Dashboard UI (React/Svelte components)
    ↑
JJ (Claude API) — reads task data, writes insights
```

**Key Things 3 tables to map:**
- `TMTask` — tasks (title, due date, status, project, area, notes)
- `TMProject` — projects
- `TMArea` — areas of responsibility
- `TMChecklistItem` — subtasks

---

## MVP Definition (v1.0)

**Must have:**
- [ ] Command Center home view with today's focus + domain health
- [ ] Project board (Kanban) with drag-to-update
- [ ] Task list view with inline edit + quick complete
- [ ] Domain color-coding throughout
- [ ] JJ panel with weekly summary

**Nice to have (but can cut):**
- Analytics / progress charts
- Notification feed
- Natural language task input

**Out of scope for MVP:**
- Mobile
- Calendar sync
- Obsidian sync
- Voice input

---

## Success Metrics

- Joey opens the dashboard daily (habit formed within 2 weeks)
- Task updates happen in dashboard, not Things directly
- JJ panel surfaces at least 1 actionable insight per day
- Zero data loss (Things DB stays healthy)

---

## Open Questions

1. **Framework preference?** Next.js vs SvelteKit — Joey may have a preference given his mobile background
2. **Design system?** Start from scratch vs. use shadcn/ui or similar
3. **Real-time sync?** Poll Things DB every 30s, or file-watch for changes?
4. **Auth?** It's local-only for now, so probably none needed
5. **JJ integration depth?** Should JJ be able to create/edit tasks directly from the panel?

---

## Milestones

| Milestone | Description | Est. Time |
|-----------|-------------|-----------|
| M1 | DB read layer + basic task list rendering | 2-3 days |
| M2 | Command Center + domain health | 2-3 days |
| M3 | Project board (Kanban) | 2-3 days |
| M4 | JJ panel (AI summaries) | 1-2 days |
| M5 | Polish + local launch setup | 1 day |
| **Total** | **MVP** | **~2 weeks** |

---

## Next Steps

1. Joey reviews this PRD and gives feedback
2. Answer open questions (framework, design system)
3. JJ explores Things 3 DB schema (map the tables)
4. Pick a start date and kick off M1

---

*This is a living doc. Update as decisions are made.*
