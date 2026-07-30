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
exports.GenerateCertificateDto = exports.GenerateNewsDto = exports.GenerateContentDto = exports.ContentType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var ContentType;
(function (ContentType) {
    ContentType["INFOGRAPHIC"] = "infografia";
    ContentType["EDUCATIONAL_CARD"] = "ficha_educativa";
    ContentType["QUIZ"] = "cuestionario";
    ContentType["GUIDE"] = "guia";
    ContentType["SUMMARY"] = "resumen";
    ContentType["ACTIVITY"] = "actividad";
})(ContentType || (exports.ContentType = ContentType = {}));
class GenerateContentDto {
}
exports.GenerateContentDto = GenerateContentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tema del contenido educativo' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateContentDto.prototype, "topic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ContentType }),
    (0, class_validator_1.IsEnum)(ContentType),
    __metadata("design:type", String)
], GenerateContentDto.prototype, "contentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nivel educativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateContentDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Audiencia objetivo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateContentDto.prototype, "audience", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Formato de salida (markdown, html, json)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateContentDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contexto adicional' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateContentDto.prototype, "additionalContext", void 0);
class GenerateNewsDto {
}
exports.GenerateNewsDto = GenerateNewsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tema o evento de la noticia' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateNewsDto.prototype, "topic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Keywords para SEO' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateNewsDto.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tono del artículo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateNewsDto.prototype, "tone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tamaño deseado' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateNewsDto.prototype, "length", void 0);
class GenerateCertificateDto {
}
exports.GenerateCertificateDto = GenerateCertificateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del beneficiario' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateCertificateDto.prototype, "recipientName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tipo de certificado' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateCertificateDto.prototype, "certificateType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del programa/evento' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateCertificateDto.prototype, "programName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Horas completadas' }),
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
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Idioma del certificado' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateCertificateDto.prototype, "language", void 0);
//# sourceMappingURL=generator.dto.js.map