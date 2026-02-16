import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Save,
  Upload,
  X,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Clock,
  Tag,
  Loader2,
  ArrowLeft,
  Image as ImageIcon,
  AlertCircle,
  FileText,
} from "lucide-react";
import api from "../../api/axios.js";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from 'sweetalert2';

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

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_IMAGES = 5;

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [teamSize, setTeamSize] = useState(INITIAL_TEAM_SIZE);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Track form changes
  const formChanged = useRef(false);

  // Queries
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await api.get("/category/get");
        return response.data.data || [];
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const { 
    data: subCategories = [], 
    isLoading: subCategoriesLoading,
    refetch: refetchSubCategories
  } = useQuery({
    queryKey: ["subCategories", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      try {
        const response = await api.get(`/subCategory/get-by-categ/${selectedCategory}`);
        return response.data.data || [];
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        return [];
      }
    },
    enabled: false,
  });

  // Force refetch when selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      refetchSubCategories();
    } else {
      setSelectedSubCategory("");
    }
  }, [selectedCategory, refetchSubCategories]);

  // ✅ FIXED: Proper date formatting function
  const formatDateForInput = useCallback((dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      // Get local date time string in YYYY-MM-DDTHH:mm format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  }, []);

  // ✅ FIXED: Convert input datetime to ISO string for API
  const formatDateForAPI = useCallback((inputDateTime) => {
    if (!inputDateTime) return null;
    
    try {
      // Create date object from input (local time)
      const date = new Date(inputDateTime);
      if (isNaN(date.getTime())) return null;
      
      // Return ISO string for API
      return date.toISOString();
    } catch (error) {
      console.error("Date conversion error:", error);
      return null;
    }
  }, []);

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
      } catch (error) {
        console.error("Error fetching event:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load event details',
          timer: 2000,
          showConfirmButton: false
        });
        return null;
      }
    },
    enabled: !!id,
  });

  // ✅ FIXED: Update form when event data is loaded
  useEffect(() => {
    if (event) {
      console.log("Event data received:", event);
      
      // Format dates properly
      const formattedStartTime = formatDateForInput(event.startTime);
      const formattedEndTime = formatDateForInput(event.endTime);
      const formattedDeadline = formatDateForInput(event.registrationDeadline);
      
      console.log("Formatted dates:", {
        start: formattedStartTime,
        end: formattedEndTime,
        deadline: formattedDeadline
      });

      setFormData({
        title: event.title || "",
        description: event.description || "",
        venueName: event.venueName || "",
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        registrationDeadline: formattedDeadline,
        capacity: event.capacity || "",
        fee: event.fee || 0,
        eventType: event.eventType || "solo",
        event_rule: event.event_rule || "",
      });

      setSelectedCategory(event.category?._id || "");
      setSelectedSubCategory(event.subCategory?._id || "");
      setExistingImages(event.images || []);
      setTeamSize({
        min: event.teamSize?.min || 1,
        max: event.teamSize?.max || 1,
      });

      setIsInitialLoad(false);
      formChanged.current = false;
      setUnsavedChanges(false);
    }
  }, [event, formatDateForInput]);

  // Track unsaved changes
  useEffect(() => {
    if (!isInitialLoad && event) {
      const hasChanges = 
        formData.title !== event.title ||
        formData.description !== event.description ||
        formData.venueName !== event.venueName ||
        formData.startTime !== formatDateForInput(event.startTime) ||
        formData.endTime !== formatDateForInput(event.endTime) ||
        formData.registrationDeadline !== formatDateForInput(event.registrationDeadline) ||
        formData.capacity !== event.capacity ||
        formData.fee !== event.fee ||
        formData.eventType !== event.eventType ||
        formData.event_rule !== event.event_rule ||
        selectedCategory !== event.category?._id ||
        selectedSubCategory !== event.subCategory?._id ||
        teamSize.min !== event.teamSize?.min ||
        teamSize.max !== event.teamSize?.max ||
        existingImages.length !== event.images?.length ||
        newImages.length > 0;

      setUnsavedChanges(hasChanges);
      formChanged.current = hasChanges;
    }
  }, [formData, selectedCategory, selectedSubCategory, teamSize, existingImages, newImages, event, isInitialLoad, formatDateForInput]);

  // Mutation
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      // Log the FormData contents for debugging
      console.log("Submitting FormData:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      return await api.put(`/events/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Event updated successfully!',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        navigate("/admin/dashboard/events-list");
      });
    },
    onError: (error) => {
      console.error("Update error:", error.response?.data);
      const message = error.response?.data?.message || "Failed to update event";
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        timer: 2000,
        showConfirmButton: false
      });
    },
  });

  // Cleanup image previews
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.preview);
      });
    };
  }, [imagePreviews]);

  // Handlers
  const handleInputChange = useCallback((e) => {
    if (!e || !e.target) return;
    
    const { name, value, type } = e.target;

    setErrors((prev) => ({ ...prev, [name]: "" }));

    // Handle number inputs
    if (type === 'number') {
      const numValue = value === '' ? '' : Number(value);
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Update team size based on event type
    if (name === "eventType") {
      if (value === "duo") {
        setTeamSize({ min: 2, max: 2 });
      } else if (value === "solo") {
        setTeamSize(INITIAL_TEAM_SIZE);
      }
    }
  }, []);

  const handleTeamSizeChange = useCallback((field, value) => {
    const numValue = Math.max(1, parseInt(value) || 1);
    setTeamSize((prev) => ({ ...prev, [field]: numValue }));
    setErrors((prev) => ({ ...prev, teamSize: "" }));
  }, []);

  const handleImageUpload = useCallback((e) => {
    if (!e || !e.target) return;
    
    const files = Array.from(e.target.files || []);
    
    if (existingImages.length + newImages.length + files.length > MAX_IMAGES) {
      setErrors((prev) => ({
        ...prev,
        images: `You can only have up to ${MAX_IMAGES} images total`,
      }));
      return;
    }

    const validFiles = files.filter((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          images: "Only JPG, PNG, and WEBP files are allowed",
        }));
        return false;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setErrors((prev) => ({
          ...prev,
          images: "File size must be less than 10MB",
        }));
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    const previews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...previews]);
    setErrors((prev) => ({ ...prev, images: "" }));
    
    e.target.value = '';
  }, [existingImages.length, newImages.length]);

  const removeNewImage = useCallback((index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const removeExistingImage = useCallback((index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetForm = useCallback(() => {
    if (!event) return;

    Swal.fire({
      title: 'Reset Changes?',
      text: 'Are you sure you want to reset all changes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Reset',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Reset to original event data
        setFormData({
          title: event.title || "",
          description: event.description || "",
          venueName: event.venueName || "",
          startTime: formatDateForInput(event.startTime),
          endTime: formatDateForInput(event.endTime),
          registrationDeadline: formatDateForInput(event.registrationDeadline),
          capacity: event.capacity || "",
          fee: event.fee || 0,
          eventType: event.eventType || "solo",
          event_rule: event.event_rule || "",
        });

        setSelectedCategory(event.category?._id || "");
        setSelectedSubCategory(event.subCategory?._id || "");
        setExistingImages(event.images || []);
        setTeamSize({
          min: event.teamSize?.min || 1,
          max: event.teamSize?.max || 1,
        });

        // Clean up new image previews
        imagePreviews.forEach((preview) => {
          URL.revokeObjectURL(preview.preview);
        });
        setNewImages([]);
        setImagePreviews([]);
        setErrors({});
        
        Swal.fire({
          icon: 'success',
          title: 'Reset!',
          text: 'Form has been reset',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }, [event, imagePreviews, formatDateForInput]);

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

    // ✅ FIXED: Date validation with proper comparison
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      
      if (end <= start) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    if (formData.registrationDeadline && formData.startTime) {
      const deadline = new Date(formData.registrationDeadline);
      const start = new Date(formData.startTime);
      
      if (deadline >= start) {
        newErrors.registrationDeadline = "Registration deadline must be before start time";
      }
    }

    if (formData.eventType === "team") {
      if (teamSize.min > teamSize.max) {
        newErrors.teamSize = "Minimum team size cannot be greater than maximum";
      }
      if (teamSize.min < 1) {
        newErrors.teamSize = "Team size must be at least 1";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, selectedCategory, selectedSubCategory, teamSize]);

  // ✅ FIXED: Handle submit with proper date formatting
  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector('[class*="border-red-300"]');
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fix the errors before submitting',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    const data = new FormData();

    // Add form data with properly formatted dates
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // ✅ FIXED: Convert datetime-local to ISO string for API
        if (key === 'startTime' || key === 'endTime' || key === 'registrationDeadline') {
          const isoDate = formatDateForAPI(value);
          if (isoDate) {
            data.append(key, isoDate);
            console.log(`Appending ${key}:`, isoDate);
          }
        } else {
          data.append(key, value.toString());
        }
      }
    });

    data.append("category", selectedCategory);
    data.append("subCategory", selectedSubCategory);
    data.append("teamSize", JSON.stringify(teamSize));
    
    // Send remaining existing image IDs
    const existingImageIds = existingImages.map(img => img._id || img).filter(Boolean);
    data.append("existingImageIds", JSON.stringify(existingImageIds));

    // Append new image files
    newImages.forEach((image) => {
      data.append("images", image);
    });

    // Log final data for debugging
    console.log("Submitting event update with data:");
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    updateEventMutation.mutate({ id, formData: data });
  }, [formData, selectedCategory, selectedSubCategory, teamSize, existingImages, newImages, id, validateForm, formatDateForAPI]);

  // Handle navigation with unsaved changes
  const handleBack = useCallback(() => {
    if (unsavedChanges) {
      Swal.fire({
        title: 'Unsaved Changes',
        text: 'You have unsaved changes. Are you sure you want to leave?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, Leave',
        cancelButtonText: 'Stay'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(-1);
        }
      });
    } else {
      navigate(-1);
    }
  }, [unsavedChanges, navigate]);

  // Memoized values
  const isTeamEvent = useMemo(() => formData.eventType === "team", [formData.eventType]);
  const isLoading = useMemo(() => eventLoading || categoriesLoading || isInitialLoad, [eventLoading, categoriesLoading, isInitialLoad]);
  const isSubmitting = useMemo(() => updateEventMutation.isPending, [updateEventMutation.isPending]);
  const totalImages = useMemo(() => existingImages.length + newImages.length, [existingImages, newImages]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">The event you're trying to edit doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Header 
          title={formData.title} 
          eventId={id} 
          onBack={handleBack}
          unsavedChanges={unsavedChanges}
        />

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

              <SelectField
                label="Category *"
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categories}
                optionLabel="name"
                optionValue="_id"
                placeholder="Select Category"
                error={errors.category}
                loading={categoriesLoading}
              />

              <SelectField
                label="Sub-category *"
                value={selectedSubCategory}
                onChange={setSelectedSubCategory}
                options={subCategories}
                optionLabel="title"
                optionValue="_id"
                placeholder="Select Sub-category"
                error={errors.subCategory}
                disabled={!selectedCategory}
                loading={subCategoriesLoading && selectedCategory}
              />

              <SelectField
                label="Event Type *"
                name="eventType"
                value={formData.eventType}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, eventType: value }));
                  if (value === "duo") {
                    setTeamSize({ min: 2, max: 2 });
                  } else if (value === "solo") {
                    setTeamSize(INITIAL_TEAM_SIZE);
                  }
                }}
                options={[
                  { value: "solo", label: "Solo" },
                  { value: "duo", label: "Duo" },
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
                  {errors.teamSize && (
                    <div className="col-span-2">
                      <ErrorMessage message={errors.teamSize} />
                    </div>
                  )}
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

          {/* Date & Time Card - FIXED */}
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
            <ImageSection
              existingImages={existingImages}
              newImages={newImages}
              imagePreviews={imagePreviews}
              totalImages={totalImages}
              maxImages={MAX_IMAGES}
              onRemoveExisting={removeExistingImage}
              onRemoveNew={removeNewImage}
              onUpload={handleImageUpload}
              error={errors.images}
            />
          </Card>

          {/* Action Buttons */}
          <ActionButtons
            onCancel={handleBack}
            onReset={resetForm}
            isSubmitting={isSubmitting}
            unsavedChanges={unsavedChanges}
          />
        </form>
      </div>
    </div>
  );
};

