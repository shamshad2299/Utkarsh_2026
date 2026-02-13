import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Tag,
  X,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from "lucide-react";
import RegistrationModal from "./RegistrationModal";
import {
  useEvent,
  useCategories,
  useSubCategories,
} from "../../../features/eventsAPI";

// Memoized sub-components
const EventImage = React.memo(({ src, title }) => (
  <img
    src={src}
    alt={title}
    className="w-full h-full object-cover"
    loading="lazy"
  />
));

EventImage.displayName = "EventImage";

const EventBadge = React.memo(({ children, className }) => (
  <div
    className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full backdrop-blur-sm border border-white/30 ${className}`}
  >
    {children}
  </div>
));

EventBadge.displayName = "EventBadge";

const AccordionSection = React.memo(
  ({ title, subtitle, icon, color, isExpanded, onToggle, children }) => {
    // Fix for dynamic color classes - Tailwind doesn't support dynamic strings
    const getColorClasses = () => {
      switch (color) {
        case "purple":
          return "from-purple-500/30 to-purple-600/30 text-purple-600";
        case "blue":
          return "from-blue-500/30 to-blue-600/30 text-blue-600";
        case "green":
          return "from-green-500/30 to-green-600/30 text-green-600";
        default:
          return "from-purple-500/30 to-purple-600/30 text-purple-600";
      }
    };

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-black/30 overflow-hidden">
        <button
          onClick={onToggle}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-white transition-all"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r ${getColorClasses().split(" ")[0]} ${getColorClasses().split(" ")[1]} flex items-center justify-center`}
            >
              <span
                className={`${getColorClasses().split(" ")[2]} font-bold text-base sm:text-lg milonga`}
              >
                {icon}
              </span>
            </div>
            <div className="text-left">
              <h4 className="text-base sm:text-lg font-semibold text-[#2b123f] milonga">
                {title}
              </h4>
              <p className="text-xs sm:text-sm text-[#2b123f]/80">{subtitle}</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp size={20} className="sm:size-[24px] text-[#2b123f]" />
          ) : (
            <ChevronDown size={20} className="sm:size-[24px] text-[#2b123f]" />
          )}
        </button>

        {isExpanded && (
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-4 border-t border-black/30">
            {children}
          </div>
        )}
      </div>
    );
  },
);

AccordionSection.displayName = "AccordionSection";

const EventDetailModal = ({
  eventId, // Accept eventId instead of selectedEvent
  handleCloseModal,
  selectedImageIndex = 0,
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
  userRegistrations = [],
}) => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Debug: Log the eventId to check if it's being passed

  // Fetch event data using React Query - cached for 1 hour
  const {
    data: selectedEvent,
    isLoading: eventLoading,
    error: eventError,
  } = useEvent(eventId, {
    enabled: !!eventId, // Only fetch if eventId exists
  });

  // Fetch categories for rule lookup - cached for 24 hours
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  // Fetch subcategories when category is available
  const categoryId = selectedEvent?.category?._id;
  const { data: subCategories = [], isLoading: subCategoriesLoading } =
    useSubCategories(categoryId, {
      enabled: !!categoryId,
    });

  // Find current category and subcategory data
  const currentCategory = useMemo(
    () => categories.find((cat) => cat._id === selectedEvent?.category?._id),
    [categories, selectedEvent?.category?._id],
  );

  const parseNumberedRules = (text) => {
  if (!text) return [];

  return text
    .split(/\s(?=\d+\.\s)/)   // split before 1. 2. 3.
    .map(rule => rule.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);
};


  const currentSubCategory = useMemo(
    () =>
      subCategories.find((sub) => sub._id === selectedEvent?.subCategory?._id),
    [subCategories, selectedEvent?.subCategory?._id],
  );

  // Get rules from category and subcategory
  const categoryRules = useMemo(() => {
    if (
      currentCategory?.rules &&
      Array.isArray(currentCategory.rules) &&
      currentCategory.rules.length > 0
    ) {
      return currentCategory.rules;
    }
    // Default category rules if none provided
    return [" Rule is not given "];
  }, [currentCategory]);

  const subCategoryRules = useMemo(() => {
    if (
      currentSubCategory?.rules &&
      Array.isArray(currentSubCategory.rules) &&
      currentSubCategory.rules.length > 0
    ) {
      return currentSubCategory.rules;
    }
    // Default subcategory rules if none provided
    return [
     
    ];
  }, [currentSubCategory]);

  // Combine event description with rules
