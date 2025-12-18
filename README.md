# ClosetClear Monorepo

Local-first smart wardrobe MVP spanning mobile (Expo), web landing, and mock API.

## Short plan
- Mobile Expo app with offline SQLite, Zustand store, Paper UI, and shared domain logic.
- Shared package exposes zod schemas, outfit generator, analytics (80/20), resale estimator, and demo seeds.
- Web landing (Next.js) shows premium positioning; API Fastify mock for future sync hooks.

## Repo structure
- `apps/mobile`: Expo React Native app (Onboarding, Dashboard, Closet, Scan/Add, Outfit builder, Analytics, Resell/Donate, Settings)
- `apps/web`: Next.js landing page skeleton
- `apps/api`: Fastify mock endpoints
- `packages/shared`: Shared TypeScript logic (schemas, analytics, outfits, resale, seeds)

## How to run
- Install deps: `npm install`
- Type-check all packages: `npm run typecheck`
- Shared tests: `npm test`
- Mobile: `cd apps/mobile && npm install && npx expo start` (offline-safe stubs; requires Expo CLI)
- Web: `cd apps/web && npm install && npm run dev`
- API mock: `cd apps/api && npm install && npm run dev`

## Tests
- Unit tests live in `packages/shared/src/__tests__/logic.test.ts` (vitest).

## Notes
- No external API keys required; camera is stubbed with manual entry for offline use.
- Premium hooks (resell listing, packing lists) are surfaced via UI paywalls, not real payments.
- Demo data (10 items + wear events) seeded locally on first run.
