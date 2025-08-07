import React from 'react';
import { Filter } from '../types';

interface FilterButtonsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ selectedFilter, onFilterChange }) => {
  const filters: Filter[] = [
    { name: 'Doctors', value: 'Doctors' },
    { name: 'Doctors', value: 'Doctors2' },
    { name: 'Doctors', value: 'Doctors3' },
    { name: 'ALL', value: 'ALL' }
  ];

  return (
    <div className="flex items-center space-x-3 overflow-x-auto pb-2">
      {filters.map((filter, index) => (
        <button
          key={`${filter.value}-${index}`}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 lg:px-6 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
            selectedFilter === filter.value
              ? 'bg-gray-100 text-gray-900 border border-gray-200'
              : filter.name === 'Doctors'
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
          } shadow-sm hover:shadow-md transform hover:-translate-y-0.5`}
        >
          {filter.name}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;