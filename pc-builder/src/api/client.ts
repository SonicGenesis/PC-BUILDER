const API_KEY = 'pc-components-api-key-2025';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

export const apiClient = {
  /**
   * Make a GET request to the API
   */
  get: async <T>(endpoint: string, requiresAuth = false, params?: Record<string, string>): Promise<ApiResponse<T>> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    };
    
    if (requiresAuth) {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required');
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add query parameters if provided
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }
    
    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return response.json();
  },
  
  /**
   * Make a POST request to the API
   */
  post: async <T>(endpoint: string, data: any, requiresAuth = false): Promise<ApiResponse<T>> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    };
    
    if (requiresAuth) {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required');
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return response.json();
  },
  
  /**
   * Make a PUT request to the API
   */
  put: async <T>(endpoint: string, data: any, requiresAuth = false): Promise<ApiResponse<T>> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    };
    
    if (requiresAuth) {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required');
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return response.json();
  },
  
  /**
   * Make a DELETE request to the API
   */
  delete: async <T>(endpoint: string, requiresAuth = false): Promise<ApiResponse<T>> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    };
    
    if (requiresAuth) {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required');
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return response.json();
  }
}; 