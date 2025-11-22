// API Module Exports
export * from "./auth-api";
export * from "./challengesapi";
export * from "./leaderboardapi";
export * from "./faq-api";
export * from "./file-api";

// Re-export common utilities
export { fetchWithRetry, handleApiError, type ApiResponse } from "../utils";

// Combined API client for convenience
import { authApi } from "./auth-api";
import { challengesApi } from "./challengesapi";
import { leaderboardApi } from "./leaderboardapi";
import { faqAPI } from "./faq-api";
import { fileAPI } from "./file-api";

export const api = {
  auth: authApi,
  challenges: challengesApi,
  leaderboard: leaderboardApi,
  faq: faqAPI,
  files: fileAPI,
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  TOKEN_KEY: "ctf_token",
} as const;

// Common API error types
export enum ApiErrorType {
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

// Helper function to get error type from status code
export function getErrorType(status?: number): ApiErrorType {
  if (!status) return ApiErrorType.NETWORK_ERROR;

  switch (true) {
    case status === 400:
      return ApiErrorType.VALIDATION_ERROR;
    case status === 401:
      return ApiErrorType.AUTHENTICATION_ERROR;
    case status === 403:
      return ApiErrorType.AUTHORIZATION_ERROR;
    case status === 404:
      return ApiErrorType.NOT_FOUND_ERROR;
    case status === 408:
      return ApiErrorType.TIMEOUT_ERROR;
    case status >= 500:
      return ApiErrorType.SERVER_ERROR;
    default:
      return ApiErrorType.UNKNOWN_ERROR;
  }
}

export default api;
