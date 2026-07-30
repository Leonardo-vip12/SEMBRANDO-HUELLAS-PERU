import { ApiService } from './api';
import type { APIResponse } from '@/types';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
  status: string;
}

interface VolunteerRegisterPayload {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
}

interface VolunteerApplyPayload {
  volunteerId: string;
  projectId: string;
  message: string;
}

export class VolunteersService {
  static getAll(): Promise<APIResponse<Volunteer[]>> {
    return ApiService.get<Volunteer[]>('/volunteers');
  }

  static getById(id: string): Promise<APIResponse<Volunteer>> {
    return ApiService.get<Volunteer>(`/volunteers/${id}`);
  }

  static register(payload: VolunteerRegisterPayload): Promise<APIResponse<Volunteer>> {
    return ApiService.post<Volunteer>('/volunteers', payload);
  }

  static apply(payload: VolunteerApplyPayload): Promise<APIResponse<null>> {
    return ApiService.post<null>('/volunteers/apply', payload);
  }
}
