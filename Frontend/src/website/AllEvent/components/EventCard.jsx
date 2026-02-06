import React from 'react';
import { Calendar, MapPin, Users, IndianRupee, Tag, ChevronRight } from 'lucide-react';

const EventCard = ({
  event,
  handleViewDetails,
  getCategoryName,
  getSubCategory,
  getImageUrl,
  getEventTypeIcon,
  getCategoryIcon,
  getEventTypeText,
  getCategoryColor,
  formatDate,
  formatTime
}) => {
  const categoryName = getCategoryName(event.category);
  const subCategory = getSubCategory(event.subCategory);
  const imageUrl = getImageUrl(event.images);
  const EventTypeIcon = getEventTypeIcon(event.eventType);
  const CategoryIcon = getCategoryIcon(categoryName);
  const eventTypeText = getEventTypeText(event.teamSize, event.eventType);
  const categoryColor = getCategoryColor(categoryName);

  return (
    <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl border border-white/10 bg-linear-to-br from-[#0a051a] to-[#120a2e] hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg sm:hover:shadow-2xl hover:shadow-purple-500/10">
      {/* Event Type Badge - Responsive */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
        <div
          className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-linear-to-r ${categoryColor} backdrop-blur-sm border border-white/30`}
        >
          <EventTypeIcon size={12} className="sm:size-[14px] text-white" />
          <span className="text-[10px] sm:text-xs font-bold text-white">
            {eventTypeText}
          </span>
        </div>
      </div>

      {/* Event Image - Responsive Height */}
      <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

        {/* Category Badge - Responsive */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/20">
            <CategoryIcon size={10} className="sm:size-[12px] text-white" />
            <span className="text-[10px] sm:text-xs font-medium text-white truncate max-w-[80px] sm:max-w-none">
              {categoryName}
            </span>
          </div>
        </div>

        {/* Capacity Badge - Responsive */}
        {event.capacity && (
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10">
            <div className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/20">
              <Users size={10} className="sm:size-[12px] text-white" />
              <span className="text-[10px] sm:text-xs font-medium text-white">
                {event.capacity}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Event Content - Responsive Padding */}
      <div className="p-4 sm:p-5 lg:p-6">
        {/* Event Title - Responsive Font */}
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-1">
          {event.title}
        </h3>

        {/* Subcategory - Responsive */}
        {subCategory && (
          <div className="mb-3">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:gap-1.5 sm:px-3 sm:py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
              <Tag size={10} className="sm:size-[12px] text-purple-300" />
              <span className="text-[10px] sm:text-xs font-medium text-purple-300 truncate max-w-[100px] sm:max-w-none">
                {subCategory}
              </span>
            </div>
          </div>
        )}

        {/* Event Description - Responsive */}
        <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
          {event.description || "No description available"}
        </p>

        {/* Event Details - Stack on mobile, row on desktop */}
        <div className="space-y-3">
          {/* Date and Time */}
          <div className="flex items-start gap-2 sm:gap-3">
            <Calendar
              size={14}
              className="sm:size-[16px] text-purple-400 shrink-0 mt-0.5"
            />
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-400">
                Date & Time
              </p>
              <div className="text-white font-medium text-xs sm:text-sm">
                <div>{formatDate(event.startTime)}</div>
                <div className="text-gray-300 text-[11px] sm:text-sm mt-0.5 sm:mt-1">
                  {formatTime(event.startTime)}{" "}
                  {event.endTime && `- ${formatTime(event.endTime)}`}
                </div>
              </div>
            </div>
          </div>
          
          {/* Venue and Fee - Stack on mobile, side by side on desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-white/10 gap-3 sm:gap-4">
            {/* Venue - Only show if exists */}
            {event.venueName && (
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <MapPin
                  size={14}
                  className="sm:size-[16px] text-blue-400 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-400">Venue</p>
                  <p className="text-white font-medium text-xs sm:text-sm truncate">
                    {event.venueName}
                  </p>
                </div>
              </div>
            )}

            {/* Fee - Takes remaining space */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <IndianRupee
                size={14}
                className="sm:size-[16px] text-green-400 shrink-0"
              />
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-400">Fee</p>
                <p className="text-white font-medium text-xs sm:text-sm">
                  ₹{event.fee || 0}{" "}
                  {event.fee === 0 && "(Free)"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Stack on mobile, row on desktop */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
          <button
            onClick={() => handleViewDetails(event)}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 cursor-pointer flex-1"
          >
            <span>View Details</span>
            <ChevronRight size={14} className="sm:size-[16px]" />
          </button>
          
          <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 border border-white/20 hover:border-purple-500/50 flex-1">
            <span>Enroll</span>
            <Users size={14} className="sm:size-[16px]" />
          </button>
        </div>

        {/* Quick Info Row for Mobile */}
        <div className="sm:hidden mt-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-[10px] text-gray-400">Team Size</p>
              <p className="text-xs font-medium text-white">
                {event.teamSize?.min === 1 && event.teamSize?.max === 1
                  ? "Solo"
                  : `${event.teamSize?.min || 1}-${event.teamSize?.max || 1}`}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400">Registration</p>
              <p className="text-xs font-medium text-white">
                {event.registrationDeadline 
                  ? formatDate(event.registrationDeadline).split(',')[0]
                  : "Open"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;