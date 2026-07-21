# Home Page Implementation Plan — Marky Isulat Portfolio

> **Purpose:** This document translates the layout reference (wireframe screenshot) into a build-ready spec for an AI coding agent (Antigravity/`agy`, Gemini CLI, etc.). It defines structure, data shape, styling direction, animation ownership, and explicit boundaries. Read Section 1 in full before writing any code.

---

## 0. Assumptions — confirm before building

- This continues the existing portfolio project (`react-portfolio-2k26`): **React + Vite + TypeScript + GSAP + Motion (Framer Motion) + shadcn/ui**, now adding **ReactBits**.
- Existing brand tokens apply: `brand-navy`, `brand-teal`, accent `#38BDF8`, background `#080A0F`. **Verify the exact hex/token mapping in `tailwind.config` — do not invent new values or guess which token maps to which hex.**
- The wireframe defines **layout and structure only**, per Mark's note. Gray boxes, placeholder Lorem Ipsum, and repeated bullet lists are structural stand-ins, not final content or a signal to keep things monochrome — the real build should follow the established brand identity, not the wireframe's gray/black/white palette.
- This spec covers the **Home page only**. `HOME / ABOUT / WORKS / SERVICES` in the navbar are treated as routes to existing or future pages; Navbar and Footer are shared layout components, not Home-specific.

If any assumption above turns out to be wrong once you've done Section 1's context gathering, stop and flag it rather than building on a wrong foundation.

---

## 1. Mandatory Context Gathering (do this before writing any code)

- [ ] Inspect `src/` — existing folder conventions, whether a `data`/`content` layer already exists, existing naming patterns
- [ ] Read `tailwind.config.*` and global CSS — confirm real values for `brand-navy`, `brand-teal`, accent, background, existing font families, spacing/radius scale
- [ ] Check whether `Navbar` / `Footer` already exist anywhere in the codebase — **extend, do not duplicate**
- [ ] Check `package.json` and `components.json` for what's already installed: `gsap`, `@gsap/react`, `motion` (or legacy `framer-motion`), shadcn components already added
- [ ] Check whether any ReactBits components have already been pulled into the repo (they get copied in via CLI into your own source tree, not npm-installed as a dependency) — note wherever they currently live so new ones land in the same place
- [ ] Confirm routing setup (React Router or otherwise) and where page-level files live
- [ ] Skim any prior agent-readable specs already in this repo for naming/format conventions already established, and match them

---

## 2. Page Section Map

Top to bottom, eight sections:

1. Navbar
2. Hero
3. Tagline strip
4. Stats
5. Tech stack (dark section)
6. Services
7. Featured works
8. CTA + footer

---

## 3. Suggested File Structure

Adapt to whatever's already established in the repo (see Section 1) rather than forcing this exact shape.

```
src/
  components/
    layout/
      Navbar.tsx
      Footer.tsx
    home/
      Hero.tsx
      TaglineStrip.tsx
      Stats.tsx
      TechStack.tsx
      Services.tsx
      FeaturedWorks.tsx
      CtaSection.tsx
    ui/                # shadcn components
    reactbits/          # wherever ReactBits components already land
  data/
    navigation.ts
    socials.ts
    stats.ts
    techStack.ts
    services.ts
    projects.ts
  types/
    content.ts
  pages/
    Home.tsx
```

### Shared content types (`src/types/content.ts`)

```ts
export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: "facebook" | "github" | "linkedin" | "discord";
  label: string;
  url: string;
}

export interface StatItem {
  value: string;   // "10+", "3yr+" — keep the "+"/suffix as part of the string
  label: string;   // "brands"
}

export interface SkillBadge {
  name: string;
  icon: string;    // icon component key/slug, resolved in a lookup map
}

export interface TechStackGroup {
  heading: "Developer" | "Designer";
  skills: SkillBadge[];
}

export interface ServiceItem {
  slug: string;
  title: string;
  description: string;
  bullets: string[];
  href: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: "Graphic Design" | "Software Development" | "Social Media Management";
  description: string;
  techStack: string[];
  image: string;
  href: string;
}
```

Every section below pulls from a typed array in `src/data/`, never hardcoded inline in JSX.

---

