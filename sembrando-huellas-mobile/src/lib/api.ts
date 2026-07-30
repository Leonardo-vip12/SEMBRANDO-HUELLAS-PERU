import { Platform } from 'react-native';

const BASE_URL = Platform.select({
  web: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  default: process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000',
});

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  token?: string | null;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', headers = {}, body, token } = options;

    const allHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (token) {
      allHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers: allHeaders,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const url = `${this.baseUrl}/api${endpoint}`;
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data ?? data;
  }

  async get<T>(endpoint: string, token?: string | null): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', token });
  }

  async post<T>(endpoint: string, body?: any, token?: string | null): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, token });
  }

  async put<T>(endpoint: string, body?: any, token?: string | null): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, token });
  }

  async patch<T>(endpoint: string, body?: any, token?: string | null): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body, token });
  }

  async delete<T>(endpoint: string, token?: string | null): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', token });
  }

  async upload<T>(endpoint: string, formData: FormData, token?: string | null): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const url = `${this.baseUrl}/api${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data ?? data;
  }
}

export const apiClient = new ApiClient();
