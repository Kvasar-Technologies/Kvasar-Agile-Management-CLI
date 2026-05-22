import { CONFIG } from './config.js';
import { authService } from './auth.js';

export interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Kvasar API Client
 * Handles authenticated requests to Kvasar backend services
 */
export class KvasarClient {
  private baseUrl: string;
  private accessToken?: string; // Optional override

  constructor(accessToken?: string) {
    this.baseUrl = CONFIG.api.baseUrl;
    this.accessToken = accessToken;
  }

  /**
   * Resolve access token to use for request
   */
  private async resolveToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }
    return await authService.getAccessToken();
  }

  /**
   * Make an authenticated request to the Kvasar API
   */
  private async request(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<any> {
    const accessToken = await this.resolveToken();

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}${errorBody ? `: ${errorBody}` : ''}`);
    }

    // Handle no content
    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  // Generic HTTP methods
  get(endpoint: string, options?: RequestOptions) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  patch(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  delete(endpoint: string, options?: RequestOptions) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // Higher-level API methods for common operations
  async getCurrentUser(): Promise<any> {
    return this.get('/api/v1/user/profile');
  }

  async getOrganizations(): Promise<any> {
    return this.get('/api/v1/organizations');
  }

  async getProjects(orgId?: string): Promise<any> {
    const query = orgId ? `?organization_id=${orgId}` : '';
    return this.get(`/api/v1/projects${query}`);
  }

  // Add more specific methods as needed for agile management features
}

export const kvasarClient = new KvasarClient();
