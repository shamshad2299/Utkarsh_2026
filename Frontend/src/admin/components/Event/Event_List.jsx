import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  Tag,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  MapPin,
} from "lucide-react";
import api from "../../api/axios.js";
import { useNavigate } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [registrationClosedFilter, setRegistrationClosedFilter] =
    useState("all");

  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    events,
    searchTerm,
    selectedCategory,
    eventTypeFilter,
    registrationClosedFilter,
  ]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await api.get("/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(response.data.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/category/get");
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const applyFilters = () => {
    let result = [...events];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(term) ||
          (event.description &&
            event.description.toLowerCase().includes(term)) ||
          (event.venueName && event.venueName.toLowerCase().includes(term)),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (event) => event.category?._id === selectedCategory,
      );
    }

    // Event type filter
    if (eventTypeFilter !== "all") {
      result = result.filter((event) => event.eventType === eventTypeFilter);
    }

    // Registration closed filter
    if (registrationClosedFilter !== "all") {
      const now = new Date();
      if (registrationClosedFilter === "open") {
        result = result.filter(
          (event) => new Date(event.registrationDeadline) > now,
        );
      } else {
        result = result.filter(
          (event) => new Date(event.registrationDeadline) <= now,
        );
      }
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties
        if (sortConfig.key === "category") {
          aValue = a.category?.name || "";
          bValue = b.category?.name || "";
        }

        if (sortConfig.key === "registrationDeadline") {
          aValue = new Date(a.registrationDeadline);
          bValue = new Date(b.registrationDeadline);
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredEvents(result);
    setPage(1); // Reset to first page when filters change
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      setDeleteLoading(true);
      const token = localStorage.getItem("accessToken");
      await api.delete(`/events/${eventToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh events list
      await fetchEvents();
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getEventTypeLabel = (type) => {
    const labels = {
      solo: "Solo",
      duo: "Duo",
      team: "Team",
    };
    return labels[type] || type;
  };

  const isRegistrationOpen = (deadline) => {
    return new Date(deadline) > new Date();
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setEventTypeFilter("all");
    setRegistrationClosedFilter("all");
  };

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronDown className="w-4 h-4 opacity-30" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Event Management
          </h1>
          <p className="text-gray-600">View and manage all UTKARSH'26 events</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Events</p>
                <p className="text-2xl font-bold text-gray-800">
                  {events.length}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Registrations</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    events.filter((e) =>
                      isRegistrationOpen(e.registrationDeadline),
                    ).length
                  }
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Closed Registrations</p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    events.filter(
                      (e) => !isRegistrationOpen(e.registrationDeadline),
                    ).length
                  }
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Team Events</p>
                <p className="text-2xl font-bold text-blue-600">
                  {events.filter((e) => e.eventType === "team").length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events by title, description, or venue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-black bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <Filter className="w-5 h-5" />
              Filters
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Clear Filters */}
            {(searchTerm ||
              selectedCategory !== "all" ||
              eventTypeFilter !== "all" ||
              registrationClosedFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
              >
                <X className="w-5 h-5" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 text-black bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Event Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select
                    value={eventTypeFilter}
                    onChange={(e) => setEventTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 text-black bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Types</option>
                    <option value="solo">Solo</option>
                    <option value="duo">Duo</option>
                    <option value="team">Team</option>
                  </select>
                </div>

                {/* Registration Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Status
                  </label>
                  <select
                    value={registrationClosedFilter}
                    onChange={(e) =>
                      setRegistrationClosedFilter(e.target.value)
                    }
                    className="w-full px-3 py-2 text-black bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center gap-1">
                      Event Title
                      {renderSortIcon("title")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      Category
                      {renderSortIcon("category")}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Users className="w-4 h-4" />
                    Team Event
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("registrationDeadline")}
                  >
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Registration Deadline
                      {renderSortIcon("registrationDeadline")}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {paginatedEvents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">
                          No events found
                        </p>
                        <p className="text-sm">
                          {filteredEvents.length === 0 && events.length > 0
                            ? "Try adjusting your filters"
                            : "No events have been created yet"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedEvents.map((event) => {
                    const isOpen = isRegistrationOpen(
                      event.registrationDeadline,
                    );

                    return (
                      <tr
                        key={event._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">
                              {event.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {event.description?.substring(0, 60)}...
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                            <span className="text-sm text-gray-900">
                              {event.category?.name || "N/A"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              event.eventType === "team"
                                ? "bg-blue-100 text-blue-800"
                                : event.eventType === "duo"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {getEventTypeLabel(event.eventType)}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDateTime(event.registrationDeadline)}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              isOpen
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {isOpen ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Open
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 mr-1" />
                                Closed
                              </>
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(event)}
                              className="p-1.5 text-blue-600 cursor-pointer hover:bg-blue-50 rounded-lg transition"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                            onClick={()=>navigate(`/admin/dashboard/edit-event/${event._id}`)}
                              className="p-1.5 text-green-600 cursor-pointer hover:bg-green-50 rounded-lg transition"
                              title="Edit Event"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                setEventToDelete(event);
                                setShowDeleteModal(true);
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                              title="Delete Event "
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredEvents.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredEvents.length}</span>{" "}
                  results
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-1 border rounded-lg text-sm ${
                          page === pageNum
                            ? "bg-purple-600 text-white border-purple-600"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Event Details
                    </h3>
                    <p className="text-purple-100 text-sm mt-1">
                      Complete event information
                    </p>
                  </div>
                  <button
                    onClick={closeEventDetails}
                    className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 cursor-pointer group"
                    title="Close"
                  >
                    <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Event Title & Description */}
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {selectedEvent.title}
                      </h2>
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            selectedEvent.eventType === "team"
                              ? "bg-blue-100 text-blue-800"
                              : selectedEvent.eventType === "duo"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {getEventTypeLabel(selectedEvent.eventType)}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            isRegistrationOpen(
                              selectedEvent.registrationDeadline,
                            )
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {isRegistrationOpen(
                            selectedEvent.registrationDeadline,
                          )
                            ? "📅 Registrations Open"
                            : "⛔ Registrations Closed"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Event ID</p>
                      <p className="font-mono text-gray-700 font-semibold">
                        {selectedEvent._id?.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>

                {/* Image Gallery */}
                {selectedEvent.images && selectedEvent.images.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Event Gallery
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Scroll to view all images
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {selectedEvent.images.length}{" "}
                        {selectedEvent.images.length === 1 ? "Image" : "Images"}
                      </span>
                    </div>

                    <div className="relative">
                      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {selectedEvent.images.map((image, index) => (
                          <div
                            key={index}
                            className="relative group flex-shrink-0 w-72 h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                          >
                            <img
                              src={image.url}
                              alt={`Event Image ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-4 left-4 text-white">
                                <p className="font-semibold">
                                  Image {index + 1}
                                </p>
                              </div>
                            </div>
                            <div className="absolute top-4 right-4">
                              <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                {index + 1}/{selectedEvent.images.length}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Scroll indicators */}
                      {selectedEvent.images.length > 3 && (
                        <>
                          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                        </>
                      )}
                    </div>

                    {/* Image thumbnails */}
                    {selectedEvent.images.length > 1 && (
                      <div className="flex justify-center gap-2 mt-4">
                        {selectedEvent.images.slice(0, 5).map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === 0 ? "bg-purple-600" : "bg-gray-300"
                            }`}
                          ></div>
                        ))}
                        {selectedEvent.images.length > 5 && (
                          <span className="text-xs text-gray-500 ml-2">
                            +{selectedEvent.images.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Event Information Grid */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Event Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Category Info Card */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Tag className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Category & Type
                          </p>
                          <p className="font-semibold text-gray-800">
                            {selectedEvent.category?.name || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-gray-500">Sub-category</p>
                        <p className="font-medium text-gray-700">
                          {selectedEvent.subCategory?.title || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Venue Info Card */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Venue</p>
                          <p className="font-semibold text-gray-800">
                            {selectedEvent.venueName}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-gray-500">Capacity</p>
                        <p className="font-medium text-gray-700">
                          {selectedEvent.capacity} participants
                        </p>
                      </div>
                    </div>

                    {/* Timing Info Card */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Clock className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Timing</p>
                          <p className="font-semibold text-gray-800">
                            Event Duration
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">Start</p>
                          <p className="font-medium text-gray-700">
                            {formatDateTime(selectedEvent.startTime)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">End</p>
                          <p className="font-medium text-gray-700">
                            {formatDateTime(selectedEvent.endTime)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Registration Card */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Registration</p>
                          <p className="font-semibold text-gray-800">
                            Deadline & Fee
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">Deadline</p>
                          <p className="font-medium text-gray-700">
                            {formatDateTime(selectedEvent.registrationDeadline)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">
                            Participation Fee
                          </p>
                          <p className="font-medium text-gray-700 text-lg">
                            ₹{selectedEvent.fee}
                            <span className="text-sm text-gray-500 ml-2">
                              {selectedEvent.fee === 0
                                ? "(Free Event)"
                                : "(Paid Event)"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Team Info Card */}
                    {selectedEvent.eventType === "team" && (
                      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <Users className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Team Requirements
                            </p>
                            <p className="font-semibold text-gray-800">
                              Team Size
                            </p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Minimum</p>
                              <p className="text-lg font-bold text-gray-800">
                                {selectedEvent.teamSize?.min || 1}
                              </p>
                            </div>
                            <div className="h-8 w-px bg-gray-300"></div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Maximum</p>
                              <p className="text-lg font-bold text-gray-800">
                                {selectedEvent.teamSize?.max || 1}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status Card */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isRegistrationOpen(
                              selectedEvent.registrationDeadline,
                            )
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {isRegistrationOpen(
                            selectedEvent.registrationDeadline,
                          ) ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Current Status
                          </p>
                          <p className="font-semibold text-gray-800">
                            Registration
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div
                          className={`inline-flex items-center px-4 py-2 rounded-lg ${
                            isRegistrationOpen(
                              selectedEvent.registrationDeadline,
                            )
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {isRegistrationOpen(
                            selectedEvent.registrationDeadline,
                          ) ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                              Registrations Open
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-2" />
                              Registrations Closed
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {isRegistrationOpen(
                            selectedEvent.registrationDeadline,
                          )
                            ? "Participants can register until deadline"
                            : "Registration period has ended"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeEventDetails}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium flex-1"
                  >
                    Close Details
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-medium flex-1 shadow-md hover:shadow-lg">
                    Edit Event
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all font-medium flex-1 shadow-md hover:shadow-lg">
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="text-center">
                <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Delete Event
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{eventToDelete?.title}"? This
                  action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setEventToDelete(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    disabled={deleteLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteEvent}
                    disabled={deleteLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deleteLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
