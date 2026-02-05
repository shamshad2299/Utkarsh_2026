import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const Alluser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [updatingUser, setUpdatingUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    deleted: 0,
  });

  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  // Function to fetch users with query parameters
 const fetchUser = async (page = 1, search = "", active = "") => {
  setLoading(true);

  const params = {
    page,
    limit: usersPerPage, // = 8
    ...(search && { search }),
    ...(active !== "" && { active }),
  };

  const res = await api.get("/admin/auth/users", { params });
  setUsers(res.data.data);
  setPaginationMeta(res.data.meta);

  setLoading(false);
};


  // Initial fetch on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchUser(1, searchTerm, getActiveFilterValue());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle status filter change
  useEffect(() => {
    setCurrentPage(1);
    fetchUser(1, searchTerm, getActiveFilterValue());
  }, [statusFilter]);

  // Get active filter value for API
  const getActiveFilterValue = () => {
    switch (statusFilter) {
      case "active":
        return "true";
      case "blocked":
        return "false";
      default:
        return "";
    }
  };

  // Function to perform local filtering for additional fields
  const getFilteredUsers = () => {
    if (!searchTerm) return users;

    const searchLower = searchTerm.toLowerCase();

    return users.filter((user) => {
      return (
        (user.name && user.name.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        (user.userId && user.userId.toLowerCase().includes(searchLower)) ||
        (user.mobile_no && user.mobile_no.includes(searchTerm)) ||
        (user.city && user.city.toLowerCase().includes(searchLower)) ||
        (user.college && user.college.toLowerCase().includes(searchLower)) ||
        (user.course && user.course.toLowerCase().includes(searchLower)) ||
        (user.gender && user.gender.toLowerCase().includes(searchLower))
      );
    });
  };

  // Calculate statistics from filtered data
  useEffect(() => {
    if (users.length > 0) {
      const total = paginationMeta.total || users.length;
      const active = users.filter(
        (user) => !user.isBlocked && !user.isDeleted
      ).length;
      const blocked = users.filter(
        (user) => user.isBlocked && !user.isDeleted
      ).length;
      const deleted = users.filter((user) => user.isDeleted).length;

      setStats({ total, active, blocked, deleted });
    }
  }, [users, paginationMeta.total]);

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/v1/auth/${userId}`);

      setUsers(users.filter((user) => user._id !== userId));
      setDeleteConfirm(null);

      fetchUser(currentPage, searchTerm, getActiveFilterValue());
    } catch (err) {
      console.error(err);
      setError("Failed to delete user");
    }
  };

  const handleToggleBlock = async (userId) => {
  setUpdatingUser(userId);

  try {
    // 🔥 Always read latest value from state
    const user = users.find((u) => u._id === userId);
    if (!user) return;

    const response = await api.patch(
      `/admin/auth/users/${userId}/status`,
      {
        active: user.isBlocked, // 👈 THIS IS THE FIX
      }
    );

    const updatedUser = response.data.data;

    // ✅ Replace user fully with backend truth
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? updatedUser : u))
    );
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Failed to update user status");
  } finally {
    setUpdatingUser(null);
  }
};
  // Navigate to update user page
  const handleUpdateUser = (userId) => {
    navigate(`/admin/dashboard/users/update/${userId}`);
  };

  // View user details modal
  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const formatDate = (dateString) => {
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

  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchUser(pageNumber, searchTerm, getActiveFilterValue());
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
    fetchUser(1, "", "");
  };

  // Get users for display
  const displayUsers = searchTerm ? getFilteredUsers() : users;

  // Sort users locally if needed
  const sortedUsers = [...displayUsers].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "name_asc":
        return (a.name || "").localeCompare(b.name || "");
      case "name_desc":
        return (b.name || "").localeCompare(a.name || "");
      default:
        return 0;
    }
  });

  // Pagination logic for client-side filtered results
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

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
            className="mt-4 md:mt-0 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl cursor-pointer"
          >
            <FiRefreshCw className="mr-2" />
            Refresh Users
          </button>
        </div>

        {/* Stats Cards - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100 cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
                <FiUsers className="text-xl md:text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100 cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Users</p>
                <p className="text-2xl md:text-3xl font-bold text-green-700 mt-1 md:mt-2">
                  {stats.active}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-green-50 rounded-lg">
                <FiUserCheck className="text-xl md:text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100 cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Blocked Users</p>
                <p className="text-2xl md:text-3xl font-bold text-red-700 mt-1 md:mt-2">
                  {stats.blocked}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-red-50 rounded-lg">
                <MdBlock className="text-xl md:text-2xl text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100 cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Deleted Users</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-700 mt-1 md:mt-2">
                  {stats.deleted}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-gray-50 rounded-lg">
                <MdDelete className="text-xl md:text-2xl text-gray-600" />
              </div>
            </div>
          </div>
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
              />
            </div>
            {searchTerm && (
              <p className="text-xs text-gray-500 mt-2">
                Searching in: name, email, user ID, mobile, college, city,
                course, gender
              </p>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-3 md:gap-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <FiFilter className="text-gray-500 hidden md:block" />
              <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto">
                {["all", "active", "blocked", "deleted"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                    }}
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
                    }`}
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
                  setSortBy(e.target.value);
                }}
                className="appearance-none pl-4 pr-10 py-2 md:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer w-full text-gray-700"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name_asc">Name A-Z</option>
                <option value="name_desc">Name Z-A</option>
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
              <FiUserX className="mr-2" /> {error}
            </p>
            <button
              onClick={() => setError("")}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="relative w-full overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[900px] md:min-w-[1100px] divide-y divide-gray-200 overflow-hidden">
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
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    {/* User Info */}
                    <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
                      <div className="flex items-center">
                        <div className="h-9 w-9 md:h-10 md:w-10 flex-shrink-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                          <FiUser className="text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900 truncate md:whitespace-normal hover:underline cursor-pointer" onClick={() => handleUpdateUser(user._id)}>
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

                    {/* Education - Hidden on mobile, visible on md and above */}
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
                        Updated:{" "}
                        {user.updatedAt ? formatDate(user.updatedAt) : "N/A"}
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
                    <td
                      className="px-3 sm:px-4 md:px-6 py-3 md:py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateUser(user._id)}
                          className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                          title="Edit User"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          onClick={() => handleViewDetails(user)}
                          className="p-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                          title="View Details"
                        >
                          <FiEye />
                        </button>

                        <button
                          onClick={() =>
                            handleToggleBlock(user._id, user.isBlocked)
                          }
                          disabled={user.isDeleted || updatingUser === user._id}
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            user.isBlocked
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-red-50 text-red-700 hover:bg-red-100"
                          } ${
                            user.isDeleted || updatingUser === user._id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          title={
                            user.isBlocked ? "Unblock User" : "Block User"
                          }
                        >
                          {updatingUser === user._id ? (
                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          ) : user.isBlocked ? (
                            <FiUserCheck />
                          ) : (
                            <MdBlock />
                          )}
                        </button>

                        <button
                          onClick={() => setDeleteConfirm(user._id)}
                          disabled={user.isDeleted}
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            user.isDeleted
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

      {/* Pagination */}
      {sortedUsers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-4 bg-white rounded-2xl shadow-lg mt-4 md:mt-6 border border-gray-100">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing{" "}
            <span className="font-semibold">{indexOfFirstUser + 1}</span> to{" "}
            <span className="font-semibold">
              {Math.min(indexOfLastUser, sortedUsers.length)}
            </span>{" "}
            of <span className="font-semibold">{sortedUsers.length}</span> users
            {searchTerm && (
              <span className="text-xs text-gray-500 ml-2">(filtered)</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* First Page Button */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 cursor-pointer"
              }`}
              title="First Page"
            >
              <FiChevronsLeft size={18} />
            </button>

            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 cursor-pointer"
              }`}
              title="Previous Page"
            >
              <FiChevronLeft size={18} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return pageNumber <= totalPages ? (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ) : null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 cursor-pointer"
              }`}
              title="Next Page"
            >
              <FiChevronRight size={18} />
            </button>

            {/* Last Page Button */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                currentPage === totalPages
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
                    <label className="text-sm text-gray-500">
                      Email Address
                    </label>
                    <p className="text-lg">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">User ID</label>
                    <p className="text-lg font-mono">{selectedUser.userId}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Mobile Number
                    </label>
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
                    <label className="text-sm text-gray-500">
                      City & Gender
                    </label>
                    <p className="text-lg">
                      {selectedUser.city || "Not specified"} •{" "}
                      {selectedUser.gender || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Account Status
                    </label>
                    <div className="flex items-center mt-1">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          selectedUser
                        )}`}
                      >
                        {getStatusIcon(selectedUser)}
                        {getUserStatus(selectedUser)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 text-teal-600 font-bold" >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">
                      Registration Date
                    </label>
                    <p className="text-lg">
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Last Updated
                    </label>
                    <p className="text-lg">
                      {formatDate(selectedUser.updatedAt)}
                    </p>
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
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-medium cursor-pointer"
                >
                  Delete User
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