import React, { useState, useMemo, useCallback } from "react";
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  Music,
  Mic,
  Award,
  Users as UsersIcon,
  ArrowUpRight,
  User,
  LogIn,
  LogInIcon,
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
  if (name.includes("music"))
    return (
      <Music size={ICON_SIZES.small} className="sm:w-[18px] sm:h-[18px]" />
    );
  if (name.includes("dance"))
    return <Mic size={ICON_SIZES.small} className="sm:w-[18px] sm:h-[18px]" />;
  if (name.includes("drama"))
    return (
      <Award size={ICON_SIZES.small} className="sm:w-[18px] sm:h-[18px]" />
    );
  return (
    <UsersIcon size={ICON_SIZES.small} className="sm:w-[18px] sm:h-[18px]" />
  );
};

const truncateText = (text, maxLength) => {
  if (!text) return "No description available";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Memoized icon components
const CategoryDetailIcon = React.memo(({ categoryName }) =>
  getCategoryDetailIcon(categoryName),
);
CategoryDetailIcon.displayName = "CategoryDetailIcon";

// Solo/Team icon component - UPDATED
const EventTypeIcon = React.memo(({ type }) => {
  if (type === "solo") {
    return <User size={14} className="text-white" />;
  }

  // Team case
  return (
    <div className="flex -space-x-2">
      <User size={14} className="text-white" />
      <User size={14} className="text-white opacity-80" />
  
    </div>
  );
});

EventTypeIcon.displayName = "EventTypeIcon";

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
  isEnrolling = false,
  isEnrolled = false,
  isRegistrationOpen = true,
  isEventFull = false,
}) => {
  const [localEnrolling, setLocalEnrolling] = useState(false);
  const navigate = useNavigate();

  // Determine loading state
  const isLoading = isEnrolling || localEnrolling;

  // Memoized computed values
  const categoryName = useMemo(
    () => getCategoryName(event.category),
    [getCategoryName, event.category],
  );

  const subCategory = useMemo(
    () => getSubCategory(event.subCategory),
    [getSubCategory, event.subCategory],
  );

  const imageUrl = useMemo(
    () => getImageUrl(event.images),
    [getImageUrl, event.images],
  );

  const eventTypeText = useMemo(
    () => getEventTypeText(event.teamSize, event.eventType),
    [getEventTypeText, event.teamSize, event.eventType],
  );

  const shortDescription = useMemo(
    () => truncateText(event.description, TRUNCATE_LENGTH),
    [event.description],
  );

  const venueShortName = useMemo(
    () => event.venueName?.split(" ")[0] || "TBA",
    [event.venueName],
  );

  const currentParticipants = useMemo(
    () => event.currentParticipants || 0,
    [event.currentParticipants],
  );

  // Format date and time - PRESERVED
  const formattedDate = useMemo(
    () =>
      formatDate?.(event.startTime) ||
      new Date(event.startTime).toLocaleDateString(),
    [formatDate, event.startTime],
  );

  const formattedTime = useMemo(
    () =>
      formatTime?.(event.startTime) ||
      new Date(event.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [formatTime, event.startTime],
  );

  // Determine button configuration - REMOVED soft delete logic
  const getButtonConfig = useCallback(() => {
    if (!isAuthenticated) {
      return {
        text: "Login to Enroll",
        action: () => navigate("/login"),
        disabled: false,
        icon: <LogInIcon />,
      };
    }

    if (isLoading) {
      return {
        text: "Processing...",
        action: null,
        disabled: true,
        icon: (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#4b1b7a] border-t-transparent" />
        ),
      };
    }

    // Already enrolled
    if (isEnrolled) {
      return {
        text: "Enrolled",
        action: () => navigate("/my-registrations"),
        disabled: false,
        icon: <CheckCircle size={14} />,
      };
    }

    // Registration closed
    if (!isRegistrationOpen) {
      return {
        text: "Registration Closed",
        action: null,
        disabled: true,
        icon: null,
      };
    }

    // Event full
    if (isEventFull) {
      return {
        text: "Event Full",
        action: null,
        disabled: true,
        icon: null,
      };
    }

    // Enroll Now
    return {
      icon: <ArrowUpRight size={14} />,
      text: "Enroll Now",
      action: () => handleEnroll(event),
      disabled: false,
    };
  }, [
    isAuthenticated,
    isLoading,
    isEnrolled,
    isRegistrationOpen,
    isEventFull,
    handleEnroll,
    event,
    navigate,
  ]);

  const buttonConfig = getButtonConfig();

  // Handle button click
  const handleButtonClick = useCallback(async () => {
    if (buttonConfig.action && !buttonConfig.disabled) {
      setLocalEnrolling(true);
      try {
        await buttonConfig.action();
      } finally {
        setLocalEnrolling(false);
      }
    }
  }, [buttonConfig]);

  return (
    <div className="w-full max-w-[320px] sm:max-w-[350px] md:max-w-[380px] mx-auto rounded-[20px] sm:rounded-[26px] p-0.5 bg-linear-to-b from-[#C8ABFE] to-[#b18cff] shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-2xl transition-shadow duration-300 back outline-6 outline-white">
      {/* Dashed border */}
      <div className="h-full w-full rounded-[18px] sm:rounded-3xl border-2 border-dashed border-black/60 bg-[#b692ff] p-3 sm:p-4 md:p-5 font-sans back2">
        {/* Top white box with image */}
        <div className="bg-white rounded-[14px] sm:rounded-[18px] p-2 sm:p-3 h-[120px] sm:h-[140px] md:h-[160px] relative overflow-hidden">
          {/* Solo/Team Badge - UPDATED with new icons */}
          <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-black text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 rounded-full z-10 poppin flex items-center gap-1">
           
            <span>{eventTypeText}</span>
          </span>

          {/* Category Badge */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 bg-black/80 text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm z-10">
           <EventTypeIcon type={event.eventType} />
            <span className="hidden xs:inline milonga">{categoryName}</span>
          </div>

          {/* Event Image */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => handleViewDetails(event)}
          >
            <img
              src={imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
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

        {/* Date strip - PRESERVED with time */}
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
              <Calendar
                size={ICON_SIZES.small}
                className="sm:w-[14px] sm:h-[14px] text-purple-300 flex-shrink-0"
              />
              <p className="text-xs sm:text-sm font-medium truncate milonga py-1">
                {formattedDate} • {formattedTime}
              </p>
            </div>
          </div>
        </div>

        {/* Venue and Capacity */}
        <div className="mt-3 sm:mt-4 flex items-center justify-between text-[#2b123f] text-xs sm:text-sm">
          <div className="flex items-center gap-1 min-w-0">
            <MapPin
              size={ICON_SIZES.small}
              className="sm:w-[14px] sm:h-[14px] text-purple-900 flex-shrink-0"
            />
            <span className="font-medium truncate max-w-[60px] sm:max-w-[80px] font-poppins">
              {venueShortName}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 sm:mt-5 flex gap-2 sm:gap-3 flex-col xl:flex-row">
          <button
            onClick={() => handleViewDetails(event)}
            className="flex-1 bg-white border-2 border-[#b692ff] rounded-full py-2 sm:py-2.5 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm hover:bg-gray-50 transition-colors milonga font-bold group cursor-pointer"
            aria-label={`View details for ${event.title}`}
          >
            <span className="truncate text-[#2b123f] font-bold">
              View Detail
            </span>
            <span className="w-6 h-6 sm:w-7 sm:h-7 bg-[#4b1b7a] text-white rounded-full flex items-center justify-center text-sm sm:text-lg shrink-0 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>

          <button
            onClick={handleButtonClick}
            disabled={buttonConfig.disabled}
            className={`
              flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 milonga
              cursor-pointer
              ${
                buttonConfig.text === "Enrolled"
                  ? "bg-green-600 hover:bg-green-700 text-white border border-green-500/50"
                  : buttonConfig.text === "Enroll Now" ||
                      buttonConfig.text === "Login to Enroll"
                    ? "bg-white hover:bg-purple-50 text-[#2b123f] border-2 border-[#b692ff] hover:border-purple-500"
                    : "bg-gray-200 text-gray-500 border-2 border-gray-300 cursor-not-allowed opacity-60"
              }
            `}
            aria-label={buttonConfig.text}
          >
            <span className="truncate">{buttonConfig.text}</span>
            {buttonConfig.text === "Enroll Now" && (
              <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-[#4b1b7a] text-white rounded-full shrink-0 group-hover:translate-x-1 transition-transform">
                <ArrowUpRight size={14} />
              </span>
            )}
            {buttonConfig.icon && buttonConfig.text !== "Enroll Now" && (
              <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-[#4b1b7a] text-white rounded-full shrink-0 p-1">
                {buttonConfig.icon}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Default props
EventCard.defaultProps = {
  isEnrolled: false,
  isRegistrationOpen: true,
  isEventFull: false,
};

// Custom comparison for memo
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.event._id === nextProps.event._id &&
    prevProps.isEnrolling === nextProps.isEnrolling &&
    prevProps.isEnrolled === nextProps.isEnrolled &&
    prevProps.isRegistrationOpen === nextProps.isRegistrationOpen &&
    prevProps.isEventFull === nextProps.isEventFull &&
    prevProps.isAuthenticated === nextProps.isAuthenticated &&
    prevProps.userRegistrations?.length === nextProps.userRegistrations?.length
  );
};

export default React.memo(EventCard, areEqual);
