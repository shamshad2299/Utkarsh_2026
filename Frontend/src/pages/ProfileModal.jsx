import React from "react";
import {
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Calendar,
  Clock,
  Users,
  IndianRupee,
  Loader2,
  Edit,
  Save,
  LogOut,
} from "lucide-react";

const ProfileModal = ({ isOpen, onClose, authUser, registrations, loadingRegistrations, stats }) => {
  if (!isOpen) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "Time not set";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto no-scrollbar  bg-[#0a0a2e] rounded-3xl border-2 border-dotted border-blue-400">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-10 right-10 bg-blue-950 z-10 p-2  text-white rounded-full hover:bg-white/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="p-1">
                <div className="bg-[#a78bfa] border-2 p-6 border-dashed border-black rounded-3xl outline-6 outline-white">
                  {/* Profile Icon */}
                  <div className="bg-white rounded-2xl w-20 h-20 flex items-center justify-center mb-4 mx-auto">
                    <User className="w-12 h-12 text-[#4a4a6a]" />
                  </div>

                  {/* Name and ID */}
                  <h2 className="text-3xl font-serif text-[#4b4b7a] mb-1 text-center">
                    {authUser.name || "User"}
                  </h2>
                  <p className="text-[#1b1bbe] font-bold text-sm mb-6 text-center">
                    {authUser.userId ||
                      `UTK26-${(authUser._id || "").slice(-5).toUpperCase()}`}
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-[#4b4b7a]">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{authUser.email || "No email"}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[#4b4b7a]">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{authUser.mobile_no || "+91 XXXXX XXXXX"}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[#4b4b7a]">
                      <GraduationCap className="w-4 h-4" />
                      <span className="text-sm">{authUser.college || "College not specified"}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[#44447e]">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{authUser.city || "City not specified"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="bg-[#a78bfa] py-6 px-4 rounded-2xl shadow">
                <h2 className="text-2xl font-semibold text-white mb-4 text-center">
                  Your Summary
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">Total Events</p>
                    <p className="text-2xl font-bold text-[#4b4b7a]">
                      {loadingRegistrations ? (
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                      ) : (
                        stats.total
                      )}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">Upcoming</p>
                    <p className="text-2xl font-bold text-[#4b4b7a]">
                      {loadingRegistrations ? (
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                      ) : (
                        stats.upcoming
                      )}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">Solo Events</p>
                    <p className="text-2xl font-bold text-[#4b4b7a]">{stats.solo}</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">Team Events</p>
                    <p className="text-2xl font-bold text-[#4b4b7a]">{stats.team}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Registered Events */}
            <div className="lg:col-span-2">
              <div className="bg-[#7c7cf5] rounded-3xl p-6">
                <h2 className="text-2xl font-serif text-white mb-6">
                  Your Registered Events
                </h2>

                {loadingRegistrations ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                    <p className="text-white/70">Loading registrations...</p>
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-white/30 rounded-2xl bg-white/10">
                    <Calendar className="w-16 h-16 text-white/50 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No Registered Events
                    </h3>
                    <p className="text-white/70">No events registered yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto  no-scrollbar pr-2">
                    {registrations.map((registration) => {
                      const event = registration?.eventId;
                      if (!event) return null;

                      return (
                        <div
                          key={registration._id}
                          className="bg-white rounded-xl p-4 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-[#4b4b7a]">
                                {event.title}
                              </h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDate(event.startTime)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatTime(event.startTime)}</span>
                                </div>
                                {event.fee > 0 && (
                                  <div className="flex items-center gap-1">
                                    <IndianRupee className="w-3 h-3" />
                                    <span>₹{event.fee}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full max-sm:hidden ${
                              registration.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800'
                                : registration.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {registration.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="mt-6 bg-linear-to-r from-[#7c7cf5] to-[#9f9ff7] rounded-3xl p-6">
                <div className="text-white/90 space-y-3">
                  <p className="font-semibold text-white text-lg mb-2">Profile Information</p>
                  <p>• User ID: {authUser._id}</p>
                  <p>• Account Created: {formatDate(authUser.createdAt)}</p>
                  <p>• Last Updated: {formatDate(authUser.updatedAt)}</p>
                  <p>• Course: {authUser.course || "Not specified"}</p>
                  <p>• Gender: {authUser.gender || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;