# Donepage Phase-1 Fulfillment

This project now includes a Phase-1 fulfillment workflow:

1. Stripe checkout (`launch` / `growth`)
2. Paid brief submission on `/start`
3. Auto draft generation (reusing existing generator pipeline)
4. Private customer preview via magic link token
5. Admin stats + order review + publish

## Required environment variables

- `ADMIN_TOKEN`
- `STRIPE_SECRET_KEY`
- `STRIPE_LAUNCH_PRICE_ID`
- `STRIPE_GROWTH_PRICE_ID`

Optional:

- `STRIPE_WEBHOOK_SECRET` (if you later add webhook verification for checkout events)
- `NEXT_PUBLIC_APP_URL` (recommended for stable absolute links)
- `DATABASE_URL` or `KV_REST_API_URL` + `KV_REST_API_TOKEN` (persistent storage backend)

## Storage model

Phase-1 order tracking uses the existing persistent storage pattern (`app/lib/persistent-kv.ts`), which prefers Postgres (Prisma `KeyValueStore`) and falls back to Vercel KV/memory.

Order keys:

- `order:<id>`
- `orders:index:v1`

## Stripe checkout endpoints

- `GET /api/checkout?plan=launch`
- `GET /api/checkout?plan=growth`

Legacy plans (`starter|business|pro`) remain supported for existing generator flow.

## No Prisma migration required

This Phase-1 implementation does **not** add new Prisma models/tables.  
It is deployable without schema migration.

## Daily workflow for Sara

1. Open `/admin?token=<ADMIN_TOKEN>`
2. Review summary cards and order list
3. Open draft from each order
4. QA the landing page
5. Add internal notes if needed
6. Click `Publish`
7. Copy the generated customer message block with live link and send to customer

