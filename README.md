# Fastor — Next.js build of the "Mobile App Design Task" Figma

Next.js 14 (App Router) · TypeScript · Tailwind CSS. Four screens, wired as a flow:

| Route | Figma frame | What works |
|---|---|---|
| `/login` | Signup (1:664) | +91 phone input, formats `12345 - 67890`, "Get OTP" enables at 10 digits |
| `/otp` | Signup (1:734) | 6 OTP boxes: auto-advance, backspace, paste, 30s countdown → Resend; Continue at 6 digits |
| `/home` | Signup (1:908) | Location bar, quick actions, Best Seller grid, swipeable promo carousel with dots, Popular Items list |
| `/product` | Signup (1:1343) | Rotated hero image, quantity stepper, portion radio group, Add to cart |

## API integration (Fastor Postman collection)

| Step | Fastor endpoint | Our route | Used by |
|---|---|---|---|
| 1. Register & send OTP | `POST /v1/pwa/user/register` (`phone`, `dial_code=+91`) | `POST /api/auth/register` | `/login` → "Get OTP" + "Resend" |
| 2. Login with OTP | `POST /v1/pwa/user/login` (`phone`, `otp`, `dial_code`) → `data.token` | `POST /api/auth/login` | `/otp` → "Continue" |
| 3. Fetch restaurants | `GET /v1/m/restaurant?city_id=118` + `Authorization: Bearer <token>` | `GET /api/restaurants` | `/home` list, `/product?id=` |

- **Test OTP on staging: `123456`.**
- Calls go through Next.js route handlers, so there are no browser CORS issues and the JWT never touches client JS. It's stored in an **httpOnly cookie**.
- `src/middleware.ts` protects `/home` and `/product` (redirects to `/login`) and sends logged-in users from `/login` straight to `/home`.
- Loading, error and empty states are handled; an expired token logs you out.
- `GET /api/restaurants?debug=1` (after login) returns Fastor's raw response, so you can confirm the field mapping in `src/lib/restaurant.ts`.
- Optional env vars: `FASTOR_API_BASE` (default `https://staging.fastor.ai`), `FASTOR_CITY_ID` (default `118`).

## Run

```bash
npm install
npm run assets   # downloads all 20 Figma images/icons into public/assets
npm run dev      # http://localhost:3000 → redirects to /login
```

`npm run assets` uses Figma export links issued on 11 Oct 2026. **They expire after 7 days (around 18 Oct).** Run it before then and commit `public/assets`.

## Design tokens (from Figma)

- **Colors** — `tailwind.config.ts`: ink `#292E39`, muted `#696969`, brand `#FF5701`, brand-light `#FB7632`, orange `#E95322`, orange-2 `#FFDECF`, yellow-2 `#F3E9B5`, cocoa `#391713`, font-2 `#F8F8F8`, field `#F5F5F5`, line `#C7C7C7`, placeholder `#A4A5B2`.
- **Fonts** — Mulish (auth screens), League Spartan (food screens), Inter (location bar), loaded from Google Fonts in `src/app/layout.tsx`.
- Spacing, radii and sizes are taken from the Figma node measurements (375px frame).

## Intentional differences from the Figma frames

- **iOS status bar, numeric keyboard and home indicator are not rendered.** They are device mock-ups; the real phone supplies them (`inputMode="numeric"` brings up the numeric keypad).
- **Dashed price leaders on the portion list use a CSS dashed border** so they stretch with the row; the exact Figma dash pattern may differ slightly.
- Rows placed below the 812px canvas on the product frame (leftover order items) are not included.
- The home screen's "Popular Items" section shows live restaurants from the API (titled "Popular Restaurants"), and tapping one opens it on the detail screen. Best Seller and the promo banner stay as designed.
- The Figma file mixes `₹` and `$` prices. They are kept exactly as designed in `src/data/menu.ts`; change them there.

## Structure

```
src/
  app/            login · otp · home · product routes
  components/     BackButton, PrimaryButton, PillButton, Divider, PromoCarousel
  data/menu.ts    all screen content (items, prices, portions, slides)
  lib/assets.ts   local asset paths
scripts/fetch-figma-assets.mjs
```
