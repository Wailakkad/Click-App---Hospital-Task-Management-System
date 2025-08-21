'use client'

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import TaskCard from '@/components/TaskCard';
import { useRouter } from 'next/navigation';
import FilterButtons from '@/components/FilterButtons';
import { Task } from '@/types';

// Type for User from your API
interface User {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  role: 'doctor' | 'nurse' | 'reception';
  __v: number;
}

const Home: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check user role from localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.replace('/'); // Redirect to login if not logged in
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        router.replace('/pages/unauthorized'); // Redirect if not admin
      }
    } catch {
      router.replace('/');
    }
  }, [router]);

  // Function to fetch users from your API
 const getUsers = async (): Promise<void> => {
  try {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token'); // Get token from localStorage

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

  // Fetch users when component mounts
  useEffect(() => {
    getUsers();
  }, []);

  // Convert users to tasks format (you can modify this based on your needs)
  const generateTasksFromUsers = (users: User[]): Task[] => {
    return users.map((user, index) => ({
      id: index + 1,
      name: user.name,
      profilePic: user.profileImage,
      title: getTaskByRole(user.role),
      time: 'Today, 9:30 AM', // You can make this dynamic
      status: Math.random() > 0.7 ? 'Done' : 'In Progress' // Random status for demo
    }));
  };

  // Helper function to assign tasks based on role
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

  // Generate tasks from users
  const tasks = generateTasksFromUsers(users);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-0 lg:ml-64">
          <TopBar />
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

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-0 lg:ml-64">
          <TopBar />
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-64">
        <TopBar />
        <div className="p-4 lg:p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Medical Tasks</h2>
              <button
                onClick={getUsers}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Refresh Users
              </button>
            </div>
            <FilterButtons 
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>
          
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
        </div>
      </main>
    </div>
  );
};

export default Home;