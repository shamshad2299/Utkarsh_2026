// Updated AllEvents.jsx with React Query - FULLY OPTIMIZED with SweetAlert2 & RESTORE
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Filter, User, Users } from "lucide-react";
import Swal from "sweetalert2";
import { api } from "../../api/axios";
import EventSearchBar from "./components/EventSearchBar";
import EventTypeFilter from "./components/EventTypeFilter";
import CategoryFilter from "./components/CategoryFilter";
import EventsGrid from "./components/EventsGrid";
import EventDetailModal from "./components/EventDetailModal";
import RegistrationModal from "./components/RegistrationModal";
import { getFilterFromURL, setFilterToURL } from "../utils/filterUtils";
import {
  getCategoryName,
  getSubCategory,
  getImageUrl,
  getAllImages,
  getCategoryIcon,
  getEventTypeIcon,
  getEventTypeText,
  formatDate,
  formatTime,
  getCategoryColor,
  getTypeFilterColor,
} from "../utils/eventUtils";
import { useAuth } from "../../Context/AuthContext";
import { 
  useEvents, 
  useCategories, 
  eventKeys
} from "../../features/eventsAPI";
import { useQueryClient } from "@tanstack/react-query";

// ================ CONSTANTS ================
const TYPE_FILTER_OPTIONS = [
  { id: "all", label: "All Types", icon: Filter },
  { id: "solo", label: "Solo", icon: User },
  { id: "team", label: "Team", icon: Users },
];

// ================ SWEETALERT2 CONFIGURATION ================
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

// Confetti Effect
const triggerConfetti = () => {
  if (window.confetti) {
    window.confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#6366f1', '#3b82f6', '#10b981', '#f59e0b']
    });
  }
};

// ================ TOAST HELPERS ================
const showSuccessToast = (message) => {
  Toast.fire({
    icon: "success",
    title: message,
    background: "#1a1a3e",
    color: "#ffffff",
    iconColor: "#10b981",
  });
};

const showErrorToast = (message) => {
  Toast.fire({
    icon: "error",
    title: message,
    background: "#1a1a3e",
    color: "#ffffff",
    iconColor: "#ef4444",
  });
};

const showWarningToast = (message) => {
  Toast.fire({
    icon: "warning",
    title: message,
    background: "#1a1a3e",
    color: "#ffffff",
    iconColor: "#f59e0b",
  });
};

const showInfoToast = (message) => {
  Toast.fire({
    icon: "info",
    title: message,
    background: "#1a1a3e",
    color: "#ffffff",
    iconColor: "#3b82f6",
  });
};

