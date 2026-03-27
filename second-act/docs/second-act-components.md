# Second Act Digital — Component Patterns & Layout System

> **Purpose:** This document defines the reusable UI components, layout patterns, spacing system, and interactive behaviors found across [secondactdigital.com](https://secondactdigital.com). Use these patterns as a construction kit for building new pages and features.
>
> **Prerequisite:** Read Part 1 (Brand Foundation) for color values, font stacks, and voice guidelines.

---

## 1. Layout System

### Grid & Container

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.container--wide {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
}
```

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `0.5rem` (8px) | Tight internal padding, icon gaps |
| `--space-sm` | `1rem` (16px) | Paragraph margins, small gaps |
| `--space-md` | `1.5rem` (24px) | Card internal padding, form group gaps |
| `--space-lg` | `3rem` (48px) | Section sub-gaps, card padding |
| `--space-xl` | `5rem` (80px) | Major section vertical padding |
| `--space-2xl` | `7rem` (112px) | Hero section vertical padding |
| `--space-3xl` | `10rem` (160px) | Extra-tall hero padding |

```css
:root {
  --space-xs:  0.5rem;
  --space-sm:  1rem;
  --space-md:  1.5rem;
  --space-lg:  3rem;
  --space-xl:  5rem;
  --space-2xl: 7rem;
  --space-3xl: 10rem;
}
```

### Page Section Rhythm

Every page follows this vertical structure:

```
┌─────────────────────────────────────────────────┐
│  HERO (full-viewport)                           │  Navy bg + photo overlay
│  Pixel H1 (lowercase, chartreuse keyword)       │
│  Montserrat body + ghost CTA button             │
├─────────────────────────────────────────────────┤
│  INTRO BLOCK (white background)                 │  Two columns
│  Left: Pixel H2 + body + bold emphasis + CTA    │
│  Right: Photo collage with white geometric blocks│
├─────────────────────────────────────────────────┤
│  TRANSITION BANNER                              │  Pixel text, chartreuse
│  "Ideas built to break limits." style tagline   │  with navy outline stroke
├─────────────────────────────────────────────────┤
│  CARD CAROUSEL (white background)               │  Horizontal slider
│  3 service cards per view, rotating bg colors   │
│  ← → arrow navigation                          │
├─────────────────────────────────────────────────┤
│  TEAM CTA (pale yellow-green wash bg)           │  Two columns
│  Left: Pixel heading + ghost CTA                │
│  Right: Pixel-art character sprites             │
├─────────────────────────────────────────────────┤
│  STATS / INSIGHTS (if applicable)               │  Tabbed stat cards
├─────────────────────────────────────────────────┤
│  BOTTOM CTA (white bg)                          │  Pixel heading + body + CTA
│  + pixel-art team sprites                       │
├─────────────────────────────────────────────────┤
│  "LEVEL UP" element (navy bg)                   │  3D pixel-art block, right-aligned
├─────────────────────────────────────────────────┤
│  FOOTER (navy bg)                               │  Logo + nav + copyright
└─────────────────────────────────────────────────┘
```

---

## 2. Navigation

### Header / Navbar

```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2.5rem;
  background: transparent;
  transition: background 0.3s ease;
}

.navbar--scrolled {
  background: rgba(27, 31, 75, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.navbar__logo img {
  height: 44px;
  width: auto;
}

.navbar__links {
  display: flex;
  gap: 2.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar__link {
  color: var(--sad-white);
  text-decoration: none;
  font-family: "Montserrat", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: color 0.2s ease;
}

.navbar__link:hover,
.navbar__link--active {
  color: var(--sad-chartreuse);
}
```

**Key characteristics:**
- Transparent on hero, fades to navy on scroll
- Logo: chartreuse "Sa" mark + white wordmark
- 3 links: SERVICES, ABOUT US, CONTACT US
- Links are Montserrat, uppercase, wide-tracked, white → chartreuse on hover
- Active page link highlighted in chartreuse
- Hamburger toggle on mobile

---

## 3. Hero Section

```css
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--space-2xl) 2.5rem;
  overflow: hidden;
}

/* Navy-blue photo overlay */
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(27, 31, 75, 0.78);
  z-index: 1;
}

.hero__bg {
  position: absolute;
  inset: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
  filter: grayscale(30%);
}

.hero__content {
  position: relative;
  z-index: 2;
  max-width: 750px;
}

