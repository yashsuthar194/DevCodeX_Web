# DevCodeX Web - AI Agent Instructions

This document provides instructions for AI agents working on this codebase.

> [!IMPORTANT]
> Before writing any code, review [coding-standards.md](./coding-standards.md) for mandatory Lighthouse optimization rules.

## Quick Reference

### Technology Stack

- **React 19.2.0** - Use latest features (Actions, use() hook, ref as prop)
- **TypeScript 5.9.3** - Strict mode enabled, use path aliases
- **Vite 7.2.4** - Fast dev server, optimized builds
- **TanStack Query 5** - For API data fetching
- **Zustand 5** - For client-side state
- **React Hook Form + Zod** - For form handling
- **clsx** - For conditional class composition

### Import Aliases

Always use path aliases instead of relative imports:

```typescript
// ✅ Correct
import { apiClient } from "@/core/api";
import { Question } from "@/types";
import { Button, MainLayout } from "@/components";

// ❌ Incorrect
import { apiClient } from "../../../core/api/client";
```

---

## Code Patterns

### 1. API Calls

Use TanStack Query with the service layer:

```typescript
// In features/questions/api/questionService.ts
import { get, post } from "@/core/api";
import type { Question, CreateQuestionRequest } from "@/types";

export const questionService = {
  getAll: () => get<Question[]>("/questions"),
  getById: (id: string) => get<Question>(`/questions/${id}`),
  create: (data: CreateQuestionRequest) => post<Question>("/questions", data),
};

// In features/questions/hooks/useQuestions.ts
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/config";
import { questionService } from "../api/questionService";

export function useQuestions() {
  return useQuery({
    queryKey: QUERY_KEYS.questions.list(),
    queryFn: async () => {
      const response = await questionService.getAll();
      if (response.status === "Succeeded") {
        return response.data;
      }
      throw new Error(response.message);
    },
  });
}
```

### 2. Components

Keep components small and focused. Use CSS Modules pattern:

```typescript
// In components/ui/Button/Button.tsx
import { type ReactNode, type ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "button",
          `button--${variant}`,
          `button--${size}`,
          isLoading && "button--loading",
          className
        )}
        disabled={props.disabled ?? isLoading}
        {...props}
      >
        {children}
      </button>
    );
  }
);
```

### 3. CSS Styling (GPU-Optimized)

Always use CSS variables and GPU-safe animations:

```css
/* In components/ui/Button/Button.css */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  /* Only animate transform and opacity for GPU acceleration */
  transition: background-color var(--transition-fast), transform 0.1s ease-out;
}

/* GPU-accelerated press feedback */
.button:active {
  transform: scale(0.98);
}

/* Variants */
.button--primary {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
}

.button--primary:hover {
  background: var(--color-primary-hover);
}

/* Sizes */
.button--sm {
  height: 32px;
  padding: 0 var(--spacing-3);
  font-size: var(--font-size-sm);
}

.button--md {
  height: 40px;
  padding: 0 var(--spacing-4);
  font-size: var(--font-size-base);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }
}
```

### 4. Form Handling

Use React Hook Form with Zod validation:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DifficultyLevel } from "@/types";

const questionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  technologyId: z.string().uuid("Select a technology"),
  difficultyLevel: z.number().min(1).max(4),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export function QuestionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
  });

  const onSubmit = (data: QuestionFormData) => {
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields with proper labels for accessibility */}
      <label htmlFor="title">Title</label>
      <input
        id="title"
        {...register("title")}
        aria-invalid={!!errors.title}
        aria-describedby={errors.title ? "title-error" : undefined}
      />
      {errors.title && (
        <span id="title-error" role="alert">
          {errors.title.message}
        </span>
      )}
    </form>
  );
}
```

### 5. State Management

Use Zustand for UI state:

```typescript
import { useUIStore } from "@/stores";

// In a component
function ThemeToggle() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      Toggle Theme
    </button>
  );
}
```

---

## Performance Guidelines

> [!WARNING]
> Violating these rules will hurt Lighthouse scores. See [coding-standards.md](./coding-standards.md) for complete rules.

### 1. Use Lazy Loading for Route Pages

```typescript
const QuestionsPage = lazy(
  () => import("@/features/questions/pages/QuestionsPage")
);

