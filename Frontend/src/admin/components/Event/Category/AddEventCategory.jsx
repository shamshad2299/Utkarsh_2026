import { useState } from "react";
import api from "../../../api/axios";
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Tag,
  PlusCircle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Info
} from "lucide-react";
import {useNavigate} from "react-router-dom"

const AddEventCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rules: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    if (!image) {
      setError("Category image is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("rules", formData.rules.trim());
      formDataToSend.append("image", image);
      formDataToSend.append("slug", generateSlug(formData.name.trim()));

      const response = await api.post("/category/add", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        rules: "",
      });
      setImage(null);
      setImagePreview("");
      
      // Show success message
      setSuccess("Category added successfully!");
      navigate("/admin/dashboard/events");
      
      // Clear success message after 1 seconds
      setTimeout(() => {
        setSuccess("");
      }, 1000);

    } catch (err) {
      console.error("Error adding category:", err);
      setError(err.response?.data?.message || "Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      name: "",
      description: "",
      rules: "",
    });
    setImage(null);
    setImagePreview("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Tag className="mr-3 text-purple-600" />
                Event Category Management
              </h1>
              <p className="text-gray-600 mt-2">
                Add new event categories with images, descriptions, and rules
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 inline-flex items-center">
                <Info className="h-4 w-4 mr-2" />
                All fields marked with * are required
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Categories Added</p>
                  <p className="text-3xl font-bold text-purple-700 mt-2">0</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Tag className="text-2xl text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Events</p>
                  <p className="text-3xl font-bold text-blue-700 mt-2">0</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="text-2xl text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Images Uploaded</p>
                  <p className="text-3xl font-bold text-green-700 mt-2">0</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <ImageIcon className="text-2xl text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-linear-to-r from-purple-50 to-white">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <PlusCircle className="mr-3 text-purple-600" />
                  Add New Category
                </h2>
                <p className="text-gray-600 mt-1">Fill in the details below to create a new event category</p>
              </div>

              {/* Messages */}
              <div className="px-6 pt-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-fadeIn">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-red-600 mr-3" />
                      <div>
                        <p className="text-red-800 font-medium">{error}</p>
                        <button
                          onClick={() => setError("")}
                          className="text-sm text-red-600 hover:text-red-800 mt-1"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-fadeIn">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <p className="text-green-800 font-medium">{success}</p>
                        <p className="text-sm text-green-600 mt-1">The category has been successfully added to the database.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Category Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-gray-500" />
                        Category Name *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Technical, Cultural, Sports"
                      className="w-full px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      This will be displayed as the main category title
                    </p>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <ImageIcon className="h-4 w-4 mr-2 text-gray-500" />
                        Category Image *
                      </span>
                    </label>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-purple-400 transition-colors duration-200 bg-gray-50">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <div className="relative mx-auto max-w-xs">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg shadow-md"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImage(null);
                                setImagePreview("");
                              }}
                              className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200 transition-colors"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600">{image.name}</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                            <Upload className="h-8 w-8 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-gray-700 font-medium">Upload Category Image</p>
                            <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</p>
                          </div>
                          <div>
                            <label className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 cursor-pointer">
                              <Upload className="h-4 w-4 mr-2" />
                              Choose File
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                required={!image}
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        Description
                      </span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe this category in detail..."
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Optional: Provide a detailed description of what this category includes
                    </p>
                  </div>

                  {/* Rules */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
                        Rules & Guidelines
                      </span>
                    </label>
                    <textarea
                      name="rules"
                      value={formData.rules}
                      onChange={handleInputChange}
                      placeholder="Enter rules and guidelines for this category..."
                      rows="4"
                      className="w-full px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Optional: Specify any rules or guidelines specific to this category
                    </p>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                      <button
                        type="button"
                        onClick={clearForm}
                        className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
                      >
                        Clear Form
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-8 py-3 bg-linear-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Adding Category...
                          </>
                        ) : (
                          <>
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Add Category
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Preview & Info Sidebar */}
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2 text-gray-600" />
                  Category Preview
                </h3>
                <p className="text-sm text-gray-600 mt-1">How your category will appear</p>
              </div>
              <div className="p-6">
                {formData.name || imagePreview ? (
                  <div className="space-y-4">
                    {imagePreview && (
                      <div className="overflow-hidden rounded-xl shadow-md">
                        <img
                          src={imagePreview}
                          alt="Category Preview"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    {formData.name && (
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{formData.name}</h4>
                        {formData.description && (
                          <p className="text-gray-600 mt-2 text-sm">{formData.description}</p>
                        )}
                        {formData.rules && (
                          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm font-medium text-amber-800 mb-1">Rules:</p>
                            <p className="text-xs text-amber-700">{formData.rules}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Fill in the form to see a preview</p>
                  </div>
                )}
              </div>
            </div>

            {/* Guidelines Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-white">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-600" />
                  Guidelines
                </h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-blue-600">1</span>
                    </div>
                    <span className="ml-3 text-sm text-gray-600">Category names should be unique and descriptive</span>
                  </li>
                  <li className="flex items-start">
                    <div className="shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-blue-600">2</span>
                    </div>
                    <span className="ml-3 text-sm text-gray-600">Use high-quality images (min. 800x600px)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-blue-600">3</span>
                    </div>
                    <span className="ml-3 text-sm text-gray-600">Keep descriptions concise but informative</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-blue-600">4</span>
                    </div>
                    <span className="ml-3 text-sm text-gray-600">Rules should be clear and easy to understand</span>
                  </li>
                  <li className="flex items-start">
                    <div className="shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-blue-600">5</span>
                    </div>
                    <span className="ml-3 text-sm text-gray-600">Slug will be auto-generated from the name</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-purple-100">Form Progress</span>
                  <span className="font-semibold">
                    {((formData.name ? 25 : 0) + (image ? 25 : 0) + (formData.description ? 25 : 0) + (formData.rules ? 25 : 0))}%
                  </span>
                </div>
                <div className="w-full bg-purple-300 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((formData.name ? 25 : 0) + (image ? 25 : 0) + (formData.description ? 25 : 0) + (formData.rules ? 25 : 0))}%` 
                    }}
                  ></div>
                </div>
                <div className="text-sm text-purple-200 mt-4">
                  <p>Complete all fields for best results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddEventCategory;