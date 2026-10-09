# Baketale Design Tokens & System Specifications

## 1. Color Palette

### Core Brand Colors
- `--cocoa`: `#3a1a0e` (Deep artisanal dark chocolate)
- `--cocoa-2`: `#4a2412` (Medium roasted cocoa)
- `--cream`: `#fbf1e2` (Warm vanilla cream base)
- `--blush`: `#f4d6d0` (Delicate bakery blush pink)
- `--pink`: `#f0b9b3` (Accent strawberry glaze pink)
- `--caramel`: `#c98a4b` (Rich salted butter caramel)
- `--ink`: `#2a1109` (Dark cocoa ink for crisp typography)

### Hero Flavour Background Colors
- **Classic Chocolate**: `#3a1a0e` (Ink: `#fbf1e2`, Contrast: 11.8:1)
- **Nutella**: `#9a5426` (Ink: `#fff3e2`, Contrast: 6.2:1)
- **Lotus Biscoff**: `#e0b277` (Ink: `#2a1109`, Contrast: 7.9:1)
- **Pistachio**: `#6f7f3d` (Ink: `#fbf6e6`, Contrast: 5.4:1)
- **Oreo**: `#2d2d3a` (Ink: `#fbf1e2`, Contrast: 9.8:1)

---

## 2. Typography Scale
- **Display Headings**: `'Fraunces', Georgia, serif` (weights 500, 700, 900, tight tracking `-0.02em`)
  - Hero Title: `clamp(3rem, 7.5vw, 6.8rem)`
  - Section Headings (`h2`): `clamp(2.2rem, 5vw, 4rem)`
  - Subsection Headings (`h3`): `clamp(1.4rem, 2.8vw, 2.2rem)`
- **Body Copy**: `'DM Sans', system-ui, sans-serif` (weights 400, 500, 700)
  - Large Body: `1.25rem` / line-height `1.5`
  - Standard Body: `1.05rem` / line-height `1.6`
  - Small / Meta: `0.85rem` / line-height `1.4`
- **Handwritten Accents**: `'Caveat', cursive` (weight 700)
  - Notes & Stickers: `1.4rem - 1.8rem`

---

## 3. Spacing Scale & Elevation
- Base grid: `8px`
  - `space-1`: `4px`
  - `space-2`: `8px`
  - `space-3`: `12px`
  - `space-4`: `16px`
  - `space-6`: `24px`
  - `space-8`: `32px`
  - `space-12`: `48px`
  - `space-16`: `64px`
  - `space-24`: `96px`
- Border Radii:
  - Cards: `22px`
  - Buttons & Pills: `999px`
  - Badges & Inputs: `12px`
- Shadows:
  - Floating Nav & Drawer: `0 12px 36px rgba(42, 17, 9, 0.22)`
  - Hover Elevate: `0 18px 32px rgba(42, 17, 9, 0.16)`

---

## 4. Motion Presets
- **Spring Transition (Hero Swaps)**: `stiffness: 90, damping: 16`
- **Spring Pop (Slots & Cart)**: `stiffness: 260, damping: 14`
- **Smooth Easing Curve**: `cubic-bezier(0.22, 1, 0.36, 1)`
- **Respect `prefers-reduced-motion`**: Disables parallax, replaces scrubbed canvas with crisp static photography, maintains instant accessibility.
