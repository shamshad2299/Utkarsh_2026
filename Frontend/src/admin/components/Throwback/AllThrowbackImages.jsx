import { useEffect, useState, useContext } from "react";
import { Edit, Trash2, Save, X } from "lucide-react";
import axios from "axios";
import api from "../../api/axios";


const AllThrowBackImages = () => {
  const [throwbacks, setThrowbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", rank: "" });

  // 🔄 Fetch Throwbacks
  const fetchThrowbacks = async () => {
    try {
      const res = await api.get("/throwbacks");
      console.log(res);
      setThrowbacks(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThrowbacks();
  }, []);

  // 🗑 Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await api.delete(`/throwbacks/${id}`);
      setThrowbacks((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen  p-8">
      <h2 className="text-3xl font-bold text-black mb-8 text-center">
        Manage Throwbacks
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {throwbacks.map((item) => (
          <div
            key={item._id}
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-52 object-cover"
            />

            <div className="p-4 space-y-3 text-black">
              {editingId === item._id ? (
                <>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                    className="w-full p-2 rounded bg-white/20 focus:outline-none"
                  />

                  <input
                    type="number"
                    value={editData.rank}
                    onChange={(e) =>
                      setEditData({ ...editData, rank: e.target.value })
                    }
                    className="w-full p-2 rounded bg-white/20 focus:outline-none"
                  />

                  <div className="flex justify-between mt-3">
                    <button
                      onClick={() => handleSave(item._id)}
                      className="flex items-center gap-1 bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      <Save size={16} /> Save
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1 bg-gray-500 px-3 py-1 rounded hover:bg-gray-600 transition"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">Title : {item.title}</h3>
                  <p className="text-sm text-gray-700">
                    Rank: {item.rank}
                  </p>

                  <div className="flex justify-between mt-4">
        

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllThrowBackImages;
