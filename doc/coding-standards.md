# DevCodeX Coding Standards for Lighthouse Optimization

This document defines **mandatory coding rules** for the DevCodeX Web application to achieve **90+ Lighthouse scores** in all categories: Performance, Accessibility, Best Practices, and SEO.

> [!IMPORTANT]
> These rules are **mandatory** for all code contributions. Code that violates these rules should not be merged.

---

## Lighthouse Score Targets

| Category           | Target | Current Weight                             |
| :----------------- | :----- | :----------------------------------------- |
| **Performance**    | 90+    | TBT 30%, LCP 25%, CLS 25%, FCP 10%, SI 10% |
| **Accessibility**  | 90+    | WCAG 2.2 AA compliance                     |
| **Best Practices** | 90+    | Modern web standards                       |
| **SEO**            | 90+    | Crawlability and meta tags                 |

---

## Part 1: Performance Rules

### 1.1 JavaScript Bundle Optimization

#### ✅ MUST: Use Code Splitting for Routes

```typescript
// ✅ CORRECT: Lazy load route components
const QuestionsPage = lazy(
  () => import("@/features/questions/pages/QuestionsPage")
);

// ❌ WRONG: Direct import of large components
import QuestionsPage from "@/features/questions/pages/QuestionsPage";
```

#### ✅ MUST: Wrap Lazy Components with Suspense

```tsx
// ✅ CORRECT: Always wrap with Suspense and skeleton fallback
<Suspense fallback={<PageSkeleton />}>
  <QuestionsPage />
</Suspense>

// ❌ WRONG: No fallback or generic loading text
<Suspense fallback="Loading...">
  <QuestionsPage />
</Suspense>
```

#### ✅ MUST: Use Dynamic Imports for Heavy Libraries

```typescript
// ✅ CORRECT: Dynamic import for chart libraries
const loadChart = async () => {
  const { Chart } = await import("chart.js");
  return Chart;
};

// ❌ WRONG: Static import of heavy libraries
import { Chart } from "chart.js";
```

---

### 1.2 Image Optimization

#### ✅ MUST: Specify Width and Height on All Images

```tsx
// ✅ CORRECT: Explicit dimensions prevent CLS
<img
  src="/image.webp"
  alt="Description"
  width={400}
  height={300}
  loading="lazy"
/>

// ❌ WRONG: Missing dimensions causes layout shift (CLS)
<img src="/image.webp" alt="Description" />
```

#### ✅ MUST: Use `loading="lazy"` for Below-Fold Images

```tsx
// ✅ CORRECT: Lazy load images not in initial viewport
<img src="/image.webp" alt="..." loading="lazy" width={400} height={300} />

// ❌ WRONG: Eager loading of all images
<img src="/image.webp" alt="..." />
```

#### ✅ MUST: Use WebP/AVIF Format for Photographs

- Use **WebP** for photographs and complex images
- Use **SVG** for icons and logos
- Use **PNG** only when transparency is required and WebP is not suitable

#### ✅ SHOULD: Use Responsive Images for Large Images

```tsx
// ✅ CORRECT: Responsive images with srcset
<img
  src="/hero-800.webp"
  srcSet="/hero-400.webp 400w, /hero-800.webp 800w, /hero-1200.webp 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="Hero image"
  width={1200}
  height={600}
/>
```

---

### 1.3 CSS Animation Rules

#### ✅ MUST: Use ONLY GPU-Accelerated Properties for Animations

```css
/* ✅ CORRECT: GPU-accelerated properties */
.element {
  transform: translateX(100px);
  opacity: 0.5;
  transition: transform 0.3s ease-out, opacity 0.2s ease-out;
}

/* ❌ WRONG: Properties that trigger layout/paint */
.element {
  left: 100px; /* Triggers layout */
  width: 200px; /* Triggers layout */
  margin-left: 50px; /* Triggers layout */
  box-shadow: 0 0 10px; /* Triggers paint */
  border-radius: 50%; /* Triggers paint on some browsers */
}
```

