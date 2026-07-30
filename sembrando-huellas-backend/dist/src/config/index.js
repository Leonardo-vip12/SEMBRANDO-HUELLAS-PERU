"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.default = () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    apiPrefix: process.env.API_PREFIX || 'api/v1',
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
        expiration: process.env.JWT_EXPIRATION || '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
        refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
    },
    minio: {
        endpoint: process.env.MINIO_ENDPOINT || 'localhost',
        port: parseInt(process.env.MINIO_PORT || '9000', 10),
        accessKey: process.env.MINIO_ACCESS_KEY || 'minio',
        secretKey: process.env.MINIO_SECRET_KEY || 'minio123',
        bucket: process.env.MINIO_BUCKET || 'sembrando-huellas',
        useSSL: process.env.MINIO_USE_SSL === 'true',
    },
    cors: {
        origins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map((o) => o.trim()),
    },
    swagger: {
        enabled: process.env.SWAGGER_ENABLED !== 'false',
        path: process.env.SWAGGER_PATH || 'docs',
    },
    throttler: {
        ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
        limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
    },
    uploads: {
        dest: process.env.UPLOAD_DEST || path.join(process.cwd(), 'uploads'),
        maxFileSize: 10 * 1024 * 1024,
    },
    logLevel: process.env.LOG_LEVEL || 'debug',
});
//# sourceMappingURL=index.js.map