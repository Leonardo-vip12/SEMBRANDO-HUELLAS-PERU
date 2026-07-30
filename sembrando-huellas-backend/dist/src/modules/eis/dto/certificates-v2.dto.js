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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyCertificateDto = exports.GenerateCertificateDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class GenerateCertificateDto {
}
exports.GenerateCertificateDto = GenerateCertificateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del destinatario' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateCertificateDto.prototype, "recipientName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email del destinatario' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], GenerateCertificateDto.prototype, "recipientEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tipo de certificado (voluntariado, participacion, logro, etc)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateCertificateDto.prototype, "certificateType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del programa o actividad' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateCertificateDto.prototype, "programName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Horas invertidas' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateCertificateDto.prototype, "hours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fecha del evento' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateCertificateDto.prototype, "eventDate", void 0);
class VerifyCertificateDto {
}
exports.VerifyCertificateDto = VerifyCertificateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Código de verificación del certificado' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyCertificateDto.prototype, "code", void 0);
//# sourceMappingURL=certificates-v2.dto.js.map