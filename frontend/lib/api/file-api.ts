import { fetchWithRetry, handleApiError } from "../utils";

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// File Interfaces
export interface FileDownloadResponse {
  filename: string;
  content_type: string;
  size: number;
  url?: string; // For direct downloads
  data?: Blob; // For blob downloads
}

export interface DownloadError {
  message: string;
  status: number;
  timestamp: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
  timestamp: string;
}

// File Download Utilities
export const fileAPI = {
  // Download challenge attachment
  async downloadChallengeFile(
    challengeId: number,
    filename: string
  ): Promise<
    | { success: true; data: FileDownloadResponse }
    | { success: false; error: string; status?: number; timestamp: string }
  > {
    try {
      // Input validation
      if (!challengeId || challengeId <= 0) {
        return {
          success: false,
          error: "Invalid challenge ID provided",
          status: 400,
          timestamp: new Date().toISOString(),
        };
      }

      if (!filename || filename.trim().length === 0) {
        return {
          success: false,
          error: "Filename is required",
          status: 400,
          timestamp: new Date().toISOString(),
        };
      }

      // Sanitize filename to prevent path traversal
      const sanitizedFilename = filename.replaceAll(/[^a-zA-Z0-9._-]/g, "");
      if (sanitizedFilename !== filename) {
        return {
          success: false,
          error: "Invalid filename format",
          status: 400,
          timestamp: new Date().toISOString(),
        };
      }

      const url = `${API_BASE_URL}/challenges/${challengeId}/files/${encodeURIComponent(
        filename
      )}`;
      const response = await fetchWithRetry(url, {
        method: "GET",
      });

      if (response.ok) {
        const contentType =
          response.headers.get("content-type") || "application/octet-stream";
        const contentLength = response.headers.get("content-length");
        const blob = await response.blob();

        return {
          success: true,
          data: {
            filename: filename,
            content_type: contentType,
            size: contentLength
              ? Number.parseInt(contentLength, 10)
              : blob.size,
            data: blob,
          },
        };
      } else {
        const errorResponse = await handleApiError(response);
        return {
          success: false,
          error:
            errorResponse.error ||
            `Failed to download file: ${response.status}`,
          status: response.status,
          timestamp: new Date().toISOString(),
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            success: false,
            error: "Request timeout while downloading file",
            status: 408,
            timestamp: new Date().toISOString(),
          };
        }
        return {
          success: false,
          error: `Failed to download file: ${error.message}`,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred while downloading the file",
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Download and save file to user's device
  async downloadAndSaveFile(
    challengeId: number,
    filename: string
  ): Promise<ApiResponse> {
    try {
      const result = await this.downloadChallengeFile(challengeId, filename);

      if (!result.success) {
        return result;
      }

      if (!result.data.data) {
        return {
          success: false,
          error: "No file data received",
          timestamp: new Date().toISOString(),
        };
      }

      // Create download link and trigger download
      const url = URL.createObjectURL(result.data.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.data.filename;

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up the object URL
      URL.revokeObjectURL(url);

      return {
        success: true,
        message: `File "${filename}" downloaded successfully`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: `Failed to download and save file: ${error.message}`,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred while downloading the file",
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Get file information without downloading
  async getFileInfo(
    challengeId: number,
    filename: string
  ): Promise<ApiResponse<Omit<FileDownloadResponse, "data">>> {
    try {
      // Input validation
      if (!challengeId || challengeId <= 0) {
        return {
          success: false,
          error: "Invalid challenge ID provided",
          status: 400,
          timestamp: new Date().toISOString(),
        };
      }

      if (!filename || filename.trim().length === 0) {
        return {
          success: false,
          error: "Filename is required",
          status: 400,
          timestamp: new Date().toISOString(),
        };
      }

      const url = `${API_BASE_URL}/challenges/${challengeId}/files/${encodeURIComponent(
        filename
      )}/info`;
      const response = await fetchWithRetry(url, {
        method: "HEAD", // Use HEAD to get headers without downloading content
      });

      if (response.ok) {
        const contentType =
          response.headers.get("content-type") || "application/octet-stream";
        const contentLength = response.headers.get("content-length");

        return {
          success: true,
          data: {
            filename: filename,
            content_type: contentType,
            size: contentLength ? Number.parseInt(contentLength, 10) : 0,
          },
          status: response.status,
          timestamp: new Date().toISOString(),
        };
      } else {
        return {
          success: false,
          error: "Failed to get file info",
          status: response.status,
          timestamp: new Date().toISOString(),
        } as ApiResponse<Omit<FileDownloadResponse, "data">>;
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            success: false,
            error: "Request timeout while getting file info",
            status: 408,
            timestamp: new Date().toISOString(),
          };
        }
        return {
          success: false,
          error: `Failed to get file info: ${error.message}`,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred while getting file info",
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Utility to format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  },

  // Check if file type is supported/safe
  isSafeFileType(filename: string): boolean {
    const safeExtensions = [
      ".txt",
      ".md",
      ".pdf",
      ".doc",
      ".docx",
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".svg",
      ".zip",
      ".tar",
      ".gz",
      ".7z",
      ".json",
      ".xml",
      ".csv",
      ".yml",
      ".yaml",
    ];

    const extension = filename
      .toLowerCase()
      .substring(filename.lastIndexOf("."));
    return safeExtensions.includes(extension);
  },
};
