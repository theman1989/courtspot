@AGENTS.md

# CourtSpot

A court booking platform. Treat this as a production application — correctness, security, and consistency matter.

## Architecture

**Feature-based structure is strictly enforced.** All new code belongs under `src/features/{feature}/` using these subdirectories:
- `actions/` — Server Actions
- `components/` — feature-specific React components
- `hooks/` — client-side hooks
- `schemas/` — Zod schemas
- `server/` — service files and Mongoose models
- `constants/` — enums and static values
- `types.ts` — feature-level TypeScript types (at feature root)
- `index.ts` — public barrel export (required for all features)

Route-specific components (tied to a single page) belong in `src/app/(route-group)/_components/`, not duplicated into `src/features/`.

**Cross-feature imports must go through the feature's `index.ts` barrel.** Never import directly from internal paths like `src/features/booking/server/booking.service.ts` from outside that feature.

## Data layer

**Always route database access through the service layer.** Server Actions call services (`src/features/*/server/*.service.ts`); services call Mongoose models. Never put `Model.find()` or other Mongoose calls directly in Server Actions or components.

## Mutations and API routes

Default to **Server Actions** for all app-initiated mutations. Reserve `src/app/api/` routes for external integrations only (webhooks, future mobile clients).

## Authentication

Always verify the session at the top of any Server Action that reads or writes user data. Use `src/auth.ts` with `getServerSession(authOptions)`. Never skip the auth check and leave it to the caller.

Users have two roles — `'booker'` and `'owner'` — stored as an array on `session.user.role`. A user can hold both roles simultaneously. Check role membership with `session.user.role.includes('owner')`.

Route protection is handled in `src/proxy.ts`, which must be renamed to `src/middleware.ts` to activate as Next.js edge middleware. Currently only `/dashboard` routes are protected. The `(owner)` route group requires role-based enforcement in addition to auth-only checks.

## Listing lifecycle

Court listings are created with `status: 'active'` directly — the `PENDING_APPROVAL` model default is bypassed in current Server Actions. An admin approval workflow (`pending_approval → active | rejected`) is deferred and not yet implemented.

Supported sports: `basketball`, `pickleball`, `badminton`, `tennis`, `futsal`.

## UI and design tokens

**Check `src/app/globals.css` before writing any Tailwind classes** — design tokens (colors, spacing, fonts) are defined there via `@theme`. Do not hardcode arbitrary values like `text-[#3b82f6]`; use semantic tokens.

Always use or extend `src/shared/components/ui/` before reaching for a third-party component library. Current shared primitives: `Button`, `Card`, `Badge`, `Input`, `Avatar`, `Divider`. If a needed primitive is missing, build it into the shared kit first.

## Testing

No tests are required now. When tests are added, prioritize `src/features/*/server/*.service.ts` — the service layer is the primary test target.
