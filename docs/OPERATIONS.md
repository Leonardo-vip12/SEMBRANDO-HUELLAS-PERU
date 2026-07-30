# Guía de Operación y Observabilidad Enterprise

## Arquitectura de Monitoreo

La plataforma integra una pila completa de observabilidad basada en **Prometheus**, **Grafana**, **Loki** y **Jaeger**.

---

## 1. Métrica de Aplicación (Prometheus)

El Backend API expone métricas en formato Prometheus en el endpoint `/api/v1/metrics`.

Métricas Clave Recolectadas:
- `http_requests_total`: Volumen de peticiones HTTP por código de respuesta.
- `http_request_duration_seconds`: Latencia p50, p95 y p99.
- `process_cpu_seconds_total`: Consumo de procesamiento de CPU del proceso Node.js.
- `process_resident_memory_bytes`: Uso de memoria RAM.

---

## 2. Paneles de Monitoreo (Grafana)

Acceso al panel Grafana en producción: `https://grafana.sembrandohuellas.pe` (o puerto interno `3000`).

Se incluye un dashboard pre-configurado en `monitoring/grafana/dashboards/enterprise-dashboard.json`:
- **Panel de Disponibilidad (SLA):** Indica el porcentaje de uptime objetivo (99.9%).
- **Panel de Consumo de IA:** Registra llamadas a modelos OpenAI, Anthropic y Gemini.
- **Panel de Conexiones DB:** Visualiza el estado de las conexiones activas en PostgreSQL.

---

## 3. Centralización de Logs (Loki & Promtail)

Los logs se escriben en formato JSON estructurado y son procesados por Grafana Loki:

Reglas de Niveles de Registro:
- `INFO`: Operaciones normales del sistema (ej. login exitoso, registro de voluntario).
- `WARN`: Advertencias operativas o bloqueos de rate limit.
- `ERROR`: Excepciones no controladas o fallos de conexión a servicios externos.
- `DEBUG`: Solo activo en entorno de desarrollo.

Filtro de búsqueda en Grafana Explore:
```logql
{app="sh-backend"} |= "ERROR"
```

---

## 4. Trazabilidad Distribuida (OpenTelemetry / Jaeger)

Monitoreo del recorrido completo de las peticiones HTTP cruzando Backend -> PostgreSQL -> Redis -> API de IA Externa mediante Jaeger Tracing UI en `http://localhost:16686`.
