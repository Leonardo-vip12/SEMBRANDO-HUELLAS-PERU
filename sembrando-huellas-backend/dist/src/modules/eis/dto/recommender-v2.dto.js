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
exports.RecommendByCategoryDto = exports.RecommendQueryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class RecommendQueryDto {
}
exports.RecommendQueryDto = RecommendQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Consulta o interés del usuario' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecommendQueryDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cantidad de resultados', default: 6 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], RecommendQueryDto.prototype, "limit", void 0);
class RecommendByCategoryDto {
}
exports.RecommendByCategoryDto = RecommendByCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Categoría (courses, news, projects, species, educational, events, activities)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecommendByCategoryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cantidad de resultados', default: 4 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], RecommendByCategoryDto.prototype, "limit", void 0);
//# sourceMappingURL=recommender-v2.dto.js.map