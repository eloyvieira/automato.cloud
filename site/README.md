# Automato

Real-Time Crypto Trading Signals — a production-ready starter for a crypto market intelligence and signal platform.

## Tech Stack

- **Next.js** (App Router, TypeScript, Server Components + Route Handlers)
- **Prisma ORM** with **MySQL**
- **Redis** (ioredis) for caching
- **Tailwind CSS** for styling
- **bcrypt** for password hashing, **jose** JWT for sessions
- **Zod** for validation

## Getting Started

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

```bash
production
npm install
npx prisma generate
npx prisma migrate deploy
npm run start

schema.prisma
npx prisma migrate dev --name name_action_to_table
```

## Environment

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MySQL connection string |
| `REDIS_URL` | Redis connection string |
| `AUTH_SECRET` | Secret used to sign session JWTs |
| `NEXT_PUBLIC_APP_URL` | Public URL for sitemap/robots |

## Project Structure

```
src/
  app/           # Next.js App Router pages + API routes
  components/     # Reusable UI components
  lib/           # prisma, redis, auth, permissions, validators, serializer
  services/      # Business logic (signal, market, subscription, ranking)
prisma/
  schema.prisma  # MySQL schema as Prisma models
  seed.ts        # Plans + sample BTC regimes + sample signals
```

## API Endpoints

### Public
- `GET /api/signals` — top long & short signals (premium fields stripped for free users)
- `GET /api/market/btc` — current BTC market regime
- `GET /api/rankings` — most reliable coins

### Authenticated (requires active API subscription)
- `GET /api/v1/signals` — all active signals
- `GET /api/v1/market/btc/regime` — BTC regime
- `GET /api/v1/rankings/long` — best long opportunities
- `GET /api/v1/rankings/short` — best short opportunities
- `GET /api/v1/crypto/[symbol]` — signals for a specific symbol

## Market Regimes

| Regime | Direction |
|--------|-----------|
| LONG_STRONG | Bullish |
| LONG_WEAK | Bullish |
| NEUTRAL | Balanced |
| SHORT_WEAK | Bearish |
| SHORT_STRONG | Bearish |

## Plans (seeded)

| Plan | Type | Price | Period |
|------|------|-------|--------|
| Premium Weekly | premium | $9.90 | weekly |
| API Starter | api | $29 | monthly |
| API Professional | api | $79 | monthly |
