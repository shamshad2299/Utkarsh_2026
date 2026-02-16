import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

// Constants
const SEARCH_PLACEHOLDER =
  "Search events by title, description, or category...";
const ICON_SIZE = 20;
const DEBOUNCE_DELAY = 300; // ms

// Memoized icon components
const SearchIcon = React.memo(() => (
  <Search
    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-gray-400"
    size={ICON_SIZE}
    aria-hidden="true"
  />
));

const ClearButton = React.memo(({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full p-1"
    aria-label="Clear search"
  >
    <X size={ICON_SIZE} />
  </button>
));

// Debounce Hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const EventSearchBar = ({ searchQuery = "", setSearchQuery }) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const isFirstRender = useRef(true);

  const debouncedSearch = useDebounce(localSearch, DEBOUNCE_DELAY);

  // Update parent after debounce
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSearchQuery?.(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  // Sync when parent clears
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = useCallback((e) => {
    setLocalSearch(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setLocalSearch("");
    setSearchQuery?.("");
  }, [setSearchQuery]);

  // ✅ Scroll to Events Section on Enter
 const handleKeyDown = useCallback((e) => {
  if (e.key === "Enter") {
    const eventSection = document.getElementById("events-section");
    if (!eventSection) return;

    eventSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    e.target.value=""
  }
}, []);


  const showClearButton = useMemo(
    () => localSearch && localSearch.length > 0,
    [localSearch]
  );

  return (
    <div className="flex-1 w-full mt-8">
      <div className="relative">
        <SearchIcon />

        <input
          type="text"
          placeholder={SEARCH_PLACEHOLDER}
          value={localSearch}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="
            w-full
            pl-12
            pr-10
            py-3
            bg-white/10
            backdrop-blur-sm
            rounded-xl
            border
            border-white/20
            text-gray-900
            placeholder-gray-500
            focus:outline-none
            focus:ring-2
            focus:ring-purple-500
            focus:border-transparent
            transition-all
            hover:bg-white/20
          "
          aria-label="Search events"
        />

        {showClearButton && <ClearButton onClick={handleClearSearch} />}
      </div>

      {localSearch && (
        <div className="text-xs text-gray-400 mt-2 ml-2">
          Searching for: "{localSearch}"
        </div>
      )}
    </div>
  );
};

export default React.memo(EventSearchBar);
