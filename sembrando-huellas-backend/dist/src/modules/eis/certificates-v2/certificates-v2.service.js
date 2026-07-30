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
var CertificatesV2Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificatesV2Service = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const certificates_service_1 = require("../../ai/certificates/certificates.service");
let CertificatesV2Service = CertificatesV2Service_1 = class CertificatesV2Service {
    constructor(prisma, certificatesService) {
        this.prisma = prisma;
        this.certificatesService = certificatesService;
        this.logger = new common_1.Logger(CertificatesV2Service_1.name);
    }
    async generate(dto) {
        const result = await this.certificatesService.generateCertificate(dto);
        const issued = await this.prisma.issuedCertificate.create({
            data: {
                recipientName: dto.recipientName,
                recipientEmail: dto.recipientEmail,
                certificateType: dto.certificateType,
                programName: dto.programName,
                hours: dto.hours,
                eventDate: dto.eventDate || new Date().toISOString(),
                verificationCode: result.verificationCode,
                verificationUrl: result.verificationUrl,
                qrDataUrl: result.qrDataUrl,
                metadata: { generatedBy: 'eis-v2' },
            },
        });
        return { ...result, id: issued.id };
    }
    async verify(code) {
        const certificate = await this.prisma.issuedCertificate.findUnique({
            where: { verificationCode: code },
        });
        if (!certificate) {
            return { valid: false, message: 'Certificado no encontrado. Verifique el código e intente nuevamente.' };
        }
        if (certificate.revokedAt) {
            return { valid: false, message: 'Este certificado ha sido revocado.', revokedAt: certificate.revokedAt };
        }
        return {
            valid: true,
            certificate: {
                recipientName: certificate.recipientName,
                certificateType: certificate.certificateType,
                programName: certificate.programName,
                hours: certificate.hours,
                issuedAt: certificate.issuedAt,
                verificationCode: certificate.verificationCode,
            },
            message: `Certificado verificado: ${certificate.recipientName} - ${certificate.programName}`,
        };
    }
    async revoke(code) {
        const certificate = await this.prisma.issuedCertificate.findUnique({
            where: { verificationCode: code },
        });
        if (!certificate)
            throw new Error('Certificado no encontrado');
        if (certificate.revokedAt)
            throw new Error('El certificado ya fue revocado');
        await this.prisma.issuedCertificate.update({
            where: { id: certificate.id },
            data: { revokedAt: new Date() },
        });
        return { revoked: true, code };
    }
    async list(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.issuedCertificate.findMany({
                skip,
                take: limit,
                orderBy: { issuedAt: 'desc' },
            }),
            this.prisma.issuedCertificate.count(),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async getStats() {
        const [total, active, revoked] = await Promise.all([
            this.prisma.issuedCertificate.count(),
            this.prisma.issuedCertificate.count({ where: { revokedAt: null } }),
            this.prisma.issuedCertificate.count({ where: { revokedAt: { not: null } } }),
        ]);
        return { total, active, revoked };
    }
};
exports.CertificatesV2Service = CertificatesV2Service;
exports.CertificatesV2Service = CertificatesV2Service = CertificatesV2Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        certificates_service_1.CertificatesService])
], CertificatesV2Service);
//# sourceMappingURL=certificates-v2.service.js.map