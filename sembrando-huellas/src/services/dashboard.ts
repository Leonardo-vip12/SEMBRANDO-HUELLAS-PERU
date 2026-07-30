import { ApiService } from './api';
import type { APIResponse } from '@/types';

interface DashboardStats {
  totalProjects: number;
  totalVolunteers: number;
  totalDonations: number;
  totalSpecies: number;
  totalNews: number;
  recentDonations: number;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

interface Report {
  id: string;
  title: string;
  type: string;
  generatedAt: string;
  url: string;
}

export class DashboardService {
  static getStats(): Promise<APIResponse<DashboardStats>> {
    return ApiService.get<DashboardStats>('/dashboard/stats');
  }

  static getRecentActivity(): Promise<APIResponse<ActivityItem[]>> {
    return ApiService.get<ActivityItem[]>('/dashboard/activity');
  }

  static getReports(): Promise<APIResponse<Report[]>> {
    return ApiService.get<Report[]>('/dashboard/reports');
  }
}
