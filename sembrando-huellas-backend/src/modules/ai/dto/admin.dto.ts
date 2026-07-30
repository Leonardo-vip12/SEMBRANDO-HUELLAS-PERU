import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AIProviderType } from '../providers/ai-provider.interface';

export class AiAdminStatsDto {
  totalQueries: number;
  totalTokens: number;
  totalCost: number;
  queriesByProvider: Record<string, number>;
  tokensByProvider: Record<string, number>;
  costByProvider: Record<string, number>;
  averageLatency: number;
  topModels: Array<{ model: string; count: number }>;
  errorsLast24h: number;
  activeUsers24h: number;
}

export class AiQueryLogDto {
  id: string;
  feature: string;
  query: string;
  provider: string;
  model: string;
  tokensUsed: number;
  cost: number;
  latencyMs: number;
  success: boolean;
  userId?: string;
  createdAt: Date;
}

export class AiConfigUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxTokens?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  costLimit?: number;
}
