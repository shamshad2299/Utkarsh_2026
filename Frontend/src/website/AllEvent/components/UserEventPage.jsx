// website/AllEvent/components/UserRegisteredEvents.js
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
      (reg) => new Date(reg?.eventId?.startTime) >= now,
    ).length;

    const past = registrations.filter(
      (reg) => new Date(reg?.eventId?.startTime) < now,
    ).length;

    const solo = registrations.filter(
      (reg) =>
        reg?.eventId?.eventType === "solo" ||
        (reg?.teamId === null && reg?.team === null),
    ).length;

    const team = registrations.filter(
      (reg) =>
        reg?.eventId?.eventType !== "solo" ||
        reg?.teamId !== null ||
        reg?.team !== null,
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

  // Get event status
  const getEventStatus = (event) => {
    if (!event || !event.startTime)
      return { text: "Unknown", color: "gray", icon: AlertCircle };

    const now = new Date();
    const eventDate = new Date(event.startTime);
    const regDeadline = new Date(event.registrationDeadline);

    if (now > eventDate)
      return { text: "Completed", color: "gray", icon: CheckCircle };
    if (now > regDeadline)
      return { text: "Registration Closed", color: "red", icon: AlertCircle };
    if (eventDate > now)
      return { text: "Upcoming", color: "green", icon: Calendar };

    return { text: "Ongoing", color: "blue", icon: Clock };
  };

  // Get registration status
  const getRegistrationStatus = (registration) => {
    const status = registration?.status?.toLowerCase() || "pending";
    const payment = registration?.paymentStatus?.toLowerCase() || "pending";
    const checkedIn = registration?.checkedIn || false;

    if (checkedIn) {
      return { text: "Checked In", color: "green" };
    } else if (status === "confirmed" && payment === "paid") {
      return { text: "Confirmed & Paid", color: "green" };
    } else if (status === "confirmed" && payment !== "paid") {
      return { text: "Confirmed (Payment Pending)", color: "yellow" };
    } else if (status === "pending") {
      return { text: "Pending Approval", color: "orange" };
    } else if (status === "cancelled") {
      return { text: "Cancelled", color: "red" };
    } else {
      return { text: "Registered", color: "blue" };
    }
  };

  // Handle event details view
  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setSelectedImageIndex(0);
    setExpandedRules({
      general: false,
      event: false,
    });
    setShowEventModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  // Handle unregister/withdraw
  const handleUnregister = async (registrationId) => {
    if (
      !window.confirm(
        "Are you sure you want to unregister from this event? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setLoadingDetails(true);

      await api.patch(`/registrations/${registrationId}/cancel`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove from local state
      setRegistrations((prev) =>
        prev.filter((reg) => reg._id !== registrationId),
      );

      // Recalculate stats
      calculateStats(registrations.filter((reg) => reg._id !== registrationId));

      alert("Successfully unregistered from the event!");
    } catch (error) {
      console.error("Error unregistering:", error);
      const errorMsg = error.response?.data?.message || "Failed to unregister";

      if (errorMsg.includes("deadline")) {
        alert("Cannot unregister: Registration deadline has passed");
      } else if (errorMsg.includes("checked in")) {
        alert("Cannot unregister: You have already checked in for this event");
      } else {
        alert(errorMsg);
      }
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    navigate("/login", {
      state: {
        from: "/events/my-registrations",
        message: "Please login to view your registered events",
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#f0e6ff] to-[#d9c8ff] p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-[#8b5cf6] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#2d1b69] mb-4">
              Authentication Required
            </h2>
            <p className="text-[#2d1b69]/80 mb-8">
              Please login to view your registered events
            </p>
            <button
              onClick={handleLoginRedirect}
              className="px-6 py-3 bg-linear-to-r from-[#7c3aed] to-[#8b5cf6] text-white rounded-lg hover:from-[#8b5cf6] hover:to-[#a78bfa] font-medium shadow-lg hover:shadow-xl transition-all"
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
      <div className="min-h-screen bg-linear-to-b from-[#f0e6ff] to-[#d9c8ff] p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-12 h-12 text-[#7c3aed] animate-spin mb-4" />
            <p className="text-[#2d1b69]/80">
              Loading your registered events...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#2d1b69] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#2d1b69] mb-2 milonga">
                My Registered Events
              </h1>
              <p className="text-[#2d1b69]/80">
                Welcome back,{" "}
                <span className="text-[#7c3aed] font-semibold">
                  {user?.name || user?.email}
                </span>
                !
              </p>
            </div>

            <button
              onClick={() => navigate("/events")}
              className="px-6 py-2.5 bg-white/80 backdrop-blur-sm border-2 border-[#7c3aed]/30 text-[#2d1b69] rounded-xl hover:bg-white hover:border-[#7c3aed] hover:shadow-lg transition-all font-medium flex items-center gap-2"
            >
              Browse All Events
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-8">
            {[
              {
                label: "Total",
                value: stats.total,
                icon: CalendarDays,
                bg: "bg-linear-to-br from-purple-100 to-purple-200",
                border: "border-purple-200",
                text: "text-purple-700",
              },
              {
                label: "Upcoming",
                value: stats.upcoming,
                icon: Clock,
                bg: "bg-linear-to-br from-emerald-100 to-emerald-200",
                border: "border-emerald-200",
                text: "text-emerald-700",
              },
              {
                label: "Completed",
                value: stats.past,
                icon: Award,
                bg: "bg-linear-to-br from-blue-100 to-blue-200",
                border: "border-blue-200",
                text: "text-blue-700",
              },
              {
                label: "Solo",
                value: stats.solo,
                icon: User,
                bg: "bg-linear-to-br from-amber-100 to-amber-200",
                border: "border-amber-200",
                text: "text-amber-700",
              },
              {
                label: "Team",
                value: stats.team,
                icon: Users,
                bg: "bg-linear-to-br from-cyan-100 to-cyan-200",
                border: "border-cyan-200",
                text: "text-cyan-700",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl ${stat.bg} border ${stat.border} p-4 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-[#2d1b69]/70">
                      {stat.label}
                    </p>
                    <p className={`text-2xl font-bold ${stat.text}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.text}/20`}>
                    <stat.icon className={`w-6 h-6 ${stat.text}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7c3aed] w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search your registered events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-[#7c3aed]/30 rounded-xl text-[#2d1b69] placeholder-[#2d1b69]/60 focus:outline-none focus:border-[#7c3aed] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {["all", "upcoming", "past", "solo", "team"].map(
                  (filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                        filter === filterType
                          ? "bg-linear-to-r from-[#7c3aed] to-[#8b5cf6] text-white shadow-md"
                          : "bg-white/80 backdrop-blur-sm text-[#2d1b69]/80 hover:text-[#2d1b69] border-2 border-[#7c3aed]/30 hover:border-[#7c3aed] hover:shadow-sm"
                      }`}
                    >
                      {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {error ? (
          <div className="text-center py-12  bg-white/50 backdrop-blur-sm rounded-2xl border border-[#7c3aed]/30">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchUserRegistrations}
              className="mt-4 px-6 py-2 bg-linear-to-r from-[#7c3aed] to-[#8b5cf6] text-white rounded-lg hover:from-[#8b5cf6] hover:to-[#a78bfa] shadow-md hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="text-center py-12  border-2 border-dashed border-[#7c3aed]/30 rounded-2xl bg-white/50 backdrop-blur-sm">
            {searchTerm || filter !== "all" ? (
              <>
                <Search className="w-16 h-16 text-[#7c3aed]/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#2d1b69]/80 mb-2">
                  No Events Found
                </h3>
                <p className="text-[#2d1b69]/60 mb-4">
                  {searchTerm
                    ? "No registered events match your search"
                    : `No ${filter} events found in your registrations`}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                  className="px-4 py-2 text-[#7c3aed] hover:text-[#8b5cf6] font-medium"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <Calendar className="w-16 h-16 text-[#7c3aed]/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#2d1b69]/80 mb-2">
                  No Registered Events
                </h3>
                <p className="text-[#2d1b69]/60 mb-6">
                  You haven't registered for any events yet
                </p>
                <button
                  onClick={() => navigate("/events")}
                  className="px-6 py-3 bg-linear-to-r from-[#7c3aed] to-[#8b5cf6] text-white rounded-lg hover:from-[#8b5cf6] hover:to-[#a78bfa] font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                >
                  Browse Events
                  <ExternalLink size={18} />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 ">
            {filteredRegistrations.map((registration) => {
              const event = registration?.eventId;
              if (!event) return null;

              const eventStatus = getEventStatus(event);
              const registrationStatus = getRegistrationStatus(registration);
              const categoryName = getCategoryName(event.category);
              const categoryIcon = getCategoryIcon(categoryName);
              const categoryColor = getCategoryColor(categoryName);
              const eventTypeText = getEventTypeText(
                event.teamSize,
                event.eventType,
              );
              const imageUrl = getImageUrl(event.images);

              // Check if unregister is allowed
              const now = new Date();
              const eventDate = new Date(event.startTime);
              const canUnregister =
                now < eventDate &&
                registration.status !== "cancelled" &&
                !registration.checkedIn;

              return (
                <div
                  key={registration._id}
                  className="
    bg-linear-to-br 
    from-[#cfd9f1] via-[#807cb3] to-[#84b823]
    backdrop-blur-xl
    rounded-2xl
    border border-violet-500/30
    shadow-[0_0_30px_rgba(124,58,237,0.25)]
    hover:shadow-[0_0_45px_rgba(124,58,237,0.45)]
    hover:border-violet-400/60
    transition-all duration-300
    group cursor-pointer
  "
                  onClick={() => handleViewDetails(event)}
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-r from-[#7c3aed]/20 to-[#8b5cf6]/20 flex items-center justify-center">
                        <Calendar className="w-16 h-16 " />
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md bg-white/90 shadow-md"
                        style={{
                          color: categoryColor,
                        }}
                      >
                        {React.createElement(categoryIcon, { size: 14 })}
                        {categoryName}
                      </span>
                    </div>
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-md ${
                          registrationStatus.color === "green"
                            ? "bg-green-500/90 text-white"
                            : registrationStatus.color === "yellow"
                              ? "bg-yellow-500/90 text-white"
                              : registrationStatus.color === "orange"
                                ? "bg-orange-500/90 text-white"
                                : registrationStatus.color === "red"
                                  ? "bg-red-500/90 text-white"
                                  : "bg-blue-500/90 text-white"
                        }`}
                      >
                        {registrationStatus.text}
                      </span>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-5">
                    {/* Event Type Badge */}
                    <div className="mb-3">
                      <span className="px-2.5 py-1 bg-[#7c3aed]/10  rounded-full text-xs font-semibold">
                        {eventTypeText}
                      </span>
                    </div>

                    {/* Event Title - Larger */}
                    <h3 className="text-xl font-bold text-[#2d1b69] mb-3 line-clamp-2 group-hover:text-[#7c3aed] transition-colors">
                      {event.title}
                    </h3>

                    {/* Event Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#7c3aed] shrink-0" />
                        <div>
                          <p className="text-xs text-[#2d1b69]/70">Date</p>
                          <p className="text-sm font-medium text-[#2d1b69]">
                            {formatDate(event.startTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#7c3aed] shrink-0" />
                        <div>
                          <p className="text-xs text-[#2d1b69]/70">Time</p>
                          <p className="text-sm font-medium text-[#2d1b69]">
                            {formatTime(event.startTime)}
                          </p>
                        </div>
                      </div>

                      {event.venueName && (
                        <div className="flex items-center gap-2 col-span-2">
                          <MapPin className="w-4 h-4 text-[#7c3aed] shrink-0" />
                          <div>
                            <p className="text-xs text-[#2d1b69]/70">Venue</p>
                            <p className="text-sm font-medium text-[#2d1b69] truncate">
                              {event.venueName}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Fee and Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#7c3aed]/20">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-[#7c3aed]" />
                        <span className="text-lg font-bold text-[#2d1b69]">
                          ₹{event.fee || 0}
                        </span>
                        {event.fee === 0 && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                            Free
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(event);
                          }}
                          className="px-3 py-1.5 bg-[#7c3aed]/10 text-[#7c3aed] rounded-lg hover:bg-[#7c3aed] hover:text-white transition-colors text-xs font-medium flex items-center gap-1.5"
                        >
                          <Eye size={14} />
                          View
                        </button>

                        {canUnregister && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnregister(registration._id);
                            }}
                            disabled={loadingDetails}
                            className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium flex items-center gap-1.5"
                          >
                            {loadingDetails ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <XCircle size={14} />
                            )}
                            Unregister
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Team Info (if applicable) */}
                    {registration.teamId && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-blue-600">
                            Team Registration
                          </span>
                        </div>
                      </div>
                    )}
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
          handleCloseModal={handleCloseModal}
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
