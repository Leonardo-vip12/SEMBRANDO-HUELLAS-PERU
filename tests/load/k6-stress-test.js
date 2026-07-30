import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp up to 50 concurrent virtual users
    { duration: '1m',  target: 200 }, // Spike to 200 concurrent users
    { duration: '2m',  target: 500 }, // Sustained load at 500 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate must be under 1%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Test Health Endpoint
  const healthRes = http.get(`${BASE_URL}/api/v1/health`);
  check(healthRes, {
    'status is 200': (r) => r.status === 200,
  });

  // Test Projects API Endpoint
  const projectsRes = http.get(`${BASE_URL}/api/v1/projects`);
  check(projectsRes, {
    'projects API status is 200': (r) => r.status === 200,
  });

  // Test EIS Environmental Intelligence API Endpoint
  const eisRes = http.get(`${BASE_URL}/api/v1/eis/metrics`);
  check(eisRes, {
    'EIS API status is 200': (r) => r.status === 200 || r.status === 401,
  });

  sleep(1);
}
