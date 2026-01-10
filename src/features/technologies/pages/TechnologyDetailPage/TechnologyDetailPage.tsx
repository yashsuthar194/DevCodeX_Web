/**
 * TechnologyDetailPage
 * 
 * Single technology view with details and edit/delete actions.
 */

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/feedback/Skeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { TechnologyForm } from '../../components/TechnologyForm';
import { useTechnology } from '../../hooks/useTechnology';
import { useUpdateTechnology, useDeleteTechnology } from '../../hooks/useTechnologyMutations';
import { getTechnologyTypeLabel, type CreateTechnologyRequest } from '@/types';
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

          {/* Related Question Section - Placeholder for future */}
          <section className="technology-detail-page__section mt-8">
            <h2>Related Questions</h2>
            <p className="text-muted mt-2">
              Questions using this technology will appear here.
            </p>
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
