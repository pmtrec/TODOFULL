import React from 'react';
import TaskCard from './TaskCard';
import { UI_TEXT } from '../../constants';

const TaskGrid = ({ tasks, onTaskClick, onChatClick, currentUserId, activeTab }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">
          {UI_TEXT.NO_TASKS_AVAILABLE}
        </div>
        <p className="text-gray-400">
          {activeTab === 'all'
            ? UI_TEXT.CREATE_FIRST_TASK
            : UI_TEXT.NO_ASSIGNED_TASKS
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onTaskClick={onTaskClick}
          onChatClick={onChatClick}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default TaskGrid;