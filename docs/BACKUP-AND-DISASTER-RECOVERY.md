# Plan de Recuperación ante Desastres (Disaster Recovery Plan - DRP)

## Objetivos del Plan

- **RPO (Recovery Point Objective):** < 1 hora (Pérdida máxima tolerable de datos).
- **RTO (Recovery Time Objective):** < 30 minutos (Tiempo máximo de restauración del servicio).

---

## Política de Copias de Seguridad (Backups)

1. **Backups Diarios:** Ejecutados automáticamente a las 01:00 UTC. Retención de 7 días.
2. **Backups Semanales:** Ejecutados cada domingo a las 02:00 UTC. Retención de 4 semanas.
3. **Backups Mensuales:** Ejecutados el 1 de cada mes. Retención de 12 meses.

---

## Procedimiento de Restauración Paso a Paso

En caso de fallo total de la base de datos o corrupción masiva:

```bash
# Step 1: Descargar la última copia de seguridad válida desde MinIO/S3
bash scripts/backup-db.sh

# Step 2: Restaurar el archivo comprimido en el contenedor PostgreSQL
bash scripts/restore-db.sh /backups/db_backup_sembrando_huellas_prod_ULTIMO.sql.gz

# Step 3: Verificar la integridad de los datos
npx prisma db execute --script "SELECT count(*) FROM \"User\";"

# Step 4: Reiniciar los pods del Backend API
kubectl rollout restart deployment/sh-backend -n sembrando-huellas-prod
```
