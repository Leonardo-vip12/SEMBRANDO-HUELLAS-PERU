import axiosInstance from '@/lib/axios';
import type { AxiosRequestConfig } from 'axios';
import type { APIResponse } from '@/types';

export class ApiService {
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await axiosInstance.get<APIResponse<T>>(url, config);
    return response.data;
  }

  static async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await axiosInstance.post<APIResponse<T>>(url, data, config);
    return response.data;
  }

  static async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await axiosInstance.put<APIResponse<T>>(url, data, config);
    return response.data;
  }

  static async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await axiosInstance.patch<APIResponse<T>>(url, data, config);
    return response.data;
  }

  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await axiosInstance.delete<APIResponse<T>>(url, config);
    return response.data;
  }
}
