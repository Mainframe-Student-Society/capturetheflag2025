interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  is_student: boolean;
  is_wlv_student: boolean;
  student_id: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  is_student: boolean;
  is_wlv_student: boolean;
  student_id?: string;
  created_at?: string;
  points?: number;
}

interface LoginResponse {
  token: string;
  user: User;
  expires_in?: number;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
  timestamp?: string;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  field?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
const REQUEST_TIMEOUT = 10000;
const BASE_URL = API_BASE_URL.endsWith("/")
  ? API_BASE_URL.slice(0, -1)
  : API_BASE_URL;

function sanitizeLoginData(data: LoginData) {
  return { username: data.username.trim(), password: data.password };
}
function storeAuthData(loginData: LoginResponse) {
  if (typeof globalThis.window === "undefined") return;
  localStorage.setItem("authToken", loginData.token);
  if (loginData.expires_in) {
    localStorage.setItem(
      "tokenExpiry",
      String(Date.now() + loginData.expires_in * 1000)
    );
  }
  if (loginData.user) {
    localStorage.setItem("userData", JSON.stringify(loginData.user));
  }
}
function parseErrorBody(raw: string): { message: string } {
  try {
    const parsed = JSON.parse(raw);
    return {
      message:
        (parsed.message as string) ||
        (parsed.error as string) ||
        "Invalid username or password",
    };
  } catch {
    return { message: raw || "Invalid username or password" };
  }
}

const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout = REQUEST_TIMEOUT
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
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

  let message = "Unknown error";
  if (typeof errorData.message === "string") {
    message = errorData.message;
  } else if (typeof errorData.error === "string") {
    message = errorData.error;
  } else if (response.statusText) {
    message = response.statusText;
  }

  const apiError: ApiError = {
    code:
      typeof errorData.code === "string"
        ? errorData.code
        : `HTTP_${response.status}`,
    message,
    details: errorData.details as Record<string, unknown>,
    field: errorData.field as string,
  };

  return {
    success: false,
    error: apiError.message,
    status: response.status,
    timestamp: new Date().toISOString(),
  };
};

export const authApi = {
  async login(data: LoginData): Promise<ApiResponse<LoginResponse>> {
    try {
      if (!(data.username && data.password))
        return {
          success: false,
          error: "Username and password are required",
          status: 400,
          timestamp: new Date().toISOString(),
        };
      const payload = sanitizeLoginData(data);
      const response = await fetchWithTimeout(`${BASE_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const result = await response.json();
        const loginData: LoginResponse = (result.data ||
          result) as LoginResponse;
        if (loginData.token) storeAuthData(loginData);
        return {
          success: true,
          data: loginData,
          status: response.status,
          timestamp: new Date().toISOString(),
        };
      }
      const raw = await response.text();
      const { message } = parseErrorBody(raw);
      return {
        success: false,
        error: message,
        status: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError")
          return {
            success: false,
            error: "Request timeout - please check your connection",
            status: 408,
            timestamp: new Date().toISOString(),
          };
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
  },

  async register(data: RegisterData): Promise<ApiResponse<User>> {
    try {
      const requiredFields = ["username", "email", "password"];
      const missingFields = requiredFields.filter(
        (field) => !data[field as keyof RegisterData]
      );

      if (missingFields.length > 0) {
        return {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
          status: 400,
          timestamp: new Date().toISOString(),
        };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return {
          success: false,
          error: "Please enter a valid email address",
          status: 400,
          timestamp: new Date().toISOString(),
        };
      }

      if (data.password.length < 8) {
        return {
          success: false,
          error: "Password must be at least 8 characters long",
          status: 400,
          timestamp: new Date().toISOString(),
        };
      }

      const response = await fetchWithTimeout(`${BASE_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify({
          ...data,
          username: data.username.trim(),
          email: data.email.trim().toLowerCase(),
        }),
      });

      if (response.ok) {
        const result: User = await response.json();
        return {
          success: true,
          data: result,
          status: response.status,
          timestamp: new Date().toISOString(),
        };
      } else {
        return await handleApiError(response);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            success: false,
            error: "Registration timeout - please try again",
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
        error: "Registration failed due to an unexpected error",
        timestamp: new Date().toISOString(),
      };
    }
  },

  async logout(): Promise<ApiResponse> {
    try {
      let token: string | null = null;
      if (typeof globalThis.window !== "undefined") {
        token = localStorage.getItem("authToken");
      }
      const response = await fetchWithTimeout(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        credentials: "include",
      });
      if (typeof globalThis.window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("tokenExpiry");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("tokenExpiry");
      }
      if (response.ok)
        return {
          success: true,
          status: response.status,
          timestamp: new Date().toISOString(),
        };
      return {
        success: true,
        message: "Logged out locally (server logout may have failed)",
        status: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch {
      if (typeof globalThis.window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("tokenExpiry");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("tokenExpiry");
      }
      return {
        success: true,
        message: "Logged out locally (network error prevented server logout)",
        timestamp: new Date().toISOString(),
      };
    }
  },

  isAuthenticated(): boolean {
    if (typeof globalThis.window === "undefined") return false;
    const token = localStorage.getItem("authToken");
    const expiry = localStorage.getItem("tokenExpiry");
    if (!token) return false;
    if (expiry && Date.now() > Number.parseInt(expiry, 10)) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("tokenExpiry");
      return false;
    }
    return true;
  },
  getAuthToken(): string | null {
    if (typeof globalThis.window === "undefined") return null;
    return localStorage.getItem("authToken");
  },
};
