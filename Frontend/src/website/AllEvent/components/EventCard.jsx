import React, { useState, useMemo, useCallback } from "react";
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  ChevronRight,
  CheckCircle,
  Music,
  Mic,
  Award,
  Users as UsersIcon,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Constants
const ICON_SIZES = {
  small: 12,
  medium: 14,
  large: 16,
};

const TRUNCATE_LENGTH = 100;

// Helper functions
const getCategoryDetailIcon = (categoryName) => {
  const name = categoryName?.toLowerCase() || "";
  if (name.includes("music")) return <Music size={ICON_SIZES.small} className="sm:w-[18px] sm:h-[18px]" />;
  if (name.includes("dance")) return <Mic size={ICON_SIZES.small} className="sm:w-[18px] sm:h-[18px]" />;
  if (name.includes("drama")) return <Award size={ICON_SIZES.small} className="sm:w-[18px] sm:h-[18px]" />;
  return <UsersIcon size={ICON_SIZES.small} className="sm:w-[18px] sm:h-[18px]" />;
};

const truncateText = (text, maxLength) => {
  if (!text) return "No description available";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Memoized icon components
const CategoryDetailIcon = React.memo(({ categoryName }) => getCategoryDetailIcon(categoryName));
CategoryDetailIcon.displayName = 'CategoryDetailIcon';

const EventCard = ({
  event,
  handleViewDetails,
  handleEnroll,
  getCategoryName,
  getSubCategory,
  getImageUrl,
  getEventTypeText,
  formatDate,
  formatTime,
  isAuthenticated,
  userRegistrations = [],
  handleRestoreRegistration,
  hasDeletedRegistration,
  deletedRegistrationId,
}) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const navigate = useNavigate();

  // Memoized computed values
  const isEnrolled = useMemo(() => 
    userRegistrations.some(
      (reg) => reg.eventId?._id === event._id || reg.eventId === event._id
    ),
    [userRegistrations, event._id]
  );

  const isRegistrationOpen = useMemo(() => 
    new Date() <= new Date(event.registrationDeadline),
    [event.registrationDeadline]
  );

  const isFull = useMemo(() => 
    event.currentParticipants >= event.capacity,
    [event.currentParticipants, event.capacity]
  );

  const categoryName = useMemo(() => 
    getCategoryName(event.category),
    [getCategoryName, event.category]
  );

  const subCategory = useMemo(() => 
    getSubCategory(event.subCategory),
    [getSubCategory, event.subCategory]
  );

  const imageUrl = useMemo(() => 
    getImageUrl(event.images),
    [getImageUrl, event.images]
  );

  const eventTypeText = useMemo(() => 
    getEventTypeText(event.teamSize, event.eventType),
    [getEventTypeText, event.teamSize, event.eventType]
  );

  const shortDescription = useMemo(() => 
    truncateText(event.description, TRUNCATE_LENGTH),
    [event.description]
  );

  const venueShortName = useMemo(() => 
    event.venueName?.split(" ")[0] || "TBA",
    [event.venueName]
  );

  const currentParticipants = useMemo(() => 
    event.currentParticipants || 0,
    [event.currentParticipants]
  );

  // Handlers
const handleEnrollClick = useCallback(async () => {
  if (!isAuthenticated) {
    navigate("/login");
    return;
  }

  // 🔥 FIRST: If soft deleted → restore
  if (hasDeletedRegistration && deletedRegistrationId) {
    try {
      setIsEnrolling(true);
      await handleRestoreRegistration(deletedRegistrationId, event);
    } catch (error) {
      console.error("Restore error:", error);
    } finally {
      setIsEnrolling(false);
    }
    return;
  }

  // 🔥 SECOND: If already active → go to registrations
  if (isEnrolled) {
    navigate("/my-registrations");
    return;
  }

  if (!isRegistrationOpen) {
    alert("Registration deadline has passed");
    return;
  }

  if (isFull) {
    alert("Event is full");
    return;
  }

  try {
    setIsEnrolling(true);
    await handleEnroll(event);
  } catch (error) {
    console.error("Enrollment error:", error);
    alert(error.message || "Failed to enroll");
  } finally {
    setIsEnrolling(false);
  }

}, [
  isAuthenticated,
  hasDeletedRegistration,
  deletedRegistrationId,
  handleRestoreRegistration,
  isEnrolled,
  isRegistrationOpen,
  isFull,
  handleEnroll,
  event,
  navigate
]);


  const handleViewClick = useCallback(() => {
    handleViewDetails(event);
  }, [handleViewDetails, event]);

  // Memoized button states
  const enrollButtonState = useMemo(() => {
    if (isEnrolling) return 'enrolling';
    if (isEnrolled) return 'enrolled';
    if (!isRegistrationOpen) return 'closed';
    if (isFull) return 'full';
    return 'open';
  }, [isEnrolling, isEnrolled, isRegistrationOpen, isFull]);

  return (
    <div className="w-full max-w-[320px] sm:max-w-[350px] md:max-w-[380px] mx-auto rounded-[20px] sm:rounded-[26px] p-0.5 bg-gradient-to-b from-[#C8ABFE] to-[#b18cff] shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-2xl transition-shadow duration-300 back outline-6 outline-white">
      {/* Dashed border */}
      <div className="h-full w-full rounded-[18px] sm:rounded-3xl border-2 border-dashed border-black/60 bg-gradient-to-b from-[#C8ABFE] to-[#b692ff] p-3 sm:p-4 md:p-5 font-sans">
        
        {/* Top white box with image */}
        <div className="bg-white rounded-[14px] sm:rounded-[18px] p-2 sm:p-3 h-[120px] sm:h-[140px] md:h-[160px] relative overflow-hidden">
          
          {/* Solo/Team Badge - Top left corner */}
          <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-black text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 rounded-full z-10 poppin">
            {eventTypeText}
          </span>

          {/* Category Badge - Top right corner */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 bg-black/80 text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm z-10">
            <CategoryDetailIcon categoryName={categoryName} />
            <span className="hidden xs:inline milonga">{categoryName}</span>
          </div>

          {/* Event Image */}
          <div className="absolute inset-0">
            <img
              src={imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>
        </div>

        {/* Title and Subcategory */}
        <div className="mt-2 sm:mt-3">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#2b123f] milonga line-clamp-1">
            {event.title}
          </h2>
          {subCategory && (
            <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
              <div className="text-sm sm:text-base text-[#2b123f] font-medium flex items-center gap-1">
                <span>•</span>
                <span className="line-clamp-1 font-poppins">{subCategory}</span>
              </div>
            </div>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-[#2b123f]/80 mt-1 sm:mt-2 leading-relaxed min-h-[48px] sm:min-h-[56px] font-poppins line-clamp-3">
          {shortDescription}
        </p>

        {/* Date strip - Custom clip path */}
        <div className="mt-3 sm:mt-4 relative">
          <div
            className="relative bg-[#12002b] text-white px-3 sm:px-4 py-2 sm:py-3"
            style={{
              clipPath: `polygon(
                0% 30%,
                4% 8%,
                18% 10%,
                30% 0%,
                100% 20%,
                95% 100%,
                20% 100%,
                0% 90%
              )`,
            }}
          >
            <span className="inline-block bg-white text-black text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full mb-1 font-medium">
              Date & time
            </span>
            <div className="flex items-center gap-1 sm:gap-2 p-2 mt-1">
              <Calendar size={ICON_SIZES.small} className="sm:w-[14px] sm:h-[14px] text-purple-300 flex-shrink-0" />
              <p className="text-xs sm:text-sm font-medium truncate milonga py-1">
                {formatDate?.(event.startTime) || new Date(event.startTime).toLocaleDateString()} • {formatTime?.(event.startTime) || new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>

        {/* Venue, Fee, and Capacity */}
        <div className="mt-3 sm:mt-4 flex items-center justify-between text-[#2b123f] text-xs sm:text-sm">
          <div className="flex items-center gap-1 min-w-0">
            <MapPin size={ICON_SIZES.small} className="sm:w-[14px] sm:h-[14px] text-blue-500 flex-shrink-0" />
            <span className="font-medium truncate max-w-[60px] sm:max-w-[80px] font-poppins">
              {venueShortName}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users size={ICON_SIZES.small} className="sm:w-[14px] sm:h-[14px] text-orange-500 flex-shrink-0" />
            <span className="font-medium font-poppins">
              {currentParticipants}/{event.capacity}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 sm:mt-5 flex gap-2 sm:gap-3 flex-col xl:flex-row">
          <button
            onClick={handleViewClick}
            className="flex-1 bg-white border-2 border-[#b692ff] rounded-full py-2 sm:py-2.5 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm hover:bg-gray-50 transition-colors milonga font-bold group"
          >
            <span className="truncate text-[#2b123f] font-bold">View Detail</span>
            <span className="w-6 h-6 sm:w-7 sm:h-7 bg-[#4b1b7a] text-white rounded-full flex items-center justify-center text-sm sm:text-lg shrink-0 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>

          <button
            onClick={handleEnrollClick}
            disabled={enrollButtonState === 'closed' || enrollButtonState === 'full' || enrollButtonState === 'enrolling'}
            className={`
              flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 milonga
              ${enrollButtonState === 'enrolled' 
                ? "bg-green-600 hover:bg-green-700 text-white border border-green-500/50" 
                : enrollButtonState === 'open'
                  ? "bg-white hover:bg-purple-50 text-[#2b123f] border-2 border-[#b692ff] hover:border-purple-500"
                  : "bg-gray-200 text-gray-500 border-2 border-gray-300 cursor-not-allowed opacity-60"
              }
            `}
          >
            {enrollButtonState === 'enrolling' && (
              <>
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-[#4b1b7a] border-t-transparent" />
                <span className="hidden xs:inline">Enrolling...</span>
              </>
            )}

            {enrollButtonState === 'enrolled' && (
              <>
                <CheckCircle size={ICON_SIZES.small} className="sm:w-[14px] sm:h-[14px]" />
                <span className="xs:inline milonga text-white">Enrolled</span>
              </>
            )}

            {enrollButtonState === 'closed' && (
              <span className="truncate font-medium">Registration Closed</span>
            )}

            {enrollButtonState === 'full' && (
              <span className="truncate font-medium">Event Full</span>
            )}

            {enrollButtonState === 'open' && (
              <>
                <span className="truncate flex items-center gap-2">
                  Enroll Now
                  <span className="bg-[#431865] rounded-full text-white p-1 group-hover:bg-[#5a237a] transition-colors">
                    <ArrowUpRight size={ICON_SIZES.small} className="sm:w-[14px] sm:h-[14px]" />
                  </span>
                </span>
                <Users size={ICON_SIZES.small} className="sm:w-[14px] sm:h-[14px] hidden xs:inline flex-shrink-0" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Default props for optional utility functions
EventCard.defaultProps = {
  formatDate: (date) => new Date(date).toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }),
  formatTime: (date) => new Date(date).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  }),
};

export default React.memo(EventCard);