# SIA - Sistema Inteligente de Información Ambiental

## Arquitectura General

```
                    ┌──────────────────────────────────┐
                    │         Frontend Web              │
                    │   (React + Vite + Tailwind)       │
                    │   /transparencia (público)        │
                    │   /admin/sia/* (admin)             │
                    └──────────┬───────────────────────┘
                               │ HTTP (Axios)
                    ┌──────────▼───────────────────────┐
                    │     API Gateway /sia/*            │
                    │   NestJS Controller               │
                    │   35+ endpoints                   │
                    └──────────┬───────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
   │   Servicios  │   │   Servicios  │   │   Servicios  │
   │   Módulo 1-7 │   │  Módulo 8-14 │   │  Externos    │
   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
          │                  │                   │
          └──────────────────┼───────────────────┘
                             ▼
                    ┌──────────────────┐
                    │   Prisma ORM     │
                    │   PostgreSQL     │
                    └──────────────────┘
```

## Estructura de Archivos

### Backend (`sembrando-huellas-backend/src/modules/sia/`)

```
sia/
├── sia.module.ts              # Registro de 14 servicios
├── sia.controller.ts          # 60+ endpoints
├── dto/
│   └── index.ts               # DTOs para todos los módulos
└── services/
    ├── dashboard.service.ts   # Módulo 1: Dashboard Ejecutivo
    ├── biodiversity.service.ts # Módulo 2: Observatorio Biodiversidad
    ├── maps.service.ts        # Módulo 3: Mapas Temáticos
    ├── analytics.service.ts   # Módulo 4: Análisis Estadístico
    ├── reports.service.ts     # Módulo 5: Reportes
    ├── indicators.service.ts  # Módulo 6: Indicadores
    ├── citizen-science.service.ts # Módulo 7: Ciencia Ciudadana
    ├── alerts.service.ts      # Módulo 8: Alertas
    ├── comparator.service.ts  # Módulo 9: Comparador
    ├── data-center.service.ts # Módulo 10: Centro de Datos
    ├── geospatial.service.ts  # Módulo 11: Analítica Geoespacial
    ├── ai-reports.service.ts  # Módulo 12: Informes con IA
    ├── transparency.service.ts # Módulo 13: Transparencia
    └── monitoring.service.ts  # Módulo 14: Monitoreo
```

### Frontend (`sembrando-huellas/src/features/sia/`)

```
sia/
├── pages/
│   ├── SiaLandingPage.tsx         # Landing principal (14 módulos)
│   ├── SiaDashboardPage.tsx       # Dashboard Ejecutivo
│   ├── SiaBiodiversityPage.tsx    # Observatorio Biodiversidad
│   ├── SiaMapsPage.tsx            # Mapas Temáticos
│   ├── SiaAnalyticsPage.tsx       # Análisis Estadístico
│   ├── SiaReportsPage.tsx         # Reportes
│   ├── SiaIndicatorsPage.tsx      # Indicadores
│   ├── SiaCitizenSciencePage.tsx  # Ciencia Ciudadana
│   ├── SiaAlertsPage.tsx          # Alertas
│   ├── SiaComparatorPage.tsx      # Comparador
│   ├── SiaDataCenterPage.tsx      # Centro de Datos
│   ├── SiaGeospatialPage.tsx      # Analítica Geoespacial
│   ├── SiaAiReportsPage.tsx       # Informes con IA
│   ├── SiaTransparencyPage.tsx    # Transparencia
│   └── SiaMonitoringPage.tsx      # Monitoreo
├── components/                    # Componentes compartidos
└── services/
    └── sia.ts                     # SiaService (todos los endpoints)
```

## Modelos de Datos (Prisma)

| Modelo | Tabla | Propósito |
|--------|-------|-----------|
| `SiaIndicator` | `sia_indicators` | Indicadores configurables con target, categoría, fórmula |
| `SiaIndicatorRecord` | `sia_indicator_records` | Series temporales de valores de indicadores |
| `SiaAlertRule` | `sia_alert_rules` | Reglas de alerta con umbrales y condiciones |
| `SiaAlertLog` | `sia_alert_logs` | Registros de alertas disparadas |
| `SiaReport` | `sia_reports` | Reportes generados (PDF/Excel/CSV) |
| `SiaGeozone` | `sia_geozones` | Zonas geográficas con geometría (preparado PostGIS) |
| `SiaDataset` | `sia_datasets` | Conjuntos de datos abiertos |
| `SiaCitizenObservation` | `sia_citizen_observations` | Observaciones de ciencia ciudadana con revisión |
| `SiaMonitoringLog` | `sia_monitoring_logs` | Logs de monitoreo del sistema |

