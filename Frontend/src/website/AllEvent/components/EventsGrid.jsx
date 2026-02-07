import React from 'react';
import { Calendar, MapPin, Users, IndianRupee, Tag } from 'lucide-react';
import EventCard from './EventCard';

const EventsGrid = ({
  loading,
  error,
  filteredEvents,
  allEvents,
  selectedFilter,
  selectedTypeFilter,
  searchQuery,
  handleCategoryFilterClick,
  handleTypeFilterClick,
  setSearchQuery,
  handleViewDetails,
  handleEnroll,
  isAuthenticated = false,
  userRegistrations = [],
  enrollingEventId = null,
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
  // Check if user is enrolled in an event
  const isUserEnrolled = (eventId) => {
    return userRegistrations.some(reg => 
      reg.eventId?._id === eventId || 
      reg.eventId === eventId
    );
  };

  // Check if registration is open
  const isRegistrationOpen = (event) => {
    if (!event.registrationDeadline) return true;
    return new Date() <= new Date(event.registrationDeadline);
  };

  // Check if event is full
  const isEventFull = (event) => {
    if (!event.capacity) return false;
    return (event.currentParticipants || 0) >= event.capacity;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-400 text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md mx-auto backdrop-blur-sm">
          <p className="text-red-400 text-xl mb-2 font-semibold">
            Error loading events
          </p>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full font-medium transition-all shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 max-w-lg mx-auto backdrop-blur-sm">
          <div className="w-20 h-20 bg-linear-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            No Events Found
          </h3>
          <p className="text-gray-400 mb-6 text-lg">
            {searchQuery
              ? `No events found for "${searchQuery}"`
              : selectedFilter !== "all" || selectedTypeFilter !== "all"
              ? `No events found with the current filters.`
              : "No events are scheduled yet. Check back soon!"}
          </p>
          <div className="flex gap-4 justify-center">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full font-medium transition-all shadow-lg"
              >
                Clear Search
              </button>
            )}
            {(selectedFilter !== "all" || selectedTypeFilter !== "all") && (
              <button
                onClick={() => {
                  handleCategoryFilterClick("all");
                  handleTypeFilterClick("all");
                }}
                className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full font-medium transition-all shadow-lg"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEvents.map((event) => {
        const enrolled = isUserEnrolled(event._id);
        const registrationOpen = isRegistrationOpen(event);
        const eventFull = isEventFull(event);
        
        return (
          <EventCard
            key={event._id}
            event={event}
            handleViewDetails={handleViewDetails}
            handleEnroll={handleEnroll}
            isAuthenticated={isAuthenticated}
            userRegistrations={userRegistrations}
            getCategoryName={getCategoryName}
            getSubCategory={getSubCategory}
            getImageUrl={getImageUrl}
            getEventTypeIcon={getEventTypeIcon}
            getCategoryIcon={getCategoryIcon}
            getEventTypeText={getEventTypeText}
            getCategoryColor={getCategoryColor}
            formatDate={formatDate}
            formatTime={formatTime}
            isEnrolling={enrollingEventId === event._id}
            isEnrolled={enrolled}
            isRegistrationOpen={registrationOpen}
            isEventFull={eventFull}
          />
        );
      })}
    </div>
  );
};

export default EventsGrid;