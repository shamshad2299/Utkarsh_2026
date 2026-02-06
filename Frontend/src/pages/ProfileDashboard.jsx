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
  ShieldCheck,
  Save,
  X,
  Edit,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { api } from "../api/axios";

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

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

    fetchRegisteredEvents();
  }, [authUser, navigate]);

  const fetchRegisteredEvents = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      
      if (token) {
        setTimeout(() => {
          const sampleEvents = [
            {
              id: 1,
              title: "Hackathon 2026",
              category: "Technical Event",
              date: "26 Feb 2026",
              status: "Confirmed",
            },
            {
              id: 2,
              title: "Dance Battle",
              category: "Cultural Event",
              date: "27 Feb 2026",
              status: authUser.email === "aditya@gmail.com" ? "Confirmed" : "Pending",
            },
            {
              id: 3,
              title: "EDM Night Pass",
              category: "Concert",
              date: "28 Feb 2026",
              status: "Pending",
            },
          ];
          setRegisteredEvents(sampleEvents);
          setLoading(false);
        }, 500);
      } else {
        setRegisteredEvents([]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setRegisteredEvents([]);
      setLoading(false);
    }
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

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_40px_rgba(139,92,246,0.08)] p-6">
              <h3 className="text-lg font-bold text-white">Your Summary</h3>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 p-4">
                  <p className="text-xs text-white/70">Registered Events</p>
                  <p className="text-2xl font-extrabold text-white mt-1">
                    {loading ? "..." : registeredEvents.length}
                  </p>
                </div>

                <div className="rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 p-4">
                  <p className="text-xs text-white/70">Member Since</p>
                  <p className="text-base font-bold text-white mt-2">
                    {authUser.createdAt ? formatDateTime(authUser.createdAt) : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_70px_rgba(139,92,246,0.10)] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold">
                    Profile Dashboard
                  </h1>
                  <p className="text-white/70 mt-1 text-sm sm:text-base">
                    Manage your details and view your event registrations.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/")}
                  className="px-5 py-3 rounded-2xl cursor-pointer font-semibold bg-white text-[#080131] hover:bg-gray-100 transition"
                >
                  Back to Home
                </button>
              </div>

              <div className="mt-10">
                <div className="flex items-center gap-2">
                  <CalendarDays size={20} className="text-purple-300" />
                  <h2 className="text-xl font-bold text-white">
                    Your Registered Events
                  </h2>
                </div>

                {loading ? (
                  <div className="mt-8 text-center text-white/70">
                    Loading events...
                  </div>
                ) : (
                  <>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                      {registeredEvents.map((event) => (
                        <div
                          key={event.id}
                          className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-md hover:shadow-xl transition p-6"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs uppercase tracking-widest text-purple-200 font-semibold">
                                {event.category}
                              </p>

                              <h3 className="text-xl font-extrabold text-white mt-2">
                                {event.title}
                              </h3>

                              <p className="text-sm text-white/70 mt-2">
                                Date:{" "}
                                <span className="font-semibold text-white">
                                  {event.date}
                                </span>
                              </p>
                            </div>

                            <span
                              className={`px-4 py-2 rounded-full text-xs font-bold border ${
                                event.status === "Confirmed"
                                  ? "bg-green-500/15 text-green-200 border-green-400/20"
                                  : "bg-yellow-500/15 text-yellow-200 border-yellow-400/20"
                              }`}
                            >
                              {event.status}
                            </span>
                          </div>

                          <div className="mt-6 flex gap-3">
                            <button className="flex-1 py-3 rounded-2xl font-semibold bg-white text-[#080131] hover:bg-gray-100 transition">
                              View Pass
                            </button>

                            <button className="flex-1 py-3 rounded-2xl font-semibold bg-white/10 border border-white/10 hover:bg-white/15 transition text-white">
                              Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {registeredEvents.length === 0 && (
                      <div className="mt-8 text-center text-white/70">
                        No registrations yet.
                      </div>
                    )}
                  </>
                )}
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