const eventSpecificRules = useMemo(() => {
  const rules = [];

  if (selectedEvent?.description) {
    const parsedRules = parseNumberedRules(selectedEvent.description);
    rules.push(...parsedRules);
  }

  if (subCategoryRules.length > 0) {
    rules.push(...subCategoryRules);
  }

  if (rules.length === 0) {
    rules.push("No specific rules defined for this event.");
  }

  return rules;
}, [selectedEvent?.description, subCategoryRules]);


  // Format category rules for display
  const formattedCategoryRules = useMemo(() => {
    return categoryRules.map((rule) => `📌 ${rule}`);
  }, [categoryRules]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const preventBodyScroll = () => {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.paddingRight = "15px";
    };

    const restoreBodyScroll = () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      document.body.style.paddingRight = "0";
    };

    preventBodyScroll();

    return () => {
      restoreBodyScroll();
    };
  }, []); // Remove dependency on selectedEvent

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [handleCloseModal]);

  // Check if user is already enrolled
  const isAlreadyEnrolled = useMemo(
    () =>
      userRegistrations?.some(
        (reg) =>
          reg.eventId === selectedEvent?._id ||
          reg.event?._id === selectedEvent?._id,
      ),
    [userRegistrations, selectedEvent?._id],
  );

  // Check registration deadline
  const isRegistrationOpen = useMemo(
    () =>
      selectedEvent
        ? new Date() <= new Date(selectedEvent.registrationDeadline)
        : false,
    [selectedEvent],
  );

  // Check event capacity
  const isFull = useMemo(
    () =>
      selectedEvent
        ? selectedEvent.currentParticipants >= selectedEvent.capacity
        : false,
    [selectedEvent],
  );

  // Handle click outside to close
  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        handleCloseModal();
      }
    },
    [handleCloseModal],
  );

  // Enroll click handler
  const handleEnrollClick = useCallback(() => {
    if (!isAuthenticated) {
      alert("Please login to enroll in events");
      window.location.href = "/login";
      return;
    }

    if (isAlreadyEnrolled) {
      alert("You are already enrolled in this event");
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

    setShowRegistrationModal(true);
  }, [isAuthenticated, isAlreadyEnrolled, isRegistrationOpen, isFull]);

  // Handle enroll from RegistrationModal
  const handleEnrollSubmit = useCallback(
    async (event, teamId = null) => {
      try {
        setIsEnrolling(true);
        await handleEnroll(event, teamId);
        setShowRegistrationModal(false);
      } catch (error) {
        console.error("Enrollment error:", error);
      } finally {
        setIsEnrolling(false);
      }
    },
    [handleEnroll],
  );

  // Loading state - show if event is loading or no eventId
  if (!eventId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="bg-white rounded-xl p-8 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#4b1b7a] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#2b123f] font-medium milonga">
            No event selected...
          </p>
        </div>
      </div>
    );
  }

  if (eventLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="bg-white rounded-xl p-8 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#4b1b7a] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#2b123f] font-medium milonga">
            Loading event details...
          </p>
        </div>
      </div>
    );
  }

  if (eventError || !selectedEvent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="bg-white rounded-xl p-8 flex flex-col items-center cursor-pointer">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 ">
            <X size={32} className="text-red-600" />
          </div>
          <p className="text-[#2b123f] font-medium milonga text-center">
            {eventError?.message || "Failed to load event details"}
          </p>
          <button
            onClick={handleCloseModal}
            className="mt-6 px-6 py-2 bg-[#4b1b7a] text-white rounded-full hover:bg-[#6b2bb9] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const categoryName = getCategoryName(selectedEvent.category);
  const subCategory = getSubCategory(selectedEvent.subCategory);
  const images = getAllImages(selectedEvent.images);
  const categoryColor = getCategoryColor(categoryName);
  const EventTypeIcon = getEventTypeIcon(selectedEvent.eventType);
  const eventTypeText = getEventTypeText(
    selectedEvent.teamSize,
    selectedEvent.eventType,
  );

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
            aria-label="Close modal"
          >
            <X size={20} className="sm:size-[24px] text-[#2b123f]" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-1">
              <div className="relative h-48 sm:h-56 lg:h-64 xl:h-80 mb-3 sm:mb-4 rounded-[18px] overflow-hidden border-2 border-black/30 bg-white">
                {images.length > 0 ? (
                  <EventImage
                    src={images[selectedImageIndex]}
                    title={selectedEvent.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#C8ABFE] to-[#b18cff]">
                    <ImageIcon
                      size={40}
                      className="sm:size-[64px] text-[#2b123f]"
                    />
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="mb-6 sm:mb-8">
                  <h4 className="text-[#2b123f] font-medium mb-2 sm:mb-3 flex items-center gap-2 milonga">
                    <ImageIcon size={16} className="sm:size-[18px]" />
                    <span className="text-sm sm:text-base">
                      Gallery ({images.length - 1} images)
                    </span>
                  </h4>

                  <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-3 scrollbar-thin scrollbar-thumb-[#4b1b7a]/20">
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
                          aria-label={`View image ${index + 1}`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 sm:space-y-4">
                {/* Date & Time - Purple shape container */}
                <div
                  className="relative text-white px-3 sm:px-4 py-3"
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
                    backgroundColor: "#12002b",
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <Calendar
                      size={16}
                      className="sm:size-[18px] text-purple-300"
                    />
                    <h3 className="text-sm sm:text-base font-semibold milonga">
                      Date & Time
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-10 items-center text-xs sm:text-sm md:text-base milonga mt-2 sm:mt-4">
                    <p className="font-medium">
                      {formatDate(selectedEvent.startTime)}
                    </p>
                    <p className="text-purple-300">
                      {formatTime(selectedEvent.startTime)}
                      {selectedEvent.endTime &&
                        ` - ${formatTime(selectedEvent.endTime)}`}
                    </p>
                  </div>
                </div>

                {/* Venue */}
                {selectedEvent.venueName && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-black/30">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <MapPin
                        size={16}
                        className="sm:size-[18px] text-[#4b1b7a]"
                      />
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
                      <IndianRupee
                        size={16}
                        className="sm:size-[18px] text-green-600"
                      />
                      <h3 className="text-sm sm:text-base font-semibold text-[#2b123f] milonga">
                        Fee
                      </h3>
                    </div>
                    <p className="text-[#2b123f] font-medium text-xs sm:text-sm">
                      ₹{selectedEvent.fee || 0}{" "}
                      {selectedEvent.fee === 0 && "(Free)"}
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-black/30">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <Users
                        size={16}
                        className="sm:size-[18px] text-[#4b1b7a]"
                      />
                      <h3 className="text-sm sm:text-base font-semibold text-[#2b123f] milonga">
                        Team
                      </h3>
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
                  <EventBadge className="bg-gradient-to-r from-[#4b1b7a] to-[#6b2bb9]">
                    <EventTypeIcon
                      size={12}
                      className="sm:size-[14px] text-white"
                    />
                    <span className="text-xs font-bold text-white milonga">
                      {eventTypeText}
                    </span>
                  </EventBadge>
                  <EventBadge className="bg-[#2b123f]">
                    <span className="text-xs font-medium text-white milonga">
                      {categoryName}
                    </span>
                  </EventBadge>
                  {subCategory && (
                    <EventBadge className="bg-purple-500/20 border border-purple-500/30">
                      <Tag
                        size={10}
                        className="sm:size-[12px] text-purple-700"
                      />
                      <span className="text-xs font-medium text-purple-700 milonga">
                        {subCategory}
                      </span>
                    </EventBadge>
                  )}
                </div>

                {/* Event Title */}
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2b123f] mb-2 sm:mb-3 milonga">
                  {selectedEvent.title}
                </h2>

                {/* Short Description Preview - Only show first 200 chars if description is used in rules */}
                {selectedEvent.description &&
                  selectedEvent.description.length > 200 && (
                    <div className="mb-4 sm:mb-6">
                      <p className="text-[#2b123f]/70 text-sm sm:text-base italic border-l-3 border-[#4b1b7a] pl-3">
                        {selectedEvent.description.substring(0, 200)}...
                      </p>
                    </div>
                  )}
              </div>

              {/* Rules & Guidelines Section - Now with Category & Subcategory Rules */}
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

                {/* Category Rules Accordion */}
                <AccordionSection
                  title={`${categoryName} Rules`}
                  subtitle={`Rules for ${categoryName} category`}
                  icon="1"
                  color="purple"
                  isExpanded={expandedRules?.general || false}
                  onToggle={() => toggleRuleSection("general")}
                >
                  <ul className="space-y-2 sm:space-y-3">
                    {formattedCategoryRules.map((rule, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 sm:gap-3 text-[#2b123f]/80 text-xs sm:text-sm p-2 hover:bg-white/50 rounded-lg transition-colors"
                      >
                        <span className="text-purple-600 mt-0.5 sm:mt-1 min-w-5 sm:min-w-6 text-center font-bold">
                          {index + 1}.
                        </span>
                        <span className="wrap-break-word">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionSection>

                {/* Event Specific Rules Accordion - Includes Description + Subcategory Rules */}
                <AccordionSection
                  title="Event Specific Rules"
                  subtitle="Description & rules for this event"
                  icon="2"
                  color="blue"
                  isExpanded={expandedRules?.event || false}
                  onToggle={() => toggleRuleSection("event")}
                >
                  <ul className="space-y-2 sm:space-y-3">
                    <div className="space-y-4">
                      {eventSpecificRules.map((rule, index) => (
                        <div
                          key={index}
                          className="bg-white/60 p-3 sm:p-4 rounded-xl border border-blue-200"
                        >
                          <h4 className="text-blue-600 font-bold text-sm sm:text-base mb-2">
                            Rule ({index + 1}):
                          </h4>

                          <p className="text-[#2b123f]/80 text-xs sm:text-sm leading-relaxed break-words">
                            {rule}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ul>
                </AccordionSection>
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
                    <p className="text-xs sm:text-sm text-[#2b123f]/80 mb-1">
                      Capacity
                    </p>
                    <p className="text-[#2b123f] font-medium text-sm">
                      {selectedEvent.capacity || "Unlimited"} participants
                    </p>
                    <p className="text-xs text-[#2b123f]/60 mt-1">
                      {selectedEvent.currentParticipants || 0} registered
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-black/30">
                    <p className="text-xs sm:text-sm text-[#2b123f]/80 mb-1">
                      Registration Deadline
                    </p>
                    <p className="text-[#2b123f] font-medium text-sm">
                      {formatDate(selectedEvent.registrationDeadline)}
                    </p>
                    <p className="text-xs text-[#2b123f]/60 mt-1">
                      {isRegistrationOpen ? "✅ Open" : "❌ Closed"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Responsive */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-black/30">
                <button
                  onClick={handleEnrollClick}
                  disabled={!isRegistrationOpen || isFull || isAlreadyEnrolled}
                  className={`
                    flex-1 px-4 sm:px-6 py-2.5 sm:py-3 
                    rounded-xl font-semibold text-sm sm:text-base lg:text-lg 
                    transition-all duration-300 milonga
                    ${
                      !isRegistrationOpen || isFull || isAlreadyEnrolled
                        ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                        : "bg-gradient-to-r from-[#4b1b7a] to-[#6b2bb9] text-white hover:scale-[1.02] hover:shadow-xl"
                    }
                  `}
                >
                  {isAlreadyEnrolled
                    ? "✓ Already Enrolled"
                    : !isRegistrationOpen
                      ? "Registration Closed"
                      : isFull
                        ? "Event Full"
                        : "Enroll Now"}
                </button>

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

export default React.memo(EventDetailModal);
