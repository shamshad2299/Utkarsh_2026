import { useState, useContext } from "react";
import { UploadCloud, ImagePlus } from "lucide-react";
import axios from "axios";
import api from "../../api/axios";

const Upload = () => {

  const [title, setTitle] = useState("");
  const [rank, setRank] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !rank) {
      alert("Image and Rank required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", title);
      formData.append("rank", rank);

      await api.post("/throwbacks", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Throwback Uploaded Successfully");

      setTitle("");
      setRank("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-black">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">

        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
          <UploadCloud /> Upload Throwback
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <input
            type="text"
            placeholder="Throwback Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/20 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Rank */}
          <input
            type="number"
            placeholder="Rank (Unique Number)"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/20 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Image Upload */}
          <label className="block w-full border-2 border-dashed border-purple-400 rounded-xl p-6 text-center cursor-pointer hover:bg-white/10 transition">
            <ImagePlus className="mx-auto mb-2 text-purple-400" size={32} />
            <span className="text-black">
              {image ? image.name : "Click to select image"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>

          {/* Preview */}
          {preview && (
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-60 object-cover"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition text-white font-semibold shadow-lg disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Throwback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
