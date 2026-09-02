Create a production-ready starter project for a cryptocurrency signal platform called **Automato**.

The project should be intentionally simple, clean, modular, and easy to extend later.

## Main goal

Build the base structure for a crypto market intelligence and signal website.

The website will have:

* public/free access
* authenticated users
* premium users
* API subscriptions
* crypto market regimes
* trading signals
* payments and subscriptions
* Redis caching
* MySQL database
* Prisma ORM
* Next.js frontend and backend

The first version should NOT be a huge dashboard. Keep the UI simple, professional, clean, centered, and information-focused.

---

## Tech stack

Use:

* Next.js latest stable version
* App Router
* TypeScript
* Prisma ORM
* MySQL
* Redis
* Tailwind CSS
* Next.js Server Components when appropriate
* Next.js Route Handlers for APIs
* Zod for validation
* bcrypt for password hashing
* JWT or secure session-based authentication
* ESLint
* Prettier

Do not add unnecessary frameworks or overly complex abstractions.

---

## Project structure

Keep the folder structure simple.

Suggested structure:

src/
app/
page.tsx
login/
register/
pricing/
account/
signals/
rankings/
api/
auth/
signals/
market/
rankings/
components/
layout/
market/
signals/
auth/
ui/
lib/
prisma.ts
redis.ts
auth.ts
permissions.ts
validators.ts
services/
signal.service.ts
market.service.ts
subscription.service.ts
ranking.service.ts
types/
middleware.ts

prisma/
schema.prisma
seed.ts

Do not create unnecessary repository layers, domain layers, factories, or enterprise patterns.

Use direct service classes/functions around Prisma.

---

# Brand

Brand name:

Automato

Primary SEO positioning:

**Real-Time Crypto Trading Signals**

Secondary message:

**Quantitative market analysis for USDT, USDC and BTC markets, updated every 5 minutes.**

Use a dark professional fintech style.

Keep the visual design minimal.

Use:

* dark background
* neutral gray panels
* green for bullish/long
* red for bearish/short
* yellow/orange for neutral or attention
* large readable typography
* generous spacing
* minimal charts

Avoid creating a giant trading dashboard.

---

# Homepage

Create a simple one-page homepage.

The homepage should have these sections:

## Header

Logo: Automato

Navigation:

* Signals
* Rankings
* Pricing
* API
* Login

If authenticated:

* Signals
* Rankings
* API
* Account
* Logout

---

## Hero section

H1:

Real-Time Crypto Trading Signals

Subtitle:

Quantitative crypto market analysis for USDT, USDC and BTC markets, updated every 5 minutes.

Display:

* last market update
* current BTC regime
* BTC timeframe status

Example:

BTC Market Regime

LONG_STRONG

15m: LONG_STRONG
1h: LONG_STRONG
1d: LONG_WEAK

---

## Market methodology section

Explain briefly:

Automato analyzes cryptocurrency markets every 5 minutes.

Markets analyzed:

* USDT
* USDC
* BTC

The platform classifies market conditions into five simple regimes:

* LONG_STRONG
* LONG_WEAK
* NEUTRAL
* SHORT_WEAK
* SHORT_STRONG

Market analysis may also include AI-assisted validation.

Keep this explanation short and SEO-friendly.

---

## Top opportunities

Display a maximum of 5 long opportunities and 5 short opportunities.

Example:

SOL/USDT
LONG_STRONG
Reliability: 82%
Detected 14 min ago

ETH/USDT
LONG_WEAK
Reliability: 78%
Detected 21 min ago

The signal age is very important.

Use detected_at to calculate:

* "Detected 5 min ago"
* "Detected 32 min ago"
* "Detected 1h 12m ago"

Never overwrite detected_at just because the analysis runs again.

---

# Free users

Public users and free users should see limited signal information.

Show:

* symbol
* direction
* regime
* reliability
* strategy
* timeframe
* detected time
* signal age

Hide or blur:

* entry_price
* stop_loss
* take_profit1
* take_profit2

Example:

SOL/USDT

LONG_STRONG

Reliability 82%

Detected 14 min ago

Entry: Locked
Stop Loss: Locked
Take Profit: Locked

Add a CTA:

Unlock full signal

---

# Premium users

Premium users should see the complete signal data.

Example:

