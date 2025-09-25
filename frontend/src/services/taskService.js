import axios from 'axios';

// Backend API base URL
const API_BASE_URL = 'http://localhost:4000/api';

// Create axios instance
const createApiInstance = (token) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });
};


export const taskService = {
  async getAllTasks(token) {
    const api = createApiInstance(token);
    const response = await api.get('/tasks');
    const allTasks = response.data.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      creatorId: task.creatorId,
      creatorName: task.creatorName || 'Utilisateur',
      assignedUsers: task.assignedUsers || [],
      status: task.status,
      priority: task.priority || 'medium',
      startDate: task.startDate,
      endDate: task.endDate,
      image: task.image || null,
      audioUrl: task.audio || null,
      permissions: {},
      chat: [],
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }));

    return allTasks;
  },


  async createTask(taskData, token) {
    const api = createApiInstance(token);
    const newTask = {
      title: taskData.title,
      description: taskData.description,
      startDate: taskData.startDate,
      endDate: taskData.endDate,
      priority: taskData.priority || 'medium'
    };

    const response = await api.post('/tasks', newTask);
    const task = response.data;
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      creatorId: task.creatorId,
      creatorName: task.creatorName || 'Utilisateur',
      assignedUsers: task.assignedUsers || [],
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      endDate: task.endDate,
      image: task.image || null,
      audioUrl: task.audio || null,
      permissions: {},
      chat: [],
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };
  },

  async updateTask(taskId, updates, token) {
    const api = createApiInstance(token);
    const payload = {};
    if (updates.title) payload.title = updates.title;
    if (updates.description) payload.description = updates.description;
    if (updates.startDate) payload.startDate = updates.startDate;
    if (updates.endDate) payload.endDate = updates.endDate;
    if (updates.status) payload.status = updates.status;

    const response = await api.put(`/tasks/${taskId}`, payload);
    const task = response.data;
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      creatorId: task.creatorId,
      creatorName: task.creatorName,
      assignedUsers: task.assignedUsers || [],
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      endDate: task.endDate,
      image: task.image || null,
      audioUrl: task.audio || null,
      permissions: {},
      chat: [],
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };
  },

  async deleteTask(taskId, token) {
    const api = createApiInstance(token);
    await api.delete(`/tasks/${taskId}`);
    return { success: true };
  },

  async addChatMessage(taskId, message, token) {
    const api = createApiInstance(token);
    const newMessage = {
      message: message
    };

    const response = await api.post(`/tasks/${taskId}/chat`, newMessage);
    return response.data;
  },

  async uploadTaskImage(taskId, imageFile, token) {
    const api = createApiInstance(token);
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post(`/tasks/${taskId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async uploadTaskAudio(taskId, audioBlob, token) {
    const api = createApiInstance(token);
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');

    const response = await api.post('/upload-vocal', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return { audioUrl: response.data.path };
  }
};

export default taskService;