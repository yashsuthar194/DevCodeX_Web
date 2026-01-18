/**
 * TechnologyDetailPage
 * 
 * Single technology view with details, edit/delete actions, and related questions list.
 */

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Button } from '@/components/ui/Button';
import { Badge, DIFFICULTY_VARIANTS, DIFFICULTY_LABELS } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/feedback/Skeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { TechnologyForm } from '../../components/TechnologyForm';
import { useTechnology } from '../../hooks/useTechnology';
import { useUpdateTechnology, useDeleteTechnology } from '../../hooks/useTechnologyMutations';
import { useQuestions } from '@/features/questions/hooks';
import { useDebounce } from '@/core/hooks';
import { getTechnologyTypeLabel, getDifficultyOptions, type CreateTechnologyRequest, type DifficultyLevel } from '@/types';
import './TechnologyDetailPage.css';

/**
 * Get badge variant based on technology type
 */
function getTypeVariant(type: number): 'primary' | 'success' | 'info' | 'warning' {
  switch (type) {
    case 0: return 'primary';
    case 1: return 'success';
    case 2: return 'info';
    case 3: return 'warning';
    default: return 'primary';
  }
}

/**
 * TechnologyDetailPage component
 */
export default function TechnologyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: technology, isLoading, error } = useTechnology(id ?? '');

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Questions filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | undefined>(undefined);

  // Debounce search query for API calls
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch questions for this technology with server-side search
  const { 
    data: questions = [], 
    isLoading: isLoadingQuestions 
  } = useQuestions(
    { 
      technologyId: id, 
      difficultyLevel: difficultyFilter,
      query: debouncedSearch || undefined  // Pass to API for server-side search
    },
    { pageIndex: 1, pageSize: 50 }
  );

  // Mutations
  const updateMutation = useUpdateTechnology();
  const deleteMutation = useDeleteTechnology();

  // Handlers
  const handleUpdate = (data: CreateTechnologyRequest) => {
    if (!id) return;
    
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: (response) => {
          if (response.Status === 'Succeeded') {
            setIsEditModalOpen(false);
          }
        },
      }
    );
  };

  const handleDelete = () => {
    if (!id) return;
    
    deleteMutation.mutate(id, {
      onSuccess: (response) => {
        if (response.Status === 'Succeeded') {
          navigate('/technologies');
        }
      },
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="page technology-detail-page">
      {/* SEO: React 19 native metadata */}
      <title>{technology?.Name ?? 'Technology'} | DevCodeX</title>
      <meta 
        name="description" 
        content={technology?.Description ?? 'View technology details'} 
      />

      {/* Breadcrumb Navigation */}
      <nav className="technology-detail-page__breadcrumb" aria-label="Breadcrumb">
        <Link to="/technologies" className="breadcrumb-link">
          Technologies
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">
          {isLoading ? <Skeleton variant="text" width={100} /> : technology?.Name}
        </span>
      </nav>

      {/* Loading State */}
      {isLoading && (
        <Card className="technology-detail-page__card">
          <CardBody>
            <Skeleton variant="text" width="60%" height={32} />
            <div className="mt-4">
              <Skeleton variant="text" width={80} height={24} />
            </div>
            <div className="mt-6">
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="90%" />
            </div>
          </CardBody>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <EmptyState
          title="Failed to load technology"
          description={(error as Error).message}
          action={{
            label: 'Back to Technologies',
            onClick: () => navigate('/technologies'),
          }}
        />
      )}

      {/* Content */}
      {!isLoading && !error && technology && (
        <>
          <Card className="technology-detail-page__card">
            <CardBody>
              <div className="technology-detail-page__header">
                <div className="technology-detail-page__title-group">
                  <h1 className="technology-detail-page__title">{technology.Name}</h1>
                  <Badge 
                    variant={getTypeVariant(technology.TechnologyType)} 
                    size="md"
                    isPill
                  >
                    {getTechnologyTypeLabel(technology.TechnologyType)}
                  </Badge>
                </div>
                <div className="technology-detail-page__actions">
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditModalOpen(true)}
                    aria-haspopup="dialog"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    aria-haspopup="dialog"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {technology.Description && (
                <div className="technology-detail-page__description">
                  <h2 className="sr-only">Description</h2>
                  <p>{technology.Description}</p>
                </div>
              )}

              <div className="technology-detail-page__meta">
                <div className="technology-detail-page__meta-item">
                  <span className="text-muted">Created:</span>
                  <span>{formatDate(technology.CreatedAt)}</span>
                </div>
                {technology.UpdatedAt && (
                  <div className="technology-detail-page__meta-item">
                    <span className="text-muted">Last updated:</span>
                    <span>{formatDate(technology.UpdatedAt)}</span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Related Questions Section */}
          <section className="technology-detail-page__questions mt-8">
            <div className="technology-detail-page__questions-header">
              <h2>
                Related Questions
                {!isLoadingQuestions && (
                  <span className="technology-detail-page__questions-count">
                    ({questions.length})
                  </span>
                )}
              </h2>
              <div className="technology-detail-page__questions-controls">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="technology-detail-page__search"
                  aria-label="Search questions"
                />
                <select
                  value={difficultyFilter ?? ''}
                  onChange={(e) => setDifficultyFilter(
                    e.target.value ? Number(e.target.value) as DifficultyLevel : undefined
                  )}
                  className="technology-detail-page__select"
                  aria-label="Filter by difficulty"
                >
                  <option value="">All Difficulties</option>
                  {getDifficultyOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isLoadingQuestions && (
              <div className="technology-detail-page__questions-loading">
                <Skeleton variant="rectangular" height={80} />
                <Skeleton variant="rectangular" height={80} />
                <Skeleton variant="rectangular" height={80} />
              </div>
            )}

            {!isLoadingQuestions && questions.length === 0 && (
              <EmptyState
                title="No questions yet"
                description="There are no questions for this technology yet."
                action={{
                  label: 'Add Question',
                  onClick: () => navigate('/questions/new'),
                }}
              />
            )}

            {!isLoadingQuestions && questions.length > 0 && (
              <div className="technology-detail-page__questions-list">
                {questions.map((question) => (
                  <Card key={question.Id} className="technology-detail-page__question-card">
                    <CardBody>
                      <div className="technology-detail-page__question-content">
                        <div className="technology-detail-page__question-info">
                          <h3 className="technology-detail-page__question-title">
                            {question.Title}
                          </h3>
                          <div className="technology-detail-page__question-meta">
                            <Badge 
                              variant={DIFFICULTY_VARIANTS[question.DifficultyLevel]} 
                              size="sm"
                            >
                              {DIFFICULTY_LABELS[question.DifficultyLevel]}
                            </Badge>
                            <span className="text-muted text-sm">
                              {formatDate(question.CreatedAt)}
                            </span>
                          </div>
                        </div>
                        <div className="technology-detail-page__question-actions">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/questions/${question.Id}`)}
                          >
                            View Answer
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        size="md"
        title="Edit Technology"
      >
        {technology && (
          <TechnologyForm
            defaultValues={technology}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditModalOpen(false)}
            isLoading={updateMutation.isPending}
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Technology"
        message={`Are you sure you want to delete "${technology?.Name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
