import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
import {useNavigate} from "react-router-dom"

// ================ MEMOIZED SUB-COMPONENTS ================

// Optimized Image Component with blur-up loading
const EventImage = React.memo(({ src, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div className="relative w-full h-full bg-linear-to-br from-[#C8ABFE] to-[#b18cff]">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#4b1b7a] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={title}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
});
EventImage.displayName = "EventImage";

// Optimized Badge Component
const EventBadge = React.memo(({ children, className }) => (
  <div
    className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full backdrop-blur-sm border border-white/30 ${className}`}
  >
    {children}
  </div>
));
EventBadge.displayName = "EventBadge";

// Optimized Accordion with useCallback
const AccordionSection = React.memo(
  ({ title, subtitle, icon, color, isExpanded, onToggle, children }) => {
    // Memoized color classes
    const colorClasses = useMemo(() => {
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
    }, [color]);

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-black/30 overflow-hidden">
        <button
          onClick={onToggle}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-white transition-all"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-r ${colorClasses.split(" ")[0]} ${colorClasses.split(" ")[1]} flex items-center justify-center`}
            >
              <span
                className={`${colorClasses.split(" ")[2]} font-bold text-base sm:text-lg milonga`}
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

// Optimized Loading Spinner
const LoadingSpinner = React.memo(({ message }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <div className="bg-white rounded-xl p-8 flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-[#4b1b7a] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-[#2b123f] font-medium milonga">{message}</p>
    </div>
  </div>
));
LoadingSpinner.displayName = "LoadingSpinner";

// Optimized Error Display
const ErrorDisplay = React.memo(({ message, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <div className="bg-white rounded-xl p-8 flex flex-col items-center cursor-pointer">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 cursor-pointer">
        <X size={32} className="text-red-600" />
      </div>
      <p className="text-[#2b123f] font-medium milonga text-center">
        {message}
      </p>
      <button
        onClick={onClose}
        className="mt-6 px-6 py-2 bg-[#4b1b7a] text-white rounded-full hover:bg-[#6b2bb9] transition-colors"
      >
        Close
      </button>
    </div>
  </div>
));
ErrorDisplay.displayName = "ErrorDisplay";

// ================ UTILITY FUNCTIONS ================

// Parse string rules into array (handles both string and array formats)
const parseRules = (rules) => {
  if (!rules) return [];

  // If it's already an array, return it
  if (Array.isArray(rules)) {
    return rules.filter((rule) => rule && typeof rule === "string");
  }

  // If it's a string, split by newlines or numbers
  if (typeof rules === "string") {
    // Try to split by numbered format (1., 2., etc.)
    const numberedMatches = rules.match(/\d+\.\s*[^.]*(?:\.(?!\d)|[^.])*/g);
    if (numberedMatches && numberedMatches.length > 0) {
      return numberedMatches.map((rule) =>
        rule.replace(/^\d+\.\s*/, "").trim(),
      );
    }

    // Split by newlines
    const lines = rules.split("\n").filter((line) => line.trim());
    if (lines.length > 0) {
      return lines.map((line) => line.trim());
    }

    // Single rule
    return [rules.trim()];
  }

  return [];
};

// ================ MAIN COMPONENT ================

const EventDetailModal = ({
  eventId,
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
  handleEnroll,
  isAuthenticated,
  token,
  user,
  userTeams = [],
  userRegistrations = [],
}) => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // Fetch data with optimized caching
  const {
    data: selectedEvent,
    isLoading: eventLoading,
    error: eventError,
  } = useEvent(eventId, {
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: categories = [] } = useCategories({
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const categoryId = selectedEvent?.category?._id;
  const { data: subCategories = [] } = useSubCategories(categoryId, {
    enabled: !!categoryId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // ================ MEMOIZED VALUES ================

  const currentCategory = useMemo(
    () => categories.find((cat) => cat._id === selectedEvent?.category?._id),
    [categories, selectedEvent?.category?._id],
  );

  // FIXED: Handle subCategories safely
  const currentSubCategory = useMemo(() => {
    if (
      !subCategories ||
      !Array.isArray(subCategories) ||
      !selectedEvent?.subCategory?._id
    ) {
      return null;
    }
    return subCategories.find(
      (sub) => sub?._id === selectedEvent?.subCategory?._id,
    );
  }, [subCategories, selectedEvent?.subCategory?._id]);

  // FIXED: Parse rules properly (handles strings and arrays)
  const categoryRules = useMemo(() => {
    const rules = parseRules(currentCategory?.rules);
    return rules.length > 0 ? rules : ["General rules apply"];
  }, [currentCategory]);

  const subCategoryRules = useMemo(() => {
    return parseRules(currentSubCategory?.rules);
  }, [currentSubCategory]);

  const eventSpecificRules = useMemo(() => {
    const rules = [];

    // Parse event description if it exists and isn't already used elsewhere
    if (selectedEvent?.description) {
      // Check if description might contain rules
      const description = selectedEvent.description.trim();
      if (
        description.toLowerCase().includes("rule") ||
        description.match(/\d+\./) ||
        description.includes("\n")
      ) {
        const parsedRules = parseRules(description);
        rules.push(...parsedRules);
      }
    }

    // Add subcategory rules
    if (subCategoryRules.length > 0) {
      rules.push(...subCategoryRules);
    }

    // If no rules found, add default message
    if (rules.length === 0) {
      rules.push("No specific rules defined for this event.");
    }

    return rules;
  }, [selectedEvent?.description, subCategoryRules]);

  const formattedCategoryRules = useMemo(() => {
    return categoryRules.map((rule) => `${rule}`);
  }, [categoryRules]);

  // Memoized enrollment checks
  const isAlreadyEnrolled = useMemo(() => {
    if (!userRegistrations?.length || !selectedEvent?._id) return false;
    return userRegistrations.some(
      (reg) =>
        reg?.eventId === selectedEvent._id ||
        reg?.event?._id === selectedEvent._id,
    );
  }, [userRegistrations, selectedEvent?._id]);

  const isRegistrationOpen = useMemo(
    () =>
      selectedEvent
        ? new Date() <= new Date(selectedEvent.registrationDeadline)
        : false,
    [selectedEvent],
  );

  const isFull = useMemo(
    () =>
      selectedEvent
        ? selectedEvent.currentParticipants >= selectedEvent.capacity
        : false,
    [selectedEvent],
  );

  // Memoized derived values
  const images = useMemo(
    () => (selectedEvent ? getAllImages(selectedEvent.images) : []),
    [selectedEvent, getAllImages],
  );

  // ================ EFFECTS ================

  // Optimized scroll lock with cleanup
  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      document.body.style.paddingRight = "0";
    };
  }, []);

  // Optimized escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") handleCloseModal();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [handleCloseModal]);

  // ================ HANDLERS ================

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) handleCloseModal();
    },
    [handleCloseModal],
  );

  const handleEnrollClick = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/login");
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

  // ================ EARLY RETURNS ================

  if (!eventId) {
    return <LoadingSpinner message="No event selected..." />;
  }

  if (eventLoading) {
    return <LoadingSpinner message="Loading event details..." />;
  }

  if (eventError || !selectedEvent) {
    return (
      <ErrorDisplay
        message={eventError?.message || "Failed to load event details"}
        onClose={handleCloseModal}
      />
    );
  }

  // Memoized display values
  const categoryName = getCategoryName(selectedEvent.category);
  const subCategory = getSubCategory(selectedEvent.subCategory);
  const categoryColor = getCategoryColor(categoryName);
  const EventTypeIcon = getEventTypeIcon(selectedEvent.eventType);
  const eventTypeText = getEventTypeText(
    selectedEvent.teamSize,
    selectedEvent.eventType,
  );

  // ================ RENDER ================

  return (
    <>
      <div
        ref={modalRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-hidden will-change-transform"
        onClick={handleBackdropClick}
      >
        <div className="relative w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-linear-to-b from-[#eadbff] to-[#b692ff] rounded-[24px] border-2 border-dashed border-black/60 shadow-2xl will-change-transform scroll-smooth no-scrollbar">
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full backdrop-blur-sm border border-black/30 transition-all hover:scale-110  cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} className="sm:size-[24px] text-[#2b123f]" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-1 space-y-4">
              {/* Main Image */}
              <div className="relative h-48 sm:h-56 lg:h-64 xl:h-80 rounded-[18px] overflow-hidden border-2 border-black/30 bg-white">
                {images.length > 0 ? (
                  <EventImage
                    src={images[selectedImageIndex]}
                    title={selectedEvent.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-[#C8ABFE] to-[#b18cff]">
                    <ImageIcon
                      size={40}
                      className="sm:size-[64px] text-[#2b123f]"
                    />
                  </div>
                )}
              </div>

              {/* Image Gallery */}
              {images.length > 1 && (
                <div>
                  <h4 className="text-[#2b123f] font-medium mb-2 sm:mb-3 flex items-center gap-2 milonga">
                    <ImageIcon size={16} className="sm:size-[18px]" />
                    <span className="text-sm sm:text-base">
                      Gallery ({images.length - 1} images)
                    </span>
                  </h4>

                  <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-3 scrollbar-thin scrollbar-thumb-[#4b1b7a]/20">
                    {images.map(
                      (img, index) =>
                        index !== selectedImageIndex && (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-36 xl:h-36 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden border-2 border-black/30 bg-white hover:border-[#4b1b7a] hover:scale-[1.03] transition-all"
                            aria-label={`View image ${index + 1}`}
                          >
                            <img
                              src={img}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover cursor-pointer"
                              loading="lazy"
                              decoding="async"
                            />
                          </button>
                        ),
                    )}
                  </div>
                </div>
              )}

              {/* Event Info Cards */}
              <div className="space-y-3 sm:space-y-4">
                {/* Date & Time */}
                <div
                  className="relative text-white px-3 sm:px-4 py-3"
                  style={{
                    clipPath: `polygon(0% 0%, 4% 8%, 18% 7%, 30% 10%, 100% 20%, 90% 100%, 20% 100%, 0% 90%)`,
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

                {/* Fee & Team */}
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
              {/* Event Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <EventBadge className="bg-linear-to-r from-[#4b1b7a] to-[#6b2bb9]">
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
                    <Tag size={10} className="sm:size-[12px] text-purple-700" />
                    <span className="text-xs font-medium text-purple-700 milonga">
                      {subCategory}
                    </span>
                  </EventBadge>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2b123f] mb-2 sm:mb-3 milonga">
                {selectedEvent.title}
              </h2>

              {/* Full Description */}
              {selectedEvent.description && (
                <div className="mb-4 sm:mb-6">
                  <p className="text-[#2b123f]/80 text-sm sm:text-base leading-relaxed line-clamp-4">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {/* Rules Sections */}
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

                {/* Category Rules */}
                {categoryRules.length > 0 && (
                  <AccordionSection
                    title={`${categoryName} Rules`}
                    subtitle={`Rules for ${categoryName} category`}
                    icon="1"
                    color="purple"
                    isExpanded={expandedRules?.general || false}
                    onToggle={() => toggleRuleSection("general")}
                  >
                    <ul className="space-y-2 sm:space-y-3 max-h-64 overflow-y-auto pr-2 no-scrollbar">
                      {formattedCategoryRules.map((rule, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 sm:gap-3 text-[#2b123f]/80 text-xs sm:text-sm p-2 hover:bg-white/50 rounded-lg transition-colors"
                        >
                          <span className="text-purple-600 mt-0.5 sm:mt-1 min-w-5 sm:min-w-6 text-center font-bold">
                            {index + 1}.
                          </span>
                          <span className="break-words">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionSection>
                )}

                {/* Event Specific Rules */}
                {eventSpecificRules.length > 0 && (
                  <AccordionSection
                    title="Event Specific Rules"
                    subtitle="Rules for this event"
                    icon="2"
                    color="blue"
                    isExpanded={expandedRules?.event || false}
                    onToggle={() => toggleRuleSection("event")}
                  >
                    <ul className="space-y-2 sm:space-y-3 max-h-64 overflow-y-auto pr-2 no-scrollbar">
                      {eventSpecificRules.map((rule, index) => (
                        <li
                          key={index}
                          className="bg-white/60 p-3 sm:p-4 rounded-xl border border-blue-200"
                        >
                          <h4 className="text-blue-600 font-bold text-sm sm:text-base mb-2">
                            Rule {index + 1}:
                          </h4>
                          <p className="text-[#2b123f]/80 text-xs sm:text-sm leading-relaxed break-words">
                            {rule}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </AccordionSection>
                )}
              </div>

              {/* Additional Info */}
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-black/30">
                <button
                  onClick={handleEnrollClick}
                  disabled={!isRegistrationOpen || isFull || isAlreadyEnrolled}
                  className={`
                    flex-1 px-4 sm:px-6 py-2.5 sm:py-3 
                    rounded-xl font-semibold text-sm sm:text-base lg:text-lg 
                    transition-all duration-300 milonga
                    cursor-pointer
                    ${
                      !isRegistrationOpen || isFull || isAlreadyEnrolled
                        ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                        : "bg-linear-to-r from-[#4b1b7a] to-[#6b2bb9] text-white hover:scale-[1.02] hover:shadow-xl"
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
                  className="flex-1 px-4 cursor-pointer sm:px-6 py-2.5 sm:py-3 bg-white/80 hover:bg-white text-[#2b123f] rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 border-2 border-black/30 hover:border-[#4b1b7a] hover:scale-[1.02] milonga"
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

// Custom comparison for memo
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.eventId === nextProps.eventId &&
    prevProps.selectedImageIndex === nextProps.selectedImageIndex &&
    prevProps.expandedRules?.general === nextProps.expandedRules?.general &&
    prevProps.expandedRules?.event === nextProps.expandedRules?.event &&
    prevProps.isAuthenticated === nextProps.isAuthenticated &&
    prevProps.userRegistrations === nextProps.userRegistrations &&
    prevProps.userTeams === nextProps.userTeams
  );
};

export default React.memo(EventDetailModal, areEqual);
