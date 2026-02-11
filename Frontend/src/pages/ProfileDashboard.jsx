import { ArrowRight, Plus, Eye } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  CalendarDays,
  MapPin,
  LogOut,
  Save,
  X,
  Edit,
  Calendar,
  Clock,
  Users,
  IndianRupee,
  Loader2,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  Trophy,
  Target,
  Zap,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { api } from "../api/axios";
import ProfileModal from "./ProfileModal"; // Modal component import karein

export default function SummaryCard() {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });
  const [unEnrollingId, setUnEnrollingId] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    past: 0,
    solo: 0,
    team: 0,
  });

  // Modal functions
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
      return;
    }

    // Initialize form data with user data
    setFormData({
      name: authUser.name || "",
      email: authUser.email || "",
      mobile_no: authUser.mobile_no || "",
      college: authUser.college || "",
      city: authUser.city || "",
      course: authUser.course || "",
      gender: authUser.gender || "",
    });

    fetchUserRegistrations();
  }, [authUser, navigate]);

  // Fetch actual registered events from API
  const fetchUserRegistrations = async () => {
    try {
      setLoadingRegistrations(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setRegistrations([]);
        setLoadingRegistrations(false);
        setLoading(false);
        return;
      }

      const response = await api.get("/registrations/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const registrationsData = response.data?.data || [];
      setRegistrations(registrationsData);

      // Calculate stats
      calculateStats(registrationsData);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      setRegistrations([]);
    } finally {
      setLoadingRegistrations(false);
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

  // Unenroll/Delete registration function
  const handleUnenroll = async (registrationId, eventTitle) => {
    if (
      !window.confirm(`Are you sure you want to unenroll from "${eventTitle}"?`)
    ) {
      return;
    }

    try {
      setUnEnrollingId(registrationId);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Authentication token not found. Please login again.");
        return;
      }

      const response = await api.patch(
        `/registrations/${registrationId}/cancel`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        // Remove from local state
        setRegistrations((prev) =>
          prev.filter((reg) => reg._id !== registrationId),
        );

        // Recalculate stats
        const updatedRegistrations = registrations.filter(
          (reg) => reg._id !== registrationId,
        );
        calculateStats(updatedRegistrations);

        alert("Successfully unenrolled from the event!");
      }
    } catch (error) {
      console.error("Error unenrolling:", error);
      alert(
        error.response?.data?.message ||
          "Failed to unenroll. Please try again.",
      );
    } finally {
      setUnEnrollingId(null);
    }
  };

  // Format date and time helpers
  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Time not set";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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

  // Get event category name
  const getCategoryName = (category) => {
    const categories = {
      tech: "Technical",
      cultural: "Cultural",
      sports: "Sports",
      workshop: "Workshop",
      concert: "Concert",
      gaming: "Gaming",
      other: "Other",
    };
    return categories[category] || "Event";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setSaveMessage({ type: "", text: "" });

      // Filter out empty values and unchanged values
      const updates = {};
      const allowedFields = [
        "name",
        "mobile_no",
        "gender",
        "city",
        "college",
        "course",
      ];

      allowedFields.forEach((field) => {
        if (
          formData[field] !== undefined &&
          formData[field] !== "" &&
          formData[field] !== authUser[field]
        ) {
          updates[field] = formData[field];
        }
      });

      if (Object.keys(updates).length === 0) {
        setSaveMessage({ type: "warning", text: "No changes to save" });
        setIsEditing(false);
        setIsSaving(false);
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.patch("v1/auth/me", updates, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Update localStorage with new user data
        const updatedUser = { ...authUser, ...updates };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Refresh the page to get updated data from context
        window.location.reload();

        setSaveMessage({
          type: "success",
          text: "Profile updated successfully!",
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to original user data
    setFormData({
      name: authUser.name || "",
      email: authUser.email || "",
      mobile_no: authUser.mobile_no || "",
      college: authUser.college || "",
      city: authUser.city || "",
      course: authUser.course || "",
      gender: authUser.gender || "",
    });
    setIsEditing(false);
    setSaveMessage({ type: "", text: "" });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleViewAllEvents = () => {
    navigate("/my-registrations");
  };

  const handleViewEvent = (eventId) => {
    navigate(`/${eventId}`);
    console.log(eventId)
  };

  const formatDateTime = (date) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));

  if (!authUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a2e] p-6">
      {/* Main container with dotted border */}
      <div className="border-2 border-dotted border-blue-400 rounded-3xl p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card and Summary */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="p-1">
              <div className="bg-[#a78bfa] border-2 p-6 border-dashed border-black rounded-3xl outline-6 outline-white relative">
                {/* View Profile Button */}
                <button
                  onClick={openModal}
                  className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                  title="View Full Profile"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* Profile Icon */}
                <div className="bg-white rounded-2xl w-16 h-16 flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-[#4a4a6a]" />
                </div>

                {/* Name and ID */}
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full text-3xl font-serif text-[#4b4b7a] mb-1 bg-white/50 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your Name"
                  />
                ) : (
                  <h2 className="text-3xl font-serif text-[#4b4b7a] mb-1">
                    {authUser.name || "User"}
                  </h2>
                )}
                <p className="text-[#6b6b8a] text-sm mb-6">
                  {authUser.userId ||
                    `UTK26-${(authUser._id || "").slice(-5).toUpperCase()}`}
                </p>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-[#4b4b7a]">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">
                      {authUser.email || "No email provided"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[#4b4b7a]">
                    <Phone className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="tel"
                        name="mobile_no"
                        value={formData.mobile_no}
                        onChange={handleInputChange}
                        className="flex-1 text-sm bg-white/50 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    ) : (
                      <span className="text-sm">
                        {authUser.mobile_no || "+91 XXXXX XXXXX"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[#4b4b7a]">
                    <GraduationCap className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleInputChange}
                        className="flex-1 text-sm bg-white/50 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your College"
                      />
                    ) : (
                      <span className="text-sm">
                        {authUser.college || "College not specified"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[#44447e]">
                    <MapPin className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="flex-1 text-sm bg-white/50 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your City"
                      />
                    ) : (
                      <span className="text-sm">
                        {authUser.city || "City not specified"}
                      </span>
                    )}
                  </div>

                  {/* Course - Only show in edit mode */}
                  {isEditing && (
                    <div className="flex items-center gap-3 text-[#4b4b7a]">
                      <GraduationCap className="w-4 h-4" />
                      <input
                        type="text"
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        className="flex-1 text-sm bg-white/50 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your Course"
                      />
                    </div>
                  )}

                  {/* Gender - Only show in edit mode */}
                  {isEditing && (
                    <div className="flex items-center gap-3 text-[#4b4b7a]">
                      <User className="w-4 h-4" />
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="flex-1 text-sm bg-white/50 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Save Message */}
                {saveMessage.text && (
                  <div
                    className={`mb-4 p-3 rounded-lg text-sm ${
                      saveMessage.type === "success"
                        ? "bg-green-500/20 text-green-700"
                        : saveMessage.type === "error"
                          ? "bg-red-500/20 text-red-700"
                          : "bg-yellow-500/20 text-yellow-700"
                    }`}
                  >
                    {saveMessage.text}
                  </div>
                )}

                {/* Edit/Save Profile Button */}
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex-1 bg-white text-[#4b4b7a] rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span className="font-medium">Save Profile</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="w-14 bg-white text-[#4b4b7a] rounded-xl py-3 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-white text-[#4b4b7a] rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="font-medium">Edit Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-[#a78bfa] py-8 px-4 rounded-2xl shadow relative">
              <div className="max-w-4xl mx-auto">
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 text-center">
                  Your Summary
                </h2>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Total Events */}
                  <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center relative">
                    <div className="w-18 h-18 bg-[#a78bfa] absolute rounded-full md:-right-12 max-md:top-23"></div>
                    <p className="text-sm text-gray-500 mb-2">Total Events</p>
                    <p className="text-3xl md:text-4xl font-bold text-[#4b4b7a]">
                      {loadingRegistrations ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                      ) : (
                        stats.total
                      )}
                    </p>
                  </div>

                  {/* Upcoming Events */}
                  <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-500 mb-2">
                      Upcoming Events
                    </p>
                    <p className="text-3xl md:text-4xl font-bold text-[#4b4b7a]">
                      {loadingRegistrations ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                      ) : (
                        stats.upcoming
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Content - Left Side Bottom */}
            <div className="bg-[#6b6bf1] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-white" />
                <h3 className="text-xl font-serif text-white">Quick Stats</h3>
              </div>

              <div className="space-y-4">
                {/* Solo vs Team Events */}
                <div className="bg-white/20 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white/90">Solo Events</span>
                    <span className="text-lg font-bold text-white">
                      {stats.solo}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/90">Team Events</span>
                    <span className="text-lg font-bold text-white">
                      {stats.team}
                    </span>
                  </div>
                </div>

                {/* Participation Rate */}
                <div className="bg-white/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-white" />
                    <span className="text-sm text-white/90">Participation</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2 mb-1">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width:
                          stats.total > 0
                            ? `${(stats.past / stats.total) * 100}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-white/70 text-right">
                    {stats.past} of {stats.total} completed
                  </p>
                </div>

                {/* Activity Streak */}
                <div className="bg-white/20 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-300" />
                      <span className="text-sm text-white/90">
                        Active Streak
                      </span>
                    </div>
                    <span className="text-lg font-bold text-yellow-300">
                      {stats.upcoming > 0 ? "🔥" : "—"}
                    </span>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="bg-white/20 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span className="text-sm text-white/90">Completion</span>
                    </div>
                    <span className="text-lg font-bold text-white">
                      {stats.total > 0
                        ? `${Math.round((stats.past / stats.total) * 100)}%`
                        : "0%"}
                    </span>
                  </div>
                  <p className="text-xs text-white/70">
                    {stats.past} events successfully completed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Dashboards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-[#6b6bf1] rounded-3xl p-6 relative">
              <button
                onClick={() => navigate("/")}
                className="absolute top-6 right-6 bg-white text-[#4b4b7a] px-6 py-2 rounded-full flex items-center gap-2 hover:bg-gray-50 transition-colors font-medium cursor-pointer"
              >
                Back To Home
                <ArrowRight className="w-4 h-4" />
              </button>

              <h1 className="text-4xl font-serif text-white mb-2">
                Profile Dashboards
              </h1>
              <p className="text-white/90">
                Manage your details and view your event registrations
              </p>
            </div>

            {/* Your Registered Events Section */}
            <div className="bg-[#7c7cf5] rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-white" />
                  <h2 className="text-2xl font-serif text-white">
                    Your Registered Events
                  </h2>
                </div>
                {registrations.length > 0 && (
                  <button
                    onClick={handleViewAllEvents}
                    className="px-4 py-2 bg-white text-[#4b4b7a] rounded-full flex items-center gap-2 hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {loadingRegistrations ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                  <p className="text-white/70">Loading your registrations...</p>
                </div>
              ) : registrations.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-white/30 rounded-2xl bg-white/10">
                  <Calendar className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Registered Events
                  </h3>
                  <p className="text-white/70 mb-6">
                    You haven't registered for any events yet
                  </p>
                  <button
                    onClick={() => navigate("/events")}
                    className="px-6 py-3 bg-white text-[#4b4b7a] rounded-full hover:bg-gray-100 font-medium flex items-center gap-2 mx-auto transition-all cursor-pointer"
                  >
                    Browse Events
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {registrations.slice(0, 4).map((registration) => {
                    const event = registration?.eventId;
                    if (!event) return null;

                    const registrationStatus =
                      getRegistrationStatus(registration);
                    const categoryName = getCategoryName(event.category);
                    const isTeamEvent =
                      registration.teamId || registration.team;
                    const isPastEvent = new Date(event.startTime) < new Date();

                    return (
                      <div
                        key={registration._id}
                        className="bg-white rounded-2xl p-5"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-xs text-gray-600">
                              {categoryName}
                            </span>
                            <h3 className="text-base sm:text-lg font-semibold text-[#4b4b7a] mt-1 line-clamp-2">
                              {event.title}
                            </h3>

                            <p className="text-sm text-gray-600 mt-1">
                              Date:{" "}
                              <span className="font-medium">
                                {formatDate(event.startTime)}
                              </span>
                            </p>
                            {isTeamEvent && (
                              <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                Team Event
                              </p>
                            )}
                          </div>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium px-4 py-2 ${
                              registrationStatus.color === "green"
                                ? "bg-green-100 text-green-800"
                                : registrationStatus.color === "yellow"
                                  ? "bg-black text-white"
                                  : registrationStatus.color === "orange"
                                    ? "bg-orange-100 text-orange-800"
                                    : registrationStatus.color === "red"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {registrationStatus.text.substring(0, 10)}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(event.startTime)}</span>
                          </div>
                          {event.fee > 0 && (
                            <div className="flex items-center gap-1">
                              <IndianRupee className="w-4 h-4" />
                              <span>₹{event.fee}</span>
                            </div>
                          )}
                        </div>

                        {/* Button Group */}
                        <div className="flex gap-2 mt-4">
                          {/* Details Button - Always shown */}
                          <button
                            onClick={() => handleViewEvent(event._id)}
                            className="flex-1 bg-black text-white rounded-full py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer"
                          >
                            <span className="text-sm font-medium">Details</span>
                            <Plus className="w-4 h-4" />
                          </button>

                          {/* Conditional Buttons */}
                          {registration.paymentStatus === "pending" &&
                          event.fee < 0 ? (
                            // Pay Now button for pending payments
                            <button
                              className="flex-1 bg-yellow-500 text-white rounded-full py-2 px-4 flex items-center justify-center gap-2 hover:bg-yellow-600 transition-colors cursor-pointer"
                              onClick={() => {
                                alert("Payment integration will be added here");
                              }}
                            >
                              <IndianRupee className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                Pay Now
                              </span>
                            </button>
                          ) : !isPastEvent ? (
                            // Unenroll button for upcoming events
                            <button
                              onClick={() =>
                                handleUnenroll(registration._id, event.title)
                              }
                              disabled={unEnrollingId === registration._id}
                              className="flex-1 bg-red-400 text-white rounded-full py-2 px-4 flex items-center justify-center gap-2 hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {unEnrollingId === registration._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <X className="w-4 h-4" />
                                  <span className="text-sm font-medium">
                                    Unenroll
                                  </span>
                                </>
                              )}
                            </button>
                          ) : (
                            // Past event indicator
                            <button
                              disabled
                              className="flex-1 bg-gray-300 text-gray-600 rounded-full py-2 px-4 flex items-center justify-center gap-2 cursor-not-allowed"
                            >
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                Completed
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Additional Information Card */}
            <div className="bg-gradient-to-r from-[#7c7cf5] to-[#9f9ff7] rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-serif text-white">
                  Important Notes
                </h2>
              </div>

              <div className="space-y-3 text-white/90">
                <p>
                  • You can unenroll from events up to 24 hours before the event
                  starts
                </p>
                <p>
                  • For team events, check your team details in the event page
                </p>
                <p>• Payment confirmation may take 24-48 hours</p>
                <p>• Contact organizers for any registration issues</p>
                <p className="text-sm text-white/70 italic mt-4">
                  Member Since:{" "}
                  {authUser.createdAt
                    ? formatDateTime(authUser.createdAt)
                    : "N/A"}
                </p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="mt-6 w-full bg-white/20 text-white rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-white/30 transition-colors cursor-pointer border border-white/30"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isModalOpen}
        onClose={closeModal}
        authUser={authUser}
        registrations={registrations}
        loadingRegistrations={loadingRegistrations}
        stats={stats}
      />
    </div>
  );
}