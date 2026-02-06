import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  LayoutGrid,
  Filter,
  Users,
  User,
  X,
  Music,
  Palette,
  Trophy,
  Target,
  Sparkles,
  BookOpen,
  Utensils,
  Gamepad2,
  Code,
  Camera,
  Film,
  Mic,
  Heart,
  Globe,
  Briefcase,
  ShoppingBag,
  Star,
  Zap,
  Feather,
  Coffee,
  Cpu,
  Hash,
} from "lucide-react";
import { api } from "../../api/axios";

const EventsSidebar = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeCategory = searchParams.get("filter");
  const activeType = searchParams.get("type"); // team | solo

  useEffect(() => {
    api.get("/category/get").then((res) => {
      setCategories(res.data.data || []);
    });
  }, []);

  // Function to get appropriate icon for each category
  const getCategoryIcon = (categoryName) => {
    if (!categoryName) return Hash;
    
    const lowerName = categoryName.toLowerCase();
    
    // Icon mapping based on category names
    const iconMap = {
      // Music & Performing Arts
      'music': Music,
      'concert': Music,
      'dance': Sparkles,
      'performance': Sparkles,
      'singing': Mic,
      
      // Visual Arts
      'art': Palette,
      'painting': Palette,
      'drawing': Feather,
      'photography': Camera,
      'film': Film,
      'exhibition': Palette,
      'fine arts': Palette,
      
      // Sports
      'sports': Trophy,
      'sport': Trophy,
      'athletics': Trophy,
      'game': Gamepad2,
      'gaming': Gamepad2,
      
      // Technical
      'technical': Target,
      'tech': Target,
      'coding': Code,
      'programming': Code,
      'hackathon': Code,
      'workshop': Target,
      'technology': Cpu,
      
      // Cultural
      'cultural': Sparkles,
      'culture': Sparkles,
      'festival': Sparkles,
      'traditional': Sparkles,
      
      // Literary
      'literary': BookOpen,
      'writing': BookOpen,
      'debate': Mic,
      'poetry': Feather,
      'seminar': BookOpen,
      'conference': Users,
      
      // Food & Hospitality
      'food': Utensils,
      'culinary': Utensils,
      'cooking': Utensils,
      'hotel': Coffee,
      'hospitality': Coffee,
      'management': Briefcase,
      
      // General/Business
      'business': Briefcase,
      'entrepreneurship': Briefcase,
      'marketing': ShoppingBag,
      'finance': Hash,
      
      // Other
      'other': Star,
      'general': Globe,
      'favorite': Heart,
      'special': Zap,
    };

    // Check for exact matches first
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerName === key) {
        return icon;
      }
    }

    // Check for partial matches
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerName.includes(key) || key.includes(lowerName)) {
        return icon;
      }
    }

    // Check for common keywords
    if (lowerName.includes('music') || lowerName.includes('song')) return Music;
    if (lowerName.includes('art') || lowerName.includes('design')) return Palette;
    if (lowerName.includes('sport') || lowerName.includes('game')) return Trophy;
    if (lowerName.includes('tech') || lowerName.includes('code')) return Target;
    if (lowerName.includes('culture') || lowerName.includes('fest')) return Sparkles;
    if (lowerName.includes('book') || lowerName.includes('write')) return BookOpen;
    if (lowerName.includes('food') || lowerName.includes('cook')) return Utensils;

    return Hash; // Default icon
  };

  const updateParams = (params) => {
    const sp = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) sp.set(key, value);
      else sp.delete(key);
    });
    navigate(`/events?${sp.toString()}`);
  };

  // Clear all filters
  const clearAllFilters = () => {
    navigate("/events");
  };

  return (
    <div className="relative">
      {/* Fixed Sidebar Container */}
      <div className="fixed top-0 left-0 h-screen w-72 border-r border-white/10 bg-linear-to-r from-[#4606a5] to-[#291252] overflow-hidden z-40 max-md:hidden">
        {/* Scrollable Content Area */}
        <div className="h-full flex flex-col">
          {/* Header - Fixed */}
          <div className="px-6 pt-8 pb-6 border-b border-white/10 bg-linear-to-b from-[#0a051a] to-[#120a2e]">
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-2">
              <Filter className="text-purple-400" size={24} />
              <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                FILTERS
              </span>
            </h2>
            <p className="text-gray-400 text-sm">
              Filter events by category and type
            </p>
            
            {/* Clear all button */}
            {(activeCategory || activeType) && (
              <button
                onClick={clearAllFilters}
                className="mt-4 flex items-center gap-2 px-3 py-1.5 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-full border border-red-500/30 transition-all w-full justify-center group"
              >
                <X size={14} className="group-hover:rotate-90 transition-transform" />
                Clear All Filters
              </button>
            )}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 no-scrollbar">

            {/* EVENT TYPE SECTION */}
            <div className="mb-10">
              <h3 className="flex items-center gap-3 text-lg font-semibold mb-4 text-white">
                <Users className="text-blue-400" size={20} />
                Event Type
              </h3>

              <ul className="space-y-3">
                <li
                  onClick={() => updateParams({ type: "team" })}
                  className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border group
                    ${
                      activeType === "team"
                        ? "bg-linear-to-r from-blue-500/30 to-blue-600/30 text-blue-300 border-blue-500/50 shadow-lg shadow-blue-500/10"
                        : "hover:bg-white/5 border-white/10 hover:border-blue-500/30"
                    }`}
                >
                  <div className={`p-2 rounded-lg ${activeType === "team" ? "bg-blue-500/20" : "bg-white/10"} group-hover:scale-110 transition-transform`}>
                    <Users size={18} />
                  </div>
                  <span className="font-medium">Team Events</span>
                  {activeType === "team" && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                  )}
                </li>

                <li
                  onClick={() => updateParams({ type: "solo" })}
                  className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border group
                    ${
                      activeType === "solo"
                        ? "bg-linear-to-r from-green-500/30 to-green-600/30 text-green-300 border-green-500/50 shadow-lg shadow-green-500/10"
                        : "hover:bg-white/5 border-white/10 hover:border-green-500/30"
                    }`}
                >
                  <div className={`p-2 rounded-lg ${activeType === "solo" ? "bg-green-500/20" : "bg-white/10"} group-hover:scale-110 transition-transform`}>
                    <User size={18} />
                  </div>
                  <span className="font-medium">Solo Events</span>
                  {activeType === "solo" && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  )}
                </li>

                {/* Clear Type Filter */}
                {activeType && (
                  <li
                    onClick={() => updateParams({ type: null })}
                    className="flex items-center gap-3 cursor-pointer px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 group"
                  >
                    <X size={16} className="group-hover:rotate-90 transition-transform" />
                    Clear Type Filter
                  </li>
                )}
              </ul>
            </div>

            {/* CATEGORIES SECTION */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-3 text-lg font-semibold text-white">
                  <LayoutGrid className="text-purple-400" size={20} />
                  Categories
                </h3>
                <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                  {categories.length} categories
                </span>
              </div>

              {/* ALL EVENTS */}
              <div
                onClick={() => navigate("/events")}
                className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border mb-4 group
                  ${
                    !activeCategory
                      ? "bg-linear-to-r from-purple-500/30 to-pink-500/30 text-white border-purple-500/50 shadow-lg shadow-purple-500/10"
                      : "hover:bg-white/5 border-white/10 hover:border-purple-500/30"
                  }`}
              >
                <div className={`p-2 rounded-lg ${!activeCategory ? "bg-purple-500/20" : "bg-white/10"} group-hover:scale-110 transition-transform`}>
                  <LayoutGrid size={18} />
                </div>
                <span className="font-medium">All Events</span>
                {!activeCategory && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                )}
              </div>

              {/* CATEGORY LIST */}
              <ul className="space-y-2">
                {categories.map((cat) => {
                  const Icon = getCategoryIcon(cat.name);
                  const isActive = activeCategory === cat._id;
                  
                  return (
                    <li
                      key={cat._id}
                      onClick={() => updateParams({ filter: cat._id })}
                      className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border group
                        ${
                          isActive
                            ? "bg-linear-to-r from-purple-500/30 to-blue-500/30 text-white border-purple-500/50 shadow-lg shadow-purple-500/10"
                            : "hover:bg-white/5 border-white/10 hover:border-purple-500/30"
                        }`}
                    >
                      <div className={`p-2 rounded-lg ${isActive ? "bg-purple-500/20" : "bg-white/10"} group-hover:scale-110 transition-transform`}>
                        <Icon size={18} className={isActive ? "text-purple-300" : "text-gray-400"} />
                      </div>
                      <span className="font-medium flex-1 truncate">{cat.name}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Clear Category Filter */}
              {activeCategory && (
                <div
                  onClick={() => updateParams({ filter: null })}
                  className="mt-4 flex items-center gap-3 cursor-pointer px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 w-full justify-center border border-white/10 hover:border-purple-500/30 group"
                >
                  <X size={16} className="group-hover:rotate-90 transition-transform" />
                  Clear Category Filter
                </div>
              )}
            </div>

            {/* ACTIVE FILTERS INFO */}
            {(activeCategory || activeType) && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Active Filters</h4>
                <div className="space-y-2">
                  {activeCategory && categories.find(c => c._id === activeCategory) && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-full">
                      <span className="text-xs text-purple-300">
                        Category: {categories.find(c => c._id === activeCategory)?.name}
                      </span>
                    </div>
                  )}
                  {activeType && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full">
                      <span className="text-xs text-blue-300">
                        Type: {activeType === 'team' ? 'Team Events' : 'Solo Events'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FOOTER */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-500">
                {activeCategory || activeType 
                  ? "Filters are saved in the URL. Share the link to preserve your selections."
                  : "Select filters to narrow down event listings"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for main content */}
      <div className="w-72 hidden md:block"></div>
    </div>
  );
};

export default EventsSidebar;