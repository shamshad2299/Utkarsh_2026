// components/DataTable.jsx
import { 
  Eye, Edit, Trash2, Plus, CheckCircle, 
  XCircle, User, RefreshCw, Filter,
  Download, Search, ChevronDown,
  Calendar, Clock, Loader2
} from "lucide-react";
import { useState, useEffect } from "react";

export default function DataTable({ 
  type = "users", 
  users = [], 
  loading = false,
  pagination = {},
  onPageChange,
  onRefresh,
  onAddNew,
  onEdit,
  onDelete,
  onView,
  onBulkAction
}) {
  // State management
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [localUsers, setLocalUsers] = useState(users);
  const [dateFilter, setDateFilter] = useState("all");

  // When users prop changes, update local state
  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  // Filter और search लागू करें (client-side for search only)
  const filteredUsers = localUsers.filter(user => {
    // Search filter (client-side)
    const matchesSearch = searchTerm === "" || 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile_no?.includes(searchTerm) ||
      user.college?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter (client-side)
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && !user.isBlocked && !user.isDeleted) ||
      (filterStatus === "blocked" && user.isBlocked) ||
      (filterStatus === "deleted" && user.isDeleted);

    // Role filter (client-side)
    const matchesRole = filterRole === "all" || 
      user.role === filterRole;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Columns configuration
  const columns = [
    { key: "userId", label: "User ID", sortable: true, width: "w-48" },
    { key: "name", label: "Name", sortable: true, width: "w-64" },
    { key: "email", label: "Email", sortable: true, width: "w-72" },
    { key: "mobile_no", label: "Mobile", sortable: false, width: "w-40" },
    { key: "college", label: "College", sortable: true, width: "w-64" },
    { key: "city", label: "City", sortable: true, width: "w-40" },
    { key: "registeredAt", label: "Registered At", sortable: true, width: "w-48" },
    { key: "status", label: "Status", sortable: false, width: "w-32" },
    { key: "actions", label: "Actions", sortable: false, width: "w-40" }
  ];

  const getStatusBadge = (user) => {
    if (user.isDeleted) {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
          <XCircle size={12} /> Deleted
        </span>
      );
    }
    if (user.isBlocked) {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <XCircle size={12} /> Blocked
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 flex items-center gap-1">
        <CheckCircle size={12} /> Active
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return { date: "N/A", time: "" };
    const date = new Date(dateString);
    
    const formattedDate = date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    const formattedTime = date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    return { date: formattedDate, time: formattedTime };
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${diffInHours >= 2 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} day${diffInDays >= 2 ? 's' : ''} ago`;
    } else {
      return "";
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredUsers.map(user => user._id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    if (selectedRows.length === 0) {
      alert("Please select at least one user");
      return;
    }
    
    if (onBulkAction) {
      onBulkAction(action, selectedRows);
    } else {
      // Default behavior
      switch(action) {
        case 'block':
          if (confirm(`Block ${selectedRows.length} selected user(s)?`)) {
            console.log('Blocking users:', selectedRows);
          }
          break;
        case 'delete':
          if (confirm(`Delete ${selectedRows.length} selected user(s)?`)) {
            console.log('Deleting users:', selectedRows);
          }
          break;
        case 'export':
          exportToCSV(selectedRows);
          break;
      }
    }
    
    setSelectedRows([]);
  };

  const exportToCSV = (selectedIds) => {
    const selectedUsers = localUsers.filter(user => selectedIds.includes(user._id));
    const csvContent = [
      ['User ID', 'Name', 'Email', 'Mobile', 'College', 'City', 'Registered At', 'Status', 'Role'],
      ...selectedUsers.map(user => {
        const formatted = formatDate(user.createdAt);
        return [
          user.userId,
          user.name,
          user.email,
          user.mobile_no,
          user.college,
          user.city,
          `${formatted.date} ${formatted.time}`,
          user.isBlocked ? 'Blocked' : user.isDeleted ? 'Deleted' : 'Active',
          user.role
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleAction = (user, action) => {
    switch(action) {
      case 'view':
        if (onView) {
          onView(user);
        } else {
          console.log('View user:', user);
        }
        break;
      case 'edit':
        if (onEdit) {
          onEdit(user);
        } else {
          console.log('Edit user:', user);
        }
        break;
      case 'block':
        if (confirm(`Are you sure you want to ${user.isBlocked ? 'unblock' : 'block'} ${user.name}?`)) {
          if (onBulkAction) {
            onBulkAction(user.isBlocked ? 'unblock' : 'block', [user._id]);
          } else {
            console.log('Toggle block for user:', user._id);
          }
        }
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
          if (onDelete) {
            onDelete(user._id);
          } else {
            console.log('Delete user:', user._id);
          }
        }
        break;
    }
  };

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew();
    } else {
      console.log('Add new user clicked');
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      setSearchTerm("");
      setFilterStatus("all");
      setFilterRole("all");
      setDateFilter("all");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-800 capitalize">{type}</h3>
              {pagination.total !== undefined && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {pagination.total} total
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1">
              Manage all {type} in the system
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {selectedRows.length > 0 && (
              <>
                <button 
                  onClick={() => handleBulkAction('block')}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center gap-2 text-sm transition"
                >
                  <XCircle size={16} />
                  {selectedRows.length === 1 ? 'Block User' : `Block (${selectedRows.length})`}
                </button>
                <button 
                  onClick={() => handleBulkAction('delete')}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 text-sm transition"
                >
                  <Trash2 size={16} />
                  {selectedRows.length === 1 ? 'Delete User' : `Delete (${selectedRows.length})`}
                </button>
                <button 
                  onClick={() => handleBulkAction('export')}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 text-sm transition"
                >
                  <Download size={16} />
                  Export CSV
                </button>
              </>
            )}
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 text-sm transition"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button 
              onClick={handleAddNew}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition"
            >
              <Plus size={18} />
              Add New
            </button>
          </div>
        </div>
      </div>

      {/* Client-side Filters */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-3 pr-8 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="deleted">Deleted</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-3 pr-8 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="volunteer">Volunteer</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>

          {/* Clear Filters */}
          {(searchTerm || filterStatus !== 'all' || filterRole !== 'all') && (
            <button 
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setFilterRole("all");
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 w-12">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === filteredUsers.length && filteredUsers.length > 0}
                  className="rounded border-gray-300"
                />
              </th>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={`px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase ${col.width}`}
                >
                  <div className="flex items-center">
                    {col.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y">
            {filteredUsers.map((user) => {
              const formattedDate = formatDate(user.createdAt);
              const timeAgo = getTimeAgo(user.createdAt);
              
              return (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(user._id)}
                      onChange={() => handleSelectRow(user._id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  
                  {/* User ID */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{user.userId}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.gender} • {user.course}
                      </p>
                    </div>
                  </td>
                  
                  {/* Email */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800 break-all">{user.email}</p>
                  </td>
                  
                  {/* Mobile */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">+91 {user.mobile_no}</p>
                  </td>
                  
                  {/* College */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{user.college}</p>
                  </td>
                  
                  {/* City */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800 capitalize">{user.city}</p>
                  </td>
                  
                  {/* Registered At */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 text-sm text-gray-800">
                        <Calendar size={12} className="text-gray-400" />
                        <span>{formattedDate.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock size={10} className="text-gray-400" />
                        <span>{formattedDate.time}</span>
                      </div>
                      {timeAgo && (
                        <span className="text-xs text-blue-600 mt-1 font-medium">
                          {timeAgo}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4">{getStatusBadge(user)}</td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleAction(user, 'view')}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600 transition"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleAction(user, 'edit')}
                        className="p-1.5 hover:bg-gray-100 rounded text-blue-600 hover:text-blue-800 transition"
                        title="Edit User"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleAction(user, 'block')}
                        className={`p-1.5 hover:bg-gray-100 rounded transition ${user.isBlocked ? 'text-green-600 hover:text-green-800' : 'text-yellow-600 hover:text-yellow-800'}`}
                        title={user.isBlocked ? "Unblock User" : "Block User"}
                      >
                        <XCircle size={16} />
                      </button>
                      <button 
                        onClick={() => handleAction(user, 'delete')}
                        className="p-1.5 hover:bg-gray-100 rounded text-red-600 hover:text-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete User"
                        disabled={user.isDeleted}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <User size={24} className="text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">No {type} found</h4>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== 'all' || filterRole !== 'all' 
              ? "Try adjusting your search or filters" 
              : `No ${type} in the system yet. Add your first ${type.slice(0, -1)}!`}
          </p>
          <button 
            onClick={handleAddNew}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          >
            Add New {type.slice(0, -1)}
          </button>
        </div>
      )}
    </div>
  );
}