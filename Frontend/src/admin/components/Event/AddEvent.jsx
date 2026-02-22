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
  FileText,
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
  event_rule: "",
};

const INITIAL_TEAM_SIZE = { min: 1, max: 1 };
const TEAM_EVENT_DEFAULT_SIZE = { min: 2, max: 4 };

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
  const [errors, setErrors] = useState({});

  // Queries
  const { data: categoriesData = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/category/get");
      return response.data.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: subCategoriesData = [], isLoading: loadingSubCategories } = useQuery({
    queryKey: ["subCategories", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      const response = await api.get(`/subCategory/get-by-categ/${selectedCategory}`);
      return response.data.data || [];
    },
    enabled: !!selectedCategory,
    staleTime: 2 * 60 * 1000,
  });

  // Mutation
  const createEventMutation = useMutation({
    mutationFn: (formData) => {
      // Log the FormData being sent
      console.log("Sending FormData:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      return api.post("/events", formData);
    },
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

    setErrors((prev) => ({ ...prev, [name]: "" }));

    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      
      if (name === "eventType") {
        // Set appropriate team size based on event type
        if (value === "solo") {
          setTeamSize({ min: 1, max: 1 });
        } else if (value === "team") {
          setTeamSize(TEAM_EVENT_DEFAULT_SIZE);
        }
      }
      
      return newFormData;
    });
  }, []);

  const handleTeamSizeChange = useCallback((field, value) => {
    // Parse the value to integer, default to 1 if invalid
    const parsedValue = parseInt(value);
    const newValue = isNaN(parsedValue) ? 1 : Math.max(1, parsedValue);
    
    setTeamSize((prev) => {
      const newTeamSize = {
        ...prev,
        [field]: newValue
      };
      
      // Log the new team size
      console.log("Team size updated:", newTeamSize);
      
      return newTeamSize;
    });
    
    setErrors((prev) => ({ ...prev, teamSize: "" }));
  }, []);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    
    const MAX_IMAGES = 5;
    if (images.length + files.length > MAX_IMAGES) {
      setErrors((prev) => ({
        ...prev,
        images: `You can only upload up to ${MAX_IMAGES} images`,
      }));
      return;
    }

    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const MAX_SIZE = 10 * 1024 * 1024;

    const validFiles = files.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          images: "Only JPG, PNG, and WEBP files are allowed",
        }));
        return false;
      }
      if (file.size > MAX_SIZE) {
        setErrors((prev) => ({
          ...prev,
          images: "File size must be less than 10MB",
        }));
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newPreviews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setErrors((prev) => ({ ...prev, images: "" }));
    
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
    setErrors({});
    
    imagePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview.preview);
    });
    setImages([]);
    setImagePreviews([]);
  }, [imagePreviews]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.title?.trim()) newErrors.title = "Title is required";
    if (!selectedCategory) newErrors.category = "Category is required";
    if (!selectedSubCategory) newErrors.subCategory = "Sub-category is required";
    if (!formData.description?.trim()) newErrors.description = "Description is required";
    if (!formData.venueName?.trim()) newErrors.venueName = "Venue is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (!formData.registrationDeadline) newErrors.registrationDeadline = "Registration deadline is required";
    if (!formData.event_rule?.trim()) newErrors.event_rule = "Event rules are required";

    const capacity = parseInt(formData.capacity);
    if (!capacity || capacity < 1) {
      newErrors.capacity = "Valid capacity is required";
    }

    if (formData.startTime && formData.endTime) {
      if (new Date(formData.endTime) <= new Date(formData.startTime)) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    if (formData.registrationDeadline && formData.startTime) {
      if (new Date(formData.registrationDeadline) >= new Date(formData.startTime)) {
        newErrors.registrationDeadline = "Registration deadline must be before start time";
      }
    }

    // Validate team size based on event type
    if (formData.eventType === "solo") {
      if (teamSize.min !== 1 || teamSize.max !== 1) {
        newErrors.teamSize = "Solo events must have team size of 1";
      }
    } else if (formData.eventType === "team") {
      if (teamSize.min < 2) {
        newErrors.teamSize = "Team events must have minimum team size of at least 2";
      }
      if (teamSize.max < teamSize.min) {
        newErrors.teamSize = "Maximum team size cannot be less than minimum";
      }
      if (teamSize.min > teamSize.max) {
        newErrors.teamSize = "Minimum team size cannot be greater than maximum";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, selectedCategory, selectedSubCategory, teamSize]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector('[class*="border-red-300"]');
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Ensure values are strings and not arrays
    const categoryValue = String(selectedCategory).trim();
    const subCategoryValue = String(selectedSubCategory).trim();

    console.log("Final values being sent:", {
      category: categoryValue,
      subCategory: subCategoryValue,
      teamSize: teamSize
    });

    const data = new FormData();
    
    // Only append fields that are NOT category or subCategory
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'category' && key !== 'subCategory' && value !== undefined && value !== null && value !== "") {
        data.append(key, value.toString());
      }
    });
    
    // Append category and subCategory only once
    data.set("category", categoryValue);
    data.set("subCategory", subCategoryValue);
    
    // Properly stringify teamSize object
    data.set("teamSize", JSON.stringify(teamSize));
    
    // Append images (these can be multiple)
    images.forEach((image) => {
      data.append("images", image);
    });

    // Log final FormData to verify
    console.log("Final FormData being sent:");
    for (let pair of data.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    createEventMutation.mutate(data);
  }, [formData, selectedCategory, selectedSubCategory, teamSize, images, validateForm, createEventMutation]);

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
                error={errors.title}
              />

              {/* Category Select */}
              <SelectField
                label="Category *"
                name="category"
                value={selectedCategory}
                onChange={(value) => {
                  console.log("Category selected:", value);
                  setSelectedCategory(value);
                }}
                options={categoriesData}
                optionLabel="name"
                optionValue="_id"
                placeholder="Select Category"
                loading={loadingCategories}
                error={errors.category}
              />

              {/* Sub-category Select */}
              <SelectField
                label="Sub-category *"
                name="subCategory"
                value={selectedSubCategory}
                onChange={(value) => {
                  console.log("SubCategory selected:", value);
                  setSelectedSubCategory(value);
                }}
                options={subCategoriesData}
                optionLabel="title"
                optionValue="_id"
                placeholder="Select Sub-category"
                loading={loadingSubCategories}
                disabled={!selectedCategory}
                error={errors.subCategory}
              />

              {/* Event Type Select */}
              <SelectField
                label="Event Type *"
                name="eventType"
                value={formData.eventType}
                onChange={(value) => {
                  const syntheticEvent = {
                    target: {
                      name: "eventType",
                      value: value
                    }
                  };
                  handleInputChange(syntheticEvent);
                }}
                options={[
                  { value: "solo", label: "Solo" },
                  { value: "team", label: "Team" },
                ]}
                optionLabel="label"
                optionValue="value"
              />

              {/* Team Size Section - Only for team events */}
              {isTeamEvent && (
                <>
                  <InputField
                    label="Min Team Size"
                    type="number"
                    min="2"
                    value={teamSize.min}
                    onChange={(e) => handleTeamSizeChange("min", e.target.value)}
                    error={errors.teamSizeMin}
                    helperText="Minimum 2 members for team events"
                  />
                  <InputField
                    label="Max Team Size"
                    type="number"
                    min={teamSize.min}
                    value={teamSize.max}
                    onChange={(e) => handleTeamSizeChange("max", e.target.value)}
                    error={errors.teamSizeMax}
                    helperText="Maximum members allowed"
                  />
                </>
              )}

              {/* Team size info for solo events */}
              {formData.eventType === "solo" && (
                <div className="col-span-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <Users className="w-4 h-4 inline mr-2" />
                  Solo event - Team size fixed at 1
                </div>
              )}

              {/* Team size error display */}
              {errors.teamSize && (
                <div className="col-span-2">
                  <ErrorMessage message={errors.teamSize} />
                </div>
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
                error={errors.description}
              />
            </div>
          </Card>

          {/* Event Rules Card */}
          <Card icon={FileText} bgColor="bg-orange-600" title="Event Rules">
            <div className="space-y-4">
              <TextAreaField
                label="Event Rules & Guidelines *"
                name="event_rule"
                value={formData.event_rule}
                onChange={handleInputChange}
                placeholder="Enter event rules, guidelines, prerequisites, etc..."
                rows={6}
                error={errors.event_rule}
              />
              <p className="text-sm text-gray-500 mt-2">
                Include important rules, eligibility criteria, what to bring, dress code, etc.
              </p>
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
                error={errors.startTime}
              />
              <DateTimeField
                label="End Time *"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                icon={Clock}
                error={errors.endTime}
              />
              <DateTimeField
                label="Registration Deadline *"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleInputChange}
                icon={Calendar}
                error={errors.registrationDeadline}
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
                error={errors.venueName}
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
                error={errors.capacity}
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
              error={errors.images}
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
  error,
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
        className={`w-full ${Icon ? 'pl-12' : 'px-4'} pr-4 py-3 border rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
          error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 bg-gray-50"
        } ${className}`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          {suffix}
        </span>
      )}
    </div>
    {error && <ErrorMessage message={error} />}
    {helperText && <p className="text-sm text-gray-500 mt-1">{helperText}</p>}
  </div>
);

