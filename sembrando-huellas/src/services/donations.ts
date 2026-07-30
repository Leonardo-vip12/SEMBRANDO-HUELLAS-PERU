import { ApiService } from './api';
import type { APIResponse } from '@/types';

interface Donation {
  id: string;
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  message: string;
  status: string;
  createdAt: string;
}

interface CreateDonationPayload {
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  message?: string;
}

export class DonationsService {
  static createDonation(payload: CreateDonationPayload): Promise<APIResponse<Donation>> {
    return ApiService.post<Donation>('/donations', payload);
  }

  static getDonationById(id: string): Promise<APIResponse<Donation>> {
    return ApiService.get<Donation>(`/donations/${id}`);
  }

  static getDonationHistory(): Promise<APIResponse<Donation[]>> {
    return ApiService.get<Donation[]>('/donations/history');
  }
}
