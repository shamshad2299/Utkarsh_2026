import { useEffect, useState } from "react";
import { X, Save, AlertCircle } from "lucide-react";

const EditSubcategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  subcategory,
  categories,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  // 🔥 IMPORTANT FIX
  useEffect(() => {
    if (subcategory) {
      setFormData({
        title: subcategory.title || "",
        category: subcategory.category?._id || subcategory.category || "",
        description: subcategory.description || "",
        isActive:
          subcategory.isActive !== undefined ? subcategory.isActive : true,
      });
    }
  }, [subcategory]);

  // ❌ DO NOT CHECK subcategory here
  if (!isOpen) return null;

  const validateForm = () => {
    const err = {};
    if (!formData.title.trim()) err.title = "Title is required";
    if (!formData.category) err.category = "Category is required";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validateForm();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    onSubmit(subcategory._id, formData);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Edit Subcategory</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {!subcategory ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-black">
            {/* Title */}
            <div>
              <label className="text-sm font-medium">Title *</label>
              <input
                className="w-full border px-4 py-2 rounded-xl"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              {errors.title && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.title}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium">Category *</label>
              <select
                className="w-full border px-4 py-2 rounded-xl"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title || c.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.category}
                </p>
              )}
            </div>

            {/* Description */}
            <textarea
              className="w-full border px-4 py-2 rounded-xl"
              rows="3"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            {/* Active */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              Active
            </label>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="border px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-xl flex items-center gap-2"
              >
                <Save size={16} /> Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditSubcategoryModal;
