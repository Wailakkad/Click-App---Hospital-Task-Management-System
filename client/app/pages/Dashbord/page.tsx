'use client'

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import TaskCard from '@/components/TaskCard';
import FilterButtons from '@/components/FilterButtons';
import { Task } from '@/types';

const Home: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const tasks: Task[] = [
    {
      id: 1,
      name: 'Nurse John Doe',
      profilePic: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
      title: 'Conduct morning rounds in Ward B',
      time: 'Today, 9:30 AM',
      status: 'In Progress'
    },
    {
      id: 2,
      name: 'Nurse John Doe',
      profilePic: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
      title: 'Deliver blood test results to Dr. Karim',
      time: 'Today, 9:30 AM',
      status: 'Done'
    },
    {
      id: 3,
      name: 'Nurse John Doe',
      profilePic: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
      title: 'Conduct morning rounds in Ward B',
      time: 'Today, 9:30 AM',
      status: 'In Progress'
    },
    {
      id: 4,
      name: 'Nurse John Doe',
      profilePic: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
      title: 'Conduct morning rounds in Ward B',
      time: 'Today, 9:30 AM',
      status: 'In Progress'
    },
    {
      id: 5,
      name: 'Nurse John Doe',
      profilePic: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
      title: 'Conduct morning rounds in Ward B',
      time: 'Today, 9:30 AM',
      status: 'In Progress'
    },
    {
      id: 6,
      name: 'Nurse John Doe',
      profilePic: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
      title: 'Conduct morning rounds in Ward B',
      time: 'Today, 9:30 AM',
      status: 'In Progress'
    },
    {
      id: 7,
      name: 'Nurse John Doe',
      profilePic: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
      title: 'Conduct morning rounds in Ward B',
      time: 'Today, 9:30 AM',
      status: 'In Progress'
    },
    {
      id: 8,
      name: 'Nurse John Doe',
      profilePic: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
      title: 'Conduct morning rounds in Ward B',
      time: 'Today, 9:30 AM',
      status: 'In Progress'
    },
    {
      id: 9,
      name: 'Nurse John Doe',
      profilePic: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
      title: 'Conduct morning rounds in Ward B',
      time: 'Today, 9:30 AM',
      status: 'In Progress'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-64">
        <TopBar />
        <div className="p-4 lg:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Medical Tasks</h2>
            <FilterButtons 
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;