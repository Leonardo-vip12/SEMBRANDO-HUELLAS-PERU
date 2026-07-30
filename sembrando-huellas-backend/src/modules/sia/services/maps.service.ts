import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SiaMapsService {
  protected logger = new Logger(SiaMapsService.name);

  constructor(private prisma: PrismaService) {}

  async getLayers() {
    const [projects, campaigns, institutions, reforestations, protectedAreas, observations, species, events] =
      await Promise.all([
        this.prisma.project.count({ where: { status: 'PUBLISHED' } }),
        this.prisma.news.count({ where: { status: 'PUBLISHED' } }),
        this.prisma.partner.count({ where: { active: true } }),
        this.prisma.impactMetric.count({ where: { label: { contains: 'árbol' } } }),
        this.prisma.siaGeozone.count({ where: { type: 'protected_area' } }),
        this.prisma.biodiversityObservation.count(),
        this.prisma.species.count(),
        this.prisma.event.count(),
      ]);

    return {
      layers: [
        { id: 'projects', name: 'Proyectos', type: 'point', visible: true, count: projects },
        { id: 'campaigns', name: 'Campañas', type: 'point', visible: true, count: campaigns },
        { id: 'institutions', name: 'Instituciones', type: 'point', visible: false, count: institutions },
        { id: 'reforestations', name: 'Reforestaciones', type: 'point', visible: false, count: reforestations },
        { id: 'protectedAreas', name: 'Áreas Protegidas', type: 'polygon', visible: true, count: protectedAreas },
        { id: 'observations', name: 'Avistamientos', type: 'point', visible: true, count: observations },
        { id: 'species', name: 'Especies', type: 'point', visible: false, count: species },
        { id: 'events', name: 'Eventos', type: 'point', visible: false, count: events },
      ],
    };
  }

  async getLayerData(layer: string, filters?: any) {
    switch (layer) {
      case 'projects': {
        const data = await this.prisma.project.findMany({
          where: { status: 'PUBLISHED', ...(filters?.region ? { region: filters.region } : {}) },
          select: {
            id: true,
            title: true,
            region: true,
            location: true,
            startDate: true,
            status: true,
            coverImage: true,
          },
        });
        return {
          type: 'FeatureCollection',
          features: data.map((p: any) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: this.parseCoords(p.location) },
            properties: {
              id: p.id,
              title: p.title,
              region: p.region,
              date: p.startDate,
              status: p.status,
              image: p.coverImage,
            },
          })),
        };
      }

      case 'observations': {
        const data = await this.prisma.biodiversityObservation.findMany({
          where: {
            ...(filters?.status ? { status: filters.status as any } : {}),
          },
          select: {
            id: true,
            speciesName: true,
            scientificName: true,
            quantity: true,
            latitude: true,
            longitude: true,
            observedAt: true,
            status: true,
          },
          take: 500,
        });
        return {
          type: 'FeatureCollection',
          features: data.map((o: any) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [o.longitude, o.latitude] },
            properties: {
              id: o.id,
              speciesName: o.speciesName,
              scientificName: o.scientificName,
              quantity: o.quantity,
              date: o.observedAt,
              status: o.status,
            },
          })),
        };
      }

      case 'species': {
        const data = await this.prisma.species.findMany({
          where: filters?.category ? { category: filters.category } : {},
          select: {
            id: true,
            name: true,
            scientificName: true,
            category: true,
            conservationStatus: true,
            region: true,
            image: true,
          },
        });
        return {
          type: 'FeatureCollection',
          features: data.map((s: any) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [0, 0] },
            properties: {
              id: s.id,
              name: s.name,
              scientificName: s.scientificName,
              category: s.category,
              conservationStatus: s.conservationStatus,
              region: s.region,
              image: s.image,
            },
          })),
        };
      }

      case 'events': {
        const data = await this.prisma.event.findMany({
          where: { ...(filters?.status ? { status: filters.status as any } : {}) },
          select: { id: true, title: true, location: true, date: true, type: true, status: true, coverImage: true },
          take: 200,
        });
        return {
          type: 'FeatureCollection',
          features: data.map((e: any) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: this.parseCoords(e.location) },
            properties: { id: e.id, title: e.title, date: e.date, type: e.type, status: e.status, image: e.coverImage },
          })),
        };
      }

      case 'protectedAreas': {
        const zones = await this.prisma.siaGeozone.findMany({
          where: { active: true },
          select: { id: true, name: true, type: true, geometry: true, centerLat: true, centerLng: true, color: true },
        });
        return {
          type: 'FeatureCollection',
          features: zones.map((z: any) => ({
            type: 'Feature',
            geometry: z.geometry || {
              type: 'Point',
              coordinates: z.centerLng && z.centerLat ? [z.centerLng, z.centerLat] : [0, 0],
            },
            properties: { id: z.id, name: z.name, type: z.type, color: z.color },
          })),
        };
      }

      case 'campaigns': {
        const data = await this.prisma.news.findMany({
          where: { status: 'PUBLISHED' },
          select: { id: true, title: true, publishedAt: true, coverImage: true },
          take: 200,
        });
        return {
          type: 'FeatureCollection',
          features: data.map((c: any) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [0, 0] },
            properties: { id: c.id, title: c.title, date: c.publishedAt, image: c.coverImage },
          })),
        };
      }

      case 'institutions': {
        const data = await this.prisma.partner.findMany({
          where: { active: true },
          select: { id: true, name: true, type: true, logo: true, description: true },
        });
        return {
          type: 'FeatureCollection',
          features: data.map((p: any) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [0, 0] },
            properties: { id: p.id, name: p.name, type: p.type, logo: p.logo, description: p.description },
          })),
        };
      }

      case 'reforestations': {
        const data = await this.prisma.impactMetric.findMany({
          where: { label: { contains: 'árbol' } },
          select: { id: true, label: true, value: true, year: true, description: true },
        });
        return {
          type: 'FeatureCollection',
          features: data.map((r: any) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [0, 0] },
            properties: { id: r.id, label: r.label, value: r.value, year: r.year, description: r.description },
          })),
        };
      }

      default:
        throw new BadRequestException(`Capa "${layer}" no encontrada`);
    }
  }

  async searchLocation(query: string) {
    const [projects, events, species] = await Promise.all([
      this.prisma.project.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { region: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, region: true, location: true, slug: true },
        take: 5,
      }),
      this.prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, location: true, slug: true },
        take: 5,
      }),
      this.prisma.species.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { scientificName: { contains: query, mode: 'insensitive' } },
            { region: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, scientificName: true, region: true, slug: true },
        take: 5,
      }),
    ]);

    return { projects, events, species };
  }

  async getLegend() {
    return {
      layers: [
        {
          id: 'projects',
          label: 'Proyectos',
          color: '#3b82f6',
          icon: 'briefcase',
        },
        {
          id: 'campaigns',
          label: 'Campañas',
          color: '#f59e0b',
          icon: 'megaphone',
        },
        {
          id: 'institutions',
          label: 'Instituciones',
          color: '#8b5cf6',
          icon: 'building',
        },
        {
          id: 'reforestations',
          label: 'Reforestaciones',
          color: '#10b981',
          icon: 'tree',
        },
        {
          id: 'protectedAreas',
          label: 'Áreas Protegidas',
          color: '#059669',
          icon: 'shield',
        },
        {
          id: 'observations',
          label: 'Avistamientos',
          color: '#ef4444',
          icon: 'eye',
        },
        {
          id: 'species',
          label: 'Especies',
          color: '#ec4899',
          icon: 'paw',
        },
        {
          id: 'events',
          label: 'Eventos',
          color: '#14b8a6',
          icon: 'calendar',
        },
      ],
    };
  }

  private parseCoords(location?: string | null): [number, number] {
    if (!location) return [0, 0];
    const parts = location.split(',').map((s) => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return [parts[1], parts[0]];
    }
    return [0, 0];
  }
}
