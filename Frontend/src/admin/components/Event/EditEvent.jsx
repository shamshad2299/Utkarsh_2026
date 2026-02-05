import React, { useState, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';
import api from "../../api/axios.js";
import { useParams, useNavigate } from 'react-router-dom';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [teamSize, setTeamSize] = useState({ min: 1, max: 1 });
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venueName: '',
    startTime: '',
    endTime: '',
    registrationDeadline: '',
    capacity: '',
    fee: 0,
    eventType: 'solo',
  });

  useEffect(() => {
    if (id) {
      fetchEventDetails();
      fetchCategories();
    }
  }, [id]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/events/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const event = response.data.data;
      
      // Populate form data
      setFormData({
        title: event.title || '',
        description: event.description || '',
        venueName: event.venueName || '',
        startTime: event.startTime ? new Date(event.startTime).toISOString().slice(0, 16) : '',
        endTime: event.endTime ? new Date(event.endTime).toISOString().slice(0, 16) : '',
        registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().slice(0, 16) : '',
        capacity: event.capacity || '',
        fee: event.fee || 0,
        eventType: event.eventType || 'solo',
      });

      // Set category and subcategory
      setSelectedCategory(event.category?._id || '');
      setSelectedSubCategory(event.subCategory?._id || '');

      // Set existing images
      setExistingImages(event.images || []);

      // Set team size
      if (event.teamSize) {
        setTeamSize({
          min: event.teamSize.min || 1,
          max: event.teamSize.max || 1
        });
      }

    } catch (error) {
      console.error('Error fetching event details:', error);
      alert('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/category/get');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await api.get(`/subCategory/get-by-categ/${categoryId}`);
      setSubCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: '' }));
    
    if (name === 'eventType') {
      let newTeamSize = { min: 1, max: 1 };
      if (value === 'duo') {
        newTeamSize = { min: 2, max: 2 };
      }
      setTeamSize(newTeamSize);
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTeamSizeChange = (field, value) => {
    const val = parseInt(value) || 1;
    setTeamSize(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      if (!isValidType) {
        setErrors(prev => ({ 
          ...prev, 
          images: 'Only JPG, PNG, and WEBP files are allowed' 
        }));
      }
      
      if (!isValidSize) {
        setErrors(prev => ({ 
          ...prev, 
          images: 'File size must be less than 10MB' 
        }));
      }
      
      return isValidType && isValidSize;
    });
    
    const previews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setNewImages(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].preview);
      return newPreviews;
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!selectedCategory) newErrors.category = 'Category is required';
    if (!selectedSubCategory) newErrors.subCategory = 'Sub-category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.venueName.trim()) newErrors.venueName = 'Venue is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.registrationDeadline) newErrors.registrationDeadline = 'Registration deadline is required';
    if (!formData.capacity || formData.capacity < 1) newErrors.capacity = 'Valid capacity is required';
    
    if (formData.startTime && formData.endTime) {
      if (new Date(formData.endTime) <= new Date(formData.startTime)) {
        newErrors.endTime = 'End time must be after start time';
      }
    }
    
    if (teamSize.min > teamSize.max) {
      newErrors.teamSize = 'Minimum team size cannot be greater than maximum';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      const data = new FormData();
      
      // Add form fields
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('venueName', formData.venueName);
      data.append('startTime', formData.startTime);
      data.append('endTime', formData.endTime);
      data.append('registrationDeadline', formData.registrationDeadline);
      data.append('capacity', formData.capacity);
      data.append('fee', formData.fee);
      data.append('eventType', formData.eventType);
      data.append('teamSize', JSON.stringify(teamSize));
      
      // Add new images
      newImages.forEach((image, index) => {
        data.append('images', image);
      });
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await api.put(`/events/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        alert('Event updated successfully!');
        navigate('admin/dashboard/events-list'); // Navigate back to events list
      }
      
    } catch (error) {
      console.error('Error updating event:', error);
      alert(error.response?.data?.message || 'Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    fetchEventDetails(); // Reset to original values
    setNewImages([]);
    setImagePreviews([]);
    setErrors({});
  };

  const formatDateTimeForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Events
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Edit Event
              </h1>
              <p className="text-gray-600">
                Update the details for "{formData.title}"
              </p>
            </div>
            
            <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">
              <p className="text-sm font-medium">Event ID: {id?.slice(-8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg text-black">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Sub-category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Sub-category *
                </label>
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.subCategory ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                  disabled={!selectedCategory}
                >
                  <option value="">Select Sub-category</option>
                  {subCategories.map((subCat) => (
                    <option key={subCat._id} value={subCat._id}>
                      {subCat?.title}
                    </option>
                  ))}
                </select>
                {errors.subCategory && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.subCategory}
                  </p>
                )}
              </div>

              {/* Event Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Event Type *
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="solo">Solo</option>
                  <option value="duo">Duo</option>
                  <option value="team">Team</option>
                </select>
              </div>

              {/* Team Size (only for team events) */}
              {formData.eventType === 'team' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Min Team Size
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={teamSize.min}
                      onChange={(e) => handleTeamSizeChange('min', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Max Team Size
                    </label>
                    <input
                      type="number"
                      min={teamSize.min}
                      value={teamSize.max}
                      onChange={(e) => handleTeamSizeChange('max', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  {errors.teamSize && (
                    <div className="col-span-2">
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.teamSize}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            <div className="mt-6 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
                placeholder="Enter event description..."
              />
              {errors.description && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>
          </div>


          {/* Date & Time Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Date & Time</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Start Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Start Time *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.startTime ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                    }`}
                  />
                </div>
                {errors.startTime && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.startTime}
                  </p>
                )}
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  End Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.endTime ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                    }`}
                  />
                </div>
                {errors.endTime && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.endTime}
                  </p>
                )}
              </div>

              {/* Registration Deadline */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Registration Deadline *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="datetime-local"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.registrationDeadline ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                    }`}
                  />
                </div>
                {errors.registrationDeadline && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.registrationDeadline}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Venue & Capacity Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-600 rounded-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Venue & Capacity</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Venue */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Venue Name *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="venueName"
                    value={formData.venueName}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 text-black border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.venueName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                    }`}
                    placeholder="Enter venue name"
                  />
                </div>
                {errors.venueName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.venueName}
                  </p>
                )}
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Capacity *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    name="capacity"
                    min="1"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 text-black border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.capacity ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                    }`}
                    placeholder="Maximum participants"
                  />
                </div>
                {errors.capacity && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.capacity}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Fee Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-600 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Registration Fee</h2>
            </div>
            
            <div className="max-w-xs">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Registration Fee (₹)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    name="fee"
                    min="0"
                    step="0.01"
                    value={formData.fee}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 text-black bg-gray-50 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Set to 0 for free events
                </p>
              </div>
            </div>
          </div>

          {/* Images Upload Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-600 rounded-lg">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Event Images</h2>
            </div>
            
            <div className="space-y-6">
              {/* Warning about image replacement */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Important Note</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Uploading new images will replace all existing event images. Please upload all images you want to keep.
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
                      <div
                        key={index}
                        className="relative group rounded-xl overflow-hidden border border-gray-200"
                      >
                        <img
                          src={image.url}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-2 left-2 text-white text-xs">
                            Will be removed
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove Image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Images */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Upload New Images
                </h3>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-500 transition-colors bg-gray-50">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drop images here or click to upload
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition"
                  >
                    Select Images
                  </label>
                </div>

                {/* New Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      New Images ({imagePreviews.length})
                    </h4>
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
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-2 left-2 text-white text-xs">
                              New image
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove Image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Upload Error */}
                {errors.images && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.images}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Cancel
            </button>
            
            <button
              type="button"
              onClick={resetForm}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition border border-gray-300 font-medium"
            >
              Reset Changes
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating Event...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;