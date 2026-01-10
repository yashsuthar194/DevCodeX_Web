# DevCodeX Web - Project Implementation Roadmap

A living document that tracks the complete implementation plan for DevCodeX Web application. Update the checkboxes as you progress through each phase.

---

## Project Overview

**Goal:** Build a React-based frontend for a technical interview preparation platform.

**Description:** The application allows users to manage interview questions, answers, associated file assets, and technology categories. It interacts with a .NET Web API backend.

**Backend:** .NET 8 Web API → `http://localhost:5001/api`

---

## Technology Stack

| Layer        | Technology                  | Version          |
| :----------- | :-------------------------- | :--------------- |
| Frontend     | React + Vite                | 19.2.0 / 7.2.4   |
| Language     | TypeScript                  | 5.9.3            |
| Styling      | Vanilla CSS (Design System) | -                |
| Server State | TanStack Query              | 5.76.1           |
| Client State | Zustand                     | 5.0.5            |
| Routing      | React Router                | 7.6.1            |
| Forms        | React Hook Form + Zod       | 7.56.4 / 3.25.67 |
| HTTP         | Axios                       | 1.9.0            |

---

## Core Domain Entities

```
┌─────────────────┐       ┌─────────────────┐
│   Technology    │ 1───* │    Question     │
│─────────────────│       │─────────────────│
│ Name            │       │ Title           │
│ Description     │       │ Description     │
│ TechnologyType  │       │ DifficultyLevel │
└─────────────────┘       │ TechnologyId    │
                          └────────┬────────┘
                                   │ 1
                                   │
                                   │ *
                          ┌────────┴────────┐
                          │     Answer      │
                          │─────────────────│
                          │ Content (MD)    │
                          │ QuestionId      │
                          └─────────────────┘

┌─────────────────┐
│     Asset       │ (Polymorphic - attached to Question OR Answer)
│─────────────────│
│ ParentId        │
│ FileName        │
│ FileType        │
│ FileUrl         │
└─────────────────┘
```

**Relationships:**

- A **Technology** has many **Questions**
- A **Question** has many **Answers**
- A **Question** or **Answer** can have many **Assets**

---

## Current Status

| Phase                             | Status         | Progress |
| :-------------------------------- | :------------- | :------- |
| **Phase 1:** Project Setup        | ✅ Complete    | 100%     |
| **Phase 2:** Core Layout          | ✅ Complete    | 100%     |
| **Phase 3:** Common Components    | ✅ Complete    | 100%     |
| **Phase 4:** Technologies Feature | ✅ Complete    | 100%     |
| **Phase 5:** Questions Feature    | 🔲 Not Started | 0%       |
| **Phase 6:** Answers Feature      | 🔲 Not Started | 0%       |
| **Phase 7:** Assets Feature       | 🔲 Not Started | 0%       |
| **Phase 8:** Search & Filters     | 🔲 Not Started | 0%       |
| **Phase 9:** Polish & Deploy      | 🔲 Not Started | 0%       |

---

## Phase 3: Common Components

**Goal:** Build reusable components before feature development.

### 3.1 Form Components

| Component   | Path                         | Status | Features                                |
| :---------- | :--------------------------- | :----- | :-------------------------------------- |
| Input       | `components/ui/Input/`       | ✅     | Label, error, hint, left/right icons    |
| Textarea    | `components/ui/Textarea/`    | ✅     | Auto-resize, character count            |
| Select      | `components/ui/Select/`      | ✅     | Searchable, keyboard nav, custom render |
| Checkbox    | `components/ui/Checkbox/`    | ✅     | Label, indeterminate state              |
| SearchInput | `components/ui/SearchInput/` | ✅     | Debounced, clear button, loading        |

### 3.2 Feedback Components

