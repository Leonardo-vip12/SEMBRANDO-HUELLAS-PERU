# Manual de Despliegue CI/CD y Pipeline Enterprise

## Visión General del Pipeline

El flujo de integración y despliegue continuo (CI/CD) se administra mediante **GitHub Actions** en `.github/workflows/`.

---

## Flujos de Trabajo (Workflows)

### 1. Integración Continua (`ci.yml`)
- **Disparador:** Push o Pull Request a ramas `main`, `develop` o `feature/*`.
- **Acciones:**
  - Linting de código y formato de estilos con `oxlint`, `eslint` y `prettier`.
  - Compilación TypeScript (`tsc`) en Frontend y Backend.
  - Ejecución de la suite de pruebas unitarias.
  - Construcción de verificación de imágenes Docker.

### 2. Despliegue a Staging (`cd-staging.yml`)
- **Disparador:** Merge directo en rama `develop`.
- **Acciones:** Construcción y publicación de imágenes con etiqueta `:staging` en GHCR y despliegue automático en el namespace `sembrando-huellas-staging`.

### 3. Despliegue a Producción (`cd-production.yml`)
- **Disparador:** Merge en rama `main`.
- **Aprobación Manual:** Requiere aprobación explícita en el panel de **GitHub Environments (Production)**.
- **Rollback Automático:** Si las pruebas de disponibilidad (Healthcheck Probes) no responden satisfactoriamente dentro de los primeros 120 segundos post-despliegue, el pipeline ejecuta automáticamente `kubectl rollout undo`.

---

## Procedimiento de Despliegue Manual (Fallbacks)

En caso de indisponibilidad de GitHub Actions, ejecutar el siguiente procedimiento:

```bash
# 1. Construir e etiquetar imágenes
docker build -t ghcr.io/sembrando-huellas/backend:latest ./sembrando-huellas-backend
docker build -t ghcr.io/sembrando-huellas/frontend:latest ./sembrando-huellas

# 2. Enviar a Container Registry
docker push ghcr.io/sembrando-huellas/backend:latest
docker push ghcr.io/sembrando-huellas/frontend:latest

# 3. Aplicar en clúster Kubernetes
kubectl rollout restart deployment/sh-backend -n sembrando-huellas-prod
kubectl rollout restart deployment/sh-frontend -n sembrando-huellas-prod
```
