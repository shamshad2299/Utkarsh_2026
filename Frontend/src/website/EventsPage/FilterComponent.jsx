import { useState, useEffect } from 'react';
import { 
  Music, 
  Film, 
  Camera, 
  Palette, 
  Code, 
  Gamepad2, 
  BookOpen,
  Heart,
  Filter
} from 'lucide-react';

const FilterComponent = () => {
  // Filter options with icons and labels
  const filterOptions = [
    { id: 'all', label: 'All', icon: Filter, color: 'from-purple-500 to-pink-500' },
    { id: 'music', label: 'Music', icon: Music, color: 'from-blue-500 to-cyan-500' },
    { id: 'film', label: 'Film & Video', icon: Film, color: 'from-red-500 to-orange-500' },
    { id: 'photography', label: 'Photography', icon: Camera, color: 'from-green-500 to-emerald-500' },
    { id: 'art', label: 'Art', icon: Palette, color: 'from-yellow-500 to-amber-500' },
    { id: 'tech', label: 'Technology', icon: Code, color: 'from-indigo-500 to-purple-500' },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'from-pink-500 to-rose-500' },
    { id: 'writing', label: 'Writing', icon: BookOpen, color: 'from-teal-500 to-green-500' },
    { id: 'favorites', label: 'Favorites', icon: Heart, color: 'from-rose-500 to-red-500' },
  ];

  // Initialize selectedFilter from URL or default to 'all'
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Function to update URL with filter ID
  const updateURL = (filterId) => {
    const newURL = new URL(window.location);
    
    if (filterId === 'all') {
      // Remove filter parameter if 'all' is selected
      newURL.searchParams.delete('filter');
    } else {
      // Set filter parameter
      newURL.searchParams.set('filter', filterId);
    }
    
    // Update URL without page reload
    window.history.pushState({}, '', newURL);
  };

  // Function to handle filter click
  const handleFilterClick = (filterId) => {
    setSelectedFilter(filterId);
    updateURL(filterId);
    
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('filterChange', { detail: filterId }));
  };

  // Initialize from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    
    if (filterParam && filterOptions.some(filter => filter.id === filterParam)) {
      setSelectedFilter(filterParam);
    } else {
      setSelectedFilter('all');
    }
  }, []);

  // Function to get gradient color based on filter label
  const getCategoryColor = (label) => {
    const filter = filterOptions.find(f => f.label === label);
    return filter ? filter.color : 'from-purple-500 to-pink-500';
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Filters</h1>
          <div className="flex items-center gap-4">
            <div className="text-gray-400 font-mono text-lg">31.06 × 31.14</div>
            <div className="flex items-center gap-1">
              {[...Array(7)].map((_, i) => (
                <Music key={i} size={16} className="text-purple-400" />
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Filter Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Filter size={24} className="text-purple-400" />
            <h2 className="text-2xl font-bold text-white">FILTER</h2>
            <span className="text-gray-400 text-sm">
              ({filterOptions.length - 1} categories)
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {filterOptions.map((filter) => {
              const Icon = filter.icon;
              const isActive = selectedFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilterClick(filter.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300
                    ${
                      isActive
                        ? `bg-gradient-to-r ${filter.color} text-white shadow-lg shadow-purple-500/25`
                        : "bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
                    }
                    border ${isActive ? "border-transparent" : "border-white/10"}
                    min-w-[100px] justify-center
                    hover:scale-105 active:scale-95
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

        {/* Selected Filter Display */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-white">Active Filter</h3>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getCategoryColor(
              filterOptions.find(f => f.id === selectedFilter)?.label || 'All'
            )}`}>
              {(() => {
                const Icon = filterOptions.find(f => f.id === selectedFilter)?.icon || Filter;
                return <Icon size={16} className="text-white" />;
              })()}
              <span className="font-medium text-white">
                {filterOptions.find(f => f.id === selectedFilter)?.label || 'All'}
              </span>
            </div>
            
            <div className="text-gray-400">
              <div className="text-sm">Current URL:</div>
              <div className="font-mono text-white/80 bg-black/30 px-3 py-1 rounded">
                {window.location.origin}{window.location.pathname}
                {selectedFilter !== 'all' ? `?filter=${selectedFilter}` : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-gray-400 text-sm max-w-3xl">
          <p className="mb-2">• Click any filter button to update the URL with the filter ID</p>
          <p className="mb-2">• The "All" filter will remove the filter parameter from the URL</p>
          <p className="mb-2">• Try refreshing the page - the selected filter will persist via URL</p>
          <p>• Share the URL with others to pass along your filter selection</p>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;