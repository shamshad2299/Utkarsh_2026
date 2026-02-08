import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Filter, User, Users } from 'lucide-react';
import { api } from '../../api/axios';
import EventSearchBar from './components/EventSearchBar';
import EventTypeFilter from './components/EventTypeFilter';
import CategoryFilter from './components/CategoryFilter';
import EventsGrid from './components/EventsGrid';
import EventDetailModal from './components/EventDetailModal';
import RegistrationModal from './components/RegistrationModal'; // Add this import
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
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const AllEvents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth(); // Get auth state
  
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const token = localStorage.getItem("accessToken");
  
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

  // User data states
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [userDataLoading, setUserDataLoading] = useState(false);

  // Event type filter options
  const typeFilterOptions = [
    { id: "all", label: "All Types", icon: Filter },
    { id: "solo", label: "Solo", icon: User },
    { id: "team", label: "Team", icon: Users },
  ];

  // Modal states
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expandedRules, setExpandedRules] = useState({
    general: false,
    event: false,
  });

  // Enroll state
  const [enrollingEventId, setEnrollingEventId] = useState(null);
  const [enrollMessage, setEnrollMessage] = useState('');

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

  // Fetch user data when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchUserData();
    }
  }, [isAuthenticated, token]);

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

  // Fetch user registrations and teams
  const fetchUserData = async () => {
    try {
      setUserDataLoading(true);
      
      // Fetch user registrations
      try {
        const regResponse = await api.get("/registrations/my", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserRegistrations(regResponse.data.data || []);
      } catch (regError) {
        console.error("Error fetching registrations:", regError);
        // If unauthorized, logout user
        if (regError.response?.status === 401) {
          logout();
          navigate('/login');
        }
      }

      // Fetch user teams (only for authenticated users)
      try {
        const teamsResponse = await api.get("/teams/my", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserTeams(teamsResponse.data.data || []);
      } catch (teamsError) {
        console.error("Error fetching teams:", teamsError);
        // Continue even if teams fetch fails
      }
      
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setUserDataLoading(false);
    }
  };

  // Handle enrollment
  
const handleEnroll = async (event, teamId = null) => {
  if (!isAuthenticated) {
    navigate('/login', { 
      state: { 
        from: location.pathname,
        message: 'Please login to enroll in events'
      } 
    });
    return;
  }

  setEnrollingEventId(event._id);
  setEnrollMessage('');
  
  try {
    // First, check if user has a soft-deleted registration for this event
    const existingDeletedRegistration = userRegistrations.find(
      reg => 
        (reg.eventId === event._id || reg.eventId?._id === event._id) &&
        reg.isDeleted === true
    );

    // If soft-deleted registration exists, restore it instead of creating new
    if (existingDeletedRegistration) {
      await handleRestoreRegistration(existingDeletedRegistration._id, event, teamId);
      return;
    }

    // Otherwise, create new registration
    const enrollmentData = {
      eventId: event._id,
      formData: {}
    };

    // Add teamId for team events
    if (event.eventType !== 'solo' && teamId) {
      enrollmentData.teamId = teamId;
    }

    const response = await api.post("/registrations", enrollmentData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Handle successful enrollment
    handleSuccessfulEnrollment(response.data.data, event);
    
  } catch (error) {
    handleEnrollmentError(error, event);
  } finally {
    setEnrollingEventId(null);
  }
};

// Helper function to restore soft-deleted registration
const handleRestoreRegistration = async (registrationId, event, teamId = null) => {
  try {
    // Make PATCH request to restore registration
    const response = await api.patch(`/registrations/${registrationId}/restore`, 
      { teamId },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    // Update user registrations - restore the deleted one
    setUserRegistrations(prev => 
      prev.map(reg => 
        reg._id === registrationId
          ? { 
              ...response.data.data, 
              isDeleted: false,
              status: response.data.data.status || 'pending'
            }
          : reg
      )
    );

    // Update event capacity if needed
    updateEventCapacity(event._id, 1);

    // Close modal and show success
    setShowRegistrationModal(false);
    setSelectedEvent(null);
    
    setEnrollMessage(`Successfully re-enrolled in "${event.title}"!`);
    
    // Clear message after 3 seconds
    setTimeout(() => setEnrollMessage(''), 3000);

  } catch (error) {
    console.error('Restore registration error:', error);
    const errorMessage = error.response?.data?.message || 'Failed to re-enroll';
    
    if (errorMessage.includes('deadline')) {
      setEnrollMessage('Registration deadline has passed! Cannot re-enroll.');
    } else if (errorMessage.includes('full')) {
      setEnrollMessage('Event is now full! Cannot re-enroll.');
    } else {
      setEnrollMessage(errorMessage);
    }
    
    setTimeout(() => setEnrollMessage(''), 5000);
  }
};

// Helper function for successful enrollment
const handleSuccessfulEnrollment = (newRegistration, event) => {
  // Update user registrations
  setUserRegistrations(prev => {
    // Remove any soft-deleted registration for this event first
    const filtered = prev.filter(reg => 
      !(reg.eventId === event._id || reg.eventId?._id === event._id) || 
      !reg.isDeleted
    );
    
    // Add new registration
    return [...filtered, newRegistration];
  });
  
  // Update event capacity
  updateEventCapacity(event._id, 1);

  // Close registration modal
  setShowRegistrationModal(false);
  setSelectedEvent(null);
  
  // Show success message
  setEnrollMessage(`Successfully enrolled in "${event.title}"!`);
  
  // Clear message after 3 seconds
  setTimeout(() => setEnrollMessage(''), 3000);
};

// Helper function to update event capacity
const updateEventCapacity = (eventId, increment = 1) => {
  setAllEvents(prevEvents => 
    prevEvents.map(ev => 
      ev._id === eventId
        ? { 
            ...ev, 
            currentParticipants: (ev.currentParticipants || 0) + increment 
          }
        : ev
    )
  );

  setFilteredEvents(prevEvents => 
    prevEvents.map(ev => 
      ev._id === eventId
        ? { 
            ...ev, 
            currentParticipants: (ev.currentParticipants || 0) + increment 
          }
        : ev
    )
  );
};

// Helper function to handle enrollment errors
const handleEnrollmentError = (error, event) => {
  console.error('Enrollment error:', error);
  const errorMessage = error.response?.data?.message || 'Failed to enroll';
  
  // Handle specific error cases
  if (error.response?.status === 401) {
    logout();
    navigate('/login', { 
      state: { 
        from: location.pathname,
        message: 'Session expired. Please login again.'
      } 
    });
    return;
  }
  
  // Show appropriate error message
  if (errorMessage.includes('Already registered') || errorMessage.includes('already enrolled')) {
    // Check if it's a soft-deleted registration that needs restoration
    const deletedRegistration = userRegistrations.find(
      reg => 
        (reg.eventId === event._id || reg.eventId?._id === event._id) &&
        reg.isDeleted === true
    );
    
    if (deletedRegistration) {
      setEnrollMessage('Your previous registration was cancelled. Click enroll again to re-register.');
    } else {
      setEnrollMessage('You are already registered for this event!');
      // Force refresh user registrations
      fetchUserData();
    }
  } else if (errorMessage.includes('Registration deadline')) {
    setEnrollMessage('Registration deadline has passed!');
  } else if (errorMessage.includes('Team size')) {
    setEnrollMessage('Team size does not meet event requirements!');
  } else if (errorMessage.includes('Team ID is required')) {
    setEnrollMessage('Please select a team for team events');
  } else if (errorMessage.includes('soft-deleted') || errorMessage.includes('deleted')) {
    setEnrollMessage('Your previous registration was cancelled. Try enrolling again.');
  } else {
    setEnrollMessage(errorMessage);
  }
  
  // Clear error message after 5 seconds
  setTimeout(() => setEnrollMessage(''), 5000);
};

  // Open registration modal
 const openRegistrationModal = (event) => {
  if (!isAuthenticated) {
    navigate('/login', { 
      state: { 
        from: location.pathname,
        message: 'Please login to enroll in events'
      } 
    });
    return;
  }

  setSelectedEvent(event);
  
  // Check if already enrolled
  const isEnrolled = userRegistrations.some(reg => {
    // Check both possible structures
    return reg.eventId?._id === event._id || reg.eventId === event._id;
  });
  
  if (isEnrolled) {
    setEnrollMessage('You are already enrolled in this event!');
    setTimeout(() => setEnrollMessage(''), 3000);
    return;
  }

  // Check registration deadline
  if (new Date() > new Date(event.registrationDeadline)) {
    setEnrollMessage('Registration deadline has passed!');
    setTimeout(() => setEnrollMessage(''), 3000);
    return;
  }

  // Check capacity
  if (event.currentParticipants >= event.capacity) {
    setEnrollMessage('Event is full!');
    setTimeout(() => setEnrollMessage(''), 3000);
    return;
  }

  // For solo events, enroll directly
  if (event.eventType === 'solo') {
    if (window.confirm(`Are you sure you want to enroll in "${event.title}"?`)) {
      handleEnroll(event);
    }
    return;
  }

  // For team events, show registration modal
  setShowRegistrationModal(true);
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

  const handleCloseRegistrationModal = () => {
    setShowRegistrationModal(false);
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
        <div className="relative  mx-auto px-4 py-12">
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

          <div className="flex px-4 flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-linear-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent">
                All Events
              </h1>
              <p className="text-gray-400 text-lg">
                Explore all upcoming events across all categories
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* User info if authenticated */}
              {isAuthenticated && user && (
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <span className="text-sm font-medium">
                    Welcome, {user.name || user.email}
                  </span>
                </div>
              )}
              
              <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-lg font-medium">
                  {filteredEvents.length}{" "}
                  {filteredEvents.length === 1 ? "Event" : "Events"}
                </span>
              </div>
            </div>
          </div>

          {/* Success/Error Message */}
          {enrollMessage && (
            <div className={`mb-6 p-4 rounded-xl border ${enrollMessage.includes('Successfully') ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              <div className="flex items-center justify-between">
                <p>{enrollMessage}</p>
                <button 
                  onClick={() => setEnrollMessage('')}
                  className="text-sm hover:opacity-80"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Search and Type Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 ">
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
          <div  id="events-section">
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
        loading={loading || userDataLoading}
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
        handleEnroll={openRegistrationModal}
        isAuthenticated={isAuthenticated}
        userRegistrations={userRegistrations}
        enrollingEventId={enrollingEventId}
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
          isAuthenticated={isAuthenticated}
        />
      )}

      {/* Registration Modal */}    
{showRegistrationModal && selectedEvent && (
  <RegistrationModal
    isOpen={showRegistrationModal}
    onClose={handleCloseRegistrationModal}
    event={selectedEvent}
    userTeams={userTeams}
    onEnroll={handleEnroll}
    loading={enrollingEventId === selectedEvent._id}
    isAuthenticated={isAuthenticated}
    token={token}
    user={user}
    userEnrollments={userRegistrations} // Add this line
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