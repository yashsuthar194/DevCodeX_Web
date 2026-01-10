# Lighthouse Performance Optimization Guide

This guide outlines strategies to achieve **90+ Lighthouse scores** across all categories (Performance, Accessibility, Best Practices, SEO) for the DevCodeX Web application.

> [!IMPORTANT]
> For mandatory coding rules, see [coding-standards.md](./coding-standards.md). This document provides additional context and techniques.

---

## Lighthouse Categories Overview

| Category           | Target | Key Metrics                                          |
| :----------------- | :----- | :--------------------------------------------------- |
| **Performance**    | 90+    | TBT (30%), LCP (25%), CLS (25%), FCP (10%), SI (10%) |
| **Accessibility**  | 90+    | Color contrast, ARIA, keyboard navigation            |
| **Best Practices** | 90+    | HTTPS, modern APIs, no errors                        |
| **SEO**            | 90+    | Meta tags, structured data, crawlability             |

---

## Performance Optimization

### 1. Core Web Vitals

| Metric                             | Target  | Strategy                                    |
| :--------------------------------- | :------ | :------------------------------------------ |
| **LCP** (Largest Contentful Paint) | < 2.5s  | Preload critical resources, optimize images |
| **FID** (First Input Delay)        | < 100ms | Code splitting, minimize main thread work   |
| **CLS** (Cumulative Layout Shift)  | < 0.1   | Reserve space for dynamic content           |
| **FCP** (First Contentful Paint)   | < 1.8s  | Inline critical CSS, async JS loading       |

### 2. JavaScript Bundle Optimization

```typescript
// ✅ Code Splitting with React.lazy
const QuestionsPage = lazy(
  () => import("@/features/questions/pages/QuestionsPage")
);

// ✅ Wrap with Suspense
<Suspense fallback={<LoadingSkeleton />}>
  <QuestionsPage />
</Suspense>;
```

**Vite Configuration (already implemented):**

```typescript
// Manual chunks for optimal splitting
rollupOptions: {
  output: {
    manualChunks: {
      'react-vendor': ['react', 'react-dom'],
      'router': ['react-router'],
      'query': ['@tanstack/react-query'],
    },
  },
},
```

### 3. CSS Performance

#### Critical CSS Inlining

- Keep base styles (reset, variables) small
- Load component CSS lazily with components

#### Avoid Layout-Triggering Properties

```css
/* ❌ AVOID - Causes layout recalculation */
.animate-bad {
  animation: slide 0.3s;
}
@keyframes slide {
  from {
    left: 0;
    width: 100px;
  }
  to {
    left: 100px;
    width: 150px;
  }
}

/* ✅ USE - GPU accelerated, no layout */
.animate-good {
  animation: slide-gpu 0.3s;
}
@keyframes slide-gpu {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100px);
  }
}
```

### 4. Image Optimization

```typescript
// Use responsive images
<img
  src="/images/hero-800.webp"
  srcSet="/images/hero-400.webp 400w,
          /images/hero-800.webp 800w,
          /images/hero-1200.webp 1200w"
  sizes="(max-width: 600px) 400px,
         (max-width: 1200px) 800px,
         1200px"
  loading="lazy"
  alt="Description"
/>
```

### 5. Font Loading Strategy

```css
/* In index.html - Preconnect to Google Fonts */
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

/* Use font-display: swap */
@font-face {
  font-family: "Inter";
  font-display: swap; /* Prevents FOIT */
  src: url(...);
}
```

---

## GPU-Accelerated Animations

### Properties that use GPU (Composite Layer)

These are "cheap" to animate:

- `transform` (translate, scale, rotate, skew)
- `opacity`

### Properties that trigger Layout (Expensive)

Avoid animating these:

- `width`, `height`, `margin`, `padding`
- `top`, `left`, `right`, `bottom`
- `box-shadow`, `border-radius`, `filter`

### Animation Best Practices

```css
/* ✅ GPU-accelerated sidebar animation */
.sidebar {
  position: fixed;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform; /* Hint to browser */
}

.sidebar.open {
  transform: translateX(0);
}

/* ✅ Fade animation */
.modal-backdrop {
  opacity: 0;
  transition: opacity 0.2s ease-out;
}

.modal-backdrop.visible {
  opacity: 1;
}

/* ✅ Scale animation for hover effects */
.card {
  transition: transform 0.15s ease-out;
}

.card:hover {
  transform: scale(1.02);
}
```

