"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@redis/client");
let RedisService = RedisService_1 = class RedisService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(RedisService_1.name);
        this.isConnected = false;
        const host = this.configService.get('redis.host', 'localhost');
        const port = this.configService.get('redis.port', 6379);
        const password = this.configService.get('redis.password');
        this.client = (0, client_1.createClient)({
            socket: { host, port },
            password: password || undefined,
        });
        this.client.on('error', (err) => {
            this.logger.error(`Redis error: ${err.message}`);
        });
        this.client.on('connect', () => {
            this.isConnected = true;
            this.logger.log('Connected to Redis');
        });
    }
    async onModuleInit() {
        try {
            await this.client.connect();
        }
        catch (error) {
            this.logger.warn(`Redis connection failed: ${error.message}. Cache will be unavailable.`);
        }
    }
    async onModuleDestroy() {
        if (this.isConnected) {
            await this.client.quit();
        }
    }
    async get(key) {
        if (!this.isConnected)
            return null;
        try {
            const value = await this.client.get(key);
            return value ? JSON.parse(value) : null;
        }
        catch {
            return null;
        }
    }
    async set(key, value, ttlSeconds) {
        if (!this.isConnected)
            return;
        try {
            const serialized = JSON.stringify(value);
            if (ttlSeconds) {
                await this.client.setEx(key, ttlSeconds, serialized);
            }
            else {
                await this.client.set(key, serialized);
            }
        }
        catch (error) {
            this.logger.error(`Redis set error: ${error.message}`);
        }
    }
    async del(key) {
        if (!this.isConnected)
            return;
        try {
            await this.client.del(key);
        }
        catch {
        }
    }
    async delPattern(pattern) {
        if (!this.isConnected)
            return;
        try {
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                await this.client.del(keys);
            }
        }
        catch {
        }
    }
    async ping() {
        if (!this.isConnected)
            return false;
        try {
            await this.client.ping();
            return true;
        }
        catch {
            return false;
        }
    }
    getClient() {
        return this.client;
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map