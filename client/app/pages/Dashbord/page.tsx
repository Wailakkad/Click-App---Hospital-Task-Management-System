"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDownIcon, UserIcon, ArrowLeftIcon } from 'lucide-react';

// Import your existing components (adjust paths as needed)
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import TaskCard from '@/components/TaskCard';
import CompletedTasks from '@/components/CompletedTasks';
import AddNewStaff from '@/components/NewStuffSection';
import FilterButtons from '@/components/FilterButtons';
import toast, { Toaster } from 'react-hot-toast';


// Types
interface User {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  role: 'doctor' | 'nurse' | 'reception';
  __v: number;
}

interface Task {
  id: number;
  name: string;
  profilePic: string;
  title: string;
  time: string;
  status: "Done" | "In Progress" | "Pending";
}

interface TaskFormData {
  title: string;
  description: string;
  assignedTo: string;
}

interface AdminTaskAssignmentProps {
  onClose: () => void;
}

// Loading Component
function LoadingPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex items-center justify-center w-full">
        <div className="text-center">
          {/* Logo Section */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-3xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">ClinicTasks</h1>
            <p className="text-gray-600">Medical Task Management System</p>
          </div>

          {/* Loading Animation */}
          <div className="mb-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin mx-auto"></div>
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">Loading Dashboard...</p>
            <p className="text-sm text-gray-500">Verifying credentials and permissions</p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// AdminTaskAssignment Component
function AdminTaskAssignment({ onClose }: AdminTaskAssignmentProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    assignedTo: ''
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/users/AllUsers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
      } else {
        console.error('Failed to fetch users');
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Server error occurred while fetching users');
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setFormData({ ...formData, assignedTo: user._id });
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.assignedTo) {
      toast.error('Please fill in all fields and select a user');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/tasks/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Task created successfully' , { duration: 3000 });
        // Reset form and close modal
        setFormData({ title: '', description: '', assignedTo: '' });
        setSelectedUser(null);
        onClose(); // Close the task creation view
      } else {
        toast.error(data.message || 'Error creating task. Please try again.');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Server error occurred while creating task');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'doctor': return 'text-blue-600 bg-blue-50';
      case 'nurse': return 'text-green-600 bg-green-50';
      case 'reception': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
            <p className="text-sm text-gray-600">Assign tasks to staff members</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Creation Form - Left Side */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Task Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the task details..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            {/* Staff Assignment Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign To Staff
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
                >
                  {selectedUser ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {selectedUser.profileImage ? (
                          <img src={selectedUser.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <span className="text-gray-900">{selectedUser.name}</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getRoleColor(selectedUser.role)}`}>
                          {selectedUser.role}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">Select staff member</span>
                  )}
                  <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {users.map((user) => (
                      <button
                        key={user._id}
                        type="button"
                        onClick={() => handleUserSelect(user)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3 border-b border-gray-50 last:border-0"
                      >
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <div className="text-gray-900 font-medium">{user.name}</div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating Task...
                </div>
              ) : (
                'Create Task'
              )}
            </button>
          </form>
        </div>

        {/* Staff List Sidebar - Right Side */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Members</h3>
            
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user._id}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    selectedUser?._id === user._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                    {selectedUser?._id === user._id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
              
              {users.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <UserIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No staff members found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Home Component
export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateTask, setShowCreateTask] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const router = useRouter();

  // Authentication and Authorization Check
  useEffect(() => {
    const checkAuthAndPermissions = async () => {
      try {
        setIsAuthenticating(true);
        
        // Simulate minimum loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if user exists in localStorage
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!userStr || !token) {
          toast.error('No credentials found, redirecting to login...');
          router.replace('/');
          return;
        }

        // Parse user data
        const user = JSON.parse(userStr);
        
        // Check if user has admin role
        if (user.role !== 'admin') {
          toast.error('User is not admin, redirecting to unauthorized...');
          router.replace('/pages/unauthorized');
          return;
        }

      

        // If all checks pass
        toast.success('Authentication successful, showing dashboard');
        setIsAuthorized(true);
        
      } catch (error) {
        console.error('Auth check failed:', error);
        router.replace('/');
      } finally {
        setIsAuthenticating(false);
      }
    };

    checkAuthAndPermissions();
  }, [router]);

  const getUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:4000/api/users/AllUsers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData: User[] = await response.json();
      setUsers(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch users if authenticated and authorized
    if (isAuthorized && !isAuthenticating) {
      getUsers();
    }
  }, [isAuthorized, isAuthenticating]);

  const generateTasksFromUsers = (users: User[]): Task[] => {
    return users.map((user, index) => ({
      id: index + 1,
      name: user.name,
      profilePic: user.profileImage,
      title: getTaskByRole(user.role),
      time: 'Today, 9:30 AM',
      status: (Math.random() > 0.7 ? 'Done' : 'In Progress') as "Done" | "In Progress" | "Pending"
    }));
  };

  const getTaskByRole = (role: string): string => {
    switch (role) {
      case 'doctor':
        return 'Conduct patient consultation';
      case 'nurse':
        return 'Conduct morning rounds in Ward B';
      case 'reception':
        return 'Schedule patient appointments';
      default:
        return 'General hospital task';
    }
  };

  const tasks = generateTasksFromUsers(users);

  // Show loading page during authentication
  if (isAuthenticating) {
    return <LoadingPage />;
  }

  // Don't render anything if not authorized (redirect is happening)
  if (!isAuthorized) {
    return null;
  }

  // Show data loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-0 lg:ml-64">
          <TopBar onAddStaff={() => setShowAddStaff(true)} />
          <div className="p-4 lg:p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-0 lg:ml-64">
          <TopBar onAddStaff={() => setShowAddStaff(true)} />
          <div className="p-4 lg:p-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading users</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={getUsers}
                      className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Main dashboard content
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster  reverseOrder={false} />
      <Sidebar  onSectionChange={setActiveSection}/>
      <main className="flex-1 ml-0 lg:ml-64">
        <TopBar onAddStaff={() => setShowAddStaff(true)} />
         <div className="p-4 lg:p-6">
  {showAddStaff && (
    <AddNewStaff onClose={() => setShowAddStaff(false)} />
  )}

  {!showAddStaff && (
    <>
       {activeSection === 'Dashboard' && (
            <div>
              <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Medical Tasks</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateTask(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Create Task
                </button>
                <button
                  onClick={getUsers}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Refresh Users
                </button>
              </div>
            </div>
          
            {showCreateTask ? (
              <AdminTaskAssignment onClose={() => setShowCreateTask(false)} />
            ) : (
              <>
                <FilterButtons 
                  selectedFilter={selectedFilter}
                  onFilterChange={setSelectedFilter}
                />
              </>
            )}
          </div>
        
          {!showCreateTask && (
            <>
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No users found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </>
          )}
            </div>
          )}
          {activeSection === 'Completed Tasks' && (
            <CompletedTasks />
          )}
    </>
  )}
</div>
      </main>
    </div>
  );
}