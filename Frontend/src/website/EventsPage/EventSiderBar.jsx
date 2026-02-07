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
  Image as ImageIcon
} from "lucide-react";
import { api } from "../../api/axios";

const EventsSidebar = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeCategory = searchParams.get("filter");
  const activeType = searchParams.get("type"); // team | solo

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category/get");
     
      const categoriesData = res.data.data || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

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
      <div className="fixed top-0 left-0 h-screen w-80 border-r border-white/10 bg-gradient-to-b from-[#eadbff] to-[#b692ff] overflow-hidden z-40 max-md:hidden rounded-tr-3xl rounded-br-3xl border-2 border-dashed border-black/30">
        {/* Scrollable Content Area */}
        <div className="h-full flex flex-col">
          {/* Header - Fixed */}
          <div className="px-6 pt-8 pb-6 border-b border-black/30 bg-gradient-to-b from-[#C8ABFE] to-[#b18cff]">
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-2 text-[#2b123f] milonga">
              <Filter className="text-[#4b1b7a]" size={24} />
              <span>FILTERS</span>
            </h2>
            <p className="text-[#2b123f]/80 text-sm">
              Filter events by category and type
            </p>
            
            {/* Clear all button */}
            {(activeCategory || activeType) && (
              <button
                onClick={clearAllFilters}
                className="mt-4 flex items-center gap-2 px-3 py-1.5 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-600 rounded-full border border-red-500/30 transition-all w-full justify-center group"
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
              <h3 className="flex items-center gap-3 text-lg font-semibold mb-4 text-[#2b123f] milonga">
                <Users className="text-[#4b1b7a]" size={20} />
                Event Type
              </h3>

              <ul className="space-y-3">
                <li
                  onClick={() => updateParams({ type: "team" })}
                  className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border-2 group
                    ${
                      activeType === "team"
                        ? "bg-gradient-to-r from-[#4b1b7a]/30 to-[#6b2bb9]/30 text-[#2b123f] border-[#4b1b7a] shadow-lg shadow-purple-500/10"
                        : "hover:bg-white/80 bg-white/60 border-black/30 hover:border-[#4b1b7a]"
                    }`}
                >
                  <div className={`p-2 rounded-lg ${activeType === "team" ? "bg-[#4b1b7a]/20" : "bg-white"} group-hover:scale-110 transition-transform`}>
                    <Users size={18} className={activeType === "team" ? "text-[#4b1b7a]" : "text-[#2b123f]"} />
                  </div>
                  <span className="font-medium text-[#2b123f]">Team Events</span>
                  {activeType === "team" && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-[#4b1b7a] animate-pulse"></div>
                  )}
                </li>

                <li
                  onClick={() => updateParams({ type: "solo" })}
                  className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border-2 group
                    ${
                      activeType === "solo"
                        ? "bg-gradient-to-r from-green-500/30 to-green-600/30 text-green-600 border-green-500 shadow-lg shadow-green-500/10"
                        : "hover:bg-white/80 bg-white/60 border-black/30 hover:border-green-500"
                    }`}
                >
                  <div className={`p-2 rounded-lg ${activeType === "solo" ? "bg-green-500/20" : "bg-white"} group-hover:scale-110 transition-transform`}>
                    <User size={18} className={activeType === "solo" ? "text-green-600" : "text-[#2b123f]"} />
                  </div>
                  <span className="font-medium text-[#2b123f]">Solo Events</span>
                  {activeType === "solo" && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  )}
                </li>

                {/* Clear Type Filter */}
                {activeType && (
                  <li
                    onClick={() => updateParams({ type: null })}
                    className="flex items-center gap-3 cursor-pointer px-4 py-2 text-sm text-[#2b123f]/80 hover:text-[#2b123f] hover:bg-white/80 rounded-lg transition-all duration-200 border-2 border-black/30 group"
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
                <h3 className="flex items-center gap-3 text-lg font-semibold text-[#2b123f] milonga">
                  <LayoutGrid className="text-[#4b1b7a]" size={20} />
                  Categories
                </h3>
                <span className="text-xs text-[#2b123f]/80 bg-white/60 px-2 py-1 rounded-full border border-black/30">
                  {categories.length} categories
                </span>
              </div>

              {/* ALL EVENTS */}
              <div
                onClick={() => navigate("/events")}
                className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border-2 mb-4 group
                  ${
                    !activeCategory
                      ? "bg-gradient-to-r from-[#4b1b7a]/30 to-[#6b2bb9]/30 text-[#2b123f] border-[#4b1b7a] shadow-lg shadow-purple-500/10"
                      : "hover:bg-white/80 bg-white/60 border-black/30 hover:border-[#4b1b7a]"
                  }`}
              >
                <div className={`p-2 rounded-lg ${!activeCategory ? "bg-[#4b1b7a]/20" : "bg-white"} group-hover:scale-110 transition-transform`}>
                  <LayoutGrid size={18} className={!activeCategory ? "text-[#4b1b7a]" : "text-[#2b123f]"} />
                </div>
                <span className="font-medium text-[#2b123f]">All Events</span>
                {!activeCategory && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-[#4b1b7a] animate-pulse"></div>
                )}
              </div>

              {/* CATEGORY LIST */}
              <ul className="space-y-2">
                {categories.map((cat) => {
                  const Icon = getCategoryIcon(cat.name);
                  const isActive = activeCategory === cat._id;
                  const categoryImage = cat.image.url;
                  
                  return (
                    <li
                      key={cat._id}
                      onClick={() => updateParams({ filter: cat._id })}
                      className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border-2 group
                        ${
                          isActive
                            ? "bg-gradient-to-r from-[#4b1b7a]/30 to-[#6b2bb9]/30 text-[#2b123f] border-[#4b1b7a] shadow-lg shadow-purple-500/10"
                            : "hover:bg-white/80 bg-white/60 border-black/30 hover:border-[#4b1b7a]"
                        }`}
                    >
                      {/* Category Image/Icon */}
                      <div className={`p-1 rounded-lg ${isActive ? "bg-[#4b1b7a]/20" : "bg-white"} group-hover:scale-110 transition-transform w-10 h-10 flex items-center justify-center overflow-hidden`}>
                        {categoryImage ? (
                          <img 
                            src={categoryImage} 
                            alt={cat.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <Icon 
                            size={18} 
                            className={isActive ? "text-[#4b1b7a]" : "text-[#2b123f]"} 
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-[#2b123f] truncate block">
                          {cat.name}
                        </span>
                        {cat.description && (
                          <p className="text-xs text-[#2b123f]/60 truncate">
                            {cat.description}
                          </p>
                        )}
                      </div>
                      
                      {isActive && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-[#4b1b7a] animate-pulse"></div>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Clear Category Filter */}
              {activeCategory && (
                <div
                  onClick={() => updateParams({ filter: null })}
                  className="mt-4 flex items-center gap-3 cursor-pointer px-4 py-2 text-sm text-[#2b123f]/80 hover:text-[#2b123f] hover:bg-white/80 rounded-lg transition-all duration-200 w-full justify-center border-2 border-black/30 hover:border-[#4b1b7a] group"
                >
                  <X size={16} className="group-hover:rotate-90 transition-transform" />
                  Clear Category Filter
                </div>
              )}
            </div>

            {/* ACTIVE FILTERS INFO */}
            {(activeCategory || activeType) && (
              <div className="mt-8 pt-6 border-t border-black/30">
                <h4 className="text-sm font-medium text-[#2b123f]/80 mb-3 milonga">Active Filters</h4>
                <div className="space-y-2">
                  {activeCategory && categories.find(c => c._id === activeCategory) && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#4b1b7a]/20 border border-[#4b1b7a]/30 rounded-full">
                      <span className="text-xs text-[#4b1b7a]">
                        Category: {categories.find(c => c._id === activeCategory)?.name}
                      </span>
                    </div>
                  )}
                  {activeType && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full">
                      <span className="text-xs text-blue-600">
                        Type: {activeType === 'team' ? 'Team Events' : 'Solo Events'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FOOTER */}
            <div className="mt-8 pt-6 border-t border-black/30">
              <p className="text-xs text-[#2b123f]/60">
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