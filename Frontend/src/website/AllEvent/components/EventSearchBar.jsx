import React from 'react';
import { Search, X } from 'lucide-react';

const EventSearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex-1 md:max-w-lg">
      <div className="relative">
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white" 
          size={20} 
        />
        <input
          type="text"
          placeholder="Search events by title, description, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-10 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default EventSearchBar;