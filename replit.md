# Memorial – المهندس أيمن مبروك ريان

An Islamic memorial website dedicated to Engineer Ayman Mabrouk Ryan (توفي 11 مارس 2022). Visitors can read Quran, perform dhikr/tasbeeh, view prayer times, read duas, and see visit statistics — all as a sadaqa jariya (ongoing charity) in his memory.

## Run & Operate

- `pnpm --filter @workspace/memorial run dev` — run the memorial frontend (port 20534)
- `pnpm --filter @workspace/api-server run dev` — run the API server (requires `DATABASE_URL`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required env for API: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- **Frontend**: React + Vite, Tailwind CSS, Radix UI, Framer Motion, Wouter routing, Arabic RTL
- **API**: Express 5, `@workspace/api-zod` for typed contracts, `@workspace/api-client-react` for React Query hooks
- **DB**: PostgreSQL + Drizzle ORM (`lib/db`)
- **Codegen**: Orval (from OpenAPI spec in `lib/api-spec`)
- Build: esbuild (API server CJS bundle)

## Where things live

- `artifacts/memorial/` — React frontend (memorial website)
- `artifacts/api-server/` — Express API (dhikr counts, visit stats, duas)
- `lib/db/` — Drizzle ORM schema + migrations
- `lib/api-spec/` — OpenAPI spec (source of truth for API contracts)
- `lib/api-zod/` — Generated Zod schemas from OpenAPI
- `lib/api-client-react/` — Generated React Query hooks from OpenAPI
- `attached_assets/` — Portrait image and prompt files

## Architecture decisions

- RTL (right-to-left) is enforced globally via `document.documentElement.dir = 'rtl'`
- Dark theme is forced globally (`dark` class on `<html>`)
- Friday Mode adds a special banner and class on Fridays (day 5)
- Visit tracking uses `sessionStorage` to record one visit per session
- API client is code-generated from the OpenAPI spec — do not edit generated files directly

## Product

- **Hero**: Portrait, name, death date, Gregorian/Hijri dates, memorial dua
- **Time Counter**: Live counter since date of passing
- **Prayer Times**: Daily prayer schedule
- **Tasbeeh/Dhikr**: Digital counter synced to backend, 9 types of dhikr
- **Quran Reader**: Browse and read Quran
- **Daily Content**: Rotating Islamic content
- **Duas**: Collection of duas for the deceased
- **Statistics**: Visit counts and dhikr totals from the database

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The API server requires `DATABASE_URL` to be set; the frontend will still load without it but Statistics and Dhikr features won't work
- Run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml` to regenerate hooks/schemas

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
