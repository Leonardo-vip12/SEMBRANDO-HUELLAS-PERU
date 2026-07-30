# Reporte de Auditoría de Seguridad y Matriz OWASP Top 10

## Matriz de Cumplimiento OWASP Top 10

| Riesgo OWASP Top 10 (2021) | Estado | Implementación de Control en la Plataforma |
|---|---|---|
| **A01: Broken Access Control** | ✔ Mitigado | Control de acceso basado en roles (RBAC), Guards JWT en NestJS y NetworkPolicies en K8s. |
| **A02: Cryptographic Failures** | ✔ Mitigado | Contraseñas encriptadas con `bcrypt` (12 salt rounds). Conexiones forzadas por TLS/HTTPS. |
| **A03: Injection** | ✔ Mitigado | Uso exclusivo de consultas parametrizadas con Prisma ORM. Sanitización global de entradas. |
| **A04: Insecure Design** | ✔ Mitigado | Arquitectura Zero-Trust, separación de entornos y principio de menor privilegio en contenedores. |
| **A05: Security Misconfiguration**| ✔ Mitigado | Middleware `Helmet` activo en backend con CSP estricta. Contenedores ejecutados como usuario `node` no-root. |
| **A06: Vulnerable Components** | ✔ Mitigado | Escaneo automatizado de vulnerabilidades en CI/CD con Trivy y `npm audit`. |
| **A07: Identification & Auth Failures**| ✔ Mitigado| Rate Limiting en endpoints de login (`@nestjs/throttler`) e invalidez de tokens expirados. |
| **A08: Software & Data Integrity** | ✔ Mitigado | Firma de artefactos y verificación de hashes en backups de base de datos. |
| **A09: Security Logging & Monitoring**| ✔ Mitigado| Interceptor de auditoría de seguridad (`AuditLoggerInterceptor`) registrando mutaciones en JSON. |
| **A10: SSRF** | ✔ Mitigado | Validación de URLs salientes y aislamiento de red en llamadas a proveedores de IA. |

---

## Prácticas de Gestión de Secretos

- No se permiten credenciales ni claves en duro en el código fuente.
- En Kubernetes se utilizan `Secrets` inyectados mediante variables de entorno a nivel de pod.
- Rotación semestral obligatoria de JWT Secret y contraseñas de servicio.
