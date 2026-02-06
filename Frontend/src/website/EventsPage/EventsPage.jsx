import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Filter,
  User,
  Users as TeamIcon,
  Trophy,
  Target,
  Sparkles,
  BookOpen,
  Utensils,
  Palette,
  Music,
  Clock,
  IndianRupee,
  Tag,
  X,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from "lucide-react";
import { api } from "../../api/axios";

const EventsPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [filterOptions, setFilterOptions] = useState([
    { id: "all", label: "All", icon: Filter },
  ]);

  // Modal state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expandedRules, setExpandedRules] = useState({
    general: false,
    event: false,
  });

  // Category name  icon mapping
  const categoryIconMap = {
    technical: Target,
    cultural: Sparkles,
    sports: Trophy,
    "fine arts": Palette,
    literary: BookOpen,
    "hotel management": Utensils,
    other: Music,
    //  common categories
    workshop: Target,
    competition: Trophy,
    seminar: BookOpen,
    concert: Music,
    exhibition: Palette,
    conference: Users,
    festival: Sparkles,
  };

  useEffect(() => {
    fetchCategoriesAndEvents();
  }, [categoryId]);

  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredEvents(allEvents);
    } else {
      const filtered = allEvents.filter((event) => {
        const eventCategoryId = event.category?._id;
        const eventCategoryName = event.category?.name?.toLowerCase() || "";
        return (
          eventCategoryId === selectedFilter ||
          eventCategoryName.includes(selectedFilter.toLowerCase())
        );
      });
      setFilteredEvents(filtered);
    }
  }, [selectedFilter, allEvents]);

  // Helper functions to safely extract values
  const getCategoryName = (category) => {
    if (!category) return "Uncategorized";
    if (typeof category === "string") return category;
    if (typeof category === "object") {
      return category.name || category.title || "Uncategorized";
    }
    return "Uncategorized";
  };

  const getSubCategory = (subCategory) => {
    if (!subCategory) return null;
    if (typeof subCategory === "string") return subCategory;
    if (typeof subCategory === "object") {
      return subCategory.title || subCategory.name || null;
    }
    return null;
  };

  const getImageUrl = (images) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return "https://via.placeholder.com/400x200";
    }

    const firstImage = images[0];
    if (typeof firstImage === "string") {
      return firstImage;
    }
    if (typeof firstImage === "object") {
      return (
        firstImage.url ||
        firstImage.src ||
        firstImage.imageUrl ||
        "https://via.placeholder.com/400x200"
      );
    }

    return "https://via.placeholder.com/400x200";
  };

  const getAllImages = (images) => {
    if (!images || !Array.isArray(images)) {
      return [];
    }

    return images
      .map((img) => {
        if (typeof img === "string") return img;
        if (typeof img === "object") {
          return img.url || img.src || img.imageUrl;
        }
        return null;
      })
      .filter(Boolean);
  };

  const fetchCategoriesAndEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Categories fetch करें
      const categoriesResponse = await api.get("/category/get");
      const categoriesData = categoriesResponse.data.data || [];
      setCategories(categoriesData);

      // Filter options बनाएं
      const filters = [{ id: "all", label: "All", icon: Filter }];

      categoriesData.forEach((cat) => {
        const categoryName = getCategoryName(cat);
        const icon = getCategoryIcon(categoryName);
        filters.push({
          id: cat._id,
          label: categoryName,
          icon: icon,
        });
      });

      setFilterOptions(filters);

      // Events fetch करें
      if (categoryId === "all") {
        const eventsResponse = await api.get("/events");
        const eventsData = eventsResponse.data.data || [];
        setAllEvents(eventsData);
        setFilteredEvents(eventsData);
      } else {
        const eventsResponse = await api.get(`/events/${categoryId}`);
        const eventsData = eventsResponse.data.data || [];
        setAllEvents(eventsData);
        setFilteredEvents(eventsData);

        // Specific category का detail fetch करें
        const categoryDetail = categoriesData.find(
          (cat) => cat._id === categoryId,
        );
        setCategory(categoryDetail);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic icon selection based on category name
  const getCategoryIcon = (categoryName) => {
    if (!categoryName) return Tag;

    const lowerName = categoryName.toLowerCase();

    // Exact match check
    for (const [key, icon] of Object.entries(categoryIconMap)) {
      if (lowerName === key.toLowerCase()) {
        return icon;
      }
    }

    // Partial match check
    for (const [key, icon] of Object.entries(categoryIconMap)) {
      if (
        lowerName.includes(key.toLowerCase()) ||
        key.toLowerCase().includes(lowerName)
      ) {
        return icon;
      }
    }

    // Common keywords check
    if (
      lowerName.includes("tech") ||
      lowerName.includes("code") ||
      lowerName.includes("program")
    ) {
      return Target;
    }
    if (
      lowerName.includes("sport") ||
      lowerName.includes("game") ||
      lowerName.includes("athlet")
    ) {
      return Trophy;
    }
    if (
      lowerName.includes("art") ||
      lowerName.includes("design") ||
      lowerName.includes("paint")
    ) {
      return Palette;
    }
    if (
      lowerName.includes("music") ||
      lowerName.includes("dance") ||
      lowerName.includes("perform")
    ) {
      return Music;
    }
    if (
      lowerName.includes("book") ||
      lowerName.includes("write") ||
      lowerName.includes("read")
    ) {
      return BookOpen;
    }
    if (
      lowerName.includes("food") ||
      lowerName.includes("hotel") ||
      lowerName.includes("culinary")
    ) {
      return Utensils;
    }

    return Tag; // Default icon
  };

  const getEventTypeIcon = (eventType) => {
    if (!eventType) return Users;
    const lowerType = eventType.toLowerCase();
    if (lowerType.includes("solo")) return User;
    if (lowerType.includes("team")) return TeamIcon;
    return Users;
  };

  const getEventTypeText = (teamSize, eventType) => {
    if (eventType?.toLowerCase().includes("solo")) {
      return "SOLO";
    }
    if (eventType?.toLowerCase().includes("team")) {
      return "TEAM";
    }
    if (teamSize?.max === 1 && teamSize?.min === 1) {
      return "SOLO";
    }
    if (teamSize?.max > 1) {
      return "TEAM";
    }
    return "EVENT";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not specified";
    try {
      const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      return new Date(dateString).toLocaleDateString("en-US", options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  const getCategoryColor = (categoryName) => {
    if (!categoryName) return "from-purple-500 to-blue-500";

    const lowerName = categoryName.toLowerCase();
    const colorMap = {
      technical: "from-blue-500 to-cyan-500",
      sports: "from-green-500 to-emerald-500",
      cultural: "from-pink-500 to-rose-500",
      "fine arts": "from-purple-500 to-violet-500",
      literary: "from-amber-500 to-yellow-500",
      "hotel management": "from-orange-500 to-red-500",
      other: "from-gray-500 to-slate-500",
    };

    for (const [key, color] of Object.entries(colorMap)) {
      if (lowerName.includes(key.toLowerCase())) {
        return color;
      }
    }

    return "from-purple-500 to-blue-500";
  };

  // Modal handlers
  const handleViewDetails = (event) => {
    // Prevent page scroll
    document.body.style.overflow = "hidden";

    setSelectedEvent(event);
    setSelectedImageIndex(0);
    setExpandedRules({
      general: false,
      event: false,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    // Restore page scroll
    document.body.style.overflow = "auto";

    setShowModal(false);
    setSelectedEvent(null);
  };

  const toggleRuleSection = (section) => {
    setExpandedRules((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Event Detail Modal Component
  const EventDetailModal = () => {
    if (!selectedEvent) return null;

    const categoryName = getCategoryName(selectedEvent.category);
    const subCategory = getSubCategory(selectedEvent.subCategory);
    const images = getAllImages(selectedEvent.images);
    const categoryColor = getCategoryColor(categoryName);
    const EventTypeIcon = getEventTypeIcon(selectedEvent.eventType);
    const eventTypeText = getEventTypeText(
      selectedEvent.teamSize,
      selectedEvent.eventType,
    );

    // Dummy rules data
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

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-linear-to-br from-[#0a051a] to-[#120a2e] rounded-3xl border border-white/20 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm border border-white/20 transition-all hover:scale-110"
          >
            <X size={24} className="text-white" />
          </button>

          {/* Modal Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-1 ">
              {/* Main Image */}
              <div className="relative h-64 lg:h-80 mb-4 rounded-2xl overflow-hidden border border-white/10">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImageIndex]}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-purple-500/10 to-blue-500/10">
                    <ImageIcon size={64} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="mb-8">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <ImageIcon size={18} />
                    Gallery ({images.length - 1} images)
                  </h4>

                  <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                    {images
                      .map((img, index) => ({ img, index }))
                      .filter(({ index }) => index !== selectedImageIndex)
                      .map(({ img, index }) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className="
              shrink-0
              w-24 h-24
              sm:w-28 sm:h-28
              lg:w-36 lg:h-36
              rounded-2xl
              overflow-hidden
              border border-white/20
              hover:border-purple-400
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

              {/* Quick Info Cards */}
              <div className="space-y-4">
                {/* Date & Time */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar size={18} className="text-purple-400" />
                    <h3 className="text-sm font-semibold text-white">
                      Date & Time
                    </h3>
                  </div>
                  <div className="text-gray-300 text-sm">
                    <p className="text-white font-medium">
                      {formatDate(selectedEvent.startTime)}
                    </p>
                    <p>
                      {formatTime(selectedEvent.startTime)}
                      {selectedEvent.endTime &&
                        ` - ${formatTime(selectedEvent.endTime)}`}
                    </p>
                  </div>
                </div>

                {/* Venue */}
                {selectedEvent.venueName && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin size={18} className="text-blue-400" />
                      <h3 className="text-sm font-semibold text-white">
                        Venue
                      </h3>
                    </div>
                    <p className="text-white font-medium text-sm">
                      {selectedEvent.venueName}
                    </p>
                  </div>
                )}

                {/* Fee & Team Size */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <IndianRupee size={18} className="text-green-400" />
                      <h3 className="text-sm font-semibold text-white">Fee</h3>
                    </div>
                    <p className="text-white font-medium text-sm">
                      ₹{selectedEvent.fee || 0}{" "}
                      {selectedEvent.fee === 0 && "(Free)"}
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <Users size={18} className="text-amber-400" />
                      <h3 className="text-sm font-semibold text-white">Team</h3>
                    </div>
                    <p className="text-white font-medium text-sm">
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
              {/* Event Header */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg--to-r ${categoryColor} backdrop-blur-sm`}
                  >
                    <EventTypeIcon size={14} className="text-white" />
                    <span className="text-xs font-bold text-white">
                      {eventTypeText}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                    <span className="text-xs font-medium text-white">
                      {categoryName}
                    </span>
                  </div>
                  {subCategory && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                      <Tag size={12} className="text-purple-300" />
                      <span className="text-xs font-medium text-purple-300">
                        {subCategory}
                      </span>
                    </div>
                  )}
                </div>

                <h2 className="text-3xl font-bold text-white mb-3">
                  {selectedEvent.title}
                </h2>

                {/* Event Description */}
                <div className="mb-8">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {selectedEvent.description || "No description available"}
                  </p>
                </div>
              </div>

              {/* Rules & Guidelines Section */}
              <div className="space-y-4 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L1 21h22L12 2zm0 3.5l7.5 13.5H4.5L12 5.5z" />
                    <path d="M11 10v4h2v-4h-2zM11 16v2h2v-2h-2z" />
                  </svg>
                  Rules & Guidelines
                </h3>

                {/* General Rules Accordion */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => toggleRuleSection("general")}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/30 to-purple-600/30 flex items-center justify-center">
                        <span className="text-purple-300 font-bold text-lg">
                          1
                        </span>
                      </div>
                      <div className="text-left">
                        <h4 className="text-lg font-semibold text-white">
                          General Rules
                        </h4>
                        <p className="text-sm text-gray-400">
                          Applicable to all participants
                        </p>
                      </div>
                    </div>
                    {expandedRules.general ? (
                      <ChevronUp size={24} className="text-white" />
                    ) : (
                      <ChevronDown size={24} className="text-white" />
                    )}
                  </button>

                  {expandedRules.general && (
                    <div className="px-6 pb-6 pt-4 border-t border-white/10">
                      <ul className="space-y-3">
                        {generalRules.map((rule, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-gray-300 p-2 hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <span className="text-purple-400 mt-1 min-w-6 text-center font-bold">
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
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => toggleRuleSection("event")}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/30 to-blue-600/30 flex items-center justify-center">
                        <span className="text-blue-300 font-bold text-lg">
                          2
                        </span>
                      </div>
                      <div className="text-left">
                        <h4 className="text-lg font-semibold text-white">
                          Event Specific Rules
                        </h4>
                        <p className="text-sm text-gray-400">
                          Rules specific to this event
                        </p>
                      </div>
                    </div>
                    {expandedRules.event ? (
                      <ChevronUp size={24} className="text-white" />
                    ) : (
                      <ChevronDown size={24} className="text-white" />
                    )}
                  </button>

                  {expandedRules.event && (
                    <div className="px-6 pb-6 pt-4 border-t border-white/10">
                      <ul className="space-y-3">
                        {eventRules.map((rule, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-gray-300 p-2 hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <span className="text-blue-400 mt-1 min-w-6 text-center font-bold">
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
              <div className="mb-8">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  Additional Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <p className="text-sm text-gray-400 mb-1">Capacity</p>
                    <p className="text-white font-medium">
                      {selectedEvent.capacity || "Unlimited"} participants
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <p className="text-sm text-gray-400 mb-1">
                      Registration Deadline
                    </p>
                    <p className="text-white font-medium">
                      {formatDate(selectedEvent.registrationDeadline)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                <button className="flex-1 px-6 py-3 bg-linear-to-r cursor-pointer from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02]">
                  Enroll Now
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20 hover:border-purple-500/50 hover:scale-[1.02]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#080131] to-[#0a051a] text-white">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-linear-to-r from-purple-900/20 via-blue-900/10 to-indigo-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-linear-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent">
                {categoryId === "all"
                  ? "All Events"
                  : getCategoryName(category)}
              </h1>
              <p className="text-gray-400 text-lg">
                {categoryId === "all"
                  ? "Explore all upcoming events"
                  : category?.description ||
                    `Events in ${getCategoryName(category)}`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-lg font-medium">
                  {filteredEvents.length}{" "}
                  {filteredEvents.length === 1 ? "Event" : "Events"}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Filter Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Filter size={24} className="text-purple-400" />
              <h2 className="text-2xl font-bold text-white">FILTER</h2>
              <span className="text-gray-400 text-sm">
                ({filterOptions.length - 1} categories)
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {filterOptions.map((filter) => {
                const Icon = filter.icon;
                const isActive = selectedFilter === filter.id;

                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300
                      ${
                        isActive
                          ? `bg-linear-to-r ${getCategoryColor(filter.label)} text-white shadow-lg shadow-purple-500/25`
                          : "bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
                      }
                      border ${isActive ? "border-transparent" : "border-white/10"}
                      min-w-[100px] justify-center
                    `}
                  >
                    <Icon size={16} />
                    <span className="font-medium text-sm whitespace-nowrap">
                      {filter.label.length > 12
                        ? filter.label.substring(0, 10) + "..."
                        : filter.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-400 text-lg">Loading events...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
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
        )}

        {/* Events Grid */}
        {!loading && !error && (
          <>
            {filteredEvents.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-10 max-w-lg mx-auto backdrop-blur-sm">
                  <div className="w-20 h-20 bg-linear-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    No Events Found
                  </h3>
                  <p className="text-gray-400 mb-6 text-lg">
                    {selectedFilter === "all"
                      ? "No events are scheduled yet. Check back soon!"
                      : `No events found in "${filterOptions.find((f) => f.id === selectedFilter)?.label || ""}" category.`}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setSelectedFilter("all")}
                      className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full font-medium transition-all shadow-lg"
                    >
                      Show All Events
                    </button>
                    <button
                      onClick={() => navigate("/")}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all border border-white/20"
                    >
                      Go Back Home
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => {
                  // Extract values safely
                  const categoryName = getCategoryName(event.category);
                  const subCategory = getSubCategory(event.subCategory);
                  const imageUrl = getImageUrl(event.images);

                  const EventTypeIcon = getEventTypeIcon(event.eventType);
                  const CategoryIcon = getCategoryIcon(categoryName);
                  const eventTypeText = getEventTypeText(
                    event.teamSize,
                    event.eventType,
                  );
                  const categoryColor = getCategoryColor(categoryName);

                  return (
                    <div
                      key={event._id}
                      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-[#0a051a] to-[#120a2e] hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
                    >
                      {/* Top Event Type Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-linear-to-r ${categoryColor} backdrop-blur-sm border border-white/30`}
                        >
                          <EventTypeIcon size={14} className="text-white" />
                          <span className="text-xs font-bold text-white">
                            {eventTypeText}
                          </span>
                        </div>
                      </div>

                      {/* Event Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute bottom-4 left-4 z-10">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/20">
                            <CategoryIcon size={12} className="text-white" />
                            <span className="text-xs font-medium text-white">
                              {categoryName}
                            </span>
                          </div>
                        </div>

                        {/* Capacity Badge */}
                        {event.capacity && (
                          <div className="absolute bottom-4 right-4 z-10">
                            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/20">
                              <Users size={12} className="text-white" />
                              <span className="text-xs font-medium text-white">
                                {event.capacity}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Event Content */}
                      <div className="p-6">
                        {/* Event Title */}
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                          {event.title}
                        </h3>

                        {/* Subcategory if exists */}
                        {subCategory && (
                          <div className="mb-3">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
                              <Tag size={12} className="text-purple-300" />
                              <span className="text-xs font-medium text-purple-300">
                                {subCategory}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Event Description */}
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                          {event.description || "No description available"}
                        </p>

                        {/* Event Details */}
                        <div className="space-y-3">
                          {/* Date and Time */}
                          <div className="flex items-start gap-3">
                            <Calendar
                              size={16}
                              className="text-purple-400 shrink-0 mt-0.5"
                            />
                            <div className="flex-1">
                              <p className="text-sm text-gray-400">
                                Date & Time
                              </p>
                              <div className="text-white font-medium text-sm flex gap-8">
                                <div>{formatDate(event.startTime)}</div>
                                <div className="text-gray-300">
                                  {formatTime(event.startTime)}{" "}
                                  {event.endTime &&
                                    `- ${formatTime(event.endTime)}`}
                                </div>
                              </div>
                            </div>
                          </div>
                          <hr />
                          <div className="flex gap-20">
                            {/* Venue */}
                            {event.venueName && (
                              <div className="flex items-center gap-3">
                                <MapPin
                                  size={16}
                                  className="text-blue-400 shrink-0"
                                />
                                <div>
                                  <p className="text-sm text-gray-400">Venue</p>
                                  <p className="text-white font-medium text-sm">
                                    {event.venueName}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Fee */}
                            <div className="flex items-center gap-3">
                              <IndianRupee
                                size={16}
                                className="text-green-400 shrink-0"
                              />
                              <div>
                                <p className="text-sm text-gray-400">
                                  Registration Fee
                                </p>
                                <p className="text-white font-medium text-sm">
                                  ₹{event.fee || 0}{" "}
                                  {event.fee === 0 && "(Free)"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={() => handleViewDetails(event)}
                            className="flex-1 px-4 py-2.5 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                          >
                            View Details
                          </button>
                          <button className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm transition-all duration-300 border border-white/20 hover:border-purple-500/50">
                            Enroll
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Event Detail Modal */}
      {showModal && <EventDetailModal />}

      {/* Fixed floating action button */}
      {!loading && !error && filteredEvents.length > 0 && (
        <div className="fixed bottom-8 right-8 z-40">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="p-4 bg-linear-to-r from-purple-600 to-blue-600 rounded-full shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300"
          >
            <ArrowLeft size={24} className="rotate-90" />
          </button>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
