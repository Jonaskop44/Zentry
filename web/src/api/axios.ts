/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/`,
  withCredentials: true,
});

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  console.log(
    "[Axios] Prozessiere Warteschlange. Fehler:",
    error,
    "Token:",
    token
  );
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  console.log("[Axios] Request:", config.method?.toUpperCase(), config.url);

  if (
    config.url &&
    !config.url.includes("/auth/login") &&
    !config.url.includes("/auth/refresh")
  ) {
    (config as any)._retryEligible = true;
    console.log("[Axios] _retryEligible wurde gesetzt für:", config.url);
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("[Axios] Response OK:", response.status, response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
      _retryEligible?: boolean;
    };

    const isLoginRequest = originalRequest.url?.includes("/auth/login");
    const isRefreshRequest = originalRequest.url?.includes("/auth/refresh");

    console.warn(
      "[Axios] Fehler bei Antwort:",
      error.response?.status,
      originalRequest.url
    );
    console.log("[Axios] _retry:", originalRequest._retry);
    console.log("[Axios] _retryEligible:", originalRequest._retryEligible);
    console.log("[Axios] isLoginRequest:", isLoginRequest);
    console.log("[Axios] isRefreshing:", isRefreshing);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest._retryEligible &&
      !isLoginRequest &&
      !isRefreshRequest
    ) {
      console.warn(
        "[Axios] Access Token vermutlich abgelaufen. Starte Refresh-Vorgang..."
      );

      if (isRefreshing) {
        console.log(
          "[Axios] Refresh läuft bereits – füge Anfrage zur Warteschlange hinzu"
        );
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("[Axios] Sende POST /auth/refresh");
        const refreshResponse = await api.post("/auth/refresh");
        console.log("[Axios] Refresh erfolgreich:", refreshResponse.status);
        processQueue(null);
        return api(originalRequest);
      } catch (err) {
        console.error("[Axios] Refresh fehlgeschlagen:", err);
        processQueue(err as AxiosError, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
        console.log("[Axios] Refresh abgeschlossen");
      }
    }

    console.warn("[Axios] Fehler wird direkt weitergereicht.");
    return Promise.reject(error);
  }
);

export default api;
