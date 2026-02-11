import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Upload,
  X,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Clock,
  Tag,
  Loader2,
} from "lucide-react";
import api from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

// Constants
const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  venueName: "",
  startTime: "",
  endTime: "",
  registrationDeadline: "",
  capacity: "",
  fee: 0,
  eventType: "solo",
};

const INITIAL_TEAM_SIZE = { min: 1, max: 1 };

const AddEvent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [teamSize, setTeamSize] = useState(INITIAL_TEAM_SIZE);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Queries
  const { data: categoriesData = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/category/get");
      return response.data.data || [];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const { data: subCategoriesData = [], isLoading: loadingSubCategories } = useQuery({
    queryKey: ["subCategories", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      const response = await api.get(`/subCategory/get-by-categ/${selectedCategory}`);
      return response.data.data || [];
    },
    enabled: !!selectedCategory,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });

  // Mutation
  const createEventMutation = useMutation({
    mutationFn: (formData) => api.post("/events", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      resetForm();
      navigate("/admin/dashboard/events-list");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to create event";
      alert(message);
      console.error("Event creation error:", error);
    },
  });

  // Cleanup image previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.preview);
      });
    };
  }, []);

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubCategory("");
  }, [selectedCategory]);

  // Handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      
      // Update team size based on event type
      if (name === "eventType") {
        setTeamSize(value === "solo" ? INITIAL_TEAM_SIZE : { min: 2, max: 2 });
      }
      
      return newFormData;
    });
  }, []);

  const handleTeamSizeChange = useCallback((field, value) => {
    setTeamSize((prev) => ({
      ...prev,
      [field]: Math.max(1, parseInt(value) || 1),
    }));
  }, []);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    
    // Limit number of images (optional)
    const MAX_IMAGES = 5;
    if (images.length + files.length > MAX_IMAGES) {
      alert(`You can only upload up to ${MAX_IMAGES} images`);
      return;
    }

    // Create previews
    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    
    // Reset input
    e.target.value = '';
  }, [images.length]);

  const removeImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setSelectedCategory("");
    setSelectedSubCategory("");
    setTeamSize(INITIAL_TEAM_SIZE);
    
    // Clean up image previews
    imagePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview.preview);
    });
    setImages([]);
    setImagePreviews([]);
  }, [imagePreviews]);

  const validateForm = useCallback(() => {
    const errors = [];

    if (!formData.title?.trim()) errors.push("Title is required");
    if (!selectedCategory) errors.push("Category is required");
    if (!selectedSubCategory) errors.push("Sub-category is required");
    if (!formData.description?.trim()) errors.push("Description is required");
    if (!formData.venueName?.trim()) errors.push("Venue is required");
    if (!formData.startTime) errors.push("Start time is required");
    if (!formData.endTime) errors.push("End time is required");
    if (!formData.registrationDeadline) errors.push("Registration deadline is required");
    
    const capacity = parseInt(formData.capacity);
    if (!capacity || capacity < 1) errors.push("Valid capacity is required");
    
    if (formData.startTime && formData.endTime) {
      if (new Date(formData.endTime) <= new Date(formData.startTime)) {
        errors.push("End time must be after start time");
      }
    }
    
    if (formData.registrationDeadline && formData.startTime) {
      if (new Date(formData.registrationDeadline) >= new Date(formData.startTime)) {
        errors.push("Registration deadline must be before start time");
      }
    }
    
    if (teamSize.min > teamSize.max) {
      errors.push("Minimum team size cannot be greater than maximum");
    }

    return errors;
  }, [formData, selectedCategory, selectedSubCategory, teamSize]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    const data = new FormData();
    
    // Append form data
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        data.append(key, value.toString());
      }
    });
    
    data.append("category", selectedCategory);
    data.append("subCategory", selectedSubCategory);
    data.append("teamSize", JSON.stringify(teamSize));
    
    // Append images
    images.forEach((image) => {
      data.append("images", image);
    });

    createEventMutation.mutate(data);
  }, [formData, selectedCategory, selectedSubCategory, teamSize, images, validateForm]);

  // Memoized values
  const isTeamEvent = useMemo(() => formData.eventType === "team", [formData.eventType]);
  const isSubmitting = useMemo(() => createEventMutation.isPending, [createEventMutation.isPending]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Create New Event
          </h1>
          <p className="text-gray-600">
            Fill in the details below to add a new event to UTKARSH'26
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Basic Information Card */}
          <Card icon={Tag} bgColor="bg-purple-600" title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Event Title *"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                required
              />

              <SelectField
                label="Category *"
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categoriesData}
                optionLabel="name"
                optionValue="_id"
                placeholder="Select Category"
                loading={loadingCategories}
                required
              />

              <SelectField
                label="Sub-category *"
                value={selectedSubCategory}
                onChange={setSelectedSubCategory}
                options={subCategoriesData}
                optionLabel="title"
                optionValue="_id"
                placeholder="Select Sub-category"
                loading={loadingSubCategories}
                disabled={!selectedCategory}
                required
              />

              <SelectField
                label="Event Type *"
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                options={[
                  { value: "solo", label: "Solo" },
                  { value: "team", label: "Team" },
                ]}
                optionLabel="label"
                optionValue="value"
              />

              {isTeamEvent && (
                <>
                  <InputField
                    label="Min Team Size"
                    type="number"
                    min="1"
                    value={teamSize.min}
                    onChange={(e) => handleTeamSizeChange("min", e.target.value)}
                  />
                  <InputField
                    label="Max Team Size"
                    type="number"
                    min={teamSize.min}
                    value={teamSize.max}
                    onChange={(e) => handleTeamSizeChange("max", e.target.value)}
                  />
                </>
              )}
            </div>

            <div className="mt-6">
              <TextAreaField
                label="Description *"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter event description..."
                rows={4}
                required
              />
            </div>
          </Card>

          {/* Date & Time Card */}
          <Card icon={Calendar} bgColor="bg-blue-600" title="Date & Time">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DateTimeField
                label="Start Time *"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                icon={Calendar}
                required
              />
              <DateTimeField
                label="End Time *"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                icon={Clock}
                required
              />
              <DateTimeField
                label="Registration Deadline *"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleInputChange}
                icon={Calendar}
                required
              />
            </div>
          </Card>

          {/* Venue & Capacity Card */}
          <Card icon={MapPin} bgColor="bg-green-600" title="Venue & Capacity">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Venue Name *"
                name="venueName"
                value={formData.venueName}
                onChange={handleInputChange}
                placeholder="Enter venue name"
                icon={MapPin}
                required
              />
              <InputField
                label="Capacity *"
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={handleInputChange}
                placeholder="Maximum participants"
                icon={Users}
                required
              />
            </div>
          </Card>

          {/* Fee Card */}
          <Card icon={DollarSign} bgColor="bg-yellow-600" title="Registration Fee">
            <div className="max-w-xs">
              <InputField
                label="Registration Fee (₹)"
                name="fee"
                type="number"
                min="0"
                step="0.01"
                value={formData.fee}
                onChange={handleInputChange}
                placeholder="0.00"
                icon={DollarSign}
                suffix="₹"
                helperText="Set to 0 for free events"
              />
            </div>
          </Card>

          {/* Images Upload Card */}
          <Card icon={Upload} bgColor="bg-pink-600" title="Event Images">
            <ImageUpload
              images={images}
              imagePreviews={imagePreviews}
              onUpload={handleImageUpload}
              onRemove={removeImage}
            />
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Event...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Components
const Card = ({ icon: Icon, bgColor, title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
    <div className="flex items-center gap-3 mb-6">
      <div className={`p-2 ${bgColor} rounded-lg`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

const InputField = ({ 
  label, 
  icon: Icon, 
  suffix, 
  helperText, 
  className = "",
  ...props 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
      )}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-12' : 'px-4'} pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          {suffix}
        </span>
      )}
    </div>
    {helperText && <p className="text-sm text-gray-500 mt-1">{helperText}</p>}
  </div>
);

