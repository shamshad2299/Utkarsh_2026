import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  IndianRupee,
  ArrowLeft,
  Share2,
  Bookmark,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Phone,
  Award,
  Zap,
  Trophy,
  Flag,
  Info,
  XCircle,
  Loader2,
  ExternalLink,
  Check,
  Star,
  Heart,
  UserCheck,
  CircleCheck,
} from "lucide-react";
import { api } from "../api/axios";
import { useAuth } from "../Context/AuthContext";

export default function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userRegistration, setUserRegistration] = useState(null);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    checkRegistrationStatus();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/events/${eventId}`);
      console.log(response)

      if (response.data?.success && response.data?.data) {
        setEvent(response.data.data);
      } else {
        setError("Event not found");
      }
    } catch (err) {
      console.error("Error fetching event:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load event details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await api.get("/registrations/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const registrations = response.data?.data || [];
      const registration = registrations.find(
        (reg) => reg?.eventId?._id === eventId || reg?.eventId === eventId
      );

      if (registration) {
        setIsRegistered(true);
        setUserRegistration(registration);
      }
    } catch (err) {
      console.error("Error checking registration:", err);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isRegistered) {
      navigate("/profile");
      return;
    }

    try {
      setRegistering(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.post(
        `/events/${eventId}/register`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setIsRegistered(true);
        setUserRegistration(response.data.data);
        alert("Successfully registered for the event!");
        checkRegistrationStatus();
      }
    } catch (err) {
      console.error("Error registering:", err);
      alert(
        err.response?.data?.message || "Failed to register. Please try again."
      );
    } finally {
      setRegistering(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title || "Event",
          text: event?.description || "Check out this event!",
          url: url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
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

  const getCategoryName = (category) => {
    const categories = {
      tech: "Technical Events",
      cultural: "Cultural Events",
      sports: "Sport Events",
      workshop: "Workshop",
      concert: "Concert",
      gaming: "Gaming",
      other: "Other Events",
    };
    return categories[category] || "Event";
  };

  const isEventPast = () => {
    if (!event?.startTime) return false;
    return new Date(event.startTime) < new Date();
  };

  const isRegistrationOpen = () => {
    if (!event) return false;
    if (isEventPast()) return false;

    const now = new Date();
    const registrationDeadline = event.registrationDeadline
      ? new Date(event.registrationDeadline)
      : new Date(event.startTime);

    return now < registrationDeadline;
  };

  const getDaysUntilEvent = () => {
    if (!event?.startTime) return null;
    const now = new Date();
    const eventDate = new Date(event.startTime);
    const diff = eventDate - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : null;
  };

  // Parse description into formatted sections
  const parseDescription = (desc) => {
    if (!desc) return { headline: "", description: "" };
    
    const headlineMatch = desc.match(/Headline:\s*(.+?)(?:\s*Description:|$)/i);
    const descriptionMatch = desc.match(/Description:\s*(.+)/i);
    
    return {
      headline: headlineMatch ? headlineMatch[1].trim() : "",
      description: descriptionMatch ? descriptionMatch[1].trim() : desc,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl p-12 shadow-2xl border-4 border-dashed border-purple-300">
          <Loader2 className="w-20 h-20 text-purple-500 animate-spin mx-auto mb-6" />
          <p className="text-purple-900 text-xl font-semibold">
            Loading event details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border-4 border-dashed border-red-300 rounded-3xl p-10 text-center shadow-2xl">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-purple-900 mb-3">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            {error ||
              "The event you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/events")}
            className="bg-purple-500 text-white px-8 py-4 rounded-full hover:bg-purple-600 transition-all cursor-pointer flex items-center gap-3 mx-auto font-bold text-lg shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Browse All Events
          </button>
        </div>
      </div>
    );
  }

  const daysUntil = getDaysUntilEvent();
  const categoryName = getCategoryName(event.category);
  const parsedDesc = parseDescription(event.description);

  return (
    <div className="min-h-screen bg-blue-900/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 bg-white text-purple-900 px-8 py-4 rounded-full hover:bg-purple-50 transition-all cursor-pointer flex items-center gap-3 shadow-xl border-2 border-purple-200 font-bold text-lg"
        >
          <ArrowLeft className="w-6 h-6 milonga" />
          Back to Events
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Card */}
          <div className="lg:col-span-2">
            <div className="  back bg-purple-400 rounded-[2.5rem] p-8 border-4 border-dashed border-purple-400 shadow-2xl">
              {/* Event Image Placeholder */}
              <div className="bg-linear-to-r bg-amber-50 rounded-3xl h-80 mb-6 flex items-center justify-center overflow-hidden relative shadow-xl">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 text-center">
                  {event.eventType && (
                    <div className="inline-block bg-black/70 px-6 py-3 rounded-full mb-4">
                      <span className="text-white font-bold text-lg tracking-wide uppercase">
                        {event.eventType}
                      </span>
                    </div>
                  )}
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
                    <Trophy className="w-16 h-16 text-purple-600 mx-auto mb-3" />
                    <h2 className="text-2xl font-black text-purple-900">
                      {event.title}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Event Title & Category */}
              <div className="mb-6">
                <h1 className="text-4xl sm:text-5xl font-black text-purple-900 mb-3 leading-tight font-serif">
                  {event.title}
                </h1>
                <p className="text-purple-700 text-lg font-semibold flex items-center gap-2">
                  <Star className="w-5 h-5" />• {categoryName}
                </p>
              </div>

              {/* Description Section */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-6 border-2 border-purple-200">
                {parsedDesc.headline && (
                  <div className="mb-4">
                    <h3 className="text-sm text-purple-600 font-semibold mb-2 uppercase tracking-wide">
                      Headline
                    </h3>
                    <p className="text-purple-900 font-semibold text-lg leading-relaxed">
                      {parsedDesc.headline}
                    </p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm text-purple-600 font-semibold mb-2 uppercase tracking-wide">
                    Description
                  </h3>
                  <p className="text-purple-900 leading-relaxed">
                    {parsedDesc.description}
                  </p>
                </div>
              </div>

              {/* Date & Time Banner */}
              <div className="bg-linear-to-r from-purple-900 to-black rounded-2xl p-6 mb-6 transform -rotate-1 shadow-xl">
                <div className="transform rotate-1">
                  <div className="bg-white px-6 py-3 rounded-full inline-block mb-4">
                    <span className="text-purple-900 font-black text-sm tracking-wider uppercase">
                      Date & time
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <Calendar className="w-6 h-6" />
                    <span className="text-2xl font-bold">
                      {formatDate(event.startTime)} • {formatTime(event.startTime)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Venue & Capacity */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <span className="text-purple-900 font-bold">Venue</span>
                  </div>
                  <p className="text-purple-800 font-semibold">
                    {event.venueName || "To be announced"}
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-orange-500" />
                    <span className="text-purple-900 font-bold">Capacity</span>
                  </div>
                  <p className="text-orange-500 font-bold text-xl">
                    {event.capacity ? `${event.capacity}` : "Unlimited"}
                  </p>
                </div>
              </div>

              {/* Rules Section */}
              {event.rules && event.rules.length > 0 && (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200">
                  <h3 className="text-purple-900 font-black text-2xl mb-4 flex items-center gap-3">
                    <Flag className="w-6 h-6 text-purple-600" />
                    Rules & Guidelines
                  </h3>
                  <ul className="space-y-3">
                    {event.rules.map((rule, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-purple-800"
                      >
                        <CircleCheck className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        <span className="leading-relaxed font-medium">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Organizer Info */}
            {event.organizer && (
              <div className="mt-8 bg-linear-to-br from-purple-200 to-purple-300 rounded-[2.5rem] p-8 border-4 border-dashed border-purple-400 shadow-2xl">
                <h3 className="text-2xl font-black text-purple-900 mb-6 flex items-center gap-3">
                  <User className="w-7 h-7 text-purple-600" />
                  Organizer Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.organizer.name && (
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border-2 border-purple-200">
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-xs text-purple-600 font-semibold uppercase">
                            Name
                          </p>
                          <p className="text-purple-900 font-bold">
                            {event.organizer.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {event.organizer.email && (
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border-2 border-purple-200">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-xs text-purple-600 font-semibold uppercase">
                            Email
                          </p>
                          <p className="text-purple-900 font-bold text-sm">
                            {event.organizer.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {event.organizer.phone && (
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border-2 border-purple-200">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-xs text-purple-600 font-semibold uppercase">
                            Phone
                          </p>
                          <p className="text-purple-900 font-bold">
                            {event.organizer.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Action Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-purple-300 rounded-[2.5rem] p-8 border-2 border-dashed border-black shadow-2xl sticky top-6 outline-4 outline-white back ">
              {/* Countdown */}
              {daysUntil && daysUntil > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 text-center border-2 border-purple-300 shadow-lg">
                  <p className="text-purple-600 text-sm font-semibold mb-3 uppercase tracking-wide">
                    Event Starts In
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Zap className="w-8 h-8 text-yellow-500" />
                    <p className="text-6xl font-black text-purple-900">
                      {daysUntil}
                    </p>
                    <Zap className="w-8 h-8 text-yellow-500" />
                  </div>
                  <p className="text-purple-700 font-bold text-lg mt-2">
                    {daysUntil === 1 ? "Day" : "Days"}
                  </p>
                </div>
              )}

              {/* Registration Status */}
              {isRegistered ? (
                <div className="bg-green-500 rounded-2xl p-5 mb-6 shadow-lg border-2 border-green-600">
                  <div className="flex items-center gap-3 text-white mb-2">
                    <CheckCircle className="w-7 h-7" />
                    <span className="font-black text-xl">Enrolled!</span>
                  </div>
                  <p className="text-white/90 font-semibold">
                    Check your profile for more details
                  </p>
                </div>
              ) : isEventPast() ? (
                <div className="bg-red-500 rounded-2xl p-5 mb-6 shadow-lg border-2 border-red-600">
                  <div className="flex items-center gap-3 text-white mb-2">
                    <XCircle className="w-7 h-7" />
                    <span className="font-black text-xl">Event Ended</span>
                  </div>
                  <p className="text-white/90 font-semibold">
                    This event has already taken place
                  </p>
                </div>
              ) : !isRegistrationOpen() ? (
                <div className="bg-orange-500 rounded-2xl p-5 mb-6 shadow-lg border-2 border-orange-600">
                  <div className="flex items-center gap-3 text-white mb-2">
                    <AlertCircle className="w-7 h-7" />
                    <span className="font-black text-xl">Registration Closed</span>
                  </div>
                  <p className="text-white/90 font-semibold">
                    Registration deadline has passed
                  </p>
                </div>
              ) : null}

              {/* Price */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border-2 border-purple-300 shadow-lg">
                <p className="text-purple-600 text-sm font-semibold mb-2 uppercase tracking-wide">
                  Registration Fee
                </p>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-8 h-8 text-purple-900" />
                  <p className="text-5xl font-black text-purple-900">
                    {event.fee > 0 ? event.fee : "FREE"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {isRegistered ? (
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full bg-white text-purple-900 rounded-full py-5 font-black text-lg hover:bg-purple-50 transition-all cursor-pointer flex items-center justify-center gap-3 shadow-xl border-2 border-purple-300"
                  >
                    View Detail
                    <ExternalLink className="w-6 h-6" />
                  </button>
                ) : isRegistrationOpen() && !isEventPast() ? (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full bg-green-500 text-white rounded-full py-5 font-black text-lg hover:bg-green-600 transition-all cursor-pointer flex items-center justify-center gap-3 shadow-xl border-2 border-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {registering ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Enrolling...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        Enroll Now
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 rounded-full py-5 font-black text-lg cursor-not-allowed flex items-center justify-center gap-3 shadow-xl border-2 border-gray-400"
                  >
                    <XCircle className="w-6 h-6" />
                    Unavailable
                  </button>
                )}

                {/* Share & Bookmark */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleShare}
                    className="bg-white/80 backdrop-blur-sm text-purple-900 rounded-full py-4 hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2 border-2 border-purple-300 shadow-lg font-bold"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-5 h-5" />
                        Share
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`backdrop-blur-sm text-purple-900 rounded-full py-4 transition-all cursor-pointer flex items-center justify-center gap-2 border-2 shadow-lg font-bold ${
                      bookmarked
                        ? "bg-yellow-400 hover:bg-yellow-500 border-yellow-500"
                        : "bg-white/80 hover:bg-white border-purple-300"
                    }`}
                  >
                    <Bookmark
                      className="w-5 h-5"
                      fill={bookmarked ? "currentColor" : "none"}
                    />
                    {bookmarked ? "Saved" : "Save"}
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 space-y-3 text-purple-900">
                <div className="flex items-start gap-3 bg-white/40 rounded-xl p-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">
                    Instant confirmation upon registration
                  </span>
                </div>
                <div className="flex items-start gap-3 bg-white/40 rounded-xl p-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">
                    Email notification with event details
                  </span>
                </div>
                <div className="flex items-start gap-3 bg-white/40 rounded-xl p-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">
                    24/7 support for any queries
                  </span>
                </div>
              </div>
            </div>

            {/* Important Dates Card */}
            <div className="bg-linear-to-br from-purple-200 to-purple-300 rounded-[2.5rem] p-8 border-2 border-dashed border-black shadow-2xl outline-4 outline-white">
              <h3 className="text-xl font-black text-purple-900 mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-purple-600" />
                Important Dates
              </h3>
              <div className="space-y-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border-2 border-purple-200">
                  <p className="text-purple-600 text-xs font-semibold mb-2 uppercase">
                    Event Date
                  </p>
                  <p className="text-purple-900 font-black text-lg">
                    {formatDate(event.startTime)}
                  </p>
                  <p className="text-purple-700 font-semibold">
                    {formatTime(event.startTime)}
                  </p>
                </div>
                {event.registrationDeadline && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border-2 border-purple-200">
                    <p className="text-purple-600 text-xs font-semibold mb-2 uppercase">
                      Registration Deadline
                    </p>
                    <p className="text-purple-900 font-black text-lg">
                      {formatDate(event.registrationDeadline)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
