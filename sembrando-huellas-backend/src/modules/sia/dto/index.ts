export class SiaDashboardQueryDto {
  startDate?: string;
  endDate?: string;
  region?: string;
  institution?: string;
  projectId?: string;
}

export class SiaIndicatorDto {
  name: string;
  slug: string;
  description?: string;
  category: 'EDUCACION' | 'AMBIENTAL' | 'SOCIAL' | 'ECONOMICO' | 'PARTICIPACION' | 'CONSERVACION';
  unit?: string;
  formula?: string;
  source?: string;
  target?: number;
  current?: number;
  year?: number;
  region?: string;
  institution?: string;
}

export class SiaIndicatorRecordDto {
  value: number;
  date: string;
  region?: string;
  institution?: string;
}

export class SiaAlertRuleDto {
  name: string;
  description?: string;
  condition: string;
  threshold: number;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  channel?: string;
  cooldown?: number;
  indicatorId?: string;
}

export class SiaReportDto {
  title: string;
  type: 'INSTITUCIONAL' | 'CAMPANA' | 'PROYECTO' | 'EDUCATIVO' | 'BIODIVERSIDAD';
  description?: string;
  format?: 'PDF' | 'EXCEL' | 'CSV';
  filters?: Record<string, any>;
}

export class SiaGeozoneDto {
  name: string;
  type?: string;
  description?: string;
  geometry?: Record<string, any>;
  centerLat?: number;
  centerLng?: number;
  color?: string;
}

export class SiaDatasetDto {
  title: string;
  slug: string;
  description?: string;
  category?: string;
  source?: string;
  format?: string;
  visibility?: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED';
}

export class SiaCitizenObservationQueryDto {
  page?: number;
  limit?: number;
  status?: string;
  speciesName?: string;
  region?: string;
  assignedTo?: string;
  startDate?: string;
  endDate?: string;
}

export class SiaCitizenObservationReviewDto {
  status: 'VALIDATED' | 'APPROVED' | 'REJECTED' | 'NEEDS_CORRECTION';
  comments?: string;
  assignedTo?: string;
}

export class SiaComparatorQueryDto {
  type: 'region' | 'institution' | 'campaign' | 'project' | 'period';
  ids?: string[];
  indicatorId?: string;
  startDate?: string;
  endDate?: string;
}

export class SiaAiReportDto {
  type: string;
  startDate?: string;
  endDate?: string;
  region?: string;
  indicators?: string[];
  includeCharts?: boolean;
}
