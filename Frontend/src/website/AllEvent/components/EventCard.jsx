import React, { useState } from "react";
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

const EventCard = ({
  event,
  handleViewDetails,
  handleEnroll,
  getCategoryName,
  getSubCategory,
  getImageUrl,
  getEventTypeIcon,
  getCategoryIcon,
  getEventTypeText,
  getCategoryColor,
  formatDate,
  formatTime,
  isAuthenticated,
  userRegistrations = [],
}) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const navigate = useNavigate();

  const isEnrolled = userRegistrations.some(
    (reg) => reg.eventId?._id === event._id || reg.eventId === event._id,
  );

  const isRegistrationOpen = new Date() <= new Date(event.registrationDeadline);
  const isFull = event.currentParticipants >= event.capacity;

  const categoryName = getCategoryName(event.category);
  const subCategory = getSubCategory(event.subCategory);
  const imageUrl = getImageUrl(event.images);
  const eventTypeText = getEventTypeText(event.teamSize, event.eventType);

  // Get icons based on category/subcategory
  const getCategoryDetailIcon = () => {
    if (categoryName?.toLowerCase().includes("music"))
      return <Music size={16} className="sm:size-[18px]" />;
    if (categoryName?.toLowerCase().includes("dance"))
      return <Mic size={16} className="sm:size-[18px]" />;
    if (categoryName?.toLowerCase().includes("drama"))
      return <Award size={16} className="sm:size-[18px]" />;
    return <UsersIcon size={16} className="sm:size-[18px]" />;
  };

  const handleEnrollClick = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isEnrolled) {
      navigate("/my-registrations")
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
  };

  const shortDescription = event.description
    ? event.description.length > 100
      ? event.description.substring(0, 100) + "..."
      : event.description
    : "No description available";

  return (
    <div className="w-full max-w-[360px] sm:max-w-[400px] md:max-w-[420px] rounded-[20px] sm:rounded-[26px] p-[2px] bg-gradient-to-b from-[#C8ABFE] to-[#b18cff] shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-2xl transition-shadow duration-300 outline-6">
      {/* dashed border */}
      <div className="h-full w-full rounded-[18px] sm:rounded-[24px] border-2 border-dashed border-black/60 bg-gradient-to-b from-[#C8ABFE] to-[#b692ff] p-3 sm:p-4 md:p-5 font-sans">
        {/* Top white box with image */}
        <div className="bg-white rounded-[14px] sm:rounded-[18px] p-2 sm:p-3 h-[120px] sm:h-[140px] md:h-[160px] relative overflow-hidden">
          {/* Solo/Team Badge - Top left corner */}
          <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-black text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 rounded-full poppin z-50">
            {eventTypeText}
          </span>

          {/* Category Badge - Top right corner */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 bg-black/80 text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 rounded-full font-poppins backdrop-blur-sm">
            {getCategoryDetailIcon()}
            <span className="hidden xs:inline milonga ">{categoryName}</span>
          </div>

          {/* Event Image */}
          <div className="absolute inset-0">
            <img
              src={imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
          </div>
        </div>

        {/* Title and Subcategory */}
        <div className="mt-2 sm:mt-3">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#2b123f] font-poppins line-clamp-1 milonga">
            {event.title}
          </h2>
          {subCategory && (
            <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
              <div className="text-sm sm:text-lg text-[#2b123f] font-medium font-poppins flex items-center gap-1">
                <span>•</span>
                <span className="line-clamp-1">{subCategory}</span>
              </div>
            </div>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-[#2b123f]/80 mt-1 sm:mt-2 leading-relaxed tracking-tight min-h-[32px] sm:min-h-[40px] font-poppins line-clamp-3">
          {shortDescription}
        </p>

        {/* Date strip - EXACT SHAPE FROM IMAGE */}
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
            <span className="inline-block bg-white text-black text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full mb-1 font-medium font-poppins">
              Date & time
            </span>
            <div className="flex items-center gap-1 sm:gap-2 p-2 mt-1">
              <Calendar size={12} className="sm:size-[10px] text-purple-300" />
              <p
                className=" text-sm font-medium truncate flex-1 milonga"
                
              >
                {formatDate(event.startTime)} • {formatTime(event.startTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Venue, Fee, and Capacity in one row with icons */}
        <div className="mt-3 sm:mt-4 flex items-center justify-between text-[#2b123f] text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="sm:size-[14px] text-blue-500" />
            <span className="font-medium font-poppins truncate max-w-[60px] sm:max-w-[80px]">
              {event.venueName?.split(" ")[0] || "TBA"}
            </span>
          </div>
         
          <div className="flex items-center gap-1">
            <Users size={12} className="sm:size-[14px] text-orange-500" />
            <span className="font-medium font-poppins">
              {event.currentParticipants || 0}/{event.capacity}
            </span>
          </div>
        </div>

        {/* Buttons with Poppins font and functional styling */}
        <div className="mt-4 sm:mt-5 flex gap-2 sm:gap-3 max-xl:flex-col">
          <button
            onClick={() => handleViewDetails(event)}
            className="flex-1 bg-white border-2 border-[#b692ff] rounded-full py-2 sm:py-2.5 flex items-center justify-center gap-1 sm:gap-2  text-xs sm:text-sm hover:bg-gray-50 cursor-pointer transition-colors milonga font-bold"
          >
            <span className="truncate text-[#2b123f] font-bold ">View Detail</span>
            <span className="w-5 h-5 sm:w-7 sm:h-7 bg-[#4b1b7a] text-white rounded-full flex items-center justify-center text-sm sm:text-lg shrink-0">
              →
            </span>
          </button>

          <button
            onClick={handleEnrollClick}
            disabled={
              isEnrolling ||
              (!isRegistrationOpen && !isEnrolled) ||
              (isFull && !isEnrolled)
            }
            className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 flex-1 font-poppins cursor-pointer milonga ${
              isEnrolled
                ? "bg-green-600 hover:bg-green-600/30  border border-green-500/50"
                : isRegistrationOpen && !isFull
                  ? "bg-white hover:bg-white/20 text-[#2b123f] border border-[#b692ff] hover:border-purple-500/50"
                  : "bg-gray-800/50 text-gray-500 border border-gray-700/50 cursor-not-allowed"
            }`}
          >
            {isEnrolling ? (
              <>
                <div className="animate-spin milonga rounded-full h-3 w-3 sm:h-4 poppin sm:w-4 border-b-2 border-[#4b1b7a]"></div>
                <span className="hidden xs:inline">Enrolling...</span>
              </>
            ) : isEnrolled ? (
              <>
                <CheckCircle size={12} className="sm:size-[14px]" />
                <span className="xs:inline milonga text-white ">Enrolled</span>
              </>
            ) : !isRegistrationOpen ? (
              <span className="truncate">Closed</span>
            ) : isFull ? (
              <span className="truncate">Full</span>
            ) : (
              <>
                <span className="truncate milonga flex justify-between items-center gap-4">Enroll Now 
                  <span className="bg-[#431865] rounded-full text-white p-1">
                    <ArrowUpRight/> 
                  </span>
                </span>
                <Users size={12} className="sm:size-[14px] hidden xs:inline" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
