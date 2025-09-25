import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import TaskForm from './TaskForm';
import TaskDetails from './TaskDetails';
import ChatBox from '../chat/ChatBox';
import TaskHeader from './TaskHeader';
import TaskFilters from './TaskFilters';
import TaskGrid from './TaskGrid';
import NotificationList from '../ui/NotificationList';
import { Loader } from 'lucide-react';
import { UI_TEXT } from '../../constants';

const TaskList = () => {
  const { user } = useAuth();
  const {
    tasks,
    loading,
    error,
    activeTab,
    statusFilter,
    searchTerm,
    notifications,
    setActiveTab,
    setStatusFilter,
    setSearchTerm,
    dismissNotification,
  } = useTasks();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatTask, setChatTask] = useState(null);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const handleChatClick = (task) => {
    setChatTask(task);
    setShowChat(true);
  };

  const handleTaskCreated = () => {
    setShowTaskForm(false);
  };

  const handleTaskUpdated = (updatedTask) => {
    setSelectedTask(updatedTask);
  };

  const handleTaskDeleted = () => {
    setShowTaskDetails(false);
    setSelectedTask(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-primary-600" />
          <span className="text-gray-600">{UI_TEXT.LOADING_TASKS}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      <NotificationList
        notifications={notifications}
        onDismiss={dismissNotification}
      />

      {/* Header */}
      <TaskHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewTask={() => setShowTaskForm(true)}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TaskFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tasks Grid */}
        <TaskGrid
          tasks={tasks}
          onTaskClick={handleTaskClick}
          onChatClick={handleChatClick}
          currentUserId={user.id}
          activeTab={activeTab}
        />
      </div>

      {/* Modals */}
      {showTaskForm && (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {showTaskDetails && selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setShowTaskDetails(false)}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      )}

      {showChat && chatTask && (
        <ChatBox
          task={chatTask}
          onClose={() => setShowChat(false)}
          onMessageSent={() => {
            // Chat messages are handled by the ChatBox component
            // The task list will be refreshed when needed
          }}
        />
      )}
    </div>
  );
};

export default TaskList;