| Component     | Path                                 | Status | Features                                      |
| :------------ | :----------------------------------- | :----- | :-------------------------------------------- |
| Skeleton      | `components/feedback/Skeleton/`      | ✅     | text, circular, rectangular, prebuilt layouts |
| Toast         | `components/feedback/Toast/`         | ✅     | Success, error, info, auto-dismiss, provider  |
| EmptyState    | `components/feedback/EmptyState/`    | ✅     | Icon, title, description, action              |
| ConfirmDialog | `components/feedback/ConfirmDialog/` | ✅     | Delete confirmations, loading state           |

### 3.3 Data Display Components

| Component | Path                   | Status | Features                                 |
| :-------- | :--------------------- | :----- | :--------------------------------------- |
| Card      | `components/ui/Card/`  | ✅     | Hoverable, clickable, Header/Body/Footer |
| Badge     | `components/ui/Badge/` | ✅     | Variants for difficulty levels, icons    |
| Modal     | `components/ui/Modal/` | ✅     | Focus trap, Portal, escape key, sizes    |
| Tabs      | `components/ui/Tabs/`  | ✅     | Keyboard navigation, compound pattern    |

---

## Phase 4: Technologies Feature

**Entity:** Technology (CRUD operations)

### Tasks

| Task                                                | Status |
| :-------------------------------------------------- | :----- |
| Create `technologyService.ts` (API calls)           | ✅     |
| Create `useTechnologies` hook (list)                | ✅     |
| Create `useTechnology` hook (single)                | ✅     |
| Create mutation hooks (create/update/delete)        | ✅     |
| Create `TechnologyCard` component                   | ✅     |
| Create `TechnologyForm` component                   | ✅     |
| Create `TechnologyTypeSelect` component             | ✅     |
| Create `TechnologiesPage` (`/technologies`)         | ✅     |
| Create `TechnologyDetailPage` (`/technologies/:id`) | ✅     |
| Add route to `routes.tsx`                           | ✅     |

### Form Validation

```typescript
const technologySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  technologyType: z.number().min(1).max(6),
});
```

---

## Phase 5: Questions Feature

**Entity:** Question (CRUD + filtering by technology/difficulty)

### Tasks

| Task                                              | Status |
| :------------------------------------------------ | :----- |
| Create `questionService.ts`                       | 🔲     |
| Create `useQuestions` hook (with filters)         | 🔲     |
| Create `useQuestion` hook (includes answers)      | 🔲     |
| Create mutation hooks                             | 🔲     |
| Create `QuestionCard` component                   | 🔲     |
| Create `QuestionForm` component                   | 🔲     |
| Create `QuestionFilters` component                | 🔲     |
| Create `DifficultyBadge` component                | 🔲     |
| Create `QuestionsPage` (`/questions`)             | 🔲     |
| Create `QuestionDetailPage` (`/questions/:id`)    | 🔲     |
| Create `CreateQuestionPage` (`/questions/new`)    | 🔲     |
| Create `EditQuestionPage` (`/questions/:id/edit`) | 🔲     |

### Form Validation

```typescript
const questionSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().max(2000).optional(),
  technologyId: z.string().uuid("Select a technology"),
  difficultyLevel: z.number().min(1).max(4),
});
```

---

## Phase 6: Answers Feature

**Entity:** Answer (CRUD, Markdown support)

### Tasks

| Task                                       | Status |
| :----------------------------------------- | :----- |
| Create `answerService.ts`                  | 🔲     |
| Create `useAnswers` hook (by question)     | 🔲     |
| Create mutation hooks                      | 🔲     |
| Create `AnswerCard` component              | 🔲     |
| Create `AnswerEditor` component (Markdown) | 🔲     |
| Create `MarkdownPreview` component         | 🔲     |
| Integrate into `QuestionDetailPage`        | 🔲     |

### Additional Packages

```bash
npm install react-markdown remark-gfm
npm install react-syntax-highlighter
npm install -D @types/react-syntax-highlighter
```

---

## Phase 7: Assets Feature

