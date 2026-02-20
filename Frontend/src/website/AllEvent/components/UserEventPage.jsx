import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Search,
  AlertCircle,
  Loader2,
  ChevronRight,
  ExternalLink,
  Hand,
  Timer,
  Trophy,
  UserCircle,
  UsersRound,
  LogOut,
} from "lucide-react";
import Swal from "sweetalert2";
import { api } from "../../../api/axios";
import { useAuth } from "../../../Context/AuthContext";
import EventDetailModal from "./EventDetailModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategoryName,
  getSubCategory,
  getImageUrl,
  getAllImages,
  getEventTypeIcon,
  getEventTypeText,
  formatDate,
  formatTime,
  getCategoryColor,
} from "../../utils/eventUtils";

// Query Keys
const REGISTRATION_KEYS = {
  all: ["registrations"],
  my: () => [...REGISTRATION_KEYS.all, "my"],
};

// Constants - EXACTLY SAME UI
const FILTER_BUTTONS = [
  { id: "all", label: "All types", icon: Hand, color: "bg-[#c4b5fd]", textColor: "text-[#1a1a3e]" },
  { id: "upcoming", label: "Upcoming", icon: Timer, color: "bg-white", textColor: "text-[#1a1a3e]" },
  { id: "past", label: "Past", icon: Trophy, color: "bg-white", textColor: "text-[#1a1a3e]" },
  { id: "solo", label: "Solo", icon: UserCircle, color: "bg-white", textColor: "text-[#1a1a3e]" },
  { id: "team", label: "Team", icon: UsersRound, color: "bg-white", textColor: "text-[#1a1a3e]" },
];

// ================ SWEETALERT2 CONFIGURATION - EXACTLY SAME ================
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

// Toast Helpers - EXACTLY SAME
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

// ================ CONFIRMATION MODAL - SIMPLIFIED BUT SAME STYLING ================
const showUnenrollConfirmation = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    
    icon: "warning",
    iconColor: "#ef4444",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Unenroll",
    cancelButtonText: "Keep Registration",
    background: "#ffffff",
    backdrop: "rgba(239, 68, 68, 0.2)",
    customClass: {
      popup: "rounded-3xl shadow-2xl",
      confirmButton: "rounded-full px-6 py-2.5 font-semibold",
      cancelButton: "rounded-full px-6 py-2.5 font-semibold",
    },
  });
  return result.isConfirmed;
};

// ================ MEMOIZED COMPONENTS - EXACTLY SAME UI ================
const SearchBar = React.memo(({ searchTerm, setSearchTerm }) => (
  <div className="mb-8">
    <div className="relative max-w-4xl">
      <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search Your registered events"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-14 pr-6 py-3 bg-white rounded-2xl text-[#1a1a3e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c4b5fd] text-base shadow-lg"
        aria-label="Search registered events"
      />
    </div>
  </div>
));
SearchBar.displayName = 'SearchBar';

const FilterButtons = React.memo(({ filter, setFilter }) => (
  <div className="mb-8">
    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
      {FILTER_BUTTONS.map((btn) => {
        const Icon = btn.icon;
        const isActive = filter === btn.id;
        return (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`
              ${isActive ? btn.color : "bg-white"} 
              ${btn.textColor} 
              px-6 py-4 rounded-2xl font-medium 
              cursor-pointer
              transition-all shadow-md hover:shadow-lg hover:scale-105 
              flex flex-col items-center gap-2 min-w-[100px]
              focus:outline-none focus:ring-2 focus:ring-[#c4b5fd]
            `}
            aria-pressed={isActive}
          >
            <Icon className="w-8 h-8" strokeWidth={1.5} />
            <span className="text-sm">{btn.label}</span>
          </button>
        );
      })}
    </div>
  </div>
));
FilterButtons.displayName = 'FilterButtons';

