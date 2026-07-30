# Manual de Mantenimiento Preventivo y Correctivo

## Rutinas de Mantenimiento de Base de Datos

### 1. Limpieza de Índices y Vacuum en PostgreSQL
Ejecutar semanalmente para prevenir hinchazón (bloat) de la base de datos:
```sql
VACUUM ANALYZE;
REINDEX DATABASE sembrando_huellas_prod;
```

### 2. Migraciones de Prisma
Toda modificación al esquema relacional (`prisma/schema.prisma`) debe aplicarse mediante:
```bash
# Desarrollo:
npx prisma migrate dev --name descripcion_cambio

# Producción (Deploy automático en CI/CD):
npx prisma migrate deploy
```

---

## Mantenimiento de Caché Redis

Limpieza periódica de claves expiradas o purga de caché de configuraciones:
```bash
redis-cli -a "$REDIS_PASSWORD" FLUSHDB
```

---

## Actualización de Dependencias

Ejecutar auditoría mensual de dependencias para parches de seguridad:
```bash
npm audit fix
```
