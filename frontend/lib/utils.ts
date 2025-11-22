import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Common API Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
  timestamp: string;
}

// Utility function for making API requests with timeout and retry logic
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3,
  timeoutMs = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    signal: controller.signal,
    ...options,
  };

  // Add authorization header if token exists
  const token =
    globalThis.window === undefined ? null : localStorage.getItem("ctf_token");
  if (token) {
    (
      defaultOptions.headers as Record<string, string>
    ).Authorization = `Bearer ${token}`;
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, defaultOptions);
      clearTimeout(timeout);
      return response;
    } catch (error) {
      lastError = error as Error;
      clearTimeout(timeout);

      // Don't retry on abort or final attempt
      if (error instanceof Error && error.name === "AbortError") {
        throw error;
      }

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff: wait 2^attempt * 100ms
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 100)
      );
    }
  }

  throw lastError || new Error("Unknown error occurred");
}

// Handle API error responses
export async function handleApiError(response: Response): Promise<ApiResponse> {
  try {
    const errorData = await response.json();

    // Handle token expiration
    if (response.status === 401 && globalThis.window !== undefined) {
      localStorage.removeItem("ctf_token");
      globalThis.window.location.href = "/login";
    }

    return {
      success: false,
      error:
        errorData.message ||
        errorData.error ||
        `Request failed with status ${response.status}`,
      status: response.status,
      timestamp: new Date().toISOString(),
    };
  } catch {
    return {
      success: false,
      error: `Request failed with status ${response.status}`,
      status: response.status,
      timestamp: new Date().toISOString(),
    };
  }
}
