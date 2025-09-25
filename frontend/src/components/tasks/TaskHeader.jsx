import React from 'react';
import { Plus } from 'lucide-react';
import { UI_TEXT } from '../../constants';

const TaskHeader = ({ activeTab, onTabChange, onNewTask }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {UI_TEXT.TASK_MANAGER}
            </h1>

            {/* Tabs */}
            <div className="flex space-x-1">
              <button
                onClick={() => onTabChange('all')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'all'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {UI_TEXT.ALL_TASKS}
              </button>
              <button
                onClick={() => onTabChange('my')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'my'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {UI_TEXT.MY_TASKS}
              </button>
            </div>
          </div>

          <button
            onClick={onNewTask}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            {UI_TEXT.NEW_TASK}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskHeader;