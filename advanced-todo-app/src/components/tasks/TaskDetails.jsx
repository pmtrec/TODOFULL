import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { taskService } from '../../services/taskService';
import TaskForm from './TaskForm';
import { 
  X, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Clock, 
  Image as ImageIcon, 
  Play, 
  Pause,
  MessageCircle,
  Settings,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { format, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

const TaskDetails = ({ task, onClose, onTaskUpdated, onTaskDeleted }) => {
  const { user, token } = useAuth();
  const [showEditForm, setShowEditForm] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canModifyTask = () => {
    const userPermissions = task.permissions?.[user.id] || [];
    return userPermissions.includes('modify') || task.creatorId === user.id;
  };

  const canDeleteTask = () => {
    return task.creatorId === user.id;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const isTaskUrgent = () => {
    const now = new Date();
    const endDate = new Date(task.endDate);
    const minutesLeft = differenceInMinutes(endDate, now);
    
    return minutesLeft <= 10 && minutesLeft > 0 && task.status !== 'completed';
  };

  const isTaskOverdue = () => {
    const now = new Date();
    const endDate = new Date(task.endDate);
    
    return now > endDate && task.status !== 'completed';
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    setError('');

    try {
      const updatedTask = await taskService.updateTask(
        task.id,
        { status: newStatus },
        token
      );
      onTaskUpdated(updatedTask);
    } catch {
      setError('Erreur lors de la mise à jour du statut');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await taskService.deleteTask(task.id, token);
      onTaskDeleted(task.id);
    } catch {
      setError('Erreur lors de la suppression de la tâche');
      setLoading(false);
    }
  };

  const handleAudioPlay = () => {
    if (!task.audioUrl) return;

    if (isPlayingAudio) {
      audio?.pause();
      setIsPlayingAudio(false);
    } else {
      const newAudio = new Audio(task.audioUrl);
      newAudio.onended = () => setIsPlayingAudio(false);
      newAudio.play();
      setAudio(newAudio);
      setIsPlayingAudio(true);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  if (showEditForm) {
    return (
      <TaskForm
        task={task}
        onClose={() => setShowEditForm(false)}
        onTaskCreated={(updatedTask) => {
          onTaskUpdated(updatedTask);
          setShowEditForm(false);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {task.title}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-1" />
                <span>Créé par {task.creatorName}</span>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
                {task.status === 'completed' && <CheckCircle className="h-4 w-4 mr-1" />}
                {task.status === 'urgent' && <AlertTriangle className="h-4 w-4 mr-1" />}
                {task.status === 'in_progress' && <Clock className="h-4 w-4 mr-1" />}
                <span className="capitalize">{task.status.replace('_', ' ')}</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {canModifyTask() && (
              <button
                onClick={() => setShowEditForm(true)}
                className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                title="Modifier"
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
            
            {canDeleteTask() && (
              <button
                onClick={handleDeleteTask}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                title="Supprimer"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Urgency Alerts */}
          {isTaskOverdue() && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span className="font-medium">Cette tâche est en retard !</span>
            </div>
          )}
          
          {isTaskUrgent() && (
            <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-lg flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-medium">Cette tâche se termine dans moins de 10 minutes !</span>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Dates</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Début:</span>
                  <span className="ml-2">{formatDate(task.startDate)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Fin:</span>
                  <span className="ml-2">{formatDate(task.endDate)}</span>
                </div>
              </div>
            </div>

            {/* Priority & Assignment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Informations</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="font-medium">Priorité:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'high' ? 'Haute' : 
                     task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium">Assignés:</span>
                  <span className="ml-2">{task.assignedUsers?.length || 0} personne(s)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Media */}
          {(task.image || task.audioUrl) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Médias</h3>
              <div className="space-y-4">
                {task.image && (
                  <div>
                    <div className="flex items-center mb-2">
                      <ImageIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm font-medium">Image</span>
                    </div>
                    <img
                      src={task.image}
                      alt="Task attachment"
                      className="max-w-full h-auto max-h-64 rounded-lg shadow-sm"
                    />
                  </div>
                )}
                
                {task.audioUrl && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">Enregistrement vocal</span>
                      </div>
                      <button
                        onClick={handleAudioPlay}
                        className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded-lg transition-colors"
                      >
                        {isPlayingAudio ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                        <span>{isPlayingAudio ? 'Pause' : 'Écouter'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status Actions */}
          {canModifyTask() && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Actions</h3>
              <div className="flex flex-wrap gap-2">
                {task.status !== 'pending' && (
                  <button
                    onClick={() => handleStatusChange('pending')}
                    disabled={loading}
                    className="btn-secondary text-sm"
                  >
                    Marquer en attente
                  </button>
                )}
                {task.status !== 'in_progress' && (
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    disabled={loading}
                    className="btn-secondary text-sm"
                  >
                    Marquer en cours
                  </button>
                )}
                {task.status !== 'completed' && (
                  <button
                    onClick={() => handleStatusChange('completed')}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    Marquer terminé
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Chat Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Discussion</h3>
              <div className="flex items-center text-sm text-gray-600">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>{task.chat?.length || 0} message(s)</span>
              </div>
            </div>
            
            {task.chat && task.chat.length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                {task.chat.slice(-3).map((message) => (
                  <div key={message.id} className="text-sm mb-2 last:mb-0">
                    <span className="font-medium text-gray-900">{message.userName}:</span>
                    <span className="ml-2 text-gray-700">{message.message}</span>
                  </div>
                ))}
                {task.chat.length > 3 && (
                  <div className="text-xs text-gray-500 mt-2">
                    ... et {task.chat.length - 3} message(s) de plus
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                Aucun message pour le moment
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;