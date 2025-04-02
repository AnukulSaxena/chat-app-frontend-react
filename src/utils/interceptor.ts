import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { Store } from "@reduxjs/toolkit"; // Type for Redux store
import { RootState } from "../store/store"; // Adjust path based on your project structure
import { RefreshTOkenSchema } from "@/schemas";
import { logout, setAccessToken } from "@/store/slice/auth.slice";

let storeInstance: Store<RootState>; // Properly typed placeholder for the Redux store

// --- State for managing token refresh ---
let isRefreshing = false; // Flag to indicate if a token refresh is in progress
let failedRequestsQueue: Array<(token: string) => void> = []; // Queue to hold requests waiting for the new token

// --- Helper function to process the queue ---
const processQueue = (error: Error | null, token: string | null = null) => {
  failedRequestsQueue.forEach((prom) => {
    if (error) {
      // If refresh failed, we might want to reject the waiting requests
      // For simplicity here, we'll let them retry and likely fail again or handle individually
      // A more robust solution might involve passing the error to a rejection handler
      console.error("Failed to refresh token for queued request", error);
      prom(""); // Resolve with empty token to indicate failure or handle differently
    } else if (token) {
      prom(token); // Resolve the promise with the new token
    }
  });

  failedRequestsQueue = []; // Clear the queue
};

export const setStore = (store: Store<RootState>) => {
  storeInstance = store; // Set store dynamically
};

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!storeInstance) {
      console.warn("Axios interceptor: Redux store not set yet!");
      return config;
    }
    const state = storeInstance.getState();
    const accessToken = state.auth.accessToken;

    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    }; // Add type assertion for _retry

    if (!storeInstance) {
      console.error(
        "Axios interceptor: Redux store not set during response error!"
      );
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // --- Check if a refresh is already in progress ---
      if (isRefreshing) {
        // If already refreshing, add this request to the queue and wait
        return new Promise((resolve) => {
          failedRequestsQueue.push((token: string) => {
            if (token && originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(api(originalRequest)); // Retry the request with the new token
            } else {
              // Handle case where token refresh failed while waiting
              resolve(Promise.reject(error)); // Or handle logout
            }
          });
        });
      }

      // --- This is the first request to fail, initiate the refresh ---
      originalRequest._retry = true; // Mark as retried to prevent infinite loops
      isRefreshing = true; // Set the refreshing flag

      try {
        const state = storeInstance.getState();
        const refreshToken = state.auth.refreshToken;
        const sessionId = state.auth.sessionId;
        const userId = state.auth.userData?._id;
        const userName = state.auth.userData?.userName;

        // Basic check if refresh token exists
        if (!refreshToken || !sessionId || !userId) {
          console.error("Missing refresh token data, logging out.");
          storeInstance.dispatch(logout()); // Dispatch your logout action
          isRefreshing = false; // Reset flag
          processQueue(new Error("Missing refresh token data"), null); // Notify queue of failure
          return Promise.reject(error);
        }

        console.log("Attempting token refresh..."); // Log refresh attempt

        const refreshResponse = await axios.post(
          "http://localhost:5000/user/refresh-token", // Use same base URL or env var
          { refreshToken, sessionId, userId, userName },
          { withCredentials: true }
        );

        const parsedData = RefreshTOkenSchema.parse(refreshResponse.data);

        if (!parsedData.success) {
          console.error("Failed to parse refresh token response:", parsedData);
          throw new Error("Invalid refresh token response structure");
        }

        const { data: newTokens } = parsedData;
        const newAccessToken = newTokens.accessToken;

        console.log("Token refresh successful!"); // Log success

        // --- Update store with new token ---
        storeInstance.dispatch(setAccessToken(newTokens));

        // --- Update header of the original request ---
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // --- Process the queue with the new token ---
        console.log("Processing queue with new token...", failedRequestsQueue); // Log processing
        processQueue(null, newAccessToken);

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        storeInstance.dispatch(logout());
        processQueue(refreshError as Error, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false; // Always reset the flag
      }
    }

    return Promise.reject(error);
  }
);

export default api;