const TextAreaField = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      {...props}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
    />
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
  optionLabel,
  optionValue,
  placeholder,
  loading,
  disabled,
  required,
  name,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled || loading}
        required={required}
      >
        <option value="">{placeholder || "Select"}</option>
        {options.map((option) => (
          <option key={option[optionValue]} value={option[optionValue]}>
            {option[optionLabel]}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        {loading && <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />}
      </div>
    </div>
  </div>
);

const DateTimeField = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
      <input
        {...props}
        type="datetime-local"
        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  </div>
);

const ImageUpload = ({ imagePreviews, onUpload, onRemove }) => (
  <div className="space-y-4">
    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-500 transition-colors bg-gray-50">
      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 mb-2">Drop images here or click to upload</p>
      <p className="text-sm text-gray-500 mb-4">PNG, JPG, WEBP up to 10MB</p>
      <input
        type="file"
        id="image-upload"
        multiple
        accept="image/*"
        onChange={onUpload}
        className="hidden"
      />
      <label
        htmlFor="image-upload"
        className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition"
      >
        Select Images
      </label>
    </div>

    {imagePreviews.length > 0 && (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Selected Images ({imagePreviews.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagePreviews.map((preview, index) => (
            <div
              key={index}
              className="relative group rounded-xl overflow-hidden border border-gray-200"
            >
              <img
                src={preview.preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-40 object-cover"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default AddEvent;