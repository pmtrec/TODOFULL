import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { taskService } from '../../services/taskService';
import AudioRecorder from '../ui/AudioRecorder';
import ImageUpload from '../ui/ImageUpload';
import { X, Calendar, User, AlertCircle, Save } from 'lucide-react';

const TaskForm = ({ onClose, onTaskCreated, task = null }) => {
  const { user } = useAuth();
  const { createTask, updateTask } = useTasks();
  const isEditing = !!task;
  
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    startDate: task?.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '',
    endDate: task?.endDate ? new Date(task.endDate).toISOString().split('T')[0] : '',
    priority: task?.priority || 'medium',
    assignedUsers: task?.assignedUsers || [user.id],
    permissions: task?.permissions || { [user.id]: ['read', 'write', 'modify'] }
  });
  
  const [image, setImage] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleImageSelect = (file) => {
    setImage(file);
  };

  const handleAudioRecorded = (blob) => {
    setAudioBlob(blob);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Le titre est requis');
      return false;
    }
    
    if (!formData.description.trim()) {
      setError('La description est requise');
      return false;
    }
    
    if (!formData.startDate) {
      setError('La date de début est requise');
      return false;
    }
    
    if (!formData.endDate) {
      setError('La date de fin est requise');
      return false;
    }
    
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('La date de fin doit être après la date de début');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const taskData = {
        ...formData,
        creatorId: user.id,
        creatorName: user.fullName,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      let createdTask;
      if (isEditing) {
        createdTask = await updateTask(task.id, taskData);
        // Upload image if provided (for editing, use separate endpoint)
        if (image) {
          await taskService.uploadTaskImage(createdTask.id, image);
        }
      } else {
        // For new tasks
        createdTask = await createTask(taskData);
        // Upload image if provided
        if (image) {
          await taskService.uploadTaskImage(createdTask.id, image);
        }
      }

      // Upload audio if provided
      if (audioBlob) {
        await taskService.uploadTaskAudio(createdTask.id, audioBlob);
      }

      onTaskCreated(createdTask);
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la tâche');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la tâche *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Entrez le titre de la tâche"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="input-field resize-none"
              placeholder="Décrivez la tâche en détail"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date de début *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date de fin *
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                required
                value={formData.endDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priorité
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input-field"
            >
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image (optionnelle)
            </label>
            <ImageUpload
              onImageSelect={handleImageSelect}
              maxSize={2 * 1024 * 1024} // 2MB
              currentImage={task?.image}
            />
          </div>

          {/* Audio Recording */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enregistrement vocal (max 15s)
            </label>
            <AudioRecorder
              onAudioRecorded={handleAudioRecorded}
              maxDuration={15}
              currentAudio={task?.audioUrl}
            />
          </div>

          {/* Permissions Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Permissions et assignation
            </label>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                Fonctionnalité avancée de permissions disponible dans la vue détaillée de la tâche.
              </p>
              <p className="text-xs text-gray-500">
                Par défaut, vous avez tous les droits sur cette tâche.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading 
                ? (isEditing ? 'Modification...' : 'Création...') 
                : (isEditing ? 'Modifier' : 'Créer la tâche')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;