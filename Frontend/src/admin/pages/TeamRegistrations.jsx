import { useEffect, useState } from "react";
import api from "../api/axios";
import * as XLSX from 'xlsx';
import { 
  Download, 
  Search, 
  Loader2, 
  Users, 
  Calendar, 
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  CheckCircle,
  XCircle,
  AlertCircle,
  X
} from "lucide-react";

const TeamRegistrations = () => {
    const [loading, setLoading] = useState(true);
    const [registrations, setRegistrations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [exporting, setExporting] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Fetch registrations
    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const token = localStorage.getItem("adminAccessToken");
                const res = await api.get("/admin/auth/registrations?type=team", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRegistrations(res.data.data);
            } catch (error) {
                console.error("Error fetching team registrations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRegistrations();
    }, []);

    // Filter registrations
    const filteredRegistrations = registrations.filter((reg) => {
        const team = reg.teamId || {};
        const event = reg.eventId || {};
        const leader = team.teamLeader || {};
        const members = team.teamMembers || [];

        const searchFields = [
            team.teamName,
            leader.userId,
            leader.name,
            leader.email,
            leader.mobile_no,
            event.title,
            ...members.map(m => m.name),
            ...members.map(m => m.userId),
            ...members.map(m => m.email)
        ].map(field => field?.toLowerCase() || "");

        return searchFields.some(field => field.includes(searchTerm.toLowerCase()));
    });

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const statusMap = {
            confirmed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
            pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
            cancelled: { color: "bg-red-100 text-red-800", icon: XCircle }
        };
        const { color, icon: Icon } = statusMap[status?.toLowerCase()] || statusMap.pending;
        return { color, Icon };
    };

    // Get payment status badge
    const getPaymentBadge = (status) => {
        const statusMap = {
            paid: { color: "bg-green-100 text-green-800", icon: CheckCircle },
            pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
            failed: { color: "bg-red-100 text-red-800", icon: XCircle }
        };
        const { color, icon: Icon } = statusMap[status?.toLowerCase()] || statusMap.pending;
        return { color, Icon };
    };

    // Handle export
    const handleExport = async () => {
        try {
            setExporting(true);
            const token = localStorage.getItem("adminAccessToken");

            // Try API export first
            try {
                const response = await api.get("/admin/auth/export-registrations?type=team", {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: "blob"
                });

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `team-registrations-${new Date().toISOString().split('T')[0]}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                return;
            } catch (apiError) {
                console.log("API export failed, falling back to client-side export");
            }

            // Fallback: Client-side export
            const exportData = filteredRegistrations.map(reg => {
                const team = reg.teamId || {};
                const event = reg.eventId || {};
                const leader = team.teamLeader || {};
                const members = team.teamMembers || [];

                return {
                    "Registration ID": reg._id,
                    "Team Name": team.teamName || "N/A",
                    "Leader ID": leader.userId || "N/A",
                    "Leader Name": leader.name || "N/A",
                    "Leader Email": leader.email || "N/A",
                    "Leader Phone": leader.mobile_no || "N/A",
                    "Leader College": leader.college || "N/A",
                    "Leader Course": leader.course || "N/A",
                    "Event": event.title || "N/A",
                    "Event Type": event.eventType || "N/A",
                    "Registration Status": reg.status || "pending",
                    "Payment Status": reg.paymentStatus || "pending",
                    "Checked In": reg.checkedIn ? "Yes" : "No",
                    "Registered At": formatDate(reg.createdAt),
                    "Member Count": members.length,
                    "Member Names": members.map(m => m.name).join(", "),
                    "Member IDs": members.map(m => m.userId).join(", "),
                    "Member Emails": members.map(m => m.email).join(", "),
                    "Member Phones": members.map(m => m.mobile_no).join(", ")
                };
            });

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(exportData);
            XLSX.utils.book_append_sheet(wb, ws, "Team Registrations");
            XLSX.writeFile(wb, `team-registrations-${new Date().toISOString().split('T')[0]}.xlsx`);

        } catch (error) {
            console.error("Error exporting:", error);
            alert("Failed to export data");
        } finally {
            setExporting(false);
        }
    };

    // View details
    const handleViewDetails = (reg) => {
        setSelectedRegistration(reg);
        setShowDetailsModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading team registrations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        Team Event Registrations
                    </h1>
                    <p className="text-gray-600">
                        View and manage all team registrations for UTKARSH'26
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        label="Total Teams"
                        value={registrations.length}
                        icon={Users}
                        color="purple"
                    />
                    <StatCard
                        label="Confirmed"
                        value={registrations.filter(r => r.status === "confirmed").length}
                        icon={CheckCircle}
                        color="green"
                    />
                    <StatCard
                        label="Pending"
                        value={registrations.filter(r => r.status === "pending").length}
                        icon={AlertCircle}
                        color="yellow"
                    />
                    <StatCard
                        label="Checked In"
                        value={registrations.filter(r => r.checkedIn).length}
                        icon={Calendar}
                        color="blue"
                    />
                </div>

                {/* Search and Export Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by team, leader, member, event..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleExport}
                            disabled={exporting}
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {exporting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Download className="w-5 h-5" />
                            )}
                            Export Excel
                        </button>
                    </div>

                    <p className="text-sm text-gray-500 mt-3">
                        Showing {filteredRegistrations.length} of {registrations.length} team registrations
                    </p>
                </div>

                {/* Registrations Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leader</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {filteredRegistrations.map((reg) => {
                                    const team = reg.teamId || {};
                                    const event = reg.eventId || {};
                                    const leader = team.teamLeader || {};
                                    const members = team.teamMembers || [];
                                    const statusBadge = getStatusBadge(reg.status);
                                    const paymentBadge = getPaymentBadge(reg.paymentStatus);
                                    const StatusIcon = statusBadge.Icon;
                                    const PaymentIcon = paymentBadge.Icon;

                                    return (
                                        <tr key={reg._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {team.teamName || "N/A"}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                        <User className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {leader.name || "N/A"}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {leader.userId || ""}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {event.title || "N/A"}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {event.eventType || ""}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900">
                                                        {members.length}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                                    <StatusIcon className="w-3 h-3 mr-1" />
                                                    {reg.status || "pending"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${paymentBadge.color}`}>
                                                    <PaymentIcon className="w-3 h-3 mr-1" />
                                                    {reg.paymentStatus || "pending"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatDate(reg.createdAt)}
                                            </td>

                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleViewDetails(reg)}
                                                    className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredRegistrations.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No registrations found</p>
                                <p className="text-gray-400 text-sm">Try adjusting your search</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Modal */}
                {showDetailsModal && selectedRegistration && (
                    <RegistrationDetailsModal
                        registration={selectedRegistration}
                        onClose={() => {
                            setShowDetailsModal(false);
                            setSelectedRegistration(null);
                        }}
                        formatDate={formatDate}
                    />
                )}
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ label, value, icon: Icon, color }) => {
    const colorClasses = {
        purple: "bg-purple-100 text-purple-600",
        green: "bg-green-100 text-green-600",
        yellow: "bg-yellow-100 text-yellow-600",
        blue: "bg-blue-100 text-blue-600",
        red: "bg-red-100 text-red-600"
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

// Registration Details Modal
const RegistrationDetailsModal = ({ registration, onClose, formatDate }) => {
    const team = registration.teamId || {};
    const event = registration.eventId || {};
    const leader = team.teamLeader || {};
    const members = team.teamMembers || [];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Team Registration Details</h2>
                            <p className="text-purple-100 text-sm mt-1">Complete registration information</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl">
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {/* Team Info */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-600" />
                            Team Information
                        </h3>
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Team Name</p>
                                    <p className="font-semibold text-gray-900">{team.teamName || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Registration ID</p>
                                    <p className="font-mono text-sm text-gray-900">{registration._id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Leader Info */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-green-600" />
                            Team Leader
                        </h3>
                        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <InfoItem label="Name" value={leader.name} />
                                <InfoItem label="User ID" value={leader.userId} />
                                <InfoItem label="Email" value={leader.email} />
                                <InfoItem label="Phone" value={leader.mobile_no} />
                                <InfoItem label="College" value={leader.college} />
                                <InfoItem label="Course" value={leader.course} />
                            </div>
                        </div>
                    </div>

                    {/* Team Members */}
                    {members.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                Team Members ({members.length})
                            </h3>
                            <div className="space-y-3">
                                {members.map((member, idx) => (
                                    <div key={idx} className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <InfoItem label="Name" value={member.name} />
                                            <InfoItem label="User ID" value={member.userId} />
                                            <InfoItem label="Email" value={member.email} />
                                            <InfoItem label="Phone" value={member.mobile_no} />
                                            <InfoItem label="College" value={member.college} />
                                            <InfoItem label="Course" value={member.course} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Event Info */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-orange-600" />
                            Event Information
                        </h3>
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                            <div className="grid grid-cols-2 gap-4">
                                <InfoItem label="Event" value={event.title} />
                                <InfoItem label="Event Type" value={event.eventType} />
                                <InfoItem label="Venue" value={event.venueName} />
                                <InfoItem label="Start Time" value={formatDate(event.startTime)} />
                                <InfoItem label="End Time" value={formatDate(event.endTime)} />
                                <InfoItem label="Registration Fee" value={`₹${event.fee || 0}`} />
                            </div>
                        </div>
                    </div>

                    {/* Registration Status */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                            Registration Status
                        </h3>
                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <InfoItem label="Status" value={
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                        registration.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {registration.status}
                                    </span>
                                } />
                                <InfoItem label="Payment" value={
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                        registration.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                        registration.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {registration.paymentStatus}
                                    </span>
                                } />
                                <InfoItem label="Checked In" value={registration.checkedIn ? "Yes" : "No"} />
                                <InfoItem label="Registered At" value={formatDate(registration.createdAt)} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6">
                    <button onClick={onClose} className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

// Info Item Component
const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value || "N/A"}</p>
    </div>
);

export default TeamRegistrations;