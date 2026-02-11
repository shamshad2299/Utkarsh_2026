import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  Search,
  AlertCircle,
  CheckCircle,
  User,
  Award,
  CalendarDays,
  Loader2,
  IndianRupee,
  XCircle,
  Eye,
  ChevronRight,
  ExternalLink,
  Hand,
  Timer,
  Trophy,
  UserCircle,
  UsersRound,
  LogOut,
} from "lucide-react";
import { api } from "../../../api/axios";
import { useAuth } from "../../../Context/AuthContext";
import EventDetailModal from "./EventDetailModal";
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

const UserRegisteredEvents = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Check authentication
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const token = localStorage.getItem("accessToken");

  // States
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Modal states
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expandedRules, setExpandedRules] = useState({
    general: false,
    event: false,
  });

  // States for unenroll loading per event
  const [unenrollLoading, setUnenrollLoading] = useState({});

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    past: 0,
    solo: 0,
    team: 0,
  });

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: "/events/my-registrations",
          message: "Please login to view your registered events",
        },
      });
      return;
    }

    fetchUserRegistrations();
  }, [isAuthenticated, token, navigate]);

  // Fetch user's registrations
  const fetchUserRegistrations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/registrations/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Get registrations array safely
      const registrationsData = response.data?.data || [];
      setRegistrations(registrationsData);

      // Calculate stats from registrations
      calculateStats(registrationsData);
    } catch (error) {
      console.error("Error fetching registrations:", error);

      if (error.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      setError("Failed to load your registrations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (registrations) => {
    const now = new Date();

    const upcoming = registrations.filter(
      (reg) => new Date(reg?.eventId?.startTime) >= now
    ).length;

    const past = registrations.filter(
      (reg) => new Date(reg?.eventId?.startTime) < now
    ).length;

    const solo = registrations.filter(
      (reg) =>
        reg?.eventId?.eventType === "solo" ||
        (reg?.teamId === null && reg?.team === null)
    ).length;

    const team = registrations.filter(
      (reg) =>
        reg?.eventId?.eventType !== "solo" ||
        reg?.teamId !== null ||
        reg?.team !== null
    ).length;

    setStats({
      total: registrations.length,
      upcoming,
      past,
      solo,
      team,
    });
  };

  // Filter registrations
  const filteredRegistrations = registrations.filter((registration) => {
    const event = registration?.eventId;
    if (!event) return false;

    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // Type filter
    let matchesType = true;
    if (filter === "solo") {
      matchesType =
        event.eventType === "solo" ||
        (registration?.teamId === null && registration?.team === null);
    }
    if (filter === "team") {
      matchesType =
        event.eventType !== "solo" ||
        registration?.teamId !== null ||
        registration?.team !== null;
    }

    // Date filter
    let matchesDate = true;
    const now = new Date();
    const eventDate = new Date(event.startTime);

    if (filter === "upcoming") matchesDate = eventDate >= now;
    if (filter === "past") matchesDate = eventDate < now;

    return matchesSearch && matchesType && matchesDate;
  });

  // Get registration status
  const getRegistrationStatus = (registration) => {
    const status = registration?.status?.toLowerCase() || "pending";
    const payment = registration?.paymentStatus?.toLowerCase() || "pending";
    const checkedIn = registration?.checkedIn || false;

    if (checkedIn) {
      return { text: "Checked In", color: "green" };
    } else if (status === "confirmed" && payment === "paid") {
      return { text: "Confirmed", color: "green" };
    } else if (status === "confirmed" && payment !== "paid") {
      return { text: "Confirmed", color: "green" };
    } else if (status === "pending") {
      return { text: "Pending", color: "orange" };
    } else if (status === "cancelled") {
      return { text: "Cancelled", color: "red" };
    } else {
      return { text: "Confirmed", color: "green" };
    }
  };

  // Handle event details view
  const handleViewDetails = (event) => {
    navigate(`/${event._id}`);
  };

  // Handle unregister/withdraw
  const handleUnregister = async (registrationId, eventTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to unregister from "${eventTitle}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      // Set loading state for this specific event
      setUnenrollLoading((prev) => ({ ...prev, [registrationId]: true }));

      await api.patch(
        `/registrations/${registrationId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove from local state
      setRegistrations((prev) =>
        prev.filter((reg) => reg._id !== registrationId)
      );

      // Recalculate stats
      const updatedRegs = registrations.filter(
        (reg) => reg._id !== registrationId
      );
      calculateStats(updatedRegs);

      // Remove loading state
      setUnenrollLoading((prev) => ({ ...prev, [registrationId]: false }));

      alert("Successfully unregistered from the event!");
    } catch (error) {
      console.error("Error unregistering:", error);
      
      // Remove loading state on error
      setUnenrollLoading((prev) => ({ ...prev, [registrationId]: false }));
      
      const errorMsg = error.response?.data?.message || "Failed to unregister";
      const statusCode = error.response?.status;

      if (statusCode === 400 && errorMsg.includes("deadline")) {
        alert("Cannot unregister: Registration deadline has passed");
      } else if (statusCode === 400 && errorMsg.includes("checked in")) {
        alert("Cannot unregister: You have already checked in for this event");
      } else if (statusCode === 404) {
        alert("Registration not found or already cancelled");
      } else if (statusCode === 403) {
        alert("You don't have permission to cancel this registration");
      } else if (statusCode === 409) {
        alert("Cannot unregister: Event has already started or ended");
      } else {
        alert(errorMsg || "Failed to unregister. Please try again.");
      }
    }
  };

  // Filter button config with hand-drawn style icons
  const filterButtons = [
    {
      id: "all",
      label: "All types",
      icon: Hand,
      color: "bg-[#c4b5fd]",
      textColor: "text-[#1a1a3e]",
    },
    {
      id: "upcoming",
      label: "Upcoming",
      icon: Timer,
      color: "bg-white",
      textColor: "text-[#1a1a3e]",
    },
    {
      id: "past",
      label: "Past",
      icon: Trophy,
      color: "bg-white",
      textColor: "text-[#1a1a3e]",
    },
    {
      id: "solo",
      label: "Solo",
      icon: UserCircle,
      color: "bg-white",
      textColor: "text-[#1a1a3e]",
    },
    {
      id: "team",
      label: "Team",
      icon: UsersRound,
      color: "bg-white",
      textColor: "text-[#1a1a3e]",
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1a1a3e] p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Authentication Required
            </h2>
            <p className="text-white/80 mb-8">
              Please login to view your registered events
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-white text-[#1a1a3e] rounded-xl hover:bg-gray-100 font-semibold shadow-lg transition-all"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a3e] p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
            <p className="text-white/80 text-lg">
              Loading your registered events...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a3e] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-4xl ">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Your registered events"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-2 bg-white rounded-2xl text-[#1a1a3e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c4b5fd] text-base shadow-lg"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {filterButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`${
                  filter === btn.id ? btn.color : "bg-white"
                } ${btn.textColor} px-6 py-4 rounded-2xl font-medium transition-all shadow-md hover:shadow-lg hover:scale-105 flex flex-col items-center gap-2 min-w-[100px]`}
              >
                <btn.icon className="w-8 h-8" strokeWidth={1.5} />
                <span className="text-sm">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-white text-2xl md:text-3xl font-serif mb-8 milonga">
          See all your Registered events
        </h2>

        {/* Content */}
        {error ? (
          <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchUserRegistrations}
              className="px-6 py-3 bg-white text-[#1a1a3e] rounded-xl hover:bg-gray-100 font-semibold shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-2xl">
            {searchTerm || filter !== "all" ? (
              <>
                <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Events Found
                </h3>
                <p className="text-white/60 mb-4">
                  {searchTerm
                    ? "No registered events match your search"
                    : `No ${filter} events found in your registrations`}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                  className="px-6 py-3 bg-white text-[#1a1a3e] rounded-xl hover:bg-gray-100 font-semibold shadow-lg transition-all"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Registered Events
                </h3>
                <p className="text-white/60 mb-6">
                  You haven't registered for any events yet
                </p>
                <button
                  onClick={() => navigate("/events")}
                  className="px-6 py-3 bg-white text-[#1a1a3e] rounded-xl hover:bg-gray-100 font-semibold shadow-lg transition-all inline-flex items-center gap-2"
                >
                  Browse Events
                  <ExternalLink size={18} />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRegistrations.map((registration) => {
              const event = registration?.eventId;
              if (!event) return null;

              const registrationStatus = getRegistrationStatus(registration);
              const categoryName = getCategoryName(event.category);

              // Check if unregister is allowed
              const now = new Date();
              const eventDate = new Date(event.startTime);
              const canUnregister =
                now < eventDate &&
                registration.status !== "cancelled" &&
                !registration.checkedIn &&
                registrationStatus.text !== "Cancelled";

              return (
                <div
                  key={registration._id}
                  className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Header */}
                  <div className="p-5 pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm text-gray-600 font-medium">
                        {categoryName}
                      </span>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          registrationStatus.color === "green"
                            ? "bg-black text-white"
                            : registrationStatus.color === "orange"
                              ? "bg-orange-500 text-white"
                              : registrationStatus.color === "red"
                                ? "bg-red-500 text-white"
                                : "bg-blue-500 text-white"
                        }`}
                      >
                        {registrationStatus.text}
                      </span>
                    </div>

                    {/* Event Title */}
                    <h3 className="text-xl font-bold text-[#1a1a3e] mb-2 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Date */}
                    <p className="text-sm text-gray-600 mb-4">
                      Date:{" "}
                      <span className="font-semibold text-[#1a1a3e]">
                        {formatDate(event.startTime)}
                      </span>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-5 pb-5 flex gap-2">
                    <button
                      onClick={() =>
                        handleUnregister(registration._id, event.title)
                      }
                      disabled={!canUnregister || unenrollLoading[registration._id]}
                      className={`flex-1 rounded-full py-3 px-4 font-semibold transition-all flex items-center justify-center gap-2 shadow-md ${
                        canUnregister
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {unenrollLoading[registration._id] ? (
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
      {showEventModal && selectedEvent && (
        <EventDetailModal
          selectedEvent={selectedEvent}
          handleCloseModal={() => setShowEventModal(false)}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          expandedRules={expandedRules}
          toggleRuleSection={(section) => {
            setExpandedRules((prev) => ({
              ...prev,
              [section]: !prev[section],
            }));
          }}
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
    </div>
  );
};

export default UserRegisteredEvents;