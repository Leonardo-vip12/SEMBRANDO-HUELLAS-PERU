# Sembrando Huellas Perú - Backend API

API RESTful empresarial para la plataforma Sembrando Huellas Perú. Construida con NestJS, Prisma ORM, PostgreSQL y Docker.

## Stack

- **Runtime:** Node.js 22+, TypeScript 5.5+
- **Framework:** NestJS 10 + Express
- **ORM:** Prisma 5 con PostgreSQL 16
- **Cache:** Redis 7
- **Storage:** MinIO (S3-compatible)
- **Auth:** JWT (access + refresh tokens), bcrypt
- **Documentación:** Swagger / OpenAPI 3
- **Infra:** Docker + Docker Compose

## Arquitectura

```
src/
  main.ts               # Bootstrap: CORS, Helmet, Compression, Swagger, ValidationPipe
  app.module.ts          # Módulo raíz (22 módulos + guards globales)
  config/                # Configuración centralizada
  prisma/                # PrismaService (singleton global)
  redis/                 # RedisService (caching)
  common/
    guards/              # JwtAuthGuard, RolesGuard, JwtStrategy
    decorators/          # @Public, @Roles, @Permissions, @CurrentUser
    filters/             # AllExceptionsFilter
    interceptors/        # TransformInterceptor
    base/                # BaseCrudService genérico
    dto/                 # PaginationDto, CreateContentDto
    utils/               # generateSlug
  modules/
    auth/        # Login, register, refresh, logout, profile
    users/       # CRUD usuarios + búsqueda por email
    roles/       # CRUD roles + asignación de permisos (RolePermission)
    permissions/ # CRUD permisos
    news/        # CRUD + búsqueda
    categories/  # CRUD
    programs/    # CRUD (title, slug, description, content, coverImage, icon, category, order)
    projects/    # CRUD (title, slug, description, region, location, budget, progress)
    species/     # CRUD (name, scientificName, category, conservationStatus, threats[])
    gallery/     # CRUD + GalleryImage children
    events/      # CRUD (title, date, startTime, endTime, type, capacity)
    resources/   # CRUD (title, description, fileUrl, format, category, icon)
    partners/    # CRUD (name, logo, website, type, active, order)
    volunteers/  # CRUD (name, email, phone, region, skills[], motivation, status)
    faq/         # CRUD (question, answer, category, order, isActive)
    team/        # CRUD (name, role, bio, image, order, isActive)
    testimonials/ # CRUD (author, quote, role, image, isActive)
    organization/ # Singleton (name, mission, vision, logo, socialMedia JSON)
    impact/      # CRUD métricas + summary endpoint
    donations/   # CRUD + stats (donorName, amount, currency, method, status)
    notifications/ # CRUD por usuario + markAsRead + unreadCount
    audit/       # Logging de acciones (CREATE, UPDATE, DELETE, LOGIN, etc.)
    uploads/     # Subida de archivos (multer + persistencia en BBDD)
    dashboard/   # Stats globales + actividad reciente
    analytics/   # Contenido por mes + tendencia de donaciones
    settings/    # Configuraciones clave-valor por grupo
```

## Modelo de Datos (23 tablas)

`users`, `roles`, `permissions`, `role_permissions`, `categories`, `news`, `programs`, `projects`, `species`, `galleries`, `gallery_images`, `events`, `resources`, `partners`, `volunteers`, `faqs`, `team_members`, `testimonials`, `organizations`, `impact_metrics`, `donations`, `settings`, `audit_logs`, `notifications`, `uploads`

## API Endpoints

| Módulo | Prefix | Auth |
|--------|--------|------|
| Auth | `POST /api/v1/auth/login, /register, /refresh, /logout, /profile` | Public / Bearer |
| Users | `GET/POST/PUT/DELETE /api/v1/users` | ADMIN |
| Roles | `GET/POST/PUT/DELETE /api/v1/roles` | ADMIN |
| News | `GET/POST/PUT/DELETE /api/v1/news` | Public / roles |
| Events | `GET/POST/PUT/DELETE /api/v1/events` | Public / roles |
| Donations | `POST /api/v1/donations` (public) + admin CRUD | Mixed |
| Dashboard | `GET /api/v1/dashboard/stats, /recent-activity` | ADMIN |
| ... | (22 módulos en total, ~90 endpoints) | |

## Roles del Sistema

- `ADMINISTRADOR` — Acceso total
- `EDITOR` — Crear/editar contenido
- `REDACCTOR` — Solo crear borradores
- `INVITADO` — Acceso mínimo

## Inicio Rápido

```bash
# 1. Clonar e instalar
cd sembrando-huellas-backend
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 3. Iniciar infraestructura (PostgreSQL + Redis + MinIO)
docker compose up -d

# 4. Ejecutar migraciones y seed
npx prisma migrate dev
npm run prisma:seed

# 5. Iniciar servidor
npm run start:dev
# API: http://localhost:3000/api/v1
# Docs: http://localhost:3000/docs
```

## Variables de Entorno (.env)

```
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

DATABASE_URL=postgresql://user:password@localhost:5432/sembrando_huellas

JWT_SECRET=super-secret-key
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=refresh-secret-key
JWT_REFRESH_EXPIRATION=7d

REDIS_HOST=localhost
REDIS_PORT=6379

MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=uploads

CORS_ORIGIN=http://localhost:5173
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=
SMTP_PASS=
```

## Comandos Útiles

```bash
npm run build          # Compilar a dist/
npm run start:dev      # Desarrollo con watch
npm run start:prod     # Producción
npm run test           # Tests unitarios
npm run test:e2e       # Tests E2E
npm run lint           # ESLint
npm run prisma:studio  # Prisma Studio (GUI BBDD)
npm run prisma:seed    # Poblar base de datos
npm run docker:up      # Iniciar contenedores
```

## Licencia

MIT
