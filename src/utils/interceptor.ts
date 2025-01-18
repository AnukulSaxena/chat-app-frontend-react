import axios from "axios";
import { Store } from "@reduxjs/toolkit"; // Type for Redux store
import { RootState } from "../store/store"; // Adjust path based on your project structure
import { RefreshTOkenSchema } from "@/schemas";

let storeInstance: Store<RootState>; // Properly typed placeholder for the Redux store

export const setStore = (store: Store<RootState>) => {
  storeInstance = store; // Set store dynamically
};

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const state = storeInstance.getState();
    const accessToken = state.auth.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const state = storeInstance.getState();
        const refreshToken = state.auth.refreshToken;
        const sessionId = state.auth.sessionId;
        const userId = state.auth.userData?._id;
        const userName = state.auth.userData?.userName;

        const response = await axios.post(
          "http://localhost:5000/user/refresh-token",
          {
            refreshToken,
            sessionId,
            userId,
            userName,
          },
          {
            withCredentials: true,
          }
        );

        const { data } = RefreshTOkenSchema.parse(response.data);

        storeInstance.dispatch({
          type: "auth/setAccessToken",
          payload: data,
        });

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        storeInstance.dispatch({ type: "auth/logout" });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
