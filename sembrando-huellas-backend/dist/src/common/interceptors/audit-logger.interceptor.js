"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLoggerInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let AuditLoggerInterceptor = class AuditLoggerInterceptor {
    constructor() {
        this.logger = new common_1.Logger('AuditSecurity');
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, ip, user } = request;
        const userAgent = request.get('user-agent') || 'unknown';
        const now = Date.now();
        const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                if (isMutating) {
                    const delay = Date.now() - now;
                    this.logger.log(JSON.stringify({
                        level: 'INFO',
                        category: 'AUDIT',
                        method,
                        url,
                        status: 'SUCCESS',
                        userId: user?.id || 'anonymous',
                        userRole: user?.role || 'public',
                        ip,
                        userAgent,
                        durationMs: delay,
                        timestamp: new Date().toISOString(),
                    }));
                }
            },
            error: (err) => {
                const delay = Date.now() - now;
                this.logger.warn(JSON.stringify({
                    level: 'WARN',
                    category: 'SECURITY_AUDIT',
                    method,
                    url,
                    status: 'FAILURE',
                    errorCode: err.status || 500,
                    errorMessage: err.message,
                    userId: user?.id || 'anonymous',
                    ip,
                    userAgent,
                    durationMs: delay,
                    timestamp: new Date().toISOString(),
                }));
            },
        }));
    }
};
exports.AuditLoggerInterceptor = AuditLoggerInterceptor;
exports.AuditLoggerInterceptor = AuditLoggerInterceptor = __decorate([
    (0, common_1.Injectable)()
], AuditLoggerInterceptor);
//# sourceMappingURL=audit-logger.interceptor.js.map