## Endpoints por Módulo

### Módulo 1: Dashboard Ejecutivo
- `GET /sia/dashboard` - Indicadores clave con filtros
- `GET /sia/dashboard/time-series` - Series temporales

### Módulo 2: Observatorio de Biodiversidad
- `GET /sia/biodiversity/species-distribution` - Distribución de especies
- `GET /sia/biodiversity/timeline` - Línea de tiempo
- `GET /sia/biodiversity/historical` - Registros históricos (paginado)
- `GET /sia/biodiversity/conservation-status` - Estado de conservación
- `GET /sia/biodiversity/temporal-comparison` - Comparación entre años
- `GET /sia/biodiversity/map-data` - Datos para mapa

### Módulo 3: Mapas Temáticos
- `GET /sia/maps/layers` - Capas disponibles
- `GET /sia/maps/layers/:layer` - Datos de capa
- `GET /sia/maps/search` - Búsqueda geográfica
- `GET /sia/maps/legend` - Leyenda

### Módulo 4: Análisis Estadístico
- `GET /sia/analytics/line` - Gráfico de líneas
- `GET /sia/analytics/bar` - Gráfico de barras
- `GET /sia/analytics/pie` - Gráfico de pastel
- `GET /sia/analytics/radar` - Gráfico radar
- `GET /sia/analytics/heatmap` - Mapa de calor
- `GET /sia/analytics/accumulated` - Indicadores acumulados

### Módulo 5: Reportes
- `POST /sia/reports` - Generar reporte
- `GET /sia/reports` - Listar reportes
- `GET /sia/reports/:id` - Obtener reporte
- `DELETE /sia/reports/:id` - Eliminar reporte
- `GET /sia/reports/stats` - Estadísticas

### Módulo 6: Indicadores
- CRUD: `POST/GET/PATCH/DELETE /sia/indicators[/:id]`
- `GET /sia/indicators/categories` - Categorías
- `GET /sia/indicators/summary` - Resumen
- `POST /sia/indicators/:id/records` - Agregar registro
- `GET /sia/indicators/:id/records` - Registros

### Módulo 7: Ciencia Ciudadana
- `GET /sia/citizen-science` - Listar observaciones
- `GET /sia/citizen-science/:id` - Detalle
- `PATCH /sia/citizen-science/:id/review` - Revisar/validar
- `POST /sia/citizen-science/:id/assign` - Asignar especialista
- `GET /sia/citizen-science/stats` - Estadísticas
- `GET /sia/citizen-science/:id/history` - Historial revisión

### Módulo 8: Alertas
- CRUD: `POST/GET/PATCH/DELETE /sia/alerts/rules[/:id]`
- `GET /sia/alerts/logs` - Registros de alertas
- `POST /sia/alerts/logs/:id/read` - Marcar leída
- `POST /sia/alerts/logs/read-all` - Marcar todas leídas
- `POST /sia/alerts/check` - Verificar umbrales
- `GET /sia/alerts/stats` - Estadísticas

### Módulo 9: Comparador
- `POST /sia/comparator` - Comparar entidades
- `GET /sia/comparator/chart` - Datos para gráfico

### Módulo 10: Centro de Datos
- CRUD: `POST/GET/PATCH/DELETE /sia/data-center/datasets[/:id]`
- `GET /sia/data-center/metadata` - Metadatos
- `GET /sia/data-center/time-series` - Series temporales
- `GET /sia/data-center/open-data` - Catálogo datos abiertos

### Módulo 11: Analítica Geoespacial
- CRUD: `POST/GET/PATCH/DELETE /sia/geospatial/zones[/:id]`
- `GET /sia/geospatial/clustering` - Agrupación puntos
- `GET /sia/geospatial/density` - Densidad
- `POST /sia/geospatial/query` - Consulta espacial
- `POST /sia/geospatial/buffer` - Análisis buffer

### Módulo 12: Informes con IA
- `POST /sia/ai-reports/summary` - Resumen IA (incluye disclaimer)
- `POST /sia/ai-reports/trends` - Detectar tendencias
- `POST /sia/ai-reports/draft` - Borrador informe
- `POST /sia/ai-reports/explain-chart` - Explicar gráfico
- `POST /sia/ai-reports/suggest-actions` - Sugerir acciones

