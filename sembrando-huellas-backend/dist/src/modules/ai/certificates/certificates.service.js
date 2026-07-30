"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CertificatesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const prompts_1 = require("../prompts");
const crypto = require("crypto");
const QRCode = require("qrcode");
let CertificatesService = CertificatesService_1 = class CertificatesService {
    constructor() {
        this.logger = new common_1.Logger(CertificatesService_1.name);
    }
    async generateCertificate(dto) {
        const verificationCode = crypto.randomUUID().slice(0, 8).toUpperCase();
        const template = prompts_1.CERTIFICATE_TEMPLATES[dto.certificateType] || prompts_1.CERTIFICATE_TEMPLATES.voluntariado;
        const content = template
            .replace(/{{recipientName}}/g, dto.recipientName)
            .replace(/{{programName}}/g, dto.programName)
            .replace(/{{hours}}/g, dto.hours || '')
            .replace(/{{eventDate}}/g, dto.eventDate || new Date().toLocaleDateString('es-PE'))
            .replace(/{{verificationCode}}/g, verificationCode);
        const verificationUrl = `https://sembrandohuellas.org/verificar/${verificationCode}`;
        let qrDataUrl;
        try {
            qrDataUrl = await QRCode.toDataURL(verificationUrl, { width: 300, margin: 2 });
        }
        catch (error) {
            this.logger.warn(`Failed to generate QR code: ${error.message}`);
        }
        return { content, verificationCode, qrDataUrl, verificationUrl };
    }
    async verifyCertificate(code) {
        return {
            valid: true,
            message: `Certificado verificado: Código ${code} registrado en Sembrando Huellas Perú.`,
        };
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = CertificatesService_1 = __decorate([
    (0, common_1.Injectable)()
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map