/* Pixel font, lowercase */
.hero__title {
  font-family: "Press Start 2P", monospace;
  font-size: clamp(2.25rem, 5.5vw, 5rem);
  text-transform: lowercase;
  line-height: 1.2;
  color: var(--sad-white);
  margin-bottom: 1.5rem;
}

/* Chartreuse keyword */
.hero__title .accent {
  color: var(--sad-chartreuse);
}

.hero__description {
  font-family: "Montserrat", sans-serif;
  font-size: clamp(1rem, 1.3vw, 1.2rem);
  font-weight: 400;
  line-height: 1.7;
  color: var(--sad-white);
  margin-bottom: 2.5rem;
  max-width: 600px;
}
```

**Hero Pattern Rules:**
1. Background: full-bleed photography with navy-blue tinted overlay
2. H1 in pixel font, lowercase, with one chartreuse-accented word
3. Description in Montserrat, white, below the heading
4. Ghost CTA button (chartreuse outline) below description
5. Content is **left-aligned**, not centered
6. Each page has a unique lowercase H1 word: "second nature", "services", "about us", "contact us"

---

## 4. Buttons

### Primary CTA Button (Ghost / Outline)

This is the **primary button style** — a ghost/outline button, not a filled button. This is a key visual detail.

```css
.btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.75rem;
  font-family: "Montserrat", sans-serif;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--sad-chartreuse);
  background: transparent;
  border: 2px solid var(--sad-chartreuse);
  border-radius: 0;         /* Sharp corners — no rounding */
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Arrow indicator */
.btn-cta::after {
  content: "→";
  font-size: 1em;
  transition: transform 0.2s ease;
}

.btn-cta:hover {
  background: var(--sad-chartreuse);
  color: var(--sad-navy-deep);
}

.btn-cta:hover::after {
  transform: translateX(4px);
}
```

### CTA on Light Backgrounds

When the button appears on white or pale backgrounds, it uses navy colors:

```css
.btn-cta--on-light {
  color: var(--sad-navy-deep);
  border-color: var(--sad-navy-deep);
}

.btn-cta--on-light:hover {
  background: var(--sad-navy-deep);
  color: var(--sad-white);
}
```

### CTA on Team/Yellow Section

On the pale yellow-green team section:

```css
.btn-cta--on-yellow {
  color: var(--sad-navy-deep);
  border-color: var(--sad-navy-deep);
  background: rgba(42, 60, 170, 0.1);
}

.btn-cta--on-yellow:hover {
  background: var(--sad-navy-deep);
  color: var(--sad-white);
}
```

### Text Link (Inline CTA)

```css
.link-more {
  font-family: "Montserrat", sans-serif;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  transition: color 0.2s ease;
}

/* On dark cards */
.link-more--on-dark {
  color: var(--sad-chartreuse);
}

/* On chartreuse/light cards */
.link-more--on-light {
  color: var(--sad-navy-deep);
}

.link-more::after {
  content: " +";
}
```

### Button Rules
1. **Ghost/outline is the default** — the brand does NOT use filled primary buttons. The outline + arrow style is the signature CTA.
2. **No border-radius** — all buttons have sharp rectangular corners.
3. **Arrow suffix** — every CTA button includes a `→` arrow after the label.
4. **Always uppercase** label text with wide letter-spacing.
5. **Hover = fill** — ghost buttons fill with their border color on hover, text inverts.
6. **CTA copy is a dare** — "Let's Create Together →", "Build With Us →", "Meet Your A-Team →"

---

## 5. Service Cards (Carousel)

The service cards are displayed in a **horizontal carousel/slider** with arrow navigation, showing 3 cards per viewport.

### Card Structure

```css
.service-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-lg) var(--space-lg) var(--space-xl);
  min-height: 420px;
  position: relative;
}

.service-card__icon {
  width: 72px;
  height: 72px;
  margin-bottom: var(--space-md);
  /* Pixel-art icon — rendered as image, not icon font */
  image-rendering: pixelated;
}

.service-card__title {
  font-family: "Press Start 2P", monospace;
  font-size: clamp(1.125rem, 1.8vw, 1.5rem);
  line-height: 1.35;
  margin-bottom: var(--space-sm);
}

.service-card__body {
  font-family: "Montserrat", sans-serif;
  font-size: 0.9375rem;
  line-height: 1.65;
  margin-bottom: var(--space-md);
}

