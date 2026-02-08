import React from "react";
import { Filter } from "lucide-react";

const CategoryFilter = ({
  selectedFilter,
  handleCategoryFilterClick,
  filterOptions,
}) => {
  const allFilter = filterOptions.find(f => f.id === "all");
  const categoryFilters = filterOptions.filter(f => f.id !== "all");

  return (
    <div className="w-full  py-4 sm:py-6  rounded-xl sm:rounded-2xl">
      
      {/* Heading with icon */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 sm:p-2.5 rounded-lg bg-[#6d5bd0]/20">
          <Filter size={18} sm:size={20} lg:size={24} className="text-white" />
        </div>
        <h2 className="text-white text-lg sm:text-xl lg:text-2xl font-semibold milonga">
          Filter by Category
        </h2>
      </div>

      {/* Responsive grid layout - adjusts based on screen size */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-3 sm:gap-4">
        {/* "All" filter */}
        <button
          onClick={() => handleCategoryFilterClick("all")}
          className={`
            w-full aspect-square
            bg-white rounded-xl sm:rounded-2xl
            flex flex-col items-center justify-center
            transition-all duration-300
            border-2
            ${selectedFilter === "all"
              ? "border-[#6d5bd0] bg-[#6d5bd0]/10 shadow-lg scale-105"
              : "border-gray-200 hover:border-[#6d5bd0] hover:scale-105 hover:shadow-md"}
          `}
        >
          {/* All icon */}
          <div className="mb-2 sm:mb-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#e9e6ff] to-[#d4d0ff] flex items-center justify-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-[#6d5bd0] to-[#8a68ff]" />
            </div>
          </div>

          {/* Label */}
          <span className="text-sm sm:text-base font-semibold text-[#3a2f7a] text-center px-1">
            All
          </span>
        </button>

        {/* Category filters */}
        {categoryFilters.map((filter) => {
          const isActive = selectedFilter === filter.id;

          return (
            <button
              key={filter.id}
              onClick={() => handleCategoryFilterClick(filter.id)}
              className={`
                w-full aspect-square
                bg-white rounded-xl sm:rounded-2xl
                flex flex-col items-center justify-center
                transition-all duration-300
                border-2 relative
                ${isActive
                  ? "border-[#6d5bd0] bg-[#6d5bd0]/10 shadow-lg scale-105"
                  : "border-gray-200 hover:border-[#6d5bd0] hover:scale-105 hover:shadow-md"}
              `}
            >
              {/* Illustration / icon */}
              <div className="mb-2 sm:mb-3">
                {filter.image ? (
                  <img
                    src={filter.image}
                    alt={filter.label}
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
                  />
                ) : filter.icon ? (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#e9e6ff] to-[#d4d0ff] flex items-center justify-center">
                    {React.createElement(filter.icon, { 
                      size: 24, 
                      sm: 28,
                      md: 32,
                      className: "text-[#6d5bd0]" 
                    })}
                  </div>
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#e9e6ff] to-[#d4d0ff] flex items-center justify-center">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-[#6d5bd0]" />
                  </div>
                )}
              </div>

              {/* Label */}
              <span className="text-sm sm:text-base font-semibold text-[#3a2f7a] text-center capitalize px-1 truncate w-full">
                {filter.label}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute top-2 right-2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#6d5bd0] animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active filter indicator */}
      {selectedFilter && selectedFilter !== "all" && (
        <div className="mt-6 sm:mt-8 flex items-center justify-center">
          <div className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-[#6d5bd0] to-[#8a68ff] rounded-full text-white text-sm sm:text-base flex items-center gap-3">
            <span>Active Filter:</span>
            <span className="font-semibold">
              {categoryFilters.find(f => f.id === selectedFilter)?.label || selectedFilter}
            </span>
            <button 
              onClick={() => handleCategoryFilterClick("all")}
              className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Clear filter"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;