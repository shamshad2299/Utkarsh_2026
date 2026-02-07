import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7000/api";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) reject(error);
    else {
      config.headers.Authorization = `Bearer ${token}`;
      resolve(api(config));
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// attach admin access token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminAccessToken");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// response interceptor
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // ⛔ never retry refresh endpoint itself
    if (originalRequest.url?.endsWith("/admin/auth/refresh-token")) {
      return Promise.reject(error);
    }

    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        const { data } = await api.post(
          "/admin/auth/refresh-token",
          {}
        );

        localStorage.setItem(
          "adminAccessToken",
          data.accessToken
        );

        processQueue(null, data.accessToken);
        return api(originalRequest);

      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        window.location.href = "/admin/login";
        return Promise.reject(err);

      } finally {
        isRefreshing = false;
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
      "/subCategory/subcategories",
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
