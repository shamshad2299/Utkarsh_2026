// components/QuickActions.jsx
import { Plus, Upload, Download, Filter, RefreshCw } from "lucide-react";

export default function QuickActions() {
  const actions = [
    { icon: <Plus size={18} />, label: "Add New User", color: "bg-blue-500 hover:bg-blue-600" },
    { icon: <Upload size={18} />, label: "Import Data", color: "bg-green-500 hover:bg-green-600" },
    { icon: <Download size={18} />, label: "Export Report", color: "bg-purple-500 hover:bg-purple-600" },
    { icon: <Filter size={18} />, label: "Advanced Filter", color: "bg-orange-500 hover:bg-orange-600" },
    { icon: <RefreshCw size={18} />, label: "Refresh Data", color: "bg-gray-500 hover:bg-gray-600" },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h3>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 ${action.color} text-white px-4 py-3 rounded-lg transition-colors`}
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">System Status</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Server Load</span>
            <span className="text-sm font-medium text-green-600">45%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Database</span>
            <span className="text-sm font-medium text-green-600">Healthy</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Uptime</span>
            <span className="text-sm font-medium text-blue-600">99.9%</span>
          </div>
        </div>
      </div>
    </div>
  );
}