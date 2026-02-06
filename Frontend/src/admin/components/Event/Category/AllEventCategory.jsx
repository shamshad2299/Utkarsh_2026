import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import {
  Tag,
  Image as ImageIcon,
  FileText,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import {useNavigate} from "react-router-dom"

const AllEventCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rules: '',
    image: null,
  });
  
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/category/get');
     
      setCategories(response.data?.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };


  // Add category
  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    if (!formData.image) {
      setError('Category image is required');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('rules', formData.rules.trim());
      formDataToSend.append('image', formData.image);

       await api.post('/category/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Category added successfully!');
      fetchCategories();
      resetForm();
      setShowAddModal(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error adding category:', err);
      setError(err.response?.data?.message || 'Failed to add category');
    } finally {
      setUploading(false);
    }
  };

  // Update category
  const handleUpdateCategory = async () => {
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('rules', formData.rules.trim());
      
      // Only append image if it's a new file
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      await api.put(`/category/update/${selectedCategory._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Category updated successfully!');
      fetchCategories();
      resetForm();
      setShowEditModal(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err.response?.data?.message || 'Failed to update category');
    } finally {
      setUploading(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async () => {
    try {
      setUploading(true);
      await api.delete(`/category/delete/${selectedCategory._id}`);
      
      setSuccess('Category deleted successfully!');
      fetchCategories();
      setShowDeleteModal(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setUploading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      rules: '',
      image: null,
    });
    setImagePreview('');
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      rules: category.rules || '',
      image: null, // Don't pre-fill image
    });
    setImagePreview(category.image);
    setShowEditModal(true);
    setError('');
  };

  const openViewModal = (category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  // Fetch on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading && categories.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Tag className="mr-3 text-purple-600" />
              Event Categories
            </h1>
            <p className="text-gray-600 mt-2">Manage all event categories with complete CRUD operations</p>
          </div>
          <button
            onClick={()=>navigate("/admin/dashboard/event-category/add")}
            className="mt-4 md:mt-0 px-6 py-3 bg-linear-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            <Plus className="mr-2" />
            Add Category
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Categories</p>
                <p className="text-3xl font-bold text-purple-700 mt-2">{categories.length}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Tag className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">With Description</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {categories.filter(c => c.description).length}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">With Rules</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {categories.filter(c => c.rules).length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <AlertCircle className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-black border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchCategories}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center cursor-pointer"
            >
              <RefreshCw className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-3" />
              <div>
                <p className="text-red-800 font-medium">{error}</p>
                <button
                  onClick={() => setError('')}
                  className="text-sm text-red-600 hover:text-red-800 mt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-green-800 font-medium">{success}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-linear-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentCategories.length > 0 ? (
                currentCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 ">
                      <img
                        src={category?.image?.url}
                        alt={category.name}
                        className="h-14  hover:scale-110 w-14 rounded-lg object-cover border border-gray-200 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{category.name}</div>
                      <div className="text-xs text-purple-600 font-medium mt-1">
                        {category.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs line-clamp-2">
                        {category.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openViewModal(category)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors duration-200 cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(category)}
                          className="p-2 bg-red-50 cursor-pointer text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                          title="Delete Category"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Tag className="mx-auto h-12 w-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">No categories found</p>
                      <p className="text-sm mt-2">
                        {searchTerm ? `No results for "${searchTerm}"` : 'Add your first category to get started'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredCategories.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white rounded-2xl shadow-lg mt-6 border border-gray-100">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to{' '}
            <span className="font-semibold">
              {Math.min(indexOfLastItem, filteredCategories.length)}
            </span> of <span className="font-semibold">{filteredCategories.length}</span> categories
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${currentPage === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
              }`}
            >
              <ChevronsLeft size={18} />
            </button>
            
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${currentPage === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return pageNumber <= totalPages ? (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${currentPage === pageNumber
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ) : null;
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${currentPage === totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
              }`}
            >
              <ChevronRight size={18} />
            </button>
            
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${currentPage === totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
              }`}
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>
      )}
      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Category</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6 text-black">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Image
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <img src={selectedCategory.image?.url} alt="Current" className="h-20 w-20 object-cover rounded" />
                      <span className="text-sm text-gray-500">Current image</span>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500 mt-2">Upload new image (optional)</p>
                      {imagePreview && imagePreview !== selectedCategory.image && (
                        <img src={imagePreview} alt="New preview" className="mt-4 h-32 object-cover rounded" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rules
                  </label>
                  <textarea
                    name="rules"
                    value={formData.rules}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCategory}
                  disabled={uploading}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 flex items-center"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    'Update Category'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Category Modal */}
      {showViewModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Category Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <img src={selectedCategory.image?.url} alt={selectedCategory.name} className="h-24 w-24 object-cover rounded-xl" />
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{selectedCategory.name}</h4>
                    <p className="text-sm text-purple-600 font-medium mt-1">{selectedCategory.slug}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Created: {new Date(selectedCategory.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-lg font-semibold text-gray-800 mb-2">Description</h5>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {selectedCategory.description || 'No description provided'}
                  </p>
                </div>
                
                {selectedCategory.rules && (
                  <div>
                    <h5 className="text-lg font-semibold text-gray-800 mb-2">Rules</h5>
                    <p className="text-gray-600 bg-yellow-50 p-4 rounded-lg">
                      {selectedCategory.rules}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Category</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>"{selectedCategory.name}"</strong>? 
                This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCategory}
                  disabled={uploading}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Category'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for line clamp */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AllEventCategory;