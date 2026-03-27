# Second Act Digital — Animation, Responsive & Implementation Guide

> **Purpose:** This document covers motion design, responsive breakpoints, accessibility considerations, and a quick-reference cheat sheet for building new pages in the Second Act Digital visual language.
>
> **Prerequisite:** Read Part 1 (Brand Foundation) and Part 2 (Component Patterns) first.

---

## 1. Motion & Animation

### Design Principles for Motion
- **Purposeful, not decorative** — animations guide attention or provide feedback
- **Subtle and fast** — transitions are 200–400ms; nothing lingers
- **Pixel-art appropriate** — no smooth easing on pixel elements (they should snap or step)
- **Entry animations** — elements fade/slide in as they enter the viewport

### Transition Tokens

```css
:root {
  --transition-fast:   0.15s ease;
  --transition-base:   0.3s ease;
  --transition-slow:   0.5s ease;
  --transition-snap:   0.1s steps(3);  /* For pixel-art elements */
}
```

### Scroll-Triggered Entrance Animations

```css
/* Base state — hidden before intersection */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal--visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children — for card grids/carousels */
.reveal-stagger > * {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.reveal-stagger--visible > *:nth-child(1) { transition-delay: 0s; }
.reveal-stagger--visible > *:nth-child(2) { transition-delay: 0.12s; }
.reveal-stagger--visible > *:nth-child(3) { transition-delay: 0.24s; }

.reveal-stagger--visible > * {
  opacity: 1;
  transform: translateY(0);
}
```

### JavaScript Intersection Observer

```javascript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const cls = entry.target.classList.contains('reveal-stagger')
          ? 'reveal-stagger--visible'
          : 'reveal--visible';
        entry.target.classList.add(cls);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => {
  observer.observe(el);
});
```

### Hover Micro-Interactions

```css
/* Button fill on hover */
.btn-cta:hover {
  background: var(--sad-chartreuse);
  color: var(--sad-navy-deep);
}

/* Arrow nudge */
.btn-cta:hover::after {
  transform: translateX(4px);
}

/* Link color shift */
a:hover {
  color: var(--sad-chartreuse);
}

/* Card — no lift (cards don't elevate on hover in this design) */
/* Instead, the carousel arrows handle navigation interaction */

/* Pixel art sprites — subtle scale on hover for interactive contexts */
.team-cta__sprite:hover {
  transform: scale(1.03);
  transition: transform var(--transition-base);
}
```

### Carousel / Slider Animation

```css
.carousel {
  overflow: hidden;
  position: relative;
}

.carousel__track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.carousel__slide {
  flex: 0 0 calc(100% / 3);  /* 3 cards visible */
  padding: 0 0.75rem;
}

@media (max-width: 1024px) {
  .carousel__slide { flex: 0 0 50%; }    /* 2 cards */
}

@media (max-width: 640px) {
  .carousel__slide { flex: 0 0 100%; }   /* 1 card */
}
```

### The "Level Up" Element

The pre-footer section features a **3D pixel-art "LEVEL UP" block** — a small isometric pixel-art rendering, right-aligned on the dark navy footer bar. This is likely a static image or simple sprite, not a complex animation.

```css
.level-up {
  background: var(--sad-navy-deep);
  padding: var(--space-sm) var(--space-lg);
  display: flex;
  justify-content: flex-end;
}

.level-up__img {
  width: 100px;
  height: auto;
  image-rendering: pixelated;
}
```

---

## 2. Responsive Breakpoints

### Breakpoint System

| Token | Width | Target |
|-------|-------|--------|
| `sm` | 480px | Small phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1600px | Large monitors |

```css
/* Mobile-first media queries */
@media (min-width: 480px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1600px) { /* 2xl */ }
```

### Responsive Behavior by Component

| Component | Mobile (< 768px) | Tablet (768–1024px) | Desktop (1024px+) |
|-----------|-------------------|---------------------|---------------------|
| **Hero** | Reduced padding, smaller pixel text | Medium sizing | Full viewport, large pixel H1 |
| **Nav** | Hamburger menu | Hamburger menu | Horizontal link bar |
| **Intro Block** | Single column, image below | Single column | Two columns side-by-side |
| **Service Carousel** | 1 card visible, swipeable | 2 cards visible | 3 cards visible |
| **Team CTA** | Stacked: heading → sprites below | Side by side | Two columns, sprites right |
| **Bottom CTA** | Stacked, full-width | Stacked | Two columns |
| **Footer** | Stacked center | Horizontal flex | Horizontal flex, spread |
| **Geometric blocks** | Hidden or minimal | Reduced | Full compositional effect |

### Mobile-Specific Overrides

