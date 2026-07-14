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

Build a clean, simple React UI that lets users **add**, **view**, and **delete** expenses, and see the **total amount spent**.

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

### Layout

- Single main page or dashboard view
- Clear page title (e.g. “Expense Tracker”)
- Sections: **Add Expense** form, **Total Spent** summary, **All Expenses** list

### Visual Design

- Clean and minimal — avoid clutter
- Consistent spacing, typography, and button styles
- Use existing shadcn/ui components where possible (`Button`, `Input`, `Card`, `Label`, etc.)

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
  page.tsx                 # Main expense tracker page
  layout.tsx               # App shell, fonts, theme

components/
  add-expense-form.tsx     # Form with validation + submit
  expense-list.tsx         # Renders list of expenses
  expense-item.tsx         # Single row/card with delete action
  total-spent.tsx          # Total summary display

lib/
  api.ts                   # fetch helpers for expense endpoints
  types.ts                 # Expense type definitions
```

---

## Out of Scope (Assignment)

These are **not** required for qualification unless you choose to add them:

- User authentication / login
- Edit/update expense
- Filtering, sorting, or search
- Charts or analytics
- Pagination
- Offline support / PWA
- Multi-currency

---

## Submission Checklist (Frontend)

- [ ] Add expense form with Amount, Description, Category, Date
- [ ] List all expenses from API
- [ ] Show total amount spent
- [ ] Delete button per expense, wired to API
- [ ] Basic responsive layout
- [ ] App runs locally (`npm run dev`)
- [ ] Production build passes (`npm run build`)
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
