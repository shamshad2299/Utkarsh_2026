import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7000/api",
  withCredentials: true,
});

// Attach access token
api.interceptors.request.use((config) => {
  
  const token = localStorage.getItem("adminAccessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "http://localhost:7000/api/admin/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        localStorage.setItem(
          "adminAccessToken",
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {
        // Refresh failed → force logout
        localStorage.clear();
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;


export const subcategoryService = {
  // Get all subcategories with filtering
  getAllSubcategories: async (params = {}) => {
    const response = await api.get('/subCategory/subcategories', { params });
    return response.data;
  },

  // Get single subcategory by ID
  getSubcategoryById: async (id) => {
    const response = await api.get(`/subCategory/subcategories/${id}`);
    return response.data;
  },

  // Add new subcategory
  addSubcategory: async (subcategoryData) => {
    const response = await api.post('/subCategory/subcategories', subcategoryData);
    return response.data;
  },

  // Update subcategory
  updateSubcategory: async (id, subcategoryData) => {
    const response = await api.patch(`/subCategory/subcategories/${id}`, subcategoryData);
    return response.data;
  },

  // Delete subcategory (soft delete)
  deleteSubcategory: async (id) => {
    const response = await api.delete(`/subCategory/subcategories/${id}`);
    return response.data;
  },

  // Get categories for dropdown
  getCategories: async () => {
    const response = await api.get('/category/get');
    return response.data;
  }
};
