
/**
 * ConfigService - Handles application-wide configuration settings
 * Centralizes the API URL and connection settings
 */

// Default API URL - Using environment variable if available
const DEFAULT_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Configuration object
class ConfigService {
  private apiUrl: string;

  constructor() {
    // Get API URL from localStorage if available, or use environment variable
    this.apiUrl = localStorage.getItem("apiUrl") || DEFAULT_API_URL;
  }

  /**
   * Get the base API URL
   */
  getApiUrl(): string {
    return this.apiUrl;
  }

  /**
   * Set a new API URL
   */
  setApiUrl(url: string): void {
    this.apiUrl = url;
    localStorage.setItem("apiUrl", url);
  }

  /**
   * Reset API URL to default
   */
  resetApiUrl(): void {
    this.apiUrl = DEFAULT_API_URL;
    localStorage.setItem("apiUrl", DEFAULT_API_URL);
  }

  /**
   * Get the full URL for a specific API endpoint
   */
  getEndpointUrl(endpoint: string): string {
    // Make sure the endpoint starts with a slash
    if (!endpoint.startsWith("/")) {
      endpoint = `/${endpoint}`;
    }
    
    return `${this.apiUrl}${endpoint}`;
  }

  /**
   * Get auth headers for authenticated requests
   */
  getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("authToken");
    
    if (token) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
    }
    
    return {
      "Content-Type": "application/json"
    };
  }

  /**
   * Check if we're running in production mode
   */
  isProduction(): boolean {
    return import.meta.env.PROD === true;
  }
}

// Create a singleton instance
const configService = new ConfigService();

export default configService;
