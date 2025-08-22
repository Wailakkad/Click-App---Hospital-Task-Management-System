'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

export default function DoctorTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      setHasAccess(false);
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    const parsedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (parsedUser.role !== 'doctor') {
      setHasAccess(false);
      setTimeout(() => router.push('/'), 2000);
      return;
    }

    // Set user data
    setUser(parsedUser);

    // fetch tasks
    const fetchTasks = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/tasks/my-tasks/${parsedUser.id}`);
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [router]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    
    const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const SkeletonLoader = () => (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-pulse">
          <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
          <div className="h-6 bg-slate-200 rounded-full w-20"></div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">No tasks assigned</h3>
      <p className="text-slate-500 text-center max-w-md">You're all caught up! New tasks will appear here when they're assigned to you.</p>
    </div>
  );

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m6-6V9a6 6 0 10-12 0v2" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-600">You do not have access. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 shadow-sm">
        {/* User Profile Section */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {user?.name?.charAt(0).toUpperCase() || 'D'}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-slate-900 truncate">
                Dr. {user?.name || 'Doctor'}
              </h2>
              <p className="text-sm text-slate-500 truncate">{user?.email || 'doctor@hospital.com'}</p>
            </div>
          </div>
        </div>

        {/* Brand Section */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700">MedPanel</h3>
              <p className="text-xs text-slate-500">Medical Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="p-6">
          <ul className="space-y-2">
            <li>
              <a className="flex items-center space-x-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 7l4-4l4 4m0 5h.01M8 12h.01" />
                </svg>
                <span className="font-medium">Dashboard</span>
              </a>
            </li>
            <li>
              <a className="flex items-center space-x-3 text-blue-600 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span>My Tasks</span>
              </a>
            </li>
            <li>
              <a className="flex items-center space-x-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">Settings</span>
              </a>
            </li>
          </ul>
          
          {/* User Actions */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <button className="w-full flex items-center space-x-3 text-slate-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
                <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                  {user?.role?.toUpperCase() || 'DOCTOR'}
                </div>
              </div>
              <p className="text-slate-600">
                Welcome back, Dr. {user?.name || 'Doctor'}! Manage your assigned medical tasks and responsibilities
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-500">
                {!loading && (
                  <div className="flex items-center space-x-2">
                    <span className="bg-slate-100 px-3 py-1 rounded-full">
                      {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  </div>
                )}
              </div>
              {user?.image && (
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {loading ? (
            <SkeletonLoader />
          ) : tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {task.title}
                    </h3>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {task.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {getStatusBadge(task.status)}
                    <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-blue-400 transition-colors"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}