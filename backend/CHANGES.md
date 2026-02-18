Changes made:

- Added `backend/config.js` to centralize environment configuration and safe defaults.
- Updated `backend/routes/auth.js` to use `config.jwtSecret` and `config.jwtExpire`.
- Updated `backend/utils/database.js` to use `config.mongodbUri`.
- Updated `backend/server.js` to use `config` for `PORT` and CORS origin and to call `connectDB()`.
- Updated `backend/services/paymentService.js` and `backend/services/emailService.js` to use `config` values.
- Updated `frontend/src/App.test.tsx` to reflect current App UI.
- Updated `backend/server-simple.js`, `backend/seed.js`, and `backend/scripts/seed.js` to use `config`.
- Added `backend/smoke.js` script to run register/login smoke tests.

Tests:
- Backend tests pass (`npm test`).
- Smoke test (register/login) returns expected results (user already exists / login success).

Notes:
- Sensitive production secrets (`STRIPE_*`, `EMAIL_*`, `JWT_SECRET`) are required in production; `config` throws on missing `JWT_SECRET` in production.
- I did not push commits (git not available in this environment). Commit locally with the included file list.

Commands to commit locally:

```

Security audit fixes applied:

- Ran `npm audit fix` in `backend` — no vulnerabilities remain.
- Ran `npm audit fix` in `frontend` — reduced issues, but 9 vulnerabilities remain (3 moderate, 6 high) that require `npm audit fix --force` (breaking) or manual dependency upgrades. These stem from `react-scripts` and transitive packages (`svgo`, `nth-check`, `postcss`, `webpack-dev-server`).

Recommended next steps for frontend vulnerabilities:

1. Review `npm audit` output locally and decide whether to accept breaking changes.
2. Option A (conservative): Manually upgrade specific packages (or `react-scripts`) to compatible versions, test, and repeat until resolved.
3. Option B (aggressive): Run `npm audit fix --force`, then run full test suite and smoke tests to resolve regressions.

Commands to commit locally:

```
git add backend/config.js backend/utils/database.js backend/routes/auth.js backend/services/paymentService.js backend/services/emailService.js backend/server.js backend/server-simple.js backend/seed.js backend/scripts/seed.js backend/smoke.js frontend/src/App.test.tsx backend/CHANGES.md .github/workflows/ci.yml backend/.env.example
git commit -m "Centralize config; use config in services; add test JWT fallback; update frontend test; add CI and audit fixes"
```
