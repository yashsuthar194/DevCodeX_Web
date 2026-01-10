# DevCodeX Web - Project Architecture

This document provides an overview of the DevCodeX Web frontend architecture for AI agents and developers.

## Technology Stack

| Technology      | Version | Purpose                                               |
| :-------------- | :------ | :---------------------------------------------------- |
| React           | 19.2.0  | UI library with latest features (Actions, use() hook) |
| TypeScript      | 5.9.3   | Type safety and developer experience                  |
| Vite            | 7.2.4   | Build tool and dev server                             |
| React Router    | 7.6.1   | Client-side routing                                   |
| TanStack Query  | 5.76.1  | Server state management                               |
| Zustand         | 5.0.5   | Client state management                               |
| Axios           | 1.9.0   | HTTP client                                           |
| React Hook Form | 7.56.4  | Form state management                                 |
| Zod             | 3.25.67 | Schema validation                                     |
| clsx            | 2.1.1   | Class composition utility                             |

## Folder Structure

```
src/
├── app/                        # Application shell
│   ├── App.tsx                 # Root component
│   ├── routes.tsx              # Route definitions with MainLayout
│   └── providers/              # Global providers (QueryClient, Router)
│
├── core/                       # Core infrastructure
│   ├── api/                    # Axios client with interceptors
│   │   ├── client.ts           # Configured Axios instance
│   │   ├── types.ts            # API response types
│   │   └── index.ts
│   ├── config/                 # Environment and constants
│   │   ├── env.ts              # Type-safe env variables
│   │   ├── constants.ts        # Query keys, API endpoints
│   │   └── index.ts
│   ├── hooks/                  # Shared hooks (placeholder)
│   └── utils/                  # Utility functions (placeholder)
│
├── components/                 # Design system components
│   ├── ui/                     # Primitives
│   │   ├── Button/             # Button with 5 variants
│   │   ├── IconButton/         # Icon-only button
│   │   ├── ThemeToggle/        # Light/dark toggle
│   │   └── index.ts
│   ├── layout/                 # Layout components
│   │   ├── MainLayout/         # App wrapper
│   │   ├── Header/             # Top navbar
│   │   ├── Sidebar/            # Navigation sidebar
│   │   ├── SidebarLink/        # Nav link with active state
│   │   └── index.ts
│   ├── feedback/               # Feedback components
│   │   ├── Spinner/            # Loading indicator
│   │   └── index.ts
│   └── index.ts                # Barrel export
│
├── features/                   # Feature modules (placeholder)
│   ├── questions/              # Questions feature
│   ├── technologies/           # Technologies feature
│   └── assets/                 # Assets feature
│
├── stores/                     # Global Zustand stores
│   ├── uiStore.ts              # Theme, sidebar state
│   └── index.ts
│
├── types/                      # Global TypeScript types
│   ├── entities.ts             # Entity interfaces
│   ├── enums.ts                # DifficultyLevel, TechnologyType
│   └── index.ts
│
├── styles/                     # CSS design system
│   ├── variables.css           # Design tokens and themes
│   ├── reset.css               # Modern CSS reset
│   └── index.css               # Main entry
│
└── main.tsx                    # Entry point
```

## Key Patterns

### 1. Feature-First Organization

Each feature is self-contained with its own components, hooks, and API layer. Features should not import from other features directly.

### 2. API Layer Architecture

```
Component → TanStack Query Hook → Service → Axios Client
```

### 3. State Management Strategy

- **Server State**: TanStack Query (caching, background updates)
- **UI State**: Zustand (theme, modals, sidebar)
- **Form State**: React Hook Form
- **URL State**: React Router

### 4. Import Aliases

Use path aliases for clean imports:

```typescript
import { apiClient } from "@/core/api";
import { Question } from "@/types";
import { Button, MainLayout } from "@/components";
```

## CSS Theming

The design system uses CSS custom properties with light/dark theme support.

### Theme Switching

```typescript
import { useUIStore } from "@/stores";

// Get current theme
const theme = useUIStore((s) => s.theme);

// Change theme
const setTheme = useUIStore((s) => s.setTheme);
setTheme("dark"); // 'light' | 'dark' | 'system'
```

### Using CSS Variables

```css
.my-component {
  color: var(--color-foreground);
  background: var(--color-background);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
}
```

## Backend Integration

### API Response Format

All backend responses follow this structure:

```typescript
interface ApiResponse<T> {
  status: "Succeeded" | "Failed";
  statusCode: number;
  message?: string;
  data?: T;
}
```

### Entity Types

Entity types in `src/types/entities.ts` match the C# models exactly. Always use these types for type safety.

## Performance Considerations

> [!IMPORTANT]
> See [coding-standards.md](./coding-standards.md) for mandatory performance rules.

1. **Code Splitting**: Use `React.lazy()` for route-level splitting
2. **GPU Animations**: Only animate `transform` and `opacity`
3. **Query Optimization**: Use TanStack Query's staleTime and gcTime
4. **Bundle Splitting**: Vite is configured with manual chunks

## Layout System

The application uses a responsive layout with:

- Fixed header (64px)
- Collapsible sidebar (260px on desktop)
- Main content area with padding

```tsx
// All routes are wrapped in MainLayout
<MainLayout>
  <Routes>
    <Route path="/" element={<HomePage />} />
  </Routes>
</MainLayout>
```

## Commands

```bash
npm run dev       # Start dev server on port 3000
npm run build     # Production build
npm run lint      # ESLint check
npm run typecheck # TypeScript check
```

## Related Documentation

- [coding-standards.md](./coding-standards.md) - Lighthouse optimization rules
- [ui-components.md](./ui-components.md) - Component specifications
- [theming.md](./theming.md) - CSS theming guide
- [ai-instructions.md](./ai-instructions.md) - AI agent patterns
- [lighthouse-optimization.md](./lighthouse-optimization.md) - Performance guide
