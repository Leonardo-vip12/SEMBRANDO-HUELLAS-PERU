declare const _default: () => {
    port: number;
    apiPrefix: string;
    nodeEnv: string;
    database: {
        url: string | undefined;
    };
    jwt: {
        secret: string;
        expiration: string;
        refreshSecret: string;
        refreshExpiration: string;
    };
    redis: {
        host: string;
        port: number;
        password: string | undefined;
    };
    minio: {
        endpoint: string;
        port: number;
        accessKey: string;
        secretKey: string;
        bucket: string;
        useSSL: boolean;
    };
    cors: {
        origins: string[];
    };
    swagger: {
        enabled: boolean;
        path: string;
    };
    throttler: {
        ttl: number;
        limit: number;
    };
    uploads: {
        dest: string;
        maxFileSize: number;
    };
    logLevel: string;
};
export default _default;
