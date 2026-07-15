# Spending Trend — shadcn Area Chart

## Goal

Replace the custom CSS bar chart in the dashboard **Spending Trend** card with a shadcn Charts **area** chart, while keeping the existing card summary (total + % vs prior period).

## Decisions

| Topic | Choice |
|---|---|
| Chart type | Area chart (filled trend) |
| Card header | Keep total + % change above the chart |
| Integration | Rewrite `SpendingChart` in place; add shadcn `chart` UI primitive |
| API / parents | Unchanged |

## Architecture

1. Add shadcn Chart via CLI (`chart` component) → `components/ui/chart.tsx` and `recharts` dependency.
2. Update `components/dashboard/spending-chart.tsx`:
   - Keep `KravioCard`, title default `"Spending Trend"`, total, and period change line.
   - Replace the custom bar buttons with `ChartContainer` + `AreaChart` (`Area`, `XAxis`, `YAxis`, `CartesianGrid`, `ChartTooltip`).
3. Props remain: `title?`, `total`, `change`, `days`, `isLoading?`.
4. `DashboardOverview` and dashboard data fetching stay the same.

## Data

- Source: existing `DashboardChart` / `days: { label, fullLabel, date, amount }[]`.
- Chart series: single key `amount`.
- X-axis: `label`.
- Tooltip label: prefer `fullLabel` when available, else `label`; value via `formatCurrency`.
- Chart config: one series colored with theme primary (CSS variable / chart config) for light and dark themes.

## UX states

| State | Behavior |
|---|---|
| Loading | Total shows `—`; chart area shows muted skeleton placeholder |
| Loaded with days | Area chart with soft grid, no legend |
| Empty days | Empty plot; summary still rendered from props |
| Fetch error | Handled by parent dashboard; chart stays presentational |

## Interactions

- Hover/focus on the chart shows tooltip: day + formatted amount.
- No in-card period controls or multi-series legend.

## Out of scope

- New backend endpoints
- Changing KPI cards or activity feed
- Bar/line-only or hybrid chart variants
- Extracting a reusable chart wrapper beyond shadcn’s `chart` primitive

## Success criteria

- Spending Trend uses shadcn/recharts area chart.
- Total and % vs prior period remain above the chart.
- Loading and theme (light/dark) remain coherent with the Kravio shell.
- No changes to dashboard API contracts or parent data flow.