## 4. Section Specs

### 4.1 Navbar
- Layout: logo left, links (`HOME / ABOUT / WORKS / SERVICES`) center-left, `LETS WORK` pill button right, sticky on scroll.
- Data: `NavLink[]` from `navigation.ts`.
- Mobile: collapse to a hamburger triggering a shadcn `Sheet` (slide-in drawer) rather than a custom overlay.
- A11y: `<nav>` landmark, `aria-current="page"` on the active link, visible focus rings, keyboard-operable drawer.

### 4.2 Hero
- Two-column grid: name + socials + resume button (left), image (right). Stacks on mobile (image can go above or below text — pick one and stay consistent).
- `MARKY` / `ISULAT` is the page's single `<h1>`, two lines as shown.
- Socials row: `SocialLink[]`, rendered as a shared `Badge`/pill component (shadcn `Badge` is a good base), one variant for this light context.
- Resume button: real `<a>` with `href` to an actual PDF and a `download` attribute — not a dead button.
- Right column: needs a real photo/illustration asset — currently a gray placeholder.
- Animation: this is the one place to spend the page's "signature" motion budget (see Section 6) — a text-reveal treatment on the name, staggered fade-in for socials/resume underneath.
- A11y: descriptive `alt` on the hero image; if socials render as icons only, each needs an `aria-label` (e.g. `aria-label="GitHub"`).

### 4.3 Tagline Strip
- Full-width bar: `GRAPHIC DESIGN – SOFTWARE DEVELOPMENT – SOCIAL MEDIA MANAGEMENT`.
- Store as a single reusable constant — it repeats verbatim in the footer.
- As built, the wireframe shows this static and centered. An infinite marquee is a reasonable upgrade given the tools available, but treat it as optional polish, not a requirement — a static strip is not wrong.

### 4.4 Stats
- Four items, equal-width, wraps to 2×2 then a single column on small screens.
- Data: `StatItem[]` — `10+ brands`, `20+ clients`, `5+ software shipped`, `3yr+ experience`. Confirm these numbers are still accurate before shipping.
- Animation: count-up on scroll into view fits naturally here (see Section 6) — animate only the numeric part, keep the `+`/suffix static so it doesn't count up nonsensically.

### 4.5 Tech Stack (dark section)
- Full-bleed dark section (background token from Section 0), two columns — **Developer** and **Designer** headings in the accent color, each followed by wrapped icon+label pill badges.
  - Developer: React, Next.js, Supabase, Laravel, Firebase, Tailwind CSS
  - Designer: Photoshop, Illustrator, Canva, Figma, CapCut
- Icons: a brand-icon set like `react-icons` (Simple Icons set) or `@icons-pack/react-simple-icons` covers most of these. Double-check CapCut and Canva are actually present in whichever set you pick — if not, fall back to a manually-added SVG rather than skipping the icon.
- `View All` link in the corner needs a destination — see Open Questions (Section 9).
- Contrast check: confirm the accent color against the dark background actually passes WCAG AA for text — don't assume it does just because it looks fine at a glance.
- Animation: staggered fade/scale-in per badge on scroll, once, not on every scroll pass.

### 4.6 Services
- `SERVICES` heading, three cards: **Graphic Design**, **Software Development**, **Social Media Management**. Each: title, description, bullet list, "Learn More" link.
- **Important:** the wireframe shows the identical bullet list (Logo and Branding, Publication Materials, Apparel Design, Email Ad Design, Product Design) under all three cards. That's a wireframe artifact, not real content — each service needs its own distinct list that actually matches the service (Software Development's bullets shouldn't be about apparel design).
- Data: `ServiceItem[]`.
- Animation: scroll-reveal stagger across the three cards, subtle hover lift (translate-y + shadow).

### 4.7 Featured Works
- `FEATURED WORKS` heading, 3×2 grid (6 projects), collapsing to 2-col then 1-col.
- Each card: thumbnail, small-caps category label, project name, short description, tech stack line.
- Data: `ProjectItem[]`. Real thumbnails needed — currently black placeholders.
- Given `WORKS` is also a top-level nav item, this grid is almost certainly a *featured subset* of a fuller works page — consider adding a "View All Works" link/button below the grid even though the wireframe doesn't explicitly show one.
- Animation: image hover zoom (`overflow-hidden` + `scale` on the image, not the card), scroll-reveal stagger.