const LoadingState = React.memo(() => (
  <div className="min-h-screen bg-[#1a1a3e] p-4 md:p-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
        <p className="text-white/80 text-lg">Loading your registered events...</p>
      </div>
    </div>
  </div>
));
LoadingState.displayName = 'LoadingState';

const EmptyState = React.memo(({ searchTerm, filter, onClear, onBrowse }) => {
  const hasFilters = searchTerm || filter !== "all";
  return (
    <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-2xl">
      {hasFilters ? (
        <>
          <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Events Found</h3>
          <p className="text-white/60 mb-4">
            {searchTerm
              ? "No registered events match your search"
              : `No ${filter} events found in your registrations`}
          </p>
          <button
            onClick={onClear}
            className="px-6 py-3 bg-white text-[#1a1a3e] rounded-xl hover:bg-gray-100 font-semibold shadow-lg transition-all"
          >
            Clear Filters
          </button>
        </>
      ) : (
        <>
          <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Registered Events</h3>
          <p className="text-white/60 mb-6">You haven't registered for any events yet</p>
          <button
            onClick={onBrowse}
            className="px-6 py-3 bg-white text-[#1a1a3e] cursor-pointer rounded-xl hover:bg-gray-100 font-semibold shadow-lg transition-all inline-flex items-center gap-2"
          >
            Browse Events
            <ExternalLink size={18} />
          </button>
        </>
      )}
    </div>
  );
});
EmptyState.displayName = 'EmptyState';

