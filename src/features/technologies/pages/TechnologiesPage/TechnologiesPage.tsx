/**
 * TechnologiesPage
 * 
 * Main page for viewing and managing technologies.
 * Features: Grid layout, create modal, edit/delete actions.
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/feedback/Skeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { TechnologyCard } from '../../components/TechnologyCard';
import { TechnologyForm } from '../../components/TechnologyForm';
import { useTechnologies } from '../../hooks/useTechnologies';
import {
  useCreateTechnology,
  useUpdateTechnology,
  useDeleteTechnology,
} from '../../hooks/useTechnologyMutations';
import type { Technology, CreateTechnologyRequest } from '@/types';
import './TechnologiesPage.css';

/**
 * TechnologiesPage component
 */
export default function TechnologiesPage() {
  const navigate = useNavigate();
  const { data: technologies, isLoading, error } = useTechnologies();
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTechnology, setEditingTechnology] = useState<Technology | null>(null);
  const [deletingTechnology, setDeletingTechnology] = useState<Technology | null>(null);

  // Mutations
  const createMutation = useCreateTechnology();
  const updateMutation = useUpdateTechnology();
  const deleteMutation = useDeleteTechnology();

  // Handlers - memoized for stable references
  const handleCardClick = useCallback((technology: Technology) => {
    navigate(`/technologies/${technology.Id}`);
  }, [navigate]);

  const handleCreate = useCallback((data: CreateTechnologyRequest) => {
    createMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.Status === 'Succeeded') {
          setIsCreateModalOpen(false);
        }
      },
    });
  }, [createMutation]);

  const handleEdit = useCallback((technology: Technology) => {
    setEditingTechnology(technology);
  }, []);

  const handleUpdate = useCallback((data: CreateTechnologyRequest) => {
    if (!editingTechnology) return;
    
    updateMutation.mutate(
      { id: editingTechnology.Id, data },
      {
        onSuccess: (response) => {
          if (response.Status === 'Succeeded') {
            setEditingTechnology(null);
          }
        },
      }
    );
  }, [editingTechnology, updateMutation]);

  const handleDelete = useCallback((technology: Technology) => {
    setDeletingTechnology(technology);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!deletingTechnology) return;
    
    deleteMutation.mutate(deletingTechnology.Id, {
      onSuccess: (response) => {
        if (response.Status === 'Succeeded') {
          setDeletingTechnology(null);
        }
      },
    });
  }, [deletingTechnology, deleteMutation]);

  return (
    <div className="page technologies-page">
      {/* SEO: React 19 native metadata */}
      <title>Technologies | DevCodeX</title>
      <meta name="description" content="Manage technology categories for interview questions." />

      {/* Page Header */}
      <div className="page__header technologies-page__header">
        <div>
          <h1>Technologies</h1>
          <p className="text-muted">
            Manage technology categories for organizing interview questions.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          aria-haspopup="dialog"
        >
          + Add Technology
        </Button>
      </div>

      {/* Content */}
      <section className="page__section">
        {isLoading && (
          <div className="technologies-page__grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="technology-skeleton">
                <Skeleton variant="rectangular" height={120} />
              </div>
            ))}
          </div>
        )}

        {error && (
          <EmptyState
            title="Failed to load technologies"
            description={(error as Error).message}
            action={{
              label: 'Try Again',
              onClick: () => window.location.reload(),
            }}
          />
        )}

        {!isLoading && !error && technologies?.length === 0 && (
          <EmptyState
            title="No technologies yet"
            description="Get started by adding your first technology category."
            action={{
              label: 'Add Technology',
              onClick: () => setIsCreateModalOpen(true),
            }}
          />
        )}

        {!isLoading && !error && technologies && technologies.length > 0 && (
          <div className="technologies-page__grid">
            {technologies.map((technology) => (
              <TechnologyCard
                key={technology.Id}
                technology={technology}
                onClick={handleCardClick}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        size="md"
        title="Add Technology"
      >
        <TechnologyForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createMutation.isPending}
          submitLabel="Create"
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingTechnology}
        onClose={() => setEditingTechnology(null)}
        size="md"
        title="Edit Technology"
      >
        {editingTechnology && (
          <TechnologyForm
            defaultValues={editingTechnology}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTechnology(null)}
            isLoading={updateMutation.isPending}
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingTechnology}
        onClose={() => setDeletingTechnology(null)}
        onConfirm={confirmDelete}
        title="Delete Technology"
        message={`Are you sure you want to delete "${deletingTechnology?.Name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
