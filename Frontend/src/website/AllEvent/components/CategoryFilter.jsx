import React from 'react';
import { Filter } from 'lucide-react';

const CategoryFilter = ({ 
  selectedFilter, 
  handleCategoryFilterClick, 
  filterOptions,
  getCategoryColor 
}) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Filter size={24} className="text-purple-400" />
        <h2 className="text-2xl font-bold text-white">FILTER BY CATEGORY</h2>
        <span className="text-gray-400 text-sm">
          ({filterOptions.length - 1} categories)
        </span>
        {selectedFilter !== 'all' && (
          <div className="ml-4 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
            <span className="text-sm text-purple-300">
              {filterOptions.find(f => f.id === selectedFilter)?.label}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {filterOptions.map((filter) => {
          const Icon = filter.icon;
          const isActive = selectedFilter === filter.id;

          return (
            <button
              key={filter.id}
              onClick={() => handleCategoryFilterClick(filter.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300
                cursor-pointer
                ${
                  isActive
                    ? `bg-linear-to-r ${getCategoryColor(filter.label)} text-white shadow-lg shadow-purple-500/25`
                    : "bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
                }
                border ${isActive ? "border-transparent" : "border-white/10"}
                min-w-[100px] justify-center hover:scale-105 active:scale-95
              `}
            >
              <Icon size={16} />
              <span className="font-medium text-sm whitespace-nowrap">
                {filter.label.length > 12
                  ? filter.label.substring(0, 10) + "..."
                  : filter.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;