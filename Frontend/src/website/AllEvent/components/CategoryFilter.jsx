import React, { useMemo, useCallback } from "react";
import { Filter } from "lucide-react";

// Constants
const FILTER_BUTTON_CLASSES = {
  base: "w-full aspect-square bg-white rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2 cursor-pointer",
  active: "border-[#6d5bd0] bg-[#6d5bd0]/10 shadow-lg scale-105",
  inactive: "border-gray-200 hover:border-[#6d5bd0] hover:scale-105 hover:shadow-md",
};

const ICON_SIZES = {
  container: {
    base: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
  },
  icon: {
    base: "w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10",
  },
  lucide: 24,
};

// Memoized icon components
const DefaultIcon = React.memo(({ size = "md" }) => (
  <div className={`${ICON_SIZES.container.base} rounded-full bg-linear-to-br from-[#e9e6ff] to-[#d4d0ff] flex items-center justify-center`}>
    <div className={`${ICON_SIZES.icon.base} rounded-full bg-linear-to-r from-[#6d5bd0] to-[#8a68ff]`} />
  </div>
));

const AllIcon = React.memo(() => (
  <div className={`${ICON_SIZES.container.base} rounded-full bg-linear-to-br from-[#e9e6ff] to-[#d4d0ff] flex items-center justify-center`}>
    <div className={`${ICON_SIZES.icon.base} rounded-full bg-linear-to-r from-[#6d5bd0] to-[#8a68ff]`} />
  </div>
));

const FilterIcon = React.memo(({ icon: Icon }) => (
  <div className={`${ICON_SIZES.container.base} rounded-full bg-linear-to-br from-[#e9e6ff] to-[#d4d0ff] flex items-center justify-center`}>
    <Icon size={ICON_SIZES.lucide} className="text-[#6d5bd0]" />
  </div>
));

const CategoryFilterButton = React.memo(({ 
  filter, 
  isActive, 
  onClick 
}) => {
  const handleClick = useCallback(() => {
    onClick(filter.id);
  }, [filter.id, onClick]);

  const buttonClasses = useMemo(() => 
    `${FILTER_BUTTON_CLASSES.base} ${isActive ? FILTER_BUTTON_CLASSES.active : FILTER_BUTTON_CLASSES.inactive}`,
    [isActive]
  );

  return (
    <button
      onClick={handleClick}
      className={buttonClasses}
      aria-pressed={isActive}
      aria-label={`Filter by ${filter.label}`}
    >
      {/* Icon / Illustration */}
      <div className="mb-2 sm:mb-3">
        {filter.image ? (
          <img
            src={filter.image}
            alt={filter.label}
            className={`${ICON_SIZES.container.base} object-contain`}
            loading="lazy"
          />
        ) : filter.icon ? (
          <FilterIcon icon={filter.icon} />
        ) : (
          <DefaultIcon />
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
});

CategoryFilterButton.displayName = 'CategoryFilterButton';

const CategoryFilter = ({
  selectedFilter = "all",
  handleCategoryFilterClick,
  filterOptions = [],
}) => {
  // Memoize filter options
  const { allFilter, categoryFilters } = useMemo(() => {
    const all = filterOptions.find(f => f.id === "all");
    const categories = filterOptions.filter(f => f.id !== "all");
    return { allFilter: all, categoryFilters: categories };
  }, [filterOptions]);

  // Memoize active filter label
  const activeFilterLabel = useMemo(() => 
    categoryFilters.find(f => f.id === selectedFilter)?.label || selectedFilter,
    [categoryFilters, selectedFilter]
  );

  // Memoize click handlers
  const handleAllFilterClick = useCallback(() => {
    handleCategoryFilterClick("all");
  }, [handleCategoryFilterClick]);

  const handleClearFilterClick = useCallback(() => {
    handleCategoryFilterClick("all");
  }, [handleCategoryFilterClick]);

  // Don't render if no filter options
  if (!filterOptions.length) {
    return null;
  }

  return (
    <div className="w-full py-4 sm:py-6 rounded-xl sm:rounded-2xl">
      {/* Heading with icon */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 sm:p-2.5 rounded-lg bg-[#6d5bd0]/20">
          <Filter 
            size={ICON_SIZES.lucide} 
            className="text-white" 
            aria-hidden="true"
          />
        </div>
        <h2 className="text-white text-lg sm:text-xl lg:text-2xl font-semibold milonga">
          Filter by Category
        </h2>
      </div>

      {/* Responsive grid layout */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-3 sm:gap-4 ">
        {/* "All" filter */}
        <button
          onClick={handleAllFilterClick}
          className={`
            
            ${FILTER_BUTTON_CLASSES.base}
            ${selectedFilter === "all" ? FILTER_BUTTON_CLASSES.active : FILTER_BUTTON_CLASSES.inactive}
          `}
          aria-pressed={selectedFilter === "all"}
          aria-label="Show all events"
        >
          {/* All icon */}
          <div className="mb-2 sm:mb-3">
            <AllIcon />
          </div>

          {/* Label */}
          <span className="text-sm sm:text-base font-semibold text-[#3a2f7a] text-center px-1">
            All
          </span>
        </button>

        {/* Category filters */}
        {categoryFilters.map((filter) => (
          <CategoryFilterButton
            key={filter.id}
            filter={filter}
            isActive={selectedFilter === filter.id}
            onClick={handleCategoryFilterClick}
          />
        ))}
      </div>

      {/* Active filter indicator */}
      {selectedFilter && selectedFilter !== "all" && (
        <div className="mt-6 sm:mt-8 flex items-center justify-center">
          <div className="px-4 py-2 sm:px-5 sm:py-2.5 bg-linear-to-r from-[#6d5bd0] to-[#8a68ff] rounded-full text-white text-sm sm:text-base flex items-center gap-3 shadow-lg">
            <span className="text-white/90">Active Filter:</span>
            <span className="font-semibold text-white">
              {activeFilterLabel}
            </span>
            <button 
              onClick={handleClearFilterClick}
              className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
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

// Memoize the entire component
export default React.memo(CategoryFilter);