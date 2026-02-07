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
  Eye,
  AlertCircle,
  Loader2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { api } from "../api/axios";

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    past: 0,
    solo: 0,
    team: 0,
  });

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
      (reg) => new Date(reg?.eventId?.startTime) >= now
    ).length;
    
    const past = registrations.filter(
      (reg) => new Date(reg?.eventId?.startTime) < now
    ).length;
    
    const solo = registrations.filter(
      (reg) => reg?.eventId?.eventType === "solo" || 
              (reg?.teamId === null && reg?.team === null)
    ).length;
    
    const team = registrations.filter(
      (reg) => reg?.eventId?.eventType !== "solo" || 
              (reg?.teamId !== null || reg?.team !== null)
    ).length;

    setStats({
      total: registrations.length,
      upcoming,
      past,
      solo,
      team,
    });
  };

  // Format date and time helpers
  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Time not set";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
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
      'tech': 'Technical',
      'cultural': 'Cultural',
      'sports': 'Sports',
      'workshop': 'Workshop',
      'concert': 'Concert',
      'gaming': 'Gaming',
      'other': 'Other'
    };
    return categories[category] || 'Event';
  };

  // Handle event details view
  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
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
      const allowedFields = ["name", "mobile_no", "gender", "city", "college", "course"];
      
      allowedFields.forEach(field => {
        if (formData[field] !== undefined && formData[field] !== "" && formData[field] !== authUser[field]) {
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
          text: "Profile updated successfully!" 
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to update profile" 
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

  if (!authUser) {
    return null;
  }

  const formatDateTime = (date) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));

  return (
    <div className="min-h-screen w-full relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-[#080131]" />

      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#4c1d95 1px, transparent 1px), linear-gradient(90deg, #4c1d95 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-700/25 rounded-full blur-[120px]" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-700/25 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Profile Info */}
          <div className="w-full lg:w-[420px]">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_60px_rgba(139,92,246,0.12)] p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg ring-1 ring-white/20">
                  <User size={28} />
                </div>

                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Your Name"
                    />
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-white truncate">
                        {authUser.name || "User"}
                      </h2>
                      <p className="text-sm text-white/70 truncate">
                        {authUser.userId || `UTK26-${(authUser._id || "").slice(-5).toUpperCase()}`}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {/* Email - Not editable */}
                <div className="flex items-center gap-3 text-white/90">
                  <Mail size={18} className="text-purple-300" />
                  <span className="text-sm truncate">{authUser.email || "No email provided"}</span>
                </div>

                {/* Phone Number */}
                <div className="flex items-center gap-3 text-white/90">
                  <Phone size={18} className="text-purple-300" />
                  {isEditing ? (
                    <input
                      type="tel"
                      name="mobile_no"
                      value={formData.mobile_no}
                      onChange={handleInputChange}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  ) : (
                    <span className="text-sm truncate">
                      {authUser.mobile_no || "+91 XXXXX XXXXX"}
                    </span>
                  )}
                </div>

                {/* College */}
                <div className="flex items-center gap-3 text-white/90">
                  <GraduationCap size={18} className="text-purple-300" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Your College"
                    />
                  ) : (
                    <span className="text-sm truncate">
                      {authUser.college || "College not specified"}
                    </span>
                  )}
                </div>

                {/* City */}
                <div className="flex items-center gap-3 text-white/90">
                  <MapPin size={18} className="text-purple-300" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Your City"
                    />
                  ) : (
                    <span className="text-sm truncate">
                      {authUser.city || "City not specified"}
                    </span>
                  )}
                </div>

                {/* Course - Only show in edit mode */}
                {isEditing && (
                  <div className="flex items-center gap-3 text-white/90">
                    <GraduationCap size={18} className="text-purple-300" />
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Your Course"
                    />
                  </div>
                )}

                {/* Gender - Only show in edit mode */}
                {isEditing && (
                  <div className="flex items-center gap-3 text-white/90">
                    <User size={18} className="text-purple-300" />
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                <div className={`mt-4 p-3 rounded-lg text-sm ${
                  saveMessage.type === "success" 
                    ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                    : saveMessage.type === "error"
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                }`}>
                  {saveMessage.text}
                </div>
              )}

              <div className="mt-8 flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex-1 py-3 rounded-2xl font-semibold bg-green-600 hover:bg-green-700 text-white transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="w-14 h-14 rounded-2xl bg-red-600/20 backdrop-blur-xl border border-red-500/30 hover:bg-red-600/30 flex items-center justify-center transition disabled:opacity-50"
                      title="Cancel"
                    >
                      <X size={20} className="text-white" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 py-3 rounded-2xl cursor-pointer font-semibold bg-white text-[#080131] hover:bg-gray-100 transition flex items-center justify-center gap-2"
                      title="Edit"
                    >
                      <Edit size={18} />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-14 h-14 rounded-2xl cursor-pointer bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/15 flex items-center justify-center transition"
                      title="Logout"
                    >
                      <LogOut size={20} className="text-white" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats Summary Card */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_40px_rgba(139,92,246,0.08)] p-6">
              <h3 className="text-lg font-bold text-white">Event Summary</h3>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 p-4">
                  <p className="text-xs text-white/70">Total Events</p>
                  <p className="text-2xl font-extrabold text-white mt-1">
                    {loadingRegistrations ? (
                      <Loader2 size={20} className="animate-spin mx-auto" />
                    ) : (
                      stats.total
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 p-4">
                  <p className="text-xs text-white/70">Upcoming</p>
                  <p className="text-2xl font-extrabold text-white mt-1">
                    {loadingRegistrations ? (
                      <Loader2 size={20} className="animate-spin mx-auto" />
                    ) : (
                      stats.upcoming
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 p-4">
                  <p className="text-xs text-white/70">Solo Events</p>
                  <p className="text-2xl font-extrabold text-white mt-1">
                    {loadingRegistrations ? (
                      <Loader2 size={20} className="animate-spin mx-auto" />
                    ) : (
                      stats.solo
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 p-4">
                  <p className="text-xs text-white/70">Team Events</p>
                  <p className="text-2xl font-extrabold text-white mt-1">
                    {loadingRegistrations ? (
                      <Loader2 size={20} className="animate-spin mx-auto" />
                    ) : (
                      stats.team
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 p-4">
                <p className="text-xs text-white/70">Member Since</p>
                <p className="text-base font-bold text-white mt-2">
                  {authUser.createdAt ? formatDateTime(authUser.createdAt) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Registered Events */}
          <div className="flex-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_70px_rgba(139,92,246,0.10)] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold">
                    Your Registered Events
                  </h1>
                  <p className="text-white/70 mt-1 text-sm sm:text-base">
                    View and manage all your event registrations
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/")}
                    className="px-5 py-3 rounded-2xl cursor-pointer font-semibold bg-white/10 border border-white/10 hover:bg-white/15 transition text-white flex items-center gap-2"
                  >
                    Back to Home
                  </button>
                  <button
                    onClick={handleViewAllEvents}
                    className="px-5 py-3 rounded-2xl cursor-pointer font-semibold bg-white text-[#080131] hover:bg-gray-100 transition flex items-center gap-2"
                  >
                    View All
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Events List */}
              <div className="mt-8">
                {loadingRegistrations ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
                    <p className="text-white/70">Loading your registrations...</p>
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-white/20 rounded-2xl bg-white/5">
                    <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white/80 mb-2">
                      No Registered Events
                    </h3>
                    <p className="text-white/60 mb-6">
                      You haven't registered for any events yet
                    </p>
                    <button
                      onClick={() => navigate("/events")}
                      className="px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                    >
                      Browse Events
                      <ExternalLink size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {registrations.slice(0, 6).map((registration) => {
                      const event = registration?.eventId;
                      if (!event) return null;

                      const registrationStatus = getRegistrationStatus(registration);
                      const categoryName = getCategoryName(event.category);
                      const isTeamEvent = registration.teamId || registration.team;

                      return (
                        <div
                          key={registration._id}
                          className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all p-5 cursor-pointer"
      
                        >
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            {/* Event Info */}
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-xs font-semibold">
                                  {categoryName}
                                </span>
                                {isTeamEvent && (
                                  <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <Users size={12} />
                                    Team Event
                                  </span>
                                )}
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    registrationStatus.color === "green"
                                      ? "bg-green-500/20 text-green-200 border border-green-500/30"
                                      : registrationStatus.color === "yellow"
                                      ? "bg-yellow-500/20 text-yellow-200 border border-yellow-500/30"
                                      : registrationStatus.color === "orange"
                                      ? "bg-orange-500/20 text-orange-200 border border-orange-500/30"
                                      : registrationStatus.color === "red"
                                      ? "bg-red-500/20 text-red-200 border border-red-500/30"
                                      : "bg-blue-500/20 text-blue-200 border border-blue-500/30"
                                  }`}
                                >
                                  {registrationStatus.text}
                                </span>
                              </div>

                              <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition-colors mb-2">
                                {event.title}
                              </h3>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                                <div className="flex items-center gap-2">
                                  <Calendar size={16} className="text-purple-300" />
                                  <span>{formatDate(event.startTime)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock size={16} className="text-purple-300" />
                                  <span>{formatTime(event.startTime)}</span>
                                </div>
                                {event.venueName && (
                                  <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-purple-300" />
                                    <span className="truncate max-w-[200px]">{event.venueName}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <IndianRupee size={16} className="text-purple-300" />
                                  <span className="font-medium text-white">
                                    ₹{event.fee || 0}
                                    {event.fee === 0 && " (Free)"}
                                  </span>
                                </div>
                              </div>
                            </div>

                      
                          </div>
                        </div>
                      );
                    })}

                    {/* View All Button (if more than 6 events) */}
                    {registrations.length > 6 && (
                      <div className="text-center pt-4">
                        <button
                          onClick={handleViewAllEvents}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 border border-purple-500/30 hover:border-purple-500/50 rounded-xl text-white font-medium flex items-center gap-2 mx-auto transition-all"
                        >
                          View All {registrations.length} Events
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information Card */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_40px_rgba(139,92,246,0.08)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle size={20} className="text-purple-300" />
                <h3 className="text-lg font-bold text-white">Important Notes</h3>
              </div>
              
              <div className="space-y-3 text-sm text-white/70">
                <p>• You can view all your registered events in the "My Registered Events" page</p>
                <p>• For team events, check your team details in the event page</p>
                <p>• Payment confirmation may take 24-48 hours</p>
                <p>• Contact organizers for any registration issues</p>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-white/40">
              UTKARSH&apos;26 • Profile Dashboard
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;