/**
 * Common API utilities following Postman best practices
 * Enhanced with proper error handling, retry mechanisms, and TypeScript support
 */

// Common interfaces
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
  timestamp?: string;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  field?: string;
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// Constants
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
export const DEFAULT_TIMEOUT = 10000; // 10 seconds
export const DEFAULT_RETRIES = 3;
export const DEFAULT_RETRY_DELAY = 1000; // 1 second

/**
 * Get authentication headers
 */
export function getAuthHeaders(): HeadersInit {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem("authToken");
  const expiry = localStorage.getItem("tokenExpiry");

  if (!token) return false;

  if (expiry && Date.now() > Number.parseInt(expiry, 10)) {
    // Token expired, clean up
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiry");
    return false;
  }

  return true;
}

/**
 * Get current auth token
 */
export function getAuthToken(): string | null {
  if (!isAuthenticated()) return null;
  return localStorage.getItem("authToken");
}

/**
 * Build query parameters from object
 */
export function buildQueryParams(params: Record<string, unknown>): string {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        queryParams.append(key, value.join(","));
      } else if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        queryParams.append(key, String(value));
      } else if (typeof value === "object") {
        queryParams.append(key, JSON.stringify(value));
      }
    }
  }

  return queryParams.toString();
}

/**
 * Enhanced fetch wrapper with timeout, retry logic, and error handling
 */
export async function fetchWithRetry(
  url: string,
  config: RequestConfig = {}
): Promise<Response> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    ...requestInit
  } = config;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  async function attemptFetch(remainingRetries: number): Promise<Response> {
    try {
      const response = await fetch(url, {
        ...requestInit,
        signal: controller.signal,
        headers: {
          ...getAuthHeaders(),
          ...requestInit.headers,
        },
      });

      clearTimeout(timeoutId);

      // If server error and retries available, retry after delay
      if (!response.ok && response.status >= 500 && remainingRetries > 0) {
        await delay(retryDelay * (DEFAULT_RETRIES - remainingRetries + 1));
        return attemptFetch(remainingRetries - 1);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      // If network error and retries available, retry after delay
      if (
        remainingRetries > 0 &&
        (error instanceof TypeError ||
          (error instanceof Error && error.name === "AbortError"))
      ) {
        await delay(retryDelay * (DEFAULT_RETRIES - remainingRetries + 1));
        return attemptFetch(remainingRetries - 1);
      }

      throw error;
    }
  }

  return attemptFetch(retries);
}

/**
 * Enhanced error handling for API responses
 */
export async function handleApiError<T = unknown>(
  response: Response
): Promise<ApiResponse<T>> {
  let errorData: Record<string, unknown>;

  try {
    errorData = await response.json();
  } catch {
    errorData = { message: "Invalid response format" };
  }

  // Extract message from error data
  let message = "Unknown error occurred";
  if (typeof errorData.message === "string") {
    message = errorData.message;
  } else if (typeof errorData.error === "string") {
    message = errorData.error;
  } else if (response.statusText) {
    message = response.statusText;
  }

  return {
    success: false,
    error: message,
    status: response.status,
    timestamp: new Date().toISOString(),
    meta: errorData.meta as Record<string, unknown>,
  };
}

/**
 * Handle successful API responses with data extraction
 */
export function handleApiSuccess<T>(
  response: Response,
  result: Record<string, unknown>,
  dataPath?: string[]
): ApiResponse<T> {
  // Extract data based on provided path or common patterns
  let data: unknown = result;

  if (dataPath) {
    for (const key of dataPath) {
      data = (data as Record<string, unknown>)?.[key];
    }
  } else {
    // Try common patterns
    data = (result as Record<string, unknown>).data ?? result;
  }

  return {
    success: true,
    data: data as T,
    status: response.status,
    timestamp: new Date().toISOString(),
    meta: result.meta as Record<string, unknown>,
  };
}

/**
 * Utility function for delays (used in retry logic)
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validate required fields in data objects
 */
export function validateRequiredFields<T extends Record<string, unknown>>(
  data: T,
  requiredFields: (keyof T)[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter(
    (field) => !data[field] && data[field] !== 0 && data[field] !== false
  );

  return {
    isValid: missingFields.length === 0,
    missingFields: missingFields.map(String),
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Create standardized API client methods
 */
export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, unknown>,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const queryString = params ? buildQueryParams(params) : "";
      const url = `${this.baseUrl}${endpoint}${
        queryString ? "?" + queryString : ""
      }`;

      const response = await fetchWithRetry(url, {
        method: "GET",
        ...config,
      });

      if (response.ok) {
        const result = await response.json();
        return handleApiSuccess<T>(response, result);
      } else {
        return await handleApiError(response);
      }
    } catch (error) {
      return this.handleRequestError(error);
    }
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetchWithRetry(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
        ...config,
      });

      if (response.ok) {
        const result = await response.json();
        return handleApiSuccess<T>(response, result);
      } else {
        return await handleApiError(response);
      }
    } catch (error) {
      return this.handleRequestError(error);
    }
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetchWithRetry(`${this.baseUrl}${endpoint}`, {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
        ...config,
      });

      if (response.ok) {
        const result = await response.json();
        return handleApiSuccess<T>(response, result);
      } else {
        return await handleApiError(response);
      }
    } catch (error) {
      return this.handleRequestError(error);
    }
  }

  async delete<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetchWithRetry(`${this.baseUrl}${endpoint}`, {
        method: "DELETE",
        ...config,
      });

      if (response.ok) {
        const result = await response.json();
        return handleApiSuccess<T>(response, result);
      } else {
        return await handleApiError(response);
      }
    } catch (error) {
      return this.handleRequestError(error);
    }
  }

  private handleRequestError(error: unknown): ApiResponse<never> {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Request timeout - please check your connection and try again",
          status: 408,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred",
      timestamp: new Date().toISOString(),
    };
  }
}

// Export a default instance
export const apiClient = new ApiClient();
