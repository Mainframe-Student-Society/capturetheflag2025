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
      // Validate input data
      if (!data.username || !data.password) {
        return {
          success: false,
          error: "Username and password are required",
          status: 400,
          timestamp: new Date().toISOString(),
        };
      }

      // Ensure no double slashes in URL
      const baseUrl = API_BASE_URL.endsWith("/")
        ? API_BASE_URL.slice(0, -1)
        : API_BASE_URL;

      // Prepare the login payload
      const loginPayload = {
        username: data.username.trim(),
        password: data.password,
      };

      const response = await fetchWithTimeout(`${baseUrl}/auth/login`, {
        method: "POST",
        body: JSON.stringify(loginPayload),
      });

      console.log("Login response status:", response.status);
      console.log(
        "Login response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const result = await response.json();

        console.log("Login SUCCESS - Full response:", result);

        // The server returns: { data: { token, user }, message: "Login successful" }
        // Extract the actual login data from the nested structure
        const loginData = result.data || result;

        console.log("Extracted login data:", loginData);
        console.log("Login response data:", {
          hasToken: !!loginData.token,
          hasUser: !!loginData.user,
          tokenLength: loginData.token ? loginData.token.length : 0,
          tokenStart: loginData.token
            ? loginData.token.substring(0, 10)
            : "No token",
        });

        if (loginData.token) {
          // Check if we're in a browser environment before accessing localStorage
          if (typeof window !== "undefined") {
            console.log("About to store token:", loginData.token);
            localStorage.setItem("authToken", loginData.token);

            // Verify it was stored
            const storedToken = localStorage.getItem("authToken");
            console.log("Token storage verification:", {
              stored: storedToken === loginData.token,
              storedLength: storedToken?.length || 0,
              originalLength: loginData.token.length,
              retrievedToken: storedToken?.substring(0, 10) + "...",
            });

            if (loginData.expires_in) {
              const expiryTime = Date.now() + loginData.expires_in * 1000;
              localStorage.setItem("tokenExpiry", expiryTime.toString());
            }

            // Also store user data
            if (loginData.user) {
              localStorage.setItem("userData", JSON.stringify(loginData.user));
              console.log("User data stored:", loginData.user);

              // Verify user data was stored
              const storedUser = localStorage.getItem("userData");
              console.log("User data verification:", !!storedUser);
            }
          } else {
            console.error("Window is undefined - cannot access localStorage");
          }
        } else {
          console.error("No token in login data!", loginData);
        }

        return {
          success: true,
          data: loginData, // Return the extracted data, not the wrapper
          status: response.status,
          timestamp: new Date().toISOString(),
        };
      } else {
        // Get the error response
        const errorText = await response.text();
        console.log("Login FAILED - Response status:", response.status);
        console.log("Login FAILED - Response text:", errorText);

        // Try to parse as JSON, fall back to text
        let errorData;
        try {
          errorData = JSON.parse(errorText);
          console.log("Login FAILED - Parsed error:", errorData);
        } catch {
          errorData = { message: errorText || "Invalid username or password" };
        }

        return {
          success: false,
          error:
            errorData.message ||
            errorData.error ||
            "Invalid username or password",
          status: response.status,
          timestamp: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.error("Login EXCEPTION:", error);
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            success: false,
            error: "Request timeout - please check your connection",
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

      // Ensure no double slashes in URL
      const baseUrl = API_BASE_URL.endsWith("/")
        ? API_BASE_URL.slice(0, -1)
        : API_BASE_URL;

      const response = await fetchWithTimeout(`${baseUrl}/auth/register`, {
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
      let token = null;

      // Check if we're in a browser environment
      if (typeof window !== "undefined") {
        token = localStorage.getItem("authToken");
      }

      // Ensure no double slashes in URL
      const baseUrl = API_BASE_URL.endsWith("/")
        ? API_BASE_URL.slice(0, -1)
        : API_BASE_URL;

      const response = await fetchWithTimeout(`${baseUrl}/auth/logout`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      // Clear tokens if in browser environment
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("tokenExpiry");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("tokenExpiry");
      }

      if (response.ok) {
        return {
          success: true,
          status: response.status,
          timestamp: new Date().toISOString(),
        };
      } else {
        return {
          success: true,
          message: "Logged out locally (server logout may have failed)",
          status: response.status,
          timestamp: new Date().toISOString(),
        };
      }
    } catch {
      // Clear tokens if in browser environment
      if (typeof window !== "undefined") {
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
    // Check if we're in a browser environment
    if (typeof window === "undefined") return false;

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
    // Check if we're in a browser environment
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("authToken");
    console.log("Getting auth token:", {
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      isAuthenticated: this.isAuthenticated(),
    });

    return token;
  },
};
