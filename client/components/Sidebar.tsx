import { useState } from 'react';
import Link from 'next/link';
import { MenuItem } from '../types';

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Dashboard');

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      icon: '📊',
      count: 25,
      href: '/'
    },
    {
      name: 'Completed Tasks',
      icon: '✅',
      href: '/completed'
    },
    {
      name: 'Assigned Tasks',
      icon: '📋',
      href: '/assigned'
    },
    {
      name: 'Settings',
      icon: '⚙️',
      href: '/settings'
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#DDE3F4] shadow-lg z-10 transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">✓</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">ClinicTasks</h1>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href}>
                <div
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 group hover:bg-white/30 ${
                    activeItem === item.name ? 'bg-white/40 shadow-sm' : ''
                  }`}
                  onClick={() => setActiveItem(item.name)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <span className={`font-medium ${
                      activeItem === item.name ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {item.name}
                    </span>
                  </div>
                  {item.count && (
                    <span className="bg-gray-500 text-white text-sm px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4">
        <button className="w-full bg-black text-white py-3 px-6 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;