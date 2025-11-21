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

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const authApi = {
  async login(data: LoginData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, error: result.message || "Login failed" };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  },

  async register(data: RegisterData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, data: result };
      } else {
        return {
          success: false,
          error: result.message || "Registration failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  },
};
