#!/usr/bin/env bash
set -eo pipefail

BACKUP_DIR="${BACKUP_DIR:-/backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="${DB_NAME:-sembrando_huellas_prod}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-postgres}"
BACKUP_FILE="${BACKUP_DIR}/db_backup_${DB_NAME}_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "[$(date)] Starting PostgreSQL Backup for database: ${DB_NAME}..."

pg_dump -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" -F c | gzip > "${BACKUP_FILE}"

echo "[$(date)] Backup completed successfully: ${BACKUP_FILE}"

# Retention Policy: Delete backups older than 30 days
find "${BACKUP_DIR}" -name "db_backup_*.sql.gz" -mtime +30 -exec rm -f {} \;
echo "[$(date)] Retention cleanup completed."
