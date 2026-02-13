import { useEffect, useState, useCallback, useMemo } from "react";
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

// Icon mapping - moved outside component for better performance
const ICON_MAP = {
  // Music & Performing Arts
  music: Music,
  concert: Music,
  dance: Sparkles,
  performance: Sparkles,
  singing: Mic,
  // Visual Arts
  art: Palette,
  painting: Palette,
  drawing: Feather,
  photography: Camera,
  film: Film,
  exhibition: Palette,
  "fine arts": Palette,
  // Sports
  sports: Trophy,
  sport: Trophy,
  athletics: Trophy,
  game: Gamepad2,
  gaming: Gamepad2,
  // Technical
  technical: Target,
  tech: Target,
  coding: Code,
  programming: Code,
  hackathon: Code,
  workshop: Target,
  technology: Cpu,
  // Cultural
  cultural: Sparkles,
  culture: Sparkles,
  festival: Sparkles,
  traditional: Sparkles,
  // Literary
  literary: BookOpen,
  writing: BookOpen,
  debate: Mic,
  poetry: Feather,
  seminar: BookOpen,
  conference: Users,
  // Food & Hospitality
  food: Utensils,
  culinary: Utensils,
  cooking: Utensils,
  hotel: Coffee,
  hospitality: Coffee,
  management: Briefcase,
  // General/Business
  business: Briefcase,
  entrepreneurship: Briefcase,
  marketing: ShoppingBag,
  finance: Hash,
  // Other
  other: Star,
  general: Globe,
  favorite: Heart,
  special: Zap,
};

const getCategoryIcon = (categoryName) => {
  if (!categoryName) return Hash;
  const lowerName = categoryName.toLowerCase();

  // Exact matches
  if (ICON_MAP[lowerName]) return ICON_MAP[lowerName];

  // Partial matches
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return icon;
    }
  }

  // Common keyword matches
  if (lowerName.includes("music") || lowerName.includes("song")) return Music;
  if (lowerName.includes("art") || lowerName.includes("design")) return Palette;
  if (lowerName.includes("sport") || lowerName.includes("game")) return Trophy;
  if (lowerName.includes("tech") || lowerName.includes("code")) return Target;
  if (lowerName.includes("culture") || lowerName.includes("fest")) return Sparkles;
  if (lowerName.includes("book") || lowerName.includes("write")) return BookOpen;
  if (lowerName.includes("food") || lowerName.includes("cook")) return Utensils;

  return Hash;
};