.service-card__link {
  margin-top: auto;
  /* Uses .link-more styles */
}
```

### Card Color Variants (3-card rotation)

```css
/* Variant 1: Deep Navy */
.service-card--navy {
  background: var(--sad-navy-deep);
}
.service-card--navy .service-card__title { color: var(--sad-chartreuse); }
.service-card--navy .service-card__body  { color: var(--sad-white); }
.service-card--navy .service-card__link  { color: var(--sad-chartreuse); }

/* Variant 2: Royal Blue */
.service-card--blue {
  background: var(--sad-blue-royal);
}
.service-card--blue .service-card__title { color: var(--sad-chartreuse); }
.service-card--blue .service-card__body  { color: var(--sad-white); }
.service-card--blue .service-card__link  { color: var(--sad-chartreuse); }

/* Variant 3: Chartreuse */
.service-card--chartreuse {
  background: var(--sad-chartreuse);
}
.service-card--chartreuse .service-card__title { color: var(--sad-navy-deep); }
.service-card--chartreuse .service-card__body  { color: var(--sad-charcoal); }
.service-card--chartreuse .service-card__link  { color: var(--sad-navy-deep); }

/* Variant 4: Dark Charcoal (for second row) */
.service-card--charcoal {
  background: var(--sad-charcoal);
}
.service-card--charcoal .service-card__title { color: var(--sad-chartreuse); }
.service-card--charcoal .service-card__body  { color: var(--sad-white); }

/* Variant 5: Light Gray */
.service-card--light {
  background: var(--sad-gray-light);
}
.service-card--light .service-card__title { color: var(--sad-blue-pixel); }
.service-card--light .service-card__body  { color: var(--sad-charcoal); }
```

### Carousel Navigation

```css
.carousel__arrow {
  color: var(--sad-navy-mid);
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s ease;
}

.carousel__arrow:hover {
  color: var(--sad-chartreuse);
}

/* Arrows positioned at bottom-left and bottom-right of carousel */
.carousel__arrow--prev { /* bottom-left */ }
.carousel__arrow--next { /* bottom-right */ }
```

### Card Rules
1. **No border-radius** — sharp corners on all cards.
2. **No visible border** — cards rely on background color contrast, not stroked borders.
3. **Background rotation** — each row of 3 cards uses a different fill (navy → blue → chartreuse, or navy → charcoal → gray).
4. **Pixel-art icons use `image-rendering: pixelated`** — prevents browser smoothing of pixel art.
5. **"LEARN MORE +"** link always anchored to bottom of card via `margin-top: auto`.

---

## 6. Content Blocks

### Two-Column Intro Block (White Background)

This appears below the hero on every page. Key detail: the **right column uses an offset photo collage with white geometric blocks**.

```css
.intro-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  align-items: start;
  padding: var(--space-xl) 0;
  background: var(--sad-white);
}

.intro-block__text {
  max-width: 560px;
  color: var(--sad-charcoal);
}

.intro-block__heading {
  font-family: "Press Start 2P", monospace;
  color: var(--sad-blue-pixel);
  margin-bottom: var(--space-md);
  /* Pixel font heading on white background uses navy/blue */
}

.intro-block__body {
  font-family: "Montserrat", sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--sad-charcoal);
  margin-bottom: var(--space-md);
}

/* Bold emphasis — the closing phrase in bold */
.intro-block__body strong {
  font-weight: 700;
  color: var(--sad-charcoal);
}

/* Photo collage column */
.intro-block__image-collage {
  position: relative;
}

.intro-block__image-collage img {
  width: 100%;
  filter: none; /* Photos in intro block may or may not have overlay */
}

/* White geometric offset blocks */
.intro-block__image-collage .geo-block {
  position: absolute;
  background: var(--sad-white);
  /* Positioned to overlap/offset the photo edges */
}
```

### Transition Banner (Pixel Text on White)

A full-width statement using pixel text in chartreuse with navy outline — creating a sticker/emboss effect.

```css
.transition-banner {
  width: 100%;
  padding: var(--space-md) 2rem;
  background: var(--sad-white);
  overflow: hidden;
}

