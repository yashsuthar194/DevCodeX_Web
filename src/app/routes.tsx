/**
 * DevCodeX Application Routes
 * 
 * Centralized route definitions with lazy loading.
 * Uses React Router v7 with type-safe routing.
 */

import { Routes, Route } from 'react-router';
import { lazy, Suspense } from 'react';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui';
import { Skeleton } from '@/components/feedback/Skeleton';

/**
 * Lazy-loaded page components
 * Code splitting for better initial load performance
 */
// Questions pages
const QuestionsPage = lazy(() => import('@/features/questions/pages/QuestionsPage'));
const QuestionDetailPage = lazy(() => import('@/features/questions/pages/QuestionDetailPage'));
const CreateQuestionPage = lazy(() => import('@/features/questions/pages/CreateQuestionPage'));
const EditQuestionPage = lazy(() => import('@/features/questions/pages/EditQuestionPage'));

// Technologies pages
const TechnologiesPage = lazy(() => import('@/features/technologies/pages/TechnologiesPage'));
const TechnologyDetailPage = lazy(() => import('@/features/technologies/pages/TechnologyDetailPage'));

/**
 * Page loading skeleton
 */
function PageSkeleton() {
  return (
    <div className="page">
      <div className="page__header">
        <Skeleton variant="text" width="40%" height={32} />
        <Skeleton variant="text" width="60%" height={20} />
      </div>
      <div className="page__section mt-6">
        <div className="grid-responsive gap-4">
          <Skeleton variant="rectangular" height={120} />
          <Skeleton variant="rectangular" height={120} />
          <Skeleton variant="rectangular" height={120} />
          <Skeleton variant="rectangular" height={120} />
        </div>
      </div>
    </div>
  );
}

/**
 * Application routes component
 * 
 * Route structure:
 * - / → Dashboard (Questions list)
 * - /questions → Questions list
 * - /questions/:id → Question detail
 * - /technologies → Technology management
 * - /technologies/:id → Technology detail
 */
export function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        {/* Home route */}
        <Route path="/" element={<HomePage />} />
        
        {/* Questions routes - lazy loaded */}
        <Route 
          path="/questions" 
          element={
            <Suspense fallback={<PageSkeleton />}>
              <QuestionsPage />
            </Suspense>
          } 
        />
        <Route 
          path="/questions/new" 
          element={
            <Suspense fallback={<PageSkeleton />}>
              <CreateQuestionPage />
            </Suspense>
          } 
        />
        <Route 
          path="/questions/:id" 
          element={
            <Suspense fallback={<PageSkeleton />}>
              <QuestionDetailPage />
            </Suspense>
          } 
        />
        <Route 
          path="/questions/:id/edit" 
          element={
            <Suspense fallback={<PageSkeleton />}>
              <EditQuestionPage />
            </Suspense>
          } 
        />
        
        {/* Technologies routes - lazy loaded */}
        <Route 
          path="/technologies" 
          element={
            <Suspense fallback={<PageSkeleton />}>
              <TechnologiesPage />
            </Suspense>
          } 
        />
        <Route 
          path="/technologies/:id" 
          element={
            <Suspense fallback={<PageSkeleton />}>
              <TechnologyDetailPage />
            </Suspense>
          } 
        />
        
        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  );
}

/**
 * Dashboard home page
 */
function HomePage() {
  return (
    <div className="page">
      {/* SEO: React 19 native metadata */}
      <title>Dashboard | DevCodeX</title>
      <meta name="description" content="DevCodeX dashboard - Your interview preparation companion." />

      <div className="page__header">
        <h1>Dashboard</h1>
        <p>Welcome to DevCodeX - Your interview preparation companion.</p>
      </div>

      <section className="page__section">
        <h2>Quick Actions</h2>
        {/* Using CSS classes instead of inline styles (coding-standards.md 1.5) */}
        <div className="flex-row flex-wrap gap-3 mt-4">
          <Button variant="primary">Add Question</Button>
          <Button variant="secondary">Browse Technologies</Button>
          <Button variant="outline">View Statistics</Button>
        </div>
      </section>

      <section className="page__section mt-8">
        <h2>Setup Complete ✓</h2>
        {/* Using CSS class instead of inline styles */}
        <ul className="list-disc text-muted mt-4">
          <li>React 19.2.0 with TypeScript</li>
          <li>Vite 7.2.4 with path aliases</li>
          <li>TanStack Query v5 configured</li>
          <li>React Router v7 ready</li>
          <li>GPU-accelerated animations</li>
          <li>Zustand for state management</li>
          <li>CSS design system with light/dark themes</li>
        </ul>
      </section>
    </div>
  );
}

/**
 * 404 Not Found page
 */
function NotFoundPage() {
  return (
    <div className="page text-center mt-16">
      {/* SEO: 404 page title */}
      <title>Page Not Found | DevCodeX</title>

      <h1 className="text-5xl text-subtle">
        404
      </h1>
      <p className="mt-4 text-muted">
        Page not found
      </p>
      <div className="mt-6">
        <Button variant="primary" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </div>
  );
}
