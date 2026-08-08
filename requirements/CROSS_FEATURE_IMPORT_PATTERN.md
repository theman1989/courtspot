# Cross-Feature Import Pattern

## 1. Restate the Feature

Establish a consistent, enforced import pattern across all feature modules in CourtSpot. Every feature exposes a single public API through `features/{module}/index.ts`. Cross-feature callers must import exclusively through that barrel. Same-feature callers import directly via relative paths. The existing codebase has several violations of this pattern that must be corrected.

---

## 2. Business Goal

- **Why:** Without a clear boundary, features reach into each other's internals — models, types, service files. This creates invisible coupling that makes refactoring risky and debugging harder.
- **Who:** All developers working on CourtSpot features.
- **Problem solved:** Enforces a single entry point per feature so cross-feature dependencies are visible, controlled, and consistent.

---

## 3. Scope

### In Scope

- Define and document the canonical barrel pattern for all features with a service layer.
- Fix all existing violations in the current codebase.
- Create the missing `features/booking/index.ts`.
- Standardize import paths inside barrel files (relative, not absolute).
- Expose public types through the feature barrel — only types actively consumed cross-feature.
- Route side-effect model registration imports through the owning feature's `index.ts`.
- Add a new service function to `review` to replace the direct `Review` model import in `booking`.

### Out of Scope

- Changes to `features/auth/` — exempt (no service layer, no cross-feature consumers).
- Adding new feature functionality beyond what is needed to fix violations.
- Test coverage (deferred per CLAUDE.md).
- API routes, UI, or database schema changes.

---

## 4. User Roles

Not applicable — this is a developer-facing architectural constraint, not a user-facing feature.

---

## 5. Functional Requirements

### Barrel Rule

Every feature that owns a service layer must have `features/{module}/index.ts`.

Cross-feature callers import **only** from `features/{module}/index.ts`. They never import from:
- `features/{module}/server/*.service.ts`
- `features/{module}/server/*.model.ts`
- `features/{module}/types/`
- Any other internal path

Same-feature callers (e.g., a feature's own actions or components) import directly via relative path. They do not use the feature's own `index.ts`.

### Barrel File Imports

Inside a barrel file, imports from the feature's own service use relative paths (e.g., `./server/user.service`), not absolute aliases (e.g., `@/features/users/server/user.service`).

### Model Privacy

Mongoose models are never exported from `index.ts`. They are internal to their feature's `server/` directory.

### Side-Effect Model Registration

When a feature needs to ensure another feature's Mongoose model is registered (for `.populate()` to work), it imports from the owning feature's `index.ts` as a side effect:

```ts
import "@/features/users"; // triggers User model registration
```

It never imports directly from the model file inside another feature.

### Public Types

A feature's `index.ts` may re-export types, but only those actively consumed by another feature. Internal-only types stay in `features/{module}/types/` and are not re-exported from the barrel.

### Cross-Feature Query Wrapper

When a feature service needs data from another feature's model (e.g., `booking` needing reviewed booking IDs from the `review` model), it must not import the model directly. Instead, the owning feature adds a dedicated service function, exports it through its `index.ts`, and the consuming feature calls that function.

---

## 6. Business Rules

- A feature's `server/` directory is private. Nothing outside the feature imports from it.
- `features/{module}/index.ts` is the sole public contract for each feature.
- Models are never part of a feature's public contract.
- Types are part of a feature's public contract only when another feature needs them.
- Same-feature imports are always relative and never go through the feature's own barrel.
- The `auth` feature is exempt from the barrel requirement until it grows a service layer with cross-feature consumers.

---

## 7. Status Flow

Not applicable — no state machine involved.

---

## 8. Relationships

- `features/listing` → consumes `features/review` (function: `getReviewsByCourtId`, type: `CourtReview`)
- `features/listing` → consumes `features/users` (side-effect: model registration)
- `features/booking` → consumes `features/review` (new function: to be determined — replaces direct `Review` model import)

---

## 9. Data Requirements

No new data fields. No schema changes.

A new service function is required in `features/review/server/review.service.ts` to encapsulate the query currently done via direct model import in `booking.service.ts`. The function must return the data needed by `booking` without exposing the `Review` model.

---

## 10. API Impact

None. No API routes are added, changed, or removed.

---

## 11. UI Impact

None. No pages, components, or navigation are affected.

---

## 12. Reporting Impact

None.

---

## 13. Audit Impact

None.

---

## 14. Edge Cases

- `features/listing/server/courtListing.service.ts` imports `@/features/users/server/user.model` as a side effect **and** imports `CourtReview` from `@/features/review/types`. Both must be corrected independently.
- `features/users/index.ts` currently uses an absolute alias path to import from its own service — must be changed to relative.
- `features/review/index.ts` currently exports `getReviewsByCourtId`. After adding the new booking-support function, both must be exported.
- `features/booking/index.ts` does not exist — must be created and must re-export all public functions and types from `booking.service.ts`.

---

## 15. Assumptions

- All confirmed in the grilling session:
  - Feature-root barrel (not `server/index.ts`).
  - Same-feature imports stay direct (relative paths).
  - Barrel files use relative paths for own-service imports.
  - Public API is minimal — only export what cross-feature callers need.
  - `auth` is exempt.

---

## 16. Risks

- **Regression risk (Low):** Import path changes are mechanical but must be verified — a wrong path silently compiles in TypeScript if the aliased module resolves.
- **Mongoose model registration (Low):** Changing side-effect imports must preserve registration order. If `import "@/features/users"` triggers the same registration as the direct model import, no risk. Must verify the barrel re-exports the model or triggers its registration.
- **New review service function (Low):** The function's return type must satisfy what `booking.service.ts` currently computes from the raw `Review` query. If the shapes diverge, `booking` logic breaks.

---

## 17. Requirement Document

Output: `/requirements/CROSS_FEATURE_IMPORT_PATTERN.md` ✓

---

## 18. Acceptance Criteria

- [ ] `features/booking/index.ts` exists and re-exports all public functions and types from `booking.service.ts`
- [ ] `features/review/index.ts` exports the new cross-feature query function alongside `getReviewsByCourtId`
- [ ] `features/users/index.ts` uses a relative path to import from `user.service.ts`
- [ ] `features/listing/server/courtListing.service.ts` imports `@/features/users` (not the model file directly) for side-effect model registration
- [ ] `features/listing/server/courtListing.service.ts` imports `CourtReview` from `@/features/review` (not from `@/features/review/types`)
- [ ] `features/booking/server/booking.service.ts` imports reviewed booking data via a function from `@/features/review` (not the `Review` model directly)
- [ ] No file outside a feature imports from that feature's `server/` directory
- [ ] The application builds without errors after all changes

---

## 19. Open Questions

### Q1 — New review service function signature

- **Question:** What should the new function in `review.service.ts` be named, and what should it return? `booking.service.ts` currently queries `Review.find({ bookerId }).select("bookingId")` and produces a `Set<string>` of reviewed booking IDs.
- **Why it matters:** The function's return type determines how `booking.service.ts` rewrites its `hasReview` logic.
- **Blocking:** Yes — implementation cannot begin on the `booking` violation fix without this decision.
- **Suggested default:** `getReviewedBookingIds(bookerId: string): Promise<string[]>` — returns an array of booking ID strings; `booking.service.ts` builds the `Set` from it.

---

> Requirements Frozen ✅
> Ready for `/implementation-planner`
