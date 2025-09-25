// Date and Time Utilities
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  return new Intl.DateTimeFormat('fr-FR', defaultOptions).format(new Date(date));
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const isTaskUrgent = (task) => {
  const now = new Date();
  const endDate = new Date(task.endDate);
  const minutesLeft = Math.floor((endDate - now) / (1000 * 60));
  return minutesLeft <= 10 && minutesLeft > 0 && task.status !== 'completed';
};

export const isTaskOverdue = (task) => {
  const now = new Date();
  const endDate = new Date(task.endDate);
  return now > endDate && task.status !== 'completed';
};

// String Utilities
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (str, length = 100, suffix = '...') => {
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};

// Validation Utilities
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

export const validateTaskForm = (formData) => {
  const errors = {};

  if (!formData.title?.trim()) {
    errors.title = 'Le titre est requis';
  }

  if (!formData.description?.trim()) {
    errors.description = 'La description est requise';
  }

  if (!formData.startDate) {
    errors.startDate = 'La date de début est requise';
  }

  if (!formData.endDate) {
    errors.endDate = 'La date de fin est requise';
  }

  if (formData.startDate && formData.endDate) {
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.endDate = 'La date de fin doit être après la date de début';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// File Utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isValidFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

export const isValidFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

// Local Storage Utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Debounce Utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// API Utilities
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return data.message || 'Requête invalide';
      case 401:
        return 'Non autorisé - Veuillez vous reconnecter';
      case 403:
        return 'Accès refusé';
      case 404:
        return 'Ressource non trouvée';
      case 500:
        return 'Erreur serveur - Veuillez réessayer plus tard';
      default:
        return data.message || 'Une erreur est survenue';
    }
  } else if (error.request) {
    // Network error
    return 'Erreur de réseau - Vérifiez votre connexion';
  } else {
    // Other error
    return error.message || 'Une erreur inattendue est survenue';
  }
};

// Task Status Utilities
export const getTaskStatusColor = (status) => {
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

export const getTaskPriorityColor = (priority) => {
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