const EventsSidebar = () => {
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeCategory = searchParams.get("filter");
  const activeType = searchParams.get("type");

  useEffect(() => {
    fetchCategories();
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // FIXED: Prevent body scroll WITHOUT affecting layout
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Add padding to compensate for scrollbar removal
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }
    
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isMobileMenuOpen]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category/get");
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const updateParams = useCallback((params) => {
    const sp = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) sp.set(key, value);
      else sp.delete(key);
    });
    navigate(`/events?${sp.toString()}`);
    setIsMobileMenuOpen(false);
  }, [navigate, searchParams]);

  const clearAllFilters = useCallback(() => {
    navigate("/events");
    setIsMobileMenuOpen(false);
  }, [navigate]);

  const activeCategoryData = useMemo(() => 
    categories.find((c) => c._id === activeCategory),
    [categories, activeCategory]
  );

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // Sidebar content component - WHITE BACKGROUND
  const SidebarContent = ({ isMobile = false, onClose }) => (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 border-b border-black/30 bg-gradient-to-b from-[#C8ABFE] to-[#b18cff] relative">
        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X size={24} className="text-[#2b123f]" />
          </button>
        )}
        
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
            className="mt-4 relative flex items-center gap-2 px-5 py-2 text-sm font-medium 
              bg-gradient-to-r from-red-500/20 via-pink-500/20 to-red-500/20
              hover:from-red-500 hover:to-pink-500
              text-red-100 hover:text-white
              rounded-full border border-red-500/40
              backdrop-blur-md
              transition-all duration-300 ease-in-out
              w-full justify-center group overflow-hidden cursor-pointer"
          >
            <span className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
            <X
              size={16}
              className="relative group-hover:rotate-180 group-hover:scale-110 transition-all duration-300"
            />
            <span className="relative tracking-wide">Clear All Filters</span>
          </button>
        )}
      </div>

      {/* Scrollable Content - WHITE BACKGROUND */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-[#4b1b7a]/20 scrollbar-track-transparent bg-white">
        {/* EVENT TYPE SECTION */}
        <div className="mb-10">
          <h3 className="flex items-center gap-3 text-lg font-semibold mb-4 text-[#2b123f] milonga">
            <Users className="text-[#4b1b7a]" size={20} />
            Event Type
          </h3>

          <ul className="space-y-3">
            <li
              onClick={() => updateParams({ type: "team" })}
              className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border-2 group bg-white
                ${
                  activeType === "team"
                    ? "bg-gradient-to-r from-[#4b1b7a]/30 to-[#6b2bb9]/30 text-[#2b123f] border-[#4b1b7a] shadow-lg shadow-purple-500/10"
                    : "hover:bg-white/80 bg-white border-black/30 hover:border-[#4b1b7a]"
                }`}
            >
              <div
                className={`p-2 rounded-lg ${activeType === "team" ? "bg-[#4b1b7a]/20" : "bg-white"} group-hover:scale-110 transition-transform`}
              >
                <Users
                  size={18}
                  className={
                    activeType === "team"
                      ? "text-[#4b1b7a]"
                      : "text-[#2b123f]"
                  }
                />
              </div>
              <span className="font-medium text-[#2b123f]">
                Team Events
              </span>
              {activeType === "team" && (
                <div className="ml-auto w-2 h-2 rounded-full bg-[#4b1b7a] animate-pulse"></div>
              )}
            </li>

            <li
              onClick={() => updateParams({ type: "solo" })}
              className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border-2 group bg-white
                ${
                  activeType === "solo"
                    ? "bg-gradient-to-r from-green-500/30 to-green-600/30 text-green-600 border-green-500 shadow-lg shadow-green-500/10"
                    : "hover:bg-white/80 bg-white border-black/30 hover:border-green-500"
                }`}
            >
              <div
                className={`p-2 rounded-lg ${activeType === "solo" ? "bg-green-500/20" : "bg-white"} group-hover:scale-110 transition-transform`}
              >
                <User
                  size={18}
                  className={
                    activeType === "solo"
                      ? "text-green-600"
                      : "text-[#2b123f]"
                  }
                />
              </div>
              <span className="font-medium text-[#2b123f]">
                Solo Events
              </span>
              {activeType === "solo" && (
                <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              )}
            </li>

            {/* Clear Type Filter */}
            {activeType && (
              <li
                onClick={() => updateParams({ type: null })}
                className="flex items-center gap-3 cursor-pointer px-4 py-2 text-sm text-[#2b123f]/80 hover:text-[#2b123f] hover:bg-white/80 rounded-lg transition-all duration-200 border-2 border-black/30 group bg-white"
              >
                <X
                  size={16}
                  className="group-hover:rotate-90 transition-transform"
                />
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
            onClick={() => updateParams({ filter: null })}
            className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border-2 mb-4 group bg-white
              ${
                !activeCategory
                  ? "bg-gradient-to-r from-[#4b1b7a]/30 to-[#6b2bb9]/30 text-[#2b123f] border-[#4b1b7a] shadow-lg shadow-purple-500/10"
                  : "hover:bg-white/80 bg-white border-black/30 hover:border-[#4b1b7a]"
              }`}
          >
            <div
              className={`p-2 rounded-lg ${!activeCategory ? "bg-[#4b1b7a]/20" : "bg-white"} group-hover:scale-110 transition-transform`}
            >
              <LayoutGrid
                size={18}
                className={
                  !activeCategory ? "text-[#4b1b7a]" : "text-[#2b123f]"
                }
              />
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
              const categoryImage = cat.image?.url;

              return (
                <li
                  key={cat._id}
                  onClick={() => updateParams({ filter: cat._id })}
                  className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 border-2 group bg-white
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[#4b1b7a]/30 to-[#6b2bb9]/30 text-[#2b123f] border-[#4b1b7a] shadow-lg shadow-purple-500/10"
                        : "hover:bg-white/80 bg-white border-black/30 hover:border-[#4b1b7a]"
                    }`}
                >
                  {/* Category Image/Icon */}
                  <div
                    className={`p-1 rounded-lg ${isActive ? "bg-[#4b1b7a]/20" : "bg-white"} group-hover:scale-110 transition-transform w-10 h-10 flex items-center justify-center overflow-hidden flex-shrink-0`}
                  >
                    {categoryImage ? (
                      <img
                        src={categoryImage}
                        alt={cat.name}
                        className="w-full h-full object-cover rounded-md"
                        loading="lazy"
                      />
                    ) : (
                      <Icon
                        size={18}
                        className={
                          isActive ? "text-[#4b1b7a]" : "text-[#2b123f]"
                        }
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
                    <div className="ml-auto w-2 h-2 rounded-full bg-[#4b1b7a] animate-pulse flex-shrink-0"></div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Clear Category Filter */}
          {activeCategory && (
            <div
              onClick={() => updateParams({ filter: null })}
              className="mt-4 flex items-center gap-3 cursor-pointer px-4 py-2 text-sm text-[#2b123f]/80 hover:text-[#2b123f] hover:bg-white/80 rounded-lg transition-all duration-200 w-full justify-center border-2 border-black/30 hover:border-[#4b1b7a] group bg-white"
            >
              <X
                size={16}
                className="group-hover:rotate-90 transition-transform"
              />
              Clear Category Filter
            </div>
          )}
        </div>

        {/* ACTIVE FILTERS INFO */}
        {(activeCategory || activeType) && (
          <div className="mt-8 pt-6 border-t border-black/30">
            <h4 className="text-sm font-medium text-[#2b123f]/80 mb-3 milonga">
              Active Filters
            </h4>
            <div className="space-y-2">
              {activeCategory && activeCategoryData && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#4b1b7a]/20 border border-[#4b1b7a]/30 rounded-full">
                  <span className="text-xs text-[#4b1b7a]">
                    Category: {activeCategoryData.name}
                  </span>
                </div>
              )}
              {activeType && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full">
                  <span className="text-xs text-blue-600">
                    Type: {activeType === "team" ? "Team Events" : "Solo Events"}
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
  );

  return (
    <>
      {/* Mobile Menu Button - Visible only on mobile */}
      <div className="fixed bottom-6 left-6 z-40 md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4b1b7a] to-[#6b2bb9] text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 border-2 border-white/30"
          aria-label="Open filters"
        >
          <Filter size={20} />
          <span className="font-semibold milonga">Filters</span>
          {(activeCategory || activeType) && (
            <span className="w-2 h-2 bg-white rounded-full animate-pulse ml-1"></span>
          )}
        </button>
      </div>

      {/* Mobile Sidebar Overlay - No backdrop blur to prevent movement */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar - Slide from left - WHITE BACKGROUND */}
      <div
        className={`
          fixed top-0 left-0 h-full w-[85%] max-w-[400px] z-50
          transform transition-transform duration-300 ease-in-out
          md:hidden bg-white shadow-2xl
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarContent 
          isMobile={true} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
      </div>

      {/* Desktop Sidebar - Fixed - WHITE BACKGROUND */}
      <div className="hidden md:block relative">
        <div className="fixed top-0 left-0 md:w-64 lg:w-80 mt-20 border-r border-white/10 bg-white overflow-hidden z-30 rounded-tr-3xl rounded-br-3xl border-2 border-dashed border-black/30 h-[calc(100vh-5rem)] shadow-xl">
          <SidebarContent isMobile={false} />
        </div>
        {/* Spacer for desktop layout */}
        <div className="md:w-64 lg:w-80"></div>
      </div>
    </>
  );
};

export default EventsSidebar;