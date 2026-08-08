@AGENTS.md

# CourtSpot

A court booking platform. Treat this as a production application — correctness, security, and consistency matter.

Before starting any feature work, read `requirements/COURTSPOT.md` to stay aligned with the intended product design.

## Architecture

**Feature-based structure is strictly enforced.** All new code belongs under `src/features/{feature}/` using these subdirectories:
- `actions/` — Server Actions
- `components/` — feature-specific React components
- `hooks/` — client-side hooks
- `schemas/` — Zod schemas
- `server/` — service files and Mongoose models

Route-specific components (tied to a single page) belong in `src/app/(route-group)/_components/`, not duplicated into `src/features/`.

## Data layer

**Always route database access through the service layer.** Server Actions call services (`src/features/*/server/*.service.ts`); services call Mongoose models. Never put `Model.find()` or other Mongoose calls directly in Server Actions or components.

## Mutations and API routes

Default to **Server Actions** for all app-initiated mutations. Reserve `src/app/api/` routes for external integrations only (webhooks, future mobile clients).

## Authentication

Always verify the session at the top of any Server Action that reads or writes user data. Use `src/auth.ts`. Never skip the auth check and leave it to the caller.

## UI and design tokens

**Check `src/app/globals.css` before writing any Tailwind classes** — design tokens (colors, spacing, fonts) are defined there via `@theme`. Do not hardcode arbitrary values like `text-[#3b82f6]`; use semantic tokens.

Always use or extend `src/shared/components/ui/` before reaching for a third-party component library. If a needed primitive is missing, build it into the shared kit first.

## Testing

No tests are required now. When tests are added, prioritize `src/features/*/server/*.service.ts` — the service layer is the primary test target.