// ================ MAIN COMPONENT ================
const UserRegisteredEvents = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const isAuthenticated = useMemo(() => !!localStorage.getItem("accessToken"), []);
  const token = useMemo(() => localStorage.getItem("accessToken"), []);

  // Local state - EXACTLY SAME
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expandedRules, setExpandedRules] = useState({
    general: false,
    event: false,
  });
  const [unenrollLoading, setUnenrollLoading] = useState({});

  // Fetch user registrations with React Query - OPTIMIZED
  const { 
    data: registrations = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: REGISTRATION_KEYS.my(),
    queryFn: async () => {
      if (!token) return [];
      try {
        const response = await api.get("/registrations/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data?.data || [];
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        }
        throw err;
      }
    },
    enabled: !!isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000, // renamed from cacheTime
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: "/events/my-registrations",
          message: "Please login to view your registered events",
        },
      });
    }
  }, [isAuthenticated, navigate]);

  // Filter registrations - EXACTLY SAME LOGIC but without soft delete
  const filteredRegistrations = useMemo(() => {
    if (!registrations.length) return [];

    return registrations.filter((registration) => {
      const event = registration?.eventId;
      if (!event) return false;

      const matchesSearch = !searchTerm || 
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesType = true;
      if (filter === "solo") matchesType = event.eventType === "solo";
      if (filter === "team") matchesType = event.eventType !== "solo";

      let matchesDate = true;
      if (filter === "upcoming" || filter === "past") {
        const now = new Date();
        const eventDate = new Date(event.startTime);
        matchesDate = filter === "upcoming" ? eventDate >= now : eventDate < now;
      }

      return matchesSearch && matchesType && matchesDate;
    });
  }, [registrations, searchTerm, filter]);

  // Get registration status - SIMPLIFIED but returns same structure
  const getRegistrationStatus = useCallback(() => {
    return { text: "Confirmed", color: "green", bgClass: "bg-green-600 text-white" };
  }, []);

  // ================ HANDLE UNENROLL - HARD DELETE ================
  const handleUnregister = useCallback(async (registrationId, eventTitle) => {
    const confirmed = await showUnenrollConfirmation(eventTitle);
    if (!confirmed) return;

    setUnenrollLoading((prev) => ({ ...prev, [registrationId]: true }));

    try {
      // HARD DELETE - Single API call
      await api.patch(`/registrations/${registrationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update React Query cache optimistically
      queryClient.setQueryData(REGISTRATION_KEYS.my(), (oldData) => {
        if (!oldData) return [];
        return oldData.filter((reg) => reg._id !== registrationId);
      });
      
      showSuccessToast(`Successfully unenrolled from "${eventTitle}"`);
      
    } catch (error) {
      console.error("Error unregistering:", error);
      
      const errorMsg = error.response?.data?.message || "Failed to unregister";
      
      if (error.response?.status === 404) {
        // If registration not found, remove from cache
        queryClient.setQueryData(REGISTRATION_KEYS.my(), (oldData) => {
          if (!oldData) return [];
          return oldData.filter((reg) => reg._id !== registrationId);
        });
        showErrorToast("Registration not found");
      } else if (errorMsg.includes("deadline")) {
        showErrorToast("Registration deadline has passed! Cannot unenroll.");
      } else if (errorMsg.includes("checked in")) {
        showErrorToast("You have already checked in for this event!");
      } else if (errorMsg.includes("started")) {
        showErrorToast("Event has already started!");
      } else {
        showErrorToast(errorMsg);
      }
    } finally {
      setUnenrollLoading((prev) => ({ ...prev, [registrationId]: false }));
    }
  }, [token, queryClient]);

  // Modal handlers - EXACTLY SAME
  const handleViewDetails = useCallback((event) => {
    document.body.style.overflow = "hidden";
    setSelectedEventId(event._id);
    setSelectedImageIndex(0);
    setExpandedRules({ general: false, event: false });
    setShowEventModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    document.body.style.overflow = "auto";
    setShowEventModal(false);
    setSelectedEventId(null);
  }, []);

  const toggleRuleSection = useCallback((section) => {
    setExpandedRules((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setFilter("all");
  }, []);

  const handleBrowseEvents = useCallback(() => {
    navigate("/events");
  }, [navigate]);

  // Get selected event from cache
  const selectedEvent = useMemo(() => {
    if (!selectedEventId || !registrations.length) return null;
    const registration = registrations.find(reg => reg.eventId?._id === selectedEventId);
    return registration?.eventId || null;
  }, [selectedEventId, registrations]);

  if (!isAuthenticated) return null;
  if (isLoading) return <LoadingState />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a3e] p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error.message || "Failed to load registrations"}</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-white text-[#1a1a3e] rounded-xl hover:bg-gray-100 font-semibold shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a3e] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <FilterButtons filter={filter} setFilter={setFilter} />

        <h2 className="text-white text-2xl md:text-3xl font-serif mb-8 milonga">
          See all your Registered events
        </h2>

        {filteredRegistrations.length === 0 ? (
          <EmptyState
            searchTerm={searchTerm}
            filter={filter}
            onClear={handleClearFilters}
            onBrowse={handleBrowseEvents}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRegistrations.map((registration) => {
              const event = registration?.eventId;
              if (!event) return null;

              const status = getRegistrationStatus(registration);
              const isLoading = unenrollLoading[registration._id];

              return (
                <div
                  key={registration._id}
                  className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-5 pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm text-gray-600 font-medium">
                        {getCategoryName(event.category)}
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${status.bgClass}`}>
                        {status.text}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#1a1a3e] mb-2 line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4">
                      Date:{" "}
                      <span className="font-semibold text-[#1a1a3e]">
                        {formatDate(event.startTime)}
                      </span>
                    </p>
                  </div>

                  <div className="px-5 pb-5 flex gap-2">
                    {/* Only Unenroll button - no re-enroll */}
                    <button
                      onClick={() => handleUnregister(registration._id, event.title)}
                      disabled={isLoading}
                      className="flex-1 bg-red-600 text-white cursor-pointer rounded-full py-3 px-4 font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4" />
                          Unenroll
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleViewDetails(event)}
                      className="flex-1 bg-white border-2 cursor-pointer border-black text-black rounded-full py-3 px-4 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {showEventModal && selectedEventId && selectedEvent && (
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
          handleEnroll={() => {}}
          isAuthenticated={isAuthenticated}
          token={token}
          user={user}
          userRegistrations={registrations}
        />
      )}
    </div>
  );
};

export default React.memo(UserRegisteredEvents);