SOL/USDT

LONG_STRONG

Reliability: 82%

Strategy: Scalping

Timeframe: 15m

Detected: 14 min ago

Entry: 203.42

Stop Loss: 198.75

Take Profit 1: 208.90

Take Profit 2: 214.30

Also display signal status:

* active
* expired
* closed

---

# Signal status

Signals should support:

active
expired
closed

Use expires_at when available.

Expired signals should not appear in the main active opportunities list.

They may appear later in history pages.

---

# Rankings

Create a simple rankings page.

Initial rankings:

* Most Reliable Coins
* Most Profitable Coins
* Best Long Opportunities
* Best Short Opportunities
* Best Scalping Coins
* Best Day Trading Coins
* Best Swing Trading Coins

Do not create a separate rankings table initially.

Calculate rankings directly from the signals table.

Add caching with Redis.

---

# Authentication

Implement:

* registration
* login
* logout
* authenticated session
* password hashing with bcrypt
* protected account routes

Users table:

* active
* blocked

Blocked users must not authenticate.

---

# Subscription model

Support two product types:

premium
api

A user may have more than one subscription.

Example:

Premium Weekly
API Starter

Subscription statuses:

active
past_due
canceled
expired

Premium access should only be granted if the user has an active premium subscription.

API access should only be granted if the user has an active API subscription.

Create helper functions like:

hasPremiumAccess(userId)

hasApiAccess(userId)

---

# API plans

API access is a separate paid product.

Create a basic API section.

Example plans:

API Starter
API Professional

Each plan may define:

api_requests_day

Create API endpoints such as:

GET /api/v1/signals
GET /api/v1/market/btc/regime
GET /api/v1/rankings/long
GET /api/v1/rankings/short
GET /api/v1/crypto/[symbol]

Do not fully build complex rate limiting yet.

Create the foundation for API authentication and rate limit checking.

---

# Redis

Use Redis for:

* current BTC market regime
* top long signals
* top short signals
* rankings
* expensive aggregate queries

Suggested keys:

market:btc:regime
signals:long:top
signals:short:top
ranking:reliable
ranking:profitable

Use reasonable TTL values around 300 seconds because the market is updated every 5 minutes.

Create a reusable Redis client.

---

# Prisma

Convert the following MySQL schema into Prisma models.

Use MySQL as datasource.

Preserve indexes and unique constraints where possible.

Database schema:

CREATE TABLE users (
id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NULL,
email VARCHAR(190) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
status ENUM('active','blocked') NOT NULL DEFAULT 'active',
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NULL
);

CREATE TABLE plans (
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50) NOT NULL,
slug VARCHAR(50) NOT NULL UNIQUE,
type ENUM('premium','api') NOT NULL,
price DECIMAL(10,2) NOT NULL,
billing_period ENUM('weekly','monthly') NOT NULL DEFAULT 'weekly',
api_requests_day INT UNSIGNED NULL,
is_active TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE subscriptions (
id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
user_id BIGINT UNSIGNED NOT NULL,
plan_id INT UNSIGNED NOT NULL,
provider VARCHAR(30) NOT NULL,
provider_customer_id VARCHAR(100) NULL,
provider_subscription_id VARCHAR(100) NULL UNIQUE,
status ENUM('active','past_due','canceled','expired') NOT NULL,
starts_at DATETIME NOT NULL,
expires_at DATETIME NULL,
next_payment_at DATETIME NULL,
canceled_at DATETIME NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
INDEX idx_user_status (user_id,status),
FOREIGN KEY (user_id) REFERENCES users(id),
FOREIGN KEY (plan_id) REFERENCES plans(id)
);

CREATE TABLE payments (
id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
user_id BIGINT UNSIGNED NOT NULL,
subscription_id BIGINT UNSIGNED NULL,
provider_payment_id VARCHAR(120) NULL UNIQUE,
amount DECIMAL(10,2) NOT NULL,
currency CHAR(3) NOT NULL DEFAULT 'USD',
status ENUM('pending','paid','failed','refunded') NOT NULL,
paid_at DATETIME NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
INDEX idx_user_created (user_id,created_at),
FOREIGN KEY (user_id) REFERENCES users(id),
FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);

