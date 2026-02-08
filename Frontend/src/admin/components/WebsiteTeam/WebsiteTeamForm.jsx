import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { websiteTeamService } from "./websiteTeam.service";
import { User } from "lucide-react";

const fieldClass =
  "w-full rounded-lg border border-gray-300 " +
  "bg-blue-50 text-gray-900 px-4 py-2 text-sm " +
  "focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-purple-500";

const WebsiteTeamForm = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role: "backend",
    order: 1,
    college: "",
    course: "",
    linkedin: "",
    portfolio: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Profile image is required");

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("image", image);

    setLoading(true);
    await websiteTeamService.add(fd);
    setLoading(false);

    navigate("/admin/dashboard/website-team");
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* ===== PAGE HEADER ===== */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Add Website Team Member
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Fill in the details below to add a new website team member
        </p>
      </div>

      {/* ===== CARD ===== */}
      <form
        onSubmit={submit}
        className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 space-y-6"
      >
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-100 text-purple-700">
            <User size={20} />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold">
            Basic Information
          </h2>
        </div>

        {/* ===== FORM GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className={fieldClass}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={fieldClass}
            >
              <option value="frontend">Frontend Developer</option>
              <option value="backend">Backend Developer</option>
              <option value="fullstack">Fullstack Developer</option>
              <option value="designer">UI/UX Designer</option>
            </select>
          </div>

          {/* Rank */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rank (Position) *
            </label>
            <input
              type="number"
              name="order"
              min={1}
              max={7}
              value={form.order}
              onChange={handleChange}
              className={fieldClass}
            />
            <p className="text-xs text-gray-500 mt-1">
              Determines the fixed position on website (1–7)
            </p>
          </div>

          {/* College */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College
            </label>
            <input
              name="college"
              value={form.college}
              onChange={handleChange}
              placeholder="Enter college name"
              className={fieldClass}
            />
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <input
              name="course"
              value={form.course}
              onChange={handleChange}
              placeholder="Enter course"
              className={fieldClass}
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn Profile
            </label>
            <input
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
              className={fieldClass}
            />
          </div>

          {/* Portfolio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio / GitHub
            </label>
            <input
              name="portfolio"
              value={form.portfolio}
              onChange={handleChange}
              placeholder="https://github.com/..."
              className={fieldClass}
            />
          </div>
        </div>

        {/* ===== IMAGE UPLOAD ===== */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image *
          </label>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label
              htmlFor="profileImage"
              className="w-32 h-32 rounded-xl border-2 border-dashed
                         flex items-center justify-center cursor-pointer
                         hover:border-purple-500 transition overflow-hidden
                         bg-blue-50"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm text-center">
                  Click to upload
                </span>
              )}
            </label>

            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
          </div>
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-purple-600 text-white
                       hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Member"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-lg border border-gray-300
                       text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default WebsiteTeamForm;
