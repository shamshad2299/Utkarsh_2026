import React from 'react';
import { Users } from 'lucide-react';

const EventTypeFilter = ({ 
  selectedTypeFilter, 
  handleTypeFilterClick, 
  typeFilterOptions,
  getTypeFilterColor 
}) => {
  return (
    <div className="w-full md:w-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Filter Label and Active Indicator */}
        <div className="flex items-center gap-3">
          <Users size={24} className="text-blue-400" />
          <div className="flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold text-white">EVENT TYPE</h2>
            <span className="text-gray-400 text-xs sm:text-sm">
              Filter by participation
            </span>
          </div>
          {selectedTypeFilter !== 'all' && (
            <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full hidden sm:block">
              <span className="text-sm text-blue-300">
                {typeFilterOptions.find(f => f.id === selectedTypeFilter)?.label}
              </span>
            </div>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {typeFilterOptions.map((filter) => {
            const Icon = filter.icon;
            const isActive = selectedTypeFilter === filter.id;

            return (
              <button
                key={filter.id}
                onClick={() => handleTypeFilterClick(filter.id)}
                className={`
                  flex items-center gap-2 px-3 cursor-pointer sm:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-300
                  ${
                    isActive
                      ? `bg-linear-to-r ${getTypeFilterColor(filter.id)} text-white shadow-lg shadow-blue-500/25`
                      : "bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
                  }
                  border ${isActive ? "border-transparent" : "border-white/10"}
                  min-w-[80px] sm:min-w-[100px] justify-center hover:scale-105 active:scale-95 flex-1 sm:flex-none
                `}
              >
                <Icon size={14} className="sm:size-[16px]" />
                <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
                  {filter.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Mobile Active Filter Indicator */}
      {selectedTypeFilter !== 'all' && (
        <div className="mt-3 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full w-fit sm:hidden">
          <span className="text-sm text-blue-300">
            Active: {typeFilterOptions.find(f => f.id === selectedTypeFilter)?.label}
          </span>
        </div>
      )}
    </div>
  );
};

export default EventTypeFilter;