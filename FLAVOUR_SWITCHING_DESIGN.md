# Baketale Flavour Switching Design Specification

> **Focus**: Dedicated UI/UX, motion choreography, state synchronization, and interaction design specification strictly for flavour switching.

---

## 1. Design Overview & Objectives

The flavour switching mechanism allows users to preview artisanal brownie flavours through two synchronized modalities:
1. **Direct Tactile Selection**: Interactive flavour pills and pagination dots.
2. **Kinetic Scroll-Scrubbing**: Continuous scroll progress that dynamically transitions across flavours.

### Core Objectives
- **Zero Friction Transition**: Instantaneous visual confirmation when switching flavours.
- **Harmonious Chromatic Atmosphere**: Coordinated palette changes across canvas background, typography ink, and ambient lighting per flavour.
- **Directional Continuity**: Spatial awareness where moving forward (right/down) slides elements upward, while moving backward slides downward.
- **Micro-Physics Polish**: Spring-damped transitions preventing robotic cut-swaps.

---

## 2. Flavour Design Tokens & Chromatic Profiles

Each flavour variant carries a dedicated chromatic palette engineered to maintain WCAG AAA/AA readability and appetite appeal.

| Flavour Variant | Background (`--hero-bg`) | Ink / Text (`--hero-ink`) | Accent Glow | Contrast Ratio |
| :--- | :--- | :--- | :--- | :--- |
| **01. Classic Chocolate** | `#fbf5ed` | `#261107` | `rgba(58, 26, 14, 0.12)` | 13.8:1 (AAA) |
| **02. Nutella Hazelnut** | `#fcf2ea` | `#2a1109` | `rgba(154, 84, 38, 0.15)` | 12.6:1 (AAA) |
| **03. Lotus Biscoff** | `#faf3e5` | `#281206` | `rgba(201, 138, 75, 0.16)` | 13.1:1 (AAA) |
| **04. Sicilian Pistachio** | `#f3f6eb` | `#222d14` | `rgba(111, 127, 61, 0.14)` | 11.4:1 (AAA) |
| **05. Cookies & Cream (Oreo)** | `#f5f3f0` | `#1c1b1a` | `rgba(45, 45, 58, 0.10)` | 14.2:1 (AAA) |

### Transition Timing Token
```css
--flavour-bg-transition: background-color 0.65s cubic-bezier(0.22, 1, 0.36, 1),
                         color 0.45s cubic-bezier(0.22, 1, 0.36, 1);
```

---

## 3. Component Architecture

```
┌────────────────────────────────────────────────────────┐
│  [Flavour Title Mask] (Fraunces Serif - Animated Up/Down)
│                                                        │
│  [Flavour Pill Track]                                  │
│   ( [Classic]  [● Nutella]  [Biscoff]  [Pistachio]  [Oreo] )
│        │            │                                  │
│        └────────────┴── Shared Spring Pill Indicator  │
│                                                        │
│  [3D Product Stage]                                    │
│   ┌──────────────────────────────────────────────┐     │
│   │   Ambient Glow (Flavour Tinted)              │     │
│   │   Brownie Image Asset (Spring Pop & Swapped) │     │
│   │   Subtle Float Animation (±8px, ±1deg)       │     │
│   └──────────────────────────────────────────────┘     │
│                                                        │
│  [Progress Rail & Jump Navigation]                     │
│   02 / 05  [====][====][····][····][····]  (●) (○) (○) │
└────────────────────────────────────────────────────────┘
```

### 3.1. Flavour Pill Track
- **Role**: Primary direct control bar.
- **Pill Geometry**: `height: 44px`, `border-radius: 999px`, padding `10px 22px`.
- **States**:
  - **Inactive**: Transparent background, semi-translucent ink (`opacity: 0.65`), border `1px solid rgba(42, 17, 9, 0.12)`.
  - **Hover**: Subtle lift `translateY(-2px)`, scale `1.05`, border opacity `0.28`.
  - **Active**: Filled with contrasting pill container, shared layout spring backdrop (`layoutId="heroActivePill"`), bold weight typography.
  - **Tap / Pressed**: Instant scale dampening `0.95`.

### 3.2. Title Mask & Heading Switcher
- **Structure**: Overflow-hidden mask container.
- **Choreography**:
  - New title enters from bottom (`+90%` if descending, `-90%` if ascending) with `filter: blur(6px)`.
  - Center resting state: `y: 0`, `opacity: 1`, `filter: blur(0px)`.
  - Previous title exits toward opposite direction (`-90%` or `+90%`) with quick ease-in.

### 3.3. Center Showcase Product Stage
- **Image Dimension**: High-resolution transparent PNG/WebP product cutout.
- **Motion Behavior**:
  - `enter`: `scale: 0.86`, `y: 28px * direction`, `filter: blur(8px)`, `rotate: 4deg * direction`.
  - `center`: `scale: 1`, `y: 0`, `filter: blur(0px)`, `rotate: 0deg`. Spring transition: `stiffness: 120`, `damping: 17`, `mass: 0.8`.
  - `exit`: `scale: 0.88`, `y: -24px * direction`, `filter: blur(8px)`, `rotate: -4deg * direction`, duration `0.26s`.