**Entity:** Asset (File uploads, polymorphic relationship)

### Tasks

| Task                                  | Status |
| :------------------------------------ | :----- |
| Create `assetService.ts`              | 🔲     |
| Create `useAssets` hook (by parentId) | 🔲     |
| Create `FileUpload` component         | 🔲     |
| Create `AssetGallery` component       | 🔲     |
| Create `ImagePreview` component       | 🔲     |
| Integrate into Question/Answer views  | 🔲     |

---

## Phase 8: Search & Filters

### Global Search

| Task                            | Status |
| :------------------------------ | :----- |
| Add SearchInput to Header       | 🔲     |
| Create search results dropdown  | 🔲     |
| Create full search results page | 🔲     |

### Filter System

| Filter        | Entity       | Status |
| :------------ | :----------- | :----- |
| By Technology | Questions    | 🔲     |
| By Difficulty | Questions    | 🔲     |
| By Date Range | Questions    | 🔲     |
| By Type       | Technologies | 🔲     |

---

## Phase 9: Polish & Deploy

### Performance

| Task                    | Status |
| :---------------------- | :----- |
| Lazy load feature pages | 🔲     |
| Add page skeletons      | 🔲     |
| Lighthouse audit (90+)  | 🔲     |

### UX

| Task                         | Status |
| :--------------------------- | :----- |
| Toast notifications for CRUD | 🔲     |
| Optimistic updates           | 🔲     |
| Error boundaries             | 🔲     |

---

## API Reference

Base URL: `http://localhost:5001/api`

### Technologies

| Method | Endpoint            | Description |
| :----- | :------------------ | :---------- |
| GET    | `/technologies`     | List all    |
| GET    | `/technologies/:id` | Get by ID   |
| POST   | `/technologies`     | Create      |
| PUT    | `/technologies/:id` | Update      |
| DELETE | `/technologies/:id` | Soft delete |

### Questions

| Method | Endpoint         | Description                                     |
| :----- | :--------------- | :---------------------------------------------- |
| GET    | `/questions`     | List (supports ?technologyId, ?difficultyLevel) |
| GET    | `/questions/:id` | Get by ID (includes technology, answers)        |
| POST   | `/questions`     | Create                                          |
| PUT    | `/questions/:id` | Update                                          |
| DELETE | `/questions/:id` | Soft delete                                     |

### Answers

| Method | Endpoint                 | Description      |
| :----- | :----------------------- | :--------------- |
| GET    | `/questions/:id/answers` | List by question |
| POST   | `/answers`               | Create           |
| PUT    | `/answers/:id`           | Update           |
| DELETE | `/answers/:id`           | Soft delete      |

### Assets

| Method | Endpoint               | Description                  |
| :----- | :--------------------- | :--------------------------- |
| GET    | `/assets?parentId=:id` | List by parent               |
| POST   | `/assets`              | Upload (multipart/form-data) |
| DELETE | `/assets/:id`          | Delete                       |

---

## Enums

### DifficultyLevel

| Value | Name         | Badge Color                 |
| :---- | :----------- | :-------------------------- |
| 1     | Beginner     | Green (`--color-accent`)    |
| 2     | Intermediate | Blue (`--color-info`)       |
| 3     | Advanced     | Amber (`--color-warning`)   |
| 4     | Expert       | Red (`--color-destructive`) |

### TechnologyType

| Value | Name      |
| :---- | :-------- |
| 1     | Language  |
| 2     | Framework |
| 3     | Library   |
| 4     | Database  |
| 5     | Tool      |

---

## Next Steps

**Immediate:** Continue Phase 3 - Common Components

1. ✅ Create `Input` component
2. ⬜ Create `Select` component
3. ✅ Create `Card` component
4. ✅ Create `Badge` component
5. ✅ Create `Modal` component
6. ⬜ Create `Textarea` component
7. ⬜ Create `Skeleton` component
