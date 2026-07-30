#!/usr/bin/env bash
set -eo pipefail

TARGET_URL="${1:-http://localhost:3000}"

echo "===================================================="
echo " Starting OWASP ZAP Dynamic Security Scan "
echo " Target: ${TARGET_URL}"
echo "===================================================="

docker run --rm -v $(pwd):/zap/wrk/:rw \
  ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
  -t "${TARGET_URL}" \
  -r zap_report.html \
  -J zap_report.json \
  -I || true

echo "OWASP ZAP Scan complete. Reports generated in zap_report.html and zap_report.json"
