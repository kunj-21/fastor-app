# Fastor — Mobile App Design Task

> **Live Deployment:** [https://faster-a.netlify.app](https://faster-a.netlify.app)  
> **Figma Design:** [Mobile App Design Task (Figma)](https://www.figma.com/design/PFmBcRW0EJOlVqc9seKGJB/Mobile-App-Design-Task--Copy-?node-id=0-1&t=JXjssP8OJ5Fm4l5c-0)

Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. Fully responsive mobile web application implementing the Figma screens and the Fastor staging API workflow.

---

## 🚀 Live Demo & Quick Start

- **Live URL:** [https://faster-a.netlify.app](https://faster-a.netlify.app)
- **Test Mobile Number:** Any valid 10-digit number (e.g. `9876543210`)
- **Staging Test OTP:** `123456`

---

## 📱 Implemented Screens

| Route | Figma Frame | Features & Implementation |
|---|---|---|
| `/login` | `Signup (1:664)` | +91 phone input formatted as `12345 - 67890`. "Get OTP" triggers `POST /api/auth/register`. |
| `/otp` | `Signup (1:734)` | 6 OTP boxes with auto-advance, backspace handling, paste support, 30s countdown resend. Submits to `POST /api/auth/login`. |
| `/home` | `Signup (1:908)` | Location bar, user greeting card, quick action buttons, Best Seller grid, swipeable promo carousel, and **Popular Items** list with **Cancel Order** and **Track Driver** action buttons. Features an interactive toggle between **Figma Popular Items** and **Live Fastor API Restaurants**. |
| `/product` | `Signup (1:1343)` | 90° rotated Pepperoni Pizza hero image with graceful fallback, price and quantity stepper (`- 3 +`), selectable portion radio group (`$0.00` to `$10.00`), and animated "Add to cart" button. |

---

## 🔌 API Integration

| Step | Fastor Upstream Endpoint | Local Route Handler | Description |
|---|---|---|---|
| **1. Register & Send OTP** | `POST /v1/pwa/user/register` | `POST /api/auth/register` | Registers phone number and requests an OTP code |
| **2. Login with OTP** | `POST /v1/pwa/user/login` | `POST /api/auth/login` | Verifies OTP and stores JWT in an `httpOnly` secure cookie |
| **3. Fetch Restaurants** | `GET /v1/m/restaurant?city_id=118` | `GET /api/restaurants` | Retrieves live restaurant data via authenticated Bearer token |

- Calls run through Next.js server route handlers to eliminate CORS issues and protect sensitive tokens.
- Secure cookie-based session verification with `src/middleware.ts` protecting `/home` and `/product`.
- Resilient fallback handling in case of upstream staging network timeouts.

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Download Figma assets into public/assets
npm run assets

# 3. Start local development server
npm run dev
# Opens at http://localhost:3000
```

---

## 🎨 Design Tokens & Assets

- **Colors:** `#292E39` (ink), `#696969` (muted), `#FF5701` (brand), `#E95322` (orange), `#FFDECF` (orange-2), `#F3E9B5` (yellow-2), `#391713` (cocoa).
- **Typography:** Mulish (auth screens), League Spartan (food & menu screens), Inter (location bar) loaded via Google Fonts in `src/app/layout.tsx`.
- **Assets:** High-resolution vector icons and food photos exported directly from Figma into `public/assets/`.

---

## 📂 Project Structure

```
src/
  app/
    api/              # Next.js route handlers (auth login/logout/register, restaurants)
    home/             # Home screen (Best Seller, Carousel, Popular Items)
    login/            # Phone registration screen
    otp/              # 6-digit OTP verification screen
    product/          # Product details & portion selection screen
  components/         # BackButton, Divider, PopularItemList, RestaurantList, PromoCarousel, PrimaryButton
  data/menu.ts        # Screen items, best sellers, portions, and promotional slides
  lib/                # API client, assets dictionary, Fastor server utilities, normalizers
  middleware.ts       # Route guard & session validation
```