### Módulo 13: Transparencia (público)
- `GET /sia/transparency/indicators` - Indicadores públicos
- `GET /sia/transparency/projects` - Proyectos
- `GET /sia/transparency/impact` - Impacto
- `GET /sia/transparency/documents` - Documentos
- `GET /sia/transparency/open-stats` - Estadísticas abiertas
- `GET /sia/transparency/downloads` - Datos descargables

### Módulo 14: Monitoreo
- `GET /sia/monitoring/status` - Estado del sistema
- `GET /sia/monitoring/sync` - Sincronización
- `GET /sia/monitoring/services` - Servicios activos
- `GET /sia/monitoring/queues` - Colas
- `GET /sia/monitoring/processes` - Procesos
- `GET /sia/monitoring/errors` - Errores
- `GET /sia/monitoring/resources` - Recursos
- `POST /GET /sia/monitoring/logs` - Logs de monitoreo

## Indicadores (Módulo 6)

### Categorías
- `EDUCACION` - Cobertura educativa, estudiantes, docentes
- `AMBIENTAL` - Árboles, especies, conservación
- `SOCIAL` - Participación ciudadana, voluntariado
- `ECONOMICO` - Donaciones, presupuesto
- `PARTICIPACION` - Eventos, campañas
- `CONSERVACION` - Áreas protegidas, especies amenazadas

### Campos
- `name`, `slug`, `description`, `category`, `unit`
- `formula` - Cálculo del indicador
- `source` - Fuente de datos
- `target` - Valor objetivo
- `current` - Valor actual
- `year`, `region`, `institution` - Dimensiones

## Alertas (Módulo 8)

### Condiciones soportadas
- `GT` - Mayor que ( > )
- `LT` - Menor que ( < )
- `GTE` - Mayor o igual ( >= )
- `LTE` - Menor o igual ( <= )
- `EQ` - Igual ( = )

### Severidad
- `LOW` - Informativo
- `MEDIUM` - Advertencia
- `HIGH` - Importante
- `CRITICAL` - Crítico

## Seguridad

- Roles requeridos en endpoints de escritura: `ADMINISTRADOR`, `EDITOR`
- Endpoints de transparencia (Módulo 13) son públicos (`@Public()`)
- Registro de auditoría mediante audit logs existentes
- Datos sensibles protegidos por los guards de NestJS

## Integración con IA (Módulo 12)

- Los endpoints de IA incluyen disclaimer automático en respuestas
- `generateSummary()` - Preparado para conectar con AiService
- Todos los informes generados por IA incluyen:
  ```
  "disclaimer": "Este informe ha sido generado por inteligencia artificial y
   requiere revisión humana antes de su publicación oficial."
  ```

## Preparación Geoespacial

- Modelo `SiaGeozone` con campo `geometry` (JSON) preparado para PostGIS
- Consultas espaciales: `intersects`, `within`, `near`
- Análisis de buffer con radio configurable
- Agrupación de puntos por cuadrícula (clustering)
- Compatibilidad futura con extensiones PostGIS

## Rendimiento

- Lazy Loading en componentes de frontend (React.lazy)
- Paginación en todos los listados (page/limit)
- Caché mediante Redis (configurado en infraestructura existente)
- Consultas optimizadas con índices de Prisma

## Rutas Frontend

### Públicas
- `/transparencia` - Portal de transparencia pública

### Admin (`/admin`)
- `/admin/sia` - Landing SIA
- `/admin/sia/dashboard` - Dashboard Ejecutivo
- `/admin/sia/biodiversidad` - Observatorio
- `/admin/sia/mapas` - Mapas Temáticos
- `/admin/sia/analitica` - Análisis Estadístico
- `/admin/sia/reportes` - Reportes
- `/admin/sia/indicadores` - Indicadores
- `/admin/sia/ciencia-ciudadana` - Ciencia Ciudadana
- `/admin/sia/alertas` - Alertas
- `/admin/sia/comparador` - Comparador
- `/admin/sia/centro-datos` - Centro de Datos
- `/admin/sia/geoespacial` - Geoespacial
- `/admin/sia/informes-ia` - Informes con IA
- `/admin/sia/transparencia` - Transparencia
- `/admin/sia/monitoreo` - Monitoreo