// Always wrap with Suspense
<Suspense fallback={<PageSkeleton />}>
  <QuestionsPage />
</Suspense>;
```

### 2. Only Use GPU-Safe Animation Properties

```css
/* ✅ GPU-accelerated (use these) */
transform: translate(), scale(), rotate();
opacity: 0-1;

/* ❌ Triggers layout (never animate these) */
width, height, margin, padding, top, left, right, bottom
```

### 3. Avoid Inline Objects in Render

```typescript
// ❌ Creates new object each render
<Component style={{ padding: 10 }} />

// ✅ Use CSS or define outside component
<Component className="my-class" />
```

### 4. Images Must Have Dimensions

```tsx
// ✅ Prevents CLS
<img src="/image.webp" alt="Description" width={400} height={300} loading="lazy" />

// ❌ Causes layout shift
<img src="/image.webp" alt="Description" />
```

---

## Accessibility Requirements

All components must meet WCAG 2.2 AA requirements:

### Required ARIA Attributes

```tsx
// Icon buttons must have aria-label
<button aria-label="Close menu"><CloseIcon /></button>

// Toggles need aria-pressed and aria-expanded
<button aria-pressed={isOpen} aria-expanded={isOpen} aria-controls="menu">
  Menu
</button>

// Errors need role="alert"
{error && <span role="alert">{error}</span>}

// Form inputs need labels
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### Focus Management

```css
/* Always provide visible focus */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Never remove focus entirely */
/* ❌ *:focus { outline: none; } */
```

---

## File Conventions

| Pattern    | Example                                               |
| :--------- | :---------------------------------------------------- |
| Components | `PascalCase.tsx` (e.g., `QuestionCard.tsx`)           |
| Hooks      | `useCamelCase.ts` (e.g., `useQuestions.ts`)           |
| Utilities  | `camelCase.ts` (e.g., `formatDate.ts`)                |
| Types      | `camelCase.ts` (e.g., `entities.ts`)                  |
| CSS        | Match component (e.g., `Button.css` for `Button.tsx`) |
| Folders    | `PascalCase/` for components (e.g., `Button/`)        |

---

## Common Tasks

### Adding a New Feature

1. Create folder in `src/features/[feature-name]/`
2. Add subfolders: `api/`, `components/`, `hooks/`, `pages/`, `types/`
3. Create service in `api/[name]Service.ts`
4. Create hooks in `hooks/use[Name].ts`
5. Add lazy-loaded routes in `src/app/routes.tsx`

### Adding a New Component

1. Create folder in `src/components/ui/[ComponentName]/`
2. Create files: `[ComponentName].tsx`, `[ComponentName].css`, `index.ts`
3. Export from `src/components/ui/index.ts`
4. Follow patterns in existing components (Button, IconButton)

### Adding a New Store

1. Create file in `src/stores/[name]Store.ts`
2. Export from `src/stores/index.ts`

---

## Existing Components Reference

| Component     | Location                        | Purpose                            |
| :------------ | :------------------------------ | :--------------------------------- |
| `Button`      | `components/ui/Button`          | 5 variants, 3 sizes, loading state |
| `IconButton`  | `components/ui/IconButton`      | Icon-only with required aria-label |
| `ThemeToggle` | `components/ui/ThemeToggle`     | Light/dark theme switcher          |
| `Spinner`     | `components/feedback/Spinner`   | Loading indicator                  |
| `MainLayout`  | `components/layout/MainLayout`  | App wrapper with header/sidebar    |
| `Header`      | `components/layout/Header`      | Top navigation bar                 |
| `Sidebar`     | `components/layout/Sidebar`     | Navigation sidebar                 |
| `SidebarLink` | `components/layout/SidebarLink` | Nav link with active state         |

---

## Related Documentation

- [coding-standards.md](./coding-standards.md) - **MANDATORY** Lighthouse rules
- [architecture.md](./architecture.md) - Project structure overview
- [ui-components.md](./ui-components.md) - Component specifications
- [theming.md](./theming.md) - CSS theming guide
- [lighthouse-optimization.md](./lighthouse-optimization.md) - Performance deep dive
