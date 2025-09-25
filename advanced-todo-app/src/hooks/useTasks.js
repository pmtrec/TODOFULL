import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { taskService } from '../services/taskService';
import { UI_TEXT } from '../constants';

export const useTasks = () => {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);

  // Load tasks
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const taskData = await taskService.getAllTasks(token);

      // Filter based on active tab
      let filteredData;
      if (activeTab === 'all') {
        // Show all tasks
        filteredData = taskData;
      } else {
        // Show tasks assigned to the user (but not created by them)
        filteredData = taskData.filter(task =>
          task.assignedUsers.some(assigned => assigned.userId === user.id) && task.creatorId !== user.id
        );
      }

      setTasks(filteredData);
    } catch (err) {
      setError(UI_TEXT.LOAD_TASKS_ERROR);
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, user.id, token]);

  // Filter tasks
  const filterTasks = useCallback(() => {
    let filtered = [...tasks];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.creatorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, statusFilter, searchTerm]);

  // Check for urgent tasks
  const checkUrgentTasks = useCallback(() => {
    const now = new Date();
    const urgentTasks = tasks.filter(task => {
      const endDate = new Date(task.endDate);
      const minutesLeft = Math.floor((endDate - now) / (1000 * 60));
      return minutesLeft <= 10 && minutesLeft > 0 && task.status !== 'completed';
    });

    const newNotifications = urgentTasks.map(task => ({
      id: `urgent-${task.id}`,
      type: 'warning',
      message: UI_TEXT.TASK_URGENT.replace('{title}', task.title),
      task: task
    }));

    setNotifications(newNotifications);
  }, [tasks]);

  // Task operations
  const createTask = async (taskData) => {
    const newTask = await taskService.createTask(taskData, token);
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = async (taskId, taskData) => {
    const updatedTask = await taskService.updateTask(taskId, taskData, token);
    setTasks(prev => prev.map(task =>
      task.id === taskId ? updatedTask : task
    ));
    return updatedTask;
  };

  const deleteTask = async (taskId) => {
    await taskService.deleteTask(taskId, token);
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const updateTaskStatus = async (taskId, status) => {
    const updatedTask = await taskService.updateTask(taskId, { status }, token);
    setTasks(prev => prev.map(task =>
      task.id === taskId ? updatedTask : task
    ));
    return updatedTask;
  };

  // Notification management
  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Effects
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    filterTasks();
  }, [filterTasks]);

  useEffect(() => {
    checkUrgentTasks();
  }, [checkUrgentTasks]);

  return {
    // State
    tasks: filteredTasks,
    loading,
    error,
    activeTab,
    statusFilter,
    searchTerm,
    notifications,

    // Actions
    setActiveTab,
    setStatusFilter,
    setSearchTerm,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    dismissNotification,
    refreshTasks: loadTasks,
  };
};