import React from 'react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getStatusStyles = (status: Task['status']): string => {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1 cursor-pointer group">
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative">
          <img
            src={task.profilePic}
            alt={task.name}
            className="w-12 h-12 rounded-full border-2 border-gray-100 group-hover:border-gray-200 transition-colors duration-200 object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg group-hover:text-gray-700 transition-colors duration-200">
            {task.name}
          </h3>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-700 font-medium leading-relaxed">
          {task.title}
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">
          {task.time}
        </span>
        
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles(task.status)} transition-all duration-200`}>
          {task.status}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;