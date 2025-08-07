import { useState, ChangeEvent } from 'react';

const TopBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-100 p-4 lg:p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Workflow</h1>
        
        <div className="flex items-center space-x-4 flex-wrap">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search Staff..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-64 lg:w-80 pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
            />
          </div>
          
          <button className="bg-black text-white px-4 lg:px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform">
            Create New Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;