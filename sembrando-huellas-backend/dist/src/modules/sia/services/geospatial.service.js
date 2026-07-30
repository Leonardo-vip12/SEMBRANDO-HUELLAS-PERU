"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SiaGeospatialService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiaGeospatialService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const ai_service_1 = require("../../ai/ai.service");
let SiaGeospatialService = SiaGeospatialService_1 = class SiaGeospatialService {
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
        this.logger = new common_1.Logger(SiaGeospatialService_1.name);
    }
    async createZone(dto) {
        try {
            const zone = await this.prisma.siaGeozone.create({
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
        }
        catch (error) {
            this.logger.error(`Error creating geozone: ${error.message}`);
            throw error;
        }
    }
    async updateZone(id, dto) {
        const existing = await this.prisma.siaGeozone.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException(`Zona geoespacial con ID "${id}" no encontrada`);
        try {
            return await this.prisma.siaGeozone.update({
                where: { id },
                data: dto,
            });
        }
        catch (error) {
            this.logger.error(`Error updating geozone ${id}: ${error.message}`);
            throw error;
        }
    }
    async findAllZones(type, active) {
        const where = {};
        if (type)
            where.type = type;
        if (active !== undefined)
            where.active = active;
        try {
            return await this.prisma.siaGeozone.findMany({
                where,
                orderBy: { createdAt: 'desc' },
            });
        }
        catch (error) {
            this.logger.error(`Error listing geozones: ${error.message}`);
            throw error;
        }
    }
    async findZone(id) {
        const zone = await this.prisma.siaGeozone.findUnique({ where: { id } });
        if (!zone)
            throw new common_1.NotFoundException(`Zona geoespacial con ID "${id}" no encontrada`);
        return zone;
    }
    async deleteZone(id) {
        const existing = await this.prisma.siaGeozone.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException(`Zona geoespacial con ID "${id}" no encontrada`);
        try {
            await this.prisma.siaGeozone.delete({ where: { id } });
            this.logger.log(`Geozone deleted: ${id}`);
        }
        catch (error) {
            this.logger.error(`Error deleting geozone ${id}: ${error.message}`);
            throw error;
        }
    }
    async getPointClustering(layer, zoom, bounds) {
        try {
            let data = [];
            switch (layer) {
                case 'observations':
                    data = await this.prisma.siaCitizenObservation.findMany({
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
                    data = await this.prisma.siaMonitoringLog.findMany({
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
                    data = await this.prisma.siaGeozone.findMany({
                        select: { id: true, centerLat: true, centerLng: true, name: true, type: true },
                    });
            }
            const gridSize = zoom ? Math.max(1, 10 - zoom) : 5;
            const clusters = {};
            for (const item of data) {
                const lat = item.latitude || item.centerLat;
                const lng = item.longitude || item.centerLng;
                if (lat == null || lng == null)
                    continue;
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
        }
        catch (error) {
            this.logger.error(`Error getting point clustering: ${error.message}`);
            throw error;
        }
    }
    async getDensityHeatmap(layer, region) {
        try {
            let data = [];
            const where = {};
            if (region)
                where.region = region;
            switch (layer) {
                case 'observations':
                    data = await this.prisma.siaCitizenObservation.findMany({
                        where,
                        select: { latitude: true, longitude: true, speciesName: true },
                    });
                    break;
                case 'monitoring':
                    data = await this.prisma.siaMonitoringLog.findMany({
                        where,
                        select: { latitude: true, longitude: true, service: true },
                    });
                    break;
                default:
                    throw new common_1.BadRequestException(`Capa "${layer}" no soportada para densidad`);
            }
            const points = data
                .filter((d) => d.latitude != null && d.longitude != null)
                .map((d) => ({ lat: d.latitude, lng: d.longitude, weight: 1 }));
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
        }
        catch (error) {
            this.logger.error(`Error getting density heatmap: ${error.message}`);
            throw error;
        }
    }
    async getSpatialQuery(layer, type, geometry) {
        try {
            const zoneIds = await this.prisma.siaGeozone.findMany({
                where: {},
                select: { id: true, name: true, geometry: true, centerLat: true, centerLng: true },
            });
            let results = [];
            switch (layer) {
                case 'observations':
                    results = await this.prisma.siaCitizenObservation.findMany({
                        where: {},
                        select: { id: true, latitude: true, longitude: true, speciesName: true, status: true },
                    });
                    break;
                case 'zones':
                    results = zoneIds;
                    break;
                default:
                    results = await this.prisma.siaGeozone.findMany({
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
        }
        catch (error) {
            this.logger.error(`Error in spatial query: ${error.message}`);
            throw error;
        }
    }
    async getBufferAnalysis(layer, center, radiusKm) {
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
            let features = [];
            switch (layer) {
                case 'observations':
                    features = await this.prisma.siaCitizenObservation.findMany({
                        where: {
                            latitude: { gte: bounds.south, lte: bounds.north },
                            longitude: { gte: bounds.west, lte: bounds.east },
                        },
                        select: { id: true, latitude: true, longitude: true, speciesName: true, status: true },
                    });
                    break;
                case 'zones':
                    features = await this.prisma.siaGeozone.findMany({
                        select: { id: true, name: true, centerLat: true, centerLng: true, type: true },
                    });
                    break;
                default:
                    features = await this.prisma.siaMonitoringLog.findMany({
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
        }
        catch (error) {
            this.logger.error(`Error in buffer analysis: ${error.message}`);
            throw error;
        }
    }
};
exports.SiaGeospatialService = SiaGeospatialService;
exports.SiaGeospatialService = SiaGeospatialService = SiaGeospatialService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], SiaGeospatialService);
//# sourceMappingURL=geospatial.service.js.map