# Guía de Infraestructura y Contenedorización

## Estrategia de Contenedores

La plataforma utiliza **Docker** y **Kubernetes** para el empaquetado y orquestación de servicios. Todos los contenedores siguen las mejores prácticas del estándar OCI (Open Container Initiative).

---

## Archivos de Docker y Composición

### 1. Entorno de Desarrollo (`docker-compose.dev.yml`)
Inicia la base de datos PostgreSQL/PostGIS, Redis, MinIO y los servicios con soporte de cambio en caliente (Hot Reloading).
```bash
docker compose -f docker-compose.dev.yml up -d
```

### 2. Entorno de Staging (`docker-compose.staging.yml`)
Espejo exacto del entorno de producción para pruebas pre-lanzamiento.
```bash
docker compose -f docker-compose.staging.yml up -d
```

### 3. Entorno de Producción (`docker-compose.prod.yml`)
Orquestación optimizada con redes privadas aisladas, políticas de reinicio `unless-stopped` y límites estrictos de CPU y Memoria RAM.
```bash
docker compose -f docker-compose.prod.yml up -d
```

---

## Orquestación con Kubernetes (`k8s/`)

El directorio `k8s/` contiene los manifiestos declarativos YAML organizados jerárquicamente:

1. `00-namespaces.yaml`: Namespaces `sembrando-huellas-prod` y `sembrando-huellas-staging`.
2. `01-configmaps-secrets.yaml`: Parámetros de entorno y variables confidenciales.
3. `02-storage-pvc.yaml`: Almacenamiento persistente con llamadas a StorageClasses locales o de nube.
4. `03-backend.yaml`: Deployment NestJS (3 réplicas) y servicio ClusterIP.
5. `04-frontend.yaml`: Deployment Nginx (2 réplicas) y servicio ClusterIP.
6. `05-cms.yaml`: Panel de administración aislado.
7. `06-databases.yaml`: StatefulSets para PostgreSQL y Redis.
8. `07-minio.yaml`: Almacenamiento S3.
9. `08-ingress.yaml`: Reglas NGINX Ingress Controller con automatización TLS vía Cert-Manager.
10. `09-hpa.yaml`: Autoescalado horizontal basado en consumo de CPU (>70%) y RAM (>80%).
11. `10-network-policy.yaml`: Políticas de red aisladas con regla por defecto Zero-Trust `default-deny-all`.

### Aplicación manual de manifiestos:
```bash
kubectl apply -f k8s/
```
