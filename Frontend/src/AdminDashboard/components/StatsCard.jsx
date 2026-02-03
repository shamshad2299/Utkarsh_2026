// components/StatsCard.jsx
export default function StatsCard({ title, value, change, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
          <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change} from last month
          </p>
        </div>
        <div className={`${color} p-3 rounded-full`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}