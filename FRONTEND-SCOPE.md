# Personal Expense Tracker — Frontend Scope

Reference document for the Ekalakaar Tech assignment. Use this when planning, building, and reviewing the frontend.

---

## Assignment Context

| Field | Detail |
|---|---|
| **Project** | Personal Expense Tracker |
| **Stack** | MERN (MongoDB, Express, React, Node.js) |
| **Submission email** | ekalakaartech@ekalakaar.com |
| **Required deliverables** | GitHub repo link (compulsory), live demo link if deployed (compulsory) |

---

## Frontend Objective

Build a clean React UI that lets users **add**, **view**, and **delete** expenses, and see the **total amount spent** — presented in a **Kravio-inspired SaaS shell** (sidebar app layout, KPI cards, charts, activity feed, and data table).

This repo uses **Next.js (React)** with TypeScript, Tailwind CSS, and shadcn/ui. That satisfies the assignment’s React frontend requirement.

---

## Functional Requirements

### 1. Add Expense Form

A form to create a new expense with these fields:

| Field | Type | Required | Notes |
|---|---|---|---|
| Amount | number | yes | Currency value; validate > 0 |
| Description | text | yes | Short label for the expense |
| Category | text or select | yes | e.g. Food, Transport, Bills, Other |
| Date | date | yes | Expense date (ISO or `YYYY-MM-DD`) |

**Behavior**

- Submit calls `POST /api/expenses`
- Clear form or show success feedback on success
- Show validation/API errors on failure
- Disable submit while request is in flight

### 2. Expense List

Display **all** expenses returned from the backend.

**Each row/card should show**

- Amount
- Description
- Category
- Date

**Behavior**

- Load on mount via `GET /api/expenses`
- Handle empty state (“No expenses yet”)
- Handle loading and error states

### 3. Total Amount Spent

Show a summary of total spending across all listed expenses.

**Behavior**

- Compute from fetched expenses (sum of `amount`)
- Update after add or delete
- Format as currency for display

### 4. Delete Expense

A **Delete** button on each expense item.

**Behavior**

- Calls `DELETE /api/expenses/:id`
- Remove item from UI on success (or refetch list)
- Confirm before delete (optional but good UX)
- Handle errors gracefully

### 5. Responsive Design (optional, appreciated)

- Usable on mobile and desktop
- Form and list stack cleanly on small screens
- Touch-friendly buttons and inputs

---

## Backend API Contract (Frontend Integration)

Base URL should be configurable via environment variable (e.g. `NEXT_PUBLIC_API_URL`).

| Method | Endpoint | Purpose | Request body | Response |
|---|---|---|---|---|
| `POST` | `/api/expenses` | Add expense | `{ amount, description, category, date }` | Created expense object |
| `GET` | `/api/expenses` | List all expenses | — | Array of expense objects |
| `DELETE` | `/api/expenses/:id` | Delete one expense | — | Success confirmation or deleted object |

### Suggested Expense Shape

```ts
type Expense = {
  _id: string
  amount: number
  description: string
  category: string
  date: string // ISO date string from API
  createdAt?: string
  updatedAt?: string
}
```

---

## UI / UX Scope

### Visual direction — Kravio-inspired shell

Full app shell remake (Approach: restyle on existing shadcn) matching a modern SaaS dashboard aesthetic:

- Soft gray canvas + white/elevated cards (~10–12px radius), soft borders
- Navy/dark primary for active nav and chart highlights
- Green/red accents for positive/negative period trends
- Light theme matches Kravio closely; dark theme is an adapted elevated variant (toggle kept)

### Layout — protected shell

- **Left sidebar:** brand, search field, grouped navigation (Main + Support/Settings), user profile footer with online indicator
- **Top header:** breadcrumbs, utility icons (theme, notifications placeholder), sidebar trigger
- **Pages covered:** Dashboard, Expenses, Login, Signup

### Dashboard (Overview)

Mapped from Kravio’s ticket overview to expense concepts:

| Kravio element | Expense Tracker equivalent |
|---|---|
| KPI cards + % vs week | Total spent, expense count, avg expense + % vs prior period |
| Ticket volume bar chart | Spending by day (selected period) |
| Latest updates feed | Recent expense activity |
| SLA monitoring table | Expense monitoring table (search + rows) |

- Greeting: “Hello, {name}” + period selector (This week / Last week)
- Client-side trends from `GET /api/expenses` — no new backend endpoints

### Expenses page

- Same shell language
- Add form + list/table + total spent summary styled as KPI/card UI

### Auth pages

- Centered card on soft muted background; same radius/typography as shell
- Theme toggle retained

### States to Implement

| State | UX |
|---|---|
| Loading | Skeleton or spinner while fetching |
| Empty | Friendly message + prompt to add first expense |
| Error | Inline or toast message with retry option |
| Success | Brief feedback after add/delete |

---

## Suggested Frontend Structure

```
app/
  (protected)/
    dashboard/page.tsx     # Kravio-style overview
    expenses/page.tsx      # Add + list expenses
  (unprotected)/
    page.tsx               # Login
    signup/page.tsx

components/
  sidebar/                 # App shell navigation
  dashboard/               # Header, KPIs, chart, activity, table
  expense-tracker/         # Add form, list, item, total
  login-form.tsx
  signup-form.tsx

lib/
  api.ts
  types.ts
  dashboard-stats.ts       # Period KPIs / chart aggregates
```

---

## Out of Scope (Assignment)

These are **not** required for qualification unless you choose to add them:

- Edit/update expense
- Real notifications / ⌘K command palette (search UI can be presentational)
- Pagination
- Offline support / PWA
- Multi-currency
- Ticket/SLA domain features from Kravio (only visual patterns reused)

---

## Submission Checklist (Frontend)

- [x] Add expense form with Amount, Description, Category, Date
- [x] List all expenses from API
- [x] Show total amount spent
- [x] Delete button per expense, wired to API
- [x] Basic responsive layout
- [x] Kravio-inspired app shell (sidebar, dashboard KPIs/chart/table, auth restyle)
- [x] App runs locally (`npm run dev`)
- [x] Production build passes (`npm run build`)
- [ ] GitHub repo is public and includes this frontend
- [ ] Live demo deployed (Vercel recommended for Next.js)
- [ ] GitHub link emailed to **ekalakaartech@ekalakaar.com**

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Point to the Express backend in development and to the deployed API URL in production.

---

## Definition of Done

The frontend is complete when a user can:

1. Open the app and see all saved expenses
2. Add a new expense via the form and see it in the list
3. See the updated total after adding or deleting
4. Delete any expense and see it removed from the list
5. Use the app comfortably on mobile and desktop
6. Experience a consistent Kravio-style shell across dashboard, expenses, and auth
