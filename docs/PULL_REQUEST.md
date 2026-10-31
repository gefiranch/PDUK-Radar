## Problem and resulting behavior

Case verification previously lived only in browser storage, Completed lacked sidebar/breadcrumb navigation, Detail did not match the seven-part documented flow, and global HTML replacements made terminology fragile. This revision persists case decisions and append-only audit events in D1, rejects stale writes, restores Completed navigation, and gives a structured risk-review flow while preserving all source scores and the existing Inter/teal UI.

EMP-0348 can be verified compliant with a closure note and removed from the active queue while keeping score 83.25/Critical. Reopening requires a reason. Non-compliant EMP-0221 remains in follow-up until explicitly completed with a note. Server state is shared across active admin/user accounts; no automatic legacy localStorage import or silent offline fallback occurs.

## Implementation and files

- `app/api/cases/`, `lib/cases/`, `db/schema.ts`, `drizzle/0002_case_records.sql`: active-session auth, server actor/time, strict request validation, atomic compare-and-swap state/audit, append-only history and paginated reads. Existing migrations unchanged.
- `workspaceStore.js`, `main.js`, VerificationWorkspace: await server ACK, form version, conflict/draft handling, explicit refresh and read-on-navigation/focus. Both roles review cases; only admin manages accounts.
- EmployerDetail/Explainability/shared assessment: seven sections, registration ratio, natural peer comparison, six initial/effective weights, information popups, top-three clarification focus. Official contributions remain unavailable; 83.19 indicative reconstruction is not forced to match 83.25.
- Dashboard/case navigation/style: pending/needs-data cards, Completed sidebar/breadcrumb/deep links, spacing/dropdown/focus/readability refinements.
- `data/demo/`, `/api/demo`, demonstration component: supplied synthetic enrichment only after opt-in confirmation, visible banner, isolated browser notes, illustrative allocations never become official model output. Scenario buttons fill drafts, never save automatically.
- Fix baseline login-attempt column typo and managed shell build permission assumption. Validate Git LF CSV versus original CRLF provenance explicitly; CSV and all three snapshots remain byte-identical to baseline.
- [Complete changed-file manifest](CHANGED_FILES.md), updated README/data dictionary/demo/deployment and test reports.

## Validation actually executed

- `npm test`: **36 passed, 0 failed**, including 500-company page rendering, filtering/sorting/export, D1 concurrent writes, closure/reopen, 105-event pagination, remote-store failure behavior and demo separation.
- `npm run test:worker`: **40 HTTP checks passed** against the built Worker + isolated local D1; admin/user/new-user login, admin-only account access, inactive/reactivated/expired sessions, auth/origin, validation/version conflict, cross-user reads, closure/reopen, source-score/distribution preservation, logout.
- `npm run lint`: zero ESLint errors/warnings; `npx tsc --noEmit`: passed.
- `python tools/validate_data.py`: **17 passed**; original 500-company distribution remains 369/109/16/6.
- `npm run build`: passed; database migrations tested only locally.
- `git diff` confirms CSV, snapshots and migrations 0000/0001 unchanged.

## Screenshots and open review checks

Before public-login screenshot: `docs/screenshots/full-revision-before-public-login.jpg`. The live workspace required an unavailable session; source was audited instead.

- [ ] Revised browser click-through, refresh UI, cross-device UI, keyboard/focus/dialog and console QA.
- [ ] Responsive visual checks at **390, 768, 1024, 1440 px** and after screenshots.
- [ ] Staging migration and hosted D1 verification.

Preview initially failed to connect; subsequent binding to its error tab was rejected by browser protocol policy. No bypass was attempted. These items are **unverified**, not claimed as passing. Historical screenshots/reports in docs are not after evidence for this revision. Keep this PR in review/draft until these checks are completed.

## Migration, environment and deployment

Apply **0002_case_records.sql only** if 0000/0001 already exist; do not edit/replay old migrations. Deploy code after the additive migration, then test staging before requesting production approval. Existing `DB` and auth/testing-secret configuration is retained; no new runtime secret or dependency. Do not deploy using the placeholder local database ID. See `DEPLOYMENT_REVIEW.md` for patch/push commands, deployment sequence and non-destructive rollback notes.

LocalStorage notes are not automatically imported. No evidence upload, government integration, observed 24-month history, real-time push sync, reassessment pipeline, or production readiness for personal data is claimed. Source/demo data are synthetic. No production deployment or merge has been performed.

Baseline: `eacaab94b127c29090654eb96208ac6dc2ea12d0`; branch: `feat/pduk-radar-full-revision`.

Delivery note: the current connector rejected branch creation with 403 `Resource not accessible by integration`; this body accompanies the committed patch/source alternative. Do not claim a remote PR exists until it has an actual GitHub URL.
