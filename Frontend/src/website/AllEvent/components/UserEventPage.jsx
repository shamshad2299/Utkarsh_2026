import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
} from "../../utils/eventUtils";

// Query Keys
const REGISTRATION_KEYS = {
  all: ["registrations"],
  my: () => [...REGISTRATION_KEYS.all, "my"],
};

// Constants
const FILTER_BUTTONS = [
  { id: "all", label: "All types", icon: Hand, color: "bg-[#c4b5fd]", textColor: "text-[#1a1a3e]" },
  { id: "upcoming", label: "Upcoming", icon: Timer, color: "bg-white", textColor: "text-[#1a1a3e]" },
  { id: "past", label: "Past", icon: Trophy, color: "bg-white", textColor: "text-[#1a1a3e]" },
  { id: "solo", label: "Solo", icon: UserCircle, color: "bg-white", textColor: "text-[#1a1a3e]" },
  { id: "team", label: "Team", icon: UsersRound, color: "bg-white", textColor: "text-[#1a1a3e]" },
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

// Toast Helpers
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
}

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

// ================ CONFIRMATION MODALS ================
const showUnenrollConfirmation = async (eventTitle) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    html: `
      <div style="text-align: center; padding: 10px;">
        <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
        <p style="color: #1a1a3e; font-size: 18px; margin-bottom: 15px; font-weight: 500;">
          You are about to unenroll from:
        </p>
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
                    padding: 16px; border-radius: 14px; margin: 15px 0;
                    box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.3);">
          <p style="color: white; font-size: 20px; font-weight: bold; margin: 0;">
            ${eventTitle}
          </p>
        </div>
        <p style="color: #4b5563; font-size: 15px; margin-top: 20px;">
          You can re-enroll later if spots are still available.
        </p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 10px; font-style: italic;">
          This action can be undone by re-enrolling.
        </p>
      </div>
    `,
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

const showReenrollmentConfirmation = async (eventTitle) => {
  const result = await Swal.fire({
    title: "Welcome Back! 👋",
    html: `
      <div style="text-align: center; padding: 10px;">
        <div style="font-size: 48px; margin-bottom: 20px;">🔄</div>
        <p style="color: #1a1a3e; font-size: 18px; margin-bottom: 10px; font-weight: 500;">
          You had previously unenrolled from:
        </p>
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
                    padding: 16px; border-radius: 14px; margin: 15px 0;
                    box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.3);">
          <p style="color: white; font-size: 20px; font-weight: bold; margin: 0;">
            ${eventTitle}
          </p>
        </div>
        <p style="color: #4b5563; font-size: 16px; margin-top: 20px; font-weight: 500;">
          Would you like to re-enroll and secure your spot again?
        </p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
          Your previous registration will be restored.
        </p>
      </div>
    `,
    icon: "question",
    iconColor: "#f59e0b",
    showCancelButton: true,
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Re-enroll Now!",
    cancelButtonText: "Not Now",
    background: "#ffffff",
    backdrop: "rgba(245, 158, 11, 0.2)",
    customClass: {
      popup: "rounded-3xl shadow-2xl",
      confirmButton: "rounded-full px-6 py-2.5 font-semibold",
      cancelButton: "rounded-full px-6 py-2.5 font-semibold",
    },
  });
  return result.isConfirmed;
};

const showReenrollmentSuccess = async (eventTitle) => {
  triggerConfetti();
  
  await Swal.fire({
    title: "🎉 Welcome Back!",
    html: `
      <div style="text-align: center; padding: 15px;">
        <div style="font-size: 64px; margin-bottom: 20px; animation: bounce 1s infinite;">✨</div>
        <h3 style="color: #1a1a3e; font-size: 28px; margin-bottom: 15px; font-weight: bold;">
          Successfully Re-enrolled!
        </h3>
        <p style="color: #4b5563; font-size: 16px; margin-bottom: 10px;">
          You are now registered again for:
        </p>
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                    padding: 18px; border-radius: 16px; margin: 20px 0;
                    box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.4);">
          <p style="color: white; font-size: 22px; font-weight: bold; margin: 0;">
            ${eventTitle}
          </p>
        </div>
        <p style="color: #6b7280; font-size: 15px; margin-top: 20px;">
          Thank you for re-joining us! We're excited to have you back. 🌟
        </p>
      </div>
    `,
    icon: "success",
    iconColor: "#10b981",
    confirmButtonColor: "#8b5cf6",
    confirmButtonText: "Continue",
    background: "#ffffff",
    backdrop: "rgba(16, 185, 129, 0.2)",
    showClass: {
      popup: 'animate__animated animate__zoomIn'
    },
    customClass: {
      popup: "rounded-3xl shadow-2xl",
      confirmButton: "rounded-full px-8 py-3 font-semibold",
    },
  });
};

// ================ MEMOIZED COMPONENTS ================
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
            className="px-6 py-3 bg-white text-[#1a1a3e] rounded-xl hover:bg-gray-100 font-semibold shadow-lg transition-all inline-flex items-center gap-2"
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

  // Local state
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
  const [enrollingEventId, setEnrollingEventId] = useState(null);
  //const [registrations , setRegistrations] = useState([]);

  // Fetch user registrations with React Query
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
    cacheTime: 30 * 60 * 1000,
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

  // Filter registrations
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

  // Get registration status
  const getRegistrationStatus = useCallback((registration) => {
    if (registration.isDeleted && registration.status === "cancelled") {
      return { text: "Cancelled", color: "red", bgClass: "bg-red-500 text-white" };
    }
    if (registration.checkedIn) {
      return { text: "Checked In", color: "green", bgClass: "bg-green-600 text-white" };
    }
    if (registration.status === "confirmed") {
      return { text: "Confirmed", color: "green", bgClass: "bg-green-600 text-white" };
    }
    if (registration.status === "pending") {
      return { text: "Pending", color: "orange", bgClass: "bg-orange-500 text-white" };
    }
    return { text: "Confirmed", color: "green", bgClass: "bg-green-600 text-white" };
  }, []);

  // ================ HANDLE UNENROLL ================
const handleUnregister = useCallback(async (registrationId, eventTitle) => {
  const confirmed = await showUnenrollConfirmation(eventTitle);
  if (!confirmed) return;

  setUnenrollLoading((prev) => ({ ...prev, [registrationId]: true }));

  try {
    // Try different endpoint patterns
    let response;
    
    // Pattern 1: PATCH to /registrations/:id
    try {
      response = await api.patch(
        `/registrations/${registrationId}/cancel`,
        { status: 'cancelled' }, // Some APIs expect the status in body
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      if (err.response?.status === 404) {
        // Pattern 2: DELETE to /registrations/:id
        response = await api.delete(
          `/registrations/${registrationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        throw err;
      }
    }

    // Update React Query cache
    queryClient.setQueryData(REGISTRATION_KEYS.my(), (oldData) => {
      if (!oldData) return [];
      return oldData.filter((reg) => reg._id !== registrationId);
    });
    
    showSuccessToast(`Successfully unenrolled from "${eventTitle}"`);
    
  } catch (error) {
    console.error("Error unregistering:", error);
    
    // Better error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
      
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error || 
                      "Failed to unregister";
      
      if (error.response.status === 404) {
        showErrorToast("Registration endpoint not found. Please contact support.");
      } else if (errorMsg.includes("deadline")) {
        showErrorToast("Registration deadline has passed! Cannot unenroll.");
      } else if (errorMsg.includes("checked in")) {
        showErrorToast("You have already checked in for this event!");
      } else if (errorMsg.includes("started")) {
        showErrorToast("Event has already started!");
      } else {
        showErrorToast(errorMsg);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      showErrorToast("No response from server. Please check your connection.");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
      showErrorToast("Failed to send request. Please try again.");
    }
  } finally {
    setUnenrollLoading((prev) => ({ ...prev, [registrationId]: false }));
  }
}, [token, queryClient]);

  // ================ HANDLE RE-ENROLL ================
  const handleReenroll = useCallback(async (registrationId, event, teamId = null) => {
    try {
      const confirmed = await showReenrollmentConfirmation(event.title);
      if (!confirmed) return;

      setEnrollingEventId(event._id);

      const response = await api.patch(
        `/registrations/${registrationId}/restore`,
        { teamId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh registrations
      await refetch();
      
      // Show success modal with confetti
      await showReenrollmentSuccess(event.title);
      
    } catch (error) {
      console.error("Re-enrollment error:", error);
      const errorMsg = error.response?.data?.message || "Failed to re-enroll";
      
      if (errorMsg.includes("deadline")) {
        showErrorToast("Registration deadline has passed! Cannot re-enroll.");
      } else if (errorMsg.includes("full")) {
        showErrorToast("Event is now full! Cannot re-enroll.");
      } else if (errorMsg.includes("team")) {
        showWarningToast("Please select a valid team for re-enrollment");
      } else {
        showErrorToast(errorMsg);
      }
    } finally {
      setEnrollingEventId(null);
    }
  }, [token, refetch]);

  // Modal handlers
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
              const isDeleted = registration.isDeleted && registration.status === "cancelled";

              return (
                <div
                  key={registration._id}
                  className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                    isDeleted ? 'opacity-75 border-2 border-red-300' : ''
                  }`}
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
                    {isDeleted ? (
                      // Show Re-enroll button for cancelled registrations
                      <button
                        onClick={() => handleReenroll(registration._id, event)}
                        disabled={enrollingEventId === event._id}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full py-3 px-4 font-semibold hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        {enrollingEventId === event._id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Re-enrolling...
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4" />
                            Re-enroll Now
                          </>
                        )}
                      </button>
                    ) : (
                      // Show Unenroll button for active registrations
                      <button
                        onClick={() => handleUnregister(registration._id, event.title)}
                        disabled={isLoading}
                        className="flex-1 bg-red-600 text-white rounded-full py-3 px-4 font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-md"
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
                    )}
                    
                    <button
                      onClick={() => handleViewDetails(event)}
                      className="flex-1 bg-white border-2 border-black text-black rounded-full py-3 px-4 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-md"
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
        />
      )}
    </div>
  );
};

export default UserRegisteredEvents;