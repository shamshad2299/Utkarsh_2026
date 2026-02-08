import { useEffect, useState } from "react";
import { Trash2, ToggleLeft, ToggleRight, Search } from "lucide-react";
import { websiteTeamService } from "./websiteTeam.service";

const roleMap = {
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Fullstack",
  designer: "UI/UX",
};

const WebsiteTeamList = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadMembers = async () => {
    setLoading(true);
    const data = await websiteTeamService.getAll();
    setMembers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const toggleStatus = async (id) => {
    await websiteTeamService.toggle(id);
    loadMembers();
  };

  const deleteMember = async (id) => {
    if (!confirm("Delete this team member?")) return;
    await websiteTeamService.remove(id);
    loadMembers();
  };

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* ===== PAGE HEADER ===== */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Website Team</h1>
        <p className="text-gray-500">
          View and manage website team members
        </p>
      </div>

      {/* ===== SEARCH BAR ===== */}
      <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search team members by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      {/* ===== CONTENT ===== */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        {loading ? (
          <p className="text-gray-500">Loading team members...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">No team members found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((m) => (
              <div
                key={m._id}
                className="border rounded-xl p-4 flex gap-4 hover:shadow-md transition"
              >
                {/* Image */}
                <img
                  src={m.imageUrl}
                  alt={m.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />

                {/* Info */}
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-gray-900">{m.name}</h3>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {roleMap[m.role] || m.role}
                    </span>

                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      Rank {m.order}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    {m.college || "—"} {m.course && `• ${m.course}`}
                  </p>

                  <p
                    className={`text-xs font-medium ${
                      m.isActive ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {m.isActive ? "Active" : "Inactive"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col mt-6 justify-between">
                  <button
                    onClick={() => deleteMember(m._id)}
                    title="Delete member">
                    <Trash2 className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteTeamList;
