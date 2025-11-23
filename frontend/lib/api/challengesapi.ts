interface Challenge {
  id: number;
  title: string;
  description: string;
  level: number;
  points: number;
  solution: string;
  attachment?: string;
  attachments?: string[];
  created_at?: string;
  updated_at?: string;
  author?: string;
  tags?: string[];
  difficulty?: "easy" | "medium" | "hard" | "expert";
  category?: string;
  solved_by?: number;
}
interface CreateChallengeData {
  title: string;
  description: string;
  level: number;
  points: number;
  solution: string;
  attachment?: string;
  tags?: string[];
  difficulty?: "easy" | "medium" | "hard" | "expert";
  category?: string;
}
interface ChallengeFilters {
  level?: number;
  difficulty?: string;
  category?: string;
  tags?: string[];
  search?: string;
  sort?: "points" | "level" | "created_at" | "title";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}
interface SubmitChallengeData {
  solution: string;
}
interface SubmissionResponse {
  correct: boolean;
  points_awarded?: number;
  message: string;
  total_points?: number;
  rank_change?: number;
}
interface ChallengeListResponse {
  available: Challenge[];
  completed: Challenge[];
}
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
  timestamp?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
const REQUEST_TIMEOUT = 15000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
function getAuthHeaders(): HeadersInit {
  let token = null;
  if (typeof globalThis.window !== "undefined") {
    token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  }
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  return headers;
}
function isAuthenticated(): boolean {
  if (typeof globalThis.window === "undefined") return false;
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  const expiry = localStorage.getItem("tokenExpiry");
  if (!token) return false;
  if (expiry && Date.now() > Number.parseInt(expiry, 10)) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiry");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("tokenExpiry");
    return false;
  }
  return true;
}
const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { ...getAuthHeaders(), ...options.headers },
    });
    clearTimeout(timeoutId);
    if (!response.ok && response.status >= 500 && retries > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1))
      );
      return fetchWithRetry(url, options, retries - 1);
    }
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (
      retries > 0 &&
      (error instanceof TypeError ||
        (error instanceof Error && error.name === "AbortError"))
    ) {
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1))
      );
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};
const handleApiError = async (
  response: Response
): Promise<ApiResponse<never>> => {
  let errorData: Record<string, unknown>;
  try {
    errorData = await response.json();
  } catch {
    errorData = { message: "Invalid response format" };
  }
  let message = "Unknown error occurred";
  if (response.status === 401)
    message = "Authentication required. Please log in to access this resource.";
  else if (typeof errorData.message === "string") message = errorData.message;
  else if (typeof errorData.error === "string") message = errorData.error;
  else if (response.statusText) message = response.statusText;
  return {
    success: false,
    error: message,
    status: response.status,
    timestamp: new Date().toISOString(),
  };
};
export const challengesApi = {
  async getAllChallenges(
    filters?: ChallengeFilters
  ): Promise<ApiResponse<ChallengeListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) queryParams.append(key, value.join(","));
            else queryParams.append(key, String(value));
          }
        }
      }
      const baseUrl = API_BASE_URL.endsWith("/")
        ? API_BASE_URL.slice(0, -1)
        : API_BASE_URL;
      const url = `${baseUrl}/challenges${
        queryParams.toString() ? "?" + queryParams.toString() : ""
      }`;
      const response = await fetchWithRetry(url, { method: "GET" });
      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          data: result.data,
          status: response.status,
          timestamp: new Date().toISOString(),
          pagination: result.pagination,
        };
      } else if (response.status === 401) {
        return {
          success: false,
          error:
            "Please log in to view challenges. Redirecting to login page...",
          status: response.status,
          timestamp: new Date().toISOString(),
        };
      } else {
        return await handleApiError(response);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError")
          return {
            success: false,
            error:
              "Request timeout - please check your connection and try again",
            status: 408,
            timestamp: new Date().toISOString(),
          };
        return {
          success: false,
          error: `Failed to fetch challenges: ${error.message}`,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred while fetching challenges",
        timestamp: new Date().toISOString(),
      };
    }
  },
  async getOneChallenge(id: number): Promise<ApiResponse<Challenge>> {
    try {
      if (!id || id <= 0)
        return {
          success: false,
          error: "Invalid challenge ID provided",
          status: 400,
          timestamp: new Date().toISOString(),
        };
      const baseUrl = API_BASE_URL.endsWith("/")
        ? API_BASE_URL.slice(0, -1)
        : API_BASE_URL;
      const response = await fetchWithRetry(`${baseUrl}/challenges/${id}`, {
        method: "GET",
      });
      if (response.ok) {
        const result = await response.json();
        const challengeData = result.data?.challenge || result.data || result;
        if (!challengeData)
          return {
            success: false,
            error: "Challenge data not found in response",
            status: 404,
            timestamp: new Date().toISOString(),
          };
        return {
          success: true,
          data: challengeData,
          status: response.status,
          timestamp: new Date().toISOString(),
        };
      } else if (response.status === 401) {
        return {
          success: false,
          error: "Authentication required to view this challenge",
          status: response.status,
          timestamp: new Date().toISOString(),
        };
      } else {
        return await handleApiError(response);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError")
          return {
            success: false,
            error: "Request timeout while fetching challenge",
            status: 408,
            timestamp: new Date().toISOString(),
          };
        return {
          success: false,
          error: `Failed to fetch challenge: ${error.message}`,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred while fetching the challenge",
        timestamp: new Date().toISOString(),
      };
    }
  },
  async createChallenge(
    data: CreateChallengeData
  ): Promise<ApiResponse<Challenge>> {
    try {
      const requiredFields = [
        "title",
        "description",
        "level",
        "points",
        "solution",
      ];
      const missingFields = requiredFields.filter(
        (field) =>
          !data[field as keyof CreateChallengeData] &&
          data[field as keyof CreateChallengeData] !== 0
      );
      if (missingFields.length > 0)
        return {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
          status: 400,
          timestamp: new Date().toISOString(),
        };
      if (typeof data.title !== "string" || data.title.trim().length < 3)
        return {
          success: false,
          error: "Title must be at least 3 characters long",
          status: 400,
          timestamp: new Date().toISOString(),
        };
      if (typeof data.level !== "number" || data.level < 1 || data.level > 10)
        return {
          success: false,
          error: "Level must be a number between 1 and 10",
          status: 400,
          timestamp: new Date().toISOString(),
        };
      if (typeof data.points !== "number" || data.points < 1)
        return {
          success: false,
          error: "Points must be a positive number",
          status: 400,
          timestamp: new Date().toISOString(),
        };
      const baseUrl = API_BASE_URL.endsWith("/")
        ? API_BASE_URL.slice(0, -1)
        : API_BASE_URL;
      const response = await fetchWithRetry(`${baseUrl}/challenges`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        const challengeData = result.data?.challenge || result.data || result;
        return {
          success: true,
          data: challengeData,
          status: response.status,
          timestamp: new Date().toISOString(),
        };
      } else {
        return await handleApiError(response);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError")
          return {
            success: false,
            error: "Request timeout while creating challenge",
            status: 408,
            timestamp: new Date().toISOString(),
          };
        return {
          success: false,
          error: `Failed to create challenge: ${error.message}`,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred while creating the challenge",
        timestamp: new Date().toISOString(),
      };
    }
  },
  validateChallengeData(data: Partial<CreateChallengeData>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    if (!data.title || data.title.trim().length < 3)
      errors.push("Title must be at least 3 characters long");
    if (!data.description || data.description.trim().length < 10)
      errors.push("Description must be at least 10 characters long");
    if (!data.level || data.level < 1 || data.level > 10)
      errors.push("Level must be between 1 and 10");
    if (!data.points || data.points < 1)
      errors.push("Points must be a positive number");
    if (!data.solution || data.solution.trim().length === 0)
      errors.push("Solution is required");
    return { isValid: errors.length === 0, errors };
  },
  async submitChallenge(
    challengeId: number,
    data: SubmitChallengeData
  ): Promise<ApiResponse<SubmissionResponse>> {
    try {
      if (!challengeId || challengeId <= 0)
        return {
          success: false,
          error: "Invalid challenge ID provided",
          status: 400,
          timestamp: new Date().toISOString(),
        };
      if (!data.solution || data.solution.trim().length === 0)
        return {
          success: false,
          error: "Solution cannot be empty",
          status: 400,
          timestamp: new Date().toISOString(),
        };
      const baseUrl = API_BASE_URL.endsWith("/")
        ? API_BASE_URL.slice(0, -1)
        : API_BASE_URL;
      const response = await fetchWithRetry(
        `${baseUrl}/challenges/${challengeId}/submit`,
        { method: "POST", body: JSON.stringify(data) }
      );
      if (response.ok) {
        const result = await response.json();
        const submissionData = result.data || result;
        return {
          success: true,
          data: {
            correct: response.status === 200,
            points_awarded: submissionData.points_awarded,
            message: result.message || "Challenge submitted successfully",
            total_points: submissionData.total_points,
            rank_change: submissionData.rank_change,
          },
          status: response.status,
          timestamp: new Date().toISOString(),
        };
      } else {
        return await handleApiError(response);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError")
          return {
            success: false,
            error: "Request timeout while submitting solution",
            status: 408,
            timestamp: new Date().toISOString(),
          };
        return {
          success: false,
          error: `Failed to submit challenge: ${error.message}`,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred while submitting the challenge",
        timestamp: new Date().toISOString(),
      };
    }
  },
  async deleteChallenge(challengeId: number): Promise<ApiResponse> {
    try {
      if (!challengeId || challengeId <= 0)
        return {
          success: false,
          error: "Invalid challenge ID provided",
          status: 400,
          timestamp: new Date().toISOString(),
        };
      const baseUrl = API_BASE_URL.endsWith("/")
        ? API_BASE_URL.slice(0, -1)
        : API_BASE_URL;
      const response = await fetchWithRetry(
        `${baseUrl}/challenges/${challengeId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          message: result.message || "Challenge deleted successfully",
          status: response.status,
          timestamp: new Date().toISOString(),
        };
      } else {
        return await handleApiError(response);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError")
          return {
            success: false,
            error: "Request timeout while deleting challenge",
            status: 408,
            timestamp: new Date().toISOString(),
          };
        return {
          success: false,
          error: `Failed to delete challenge: ${error.message}`,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred while deleting the challenge",
        timestamp: new Date().toISOString(),
      };
    }
  },
  isUserAuthenticated(): boolean {
    return isAuthenticated();
  },
  clearAuthentication(): void {
    if (typeof globalThis.window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("userData");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("tokenExpiry");
    }
  },
};
