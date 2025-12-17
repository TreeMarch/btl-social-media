import axios from 'axios';

import { useAuthStore } from '@/store/useAuthStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Call the refresh endpoint (assuming POST /auth/refresh based on typical patterns)
        // Adjust endpoint if user specified differently.
        // Note: Using a separate axios instance or avoiding interceptor loops for this call is good practice,
        // but here the interceptor checks _retry so it should be safe if this call fails with non-401 or handled differently.
        // Actually, let's use the basic axios to avoid our own interceptor attaching the old token if we don't want to.
        // But we usually send refresh token in body.

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {
            refreshToken,
          }
        );

        // Assuming response matches the provided structure: { data: { tokens: { accessToken, refreshToken } } }
        // We need to use the new tokens.
        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data.tokens || response.data.data;

        useAuthStore.getState().setTokens(accessToken, newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
