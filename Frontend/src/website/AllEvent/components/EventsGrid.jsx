import React, { useMemo, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import EventCard from './EventCard';

// Simplified helper - no soft delete checks needed
const isUserEnrolledHelper = (userRegistrations, eventId) => {
  return userRegistrations?.some(reg => {
    if (!reg) return false;
    const regEventId = reg.eventId?._id || reg.eventId;
    return regEventId === eventId;
  }) || false;
};

// Loading State - Optimized with minimal re-renders
const LoadingState = React.memo(() => (
  <div className="flex justify-center items-center py-20" aria-label="Loading events">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4" role="status" />
      <p className="text-gray-400 text-lg">Loading events...</p>
    </div>
  </div>
));
LoadingState.displayName = 'LoadingState';

// Error State
const ErrorState = React.memo(({ error, onRetry }) => (
  <div className="text-center py-20">
    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md mx-auto backdrop-blur-sm">
      <p className="text-red-400 text-xl mb-2 font-semibold">Error loading events</p>
      <p className="text-gray-400 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full font-medium transition-all shadow-lg"
        aria-label="Try again"
      >
        Try Again
      </button>
    </div>
  </div>
));
ErrorState.displayName = 'ErrorState';

// Empty State - Optimized
const EmptyState = React.memo(({ searchQuery, selectedFilter, selectedTypeFilter, onClearSearch, onClearFilters }) => (
  <div className="text-center py-20">
    <div className="bg-white/5 border border-white/10 rounded-2xl p-10 max-w-lg mx-auto backdrop-blur-sm">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Calendar className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">No Events Found</h3>
      <p className="text-gray-400 mb-6 text-lg">
        {searchQuery
          ? `No events found for "${searchQuery}"`
          : selectedFilter !== "all" || selectedTypeFilter !== "all"
          ? "No events found with the current filters."
          : "No events are scheduled yet. Check back soon!"}
      </p>
      <div className="flex gap-4 justify-center">
        {searchQuery && (
          <button
            onClick={onClearSearch}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full font-medium transition-all shadow-lg"
          >
            Clear Search
          </button>
        )}
        {(selectedFilter !== "all" || selectedTypeFilter !== "all") && (
          <button
            onClick={onClearFilters}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full font-medium transition-all shadow-lg"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  </div>
));
EmptyState.displayName = 'EmptyState';

// Optimized date check function - memoized outside component
const isRegistrationOpen = (deadline) => new Date() <= new Date(deadline);
const isEventFull = (current, capacity) => (current || 0) >= (capacity || 0);

// MAIN COMPONENT - Optimized
const EventsGrid = ({
  filteredEvents = [],
  allEvents = [],
  selectedFilter = "all",
  selectedTypeFilter = "all",
  searchQuery = "",
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
  // Memoize user enrollment check with Set for O(1) lookup
  const enrolledEventIds = useMemo(() => {
    if (!userRegistrations?.length) return new Set();
    return new Set(
      userRegistrations
        .filter(reg => reg && reg.eventId)
        .map(reg => reg.eventId?._id || reg.eventId)
    );
  }, [userRegistrations]);

  // Memoized helper functions
  const isUserEnrolled = useCallback((eventId) => {
    return enrolledEventIds.has(eventId);
  }, [enrolledEventIds]);

  // Optimize event cards creation
  const eventCards = useMemo(() => {
    if (filteredEvents.length === 0) return null;

    // Batch process events
    return filteredEvents.map((event) => {
      const enrolled = enrolledEventIds.has(event._id);
      const registrationOpen = isRegistrationOpen(event.registrationDeadline);
      const eventFull = isEventFull(event.currentParticipants, event.capacity);
      
      // Memoize event card props to prevent unnecessary re-renders
      const cardProps = {
        event,
        handleViewDetails,
        handleEnroll,
        isAuthenticated,
        userRegistrations,
        getCategoryName,
        getSubCategory,
        getImageUrl,
        getEventTypeIcon,
        getCategoryIcon,
        getEventTypeText,
        getCategoryColor,
        formatDate,
        formatTime,
        isEnrolling: enrollingEventId === event._id,
        isEnrolled: enrolled,
        isRegistrationOpen: registrationOpen,
        isEventFull: eventFull
      };

      return (
        <EventCard
          key={event._id}
          {...cardProps}
        />
      );
    });
  }, [
    filteredEvents,
    enrolledEventIds,
    handleViewDetails,
    handleEnroll,
    isAuthenticated,
    userRegistrations,
    getCategoryName,
    getSubCategory,
    getImageUrl,
    getEventTypeIcon,
    getCategoryIcon,
    getEventTypeText,
    getCategoryColor,
    formatDate,
    formatTime,
    enrollingEventId
  ]);

  // Memoized handlers
  const handleClearSearch = useCallback(() => {
    setSearchQuery?.("");
  }, [setSearchQuery]);

  const handleClearFilters = useCallback(() => {
    handleCategoryFilterClick?.("all");
    handleTypeFilterClick?.("all");
  }, [handleCategoryFilterClick, handleTypeFilterClick]);

  // If no events, show empty state
  if (filteredEvents.length === 0) {
    return (
      <EmptyState
        searchQuery={searchQuery}
        selectedFilter={selectedFilter}
        selectedTypeFilter={selectedTypeFilter}
        onClearSearch={handleClearSearch}
        onClearFilters={handleClearFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {eventCards}
    </div>
  );
};

// Custom comparison function for React.memo to prevent unnecessary re-renders
const arePropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.filteredEvents === nextProps.filteredEvents &&
    prevProps.selectedFilter === nextProps.selectedFilter &&
    prevProps.selectedTypeFilter === nextProps.selectedTypeFilter &&
    prevProps.searchQuery === nextProps.searchQuery &&
    prevProps.isAuthenticated === nextProps.isAuthenticated &&
    prevProps.userRegistrations === nextProps.userRegistrations &&
    prevProps.enrollingEventId === nextProps.enrollingEventId
  );
};

export default React.memo(EventsGrid, arePropsEqual);