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
exports.KnowledgeSearchDto = exports.AddKnowledgeEntryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class AddKnowledgeEntryDto {
}
exports.AddKnowledgeEntryDto = AddKnowledgeEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Título de la entrada' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddKnowledgeEntryDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contenido de la entrada' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddKnowledgeEntryDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fuente de la información' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddKnowledgeEntryDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tipo de fuente (article, book, research, report, etc)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddKnowledgeEntryDto.prototype, "sourceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Categoría' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddKnowledgeEntryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tags' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], AddKnowledgeEntryDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metadatos adicionales' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AddKnowledgeEntryDto.prototype, "metadata", void 0);
class KnowledgeSearchDto {
}
exports.KnowledgeSearchDto = KnowledgeSearchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Consulta de búsqueda' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KnowledgeSearchDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filtrar por categoría' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KnowledgeSearchDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Límite de resultados', default: 10 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], KnowledgeSearchDto.prototype, "limit", void 0);
//# sourceMappingURL=knowledge-base.dto.js.map