CREATE TABLE market_regimes (
id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
symbol VARCHAR(20) NOT NULL,
quote_asset ENUM('USDT','USDC','BTC') NOT NULL,
timeframe ENUM('15m','1h','4h','1d') NOT NULL,
regime ENUM('LONG_STRONG','LONG_WEAK','NEUTRAL','SHORT_WEAK','SHORT_STRONG') NOT NULL,
strength DECIMAL(5,2) NULL,
ai_confidence DECIMAL(5,2) NULL,
data JSON NULL,
analyzed_at DATETIME NOT NULL,
UNIQUE KEY uq_market_regime (symbol,quote_asset,timeframe),
INDEX idx_regime (regime,timeframe)
);

CREATE TABLE signals (
id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
symbol VARCHAR(20) NOT NULL,
quote_asset ENUM('USDT','USDC','BTC') NOT NULL,
strategy ENUM('scalping','day','swing') NOT NULL,
timeframe ENUM('15m','1h','4h','1d') NOT NULL,
direction ENUM('LONG','SHORT') NOT NULL,
regime ENUM('LONG_STRONG','LONG_WEAK','SHORT_WEAK','SHORT_STRONG') NOT NULL,
reliability DECIMAL(5,2) NULL,
entry_price DECIMAL(24,12) NULL,
stop_loss DECIMAL(24,12) NULL,
take_profit1 DECIMAL(24,12) NULL,
take_profit2 DECIMAL(24,12) NULL,
result_perc DECIMAL(8,4) NULL,
status ENUM('active','expired','closed') NOT NULL DEFAULT 'active',
detected_at DATETIME NOT NULL,
expires_at DATETIME NULL,
closed_at DATETIME NULL,
data JSON NULL,
INDEX idx_active (status,strategy,timeframe,detected_at),
INDEX idx_symbol (symbol,quote_asset,detected_at),
INDEX idx_rank (status,reliability)
);

---

# Prisma naming

Use clean Prisma model names such as:

User
Plan
Subscription
Payment
MarketRegime
Signal

Use @map and @@map where necessary so the actual MySQL table and column names remain snake_case.

Example:

createdAt DateTime @default(now()) @map("created_at")

@@map("users")

---

# BigInt

Because MySQL uses BIGINT, ensure Next.js API serialization handles BigInt safely.

Do not send raw Prisma BigInt values directly to JSON.stringify.

Create a helper serializer if necessary.

---

# Decimal

Prisma Decimal values should also be safely serialized for the frontend.

Convert numeric fields such as:

price
reliability
strength
result_perc

to number or string consistently in API responses.

---

# Seed

Create a Prisma seed containing:

Plans:

1. Premium Weekly
   type: premium
   billing period: weekly
   price: 9.90

2. API Starter
   type: api
   billing period: monthly
   price: 29.00
   api_requests_day: 10000

3. API Professional
   type: api
   billing period: monthly
   price: 79.00
   api_requests_day: 100000

Also create sample BTC market regimes and sample crypto signals so the homepage immediately has data.

Example symbols:

BTC
ETH
SOL
LINK
BNB
XRP
DOGE
SUI

---

# SEO

SEO is very important.

Configure:

metadata title:

Real-Time Crypto Trading Signals & Market Analysis | Automato

description:

Live crypto trading signals and quantitative market analysis for USDT, USDC and BTC markets. Long and short opportunities updated every 5 minutes.

Homepage H1:

Real-Time Crypto Trading Signals

Use semantic HTML.

Use:

header
nav
main
section
article
footer

Prepare metadata structure for future pages.

Add:

robots.ts
sitemap.ts

using Next.js built-in metadata routes.

---

# Security

Basic requirements:

* hash passwords
* never expose password hashes
* validate API inputs using Zod
* protect premium endpoints
* protect account endpoints
* verify subscription status server-side
* do not rely on frontend hiding for premium fields
* environment variables for MySQL, Redis and auth secrets

Create .env.example with:

DATABASE_URL
REDIS_URL
AUTH_SECRET
NEXT_PUBLIC_APP_URL

Do not put real credentials in the repository.

---

# Environment

Example:

DATABASE_URL="mysql://user:password@localhost:3306/automato"

REDIS_URL="redis://localhost:6379"

AUTH_SECRET="change-me"

NEXT_PUBLIC_APP_URL="http://localhost:3000"