const TextAreaField = ({ label, error, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      {...props}
      className={`w-full px-4 py-3 border rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition ${
        error
          ? "border-red-300 bg-red-50"
          : "border-gray-300 bg-gray-50"
      }`}
    />
    {error && <ErrorMessage message={error} />}
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
  error,
  name,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <select
        name={name}
        value={value || ""}
        onChange={(e) => {
          const selectedValue = e.target.value;
          console.log(`Select onChange for ${name}:`, selectedValue);
          if (onChange) {
            onChange(selectedValue);
          }
        }}
        className={`w-full px-4 py-3 border rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none transition ${
          error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 bg-gray-50"
        } ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disabled || loading}
      >
        <option value="">{placeholder || "Select"}</option>
        {options.map((option) => (
          <option key={option[optionValue]} value={option[optionValue]}>
            {option[optionLabel]}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        {loading ? (
          <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
        ) : (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
    </div>
    {error && <ErrorMessage message={error} />}
  </div>
);

const DateTimeField = ({ label, icon: Icon, error, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
      <input
        {...props}
        type="datetime-local"
        className={`w-full pl-12 pr-4 py-3 border rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
          error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 bg-gray-50"
        }`}
      />
    </div>
    {error && <ErrorMessage message={error} />}
  </div>
);

const ErrorMessage = ({ message }) => (
  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
    <span>⚠️</span>
    <span>{message}</span>
  </p>
);

const ImageUpload = ({ imagePreviews, onUpload, onRemove, error }) => (
  <div className="space-y-4">
    <div className={`border-2 border-dashed rounded-2xl p-8 text-center hover:border-purple-500 transition-colors ${
      error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
    }`}>
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
    {error && <ErrorMessage message={error} />}

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
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
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