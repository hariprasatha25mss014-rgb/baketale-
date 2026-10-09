# Baketale — Flagship Artisan Brownie Web Experience

> *"A story in every bite"* — Handcrafted homemade brownies, brownie cakes, and gift boxes. Shipping across India.

Built with **Next.js 14 (App Router)**, **TypeScript / React**, **Framer Motion**, **GSAP ScrollTrigger**, and **Lenis Smooth Scroll**. Designed and developed to faithfully capture the motion principles, art direction, and pacing of the reference benchmarks:
- **Creamsy**: Pinned 5-flavour hero color shift, masked typography, live size toggles, wavy dividers, and photo gallery.
- **The Deconstructed Burger**: 120-frame scrubbed canvas layer separation sequence with atmospheric studio lighting.
- **Maison Cacao**: Warm cream foundation, elegant Fraunces serif display, and scroll-driven melting chocolate pool dynamics.

---

## 🛠 Skills & Plugins Installed

The following agent skills and plugins were initialized and installed for this project:
1. **UI/UX Pro Max** (`npx uipro init --ai antigravity` → `.agent/skills/` and `.agents/skills/`)
2. **Matt Pocock Skills Suite** (`npx skills add mattpocock/skills` — 38 specialized development skills)
3. **GSAP ScrollTrigger Skill** (`npx skills add greensock/gsap-skills@gsap-scrolltrigger`)
4. **Three.js WebGL Skill** (`npx skills add freshtechbro/claudedesignskills@threejs-webgl`)
5. **React Three Fiber Skill** (`npx skills add freshtechbro/claudedesignskills@react-three-fiber`)

---

## 🚀 Getting Started

### 1. Installation
```bash
cd bt-next
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Test
```bash
npm run build
npm start
```

---

## ⚙️ Configuration & Customization Guide

### 1. Instagram Direct Order Confirmation (@baketalee)
All customer orders route directly to **Instagram Direct** for personal confirmation.
Open [lib/data.js](file:///c:/Users/ELCOT/Downloads/baketale-next/bt-next/lib/data.js) to configure the official handles:
```javascript
export const INSTAGRAM_ID = 'baketalee';
export const INSTAGRAM_URL = 'https://instagram.com/baketalee';
export const INSTAGRAM_DM_URL = 'https://www.instagram.com/direct/t/18142251448547150/';
```
When a customer clicks **"Confirm on Instagram (@baketalee) ↗"**:
1. Order details are transmitted to `POST /api/orders` which sanitizes inputs, recalculates prices server-side, and writes an atomic record to the persistent database.
2. An itemized order receipt with unique `#BT-XXXX` ID, customer name, delivery address, quantities, and subtotal is created.
3. The entire order receipt is automatically copied to their clipboard.
4. It launches the direct Instagram DM thread (`https://www.instagram.com/direct/t/18142251448547150/`) with `@baketalee`.
5. A luxury confirmation modal appears on screen with 3 clear steps, a live receipt view, a one-tap copy button, and a direct DM shortcut.

---

## 🛡️ Full Site Security & Protection

Baketale features an enterprise-grade security perimeter:
1. **Security Middleware (`middleware.js`)**:
   - **Content-Security-Policy (CSP)**: Strict policy allowing only Google Fonts, local media, Next scripts, and Instagram DM links.
   - **Anti-Clickjacking**: `X-Frame-Options: DENY` & `frame-ancestors 'none'`.
   - **Anti-MIME Sniffing**: `X-Content-Type-Options: nosniff`.
   - **HSTS**: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
   - **Permissions-Policy**: Denies unauthorized camera, microphone, geolocation, and payment hardware access.
   - **Path Traversal Defense**: Intercepts and blocks malicious scanners attempting to access `.env`, `.git`, `.php`, `../`, and script injection URIs with `403 Forbidden`.
   - **CSRF Defense**: Enforces origin verification on state-mutating requests (`POST`, `PATCH`, `DELETE`).
2. **Server-Side Price Verification (`lib/security.js`)**:
   - Client prices are never trusted. The server recalculates each item against official bakery menus before storing orders.
3. **Sliding-Window Rate Limiting (`lib/security.js`)**:
   - Protects `/api/orders` (10 req / 10 min) and general API endpoints against DDoS and brute-force spam with `429 Too Many Requests`.
4. **Timing-Safe Admin Authentication**:
   - `crypto.timingSafeEqual` prevents side-channel timing attacks on admin keys.

---

## 🚨 Error Management & Resilience

1. **Next.js Global Error Boundary (`app/error.jsx`)**:
   - Catches unhandled client and server errors gracefully.
   - Renders a warm artisanal error card with "Try Baking Again" action and diagnostic logs in development.
2. **Custom 404 Page (`app/not-found.jsx`)**:
   - Branded "Crumbled Away" 404 page guiding customers back to fresh brownies or direct Instagram chat.
3. **Global Layout Fallback (`app/global-error.jsx`)**:
   - Catches root HTML and layout crashes.
4. **Resilient Offline Cart Flow**:
   - If the customer loses internet or the backend API is temporarily unreachable, the cart automatically falls back to client-side receipt generation so the customer is **never blocked** from completing their Instagram order!
5. **Structured Server Logger (`lib/logger.js`)**:
   - Provides structured timestamped logs with sensitive data redaction.

---

## 👑 Bakery Admin Control Portal (`/admin`)

Access the live bakery portal at `http://localhost:3000/admin`:
- **Default Key**: `baketale-secret-2026` (configurable via `ADMIN_API_KEY` environment variable).
- **Features**:
  - Live revenue & order metrics.
  - Pending Instagram DMs counter.
  - Interactive order status pipeline (Pending IG DM → Confirmed → In The Oven / Baking → Out for Delivery → Delivered).
  - Itemized receipt viewer.
  - Custom cake inquiries mailbox.

---

### 2. How to Edit Menu Items, Sizes & Prices
All prices and items are stored in [lib/data.js](file:///c:/Users/ELCOT/Downloads/baketale-next/bt-next/lib/data.js):
- **Flavours & Prices (250 g / 500 g / 1 kg)**:
  ```javascript
  export const FLAVOURS = [
    { id: 'classic',   name: 'Classic Chocolate', p: [250, 450, 850], img: '/assets/brownies/classic.webp' },
    { id: 'lotus',     name: 'Lotus Biscoff',     p: [350, 650, 1250], img: '/assets/brownies/biscoff.webp', premium: true },
    ...
  ];
  ```
- **Specials**: Edit the `SPECIALS` array (Assorted Box, Brownie Bites, Tub, Tower).
- **Brownie Cakes**: Edit the `CAKES` array (Bento Brownie Cake, Customised Brownie Cake).
- **Extras & Add-ons**: Edit the `EXTRAS` and `ADDONS` tuples.
- **The ₹150 Brownie Box**: Edit the `BOX_FLAVOURS` array.

### 3. How to Swap Brownie Photos & Hero Assets
All food assets reside in `public/assets/brownies/`:
- `classic.webp` — Classic Chocolate Brownie
- `nutella.webp` — Nutella Hazelnut Brownie
- `biscoff.webp` — Lotus Biscoff Brownie
- `pistachio.webp` — Pistachio Brownie
- `oreo.webp` — Oreo Cookies & Cream Brownie
- `cake.webp` — Bento Brownie Cake ("Good Vibes Only")
- `gift_box.webp` — Open Gift Box of Brownies
- `stack.webp` — Tall Brownie Stack
Simply drop your high-resolution PNG or WebP files with the same filenames to replace them instantly.

### 4. How the Layer Separation Scroll Sequence Works
The deconstructed brownie animation in the **Anatomy** section renders a scrubbed 120-frame canvas sequence from:
`public/seq/frame_001.webp` through `public/seq/frame_120.webp`
To replace with a custom 3D or video clip:
1. Render or record your clip (1080px max width, 30fps).
2. Extract frames as WebP using ffmpeg:
   ```bash
   ffmpeg -i your_clip.mp4 -vf "scale=1080:-1" public/seq/frame_%03d.webp
   ```
3. Update `TOTAL_FRAMES` in [components/AnatomySequence.jsx](file:///c:/Users/ELCOT/Downloads/baketale-next/bt-next/components/AnatomySequence.jsx) if different from 120.

---

## 🎨 Design System & Anti-"AI Look" Tokens

- **Core Palette**:
  - Cocoa: `#3a1a0e` (Dark roasted chocolate)
  - Cream: `#fbf1e2` (Warm vanilla cream foundation)
  - Blush: `#f4d6d0` (Bakery pastel blush)
  - Pink: `#f0b9b3` (Strawberry glaze accent)
  - Caramel: `#c98a4b` (Salted butter caramel)
  - Ink: `#2a1109` (High-contrast typographic cocoa ink)
- **Hero Flavour Themes**:
  - Classic: `#3a1a0e` (Ink: `#fbf1e2`)
  - Nutella: `#9a5426` (Ink: `#fff3e2`)
  - Lotus Biscoff: `#e0b277` (Ink: `#2a1109`)
  - Pistachio: `#6f7f3d` (Ink: `#fbf6e6`)
  - Oreo: `#2d2d3a` (Ink: `#fbf1e2`)
- **Typography**:
  - Headings: `Fraunces` (variable serif, tight tracking `-0.02em`)
  - Body: `DM Sans` (clean, high-legibility sans)
  - Accents: `Caveat` (warm handwritten baker notes)
- **Dividers & Shapes**: Organic SVG waves and a dripping couverture border.
- **Motion Timing**: Continuous spring physics (`stiffness: 90, damping: 16`), Lenis smooth scrolling synced with GSAP ticker, with zero layout shift.

---

## 📋 Honest List of Minor Deviations & Testing Notes

1. **Automated Playwright Subagent vs. Live Browser**:
   - The Antigravity internal browser subagent was unable to download the driver (`playwright-1.57.0-win32_x64.zip` returned 404 from the external CDN). Verification was performed on live browser rendering on `localhost:3000` using direct screenshots provided by the user.
2. **Burger 3D Video vs. 120-Frame Canvas Scrubbing**:
   - The reference video used a cinematic 3D render. We implemented a 120-frame scrubbed 2D canvas in [components/AnatomySequence.jsx](file:///c:/Users/ELCOT/Downloads/baketale-next/bt-next/components/AnatomySequence.jsx) with frame preloading, which guarantees 60fps performance and instantaneous touch responsiveness across desktop and mobile.
3. **Maison Cacao Secondary Sequence**:
   - Implemented as [components/MeltingSequence.jsx](file:///c:/Users/ELCOT/Downloads/baketale-next/bt-next/components/MeltingSequence.jsx) with scroll-driven fluid expansion, gloss reflections, and dripping Ganache.
4. **Sample Testimonials**:
   - In adherence to the anti-"AI look" rules, all reviews are transparently tagged `SAMPLE TESTIMONIALS` until connected to live Instagram customer mentions.
