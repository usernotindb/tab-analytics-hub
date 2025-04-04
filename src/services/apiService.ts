
import configService from "./configService";
import { toast } from "sonner";

/**
 * APIService - Handles communication with the backend API
 * Provides standardized methods for all HTTP requests
 */
class APIService {
  /**
   * Make a GET request to the API
   */
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = configService.getEndpointUrl(endpoint);
    const headers = configService.getAuthHeaders();
    
    const response = await fetch(url, {
      method: "GET",
      headers,
      ...options
    });
    
    return this.handleResponse<T>(response);
  }
  
  /**
   * Make a POST request to the API
   */
  async post<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    const url = configService.getEndpointUrl(endpoint);
    const headers = configService.getAuthHeaders();
    
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      ...options
    });
    
    return this.handleResponse<T>(response);
  }
  
  /**
   * Make a PUT request to the API
   */
  async put<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    const url = configService.getEndpointUrl(endpoint);
    const headers = configService.getAuthHeaders();
    
    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
      ...options
    });
    
    return this.handleResponse<T>(response);
  }
  
  /**
   * Make a DELETE request to the API
   */
  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = configService.getEndpointUrl(endpoint);
    const headers = configService.getAuthHeaders();
    
    const response = await fetch(url, {
      method: "DELETE",
      headers,
      ...options
    });
    
    return this.handleResponse<T>(response);
  }
  
  /**
   * Handle the API response, including error cases
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Parse the JSON response
    const data = await response.json();
    
    // Handle successful responses
    if (response.ok) {
      return data as T;
    }
    
    // Handle error responses
    const errorMessage = data.message || "An error occurred";
    
    // Show a toast message for the error
    toast.error(errorMessage);
    
    // Handle authentication errors
    if (response.status === 401) {
      // Clear auth token and redirect to login
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    
    // Throw an error to be caught by the caller
    throw new Error(errorMessage);
  }
}

// Create a singleton instance
const apiService = new APIService();

export default apiService;