```css
@media (max-width: 767px) {
  .section {
    padding: var(--space-lg) var(--space-sm);
  }

  /* Stack all two-column grids */
  .intro-block,
  .team-cta,
  .bottom-cta {
    grid-template-columns: 1fr;
  }

  /* Reduce pixel font sizes (they get blocky fast on small screens) */
  h1 { font-size: 1.75rem; line-height: 1.25; }
  h2 { font-size: 1.375rem; line-height: 1.3; }
  h3 { font-size: 1.125rem; line-height: 1.35; }

  /* Full-width buttons */
  .btn-cta {
    width: 100%;
    justify-content: center;
  }

  /* Reduce hero to comfortable height */
  .hero {
    min-height: auto;
    padding: var(--space-xl) var(--space-sm);
  }

  /* Hide geometric blocks on mobile */
  .geo-block {
    display: none;
  }

  /* Team sprites smaller */
  .team-cta__sprite {
    height: 120px;
  }
}
```

### Pixel Font Responsive Note

Pixel fonts need special care at small sizes because they can become illegible when they hit fractional pixels. Use whole-pixel sizes where possible:

```css
/* Pixel font should snap to even sizes for crispness */
@media (max-width: 640px) {
  .pixel-heading {
    font-size: 16px;  /* Not clamp — use fixed pixel values */
  }
}
```

---

## 3. Accessibility Baseline

### Color Contrast Compliance

