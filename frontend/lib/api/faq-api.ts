import { fetchWithRetry, handleApiError } from "../utils";

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// FAQ Interfaces
export interface FAQ {
  id: number;
  question: string;
  answer: string;
  created_at?: string;
  updated_at?: string;
  display_order?: number;
  category?: string;
  is_active?: boolean;
}

export interface CreateFAQData {
  question: string;
  answer: string;
  category?: string;
  display_order?: number;
}

export interface FAQFilters {
  category?: string;
  search?: string;
  is_active?: boolean;
  limit?: number;
  offset?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
  timestamp: string;
}

export interface FAQListResponse {
  faqs: FAQ[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

// FAQ API Methods
export const faqAPI = {
  // Get all FAQs with optional filtering
  async getAllFAQs(
    filters: FAQFilters = {}
  ): Promise<ApiResponse<FAQListResponse>> {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();

      if (filters.category) {
        queryParams.append("category", filters.category);
      }
      if (filters.search) {
        queryParams.append("search", filters.search);
      }
      if (filters.is_active !== undefined) {
        queryParams.append("is_active", filters.is_active.toString());
      }
      if (filters.limit) {
        queryParams.append("limit", filters.limit.toString());
      }
      if (filters.offset) {
        queryParams.append("offset", filters.offset.toString());
      }

      const url = `${API_BASE_URL}/faqs${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await fetchWithRetry(url, {
        method: "GET",
      });

      if (response.ok) {
        const result = await response.json();
        const faqsData = Array.isArray(result)
          ? result
          : result.data || result.faqs || [];

        return {
          success: true,
          data: {
            faqs: faqsData,
            meta: result.meta || {
              total: faqsData.length,
              page: 1,
              per_page: faqsData.length,
              total_pages: 1,
              has_next: false,
              has_previous: false,
            },
          },
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
            error: "Request timeout while fetching FAQs",
            status: 408,
            timestamp: new Date().toISOString(),
          };
        }
        return {
          success: false,
          error: `Failed to fetch FAQs: ${error.message}`,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred while fetching FAQs",
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Create a new FAQ (admin only)
  async createFAQ(data: CreateFAQData): Promise<ApiResponse<FAQ>> {
    try {
      // Input validation
      const validation = this.validateFAQData(data);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(", ")}`,
          status: 400,
          timestamp: new Date().toISOString(),
        };
      }

      const response = await fetchWithRetry(`${API_BASE_URL}/faqs`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        const faqData = result.data || result;

        return {
          success: true,
          data: faqData,
          message: result.message || "FAQ created successfully",
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
            error: "Request timeout while creating FAQ",
            status: 408,
            timestamp: new Date().toISOString(),
          };
        }
        return {
          success: false,
          error: `Failed to create FAQ: ${error.message}`,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred while creating the FAQ",
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Delete a FAQ (admin only)
  async deleteFAQ(faqId: number): Promise<ApiResponse> {
    try {
      // Input validation
      if (!faqId || faqId <= 0) {
        return {
          success: false,
          error: "Invalid FAQ ID provided",
          status: 400,
          timestamp: new Date().toISOString(),
        };
      }

      const response = await fetchWithRetry(`${API_BASE_URL}/faqs/${faqId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          message: result.message || "FAQ deleted successfully",
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
            error: "Request timeout while deleting FAQ",
            status: 408,
            timestamp: new Date().toISOString(),
          };
        }
        return {
          success: false,
          error: `Failed to delete FAQ: ${error.message}`,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred while deleting the FAQ",
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Validate FAQ data
  validateFAQData(data: CreateFAQData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.question || data.question.trim().length === 0) {
      errors.push("Question is required");
    } else if (data.question.length > 500) {
      errors.push("Question must be less than 500 characters");
    }

    if (!data.answer || data.answer.trim().length === 0) {
      errors.push("Answer is required");
    } else if (data.answer.length > 5000) {
      errors.push("Answer must be less than 5000 characters");
    }

    if (data.category && data.category.length > 100) {
      errors.push("Category must be less than 100 characters");
    }

    if (
      data.display_order !== undefined &&
      (data.display_order < 0 || data.display_order > 9999)
    ) {
      errors.push("Display order must be between 0 and 9999");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Get FAQ categories
  async getFAQCategories(): Promise<ApiResponse<string[]>> {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/faqs/categories`, {
        method: "GET",
      });

      if (response.ok) {
        const result = await response.json();
        const categories = result.data || result.categories || result || [];

        return {
          success: true,
          data: Array.isArray(categories) ? categories : [],
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
            error: "Request timeout while fetching FAQ categories",
            status: 408,
            timestamp: new Date().toISOString(),
          };
        }
        return {
          success: false,
          error: `Failed to fetch FAQ categories: ${error.message}`,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred while fetching FAQ categories",
        timestamp: new Date().toISOString(),
      };
    }
  },
};
