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
exports.SummarizeDto = exports.TranslatorDto = exports.SemanticSearchResultDto = exports.SemanticSearchDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SemanticSearchDto {
}
exports.SemanticSearchDto = SemanticSearchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Consulta en lenguaje natural' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SemanticSearchDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Colecciones a buscar' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], SemanticSearchDto.prototype, "collections", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Límite de resultados', default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SemanticSearchDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Umbral de similitud mínima (0-1)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SemanticSearchDto.prototype, "threshold", void 0);
class SemanticSearchResultDto {
}
exports.SemanticSearchResultDto = SemanticSearchResultDto;
class TranslatorDto {
}
exports.TranslatorDto = TranslatorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Texto a traducir' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TranslatorDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Idioma origen (ej: es, en, pt)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TranslatorDto.prototype, "sourceLanguage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Idioma destino (ej: es, en, pt, qu)"' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TranslatorDto.prototype, "targetLanguage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contexto para mejorar traducción' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TranslatorDto.prototype, "context", void 0);
class SummarizeDto {
}
exports.SummarizeDto = SummarizeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Texto a resumir' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Longitud del resumen (short, medium, long)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeDto.prototype, "length", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Formato de salida' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeDto.prototype, "format", void 0);
//# sourceMappingURL=semantic.dto.js.map