### 4.8 CTA + Footer
- `LETS WORK TOGETHER` heading + "Book your free consultation" — the wireframe shows this as plain text; it should almost certainly be an actual link/button (Calendly, contact form, mailto — see Open Questions).
- Footer proper (name + tagline) is minimal in the wireframe. Worth asking whether to keep it deliberately minimal (matches the clean aesthetic) or add the usual footer utility (copyright line, quick links, repeated socials) — flagged in Section 9, not assumed either way.

---

## 5. Design System Notes

- **Typography:** the wireframe's oversized, tight, all-caps display type for the hero name and section headings is doing a lot of the personality work here — treat it as a deliberate display face, not just a bigger font-size of the body text. Pair it with a calmer body face for descriptions/bullets.
- **Buttons:** two distinct treatments appear — solid dark pill (`RESUME`, `LETS WORK`) and light/quiet pill (social tags). Model both as variants of one shared component (shadcn `Button`/`Badge` + `class-variance-authority`) rather than two one-off implementations.
- **Cards:** three different card treatments show up (light-gray info cards for stats/services, black-image cards for featured works, dark full-bleed for tech stack) — keep them visually distinct but structurally consistent (same radius scale, same padding rhythm) so the page reads as one system.
- **Spacing:** the wireframe uses generous, consistent vertical gaps between sections — pick one section-padding value (e.g. a `py-24 md:py-32` equivalent) and reuse it everywhere rather than eyeballing each section separately.
- **Signature moment:** the dark tech-stack section, combined with the hero name treatment, is a natural place to let this page's personality live, precisely because it's already distinct from the rest of the (lighter, quieter) page. Resist animating every section with equal intensity — one or two deliberate moments read as more intentional than motion sprinkled evenly across all eight sections.
- Only one `<h1>` on the page (the hero name); section titles are `<h2>`; card titles are `<h3>`.

---

## 6. Animation Strategy — who does what

You have three animation tools available. Without a clear division of labor they'll overlap and fight each other. Suggested split:

| Tool | Use for | Notes |
|---|---|---|
| **GSAP** (`gsap` + `@gsap/react`'s `useGSAP()` hook + `ScrollTrigger`) | Scroll-driven reveals and batched stagger sequences: stats counting up, tech-stack badges staggering in, featured-works grid staggering in | GSAP is fully free now (Webflow/GreenSock), including `SplitText`, `ScrollTrigger`, `ScrollSmoother` — no license gating to worry about. `SplitText` also ships with built-in screen-reader handling, which matters if you use it for the hero headline. |
| **Motion** (package `motion`, `import { motion } from "motion/react"`; `framer-motion` still works identically if that's what's already installed) | Simple mount transitions, hover/tap micro-interactions on buttons and cards, mobile drawer enter/exit via `AnimatePresence` | Use `whileInView` + `viewport={{ once: true }}` for one-shot reveals on smaller elements; `useReducedMotion()` for the accessibility check below. |
| **ReactBits** (installed per-component via `npx shadcn@latest add @react-bits/<Component>-TS-TW`, copied into your own source) | One or two flourishes only — e.g. a text-reveal treatment for the hero name, or a subtle background effect (their WebGL background components) behind the hero or tech-stack section | Spot-check whatever you pull in; some categories in this library have shipped thinner/placeholder implementations historically, so don't assume a component is production-ready without looking at what actually got copied in. |

**Do not** reach for all three on the same element. Pick one owner per interaction.

**Reduced motion (non-negotiable):**
- GSAP: gate heavy timelines behind `gsap.matchMedia()` with a `(prefers-reduced-motion: reduce)` query.
- Motion: check `useReducedMmotion()` and fall back to instant/opacity-only transitions when true.

Example GSAP pattern (batched scroll reveal):
```tsx
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

useGSAP(() => {
  gsap.from(".stat-card", {
    scrollTrigger: { trigger: ".stats-section", start: "top 80%", once: true },
    y: 32,
    opacity: 0,
    stagger: 0.12,
  });
}, { scope: sectionRef });
```

Example Motion pattern (staggered children):
```tsx
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

<motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
  {socials.map((s) => (
    <motion.a key={s.platform} variants={item} href={s.url}>{s.label}</motion.a>
  ))}
</motion.div>
```

---

## 7. Responsive Behavior

| Section | Desktop (≥1024px) | Tablet (640–1023px) | Mobile (<640px) |
|---|---|---|---|
| Navbar | Inline links + CTA | Inline or condensed | Hamburger → `Sheet` drawer |
| Hero | 2-col: text / image | 2-col or stacked | Stacked (pick image above or below text) |
| Tagline strip | Single line | Single line | Single line, may need smaller type |
| Stats | 4-col | 2×2 | 1-col or 2-col |
| Tech stack | 2-col (Dev / Designer) | 2-col or stacked | Stacked |
| Services | 3-col | 2-col (wraps) | 1-col |
| Featured works | 3×2 grid | 2-col | 1-col |
| CTA + footer | Heading / subtext side by side | Stacked | Stacked |

---

## 8. Content & Assets Needed From Mark (not the agent's job to invent)

- [ ] Real hero photo or illustration
- [ ] Resume PDF + hosting location
- [ ] Real URLs for Facebook, GitHub, LinkedIn, Discord
- [ ] Distinct bullet copy for each of the 3 services (not the same list three times)
- [ ] Confirm stats are current: 10+ brands / 20+ clients / 5+ software shipped / 3yr+ experience
- [ ] 6 real featured-work entries: thumbnails, names, descriptions, tech stacks, destination links
- [ ] Decide destination for `View All` (tech stack) and `Learn More` (services)
- [ ] Decide what "Book your free consultation" actually does (external booking link, contact form, mailto)

---

## 9. Explicit "What NOT To Do"

- Do **not** hardcode services, stats, tech badges, projects, or socials directly in JSX — always pull from the typed arrays in `src/data/`.
- Do **not** ship Lorem Ipsum or `NAME OF PROJECT` / `short description` placeholders as final content — either mark them clearly as `TODO` content or hold the section back until real copy is supplied.
- Do **not** copy the wireframe's identical bullet list across all three service cards — write three distinct lists.
- Do **not** introduce new ad-hoc colors outside the tokens confirmed in Section 1 — if a needed color doesn't exist yet, add it to the Tailwind theme deliberately, don't inline a hex value.
- Do **not** skip mobile/tablet layouts — the reference image is desktop-only; every section needs the responsive behavior defined in Section 7.
- Do **not** install a new dependency (icon pack, animation helper, etc.) without first checking whether it's already in `package.json` or achievable with GSAP/Motion/ReactBits/shadcn already in the project.
- Do **not** create a new `Navbar`/`Footer` if one already exists — extend it.
- Do **not** skip `prefers-reduced-motion` handling on GSAP/Motion animations.
- Do **not** ship `<img>` without `alt`, or icon-only interactive elements without `aria-label`.
- Do **not** build the whole page as one monolithic component — one component per section, per Section 3.
- Do **not** animate all eight sections with equal intensity — see the "signature moment" note in Section 5.

---

## 10. Suggested Build Order

1. Data layer: types + `src/data/*.ts` files (even with placeholder values, structured correctly)
2. Navbar + Footer (shared layout)
3. Hero
4. Tagline strip
5. Stats
6. Tech stack
7. Services
8. Featured works
9. CTA
10. Animation pass (GSAP/Motion/ReactBits) — after static layout is correct and content is real, not before
11. Responsive QA across breakpoints in Section 7
12. Accessibility QA — keyboard nav, focus states, contrast, reduced-motion fallback, alt text

---

## 11. Open Questions for Mark (flag, don't block on these — proceed with a reasonable default and note it)

- Is this definitely a continuation of `react-portfolio-2k26` with the existing brand tokens, or a different project?
- Where should `Learn More` (services), `View All` (tech stack), and `Book your free consultation` (CTA) actually link to?
- Is the Featured Works grid a subset of a larger `/works` page, or the complete list of work to show?
- Should the footer stay as minimal as the wireframe shows, or pick up the usual utility content (copyright, quick links, repeated socials)?
