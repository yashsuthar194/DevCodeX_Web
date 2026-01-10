# UI Components Specification

This document lists all common UI components needed for DevCodeX Web, organized by priority and complexity. Each component is designed with performance (GPU animations), accessibility, and the design system in mind.

---

## Component Categories

1. **Primitives** - Basic building blocks
2. **Form Controls** - Input components
3. **Feedback** - Loading, errors, notifications
4. **Layout** - Page structure components
5. **Navigation** - Menus, tabs, breadcrumbs
6. **Data Display** - Tables, cards, badges

---

## Priority 1: Layout Components (Implement First)

### 1.1 MainLayout

**Path:** `src/components/layout/MainLayout/`

**Purpose:** Root layout wrapper with sidebar, header, and main content area.

**Features:**

- Responsive design (collapsible sidebar on mobile)
- Theme-aware styling
- Smooth GPU-animated sidebar toggle

**Props:**

```typescript
interface MainLayoutProps {
  children: ReactNode;
}
```

**Structure:**

```
┌─────────────────────────────────────────────┐
│ Header (fixed top)                          │
├──────────┬──────────────────────────────────┤
│ Sidebar  │ Main Content                     │
│ (fixed)  │ (scrollable)                     │
│          │                                  │
│          │                                  │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

---

### 1.2 Header

**Path:** `src/components/layout/Header/`

**Purpose:** Top navigation bar with branding, search, and user actions.

**Features:**

- Logo/brand link
- Theme toggle button (light/dark)
- Mobile menu toggle
- User menu (future)

**Props:**

```typescript
interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}
```

**Animations:**

- Theme toggle: `transform: rotate(180deg)` on icon
- Menu button: Icon morphing (hamburger ↔ X)

---

### 1.3 Sidebar

**Path:** `src/components/layout/Sidebar/`

**Purpose:** Main navigation sidebar with links and sections.

**Features:**

- Collapsible on desktop
- Slide-in overlay on mobile
- Active route highlighting
- GPU-animated open/close

**Props:**

```typescript
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Animations:**

```css
/* GPU-accelerated slide */
.sidebar {
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}
.sidebar.open {
  transform: translateX(0);
}
```

---

### 1.4 SidebarLink

**Path:** `src/components/layout/SidebarLink/`

**Purpose:** Individual navigation item in sidebar.

**Features:**

- Active state styling
- Icon support
- Hover animation

**Props:**

```typescript
interface SidebarLinkProps {
  to: string;
  icon?: ReactNode;
  children: ReactNode;
}
```

---

## Priority 2: Primitive UI Components

### 2.1 Button

**Path:** `src/components/ui/Button/`

**Purpose:** Primary action trigger.

**Variants:**

- `primary` - Main actions
- `secondary` - Secondary actions
- `outline` - Tertiary actions
- `ghost` - Minimal styling
- `destructive` - Dangerous actions

**Sizes:** `sm`, `md`, `lg`