---

# Important architecture decisions

Keep this application simple.

Do NOT create:

* microservices
* GraphQL
* Kafka
* event sourcing
* CQRS
* complex repository patterns
* unnecessary state management libraries
* unnecessary frontend frameworks

Use Next.js itself as both frontend and backend.

Use Prisma directly inside server-side services.

Use Redis only where caching provides value.

---

# Expected result

Generate a functional starter project that includes:

* Next.js application
* Prisma schema
* database seed
* MySQL configuration
* Redis configuration
* authentication
* register/login pages
* public homepage
* premium data protection
* plans
* subscriptions structure
* payment structure
* signals
* market regimes
* rankings
* API foundation
* SEO metadata
* sitemap
* robots.txt
* responsive layout
* .env.example
* README with setup instructions

The application should run locally using:

npm install

npx prisma generate

npx prisma migrate dev

npx prisma db seed

npm run dev

Prioritize clean code, simplicity, readability, and future extensibility over unnecessary complexity.



## Visual reference and template instructions

Use the attached template images as the **primary visual reference** for the website.

Do not redesign the product from scratch.

The final interface should closely follow the visual language, spacing, simplicity, hierarchy, card structure, typography balance, colors, proportions, and overall composition shown in the reference images.

Important:

* Keep the layout minimal and professional.
* Avoid creating a large trading dashboard.
* Avoid adding unnecessary charts.
* Avoid adding too many widgets.
* Keep the information centralized and easy to scan.
* Use compact cards and clean tables.
* Preserve the visual distinction between the free version and premium version shown in the reference images.
* Use the same general dark fintech aesthetic from the premium reference.
* For the public/free version, keep the same clean structure but hide or blur premium-only information.
* The homepage should feel like a modern SaaS crypto intelligence product, not like an exchange trading terminal.

The attached images should guide:

* header structure
* section spacing
* card sizes
* typography hierarchy
* border radius
* background tones
* bullish and bearish colors
* table density
* CTA placement
* premium lock styling
* overall page width
* responsive behavior

Do not try to copy logos, trademarks, or unrelated content from external products.

Only use the attached images as the design reference for the Automato brand.

## Free / public version

Follow the limited-access layout shown in the reference images.

Public users should immediately see useful data such as:

* BTC market regime
* latest update time
* top long opportunities
* top short opportunities
* reliability percentage
* strategy
* timeframe
* signal age
* most reliable coins
* brief methodology explanation

Premium fields must remain visually present but locked or blurred.

Example:

Entry: ••••••
Stop Loss: ••••••
Take Profit: ••••••

Add a subtle lock icon and an "Unlock full signal" CTA.

Do not hide the entire signal card.

The user should clearly understand what additional information becomes available with Premium.

## Premium version

Follow the logged-in premium layout shown in the reference images.

Premium users should see the same clean structure, but with complete data:

* entry price
* stop loss
* take profit 1
* take profit 2
* reliability
* strategy
* timeframe
* signal detected time
* signal age
* signal status

Do not turn the premium version into a large dashboard.

It should remain visually almost identical to the public version, only revealing the additional data.

This is important:

The free and premium layouts should feel like the same product.

Do not create two completely different applications.

The difference should mainly be the amount of information visible.

## Homepage density

The homepage should be intentionally concise.

Recommended section order:

1. Header
2. Hero / BTC Market Regime
3. Top Long and Short Opportunities
4. Most Reliable Coins
5. How Automato Works
6. Premium / API CTA
7. Footer

Avoid adding more sections unless necessary.

Keep the homepage as a simple one-page experience for the first release.

Internal pages such as rankings, detailed signals, history, pricing, and API documentation can be expanded later.

## Responsive design

The template should remain clean on desktop, tablet, and mobile.

On mobile:

* stack cards vertically
* reduce table columns
* keep regime badges visible
* prioritize symbol, regime, reliability, and signal age
* premium fields can appear below the main signal data
* preserve fast scanning and readability

Do not create horizontal overflow.

## Design philosophy

The interface should communicate:

* trust
* data quality
* professionalism
* clarity
* speed
* quantitative analysis

The user should understand the current market situation within a few seconds after opening the homepage.

The visual experience should feel closer to a professional market intelligence SaaS product than a cryptocurrency exchange.