| Combination | Estimated Ratio | WCAG |
|-------------|----------------|------|
| White on Deep Navy (#1b1f4b) | ~14:1 | AAA ✓ |
| Chartreuse (#d4f541) on Deep Navy (#1b1f4b) | ~9.5:1 | AAA ✓ |
| Charcoal (#3a3a3a) on White (#fff) | ~10:1 | AAA ✓ |
| Pixel Blue (#2233aa) on White (#fff) | ~7:1 | AAA ✓ |
| Navy (#1b1f4b) on Chartreuse (#d4f541) | ~9.5:1 | AAA ✓ |
| Navy (#1b1f4b) on Yellow Wash (#f0f4c3) | ~8:1 | AAA ✓ |

> The color system is well-designed for contrast — the navy-on-chartreuse and chartreuse-on-navy pairings both exceed AAA thresholds.

### Focus States

```css
*:focus-visible {
  outline: 2px solid var(--sad-chartreuse);
  outline-offset: 3px;
}

*:focus:not(:focus-visible) {
  outline: none;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .reveal,
  .reveal-stagger > * {
    opacity: 1;
    transform: none;
  }
}
```

### Pixel Art Accessibility
- All pixel-art icons must have descriptive `alt` text
- Pixel-art team avatars should include the person's name in `alt`
- Pixel fonts can be harder to read for some users — ensure line-height is generous (1.3+)
- Never use pixel font below ~14px — it becomes illegible

### Semantic Requirements
- Heading hierarchy: h1 → h2 → h3, strictly sequential per section
- Form fields: associated `<label>` elements, required fields marked
- Interactive elements: keyboard-focusable, operable via Enter/Space
- Carousel: arrow buttons have aria-labels, slides announce via aria-live

---

## 4. Page Template Quick-Reference

```html
<!-- 1. Hero Section (navy bg + photo overlay) -->
<section class="hero section--dark">
  <img class="hero__bg" src="[photo]" alt="" />
  <div class="container">
    <div class="hero__content">
      <h1 class="hero__title">
        [word] <span class="accent">[chartreuse word]</span>
      </h1>
      <p class="hero__description">[bold brand statement]</p>
      <a href="/contact-us/" class="btn-cta">
        Let's Create Together
      </a>
    </div>
  </div>
</section>

<!-- 2. Intro Block (white bg) -->
<section class="section--light">
  <div class="container intro-block">
    <div class="intro-block__text">
      <h2 class="intro-block__heading">[pixel-font headline]</h2>
      <p class="intro-block__body">
        [body copy]—<strong>[bold emphasis closing phrase]</strong>
      </p>
      <a href="/contact-us/" class="btn-cta btn-cta--on-light">
        Build With Us
      </a>
    </div>
    <div class="intro-block__image-collage">
      <img src="[photo]" alt="[descriptive]" />
      <div class="geo-block geo-block--top-right"></div>
      <div class="geo-block geo-block--mid-right"></div>
    </div>
  </div>
</section>

<!-- 3. Transition Banner -->
<section class="transition-banner">
  <h3 class="transition-banner__text">Ideas built to break limits.</h3>
</section>

<!-- 4. Service Card Carousel (white bg) -->
<section class="section--light">
  <div class="container--wide carousel">
    <div class="carousel__track">
      <div class="carousel__slide">
        <div class="service-card service-card--navy">...</div>
      </div>
      <div class="carousel__slide">
        <div class="service-card service-card--blue">...</div>
      </div>
      <div class="carousel__slide">
        <div class="service-card service-card--chartreuse">...</div>
      </div>
    </div>
    <button class="carousel__arrow carousel__arrow--prev">←</button>
    <button class="carousel__arrow carousel__arrow--next">→</button>
  </div>
</section>

<!-- 5. Team CTA (yellow-green wash bg) -->
<section class="team-cta">
  <div>
    <h2 class="team-cta__heading">[provocative pixel heading]</h2>
    <a href="/about-us/" class="btn-cta btn-cta--on-yellow">
      Meet Your A-Team
    </a>
  </div>
  <div class="team-cta__sprites">
    <img class="team-cta__sprite" src="[sprite1]" alt="[Name]" />
    <img class="team-cta__sprite" src="[sprite2]" alt="[Name]" />
    <img class="team-cta__sprite" src="[sprite3]" alt="[Name]" />
    <img class="team-cta__sprite" src="[sprite4]" alt="[Name]" />
  </div>
</section>

<!-- 6. Level Up + Footer -->
<div class="level-up">
  <img class="level-up__img" src="[level-up-pixel-art]" alt="Level up" />
</div>
<footer class="footer">
  <div class="footer__logo"><img src="[logo]" alt="Second Act Digital" /></div>
  <nav class="footer__nav">
    <a href="/services/">Services</a>
    <a href="/about-us/">About Us</a>
    <a href="/contact-us/">Contact Us</a>
  </nav>
  <span class="footer__copyright">© Second Act Digital. All rights reserved.</span>
</footer>
```

---

## 5. Do's and Don'ts Cheat Sheet

### ✅ Do

- Use the **pixel/8-bit typeface** for all headings and display text — this IS the brand
- Use **deep navy** (`#1b1f4b`) as the primary dark, never pure black
- Use **neon chartreuse** (`#d4f541`) as the primary accent for CTAs, links, heading highlights
- Keep hero **H1 lowercase** — strongest single brand signal
- Use **ghost/outline buttons** with an arrow (→) as the primary CTA style
- Alternate card backgrounds through the **navy → blue → chartreuse** rotation
- Include **white geometric blocks** as compositional elements over photography
- Use **pixel-art icons and sprites** — they're core to the identity, not decorative extras
- Use a **navy-blue duotone overlay** on photography (not black, not gray)
- Keep **Montserrat for body/UI** text — the clean/pixel contrast is deliberate
- Include the **"Level Up" pixel element** in pre-footer sections
- Use **wide letter-spacing + uppercase** for nav links and button labels
- Apply `image-rendering: pixelated` to all pixel-art assets

### ❌ Don't

- Use pure black (`#000000`) — the brand black is navy
- Use filled/solid primary buttons — ghost outline is the signature
- Use border-radius on buttons, cards, or inputs (sharp corners only)
- Use any font other than Montserrat for body text
- Use any font other than the pixel typeface for headings
- Use stock line icons or icon fonts — everything is custom pixel art
- Place real photography without the navy-blue tint overlay
- Center-align body paragraphs (left-align always)
- Write formal, corporate, hedging copy ("We strive to...", "Our mission is...")
- Skip the chartreuse accent word in hero H1 text
- Use the chartreuse for large background fills outside of the card rotation pattern
- Apply anti-aliasing or smoothing to pixel-art assets
- Animate pixel-art elements with smooth easing (use stepped/snap transitions)

---

## 6. Asset Reference

### Key Brand Assets

| Asset | Description | Notes |
|-------|------------|-------|
| Logo lockup | "Sa" mark + "SECOND ACT DIGITAL" wordmark | Chartreuse mark, white/navy wordmark |
| Level Up block | 3D pixel-art "LEVEL UP" element | Right-aligned in pre-footer |
| Team sprites | 4× pixel-art character figures | ~200px tall each |
| Service icons (6×) | Pixel-art illustrations per service | Magnifying glass, heart, laptop, brush, megaphone, phone |
| Hero photos | Editorial photography with navy overlay | Diverse creative professionals |

### Font Resources

```html
<!-- Google Fonts (pixel + body) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
```

### Technology Context
- **Platform:** WordPress + Elementor page builder
- **Theme:** Custom / Hello Elementor child
- **CSS:** Elementor inline styles + global design system
- **Hosting:** Standard WordPress hosting
- **Fonts:** Google Fonts (Press Start 2P + Montserrat, or licensed equivalents)
- **Pixel art:** Custom-produced illustrations (not a library)

When building new work for Second Act or their clients, this visual language can be adapted into any modern framework (Nuxt/Vue, React, Tailwind, etc.) using the CSS custom properties and component patterns from Parts 1–3.

---

*End of Style Guide — Parts 1, 2, and 3 form the complete Second Act Digital Design System.*
