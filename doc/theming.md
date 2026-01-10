# DevCodeX Web - CSS Theming System

This document describes the CSS theming architecture for AI agents and developers.

> [!TIP]
> For animation rules and accessibility requirements, see [coding-standards.md](./coding-standards.md).

## Overview

The theming system uses CSS custom properties (variables) with a semantic naming convention. It supports light and dark themes with automatic system preference detection.

## File Structure

```
src/styles/
├── variables.css    # Design tokens and theme definitions
├── reset.css        # Modern CSS reset
└── index.css        # Main entry, imports all styles
```

## Color Palette

### Primary Colors (Deep Indigo)

Premium, professional feel for primary actions and branding.

- Use `--color-primary` for buttons, links, focus states
- Use `--color-primary-hover` for hover states

### Secondary Colors (Slate)

Neutral tones for text, backgrounds, and borders.

- Use `--color-foreground` for text
- Use `--color-background` for backgrounds

### Semantic Colors

- **Accent (Emerald)**: Success states, positive actions
- **Warning (Amber)**: Caution, pending states
- **Error (Rose)**: Errors, destructive actions
- **Info (Sky)**: Informational states

## Theme Switching

### HTML Attribute

Themes are controlled via the `data-theme` attribute on `:root`:

```html
<html data-theme="dark">
  <!-- Dark theme -->
  <html data-theme="light">
    <!-- Light theme -->
    <html>
      <!-- System preference -->
    </html>
  </html>
</html>
```

### Zustand Store

```typescript
import { useUIStore } from "@/stores";

// Read theme
const theme = useUIStore((s) => s.theme);

// Change theme
const setTheme = useUIStore((s) => s.setTheme);
setTheme("dark"); // Options: 'light' | 'dark' | 'system'
```

## Using Variables in CSS

### Colors

```css
.card {
  background: var(--color-card);
  color: var(--color-foreground);
  border: 1px solid var(--color-border);
}

.card:hover {
  background: var(--color-card-hover);
}
```

### Spacing

```css
.container {
  padding: var(--spacing-6); /* 24px */
  margin-bottom: var(--spacing-4); /* 16px */
  gap: var(--spacing-2); /* 8px */
}
```

### Typography

```css
.title {
  font-family: var(--font-family-sans);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.code {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
}
```

### Border Radius

```css
.button {
  border-radius: var(--radius-md);
}

.card {
  border-radius: var(--radius-xl);
}

.avatar {
  border-radius: var(--radius-full);
}
```

### Shadows

```css
.dropdown {
  box-shadow: var(--shadow-lg);
}

.card {
  box-shadow: var(--shadow-md);
}
```

### Transitions

```css
.button {
  transition: background-color var(--transition-fast), transform var(--transition-fast);
}

.modal {
  transition: opacity var(--transition-normal);
}
```

### Z-Index

```css
.dropdown {
  z-index: var(--z-dropdown);
}

.modal-backdrop {
  z-index: var(--z-modal-backdrop);
}

.modal {
  z-index: var(--z-modal);
}

.toast {
  z-index: var(--z-toast);
}
```

## Semantic Color Usage

| Variable                      | Light Theme | Dark Theme | Use For                |
| :---------------------------- | :---------- | :--------- | :--------------------- |
| `--color-background`          | Near white  | Near black | Page background        |
| `--color-background-elevated` | White       | Dark gray  | Cards, modals          |
| `--color-foreground`          | Dark gray   | Near white | Primary text           |
| `--color-foreground-muted`    | Medium gray | Light gray | Secondary text         |
| `--color-border`              | Light gray  | Dark gray  | Borders, dividers      |
| `--color-primary`             | Indigo 600  | Indigo 400 | Primary buttons, links |
| `--color-destructive`         | Rose 500    | Rose 400   | Delete buttons, errors |

## Accessibility

1. **reduced-motion**: Animations are disabled for users who prefer reduced motion
2. **Focus visible**: Clear focus indicators using `--color-primary`
3. **Color contrast**: All text colors meet WCAG AA standards

## Adding New Components

When creating components, always use CSS variables:

```css
/* ✅ Correct - uses design system */
.my-button {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
}

.my-button:hover {
  background: var(--color-primary-hover);
}

/* ❌ Incorrect - hardcoded values */
.my-button {
  background: #6366f1;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
}
```

## Custom Component Variables

For complex components, create scoped variables:

```css
.datepicker {
  /* Component-specific tokens */
  --dp-cell-size: 32px;
  --dp-header-height: 48px;

  /* Use semantic colors */
  --dp-selected-bg: var(--color-primary);
  --dp-hover-bg: var(--color-background-muted);
}

.datepicker-cell {
  width: var(--dp-cell-size);
  height: var(--dp-cell-size);
}

.datepicker-cell:hover {
  background: var(--dp-hover-bg);
}

.datepicker-cell.selected {
  background: var(--dp-selected-bg);
}
```
