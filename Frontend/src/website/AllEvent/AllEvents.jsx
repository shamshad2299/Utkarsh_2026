import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Filter, User, Users } from 'lucide-react';
import { api } from '../../api/axios';
import EventSearchBar from './components/EventSearchBar';
import EventTypeFilter from './components/EventTypeFilter';
import CategoryFilter from './components/CategoryFilter';
import EventsGrid from './components/EventsGrid';
import EventDetailModal from './components/EventDetailModal';
import { getFilterFromURL, setFilterToURL } from '../utils/filterUtils';
import {
  getCategoryName,
  getSubCategory,
  getImageUrl,
  getAllImages,
  getCategoryIcon,
  getEventTypeIcon,
  getEventTypeText,
  getEventTypeForFilter,
  formatDate,
  formatTime,
  getCategoryColor,
  getTypeFilterColor
} from '../utils/eventUtils';

const AllEvents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOptions, setFilterOptions] = useState([
    { id: "all", label: "All", icon: Filter },
  ]);

  // Event type filter options
  const typeFilterOptions = [
    { id: "all", label: "All Types", icon: Filter },
    { id: "solo", label: "Solo", icon: User },
    { id: "team", label: "Team", icon: Users },
  ];

  // Modal state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expandedRules, setExpandedRules] = useState({
    general: false,
    event: false,
  });

  // Read filters from URL on initial load
  useEffect(() => {
    const urlCategoryFilter = getFilterFromURL(location, 'filter');
    const urlTypeFilter = getFilterFromURL(location, 'type');
    setSelectedFilter(urlCategoryFilter);
    setSelectedTypeFilter(urlTypeFilter);
  }, [location]);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  useEffect(() => {
    let filtered = allEvents;

    // Apply category filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter((event) => {
        const eventCategoryId = event.category?._id;
        const eventCategoryName = event.category?.name?.toLowerCase() || "";
        return (
          eventCategoryId === selectedFilter ||
          eventCategoryName.includes(selectedFilter.toLowerCase())
        );
      });
    }

    // Apply event type filter
    if (selectedTypeFilter !== "all") {
      filtered = filtered.filter((event) => {
        const eventType = getEventTypeText(event.teamSize, event.eventType).toLowerCase();
        return eventType === selectedTypeFilter.toLowerCase();
      });
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((event) => {
        const title = event.title?.toLowerCase() || "";
        const description = event.description?.toLowerCase() || "";
        const categoryName = event.category?.name?.toLowerCase() || "";
        
        return (
          title.includes(searchQuery.toLowerCase()) ||
          description.includes(searchQuery.toLowerCase()) ||
          categoryName.includes(searchQuery.toLowerCase())
        );
      });
    }

    setFilteredEvents(filtered);
  }, [selectedFilter, selectedTypeFilter, allEvents, searchQuery]);

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories
      const categoriesResponse = await api.get("/category/get");
      const categoriesData = categoriesResponse.data.data || [];
      setCategories(categoriesData);

      // Build filter options
      const filters = [{ id: "all", label: "All", icon: Filter }];
      categoriesData.forEach((cat) => {
        const categoryName = getCategoryName(cat);
        const icon = getCategoryIcon(categoryName);
        filters.push({
          id: cat._id,
          label: categoryName,
          icon: icon,
        });
      });
      setFilterOptions(filters);

      // Fetch all events
      const eventsResponse = await api.get("/events");
      const eventsData = eventsResponse.data.data || [];
      setAllEvents(eventsData);
      setFilteredEvents(eventsData);

    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter click handlers
  const handleCategoryFilterClick = (filterId) => {
    setSelectedFilter(filterId);
    setFilterToURL(navigate, location, 'filter', filterId);
    
    const eventsSection = document.getElementById('events-section');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTypeFilterClick = (filterId) => {
    setSelectedTypeFilter(filterId);
    setFilterToURL(navigate, location, 'type', filterId);
    
    const eventsSection = document.getElementById('events-section');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Modal handlers
  const handleViewDetails = (event) => {
    document.body.style.overflow = "hidden";
    setSelectedEvent(event);
    setSelectedImageIndex(0);
    setExpandedRules({
      general: false,
      event: false,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    document.body.style.overflow = "auto";
    setShowModal(false);
    setSelectedEvent(null);
  };

  const toggleRuleSection = (section) => {
    setExpandedRules((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#080131] to-[#0a051a] text-white">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-linear-to-r from-purple-900/20 via-blue-900/10 to-indigo-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-linear-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent">
                All Events
              </h1>
              <p className="text-gray-400 text-lg">
                Explore all upcoming events across all categories
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-lg font-medium">
                  {filteredEvents.length}{" "}
                  {filteredEvents.length === 1 ? "Event" : "Events"}
                </span>
              </div>
            </div>
          </div>

          {/* Search and Type Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <EventSearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            
            <EventTypeFilter 
              selectedTypeFilter={selectedTypeFilter}
              handleTypeFilterClick={handleTypeFilterClick}
              typeFilterOptions={typeFilterOptions}
              getTypeFilterColor={getTypeFilterColor}
            />
          </div>

          {/* Category Filter */}
          <div className="mb-12" id="events-section">
            <CategoryFilter 
              selectedFilter={selectedFilter}
              handleCategoryFilterClick={handleCategoryFilterClick}
              filterOptions={filterOptions}
              getCategoryColor={getCategoryColor}
            />
          </div>
        </div>
      </div>

      {/* Events Content */}
      <EventsGrid 
        loading={loading}
        error={error}
        filteredEvents={filteredEvents}
        allEvents={allEvents}
        selectedFilter={selectedFilter}
        selectedTypeFilter={selectedTypeFilter}
        searchQuery={searchQuery}
        handleCategoryFilterClick={handleCategoryFilterClick}
        handleTypeFilterClick={handleTypeFilterClick}
        setSearchQuery={setSearchQuery}
        handleViewDetails={handleViewDetails}
        getCategoryName={getCategoryName}
        getSubCategory={getSubCategory}
        getImageUrl={getImageUrl}
        getEventTypeIcon={getEventTypeIcon}
        getCategoryIcon={getCategoryIcon}
        getEventTypeText={getEventTypeText}
        getCategoryColor={getCategoryColor}
        formatDate={formatDate}
        formatTime={formatTime}
      />

      {/* Event Detail Modal */}
      {showModal && (
        <EventDetailModal 
          selectedEvent={selectedEvent}
          showModal={showModal}
          handleCloseModal={handleCloseModal}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          expandedRules={expandedRules}
          toggleRuleSection={toggleRuleSection}
          getCategoryName={getCategoryName}
          getSubCategory={getSubCategory}
          getAllImages={getAllImages}
          getCategoryColor={getCategoryColor}
          getEventTypeIcon={getEventTypeIcon}
          getEventTypeText={getEventTypeText}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      )}

      {/* Back to Top Button */}
      {!loading && !error && filteredEvents.length > 0 && (
        <div className="fixed bottom-8 right-8 z-40">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="p-4 bg-linear-to-r from-purple-600 to-blue-600 rounded-full shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300"
          >
            <ArrowLeft size={24} className="rotate-90" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AllEvents;