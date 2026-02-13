import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import {
  FiUsers,
  FiMail,
  FiCalendar,
  FiSearch,
  FiFilter,
  FiTrash2,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiUserCheck,
  FiUserX,
  FiRefreshCw,
  FiPhone,
  FiMapPin,
  FiBookOpen,
  FiUser,
  FiEdit2,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import { MdOutlineSort, MdBlock, MdDelete } from "react-icons/md";

// ==================== API FUNCTIONS ====================
const fetchUsers = async ({ queryKey }) => {
  const [, { page, limit, search, active, sortBy }] = queryKey;
  
  const params = {
    page,
    limit,
    ...(search && { search }),
    ...(active !== "" && { active }),
    ...(sortBy && { sortBy }),
  };

  const { data } = await api.get("/admin/auth/users", { params });
  return data;
};

const deleteUser = async (userId) => {
  const { data } = await api.delete(`/v1/auth/${userId}`);
  return data;
};

const toggleUserBlock = async ({ userId, isBlocked }) => {
  const { data } = await api.patch(`/admin/auth/users/${userId}/status`, {
    active: isBlocked,
  });
  return data;
};

// ==================== CONSTANTS ====================
const USERS_PER_PAGE = 8;
const STATUS_OPTIONS = ["all", "active", "blocked", "deleted"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name_asc", label: "Name A-Z" },
  { value: "name_desc", label: "Name Z-A" },
];

// ==================== STATS CARD COMPONENT ====================
const StatsCard = React.memo(({ title, value, icon: Icon, bgColor, iconColor }) => (
  <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
          {value}
        </p>
      </div>
      <div className={`p-2 md:p-3 ${bgColor} rounded-lg`}>
        <Icon className={`text-xl md:text-2xl ${iconColor}`} />
      </div>
    </div>
  </div>
));

StatsCard.displayName = 'StatsCard';

// ==================== USER TABLE ROW COMPONENT ====================
const UserTableRow = React.memo(({ 
  user, 
  onEdit, 
  onView, 
  onToggleBlock, 
  onDelete,
  isUpdating,
  loading 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserStatus = (user) => {
    if (user.isDeleted) return "Deleted";
    if (user.isBlocked) return "Blocked";
    return "Active";
  };

  const getStatusColor = (user) => {
    if (user.isDeleted) return "bg-gray-100 text-gray-800 border-gray-300";
    if (user.isBlocked) return "bg-red-100 text-red-800 border-red-300";
    return "bg-green-100 text-green-800 border-green-300";
  };

  const getStatusIcon = (user) => {
    if (user.isDeleted) return <MdDelete className="inline mr-1" />;
    if (user.isBlocked) return <MdBlock className="inline mr-1" />;
    return <FiUserCheck className="inline mr-1" />;
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      {/* User Info */}
      <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center">
          <div className="h-9 w-9 md:h-10 md:w-10 flex-shrink-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
            <FiUser className="text-blue-600" />
          </div>
          <div className="ml-3">
            <div 
              className="text-sm font-semibold text-gray-900 truncate md:whitespace-normal hover:underline cursor-pointer" 
              onClick={() => onEdit(user._id)}
            >
              {user.name || "N/A"}
            </div>
            <div className="text-xs text-gray-500">
              ID: {user.userId || "N/A"}
            </div>
            <div className="text-xs text-gray-400">
              Role: {user.role || "user"}
            </div>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
        <div className="space-y-1 text-sm">
          <div className="flex items-center text-gray-900">
            <FiMail className="mr-2 text-gray-400" />
            <span className="truncate md:whitespace-normal">
              {user.email || "N/A"}
            </span>
          </div>
          <div className="flex items-center text-gray-900">
            <FiPhone className="mr-2 text-gray-400" />
            {user.mobile_no || "N/A"}
          </div>
          <div className="flex items-center text-gray-900">
            <FiMapPin className="mr-2 text-gray-400" />
            {user.city || "N/A"}{" "}
            {user.gender && `• ${user.gender}`}
          </div>
        </div>
      </td>

      {/* Education */}
      <td className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 md:py-4">
        <div className="text-sm text-gray-900">
          <div className="flex items-center">
            <FiBookOpen className="mr-2 text-gray-400" />
            <span className="truncate md:whitespace-normal">
              {user.college || "N/A"}
            </span>
          </div>
          <div className="ml-6 text-gray-500 text-sm">
            {user.course || "N/A"}
          </div>
        </div>
      </td>

      {/* Registration */}
      <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center text-sm text-gray-900">
          <FiCalendar className="mr-2 text-gray-400" />
          {user.createdAt ? formatDate(user.createdAt) : "N/A"}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Updated: {user.updatedAt ? formatDate(user.updatedAt) : "N/A"}
        </div>
      </td>

      {/* Status */}
      <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(
            user
          )}`}
        >
          {getStatusIcon(user)}
          {getUserStatus(user)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(user._id)}
            disabled={loading}
            className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Edit User"
          >
            <FiEdit2 />
          </button>

          <button
            onClick={() => onView(user)}
            disabled={loading}
            className="p-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="View Details"
          >
            <FiEye />
          </button>

          <button
            onClick={() => onToggleBlock(user._id)}
            disabled={user.isDeleted || isUpdating || loading}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              user.isBlocked
                ? "bg-green-50 text-green-700 hover:bg-green-100"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            } ${
              user.isDeleted || isUpdating || loading
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            title={user.isBlocked ? "Unblock User" : "Block User"}
          >
            {isUpdating ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : user.isBlocked ? (
              <FiUserCheck />
            ) : (
              <MdBlock />
            )}
          </button>

          <button
            onClick={() => onDelete(user._id)}
            disabled={user.isDeleted || loading}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              user.isDeleted || loading
                ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
            title="Delete User"
          >
            <FiTrash2 />
          </button>
        </div>
      </td>
    </tr>
  );
});

UserTableRow.displayName = 'UserTableRow';

// ==================== MAIN COMPONENT ====================
const Alluser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Get active filter value for API
  const getActiveFilterValue = useCallback(() => {
    switch (statusFilter) {
      case "active":
        return "true";
      case "blocked":
        return "false";
      default:
        return "";
    }
  }, [statusFilter]);

  // ==================== TANSTACK QUERY ====================
  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['users', { 
      page: currentPage, 
      limit: USERS_PER_PAGE, 
      search: debouncedSearch, 
      active: getActiveFilterValue(),
      sortBy 
    }],
    queryFn: fetchUsers,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Extract data from query response
  const users = data?.data || [];
  const paginationMeta = data?.meta || {
    total: 0,
    page: 1,
    limit: USERS_PER_PAGE,
    totalPages: 1,
  };

  // ==================== MUTATIONS ====================
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteConfirm(null);
    },
    onError: (err) => {
      console.error("Delete error:", err);
    },
  });

  const toggleBlockMutation = useMutation({
    mutationFn: toggleUserBlock,
    onMutate: async ({ userId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] });

      // Snapshot previous value
      const previousUsers = queryClient.getQueryData(['users']);

      // Optimistically update
      queryClient.setQueryData(['users'], (old) => ({
        ...old,
        data: old?.data?.map(user =>
          user._id === userId
            ? { ...user, isBlocked: !user.isBlocked }
            : user
        ),
      }));

      return { previousUsers };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['users'], context.previousUsers);
      console.error("Toggle block error:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setUpdatingUserId(null);
    },
  });

  // ==================== HANDLERS ====================
  const handleDeleteUser = useCallback((userId) => {
    deleteMutation.mutate(userId);
  }, [deleteMutation]);

  const handleToggleBlock = useCallback((userId) => {
    setUpdatingUserId(userId);
    const user = users.find(u => u._id === userId);
    if (user) {
      toggleBlockMutation.mutate({ userId, isBlocked: user.isBlocked });
    }
  }, [users, toggleBlockMutation]);

  const handleUpdateUser = useCallback((userId) => {
    navigate(`/admin/dashboard/users/update/${userId}`);
  }, [navigate]);

  const handleViewDetails = useCallback((user) => {
    setSelectedUser(user);
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    if (pageNumber < 1 || pageNumber > paginationMeta.totalPages) return;
    setCurrentPage(pageNumber);
    // Scroll to top of table
    document.querySelector('.bg-white.rounded-2xl')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }, [paginationMeta.totalPages]);

  const handleRefresh = useCallback(() => {
    setSearchTerm("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
    refetch();
  }, [refetch]);

  // ==================== MEMOIZED VALUES ====================
  const stats = useMemo(() => {
    if (!users.length) {
      return {
        total: paginationMeta.total,
        active: 0,
        blocked: 0,
        deleted: 0,
      };
    }

    const active = users.filter(
      (user) => !user.isBlocked && !user.isDeleted
    ).length;
    const blocked = users.filter(
      (user) => user.isBlocked && !user.isDeleted
    ).length;
    const deleted = users.filter((user) => user.isDeleted).length;

    return {
      total: paginationMeta.total,
      active,
      blocked,
      deleted,
    };
  }, [users, paginationMeta.total]);

  const sortedUsers = useMemo(() => {
    if (!users.length) return [];

    const sorted = [...users];
    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "name_asc":
        return sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      case "name_desc":
        return sorted.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
      default:
        return sorted;
    }
  }, [users, sortBy]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const loading = isLoading || isFetching;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FiUsers className="mr-3 text-blue-600" />
              User Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all registered users, view details, and perform actions
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="mt-4 md:mt-0 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh Users'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Total Users" 
            value={stats.total} 
            icon={FiUsers}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatsCard 
            title="Active Users" 
            value={stats.active} 
            icon={FiUserCheck}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatsCard 
            title="Blocked Users" 
            value={stats.blocked} 
            icon={MdBlock}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          />
          <StatsCard 
            title="Deleted Users" 
            value={stats.deleted} 
            icon={MdDelete}
            bgColor="bg-gray-50"
            iconColor="text-gray-600"
          />
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg mb-6 md:mb-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, user ID, mobile, college, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 md:py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700"
                disabled={loading}
              />
            </div>
            {searchTerm && (
              <p className="text-xs text-gray-500 mt-2">
                Searching in: name, email, user ID, mobile, college, city,
                course, gender
              </p>
            )}
          </div>

          {/* Status Filter and Sort */}
          <div className="flex flex-wrap gap-3 md:gap-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <FiFilter className="text-gray-500 hidden md:block" />
              <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      if (!loading) {
                        setStatusFilter(status);
                        setCurrentPage(1);
                      }
                    }}
                    disabled={loading}
                    className={`px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 capitalize cursor-pointer whitespace-nowrap ${
                      statusFilter === status
                        ? status === "active"
                          ? "bg-green-500 text-white"
                          : status === "blocked"
                          ? "bg-red-500 text-white"
                          : status === "deleted"
                          ? "bg-gray-500 text-white"
                          : "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  if (!loading) {
                    setSortBy(e.target.value);
                  }
                }}
                disabled={loading}
                className="appearance-none pl-4 pr-10 py-2 md:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer w-full text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <MdOutlineSort className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 flex items-center">
              <FiUserX className="mr-2" /> {error.message}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      {!loading && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="relative w-full overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-[900px] md:min-w-[1100px] divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-3 sm:px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap min-w-[220px]">
                    User Info
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap min-w-[220px]">
                    Contact
                  </th>
                  <th className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap min-w-[180px]">
                    Education
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap min-w-[180px]">
                    Registration
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap min-w-[120px]">
                    Status
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap min-w-[200px]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {sortedUsers.length > 0 ? (
                  sortedUsers.map((user) => (
                    <UserTableRow
                      key={user._id}
                      user={user}
                      onEdit={handleUpdateUser}
                      onView={handleViewDetails}
                      onToggleBlock={handleToggleBlock}
                      onDelete={() => setDeleteConfirm(user._id)}
                      isUpdating={updatingUserId === user._id}
                      loading={loading}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-500">
                      <FiUsers className="mx-auto h-12 w-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm mt-2">
                        {searchTerm
                          ? `No results for "${searchTerm}"`
                          : "Try adjusting search or filters"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && paginationMeta.totalPages > 0 && sortedUsers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-4 bg-white rounded-2xl shadow-lg mt-4 md:mt-6 border border-gray-100">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing{" "}
            <span className="font-semibold">
              {(paginationMeta.page - 1) * USERS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold">
              {Math.min(paginationMeta.page * USERS_PER_PAGE, paginationMeta.total)}
            </span>{" "}
            of <span className="font-semibold">{paginationMeta.total}</span> users
            {searchTerm && (
              <span className="text-xs text-gray-500 ml-2">(filtered)</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* First Page Button */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || loading}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                currentPage === 1 || loading
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 cursor-pointer"
              }`}
              title="First Page"
            >
              <FiChevronsLeft size={18} />
            </button>

            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                currentPage === 1 || loading
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 cursor-pointer"
              }`}
              title="Previous Page"
            >
              <FiChevronLeft size={18} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, paginationMeta.totalPages) }, (_, i) => {
                let pageNumber;
                if (paginationMeta.totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= paginationMeta.totalPages - 2) {
                  pageNumber = paginationMeta.totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={loading}
                    className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            {/* Next Page Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === paginationMeta.totalPages || loading}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                currentPage === paginationMeta.totalPages || loading
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 cursor-pointer"
              }`}
              title="Next Page"
            >
              <FiChevronRight size={18} />
            </button>

            {/* Last Page Button */}
            <button
              onClick={() => handlePageChange(paginationMeta.totalPages)}
              disabled={currentPage === paginationMeta.totalPages || loading}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                currentPage === paginationMeta.totalPages || loading
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 cursor-pointer"
              }`}
              title="Last Page"
            >
              <FiChevronsRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  User Details
                </h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <p className="text-lg font-semibold">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email Address</label>
                    <p className="text-lg">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">User ID</label>
                    <p className="text-lg font-mono">{selectedUser.userId}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Mobile Number</label>
                    <p className="text-lg">{selectedUser.mobile_no}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">College</label>
                    <p className="text-lg">{selectedUser.college}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Course</label>
                    <p className="text-lg">
                      {selectedUser.course || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">City & Gender</label>
                    <p className="text-lg">
                      {selectedUser.city || "Not specified"} •{" "}
                      {selectedUser.gender || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Account Status</label>
                    <div className="flex items-center mt-1">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          selectedUser.isDeleted
                            ? "bg-gray-100 text-gray-800"
                            : selectedUser.isBlocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {selectedUser.isDeleted ? (
                          <MdDelete className="inline mr-1" />
                        ) : selectedUser.isBlocked ? (
                          <MdBlock className="inline mr-1" />
                        ) : (
                          <FiUserCheck className="inline mr-1" />
                        )}
                        {selectedUser.isDeleted
                          ? "Deleted"
                          : selectedUser.isBlocked
                          ? "Blocked"
                          : "Active"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 text-teal-600 font-bold">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Registration Date</label>
                    <p className="text-lg">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Last Updated</label>
                    <p className="text-lg">{formatDate(selectedUser.updatedAt)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleUpdateUser(selectedUser._id);
                    setSelectedUser(null);
                  }}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium cursor-pointer flex items-center"
                >
                  <FiEdit2 className="mr-2" />
                  Edit User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FiTrash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete User
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(deleteConfirm)}
                  disabled={deleteMutation.isLoading}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {deleteMutation.isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Delete User'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alluser;