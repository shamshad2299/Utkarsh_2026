import { useEffect, useState, useMemo, useCallback } from "react";
import { 
  FiDownload, 
  FiSearch, 
  FiFilter,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiBookOpen,
  FiDollarSign,
  FiClock,
  FiUsers,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader
} from "react-icons/fi";
import { MdLocationCity, MdSchool } from "react-icons/md";
import { FaUniversity, FaRegCalendarAlt, FaGenderless } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import * as XLSX from 'xlsx';
import api from "../api/axios";

const SoloRegistrations = () => {
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [exportLoading, setExportLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  // Fetch registrations
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminAccessToken");

      const response = await api.get("/admin/auth/registrations?type=solo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setRegistrations(response.data.data);
      console.log("Fetched solo registrations:", response.data.data);
    } catch (error) {
      console.error("Error fetching solo registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRegistrations();
    setRefreshing(false);
  };

  // Format date for Excel
  const formatDateForExport = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format time only for Excel
  const formatTimeForExport = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date only for Excel
  const formatDateOnlyForExport = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ✅ NEW: Client-side export function with ALL fields
  const handleExportSolo = useCallback(async () => {
    try {
      setExportLoading(true);

      // Prepare data for export
      const exportData = registrations.map((reg, index) => ({
        'S.No': index + 1,
        // User Details
        'User ID': reg.userId?.userId || 'N/A',
        'Full Name': reg.userId?.name || 'N/A',
        'Email': reg.userId?.email || 'N/A',
        'Mobile Number': reg.userId?.mobile_no || 'N/A',
        'Gender': reg.userId?.gender || 'N/A',
        'City': reg.userId?.city || 'N/A',
        
        // Education
        'College': reg.userId?.college || 'N/A',
        'Course/Branch': reg.userId?.course || 'N/A',
        
        // Event Details
        'Event Name': reg.eventId?.title || 'N/A',
        'Event Type': reg.eventId?.eventType || 'solo',
        'Registration Fee': reg.eventId?.fee || 0,
        'Venue': reg.eventId?.venueName || 'TBA',
        
        // Date & Time
        'Event Start Date': formatDateOnlyForExport(reg.eventId?.startTime),
        'Event Start Time': formatTimeForExport(reg.eventId?.startTime),
        'Event End Date': formatDateOnlyForExport(reg.eventId?.endTime),
        'Event End Time': formatTimeForExport(reg.eventId?.endTime),
        
        // Registration Status
        'Payment Status': reg.paymentStatus || 'pending',
        'Check-in Status': reg.checkedIn ? 'Checked In' : 'Not Checked In',
        'Registration Status': reg.status || 'pending',
        'Registered On': formatDateForExport(reg.createdAt),
        'Last Updated': formatDateForExport(reg.updatedAt),
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Set column widths
      const colWidths = [
        { wch: 5 },   // S.No
        { wch: 15 },  // User ID
        { wch: 20 },  // Full Name
        { wch: 25 },  // Email
        { wch: 15 },  // Mobile
        { wch: 10 },  // Gender
        { wch: 15 },  // City
        { wch: 25 },  // College
        { wch: 20 },  // Course
        { wch: 30 },  // Event Name
        { wch: 10 },  // Event Type
        { wch: 15 },  // Fee
        { wch: 25 },  // Venue
        { wch: 15 },  // Start Date
        { wch: 10 },  // Start Time
        { wch: 15 },  // End Date
        { wch: 10 },  // End Time
        { wch: 15 },  // Payment Status
        { wch: 15 },  // Check-in Status
        { wch: 15 },  // Registration Status
        { wch: 20 },  // Registered On
        { wch: 20 },  // Last Updated
      ];
      ws['!cols'] = colWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Solo Registrations');

      // Generate filename with date
      const fileName = `solo-registrations-${new Date().toISOString().split('T')[0]}.xlsx`;

      // Save file
      XLSX.writeFile(wb, fileName);

    } catch (error) {
      console.error("Error exporting solo registrations:", error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExportLoading(false);
    }
  }, [registrations]);

  // Filtered registrations with all searchable fields
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const userId = reg.userId?.userId?.toLowerCase() || "";
      const name = reg.userId?.name?.toLowerCase() || "";
      const event = reg.eventId?.title?.toLowerCase() || "";
      const city = reg.userId?.city?.toLowerCase() || "";
      const college = reg.userId?.college?.toLowerCase() || "";
      const course = reg.userId?.course?.toLowerCase() || "";
      const venue = reg.eventId?.venueName?.toLowerCase() || "";
      const mobile = reg.userId?.mobile_no?.toLowerCase() || "";
      const email = reg.userId?.email?.toLowerCase() || "";
      const gender = reg.userId?.gender?.toLowerCase() || "";

      const matchesSearch = 
        userId.includes(searchTerm.toLowerCase()) ||
        name.includes(searchTerm.toLowerCase()) ||
        event.includes(searchTerm.toLowerCase()) ||
        city.includes(searchTerm.toLowerCase()) ||
        college.includes(searchTerm.toLowerCase()) ||
        course.includes(searchTerm.toLowerCase()) ||
        venue.includes(searchTerm.toLowerCase()) ||
        mobile.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        gender.includes(searchTerm.toLowerCase());

      const matchesPayment = paymentFilter === "all" || reg.paymentStatus === paymentFilter;

      return matchesSearch && matchesPayment;
    });
  }, [registrations, searchTerm, paymentFilter]);

  // Pagination
  const paginatedRegistrations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRegistrations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRegistrations, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);

  // Format date function
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge color
  const getPaymentStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case "paid": return "bg-green-100 text-green-800 border-green-300";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "failed": return "bg-red-100 text-red-800 border-red-300";
      case "refunded": return "bg-purple-100 text-purple-800 border-purple-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPaymentIcon = (status) => {
    switch(status?.toLowerCase()) {
      case "paid": return <FiCheckCircle className="inline mr-1" />;
      case "pending": return <FiLoader className="inline mr-1 animate-spin" />;
      case "failed": return <FiAlertCircle className="inline mr-1" />;
      default: return <FiDollarSign className="inline mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <FiUsers className="text-blue-600" />
              Solo Event Registrations
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and view all solo event registrations
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
            >
              <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={handleExportSolo}
              disabled={exportLoading}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {exportLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Exporting...
                </>
              ) : (
                <>
                  <FiDownload className="text-lg" />
                  Export Excel
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Registrations</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{registrations.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FiUsers className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Paid Registrations</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {registrations.filter(r => r.paymentStatus === "paid").length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FiCheckCircle className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Payments</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {registrations.filter(r => r.paymentStatus === "pending").length}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <FiLoader className="text-2xl text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  ₹{registrations
                    .filter(r => r.paymentStatus === "paid")
                    .reduce((sum, r) => sum + (r.eventId?.fee || 0), 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <FiDollarSign className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Name, ID, Event, City, College, Venue, Mobile, Email, Gender..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative min-w-[150px]">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <select
                  value={paymentFilter}
                  onChange={(e) => {
                    setPaymentFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <p>
              Showing <span className="font-semibold">{paginatedRegistrations.length}</span> of{" "}
              <span className="font-semibold">{filteredRegistrations.length}</span> registrations
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <FiX /> Clear Search
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-4 text-left font-semibold whitespace-nowrap">S.No</th>
                <th className="px-4 py-4 text-left font-semibold whitespace-nowrap">User Details</th>
                <th className="px-4 py-4 text-left font-semibold whitespace-nowrap">Contact Info</th>
                <th className="px-4 py-4 text-left font-semibold whitespace-nowrap">Education</th>
                <th className="px-4 py-4 text-left font-semibold whitespace-nowrap">Event Details</th>
                <th className="px-4 py-4 text-left font-semibold whitespace-nowrap">Venue & Time</th>
                <th className="px-4 py-4 text-left font-semibold whitespace-nowrap">Payment</th>
                <th className="px-4 py-4 text-left font-semibold whitespace-nowrap">Registered On</th>
                <th className="px-4 py-4 text-left font-semibold whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRegistrations.map((reg, index) => (
                <tr 
                  key={reg._id} 
                  className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => setSelectedRegistration(reg)}
                >
                  <td className="px-4 py-4 text-gray-600">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  
                  {/* User Details */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        <FiUser className="text-blue-500" />
                        {reg.userId?.name || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {reg.userId?.userId || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <FaGenderless className="text-purple-500" />
                        {reg.userId?.gender || "N/A"}
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="text-sm flex items-center gap-2">
                        <FiMail className="text-gray-400" />
                        <span className="text-gray-600">{reg.userId?.email || "N/A"}</span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <FiPhone className="text-gray-400" />
                        <span className="text-gray-600">{reg.userId?.mobile_no || "N/A"}</span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <MdLocationCity className="text-gray-400" />
                        <span className="text-gray-600">{reg.userId?.city || "N/A"}</span>
                      </div>
                    </div>
                  </td>

                  {/* Education */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="text-sm flex items-center gap-2">
                        <FaUniversity className="text-gray-400" />
                        <span className="text-gray-600">{reg.userId?.college || "N/A"}</span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <FiBookOpen className="text-gray-400" />
                        <span className="text-gray-600">{reg.userId?.course || "N/A"}</span>
                      </div>
                    </div>
                  </td>

                  {/* Event Details */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">
                        {reg.eventId?.title || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Type: {reg.eventId?.eventType || "solo"}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <FiDollarSign className="text-green-500" />
                        Fee: ₹{reg.eventId?.fee || 0}
                      </div>
                    </div>
                  </td>

                  {/* Venue & Time */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="text-sm flex items-center gap-2">
                        <FiMapPin className="text-red-400" />
                        <span className="text-gray-600">{reg.eventId?.venueName || "TBA"}</span>
                      </div>
                      <div className="text-xs flex items-center gap-2">
                        <FaRegCalendarAlt className="text-blue-400" />
                        <span className="text-gray-500">{formatDate(reg.eventId?.startTime)}</span>
                      </div>
                      <div className="text-xs flex items-center gap-2">
                        <IoTimeOutline className="text-purple-400" />
                        <span className="text-gray-500">
                          {formatTime(reg.eventId?.startTime)} - {formatTime(reg.eventId?.endTime)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Payment */}
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusColor(reg.paymentStatus)}`}>
                      {getPaymentIcon(reg.paymentStatus)}
                      {reg.paymentStatus || "pending"}
                    </span>
                  </td>

                  {/* Registered On */}
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-600">
                      {formatDateTime(reg.createdAt)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRegistration(reg);
                      }}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      title="View Details"
                    >
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedRegistrations.length === 0 && (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-gray-500">
                    <FiUsers className="mx-auto h-12 w-12 mb-4 opacity-20" />
                    <p className="text-lg font-medium">No registrations found</p>
                    <p className="text-sm mt-2">
                      {searchTerm 
                        ? `No results for "${searchTerm}"` 
                        : "No solo registrations available"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Registration Details</h2>
                <button
                  onClick={() => setSelectedRegistration(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
                {/* User Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">User Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Full Name</label>
                      <p className="font-medium">{selectedRegistration.userId?.name || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">User ID</label>
                      <p className="font-mono">{selectedRegistration.userId?.userId || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Email</label>
                      <p>{selectedRegistration.userId?.email || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Mobile</label>
                      <p>{selectedRegistration.userId?.mobile_no || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Gender</label>
                      <p className="capitalize">{selectedRegistration.userId?.gender || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">City</label>
                      <p>{selectedRegistration.userId?.city || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Education Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600 border-b pb-2">Education Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">College</label>
                      <p>{selectedRegistration.userId?.college || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Course</label>
                      <p>{selectedRegistration.userId?.course || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Event Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-600 border-b pb-2">Event Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Event Name</label>
                      <p className="font-medium">{selectedRegistration.eventId?.title || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Event Type</label>
                      <p className="capitalize">{selectedRegistration.eventId?.eventType || "solo"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Venue</label>
                      <p>{selectedRegistration.eventId?.venueName || "TBA"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Registration Fee</label>
                      <p className="text-green-600 font-semibold">₹{selectedRegistration.eventId?.fee || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-600 border-b pb-2">Date & Time</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Start Date</label>
                      <p>{formatDate(selectedRegistration.eventId?.startTime)}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Start Time</label>
                      <p>{formatTime(selectedRegistration.eventId?.startTime)}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">End Date</label>
                      <p>{formatDate(selectedRegistration.eventId?.endTime)}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">End Time</label>
                      <p>{formatTime(selectedRegistration.eventId?.endTime)}</p>
                    </div>
                  </div>
                </div>

                {/* Registration Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600 border-b pb-2">Registration Status</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Payment Status</label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(selectedRegistration.paymentStatus)}`}>
                          {getPaymentIcon(selectedRegistration.paymentStatus)}
                          {selectedRegistration.paymentStatus || "pending"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Check-in Status</label>
                      <p>{selectedRegistration.checkedIn ? "Checked In" : "Not Checked In"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Registered On</label>
                      <p>{formatDateTime(selectedRegistration.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Last Updated</label>
                      <p>{formatDateTime(selectedRegistration.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedRegistration(null)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoloRegistrations;