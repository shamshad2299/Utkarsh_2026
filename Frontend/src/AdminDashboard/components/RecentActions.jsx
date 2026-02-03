// components/RecentActions.jsx
import { Plus, Pencil, Trash2, UserPlus, Calendar } from "lucide-react";

export default function RecentActions() {
  const actions = [
    { type: "add", text: "New user registered", user: "John Doe", time: "2 min ago", icon: <UserPlus size={16} /> },
    { type: "edit", text: "Event updated", user: "Sarah Smith", time: "15 min ago", icon: <Calendar size={16} /> },
    { type: "delete", text: "Team registration deleted", user: "Admin", time: "1 hour ago", icon: <Trash2 size={16} /> },
    { type: "edit", text: "Accommodation updated", user: "Mike Johnson", time: "2 hours ago", icon: <Pencil size={16} /> },
    { type: "add", text: "New event created", user: "Admin", time: "3 hours ago", icon: <Plus size={16} /> },
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case "add": return "text-green-600 bg-green-50";
      case "edit": return "text-blue-600 bg-blue-50";
      case "delete": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
      </div>
      
      <div className="space-y-4">
        {actions.map((action, index) => (
          <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
            <div className={`p-2 rounded-lg ${getTypeColor(action.type)}`}>
              {action.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{action.text}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">by {action.user}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-sm text-gray-500">{action.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}