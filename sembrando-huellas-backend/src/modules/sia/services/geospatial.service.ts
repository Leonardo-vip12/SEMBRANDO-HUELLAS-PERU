import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';

@Injectable()
export class SiaGeospatialService {
  protected logger = new Logger(SiaGeospatialService.name);

  constructor(
    private prisma: PrismaService,
    private aiService?: AiService,
  ) {}

  async createZone(dto: {
    name: string;
    type?: string;
    description?: string;
    geometry?: any;
    centerLat?: number;
    centerLng?: number;
    color?: string;
  }) {
    try {
      const zone = await (this.prisma as any).siaGeozone.create({
        data: {
          name: dto.name,
          type: dto.type || 'polygon',
          description: dto.description,
          geometry: dto.geometry || undefined,
          centerLat: dto.centerLat,
          centerLng: dto.centerLng,
          color: dto.color || '#3388ff',
        },
      });
      this.logger.log(`Geozone created: ${zone.name}`);
      return zone;
    } catch (error) {
      this.logger.error(`Error creating geozone: ${(error as Error).message}`);
      throw error;
    }
  }

  async updateZone(id: string, dto: any) {
    const existing = await (this.prisma as any).siaGeozone.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Zona geoespacial con ID "${id}" no encontrada`);
    try {
      return await (this.prisma as any).siaGeozone.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      this.logger.error(`Error updating geozone ${id}: ${(error as Error).message}`);
      throw error;
    }
  }

  async findAllZones(type?: string, active?: boolean) {
    const where: any = {};
    if (type) where.type = type;
    if (active !== undefined) where.active = active;
    try {
      return await (this.prisma as any).siaGeozone.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Error listing geozones: ${(error as Error).message}`);
      throw error;
    }
  }

  async findZone(id: string) {
    const zone = await (this.prisma as any).siaGeozone.findUnique({ where: { id } });
    if (!zone) throw new NotFoundException(`Zona geoespacial con ID "${id}" no encontrada`);
    return zone;
  }

  async deleteZone(id: string) {
    const existing = await (this.prisma as any).siaGeozone.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Zona geoespacial con ID "${id}" no encontrada`);
    try {
      await (this.prisma as any).siaGeozone.delete({ where: { id } });
      this.logger.log(`Geozone deleted: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting geozone ${id}: ${(error as Error).message}`);
      throw error;
    }
  }

  async getPointClustering(
    layer: string,
    zoom?: number,
    bounds?: { north: number; south: number; east: number; west: number },
  ) {
    try {
      let data: any[] = [];
      switch (layer) {
        case 'observations':
          data = await (this.prisma as any).siaCitizenObservation.findMany({
            where: bounds
              ? {
                  latitude: { gte: bounds.south, lte: bounds.north },
                  longitude: { gte: bounds.west, lte: bounds.east },
                }
              : {},
            select: { id: true, latitude: true, longitude: true, speciesName: true, status: true },
          });
          break;
        case 'monitoring':
          data = await (this.prisma as any).siaMonitoringLog.findMany({
            where: bounds
              ? {
                  latitude: { gte: bounds.south, lte: bounds.north },
                  longitude: { gte: bounds.west, lte: bounds.east },
                }
              : {},
            select: { id: true, latitude: true, longitude: true, service: true, status: true },
          });
          break;
        default:
          data = await (this.prisma as any).siaGeozone.findMany({
            select: { id: true, centerLat: true, centerLng: true, name: true, type: true },
          });
      }

      const gridSize = zoom ? Math.max(1, 10 - zoom) : 5;
      const clusters: Record<string, { lat: number; lng: number; count: number; items: any[] }> = {};

      for (const item of data) {
        const lat = item.latitude || item.centerLat;
        const lng = item.longitude || item.centerLng;
        if (lat == null || lng == null) continue;
        const latKey = Math.round(lat * gridSize) / gridSize;
        const lngKey = Math.round(lng * gridSize) / gridSize;
        const key = `${latKey},${lngKey}`;
        if (!clusters[key]) {
          clusters[key] = { lat: latKey, lng: lngKey, count: 0, items: [] };
        }
        clusters[key].count++;
        clusters[key].items.push(item);
      }

      return {
        layer,
        zoom: zoom || null,
        bounds: bounds || null,
        clusters: Object.values(clusters).map((c) => ({
          latitude: c.lat,
          longitude: c.lng,
          count: c.count,
          points: c.items,
        })),
        totalPoints: data.length,
      };
    } catch (error) {
      this.logger.error(`Error getting point clustering: ${(error as Error).message}`);
      throw error;
    }
  }

  async getDensityHeatmap(layer: string, region?: string) {
    try {
      let data: any[] = [];
      const where: any = {};
      if (region) where.region = region;

      switch (layer) {
        case 'observations':
          data = await (this.prisma as any).siaCitizenObservation.findMany({
            where,
            select: { latitude: true, longitude: true, speciesName: true },
          });
          break;
        case 'monitoring':
          data = await (this.prisma as any).siaMonitoringLog.findMany({
            where,
            select: { latitude: true, longitude: true, service: true },
          });
          break;
        default:
          throw new BadRequestException(`Capa "${layer}" no soportada para densidad`);
      }

      const points = data
        .filter((d: any) => d.latitude != null && d.longitude != null)
        .map((d: any) => ({ lat: d.latitude, lng: d.longitude, weight: 1 }));

      return {
        layer,
        region: region || null,
        points,
        totalPoints: points.length,
        maxIntensity: points.length > 0 ? 1 : 0,
        config: {
          radius: 25,
          blur: 15,
          gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' },
        },
      };
    } catch (error) {
      this.logger.error(`Error getting density heatmap: ${(error as Error).message}`);
      throw error;
    }
  }

  async getSpatialQuery(layer: string, type: 'intersects' | 'within' | 'near', geometry: any) {
    try {
      const zoneIds = await (this.prisma as any).siaGeozone.findMany({
        where: {},
        select: { id: true, name: true, geometry: true, centerLat: true, centerLng: true },
      });

      let results: any[] = [];
      switch (layer) {
        case 'observations':
          results = await (this.prisma as any).siaCitizenObservation.findMany({
            where: {},
            select: { id: true, latitude: true, longitude: true, speciesName: true, status: true },
          });
          break;
        case 'zones':
          results = zoneIds;
          break;
        default:
          results = await (this.prisma as any).siaGeozone.findMany({
            select: { id: true, name: true, centerLat: true, centerLng: true, type: true },
          });
      }

      return {
        layer,
        queryType: type,
        geometry,
        results,
        total: results.length,
        note: 'PostGIS spatial queries pending integration - returning basic filtered results',
      };
    } catch (error) {
      this.logger.error(`Error in spatial query: ${(error as Error).message}`);
      throw error;
    }
  }

  async getBufferAnalysis(layer: string, center: { lat: number; lng: number }, radiusKm: number) {
    try {
      const lat = center.lat;
      const lng = center.lng;
      const latDelta = radiusKm / 111.32;
      const lngDelta = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));

      const bounds = {
        north: lat + latDelta,
        south: lat - latDelta,
        east: lng + lngDelta,
        west: lng - lngDelta,
      };

      let features: any[] = [];
      switch (layer) {
        case 'observations':
          features = await (this.prisma as any).siaCitizenObservation.findMany({
            where: {
              latitude: { gte: bounds.south, lte: bounds.north },
              longitude: { gte: bounds.west, lte: bounds.east },
            },
            select: { id: true, latitude: true, longitude: true, speciesName: true, status: true },
          });
          break;
        case 'zones':
          features = await (this.prisma as any).siaGeozone.findMany({
            select: { id: true, name: true, centerLat: true, centerLng: true, type: true },
          });
          break;
        default:
          features = await (this.prisma as any).siaMonitoringLog.findMany({
            where: {
              latitude: { gte: bounds.south, lte: bounds.north },
              longitude: { gte: bounds.west, lte: bounds.east },
            },
            select: { id: true, latitude: true, longitude: true, service: true, status: true },
          });
      }

      return {
        layer,
        center: { latitude: lat, longitude: lng },
        radiusKm,
        bounds,
        features,
        totalFeatures: features.length,
      };
    } catch (error) {
      this.logger.error(`Error in buffer analysis: ${(error as Error).message}`);
      throw error;
    }
  }
}