#### ✅ MUST: GPU-Safe Animation Properties Only

| Safe (GPU)  | Unsafe (Layout/Paint)            |
| :---------- | :------------------------------- |
| `transform` | `width`, `height`                |
| `opacity`   | `top`, `left`, `right`, `bottom` |
|             | `margin`, `padding`              |
|             | `box-shadow`, `filter`           |
|             | `border-radius` (animated)       |

#### ✅ MUST: Use `will-change` Sparingly

```css
/* ✅ CORRECT: Apply only to frequently animated elements */
.sidebar {
  will-change: transform;
}

/* ❌ WRONG: Blanket use wastes memory */
* {
  will-change: transform, opacity;
}
```

#### ✅ MUST: Support Reduced Motion Preference

```css
/* ✅ CORRECT: Respect user preference */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 1.4 Font Loading

#### ✅ MUST: Use `font-display: swap`

```css
/* ✅ CORRECT: Prevents FOIT (Flash of Invisible Text) */
@font-face {
  font-family: "Inter";
  font-display: swap;
  src: url("/fonts/inter.woff2") format("woff2");
}

/* ❌ WRONG: Blocks text rendering until font loads */
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter.woff2") format("woff2");
}
```

#### ✅ MUST: Preconnect to Font Origins

```html
<!-- In index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

---

### 1.5 Avoid Layout Shifts (CLS)

#### ✅ MUST: Reserve Space for Dynamic Content

```css
/* ✅ CORRECT: Reserve space with min-height */
.content-container {
  min-height: 200px; /* Reserve space before content loads */
}

/* ✅ CORRECT: Use aspect-ratio for media */
.video-container {
  aspect-ratio: 16 / 9;
  width: 100%;
}
```

#### ✅ MUST: Never Insert Content Above Existing Content

```tsx
// ❌ WRONG: Inserting banner at top causes CLS
{showBanner && <Banner />}
<main>...</main>

// ✅ CORRECT: Reserve space or use fixed positioning
<div style={{ minHeight: showBanner ? '60px' : 0 }}>
  {showBanner && <Banner />}
</div>
<main>...</main>
```

---

## Part 2: Accessibility Rules (WCAG 2.2 AA)

### 2.1 Semantic HTML

#### ✅ MUST: Use Semantic HTML Elements

```tsx
// ✅ CORRECT: Semantic structure
<header>
  <nav aria-label="Main navigation">...</nav>
</header>
<main id="main-content">
  <article>
    <h1>Page Title</h1>
    <section aria-labelledby="section-heading">
      <h2 id="section-heading">Section</h2>
    </section>
  </article>
</main>
<aside aria-label="Sidebar">...</aside>
<footer>...</footer>

// ❌ WRONG: Divs for everything
<div class="header">
  <div class="nav">...</div>
</div>
<div class="main">...</div>
```

### 2.2 ARIA Requirements

#### ✅ MUST: All Interactive Elements Have Accessible Names

```tsx
// ✅ CORRECT: Icon button with aria-label
<button aria-label="Close menu">
  <CloseIcon />
</button>

// ❌ WRONG: No accessible name
<button>
  <CloseIcon />
</button>
```

#### ✅ MUST: Use ARIA States for Dynamic Content

```tsx
// ✅ CORRECT: Toggle button with aria-pressed
<button
  aria-pressed={isExpanded}
  aria-expanded={isExpanded}
  aria-controls="menu-content"
>
  Toggle Menu
</button>
<div id="menu-content" aria-hidden={!isExpanded}>...</div>

// ❌ WRONG: No state indication
<button onClick={toggle}>Toggle Menu</button>
```

#### ✅ MUST: Link ARIA Labels to Controlled Elements

```tsx
// ✅ CORRECT: aria-controls references the controlled element's ID
<button aria-controls="sidebar-nav" aria-expanded={isOpen}>
  Menu
</button>
<nav id="sidebar-nav" aria-hidden={!isOpen}>...</nav>
```

