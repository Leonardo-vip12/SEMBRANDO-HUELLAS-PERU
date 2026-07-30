#!/usr/bin/env bash
set -eo pipefail

MINIO_ALIAS="myminio"
MINIO_HOST="${MINIO_HOST:-http://minio:9000}"
MINIO_USER="${MINIO_ROOT_USER:-minioadmin}"
MINIO_PASS="${MINIO_ROOT_PASSWORD:-minioadmin}"

echo "Configuring MinIO client alias..."
mc alias set "${MINIO_ALIAS}" "${MINIO_HOST}" "${MINIO_USER}" "${MINIO_PASS}"

echo "Creating standard production buckets..."
mc mb --ignore-existing "${MINIO_ALIAS}/media"
mc mb --ignore-existing "${MINIO_ALIAS}/backups"
mc mb --ignore-existing "${MINIO_ALIAS}/documents"

echo "Setting public download policy on media bucket..."
mc anonymous set download "${MINIO_ALIAS}/media"

echo "Enabling versioning on documents bucket..."
mc version enable "${MINIO_ALIAS}/documents"

echo "MinIO buckets configured successfully!"