// Sub-components
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Loading event details...</p>
    </div>
  </div>
);

const Header = ({ title, eventId, onBack, unsavedChanges }) => (
  <div className="mb-8">
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
      type="button"
    >
      <ArrowLeft className="w-5 h-5" />
      Back to Events
    </button>

    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Edit Event
        </h1>
        <p className="text-gray-600">
          Update the details for "{title || 'Event'}"
          {unsavedChanges && <span className="ml-2 text-yellow-600">(Unsaved changes)</span>}
        </p>
      </div>

      <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg self-start">
        <p className="text-sm font-medium">
          Event ID: {eventId?.slice(-8).toUpperCase()}
        </p>
      </div>
    </div>
  </div>
);

// ... (rest of your sub-components remain the same)

// DateTimeField component with proper type
const DateTimeField = ({ label, icon: Icon, error, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
      <input
        {...props}
        type="datetime-local"
        className={`w-full pl-12 pr-4 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
          error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 bg-gray-50"
        }`}
      />
    </div>
    {error && <ErrorMessage message={error} />}
  </div>
);

// ... (keep all other sub-components exactly as they were)

const Card = ({ icon: Icon, bgColor, title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow">
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
  error,
  helperText,
  suffix,
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
        className={`w-full ${Icon ? 'pl-12' : 'px-4'} pr-4 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
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
      className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition ${
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
  error,
  disabled,
  loading,
  name,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none transition ${
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
          <div className="w-4 h-4" />
        )}
      </div>
    </div>
    {error && <ErrorMessage message={error} />}
  </div>
);

const ErrorMessage = ({ message }) => (
  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
    <AlertCircle className="w-4 h-4 flex-shrink-0" />
    <span>{message}</span>
  </p>
);

const ImageSection = ({
  existingImages,
  newImages,
  imagePreviews,
  totalImages,
  maxImages,
  onRemoveExisting,
  onRemoveNew,
  onUpload,
  error,
}) => (
  <div className="space-y-6">
    {/* Info Banner */}
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-yellow-800">Image Management</p>
          <p className="text-sm text-yellow-700 mt-1">
            You can have up to {maxImages} images total. 
            {totalImages > 0 && ` Currently: ${totalImages}/${maxImages} images.`}
            Removing existing images and uploading new ones will update the gallery.
          </p>
        </div>
      </div>
    </div>

    {/* Existing Images */}
    {existingImages.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Current Images ({existingImages.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {existingImages.map((image, index) => (
            <ImageCard
              key={index}
              src={image.url}
              alt={`Existing ${index + 1}`}
              onRemove={() => onRemoveExisting(index)}
              overlayText="Will be removed"
              overlayColor="from-red-600/80"
            />
          ))}
        </div>
      </div>
    )}

    {/* New Images Upload */}
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Upload New Images
        {newImages.length > 0 && ` (${newImages.length} selected)`}
      </h3>

      <UploadArea onUpload={onUpload} totalImages={totalImages} maxImages={maxImages} />

      {/* New Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-800 mb-4">
            New Images ({imagePreviews.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imagePreviews.map((preview, index) => (
              <ImageCard
                key={index}
                src={preview.preview}
                alt={`Preview ${index + 1}`}
                onRemove={() => onRemoveNew(index)}
                overlayText="New image"
                overlayColor="from-green-600/80"
                isNew
              />
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}
    </div>
  </div>
);

const UploadArea = ({ onUpload, totalImages, maxImages }) => {
  const isFull = totalImages >= maxImages;

  return (
    <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${
      isFull
        ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
        : 'border-gray-300 hover:border-purple-500 bg-gray-50'
    }`}>
      <Upload className={`w-12 h-12 mx-auto mb-4 ${
        isFull ? 'text-gray-400' : 'text-gray-400'
      }`} />
      <p className={`mb-2 ${isFull ? 'text-gray-500' : 'text-gray-600'}`}>
        {isFull 
          ? `Maximum ${maxImages} images reached` 
          : 'Drop images here or click to upload'
        }
      </p>
      <p className="text-sm text-gray-500 mb-4">
        PNG, JPG, WEBP up to 10MB
      </p>
      {!isFull && (
        <>
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
        </>
      )}
    </div>
  );
};

const ImageCard = ({ src, alt, onRemove, overlayText, overlayColor = "from-black/60", isNew = false }) => (
  <div className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition">
    <img
      src={src}
      alt={alt}
      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
      loading="lazy"
    />
    <div className={`absolute inset-0 bg-gradient-to-t ${overlayColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
      <div className="absolute bottom-2 left-2 text-white text-xs font-medium">
        {overlayText}
      </div>
    </div>
    <button
      type="button"
      onClick={onRemove}
      className={`absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ${
        isNew 
          ? 'bg-green-500 hover:bg-green-600' 
          : 'bg-red-500 hover:bg-red-600'
      } text-white shadow-lg hover:scale-110`}
      title="Remove Image"
    >
      <X className="w-4 h-4" />
    </button>
    {isNew && (
      <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
        New
      </span>
    )}
  </div>
);

const ActionButtons = ({ onCancel, onReset, isSubmitting, unsavedChanges }) => (
  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
    <button
      type="button"
      onClick={onCancel}
      disabled={isSubmitting}
      className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ArrowLeft className="w-5 h-5" />
      Cancel
    </button>

    <button
      type="button"
      onClick={onReset}
      disabled={isSubmitting}
      className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition border border-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Reset Changes
    </button>

    <button
      type="submit"
      disabled={isSubmitting}
      className="flex-1 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Updating Event...
        </>
      ) : (
        <>
          <Save className="w-5 h-5" />
          Update Event {unsavedChanges && '(Unsaved)'}
        </>
      )}
    </button>
  </div>
);

export default EditEvent;