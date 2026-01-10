# Frontend Functional Requirements

Based on the database schema, generate the following pages and components.

## 1. Shared Types (TypeScript Interfaces)

Create a global types definition file (e.g., `src/types/index.ts`) that strictly mirrors the C# entities.

### Strict Enum Definitions

The frontend **MUST** use these specific integer values to match the backend. Do not use default 0-indexed enums.

```typescript
export enum DifficultyLevel {
  Beginner = 1,
  Intermediate = 2,
  Advanced = 3,
  Expert = 4,
}

// Placeholder for TechnologyType (Update matches Backend enum when available)
export enum TechnologyType {
  Language = 0,
  Framework = 1,
  Database = 2,
  Tool = 3,
}
```

### DTOs (Data Transfer Objects)

- Create `CreateQuestionRequest` containing:
- `title`: string
- `technologyId`: string (UUID)
- `difficultyLevel`: DifficultyLevel (enum)

- Create `UpdateAnswerRequest` containing `content` string.

## 2. Page Structure

### A. Dashboard / Question List

- **Route:** `/questions`
- **Features:**
- Table or Card grid displaying Questions.
- **Filters:**
- Filter by `Technology` (Dropdown fetching from API).
- Filter by `DifficultyLevel` (Dropdown using Enum labels).

- **Search:** Search bar for `Title`.
- **Action:** "Create New Question" button.

### B. Question Detail View

- **Route:** `/questions/:id`
- **Features:**
- Display full `Title` and `Description`.
- **Tabs Component:**
- **Tab 1: Answers:** List of `Answer` cards associated with this question.
- **Tab 2: Assets:** Gallery grid of images/files linked to this question (`Asset.ParentId == Question.Id`).

- **Actions:** "Add Answer" button (opens modal or inline editor).

### C. Technology Management

- **Route:** `/technologies`
- **Features:**
- Simple CRUD table for adding new tech stacks (e.g., adding "Docker" or "Next.js").

## 3. Form Requirements (React Hook Form + Zod)

- **Question Form:**
- `Title`: Text Input (Required).
- `Technology`: Select Dropdown (Fetch options from API).
- `Difficulty`: Select Dropdown (Options mapped from `DifficultyLevel` enum. e.g., Value=1, Label="Beginner").

- **Answer Form:**
- `Content`: Rich Text Editor (e.g., Tiptap, Quill, or Markdown) to support code blocks.

- **Asset Upload:**
- File input component.
- Logic: Uploads to backend, receives a `FileUrl`, and automatically saves the `Asset` record with the current `ParentId`.

## 4. API Client & State Management

- **HTTP Client:** Use **Axios** instance with a base URL configuration.
- **Service Layer:** Create service files: `questionService.ts`, `technologyService.ts`, `assetService.ts`.
- **Data Fetching:** Use **React Query (TanStack Query)** for caching and state management of lists (Questions, Technologies).
