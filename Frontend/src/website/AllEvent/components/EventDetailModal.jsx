import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, IndianRupee, Tag, X, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import RegistrationModal from './RegistrationModal'; // Import RegistrationModal

const EventDetailModal = ({
  selectedEvent,
  handleCloseModal,
  selectedImageIndex,
  setSelectedImageIndex,
  expandedRules,
  toggleRuleSection,
  getCategoryName,
  getSubCategory,
  getAllImages,
  getCategoryColor,
  getEventTypeIcon,
  getEventTypeText,
  formatDate,
  formatTime,
  // Enroll functionality props
  handleEnroll,
  isAuthenticated,
  token,
  user,
  userTeams = [],
  userRegistrations = []
}) => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  if (!selectedEvent) return null;

  const categoryName = getCategoryName(selectedEvent.category);
  const subCategory = getSubCategory(selectedEvent.subCategory);
  const images = getAllImages(selectedEvent.images);
  const categoryColor = getCategoryColor(categoryName);
  const EventTypeIcon = getEventTypeIcon(selectedEvent.eventType);
  const eventTypeText = getEventTypeText(selectedEvent.teamSize, selectedEvent.eventType);

  const generalRules = [
    "All participants must register before the deadline.",
    "Valid college ID card is mandatory for participation.",
    "Participants should report 30 minutes before the event.",
    "The decision of the judges will be final and binding.",
    "Any misconduct will lead to immediate disqualification.",
    "Participants must follow the dress code specified for the event.",
  ];

  const eventRules = [
    "The event will consist of three rounds: Qualifiers, Semi-finals, and Finals.",
    "Each team/participant will get 10 minutes for their performance.",
    "Use of any electronic devices during the performance is prohibited.",
    "Props must be approved by the event coordinators beforehand.",
    "Time limit violations will result in penalty points.",
    "Originality and creativity will be given high priority in scoring.",
  ];

  // Check if user is already enrolled
  const isAlreadyEnrolled = userRegistrations?.some(reg => 
    reg.eventId === selectedEvent._id || 
    reg.event?._id === selectedEvent._id
  );

  // Check registration deadline
  const isRegistrationOpen = new Date() <= new Date(selectedEvent.registrationDeadline);
  
  // Check event capacity
  const isFull = selectedEvent.currentParticipants >= selectedEvent.capacity;

  // Enroll click handler
  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      alert('Please login to enroll in events');
      window.location.href = '/login';
      return;
    }

    if (isAlreadyEnrolled) {
      alert('You are already enrolled in this event');
      return;
    }

    if (!isRegistrationOpen) {
      alert('Registration deadline has passed');
      return;
    }

    if (isFull) {
      alert('Event is full');
      return;
    }

    setShowRegistrationModal(true);
  };

  // Handle enroll from RegistrationModal
  const handleEnrollSubmit = async (event, teamId = null) => {
    try {
      setIsEnrolling(true);
      await handleEnroll(event, teamId);
      setShowRegistrationModal(false);
      // You can show success message or close modal
    } catch (error) {
      console.error('Enrollment error:', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    const preventBodyScroll = () => {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px';
    };
    
    const restoreBodyScroll = () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    };

    preventBodyScroll();
    
    return () => {
      restoreBodyScroll();
    };
  }, []);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [handleCloseModal]);

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-hidden no-scrollbar"
        onClick={handleBackdropClick}
      >
        <div className="relative w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#eadbff] to-[#b692ff] rounded-[24px] border-2 border-dashed border-black/60 shadow-2xl no-scrollbar">
          {/* Close Button - Responsive */}
          <button
            onClick={handleCloseModal}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full backdrop-blur-sm border border-black/30 transition-all hover:scale-110"
          >
            <X size={20} className="sm:size-[24px] text-[#2b123f]" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-1">
              <div className="relative h-48 sm:h-56 lg:h-64 xl:h-80 mb-3 sm:mb-4 rounded-[18px] overflow-hidden border-2 border-black/30 bg-white">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImageIndex]}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#C8ABFE] to-[#b18cff]">
                    <ImageIcon size={40} className="sm:size-[64px] text-[#2b123f]" />
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="mb-6 sm:mb-8">
                  <h4 className="text-[#2b123f] font-medium mb-2 sm:mb-3 flex items-center gap-2 milonga">
                    <ImageIcon size={16} className="sm:size-[18px]" />
                    <span className="text-sm sm:text-base">Gallery ({images.length - 1} images)</span>
                  </h4>

                  <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-3">
                    {images
                      .map((img, index) => ({ img, index }))
                      .filter(({ index }) => index !== selectedImageIndex)
                      .map(({ img, index }) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className="
                            shrink-0
                            w-16 h-16
                            sm:w-20 sm:h-20
                            md:w-24 md:h-24
                            lg:w-28 lg:h-28
                            xl:w-36 xl:h-36
                            rounded-lg sm:rounded-xl lg:rounded-2xl
                            overflow-hidden
                            border-2 border-black/30
                            bg-white
                            hover:border-[#4b1b7a]
                            hover:scale-[1.03]
                            transition-all
                          "
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 sm:space-y-4">
                {/* Date & Time - Purple shape container */}
                <div className="relative text-white px-3 sm:px-4 py-3"
                  style={{
                    clipPath: `polygon(
                      0% 0%,
                      4% 8%,
                      18% 7%,
                      30% 10%,
                      100% 20%,
                      90% 100%,
                      20% 100%,
                      0% 90%
                    )`,
                    backgroundColor: '#12002b'
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <Calendar size={16} className="sm:size-[18px] text-purple-300" />
                    <h3 className="text-sm sm:text-base font-semibold milonga">
                      Date & Time
                    </h3>
                  </div>
                  <div className=" flex gap-10 items-center text-md milonga mt-4">
                    <p className="font-medium" >
                      {formatDate(selectedEvent.startTime)}
                    </p>
                    <p className="text-purple-300 " >
                      {formatTime(selectedEvent.startTime)}
                      {selectedEvent.endTime && ` - ${formatTime(selectedEvent.endTime)}`}
                    </p>
                  </div>
                </div>

                {/* Venue */}
                {selectedEvent.venueName && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-black/30">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <MapPin size={16} className="sm:size-[18px] text-[#4b1b7a]" />
                      <h3 className="text-sm sm:text-base font-semibold text-[#2b123f] milonga">
                        Venue
                      </h3>
                    </div>
                    <p className="text-[#2b123f] font-medium text-xs sm:text-sm">
                      {selectedEvent.venueName}
                    </p>
                  </div>
                )}

                {/* Fee & Team - Responsive Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-black/30">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <IndianRupee size={16} className="sm:size-[18px] text-green-600" />
                      <h3 className="text-sm sm:text-base font-semibold text-[#2b123f] milonga">Fee</h3>
                    </div>
                    <p className="text-[#2b123f] font-medium text-xs sm:text-sm">
                      ₹{selectedEvent.fee || 0}{" "}
                      {selectedEvent.fee === 0 && "(Free)"}
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-black/30">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <Users size={16} className="sm:size-[18px] text-[#4b1b7a]" />
                      <h3 className="text-sm sm:text-base font-semibold text-[#2b123f] milonga">Team</h3>
                    </div>
                    <p className="text-[#2b123f] font-medium text-xs sm:text-sm">
                      {selectedEvent.teamSize?.min === 1 &&
                      selectedEvent.teamSize?.max === 1
                        ? "Solo"
                        : `${selectedEvent.teamSize?.min || 1}-${selectedEvent.teamSize?.max || 1}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-1">
              <div className="mb-4 sm:mb-6">
                {/* Event Badges */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-[#4b1b7a] to-[#6b2bb9] backdrop-blur-sm border border-white/30`}
                  >
                    <EventTypeIcon size={12} className="sm:size-[14px] text-white" />
                    <span className="text-xs font-bold text-white milonga">
                      {eventTypeText}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#2b123f] backdrop-blur-sm border border-white/30">
                    <span className="text-xs font-medium text-white milonga">
                      {categoryName}
                    </span>
                  </div>
                  {subCategory && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                      <Tag size={10} className="sm:size-[12px] text-purple-700" />
                      <span className="text-xs font-medium text-purple-700 milonga">
                        {subCategory}
                      </span>
                    </div>
                  )}
                </div>

                {/* Event Title */}
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2b123f] mb-2 sm:mb-3 milonga">
                  {selectedEvent.title}
                </h2>

                {/* Event Description */}
                <div className="mb-6 sm:mb-8">
                  <p className="text-[#2b123f]/80 text-sm sm:text-base lg:text-lg leading-relaxed">
                    {selectedEvent.description || "No description available"}
                  </p>
                </div>
              </div>

              {/* Rules & Guidelines Section */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#2b123f] mb-4 sm:mb-6 flex items-center gap-2 milonga">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L1 21h22L12 2zm0 3.5l7.5 13.5H4.5L12 5.5z" />
                    <path d="M11 10v4h2v-4h-2zM11 16v2h2v-2h-2z" />
                  </svg>
                  Rules & Guidelines
                </h3>

                {/* General Rules Accordion */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-black/30 overflow-hidden">
                  <button
                    onClick={() => toggleRuleSection("general")}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-white transition-all"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#4b1b7a]/30 to-[#6b2bb9]/30 flex items-center justify-center">
                        <span className="text-[#4b1b7a] font-bold text-base sm:text-lg milonga">
                          1
                        </span>
                      </div>
                      <div className="text-left">
                        <h4 className="text-base sm:text-lg font-semibold text-[#2b123f] milonga">
                          General Rules
                        </h4>
                        <p className="text-xs sm:text-sm text-[#2b123f]/80">
                          Applicable to all participants
                        </p>
                      </div>
                    </div>
                    {expandedRules.general ? (
                      <ChevronUp size={20} className="sm:size-[24px] text-[#2b123f]" />
                    ) : (
                      <ChevronDown size={20} className="sm:size-[24px] text-[#2b123f]" />
                    )}
                  </button>

                  {expandedRules.general && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-4 border-t border-black/30">
                      <ul className="space-y-2 sm:space-y-3">
                        {generalRules.map((rule, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 sm:gap-3 text-[#2b123f]/80 text-xs sm:text-sm p-2 hover:bg-white/50 rounded-lg transition-colors"
                          >
                            <span className="text-[#4b1b7a] mt-0.5 sm:mt-1 min-w-5 sm:min-w-6 text-center font-bold">
                              {index + 1}.
                            </span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Event Rules Accordion */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-black/30 overflow-hidden">
                  <button
                    onClick={() => toggleRuleSection("event")}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-white transition-all"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500/30 to-blue-600/30 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-base sm:text-lg milonga">
                          2
                        </span>
                      </div>
                      <div className="text-left">
                        <h4 className="text-base sm:text-lg font-semibold text-[#2b123f] milonga">
                          Event Specific Rules
                        </h4>
                        <p className="text-xs sm:text-sm text-[#2b123f]/80">
                          Rules specific to this event
                        </p>
                      </div>
                    </div>
                    {expandedRules.event ? (
                      <ChevronUp size={20} className="sm:size-[24px] text-[#2b123f]" />
                    ) : (
                      <ChevronDown size={20} className="sm:size-[24px] text-[#2b123f]" />
                    )}
                  </button>

                  {expandedRules.event && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-4 border-t border-black/30">
                      <ul className="space-y-2 sm:space-y-3">
                        {eventRules.map((rule, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 sm:gap-3 text-[#2b123f]/80 text-xs sm:text-sm p-2 hover:bg-white/50 rounded-lg transition-colors"
                          >
                            <span className="text-blue-600 mt-0.5 sm:mt-1 min-w-5 sm:min-w-6 text-center font-bold">
                              {index + 1}.
                            </span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="mb-6 sm:mb-8">
                <h4 className="text-lg sm:text-xl font-bold text-[#2b123f] mb-3 sm:mb-4 flex items-center gap-2 milonga">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  Additional Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-black/30">
                    <p className="text-xs sm:text-sm text-[#2b123f]/80 mb-1">Capacity</p>
                    <p className="text-[#2b123f] font-medium text-sm">
                      {selectedEvent.capacity || "Unlimited"} participants
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-black/30">
                    <p className="text-xs sm:text-sm text-[#2b123f]/80 mb-1">
                      Registration Deadline
                    </p>
                    <p className="text-[#2b123f] font-medium text-sm">
                      {formatDate(selectedEvent.registrationDeadline)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Responsive */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-black/30">
             
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/80 hover:bg-white text-[#2b123f] rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 border-2 border-black/30 hover:border-[#4b1b7a] hover:scale-[1.02] milonga"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <RegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          event={selectedEvent}
          userTeams={userTeams}
          onEnroll={handleEnrollSubmit}
          loading={isEnrolling}
          isAuthenticated={isAuthenticated}
          token={token}
          user={user}
          userEnrollments={userRegistrations}
        />
      )}
    </>
  );
};

export default EventDetailModal;