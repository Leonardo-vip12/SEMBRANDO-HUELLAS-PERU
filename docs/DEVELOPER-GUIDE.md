# Guía para Nuevos Desarrolladores (Developer Onboarding Guide)

Bienvenido al equipo de desarrollo de **Sembrando Huellas Perú**. Esta guía te ayudará a configurar tu entorno local y entender los estándares de desarrollo.

---

## Prerrequisitos

- Node.js >= 20.x
- Docker Desktop / Docker Engine >= 24.x
- Git >= 2.40

---

## Configuración del Entorno de Desarrollo Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/sembrando-huellas/sembrando-huellas.git
   cd sembrando-huellas
   ```

2. **Levantar los servicios de infraestructura (Postgres, Redis, MinIO):**
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

3. **Iniciar el Backend:**
   ```bash
   cd sembrando-huellas-backend
   npm install
   npx prisma migrate dev
   npm run start:dev
   ```

4. **Iniciar el Frontend Web:**
   ```bash
   cd sembrando-huellas
   npm install
   npm run dev
   ```

---

## Convenciones de Commits (Conventional Commits)

Los mensajes de commit deben seguir el estándar:
- `feat: nueva característica`
- `fix: corrección de error`
- `docs: cambios en documentación`
- `test: adición de pruebas`
- `refactor: refactorización de código sin cambio funcional`

Cualquier commit que no cumpla el formato será rechazado por los hooks de Husky y Commitlint.
