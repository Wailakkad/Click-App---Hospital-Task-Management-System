'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Updated Task interface based on your actual API structure
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profileImage: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'in-progress';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  // Note: Your API uses "assegnedTo" (with typo), we'll handle this
  assegnedTo?: User;
  assignedTo?: User;
}

const CompletedTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch completed tasks from API
  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch('http://localhost:4000/api/tasks/completed-tasks', {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Access denied: Admin privileges required');
          }
          throw new Error(`Failed to fetch completed tasks: ${response.statusText}`);
        }

        const data: Task[] = await response.json();
        
        // Handle the API typo: "assegnedTo" should be "assignedTo"
        const normalizedTasks = data.map(task => ({
          ...task,
          assignedTo: task.assegnedTo || task.assignedTo,
          priority: task.priority || 'medium', // Default priority since it's missing in API
          dueDate: task.dueDate || new Date().toISOString(), // Default to today if missing
          completedAt: task.status === 'completed' ? (task.completedAt || new Date().toISOString()) : undefined
        }));
        
        setTasks(normalizedTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        console.error('Error fetching completed tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTasks();
  }, []);

  // Export completed tasks handler
  const handleExportTasks = () => {
    if (tasks.length === 0) {
      alert('No completed tasks to export');
      return;
    }

    // Create CSV content with proper task data (handling API field names)
    const csvContent = [
      ['Task ID', 'Title', 'Description', 'Assigned To', 'Email', 'Role', 'Status'],
      ...tasks.map(task => [
        task._id || 'N/A',
        task.title || 'Untitled',
        task.description || 'No description',
        task.assignedTo?.name || 'Unassigned',
        task.assignedTo?.email || 'N/A',
        task.assignedTo?.role || 'N/A',
        task.status || 'pending'
      ])
    ].map(row => row.join(',')).join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `completed_medical_tasks_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get status color and badge
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return {
          color: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
          icon: '✓',
          text: 'Completed'
        };
      case 'pending':
        return {
          color: 'bg-amber-100 text-amber-800 border border-amber-200',
          icon: '⏳',
          text: 'Pending'
        };
      case 'in-progress':
        return {
          color: 'bg-blue-100 text-blue-800 border border-blue-200',
          icon: '⟳',
          text: 'In Progress'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border border-gray-200',
          icon: '•',
          text: 'Unknown'
        };
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  // Loading state with modern skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-gray-200 rounded w-80 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-36 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="ml-3 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-red-200 overflow-hidden">
            <div className="bg-red-50 border-l-4 border-red-400 p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-sm">!</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-red-800 mb-2">Unable to Load Tasks</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-6 sm:mb-0">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Medical Tasks Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage and track {tasks.length} medical task{tasks.length !== 1 ? 's' : ''} across your organization
              </p>
            </div>

            {/* Export Button */}
            <motion.button
              onClick={handleExportTasks}
              disabled={tasks.length === 0}
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tasks Grid or Empty State */}
        {tasks.length === 0 ? (
          <motion.div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Tasks assigned to medical staff will appear here for tracking and management.
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {tasks.map((task) => {
              const statusBadge = getStatusBadge(task.status || 'pending');
              
              // Safe access to assignedTo with fallback values
              const assignedUser = task.assignedTo || {
                name: 'Unassigned',
                email: 'no-email@example.com',
                role: 'unknown',
                profileImage: ''
              };
              
              return (
                <motion.div
                  key={task._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                  variants={cardVariants}
                >
                  {/* Card Header */}
                  <div className="p-6">
                    {/* User Info and Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <img
                          src={assignedUser.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(assignedUser.name)}&background=374151&color=ffffff&size=128`}
                          alt={`${assignedUser.name}'s profile`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(assignedUser.name)}&background=374151&color=ffffff&size=128`;
                          }}
                        />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">
                            {assignedUser.name}
                          </h4>
                          <p className="text-xs text-gray-500 capitalize">{assignedUser.role}</p>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        <span className="mr-1">{statusBadge.icon}</span>
                        {statusBadge.text}
                      </span>
                    </div>

                    {/* Task Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {task.title || 'Untitled Task'}
                    </h3>

                    {/* Task Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {task.description || 'No description available'}
                    </p>

                    {/* Task Meta Information */}
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>Task ID:</span>
                        <span className="font-mono text-gray-700">
                          #{task._id?.slice(-8)?.toUpperCase() || 'N/A'}
                        </span>
                      </div>
                      
                      {task.dueDate && (
                        <div className="flex items-center justify-between">
                          <span>Due Date:</span>
                          <span className="text-gray-700">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      {task.completedAt && (
                        <div className="flex items-center justify-between">
                          <span>Completed:</span>
                          <span className="text-emerald-600 font-medium">
                            {new Date(task.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{assignedUser.email}</span>
                      <span>
                        {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CompletedTasks;