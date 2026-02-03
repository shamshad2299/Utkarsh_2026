import axios from "axios";

const API_URL = "http://localhost:7000/api";

const PUBLIC_URLS = [
  "/v1/auth/login",
  "/v1/auth/forgot-password",
  "/v1/auth/reset-password",
  "/v1/auth/refresh-token",
];

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      config.headers.Authorization = `Bearer ${token}`;
      resolve(api(config));
    }
  });
  failedQueue = [];
};

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// handle 401 + refresh token
api.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    const isPublic = PUBLIC_URLS.some(url =>
      originalRequest.url.includes(url)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isPublic
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${API_URL}/v1/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        localStorage.setItem("accessToken", data.accessToken);

        processQueue(null, data.accessToken);
        return api(originalRequest);

      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
