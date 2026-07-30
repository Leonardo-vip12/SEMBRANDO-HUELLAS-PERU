# Arquitectura del Sistema — Sembrando Huellas Perú (Enterprise)

## Resumen Ejecutivo

**Sembrando Huellas Perú** es una plataforma tecnológica integral para la gestión ambiental, reforestación, educación climática y toma de decisiones basadas en inteligencia ambiental. La arquitectura está diseñada bajo patrones de microservicios desacoplados, contenedorizados y orientados a eventos, garantizando alta disponibilidad, tolerancia a fallos y escalabilidad horizontal.

---

## Componentes de la Arquitectura

```mermaid
graph TD
    Client[Clientes Web / Móvil / CMS] --> Ingress[NGINX Ingress Controller / SSL TLS]
    
    subgraph Frontend Tier
        Ingress --> WebSPA[Frontend Web React + Vite]
        Ingress --> CMSPanel[Panel Admin / CMS]
    end

    subgraph API Tier
        Ingress --> BackendAPI[Backend API NestJS Node.js]
    end

    subgraph Data & Storage Tier
        BackendAPI --> PostgreSQL[(PostgreSQL 15 + PostGIS)]
        BackendAPI --> RedisCache[(Redis 7 In-Memory Cache)]
        BackendAPI --> MinIOStorage[(MinIO / S3 Object Storage)]
    end

    subgraph Observability Tier
        BackendAPI --> OpenTelemetry[OpenTelemetry Collector]
        OpenTelemetry --> Jaeger[Jaeger Tracing]
        BackendAPI --> Prometheus[Prometheus Metrics]
        Prometheus --> Grafana[Grafana Dashboards]
        BackendAPI --> Loki[Loki Log Centralizer]
    end
```

### 1. Frontend SPA (`sembrando-huellas`)
- **Tecnología:** React 19, TypeScript 5.5, Vite 8, Tailwind CSS, Framer Motion, TanStack Query, i18next.
- **Función:** Portal público, catálogo interactivo de especies, calculadora de huella de carbono, mapa interactivo GIS, módulos de educación ambiental e integración con el módulo Admin/CMS.

### 2. Backend Enterprise API (`sembrando-huellas-backend`)
- **Tecnología:** NestJS 10, TypeScript 5.5, Prisma ORM 5.18, Express, Helmet, Class-Validator, Throttler.
- **Módulos Principales:**
  - `AuthModule` & `PermissionsModule`: Autenticación JWT, RBAC y auditoría.
  - `EISModule` & `SIAModule`: Intelligence Suite & Sistema Inteligente de Información Ambiental.
  - `AIModule`: Integración con OpenAI, Anthropic Claude y Google Gemini.
  - `ProjectsModule`, `VolunteersModule`, `DonationsModule`: Gestión de impacto social.

### 3. Base de Datos Racional & GIS (`PostgreSQL` + `PostGIS`)
- **Almacenamiento:** Datos relacionales con índices espaciales PostGIS para coordenadas geográficas de zonas de reforestación y especies.

### 4. Caché de Alto Rendimiento (`Redis`)
- **Propósito:** Caché de respuestas de consultas recurrentes, limitación de tasa de peticiones (Rate Limiting) y sesiones activas.

### 5. Almacenamiento de Objetos (`MinIO / S3`)
- **Propósito:** Almacenamiento de imágenes de evidencias, archivos multimedia, documentos públicos y respaldos.
