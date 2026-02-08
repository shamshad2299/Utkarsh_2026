import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminAccessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "http://localhost:7000/api/admin/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("adminAccessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

/* ================= SUBCATEGORY SERVICE ================= */

export const subcategoryService = {
  getAllSubcategories: async (params = {}) => {
    const response = await api.get("/subCategory/subcategories", { params });
    return response.data;
  },

  getSubcategoryById: async (id) => {
    const response = await api.get(`/subCategory/subcategories/${id}`);
    return response.data;
  },

  addSubcategory: async (subcategoryData) => {
    const response = await api.post(
      "/subCategory/add",
      subcategoryData
    );
    return response.data;
  },

  updateSubcategory: async (id, subcategoryData) => {
    const response = await api.patch(
      `/subCategory/subcategories/${id}`,
      subcategoryData
    );
    return response.data;
  },

  deleteSubcategory: async (id) => {
    const response = await api.delete(`/subCategory/subcategories/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get("/category/get");
    return response.data;
  },
};

/* ================= SPONSORSHIP SERVICE (ADMIN) ================= */

export const sponsorshipService = {
  getAll: async (params = {}) => {
    const response = await api.get("/sponsorships", { params });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/sponsorships/${id}/status`, { status });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/sponsorships/${id}`);
    return response.data;
  },
};

/* ================= FOOD STALL SERVICE (ADMIN) ================= */

export const foodStallService = {
  getAll: async (params = {}) => {
    const response = await api.get("/food-stalls", { params });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/food-stalls/${id}/status`, { status });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/food-stalls/${id}`);
    return response.data;
  },
};