### 2.3 Focus Management

#### ✅ MUST: All Interactive Elements Are Keyboard Accessible

```css
/* ✅ CORRECT: Clear focus indicator */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ❌ WRONG: Removing focus outline entirely */
*:focus {
  outline: none;
}
```

#### ✅ MUST: Provide Skip Link

```tsx
// ✅ CORRECT: Skip link as first focusable element
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
<header>...</header>
<main id="main-content">...</main>
```

#### ✅ MUST: Focus Not Obscured (WCAG 2.2 - 2.4.11)

```css
/* ✅ CORRECT: Ensure focused elements are visible */
.modal {
  /* Don't let sticky headers cover focused content */
}

header.sticky {
  /* Account for focus indicators */
  z-index: var(--z-sticky);
}
```

### 2.4 Color and Contrast

#### ✅ MUST: Meet WCAG AA Contrast Ratios

- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text (18px+ or 14px+ bold)**: 3:1 minimum
- **UI components and graphical objects**: 3:1 minimum

```css
/* ✅ CORRECT: High contrast text */
.text {
  color: var(--color-foreground); /* Dark on light */
  background: var(--color-background); /* Light */
}

/* ❌ WRONG: Low contrast */
.text {
  color: #999;
  background: #eee; /* Contrast ratio ~2:1 */
}
```

### 2.5 Form Accessibility

#### ✅ MUST: All Inputs Have Associated Labels

```tsx
// ✅ CORRECT: Label with htmlFor
<label htmlFor="email">Email Address</label>
<input id="email" type="email" aria-describedby="email-hint" />
<span id="email-hint">We'll never share your email</span>

// ❌ WRONG: No label association
<span>Email:</span>
<input type="email" />
```

#### ✅ MUST: Error Messages Are Announced

```tsx
// ✅ CORRECT: Error linked with aria-describedby
<input
  id="email"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : undefined}
/>;
{
  error && (
    <span id="email-error" role="alert">
      {error}
    </span>
  );
}
```

### 2.6 Target Size (WCAG 2.2 - 2.5.8)

#### ✅ MUST: Interactive Targets Are At Least 24x24 CSS Pixels

```css
/* ✅ CORRECT: Minimum target size */
.button,
.icon-button,
a {
  min-width: 24px;
  min-height: 24px;
}

/* Better: 44x44 for touch targets */
.touch-target {
  min-width: 44px;
  min-height: 44px;
}
```

---

## Part 3: Best Practices Rules

### 3.1 Security

#### ✅ MUST: Use HTTPS for All Resources

```html
<!-- ✅ CORRECT: HTTPS -->
<script src="https://cdn.example.com/lib.js"></script>

<!-- ❌ WRONG: HTTP mixed content -->
<script src="http://cdn.example.com/lib.js"></script>
```

#### ✅ MUST: No Console Errors in Production

```typescript
// ✅ CORRECT: Remove console logs in production
if (import.meta.env.DEV) {
  console.log("Debug info");
}

// ❌ WRONG: Console logs in production
console.log("User data:", userData);
```

### 3.2 Modern APIs

#### ✅ MUST: Use Modern JavaScript APIs

```typescript
// ✅ CORRECT: Modern APIs
const data = await fetch("/api/data").then((r) => r.json());

// ❌ WRONG: Deprecated APIs
document.write("<script>...</script>");
```

#### ✅ MUST: No Deprecated HTML

```html
<!-- ❌ WRONG: Deprecated elements -->
<center>Centered</center>
<font color="red">Red text</font>
<marquee>Scrolling text</marquee>
```

---

## Part 4: SEO Rules

### 4.1 Document Structure

#### ✅ MUST: Every Page Has Unique Title and Meta Description