// ================ CONFIRMATION MODALS ================
const showSoloEnrollmentConfirmation = async (event) => {
  const result = await Swal.fire({
    title: "Confirm Enrollment",
    text: `Enroll in "${event.title}"?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Enroll",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#8b5cf6",
  });

  return result.isConfirmed;
};

const showReenrollmentSuccess = async (eventTitle) => {
  triggerConfetti();

  await Swal.fire({
    title: "Successfully again enrolled in this event. 🎉",
    text: `You are registered again for "${eventTitle}".`,
    icon: "success",
    confirmButtonText: "Continue to re enroll",
    confirmButtonColor: "#8b5cf6",
  });
};


const showLoginRequired = (navigate, location) => {
  Swal.fire({
    title: "Login Required",
    text: "Please login to enroll in events.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Go to Login",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#8b5cf6",
  }).then((result) => {
    if (result.isConfirmed) {
      navigate("/login", { state: { from: location.pathname } });
    }
  });
};

// ================ MEMOIZED COMPONENTS ================
const WelcomeBadge = React.memo(({ user }) => (
  <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
    <span className="text-sm font-medium">
      Welcome, {user?.name || user?.email}
    </span>
  </div>
));
WelcomeBadge.displayName = 'WelcomeBadge';

const EventCountBadge = React.memo(({ count }) => (
  <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
    <span className="text-md font-medium">
      {count} {count === 1 ? "Event" : "Events"}
    </span>
  </div>
));
EventCountBadge.displayName = 'EventCountBadge';

const BackToTopButton = React.memo(() => (
  <div className="fixed bottom-8 right-8 z-40">
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300"
      aria-label="Back to top"
    >
      <ArrowLeft size={24} className="rotate-90" />
    </button>
  </div>
));
BackToTopButton.displayName = 'BackToTopButton';

const LoadingScreen = React.memo(() => (
  <div className="min-h-screen bg-gradient-to-b from-[#080131] to-[#0a051a] flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-white text-lg">Loading events...</p>
    </div>
  </div>
));
LoadingScreen.displayName = 'LoadingScreen';

// ================ MAIN COMPONENT ================
const AllEvents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();

  // Auth state - memoized
  const isAuthenticated = useMemo(() => !!localStorage.getItem("accessToken"), []);
  const token = useMemo(() => localStorage.getItem("accessToken"), []);

  // React Query hooks with caching - NO API CALLS on subsequent visits
  const { 
    data: events = [], 
    isLoading: eventsLoading, 
    error: eventsError,
    refetch: refetchEvents
  } = useEvents();

  const { 
    data: categories = [], 
    isLoading: categoriesLoading 
  } = useCategories();

  // Local state
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expandedRules, setExpandedRules] = useState({
    general: false,
    event: false,
  });

  // User data states
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [userDataLoading, setUserDataLoading] = useState(false);

  // Enroll state
  const [enrollingEventId, setEnrollingEventId] = useState(null);

  // ================ MEMOIZED VALUES ================
  const filterOptions = useMemo(() => {
    if (!categories.length) return [{ id: "all", label: "All", icon: Filter }];
    
    const filters = [{ id: "all", label: "All", icon: Filter }];
    categories.forEach((cat) => {
      const categoryName = getCategoryName(cat);
      const icon = getCategoryIcon(categoryName);
      filters.push({
        id: cat._id,
        label: categoryName,
        icon: icon,
      });
    });
    return filters;
  }, [categories]);

  const filteredEvents = useMemo(() => {
    if (!events.length) return [];
    
    let filtered = [...events];

    if (selectedCategoryFilter !== "all") {
      filtered = filtered.filter((event) => {
        const eventCategoryId = event.category?._id;
        const eventCategoryName = event.category?.name?.toLowerCase() || "";
        return (
          eventCategoryId === selectedCategoryFilter ||
          eventCategoryName.includes(selectedCategoryFilter.toLowerCase())
        );
      });
    }

    if (selectedTypeFilter !== "all") {
      filtered = filtered.filter((event) => {
        const eventType = getEventTypeText(
          event.teamSize,
          event.eventType,
        ).toLowerCase();
        return eventType === selectedTypeFilter.toLowerCase();
      });
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((event) => {
        const title = event.title?.toLowerCase() || "";
        const description = event.description?.toLowerCase() || "";
        const categoryName = event.category?.name?.toLowerCase() || "";
        const venueName = event.venueName?.toLowerCase() || "";
        const subCategoryName = event.subCategory?.title?.toLowerCase() || "";

        return (
          title.includes(query) ||
          description.includes(query) ||
          categoryName.includes(query) ||
          venueName.includes(query) ||
          subCategoryName.includes(query)
        );
      });
    }

    return filtered;
  }, [selectedCategoryFilter, selectedTypeFilter, events, searchQuery]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId || !events.length) return null;
    return events.find(event => event._id === selectedEventId) || null;
  }, [selectedEventId, events]);

  // ================ READ FILTERS FROM URL ================
  useEffect(() => {
    const urlCategoryFilter = getFilterFromURL(location, "filter");
    const urlTypeFilter = getFilterFromURL(location, "type");
    setSelectedCategoryFilter(urlCategoryFilter);
    setSelectedTypeFilter(urlTypeFilter);
  }, [location]);

  // ================ FETCH USER DATA ================
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchUserData();
    } else {
      setUserRegistrations([]);
      setUserTeams([]);
    }
  }, [isAuthenticated, token]);

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated || !token) return;

    try {
      setUserDataLoading(true);

      const [regResponse, teamsResponse] = await Promise.allSettled([
        api.get("/registrations/my", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/teams/my", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (regResponse.status === "fulfilled") {
        setUserRegistrations(regResponse.value.data.data || []);
      } else {
        console.error("Error fetching registrations:", regResponse.reason);
        if (regResponse.reason?.response?.status === 401) {
          logout();
          navigate("/login");
        }
      }

      if (teamsResponse.status === "fulfilled") {
        setUserTeams(teamsResponse.value.data.data || []);
      } else {
        console.error("Error fetching teams:", teamsResponse.reason);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setUserDataLoading(false);
    }
  }, [isAuthenticated, token, logout, navigate]);

  // ================ HELPER FUNCTIONS ================
  const isUserEnrolled = useCallback((eventId) => {
    return userRegistrations.some((reg) => {
      if (!reg || reg.isDeleted) return false;
      const regEventId = reg.eventId?._id || reg.eventId;
      return regEventId === eventId;
    });
  }, [userRegistrations]);

  const isRegistrationOpen = useCallback((deadline) => {
    return new Date(deadline) > new Date();
  }, []);

  const hasCapacity = useCallback((event) => {
    return (event.currentParticipants || 0) < event.capacity;
  }, []);

  const updateEventCapacity = useCallback((eventId, increment = 1) => {
    queryClient.setQueryData(eventKeys.lists(), (oldData) => {
      if (!oldData) return oldData;
      return oldData.map((event) =>
        event._id === eventId
          ? {
              ...event,
              currentParticipants: (event.currentParticipants || 0) + increment,
            }
          : event
      );
    });
  }, [queryClient]);

  // ================ RESTORE REGISTRATION HANDLER ================
const handleRestoreRegistration = useCallback(async (registrationId, event, teamId = null) => {
  try {
    const response = await api.patch(
      `/registrations/${registrationId}/restore`,
      { teamId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Update local state
    setUserRegistrations((prev) =>
      prev.map((reg) =>
        reg._id === registrationId
          ? response.data.data
          : reg
      )
    );

    updateEventCapacity(event._id, 1);

    await showReenrollmentSuccess(event.title);

  } catch (error) {
    const message = error.response?.data?.message || "Failed to re-enroll";
    showErrorToast(message);
  }
}, [token, updateEventCapacity]);



  // ================ ENROLLMENT HANDLERS ================
  const handleEnroll = useCallback(async (event, teamId = null) => {
  if (!isAuthenticated) {
    showLoginRequired(navigate, location);
    return;
  }

  setEnrollingEventId(event._id);

  try {
    // 1️⃣ Check if soft deleted registration exists
    const deletedRegistration = userRegistrations.find(
      (reg) =>
        (reg.eventId === event._id || reg.eventId?._id === event._id) &&
        reg.isDeleted === true &&
        reg.status === "cancelled"
    );

    if (deletedRegistration) {
      await handleRestoreRegistration(deletedRegistration._id, event, teamId);
      return;
    }

    // 2️⃣ Check active registration
    const activeRegistration = userRegistrations.find(
      (reg) =>
        (reg.eventId === event._id || reg.eventId?._id === event._id) &&
        reg.isDeleted === false &&
        reg.status !== "cancelled"
    );

    if (activeRegistration) {
      showInfoToast("You are already enrolled in this event!");
      return;
    }

    // 3️⃣ Deadline check
    if (new Date() > new Date(event.registrationDeadline)) {
      showErrorToast("Registration deadline has passed!");
      return;
    }

    // 4️⃣ Capacity check
    if ((event.currentParticipants || 0) >= event.capacity) {
      showErrorToast("Event is full!");
      return;
    }

    // 5️⃣ Create new registration
    const response = await api.post(
      "/registrations",
      {
        eventId: event._id,
        teamId: teamId || null,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setUserRegistrations((prev) => [...prev, response.data.data]);

    updateEventCapacity(event._id, 1);

    showSuccessToast(`Successfully enrolled in "${event.title}"!`);

  } catch (error) {
    const message = error.response?.data?.message || "Failed to enroll";
    showErrorToast(message);
  } finally {
    setEnrollingEventId(null);
  }
}, [
  isAuthenticated,
  userRegistrations,
  handleRestoreRegistration,
  token,
  navigate,
  location,
  updateEventCapacity,
]);

  // ================ MODAL HANDLERS ================
  const handleViewDetails = useCallback((event) => {
    document.body.style.overflow = "hidden";
    setSelectedEventId(event._id);
    setSelectedImageIndex(0);
    setExpandedRules({
      general: false,
      event: false,
    });
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    document.body.style.overflow = "auto";
    setShowModal(false);
    setSelectedEventId(null);
  }, []);

  const handleCloseRegistrationModal = useCallback(() => {
    setShowRegistrationModal(false);
    setSelectedEventId(null);
  }, []);

  // ================ FILTER HANDLERS ================
  const handleCategoryFilterClick = useCallback((filterId) => {
    setSelectedCategoryFilter(filterId);
    setFilterToURL(navigate, location, "filter", filterId);
    const eventsSection = document.getElementById("events-section");
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: "smooth" });
    }
  }, [navigate, location]);

  const handleTypeFilterClick = useCallback((filterId) => {
    setSelectedTypeFilter(filterId);
    setFilterToURL(navigate, location, "type", filterId);
    const eventsSection = document.getElementById("events-section");
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: "smooth" });
    }
  }, [navigate, location]);

  // ================ OPEN REGISTRATION MODAL ================
  const openRegistrationModal = useCallback(async (event) => {
    if (!isAuthenticated) {
      showLoginRequired(navigate, location);
      return;
    }

    setSelectedEventId(event._id);

    if (isUserEnrolled(event._id)) {
      showInfoToast("You are already enrolled in this event!");
      return;
    }

    if (!isRegistrationOpen(event.registrationDeadline)) {
      showErrorToast("Registration deadline has passed!");
      return;
    }

    if (!hasCapacity(event)) {
      showErrorToast("Event is full!");
      return;
    }

    const categoryName = getCategoryName(event.category);
    const eventTypeText = getEventTypeText(event.teamSize, event.eventType);

    // For solo events - show SweetAlert2 confirmation
    if (event.eventType === "solo") {
      const confirmed = await showSoloEnrollmentConfirmation(event, categoryName, eventTypeText);
      if (confirmed) {
        handleEnroll(event);
      }
      return;
    }

    // For team events - show registration modal
    setShowRegistrationModal(true);
  }, [isAuthenticated, isUserEnrolled, isRegistrationOpen, hasCapacity, handleEnroll, navigate, location]);

  const toggleRuleSection = useCallback((section) => {
    setExpandedRules((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  // ================ LOADING STATE ================
  const isLoading = eventsLoading || categoriesLoading;

  if (isLoading && events.length === 0) {
    return <LoadingScreen />;
  }

  // ================ RENDER ================
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080131] to-[#0a051a] text-white">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/10 to-indigo-900/20" />
        <div className="relative w-full mx-auto px-7 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="flex max-sm:flex-col max-sm:gap-10 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent all-events-3d">
                  All Events
                </h1>
                <p className="text-gray-400 text-lg milonga mt-4">
                  Discover every upcoming event across all categories. From tech
                  fests and cultural nights to competitions and workshops. Stay
                  updated, get inspired, and never miss what’s coming next.
                </p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="flex w-50 px-4 py-2 rounded-2xl milonga bg-white items-center gap-2 cursor-pointer text-black mb-8 transition-colors group -mt-5"
              >
                Go Back
                <ArrowUpRight
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && user && (
              <WelcomeBadge user={user} />
            )}
            <EventCountBadge count={filteredEvents.length} />
          </div>

          {/* Search and Type Filter */}
          <div className="w-full bg-white text-black rounded-md mt-6">
            <EventSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>

          <div className="mt-6">
            <EventTypeFilter
              selectedTypeFilter={selectedTypeFilter}
              handleTypeFilterClick={handleTypeFilterClick}
              typeFilterOptions={TYPE_FILTER_OPTIONS}
              getTypeFilterColor={getTypeFilterColor}
            />
          </div>

          {/* Category Filter */}
          <div id="events-section" className="mt-6">
            <CategoryFilter
              selectedFilter={selectedCategoryFilter}
              handleCategoryFilterClick={handleCategoryFilterClick}
              filterOptions={filterOptions}
              getCategoryColor={getCategoryColor}
            />
          </div>
        </div>
      </div>

      {/* ================ EVENTS GRID WITH RESTORE HANDLER ================ */}
      <EventsGrid
        loading={userDataLoading}
        error={eventsError}
        filteredEvents={filteredEvents}
        allEvents={events}
        selectedFilter={selectedCategoryFilter}
        selectedTypeFilter={selectedTypeFilter}
        searchQuery={searchQuery}
        handleCategoryFilterClick={handleCategoryFilterClick}
        handleTypeFilterClick={handleTypeFilterClick}
        setSearchQuery={setSearchQuery}
        handleViewDetails={handleViewDetails}
        handleEnroll={openRegistrationModal}
        handleRestoreRegistration={handleRestoreRegistration} // 👈 RESTORE HANDLER PASSED HERE
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
      {showModal && selectedEventId && (
        <EventDetailModal
          eventId={selectedEventId}
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
          handleEnroll={handleEnroll}
          handleRestoreRegistration={handleRestoreRegistration} // 👈 ALSO PASS TO MODAL
          isAuthenticated={isAuthenticated}
          token={token}
          user={user}
          userTeams={userTeams}
          userRegistrations={userRegistrations}
        />
      )}

      {/* Registration Modal */}
      {showRegistrationModal && selectedEventId && selectedEvent && (
        <RegistrationModal
          isOpen={showRegistrationModal}
          onClose={handleCloseRegistrationModal}
          event={selectedEvent}
          userTeams={userTeams}
          onEnroll={handleEnroll}
          onRestore={handleRestoreRegistration} // 👈 PASS RESTORE HANDLER TO REGISTRATION MODAL
          loading={enrollingEventId === selectedEvent._id}
          isAuthenticated={isAuthenticated}
          token={token}
          user={user}
          userEnrollments={userRegistrations}
        />
      )}

      {/* Back to Top Button */}
      {!eventsLoading && !eventsError && filteredEvents.length > 0 && (
        <BackToTopButton />
      )}
    </div>
  );
};

export default AllEvents;