### `will-change` Usage Guidelines

```css
/* ✅ Apply only when needed */
.sidebar {
  will-change: transform; /* Element will animate */
}

/* ✅ Remove after animation via JS if one-time */
element.addEventListener('transitionend', () => {
  element.style.willChange = 'auto';
});

/* ❌ DON'T overuse */
* {
  will-change: transform, opacity; /* Wastes memory */
}
```

---

## Accessibility (A11y)

### Color Contrast

```css
/* ✅ Meet WCAG AA (4.5:1 for text) */
:root {
  --color-foreground: rgb(var(--color-secondary-900)); /* Dark text */
  --color-background: rgb(var(--color-secondary-50)); /* Light bg */
}
```

### Focus Management

```css
/* ✅ Clear focus indicators */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ✅ Skip to main content link */
.skip-link:focus {
  position: fixed;
  top: var(--spacing-4);
  left: var(--spacing-4);
}
```

### ARIA Attributes

```tsx
// ✅ Sidebar accessibility
<aside
  aria-label="Main navigation"
  aria-hidden={!isOpen}
>
  <nav role="navigation">
    {/* Links */}
  </nav>
</aside>

// ✅ Theme toggle
<button
  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
  aria-pressed={theme === 'dark'}
>
  <ThemeIcon />
</button>
```

### Reduced Motion

```css
/* ✅ Respect user preferences */
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

## Best Practices

### Semantic HTML

```tsx
// ✅ Proper structure
<header>
  <nav aria-label="Main">...</nav>
</header>
<main id="main-content">
  <article>...</article>
</main>
<aside aria-label="Sidebar">...</aside>
<footer>...</footer>
```

### Security Headers

```typescript
// vite.config.ts - Add security headers for preview
server: {
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
},
```

### Console Errors

- Ensure no console errors in production
- Use proper error boundaries

---

## SEO Optimization

### Meta Tags (React Helmet or React 19 native)

```tsx
// Using React 19's native document metadata
function QuestionsPage() {
  return (
    <>
      <title>Questions - DevCodeX</title>
      <meta name="description" content="Browse interview questions" />
      <meta property="og:title" content="Questions - DevCodeX" />
      <meta property="og:description" content="Browse interview questions" />
    </>
  );
}
```

### Semantic Structure

```tsx
// ✅ One H1 per page
<h1>Interview Questions</h1>
<h2>Filter Options</h2>
<h2>Question List</h2>
  <h3>Question Title 1</h3>
  <h3>Question Title 2</h3>
```

---

## Performance Checklist

### Build Time

- [ ] Code splitting implemented
- [ ] Tree shaking enabled (default in Vite)
- [ ] Minification enabled (default in production)
- [ ] Unused dependencies removed

### Runtime

- [ ] Lazy loading for routes
- [ ] Suspense boundaries with skeleton loading
- [ ] Virtual scrolling for long lists
- [ ] Debounced search inputs
- [ ] Memoized expensive computations

### CSS

- [ ] GPU-only animations (transform, opacity)
- [ ] `will-change` used judiciously
- [ ] Reduced motion support
- [ ] No layout-triggering animations
- [ ] CSS variables for theming (single source)

### Images

- [ ] WebP format for photos
- [ ] SVG for icons
- [ ] `loading="lazy"` for below-fold images
- [ ] Proper `alt` attributes

### Fonts

- [ ] `font-display: swap`
- [ ] Preconnect to font origins
- [ ] Subset fonts if possible

---

## Monitoring Performance

### Development

```bash
# Run Lighthouse in CI/Development
npx lighthouse http://localhost:3000 --view
```

### Using React DevTools

1. Open React DevTools → Profiler
2. Record a session
3. Identify slow components
4. Optimize with memoization if needed

### Lighthouse CI (Future)

```yaml
# .github/workflows/lighthouse.yml
- name: Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun
```

---

## Quick Wins Summary

| Action                         | Impact | Effort |
| :----------------------------- | :----- | :----- |
| Use `transform` for animations | High   | Low    |
| Add `loading="lazy"` to images | High   | Low    |
| Code split routes              | High   | Medium |
| Add skip link                  | Medium | Low    |
| Use semantic HTML              | Medium | Low    |
| Preconnect to external origins | Medium | Low    |
| Add meta descriptions          | Medium | Low    |
