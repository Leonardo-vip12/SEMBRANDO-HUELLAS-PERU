#!/usr/bin/env bash
set -eo pipefail

if [ -z "$1" ]; then
  echo "Usage: $0 <path_to_backup_file.sql.gz>"
  exit 1
fi

BACKUP_FILE="$1"
DB_NAME="${DB_NAME:-sembrando_huellas_prod}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-postgres}"

echo "[$(date)] Restoring Database ${DB_NAME} from ${BACKUP_FILE}..."

gunzip -c "${BACKUP_FILE}" | pg_restore -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" --clean --if-exists

echo "[$(date)] Database restoration completed successfully!"