### 3.4. Progress Rail & Jump Track
- **Numerical Counter**: Two-digit format `01 / 05` updating instantly on index change.
- **Segmented Progress Bars**: 5 parallel bars corresponding to flavour milestones:
  - Progress fill calculation: `scaleX = clamp((progress - (i / N)) * N, 0, 1)`.
- **Dot Jump Buttons**: Circular touch targets (40px clickable wrapper, 8px visible dot) with active ring expansion.

---

## 4. Multi-Flavour Box Switcher Design (₹150 Brownie Box)

For multi-item custom boxes, flavour switching operates as a **Slot-Filling State Machine**:

```
[Available Flavours Selector]
[+ Classic]  [+ Nutella]  [+ Biscoff]  [+ Pistachio]  [+ Oreo]
      │
      ▼ (Tap to assign)
┌──────────────────────────────────────────────┐
│ Kraft Box Slots (Capacity: 3)                │
│ [ Slot 1: Classic ] [ Slot 2: Nutella ] [ Slot 3: Empty ]
└──────────────────────────────────────────────┘
Status: "Pick 1 more flavour" (CTA Disabled)
```

### Slot Interaction Specs:
1. **Flavour Selection**: Tapping an available flavour allocates it into the next unoccupied slot.
2. **Spring Entry**: Assigned item scales from `0.6` to `1.0` with rubber-band spring (`stiffness: 260, damping: 14`).
3. **Flavour Removal**: Tapping a filled slot ejects the item with a scale-down collapse animation and vacates the slot index.
4. **Counter Reflection**: Dynamic counter label reflects individual quantities (e.g., `2× Lotus Biscoff`, `1× Pistachio`).
5. **Completion Lock**: Once 3/3 slots are filled, slot borders shift to gold glow (`#d4af37`), and CTA transitions to active state.

---

## 5. Motion Curves & Kinematics Specifications

| Motion Element | Type | Settings | Rationale |
| :--- | :--- | :--- | :--- |
| **Active Pill Indicator** | Spring | `stiffness: 400`, `damping: 32` | Snappy, fluid gliding between adjacent tabs. |
| **Product Image Swap** | Spring | `stiffness: 120`, `damping: 17`, `mass: 0.8` | Weighty, organic physical feel of handcrafted confectionery. |
| **Masked Text Slide** | Cubic Bézier | `cubic-bezier(0.22, 1, 0.36, 1)`, `380ms` | Editorial, crisp deceleration curve. |
| **Canvas Background Shift**| Cubic Bézier | `cubic-bezier(0.22, 1, 0.36, 1)`, `650ms` | Soft atmospheric dissolve without harsh flash. |
| **Slot Drop-in** | Spring | `stiffness: 260`, `damping: 14` | Playful tactile feedback upon adding to box. |

---

## 6. State Machine & Event Synchronization

### State Variables
- `currentIndex`: Active flavour integer (`0` to `N - 1`).
- `direction`: Integer (`1` for next / forward, `-1` for previous / backward).
- `isManualJump`: Boolean flag suppressing scroll listener during automated smooth scroll.
- `scrollYProgress`: Normalized scroll float (`0.0` to `1.0`).

### Synchronization Flow
```
User Interaction: Tap Flavour Pill [k]
  ├── 1. Compute direction = k >= currentIndex ? 1 : -1
  ├── 2. Set currentIndex = k
  ├── 3. Trigger CSS custom properties update (--hero-bg, --hero-ink)
  ├── 4. AnimatePresence triggers exit on (k-1) and enter on (k)
  ├── 5. Scroll container interpolates to target offset:
  │      targetY = containerTop + ((k + 0.5) / N) * scrollHeight
  └── 6. Progress rail fills bar [0..k] and activates dot [k]
```

---

## 7. Accessibility (a11y) & Usability Requirements

1. **ARIA Roles & Attributes**:
   - Flavour pill track structured as `role="tablist"` with `aria-label="Select brownie flavour"`.
   - Each pill assigned `role="tab"` and `aria-selected="true|false"`.
   - Flavour title assigned `aria-live="polite"` to announce flavour switch to screen readers without jarring interruptions.
2. **Keyboard Traversal**:
   - Left / Right Arrow keys cycle between adjacent flavour options.
   - Enter / Space activates the focused flavour tab.
3. **Motion Sensitivity (`prefers-reduced-motion`)**:
   - Disable blur filters, 3D tilts, and spatial translation offsets.
   - Fall back to simple cross-dissolve opacity transitions (`opacity: 0 -> 1`, `200ms`).
4. **Touch Targets**:
   - All interactive flavour tabs and jump dots enforce minimum hit areas of `44px × 44px`.
