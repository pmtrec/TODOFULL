import React from 'react';
import { Filter, Search } from 'lucide-react';
import { UI_TEXT } from '../../constants';

const TaskFilters = ({ searchTerm, onSearchChange, statusFilter, onStatusChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={UI_TEXT.SEARCH_PLACEHOLDER}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center space-x-2">
        <Filter className="h-5 w-5 text-gray-400" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="input-field w-auto"
        >
          <option value="all">{UI_TEXT.ALL_STATUSES}</option>
          <option value="pending">{UI_TEXT.STATUS_PENDING}</option>
          <option value="in_progress">{UI_TEXT.STATUS_IN_PROGRESS}</option>
          <option value="completed">{UI_TEXT.STATUS_COMPLETED}</option>
          <option value="urgent">{UI_TEXT.STATUS_URGENT}</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;