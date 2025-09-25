import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MessageCircle, 
  Image as ImageIcon, 
  Mic, 
  Play, 
  Pause,
  AlertTriangle,
  CheckCircle,
  Circle
} from 'lucide-react';
import { format, isAfter, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

const TaskCard = ({ task, onTaskClick, onChatClick }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audio, setAudio] = useState(null);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'urgent':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
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
    
    return isAfter(now, endDate) && task.status !== 'completed';
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
    if (!dateString) return 'Date non définie';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date invalide';
    return format(date, 'dd MMM yyyy', { locale: fr });
  };

  return (
    <div 
      className={`card border-l-4 ${getPriorityColor(task.priority)} hover:shadow-lg transition-shadow duration-200 cursor-pointer`}
      onClick={() => onTaskClick(task)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {task.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-1" />
            <span>{task.creatorName}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Status Badge */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
            {getStatusIcon(task.status)}
            <span className="ml-1 capitalize">{task.status.replace('_', ' ')}</span>
          </span>
          
          {/* Urgency Indicators */}
          {isTaskOverdue() && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <AlertTriangle className="h-3 w-3 mr-1" />
              En retard
            </span>
          )}
          
          {isTaskUrgent() && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              <Clock className="h-3 w-3 mr-1" />
              Urgent
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
        {task.description}
      </p>

      {/* Media Section */}
      {(task.image || task.audioUrl) && (
        <div className="flex items-center space-x-4 mb-4">
          {task.image && (
            <div className="flex items-center text-sm text-gray-600">
              <ImageIcon className="h-4 w-4 mr-1" />
              <span>Image</span>
            </div>
          )}
          
          {task.audioUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAudioPlay();
              }}
              className="flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              {isPlayingAudio ? (
                <Pause className="h-4 w-4 mr-1" />
              ) : (
                <Play className="h-4 w-4 mr-1" />
              )}
              <span>Audio</span>
            </button>
          )}
        </div>
      )}

      {/* Dates */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Début: {formatDate(task.startDate)}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Fin: {formatDate(task.endDate)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Assigned Users Count */}
          <span className="text-sm text-gray-600">
            {task.assignedUsers?.length || 0} assigné(s)
          </span>
          
          {/* Priority */}
          <span className={`text-xs px-2 py-1 rounded-full ${
            task.priority === 'high' ? 'bg-red-100 text-red-700' :
            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {task.priority === 'high' ? 'Haute' : 
             task.priority === 'medium' ? 'Moyenne' : 'Basse'}
          </span>
        </div>

        {/* Chat Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChatClick(task);
          }}
          className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          <span>{task.chat?.length || 0}</span>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;