import React, { useState, useMemo, useCallback, useEffect } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Constants
const ITEMS_PER_PAGE = 10;
const EVENT_TYPE_LABELS = {
  solo: "Solo",
  duo: "Duo",
  team: "Team",
};

const EventList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [registrationClosedFilter, setRegistrationClosedFilter] = useState("all");

  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Queries
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await api.get("/events");
      return response.data.data || [];
    },
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/category/get");
      return response.data.data || [];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setShowDeleteModal(false);
      setEventToDelete(null);
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to delete event");
      console.error("Delete error:", error);
    },
  });

  // Helper functions
  const isRegistrationOpen = useCallback((deadline) => {
    return new Date(deadline) > new Date();
  }, []);

  const getEventTypeLabel = useCallback((type) => {
    return EVENT_TYPE_LABELS[type] || type;
  }, []);

  const formatDateTime = useCallback((dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Filtered and sorted events
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (event) =>
          event.title?.toLowerCase().includes(term) ||
          event.description?.toLowerCase().includes(term) ||
          event.venueName?.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (event) => event.category?._id === selectedCategory
      );
    }

    // Event type filter
    if (eventTypeFilter !== "all") {
      result = result.filter((event) => event.eventType === eventTypeFilter);
    }

    // Registration status filter
    if (registrationClosedFilter !== "all") {
      const now = new Date();
      result = result.filter((event) => {
        const isOpen = new Date(event.registrationDeadline) > now;
        return registrationClosedFilter === "open" ? isOpen : !isOpen;
      });
    }

    // Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle special cases
        if (sortConfig.key === "category") {
          aValue = a.category?.name || "";
          bValue = b.category?.name || "";
        }
        
        if (sortConfig.key === "registrationDeadline") {
          aValue = new Date(a.registrationDeadline).getTime();
          bValue = new Date(b.registrationDeadline).getTime();
        }

        if (sortConfig.key === "title") {
          aValue = aValue?.toLowerCase() || "";
          bValue = bValue?.toLowerCase() || "";
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [events, searchTerm, selectedCategory, eventTypeFilter, registrationClosedFilter, sortConfig]);

  // Pagination
  const pagination = useMemo(() => {
    const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedEvents = filteredEvents.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
    const validPage = Math.min(page, totalPages) || 1;
    
    return {
      totalPages,
      startIndex,
      paginatedEvents,
      currentPage: validPage,
    };
  }, [filteredEvents, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, eventTypeFilter, registrationClosedFilter]);

  // Stats calculations
  const stats = useMemo(() => {
    const total = events.length;
    const activeRegistrations = events.filter((e) => 
      isRegistrationOpen(e.registrationDeadline)
    ).length;
    const closedRegistrations = total - activeRegistrations;
    const teamEvents = events.filter((e) => e.eventType === "team").length;

    return { total, activeRegistrations, closedRegistrations, teamEvents };
  }, [events, isRegistrationOpen]);

  // Handlers
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("all");
    setEventTypeFilter("all");
    setRegistrationClosedFilter("all");
    setShowFilters(false);
  }, []);

  const handleViewDetails = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const closeEventDetails = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const handleDeleteClick = useCallback((event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  }, []);

  const handleEdit = useCallback((eventId) => {
    navigate(`/admin/dashboard/edit-event/${eventId}`);
  }, [navigate]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderSortIcon = useCallback((key) => {
    if (sortConfig.key !== key) {
      return <ChevronDown className="w-4 h-4 opacity-30" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  }, [sortConfig]);

  const hasActiveFilters = useMemo(() => {
    return searchTerm || 
           selectedCategory !== "all" || 
           eventTypeFilter !== "all" || 
           registrationClosedFilter !== "all";
  }, [searchTerm, selectedCategory, eventTypeFilter, registrationClosedFilter]);

  if (eventsLoading) {
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
        <Header />

        {/* Stats Cards */}
        <Stats stats={stats} />

        {/* Search and Filter Bar */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        >
          {showFilters && (
            <FilterOptions
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              eventTypeFilter={eventTypeFilter}
              onEventTypeChange={setEventTypeFilter}
              registrationClosedFilter={registrationClosedFilter}
              onRegistrationStatusChange={setRegistrationClosedFilter}
            />
          )}
        </FilterBar>

        {/* Events Table */}
        <EventsTable
          events={pagination.paginatedEvents}
          totalEvents={filteredEvents.length}
          onSort={handleSort}
          sortConfig={sortConfig}
          renderSortIcon={renderSortIcon}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          getEventTypeLabel={getEventTypeLabel}
          isRegistrationOpen={isRegistrationOpen}
          formatDateTime={formatDateTime}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            startIndex={pagination.startIndex}
            totalItems={filteredEvents.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <EventDetailsModal
            event={selectedEvent}
            onClose={closeEventDetails}
            onEdit={handleEdit}
            isRegistrationOpen={isRegistrationOpen}
            getEventTypeLabel={getEventTypeLabel}
            formatDateTime={formatDateTime}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && eventToDelete && (
          <DeleteConfirmationModal
            event={eventToDelete}
            onClose={() => {
              setShowDeleteModal(false);
              setEventToDelete(null);
            }}
            onConfirm={() => deleteMutation.mutate(eventToDelete._id)}
            isLoading={deleteMutation.isPending}
          />
        )}
      </div>
    </div>
  );
};

// Sub-components
const Header = () => (
  <div className="mb-8">
    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
      Event Management
    </h1>
    <p className="text-gray-600">View and manage all UTKARSH'26 events</p>
  </div>
);

const Stats = ({ stats }) => {
  const statCards = [
    {
      label: "Total Events",
      value: stats.total,
      icon: Calendar,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      textColor: "text-gray-800",
    },
    {
      label: "Active Registrations",
      value: stats.activeRegistrations,
      icon: CheckCircle,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-green-600",
    },
    {
      label: "Closed Registrations",
      value: stats.closedRegistrations,
      icon: XCircle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      textColor: "text-red-600",
    },
    {
      label: "Team Events",
      value: stats.teamEvents,
      icon: Users,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
            <div className={`p-2 ${stat.bgColor} rounded-lg`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FilterBar = ({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  hasActiveFilters,
  onClearFilters,
  children,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      {/* Search Input */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events by title, description, or venue..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Toggle Button */}
      <button
        onClick={onToggleFilters}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
          showFilters 
            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
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
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
        >
          <X className="w-5 h-5" />
          Clear Filters
        </button>
      )}
    </div>

    {children}
  </div>
);

const FilterOptions = ({
  categories,
  selectedCategory,
  onCategoryChange,
  eventTypeFilter,
  onEventTypeChange,
  registrationClosedFilter,
  onRegistrationStatusChange,
}) => (
  <div className="mt-4 pt-4 border-t border-gray-200">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          onChange={(e) => onEventTypeChange(e.target.value)}
          className="w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          onChange={(e) => onRegistrationStatusChange(e.target.value)}
          className="w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>
    </div>
  </div>
);

const EventsTable = ({
  events,
  totalEvents,
  onSort,
  sortConfig,
  renderSortIcon,
  onViewDetails,
  onEdit,
  onDelete,
  getEventTypeLabel,
  isRegistrationOpen,
  formatDateTime,
}) => {
  const columns = [
    { key: "title", label: "Event Title", icon: null, sortable: true },
    { key: "category", label: "Category", icon: Tag, sortable: true },
    { key: "eventType", label: "Team Event", icon: Users, sortable: false },
    { key: "registrationDeadline", label: "Registration Deadline", icon: Clock, sortable: true },
    { key: "status", label: "Registration Status", icon: null, sortable: false },
    { key: "actions", label: "Actions", icon: null, sortable: false },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => column.sortable && onSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.icon && <column.icon className="w-4 h-4" />}
                    {column.label}
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {events.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <EmptyState hasEvents={totalEvents > 0} />
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <EventRow
                  key={event._id}
                  event={event}
                  onViewDetails={onViewDetails}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  getEventTypeLabel={getEventTypeLabel}
                  isRegistrationOpen={isRegistrationOpen}
                  formatDateTime={formatDateTime}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EventRow = ({
  event,
  onViewDetails,
  onEdit,
  onDelete,
  getEventTypeLabel,
  isRegistrationOpen,
  formatDateTime,
}) => {
  const isOpen = isRegistrationOpen(event.registrationDeadline);

  const getEventTypeColor = (type) => {
    switch (type) {
      case "team": return "bg-blue-100 text-blue-800";
      case "duo": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="max-w-xs">
          <div className="font-medium text-gray-900">{event.title}</div>
          <div className="text-sm text-gray-500 truncate">
            {event.description?.substring(0, 60)}
            {event.description?.length > 60 && "..."}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
          <span className="text-sm text-gray-900">
            {event.category?.name || "N/A"}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.eventType)}`}>
          {getEventTypeLabel(event.eventType)}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {formatDateTime(event.registrationDeadline)}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
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
          <ActionButton
            icon={Eye}
            color="blue"
            onClick={() => onViewDetails(event)}
            title="View Details"
          />
          <ActionButton
            icon={Edit}
            color="green"
            onClick={() => onEdit(event._id)}
            title="Edit Event"
          />
          <ActionButton
            icon={Trash2}
            color="red"
            onClick={() => onDelete(event)}
            title="Delete Event"
          />
        </div>
      </td>
    </tr>
  );
};

const ActionButton = ({ icon: Icon, color, onClick, title }) => (
  <button
    onClick={onClick}
    className={`p-1.5 text-${color}-600 hover:bg-${color}-50 rounded-lg transition cursor-pointer`}
    title={title}
    type="button"
  >
    <Icon className="w-4 h-4" />
  </button>
);

const EmptyState = ({ hasEvents }) => (
  <div className="text-gray-500">
    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
    <p className="text-lg font-medium mb-2">No events found</p>
    <p className="text-sm">
      {hasEvents
        ? "Try adjusting your filters"
        : "No events have been created yet"}
    </p>
  </div>
);

const Pagination = ({
  currentPage,
  totalPages,
  startIndex,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const getPageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="mt-6 px-6 py-4 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(startIndex + itemsPerPage, totalItems)}
          </span>{" "}
          of <span className="font-medium">{totalItems}</span> results
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
          >
            Previous
          </button>

          {getPageNumbers.map((pageNum, index) => (
            <button
              key={index}
              onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
              disabled={pageNum === '...'}
              className={`px-3 py-1 border rounded-lg text-sm ${
                pageNum === currentPage
                  ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                  : pageNum === '...'
                  ? "border-none cursor-default"
                  : "border-gray-300 hover:bg-gray-50 text-gray-700"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const EventDetailsModal = ({
  event,
  onClose,
  onEdit,
  isRegistrationOpen,
  getEventTypeLabel,
  formatDateTime,
}) => {
  const isOpen = isRegistrationOpen(event.registrationDeadline);

  const handleEdit = () => {
    onEdit(event._id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">Event Details</h3>
              <p className="text-purple-100 text-sm mt-1">
                Complete event information
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 group"
              aria-label="Close"
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
                  {event.title}
                </h2>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    event.eventType === "team"
                      ? "bg-blue-100 text-blue-800"
                      : event.eventType === "duo"
                      ? "bg-green-100 text-green-800"
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {getEventTypeLabel(event.eventType)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {isOpen ? "📅 Registrations Open" : "⛔ Registrations Closed"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Event ID</p>
                <p className="font-mono text-gray-700 font-semibold">
                  {event._id?.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>
          </div>

          {/* Image Gallery */}
          {event.images && event.images.length > 0 && (
            <ImageGallery images={event.images} />
          )}

          {/* Event Information Grid */}
          <EventInfoGrid
            event={event}
            isOpen={isOpen}
            formatDateTime={formatDateTime}
          />

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium flex-1"
            >
              Close Details
            </button>
            <button
              onClick={handleEdit}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-medium flex-1 shadow-md hover:shadow-lg"
            >
              Edit Event
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all font-medium flex-1 shadow-md hover:shadow-lg">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageGallery = ({ images }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
          Event Gallery
        </h4>
        <p className="text-sm text-gray-500 mt-1">Scroll to view all images</p>
      </div>
      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
        {images.length} {images.length === 1 ? "Image" : "Images"}
      </span>
    </div>

    <div className="relative">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group flex-shrink-0 w-72 h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <img
              src={image.url}
              alt={`Event ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-semibold">Image {index + 1}</p>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {index + 1}/{images.length}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll indicators */}
      {images.length > 3 && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </>
      )}
    </div>

    {/* Image thumbnails indicator */}
    {images.length > 1 && (
      <div className="flex justify-center gap-2 mt-4">
        {images.slice(0, 5).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === 0 ? "bg-purple-600" : "bg-gray-300"
            }`}
          />
        ))}
        {images.length > 5 && (
          <span className="text-xs text-gray-500 ml-2">
            +{images.length - 5} more
          </span>
        )}
      </div>
    )}
  </div>
);

const EventInfoGrid = ({ event, isOpen, formatDateTime }) => {
  const infoCards = [
    {
      title: "Category & Type",
      icon: Tag,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      content: (
        <>
          <p className="font-semibold text-gray-800">
            {event.category?.name || "N/A"}
          </p>
          <p className="text-xs text-gray-500 mt-2">Sub-category</p>
          <p className="font-medium text-gray-700">
            {event.subCategory?.title || "N/A"}
          </p>
        </>
      ),
    },
    {
      title: "Venue",
      icon: MapPin,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      content: (
        <>
          <p className="font-semibold text-gray-800">{event.venueName}</p>
          <p className="text-xs text-gray-500 mt-2">Capacity</p>
          <p className="font-medium text-gray-700">
            {event.capacity} participants
          </p>
        </>
      ),
    },
    {
      title: "Timing",
      icon: Clock,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      content: (
        <>
          <div>
            <p className="text-xs text-gray-500">Start</p>
            <p className="font-medium text-gray-700">
              {formatDateTime(event.startTime)}
            </p>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">End</p>
            <p className="font-medium text-gray-700">
              {formatDateTime(event.endTime)}
            </p>
          </div>
        </>
      ),
    },
    {
      title: "Registration",
      icon: Calendar,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      content: (
        <>
          <div>
            <p className="text-xs text-gray-500">Deadline</p>
            <p className="font-medium text-gray-700">
              {formatDateTime(event.registrationDeadline)}
            </p>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">Participation Fee</p>
            <p className="font-medium text-gray-700 text-lg">
              ₹{event.fee}
              <span className="text-sm text-gray-500 ml-2">
                {event.fee === 0 ? "(Free Event)" : "(Paid Event)"}
              </span>
            </p>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="mb-8">
      <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        Event Information
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {infoCards.map((card, index) => (
          <InfoCard key={index} {...card} />
        ))}

        {/* Team Info Card - Conditional */}
        {event.eventType === "team" && (
          <InfoCard
            title="Team Requirements"
            icon={Users}
            bgColor="bg-indigo-100"
            iconColor="text-indigo-600"
            content={
              <div className="mt-3">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Minimum</p>
                    <p className="text-lg font-bold text-gray-800">
                      {event.teamSize?.min || 1}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-gray-300" />
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Maximum</p>
                    <p className="text-lg font-bold text-gray-800">
                      {event.teamSize?.max || 1}
                    </p>
                  </div>
                </div>
              </div>
            }
          />
        )}

        {/* Status Card */}
        <InfoCard
          title="Current Status"
          icon={isOpen ? CheckCircle : XCircle}
          bgColor={isOpen ? "bg-green-100" : "bg-red-100"}
          iconColor={isOpen ? "text-green-600" : "text-red-600"}
          content={
            <>
              <div className={`inline-flex items-center px-4 py-2 rounded-lg ${
                isOpen ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                {isOpen ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
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
                {isOpen
                  ? "Participants can register until deadline"
                  : "Registration period has ended"}
              </p>
            </>
          }
        />
      </div>
    </div>
  );
};

const InfoCard = ({ title, icon: Icon, bgColor, iconColor, content }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 ${bgColor} rounded-lg`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="font-semibold text-gray-800">Details</p>
      </div>
    </div>
    <div className="mt-3">{content}</div>
  </div>
);

const DeleteConfirmationModal = ({ event, onClose, onConfirm, isLoading }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl max-w-md w-full p-6">
      <div className="text-center">
        <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Delete Event
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{event?.title}"? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
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
);

export default EventList;