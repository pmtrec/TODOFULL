// UI Text Constants
export const UI_TEXT = {
  // Navigation
  APP_TITLE: 'TodoFlow',
  TASK_MANAGER: 'Gestionnaire de Tâches',
  ALL_TASKS: 'Toutes les tâches',
  MY_TASKS: 'Mes tâches',
  NEW_TASK: 'Nouvelle tâche',
  LOGOUT: 'Déconnexion',
  WELCOME: 'Bonjour',

  // Loading
  LOADING: 'Chargement...',
  LOADING_TASKS: 'Chargement des tâches...',

  // Search and Filters
  SEARCH_PLACEHOLDER: 'Rechercher des tâches...',
  ALL_STATUSES: 'Tous les statuts',
  STATUS_PENDING: 'En attente',
  STATUS_IN_PROGRESS: 'En cours',
  STATUS_COMPLETED: 'Terminé',
  STATUS_URGENT: 'Urgent',

  // Task Status
  STATUS_COMPLETED_LABEL: 'Terminé',
  STATUS_IN_PROGRESS_LABEL: 'En cours',
  STATUS_URGENT_LABEL: 'Urgent',
  STATUS_PENDING_LABEL: 'En attente',

  // Task Actions
  MARK_PENDING: 'Marquer en attente',
  MARK_IN_PROGRESS: 'Marquer en cours',
  MARK_COMPLETED: 'Marquer terminé',
  EDIT: 'Modifier',
  DELETE: 'Supprimer',
  SAVE: 'Enregistrer',
  CANCEL: 'Annuler',

  // Task Fields
  TITLE: 'Titre',
  DESCRIPTION: 'Description',
  START_DATE: 'Date de début',
  END_DATE: 'Date de fin',
  PRIORITY: 'Priorité',
  PRIORITY_LOW: 'Basse',
  PRIORITY_MEDIUM: 'Moyenne',
  PRIORITY_HIGH: 'Haute',
  ASSIGNEES: 'Assignés',
  PERMISSIONS: 'Permissions',

  // Audio Recording
  RECORD: 'Enregistrer',
  STOP: 'Arrêter',
  PLAY: 'Écouter',
  PAUSE: 'Pause',
  DOWNLOAD: 'Télécharger',
  DELETE_RECORDING: 'Supprimer',
  RECORDING_INSTRUCTIONS: 'Cliquez sur "Enregistrer" pour capturer un message vocal (maximum {maxDuration} secondes)',

  // Chat
  DISCUSSION: 'Discussion',
  MESSAGES: 'message(s)',
  NO_MESSAGES: 'Aucun message pour le moment',

  // Media
  IMAGE: 'Image',
  AUDIO_RECORDING: 'Enregistrement vocal',
  EXISTING_AUDIO: 'Audio existant',

  // Validation
  TITLE_REQUIRED: 'Le titre est requis',
  DESCRIPTION_REQUIRED: 'La description est requise',
  START_DATE_REQUIRED: 'La date de début est requise',
  END_DATE_REQUIRED: 'La date de fin est requise',
  END_DATE_AFTER_START: 'La date de fin doit être après la date de début',

  // Errors
  LOAD_TASKS_ERROR: 'Erreur lors du chargement des tâches',
  UPDATE_STATUS_ERROR: 'Erreur lors de la mise à jour du statut',
  DELETE_TASK_ERROR: 'Erreur lors de la suppression de la tâche',
  CREATE_TASK_ERROR: 'Erreur lors de la création de la tâche',
  MICROPHONE_ERROR: 'Impossible d\'accéder au microphone. Vérifiez les permissions.',

  // Empty States
  NO_TASKS_FOUND: 'Aucune tâche ne correspond aux critères de recherche',
  NO_TASKS_AVAILABLE: 'Aucune tâche disponible',
  CREATE_FIRST_TASK: 'Créez votre première tâche pour commencer',
  NO_ASSIGNED_TASKS: 'Vous n\'avez pas encore de tâches assignées',

  // Notifications
  TASK_URGENT: 'La tâche "{title}" se termine dans moins de 10 minutes !',
  TASK_OVERDUE: 'Cette tâche est en retard !',
  TASK_URGENT_ALERT: 'Cette tâche se termine dans moins de 10 minutes !',

  // Permissions
  ADVANCED_PERMISSIONS: 'Fonctionnalité avancée de permissions disponible dans la vue détaillée de la tâche.',
  DEFAULT_PERMISSIONS: 'Par défaut, vous avez tous les droits sur cette tâche.',

  // Confirmations
  CONFIRM_DELETE: 'Êtes-vous sûr de vouloir supprimer cette tâche ?',
};

// Task Status Values
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  URGENT: 'urgent',
};

// Task Priority Values
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Default Task Permissions
export const DEFAULT_PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  MODIFY: 'modify',
};

// Audio Recording Settings
export const AUDIO_SETTINGS = {
  MAX_DURATION: 15, // seconds
  MIME_TYPE: 'audio/wav',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// API Error Messages
export const API_ERRORS = {
  UNAUTHORIZED: 'Non autorisé',
  FORBIDDEN: 'Accès refusé',
  NOT_FOUND: 'Ressource non trouvée',
  SERVER_ERROR: 'Erreur serveur',
  NETWORK_ERROR: 'Erreur de réseau',
};