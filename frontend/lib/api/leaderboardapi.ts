// Enhanced TypeScript interfaces following Postman API design guidelines
interface LeaderboardEntry {
  id: number;
  username: string;
  points: number;
  rank: number;
  is_wlv_student?: boolean;
  is_student?: boolean;
  student_id?: string;
  created_at?: string;
  last_active?: string;
  solved_challenges?: number;
  profile_image?: string;
  email?: string;
  level?: number;
  badges?: string[];
}

interface LeaderboardStats {
  total_users: number;
  total_challenges: number;
  average_points: number;
  top_scorer: LeaderboardEntry;
  last_updated: string;
}

interface LeaderboardFilters {
  type?: "all" | "wlv" | "general";
  limit?: number;
  offset?: number;
  timeframe?: "daily" | "weekly" | "monthly" | "all_time";
  min_points?: number;
  student_only?: boolean;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
  timestamp?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    stats?: LeaderboardStats;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Utility function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Enhanced fetch wrapper with retry logic
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
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    // Retry on server errors
    if (!response.ok && response.status >= 500 && retries > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1))
      );
      return fetchWithRetry(url, options, retries - 1);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    // Retry on network errors
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

// Enhanced error handling
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
  };
};

// Helper to build query string
const buildQueryString = (
  filters?: Record<string, string | number | boolean | undefined | null>
): string => {
  if (!filters) return "";
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  }
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
};

// Helper to process leaderboard data
const processLeaderboardData = (result: unknown): LeaderboardEntry[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = result as any;
  const leaderboardData = res.data?.leaderboard || res.data || res;

  if (!Array.isArray(leaderboardData)) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return leaderboardData.map((entry: any, index: number) => ({
    ...entry,
    rank: entry.rank || index + 1,
    points: entry.points || entry.score || 0,
  })) as LeaderboardEntry[];
};

// Helper to fetch leaderboard data
const fetchLeaderboardData = async (
  endpoint: string,
  filters?: Record<string, string | number | boolean | undefined | null>,
  contextName = "leaderboard"
): Promise<ApiResponse<LeaderboardEntry[]>> => {
  try {
    const url = `${API_BASE_URL}${endpoint}${buildQueryString(filters)}`;
    const response = await fetchWithRetry(url, { method: "GET" });

    if (response.ok) {
      const result = await response.json();
      const processedData = processLeaderboardData(result);

      return {
        success: true,
        data: processedData,
        status: response.status,
        timestamp: new Date().toISOString(),
        meta: result.meta || {
          total: processedData.length,
          page: 1,
          limit: processedData.length,
        },
      };
    } else {
      return await handleApiError(response);
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          error: `Request timeout while fetching ${contextName}`,
          status: 408,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: `Failed to fetch ${contextName}: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
    }
    return {
      success: false,
      error: `An unexpected error occurred while fetching ${contextName}`,
      timestamp: new Date().toISOString(),
    };
  }
};

export const leaderboardApi = {
  async getLeaderboard(
    filters?: LeaderboardFilters
  ): Promise<ApiResponse<LeaderboardEntry[]>> {
    return fetchLeaderboardData(
      "/leaderboard",
      filters as unknown as Record<
        string,
        string | number | boolean | undefined | null
      >,
      "leaderboard"
    );
  },

  async getWlvLeaderboard(
    filters?: Omit<LeaderboardFilters, "type">
  ): Promise<ApiResponse<LeaderboardEntry[]>> {
    return fetchLeaderboardData(
      "/leaderboard/wlv",
      filters as unknown as Record<
        string,
        string | number | boolean | undefined | null
      >,
      "WLV leaderboard"
    );
  },
};