**Props:**

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}
```

**Animations:**

```css
.button {
  transition: transform 0.1s ease-out, background-color 0.15s ease-out;
}
.button:active {
  transform: scale(0.98);
}
```

---

### 2.2 IconButton

**Path:** `src/components/ui/IconButton/`

**Purpose:** Icon-only button for compact actions.

**Props:**

```typescript
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string; // Required for accessibility
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon: ReactNode;
}
```

---

### 2.3 ThemeToggle

**Path:** `src/components/ui/ThemeToggle/`

**Purpose:** Switch between light and dark themes.

**Features:**

- Sun/Moon icon animation
- GPU-accelerated rotation

**Props:**

```typescript
interface ThemeToggleProps {
  className?: string;
}
```

**Animation:**

```css
.theme-icon {
  transition: transform 0.3s ease-out, opacity 0.2s ease-out;
}
.theme-icon.rotating {
  transform: rotate(180deg);
}
```

---

## Priority 3: Form Components

### 3.1 Input

**Path:** `src/components/ui/Input/`

**Purpose:** Text input field.

**Variants:** `default`, `filled`

**Props:**

```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}
```

---

### 3.2 Select

**Path:** `src/components/ui/Select/`

**Purpose:** Dropdown selection.

**Features:**

- Searchable option
- Custom option rendering
- Keyboard navigation

**Props:**

```typescript
interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  isSearchable?: boolean;
}
```

---

### 3.3 Checkbox

**Path:** `src/components/ui/Checkbox/`

**Purpose:** Boolean toggle.

**Props:**

```typescript
interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
```

---

### 3.4 SearchInput

**Path:** `src/components/ui/SearchInput/`

**Purpose:** Specialized search field with icon and clear button.

**Features:**

- Debounced onChange
- Clear button
- Loading state

**Props:**

```typescript
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  isLoading?: boolean;
}
```

---

## Priority 4: Feedback Components

### 4.1 Spinner

**Path:** `src/components/feedback/Spinner/`

**Purpose:** Loading indicator.

**Sizes:** `sm`, `md`, `lg`

**Props:**

```typescript
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}
```

**Animation (GPU):**

```css
.spinner {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

---

### 4.2 Skeleton

**Path:** `src/components/feedback/Skeleton/`

**Purpose:** Content placeholder during loading.

**Variants:** `text`, `circular`, `rectangular`

**Props:**

```typescript
interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  className?: string;
}
```

**Animation (GPU):**

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-background-muted) 25%,
    var(--color-background-elevated) 50%,
    var(--color-background-muted) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}
```

---

### 4.3 ErrorBoundary

**Path:** `src/components/feedback/ErrorBoundary/`

**Purpose:** Catch and display React errors gracefully.

**Props:**

```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}
```

---

### 4.4 EmptyState

**Path:** `src/components/feedback/EmptyState/`

**Purpose:** Display when no data is available.

**Props:**

```typescript
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}
```

---

## Priority 5: Data Display Components

### 5.1 Card

**Path:** `src/components/ui/Card/`

**Purpose:** Container for related content.

**Props:**

```typescript
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  isHoverable?: boolean;
}
```

**Animation:**

```css
.card.hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

---

### 5.2 Badge

**Path:** `src/components/ui/Badge/`

**Purpose:** Status indicator or label.

**Variants:** `default`, `primary`, `success`, `warning`, `error`

**Props:**

```typescript
interface BadgeProps {
  variant?: "default" | "primary" | "success" | "warning" | "error";
  children: ReactNode;
}
```

---

### 5.3 Avatar

**Path:** `src/components/ui/Avatar/`

**Purpose:** User/entity representation.

**Features:**

- Image with fallback
- Initials fallback
- Size variants

---

## Priority 6: Navigation Components

### 6.1 Tabs

**Path:** `src/components/ui/Tabs/`

**Purpose:** Content organization with tab panels.

**Features:**

- Keyboard navigation
- Animated indicator
- Controlled/uncontrolled modes

---

### 6.2 Breadcrumb

**Path:** `src/components/ui/Breadcrumb/`

**Purpose:** Navigation path indicator.

---

## Implementation Order

The recommended order optimizes for building the layout first, then components needed for the dashboard:

| Phase | Components                               | Dependency |
| :---- | :--------------------------------------- | :--------- |
| 1     | MainLayout, Header, Sidebar, SidebarLink | None       |
| 2     | Button, IconButton, ThemeToggle          | Layout     |
| 3     | Spinner, Skeleton                        | Button     |
| 4     | Input, Select, SearchInput               | Button     |
| 5     | Card, Badge                              | None       |
| 6     | Tabs, ErrorBoundary, EmptyState          | Card       |

---

## File Structure Per Component

```
src/components/ui/Button/
├── Button.tsx          # Component implementation
├── Button.css          # Styles
├── Button.types.ts     # TypeScript interfaces (if complex)
└── index.ts            # Public export
```

---

## Accessibility Requirements

Every component must:

1. Support keyboard navigation
2. Have proper ARIA attributes
3. Meet color contrast requirements
4. Support `prefers-reduced-motion`
5. Have focus-visible styling

---

## Animation Guidelines

All animations must:

1. Use `transform` and `opacity` only
2. Include `will-change` hint if animated frequently
3. Respect `prefers-reduced-motion`
4. Use `cubic-bezier(0.4, 0, 0.2, 1)` for smooth easing
5. Keep durations under 300ms for interactions
