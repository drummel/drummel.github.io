# Second Act Digital — Brand Foundation & Visual Identity

> **Purpose:** This document captures the core visual identity, color system, typography, and brand principles of [secondactdigital.com](https://secondactdigital.com) so that new pages, components, collateral, and digital experiences can be produced with a consistent look and feel.
>
> **Source:** Derived from live site HTML/CSS analysis + visual screenshots (March 2026).

---

## 1. Brand Personality & Voice

### Tone Keywords
- **Disruptive** — unapologetically bold, willing to provoke
- **Confident** — assertive without arrogance, declarative statements
- **Irreverent** — casual profanity ("Who the f*ck are we?"), gaming/pop-culture references
- **Performance-obsessed** — every creative decision ties back to measurable outcomes
- **Insider-coded** — speaks like you're already part of the crew, not pitching from outside

### Voice Rules
| Do | Don't |
|---|---|
| Use short, punchy sentences | Write long, passive corporate prose |
| Lead with verbs and action words | Lead with hedging qualifiers ("We believe...") |
| Drop gaming/arcade metaphors naturally | Force metaphors that don't land |
| Use bold/italic for *emphasis bites* | Bold entire paragraphs |
| Curse sparingly for effect | Overdo profanity — one per page max |
| End sections with a CTA that sounds like a dare | End with generic "Contact us today" |

### Signature Copy Patterns
```
"We don't just [verb] [noun]. We [more aggressive verb] [noun]."
"Your [thing] isn't a [boring thing]; it's a [powerful thing]."
"[Imperative verb]. [Short result statement]."
```

**Examples from the site:**
- "We don't just run ads. We hijack attention."
- "Your site isn't a brochure; it's a dedicated sales engine."
- "Stop scrolling, start noticing."
- "Reality, *upgraded*."
- "Ideas built to break limits."
- "The agency your mother warned you about."

### Gaming / Arcade Motif
The brand uses a pervasive retro-gaming and 8-bit pixel aesthetic as its *primary visual and verbal framework*. This is not a light metaphor — it's baked into the typography, iconography, illustration, and copy:

| Element | How it manifests |
|---------|-----------------|
| **Typography** | All display headings use a pixel/8-bit typeface |
| **Icons** | Every service icon is a custom 8-bit pixel-art illustration |
| **Team portraits** | Custom pixel-art character sprites replace real photos in CTA sections |
| **"Level Up"** | 3D pixel-art "LEVEL UP" block element used as footer CTA |
| **CTA copy** | "Meet Your A-Team", "Press start on your next big win" |
| **Section framing** | "Here's Our Cheat Code: UP, UP, DOWN, DOWN, LEFT, RIGHT…" |
| **Funnel language** | "Tutorial level" for awareness stage, "achievement unlocked" for conversion |

---

## 2. Color System

### Primary Palette

| Role | Color Name | Hex | RGB | Usage |
|------|-----------|-----|-----|-------|
| **Deep Navy** | Primary dark | `#1b1f4b` | 27, 31, 75 | Hero backgrounds, dark card fills, footer bar, nav bar |
| **Royal Blue** | Secondary dark | `#2a3caa` | 42, 60, 170 | Medium-tone card backgrounds, image overlay tint, section accents |
| **Neon Chartreuse** | Primary accent | `#d4f541` | 212, 245, 65 | CTA button borders/text, pixel-font hero keywords, accent card backgrounds, "LEARN MORE" links |
| **White** | Light base | `#ffffff` | 255, 255, 255 | Body text on dark, light section backgrounds, decorative geometric blocks |
| **Dark Charcoal** | Neutral dark | `#3a3a3a` | 58, 58, 58 | Body text on light backgrounds, alternate dark card backgrounds |
| **Pale Yellow-Green** | Warm wash | `#f0f4c3` | 240, 244, 195 | Team/CTA section background |

### Extended / Supporting Colors

| Role | Hex | Usage |
|------|-----|-------|
| **Pixel Blue** | `#2233aa` | Pixel-font headings on light backgrounds, icon fill color |
| **Mid Navy** | `#2e3591` | Carousel navigation arrows, secondary interactive accents |
| **Light Gray** | `#e0e0e0` | Lightest card variant background (e.g., AR card) |

### CSS Custom Properties

```css
:root {
  /* ── Core palette ── */
  --sad-navy-deep:       #1b1f4b;
  --sad-blue-royal:      #2a3caa;
  --sad-chartreuse:      #d4f541;
  --sad-white:           #ffffff;
  --sad-charcoal:        #3a3a3a;
  --sad-gray-light:      #e0e0e0;

  /* ── Extended ── */
  --sad-blue-pixel:      #2233aa;
  --sad-navy-mid:        #2e3591;
  --sad-yellow-wash:     #f0f4c3;

  /* ── Functional aliases ── */
  --sad-bg-dark:         var(--sad-navy-deep);
  --sad-bg-medium:       var(--sad-blue-royal);
  --sad-bg-light:        var(--sad-white);
  --sad-bg-accent:       var(--sad-chartreuse);
  --sad-bg-team:         var(--sad-yellow-wash);

  --sad-text-on-dark:    var(--sad-white);
  --sad-text-on-light:   var(--sad-charcoal);
  --sad-accent:          var(--sad-chartreuse);
  --sad-heading-on-light: var(--sad-blue-pixel);
}
```

### Color Usage Rules

1. **Navy, not black:** The primary dark color is deep navy blue (`#1b1f4b`), never pure black. All "dark" UI uses this navy.
2. **Three-tone dark system:** Dark sections alternate between deep navy and royal blue. Service cards in a single row use three different fills: deep navy, royal blue, and chartreuse.
3. **Light sections exist:** Intro/about blocks and bottom CTA areas use white backgrounds with navy/charcoal text. The design is *not* exclusively dark.
4. **Chartreuse is the star accent:** Used for CTA borders, CTA label text, pixel-font hero keyword highlights, accent card fills, and "LEARN MORE +" links.
5. **White geometric blocks:** Rectangular white shapes are composited over/adjacent to photography as a decorative offset-grid motif — a key compositional signature.
6. **Image duotone is navy-blue**, not neutral gray — photography gets a blue-shifted overlay wash.
7. **Team CTA section** uses a distinctive pale yellow-green wash background with deep navy pixel text.

### Card Background Rotation Pattern

Service cards in each row of three cycle through background colors:

```
Row pattern:
  Card 1  →  Deep Navy (#1b1f4b)     — chartreuse headings, white body text
  Card 2  →  Royal Blue (#2a3caa)    — chartreuse headings, white body text
  Card 3  →  Chartreuse (#d4f541)    — navy pixel headings, dark body text
```

This creates visual rhythm and breaks monotony while maintaining brand cohesion.

---

## 3. Typography

### Dual Font System

The brand uses **two font families** that create a deliberate contrast between retro/gaming personality and clean modern readability.

| Role | Font | Style | Where Used |
|------|------|-------|------------|
| **Display / Headings** | **Pixel/8-bit typeface** | Blocky, bitmap-style letterforms with visible pixel grid | Hero H1, section H2, card titles, transition banners, CTA headings |
| **Body / UI** | **Montserrat** (or similar geometric sans-serif) | Clean, modern, highly readable | Body paragraphs, nav links, button labels, descriptions, captions, copyright |

> **Critical:** The pixel typeface is the single most distinctive visual element of the brand. It *must* be used for all major headings and display text. Body text uses clean sans-serif for readability contrast.

### Pixel Font Identification & Substitutes

The site uses a custom or licensed pixel display font. For reproduction, these Google Fonts approximate the look:

| Font | Match Quality | Notes |
|------|--------------|-------|
| **Press Start 2P** | Closest | True pixel-grid letterforms, blocky, correct weight |
| **Silkscreen** | Good | Slightly more refined pixel rendering |
| **VT323** | Partial | More terminal/monospace feel, thinner strokes |
| **DotGothic16** | Partial | Wider character support, slightly different grid |

```css
/* Google Fonts import */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');
```

### Type Scale

| Element | Font | Size (Desktop) | Size (Mobile) | Color Context |
|---------|------|---------------|---------------|---------------|
| **Hero H1** | Pixel | 60–80px | 32–40px | White + chartreuse keyword on navy photo |
| **Section H2** | Pixel | 32–44px | 22–28px | Pixel-blue on white / Chartreuse on dark |
| **Card H3** | Pixel | 22–30px | 18–22px | Chartreuse on navy-blue / Navy on chartreuse |
| **Transition Banner** | Pixel | 40–60px | 24–36px | Chartreuse with navy outline stroke on white |
| **Body Large** | Montserrat | 18–20px | 16–18px | White on dark / Charcoal on light |
| **Body** | Montserrat 400 | 16px | 15px | White on dark / Charcoal on light |
| **Button Label** | Montserrat 600–700 | 13–15px | 13px | Chartreuse on dark / Navy on light |
| **Nav Links** | Montserrat 600 | 14–15px | 14px | White, uppercase, wide tracking |
| **"LEARN MORE +"** | Montserrat 700 | 13–14px | 13px | Theme-matched, uppercase, 0.15em tracking |

### CSS Typography Implementation

```css
/* ── Base body typography ── */
body {
  font-family: "Montserrat", "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.65;
  letter-spacing: 0.01em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── Pixel display headings ── */
h1, h2, h3,
.pixel-heading {
  font-family: "Press Start 2P", "Silkscreen", monospace;
  line-height: 1.35;
  letter-spacing: 0;
  font-weight: normal; /* Pixel fonts typically have one weight */
}

h1 {
  font-size: clamp(2rem, 5vw, 5rem);
  line-height: 1.15;
  text-transform: lowercase;
}

h2 {
  font-size: clamp(1.5rem, 3.5vw, 2.75rem);
  line-height: 1.25;
}

h3 {
  font-size: clamp(1.125rem, 2vw, 1.75rem);
  line-height: 1.3;
}

/* ── Hero keyword accent ── */
h1 .accent,
h1 em {
  font-style: normal;
  color: var(--sad-chartreuse);
}

/* ── Context-aware heading colors ── */
.section--dark h1,
.section--dark h2,
.section--dark h3 {
  color: var(--sad-chartreuse);
}

.section--light h1,
.section--light h2,
.section--light h3 {
  color: var(--sad-blue-pixel);
}

/* ── Body text contexts ── */
.section--dark { color: var(--sad-white); }
.section--light { color: var(--sad-charcoal); }

/* ── Bold emphasis bites ── */
p strong {
  font-weight: 700;
}

/* ── Italic for single-word brand flavor ── */
p em {
  font-style: italic;
}
```

### Typography Rules

1. **H1 is lowercase** — hero headings on every page use lowercase pixel text. This is the strongest brand signature.
2. **Pixel font for ALL headings** — every h1, h2, h3, transition banner, and card title uses the pixel typeface. Non-negotiable.
3. **One chartreuse keyword per hero** — the H1 contains one word or phrase highlighted in neon chartreuse (e.g., "second **nature**").
4. **Montserrat for all body/UI** — creates clean/legible contrast against the pixel headings.
5. **Bold as punctuation** — mid-paragraph bold in body text emphasizes a closing statement or key phrase.
6. **Italics for brand flavor** — single words in italics add attitude: "*unavoidable*", "*upgraded*".
7. **Wide letter-spacing on UI elements** — nav links, button labels, and "LEARN MORE" use ~0.1–0.15em tracking with uppercase.
8. **Generous line-height on body** — 1.6–1.7 for readability.
9. **Transition banner pixel text** uses a chartreuse fill with a navy-blue outline/stroke effect — giving it a sticker-like appearance.

---

## 4. Logo & Brand Mark

### Primary Logo Lockup
- **Mark:** "Sa" monogram inside a rounded-square shape — rendered in a pixel/retro style, chartreuse (#d4f541) on dark
- **Wordmark:** "SECOND ACT DIGITAL" in clean uppercase Montserrat (or similar geometric sans), white
- **Layout:** Mark left + wordmark right, horizontal alignment
- **Header placement:** Top-left corner

### Footer Logo
Same lockup as header, smaller scale, on dark navy footer bar.

### Color Variants
| Context | Mark Color | Wordmark Color |
|---------|-----------|----------------|
| On dark navy | Chartreuse | White |
| On white/light | Chartreuse (or navy) | Navy |

### Logo Rules
1. The "Sa" mark always accompanies the wordmark
2. Clear space: minimum 1× mark height on all sides
3. Do not alter the chartreuse mark color
4. Minimum lockup width: ~150px

---

## 5. Iconography & Illustration Style

### Pixel Art Service Icons
All service icons are **custom 8-bit pixel-art illustrations** — this is not an icon font or line-icon set:

| Service | Icon | Colors |
|---------|------|--------|
| Search (SEO/SEM) | Magnifying glass with sparkle | Blue body, white lens highlight |
| Social Media | Pixel heart | Blue/purple gradient pixel heart |
| Web Design | Laptop/monitor | Blue frame, yellow screen |
| Creative | Paintbrush | Blue handle, yellow bristle tip |
| Advertising | Megaphone with sound waves | Blue body, wave lines |
| Augmented Reality | Mobile phone | Blue body, green/yellow screen dot |

**Style rules:**
- Chunky pixel grid with clearly visible individual "pixels"
- Primary fill: blue (`#2233aa` range) with chartreuse/yellow accents
- **No anti-aliasing** — hard pixel edges are intentional
- Display size: ~64–100px
- Consistent pixel density and line weight across the full set

### Pixel Art Team Avatars
Each team member has a custom **pixel-art character sprite**:
- Standing full-body figure, facing forward
- Distinct skin tones, hairstyles, clothing colors per person
- ~200–250px display height
- Subtle drop-shadow at feet
- Used in the team CTA section and about page
- Four characters displayed in a row beside the CTA text

### Photography Treatment
- **Overlay:** Deep navy-blue duotone wash (not neutral gray, not black — specifically blue-shifted)
- **White geometric blocks:** Rectangular white shapes composited over/beside photos — creating a collage-like, offset-grid composition
- **Subject matter:** Diverse, urban, creative professionals in candid/editorial style
- **Role:** Photography is secondary to pixel-art identity — it provides texture and human warmth, not the primary visual language

---

*Continue to Part 2: Component Patterns & Layout System →*