.transition-banner__text {
  font-family: "Press Start 2P", monospace;
  font-size: clamp(1.5rem, 4vw, 3.5rem);
  color: var(--sad-chartreuse);
  /* Navy outline/stroke effect */
  -webkit-text-stroke: 2px var(--sad-navy-deep);
  paint-order: stroke fill;
  text-transform: uppercase;
}
```

### Team CTA Block (Yellow-Green Wash)

```css
.team-cta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  align-items: center;
  padding: var(--space-xl) 2rem;
  background: var(--sad-yellow-wash);
}

.team-cta__heading {
  font-family: "Press Start 2P", monospace;
  font-size: clamp(1.25rem, 3vw, 2.25rem);
  color: var(--sad-navy-deep);
  line-height: 1.35;
  margin-bottom: var(--space-md);
}

.team-cta__sprites {
  display: flex;
  gap: var(--space-sm);
  align-items: flex-end;
}

.team-cta__sprite {
  width: auto;
  height: 200px;
  image-rendering: pixelated;
}
```

### Bottom CTA Section (White Background)

```css
.bottom-cta {
  background: var(--sad-white);
  padding: var(--space-xl) 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  align-items: center;
}

.bottom-cta__heading {
  font-family: "Press Start 2P", monospace;
  color: var(--sad-blue-pixel);
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  margin-bottom: var(--space-sm);
}

.bottom-cta__body {
  color: var(--sad-charcoal);
  margin-bottom: var(--space-md);
}
```

---

## 7. Footer

```css
/* "Level Up" pre-footer element */
.level-up {
  background: var(--sad-navy-deep);
  padding: var(--space-md) 2rem;
  display: flex;
  justify-content: flex-end;  /* Right-aligned */
}

.level-up__image {
  width: 120px;
  height: auto;
  image-rendering: pixelated;
}

/* Footer bar */
.footer {
  background: var(--sad-navy-deep);
  padding: var(--space-md) 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.footer__logo img {
  height: 36px;
  width: auto;
}

.footer__nav {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer__nav a {
  color: var(--sad-white);
  font-family: "Montserrat", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer__nav a:hover,
.footer__nav a--active {
  color: var(--sad-chartreuse);
}

.footer__copyright {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8125rem;
  font-family: "Montserrat", sans-serif;
}
```

**Footer pattern:**
- Single-line horizontal bar on navy background
- Logo left, nav center, copyright right
- "Level Up" 3D pixel element sits above footer, right-aligned
- Active page link in chartreuse
- Footer nav is sentence case (not uppercase like header nav)

---

## 8. Forms (Contact Page)

```css
.form {
  max-width: 600px;
}

.form__group {
  margin-bottom: var(--space-md);
}

.form__label {
  display: block;
  font-family: "Montserrat", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--sad-charcoal);
  margin-bottom: 0.5rem;
}

.form__label--required::after {
  content: "*";
  color: var(--sad-blue-royal);
  margin-left: 0.25rem;
}

.form__input,
.form__textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  font-family: "Montserrat", sans-serif;
  font-size: 0.9375rem;
  color: var(--sad-charcoal);
  background: var(--sad-white);
  border: 1px solid #ccc;
  border-radius: 0;  /* Sharp corners */
  outline: none;
  transition: border-color 0.2s ease;
}

.form__input:focus,
.form__textarea:focus {
  border-color: var(--sad-blue-royal);
}

.form__textarea {
  min-height: 150px;
  resize: vertical;
}

.form__submit {
  /* Uses .btn-cta styles */
}
```

---

## 9. Decorative Motifs

### White Geometric Blocks
Rectangular white shapes are overlaid on or adjacent to photography, creating an offset-grid collage effect. This is a **key compositional signature**.

```css
.geo-block {
  position: absolute;
  background: var(--sad-white);
  z-index: 2;
}

/* Example placements — adjust per composition */
.geo-block--top-right {
  top: 0;
  right: 0;
  width: 35%;
  height: 20%;
}

.geo-block--mid-right {
  top: 50%;
  right: 0;
  width: 25%;
  height: 15%;
}
```

### Navy Geometric Blocks
Same technique but with navy fills, used on white-background sections for asymmetric depth.

```css
.geo-block--navy {
  background: var(--sad-navy-deep);
}
```

**Rules:**
- Blocks are always rectangular, never rounded
- They overlap or abut photography to create visual tension
- Typically 2–3 blocks per composition
- Create asymmetric, dynamic layouts that feel editorial

---

*Continue to Part 3: Animation, Responsive Patterns & Implementation Guide →*