```tsx
// ✅ CORRECT: Using React 19 native metadata
function QuestionsPage() {
  return (
    <>
      <title>Interview Questions | DevCodeX</title>
      <meta
        name="description"
        content="Browse and practice interview questions for software engineering roles."
      />
      <meta property="og:title" content="Interview Questions | DevCodeX" />
      <meta
        property="og:description"
        content="Browse and practice interview questions."
      />
      {/* Page content */}
    </>
  );
}
```

#### ✅ MUST: Single H1 Per Page with Logical Heading Hierarchy

```tsx
// ✅ CORRECT: Single H1, logical hierarchy
<h1>Questions Dashboard</h1>
<section>
  <h2>Filter Options</h2>
</section>
<section>
  <h2>Question List</h2>
  <article>
    <h3>Question Title</h3>
  </article>
</section>

// ❌ WRONG: Multiple H1s, skipped heading levels
<h1>Dashboard</h1>
<h1>Another Title</h1>
<h4>Skipped H2 and H3</h4>
```

### 4.2 Links and Images

#### ✅ MUST: All Links Have Descriptive Text

```tsx
// ✅ CORRECT: Descriptive link text
<a href="/questions">View all interview questions</a>

// ❌ WRONG: "Click here" or "Learn more"
<a href="/questions">Click here</a>
<a href="/questions">Learn more</a>
```

#### ✅ MUST: All Images Have Alt Text

```tsx
// ✅ CORRECT: Descriptive alt text
<img src="/react-logo.svg" alt="React logo" />

// Decorative images: empty alt
<img src="/decorative-line.svg" alt="" role="presentation" />

// ❌ WRONG: Missing alt
<img src="/react-logo.svg" />
```

### 4.3 Crawlability

#### ✅ MUST: Language Attribute on HTML Element

```html
<html lang="en"></html>
```

#### ✅ MUST: Viewport Meta Tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

---

## Part 5: Component Guidelines

### 5.1 Required Component Props

Every component should accept these props when applicable:

```typescript
interface CommonProps {
  className?: string; // Allow style customization
  id?: string; // For aria-labelledby, etc.
  "aria-label"?: string; // Accessibility
  "aria-describedby"?: string; // Accessibility
}
```

### 5.2 Button Requirements

```typescript
interface ButtonProps {
  // Required for icon-only buttons
  "aria-label"?: string;

  // Loading state
  isLoading?: boolean;

  // Disabled handling
  disabled?: boolean;
}
```

### 5.3 Form Input Requirements

```typescript
interface InputProps {
  id: string; // REQUIRED: for label association
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-errormessage"?: string;
}
```

---

## Part 6: Pre-Commit Checklist

Before committing, verify:

### Performance

- [ ] Route components use `React.lazy()`
- [ ] Heavy libraries use dynamic imports
- [ ] Images have width/height attributes
- [ ] Images use `loading="lazy"` where appropriate
- [ ] Animations use only `transform` and `opacity`
- [ ] No inline styles in render functions

### Accessibility

- [ ] All interactive elements have accessible names
- [ ] All images have alt text
- [ ] Form inputs have associated labels
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Skip link is present

### SEO

- [ ] Page has unique `<title>`
- [ ] Page has meta description
- [ ] Single `<h1>` per page
- [ ] Heading hierarchy is logical
- [ ] Links have descriptive text

### Best Practices

- [ ] No console errors
- [ ] No deprecated APIs
- [ ] HTTPS for all resources

---

## Part 7: Lighthouse CI Integration

### Running Lighthouse Locally

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view

# Run in CI mode (headless)
lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json
```

### Recommended Thresholds

```json
{
  "ci": {
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

---

## Quick Reference Card

### GPU-Safe Animations

```css
/* ONLY use these for animations */
transform: translate(), scale(), rotate();
opacity: 0-1;
```

### Accessibility Checklist

```
✓ aria-label on icon buttons
✓ aria-expanded on toggles
✓ aria-controls on triggers
✓ role="alert" for errors
✓ Skip link present
```

### SEO Essentials

```
✓ Unique <title>
✓ <meta name="description">
✓ Single <h1>
✓ lang="en" on <html>
✓ Descriptive link text
```
