import React, { useMemo, useCallback } from 'react';
import { Calendar, MapPin, Users, IndianRupee, Tag } from 'lucide-react';
import EventCard from './EventCard';
import { useEvents } from '../../../features/eventsAPI';

// Memoized helper functions - defined outside component to prevent recreation
const isUserEnrolledHelper = (userRegistrations, eventId) => {
  return userRegistrations?.some(reg => 
    reg.eventId?._id === eventId || 
    reg.eventId === eventId
  ) || false;
};

const hasDeletedRegistrationHelper = (userRegistrations, eventId) => {
  return userRegistrations?.some(reg => 
    (reg.eventId === eventId || reg.eventId?._id === eventId) &&
    reg.isDeleted === true &&
    reg.status === "cancelled"
  ) || false;
};

const getDeletedRegistrationIdHelper = (userRegistrations, eventId) => {
  const reg = userRegistrations?.find(
    (reg) => 
      (reg.eventId === eventId || reg.eventId?._id === eventId) &&
      reg.isDeleted === true &&
      reg.status === "cancelled"
  );
  return reg?._id;
};

const isRegistrationOpenHelper = (deadline) => {
  if (!deadline) return true;
  return new Date() <= new Date(deadline);
};

const isEventFullHelper = (capacity, currentParticipants) => {
  if (!capacity) return false;
  return (currentParticipants || 0) >= capacity;
};

// Memoized sub-components
const LoadingState = React.memo(() => (
  <div className="flex justify-center items-center py-20">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
      <p className="text-gray-400 text-lg">Loading events...</p>
    </div>
  </div>
));

LoadingState.displayName = 'LoadingState';

const ErrorState = React.memo(({ error, onRetry }) => (
  <div className="text-center py-20">
    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md mx-auto backdrop-blur-sm">
      <p className="text-red-400 text-xl mb-2 font-semibold">
        Error loading events
      </p>
      <p className="text-gray-400 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full font-medium transition-all shadow-lg"
      >
        Try Again
      </button>
    </div>
  </div>
));

ErrorState.displayName = 'ErrorState';

const EmptyState = React.memo(({ 
  searchQuery, 
  selectedFilter, 
  selectedTypeFilter, 
  onClearSearch, 
  onClearFilters 
}) => (
  <div className="text-center py-20">
    <div className="bg-white/5 border border-white/10 rounded-2xl p-10 max-w-lg mx-auto backdrop-blur-sm">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
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

const EventsGrid = ({
  // Remove loading and error props - they'll come from React Query
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
  handleRestoreRegistration, // 👈 NEW: Add restore handler prop
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
  // Get events data from React Query cache
  const { data: events = [], isLoading: eventsLoading, error: eventsError, refetch } = useEvents({
    refetchOnMount: false, // Don't refetch on mount - use cache
  });

  // Memoize utility functions with useCallback
  const isUserEnrolled = useCallback((eventId) => {
    return isUserEnrolledHelper(userRegistrations, eventId);
  }, [userRegistrations]);

  const hasDeletedRegistration = useCallback((eventId) => {
    return hasDeletedRegistrationHelper(userRegistrations, eventId);
  }, [userRegistrations]);

  const getDeletedRegistrationId = useCallback((eventId) => {
    return getDeletedRegistrationIdHelper(userRegistrations, eventId);
  }, [userRegistrations]);

  const isRegistrationOpen = useCallback((event) => {
    return isRegistrationOpenHelper(event?.registrationDeadline);
  }, []);

  const isEventFull = useCallback((event) => {
    return isEventFullHelper(event?.capacity, event?.currentParticipants);
  }, []);

  // Memoize event cards to prevent unnecessary re-renders
  const eventCards = useMemo(() => {
    if (filteredEvents.length === 0) return null;

    return filteredEvents.map((event) => {
      const enrolled = isUserEnrolled(event._id);
      const registrationOpen = isRegistrationOpen(event);
      const eventFull = isEventFull(event);
      const hasDeletedReg = hasDeletedRegistration(event._id);
      const deletedRegId = getDeletedRegistrationId(event._id);
      
      return (
        <EventCard
          key={event._id}
          event={event}
          handleViewDetails={handleViewDetails}
          handleEnroll={handleEnroll}
          handleRestoreRegistration={handleRestoreRegistration} // 👈 PASS RESTORE HANDLER TO EVENT CARD
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
          hasDeletedRegistration={hasDeletedReg} // 👈 PASS DELETED REGISTRATION STATUS
          deletedRegistrationId={deletedRegId} // 👈 PASS DELETED REGISTRATION ID
        />
      );
    });
  }, [
    filteredEvents,
    isUserEnrolled,
    isRegistrationOpen,
    isEventFull,
    hasDeletedRegistration,
    getDeletedRegistrationId,
    handleViewDetails,
    handleEnroll,
    handleRestoreRegistration, // 👈 ADD TO DEPENDENCIES
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

  // Memoize handlers
  const handleClearSearch = useCallback(() => {
    setSearchQuery?.("");
  }, [setSearchQuery]);

  const handleClearFilters = useCallback(() => {
    handleCategoryFilterClick?.("all");
    handleTypeFilterClick?.("all");
  }, [handleCategoryFilterClick, handleTypeFilterClick]);

  const handleRetry = useCallback(() => {
    refetch?.();
  }, [refetch]);

  // Show loading state from React Query
  if (eventsLoading) {
    return <LoadingState />;
  }

  // Show error state from React Query
  if (eventsError) {
    return <ErrorState error={eventsError.message || "Failed to load events"} onRetry={handleRetry} />;
  }

  // Show empty state
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

// Memoize the entire component
export default React.memo(EventsGrid);