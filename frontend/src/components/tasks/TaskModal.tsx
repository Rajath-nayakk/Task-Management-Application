import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Task } from '../../types/task';
import { taskSchema, TaskFormData } from '../../types/schema';
import { AlertCircle } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  taskToEdit,
}) => {
  const isEditing = !!taskToEdit;

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        priority: taskToEdit.priority,
        status: taskToEdit.status,
        dueDate: taskToEdit.dueDate || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
      });
    }
    setErrors({});
  }, [taskToEdit, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof TaskFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = taskSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TaskFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof TaskFormData;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit(result.data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'RECONFIGURE MISSION' : 'DEPLOY NEW MISSION'}
      description={
        isEditing
          ? 'Update mission parameters, tactical priority, and timeline.'
          : 'Define mission objectives and target completion date.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <Input
          label="Mission Title *"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Infiltrate target data center"
          error={errors.title}
        />

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1"
          >
            Tactical Briefing (optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Operational steps, payload specifics, or access credentials..."
            className={`w-full px-3.5 py-2.5 bg-[#0a0a14] border text-sm text-slate-100 placeholder-slate-600 font-mono focus:outline-none transition-colors ${
              errors.description
                ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
                : 'border-[#1e1e38] focus:border-[var(--neon-primary)] focus:shadow-[0_0_12px_var(--neon-glow-border)]'
            }`}
          />
          {errors.description && (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-mono text-rose-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.description}
            </p>
          )}
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="priority"
              className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1"
            >
              Priority Class
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3.5 py-2 bg-[#0a0a14] border border-[#1e1e38] text-xs font-mono text-slate-200 focus:outline-none focus:border-[var(--neon-primary)]"
            >
              <option value="low">Low [Standard]</option>
              <option value="medium">Medium [Elevated]</option>
              <option value="high">High [Critical]</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1"
            >
              Status State
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2 bg-[#0a0a14] border border-[#1e1e38] text-xs font-mono text-slate-200 focus:outline-none focus:border-[var(--neon-primary)]"
            >
              <option value="todo">Pending [To Do]</option>
              <option value="in-progress">Executing [In Progress]</option>
              <option value="done">Accomplished [Done]</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label
            htmlFor="dueDate"
            className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1"
          >
            Target Deadline
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-3.5 py-2 bg-[#0a0a14] border border-[#1e1e38] text-xs font-mono text-slate-200 focus:outline-none focus:border-[var(--neon-primary)]"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e1e38]">
          <Button variant="secondary" onClick={onClose} type="button">
            Abort
          </Button>
          <Button variant="primary" type="submit">
            {isEditing ? 'Save Changes' : 'Deploy Mission'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
