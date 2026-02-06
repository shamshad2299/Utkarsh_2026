import React, { useState, useEffect } from 'react';
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
  Loader2
} from 'lucide-react';
import api from "../../api/axios.js"

const AddEvent = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [teamSize, setTeamSize] = useState({ min: 1, max: 1 });
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

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
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await api.get('/category/get');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      setLoadingSubCategories(true);
      const response = await api.get(`/subCategory/get-by-categ/${categoryId}`);
      setSubCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    } finally {
      setLoadingSubCategories(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
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
    
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].preview);
      return newPreviews;
    });
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.title.trim()) errors.push('Title is required');
    if (!selectedCategory) errors.push('Category is required');
    if (!selectedSubCategory) errors.push('Sub-category is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (!formData.venueName.trim()) errors.push('Venue is required');
    if (!formData.startTime) errors.push('Start time is required');
    if (!formData.endTime) errors.push('End time is required');
    if (!formData.registrationDeadline) errors.push('Registration deadline is required');
    if (!formData.capacity || formData.capacity < 1) errors.push('Valid capacity is required');
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      errors.push('End time must be after start time');
    }
    if (teamSize.min > teamSize.max) {
      errors.push('Minimum team size cannot be greater than maximum');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }
    
    try {
      setLoading(true);
      
      const data = new FormData();
      
      data.append('title', formData.title);
      data.append('category', selectedCategory);
      data.append('subCategory', selectedSubCategory);
      data.append('description', formData.description);
      data.append('venueName', formData.venueName);
      data.append('startTime', formData.startTime);
      data.append('endTime', formData.endTime);
      data.append('registrationDeadline', formData.registrationDeadline);
      data.append('capacity', formData.capacity);
      data.append('fee', formData.fee);
      data.append('eventType', formData.eventType);
      data.append('teamSize', JSON.stringify(teamSize));
      
      images.forEach((image, index) => {
        data.append('images', image);
      });
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await api.post('/events', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        alert('Event created successfully!');
        resetForm();
      }
      
    } catch (error) {
      console.error('Error creating event:', error);
      alert(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
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
    setSelectedCategory('');
    setSelectedSubCategory('');
    setImages([]);
    setImagePreviews([]);
    setTeamSize({ min: 1, max: 1 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Create New Event
          </h1>
          <p className="text-gray-600">
            Fill in the details below to add a new event to UTKARSH'26
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
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
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter event title"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                    required
                    disabled={loadingCategories}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {loadingCategories ? (
                      <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Sub-category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Sub-category *
                </label>
                <div className="relative">
                  <select
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                    disabled={!selectedCategory || loadingSubCategories}
                    required
                  >
                    <option value="">Select Sub-category</option>
                    {subCategories.map((subCat) => (
                      <option key={subCat._id} value={subCat._id}>
                        {subCat?.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {loadingSubCategories ? (
                      <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                  </div>
                </div>
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
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
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
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Enter event description..."
                required
              />
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
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
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
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
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
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
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
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter venue name"
                    required
                  />
                </div>
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
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Maximum participants"
                    required
                  />
                </div>
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
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
            
            <div className="space-y-4">
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

              {/* Image Previews */}
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
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition border border-gray-300"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
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

export default AddEvent;