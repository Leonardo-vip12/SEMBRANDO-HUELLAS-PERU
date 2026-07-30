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
exports.IdentifySpeciesResponseDto = exports.SpeciesIdentificationResultDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SpeciesIdentificationResultDto {
}
exports.SpeciesIdentificationResultDto = SpeciesIdentificationResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre científico' }),
    __metadata("design:type", String)
], SpeciesIdentificationResultDto.prototype, "scientificName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre común' }),
    __metadata("design:type", String)
], SpeciesIdentificationResultDto.prototype, "commonName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Categoría taxonómica' }),
    __metadata("design:type", String)
], SpeciesIdentificationResultDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Estado de conservación' }),
    __metadata("design:type", String)
], SpeciesIdentificationResultDto.prototype, "conservationStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Probabilidad de acierto (0-1)' }),
    __metadata("design:type", Number)
], SpeciesIdentificationResultDto.prototype, "confidence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Curiosidades' }),
    __metadata("design:type", Array)
], SpeciesIdentificationResultDto.prototype, "curiosities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Amenazas' }),
    __metadata("design:type", Array)
], SpeciesIdentificationResultDto.prototype, "threats", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Importancia ecológica' }),
    __metadata("design:type", String)
], SpeciesIdentificationResultDto.prototype, "ecologicalImportance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Descripción general' }),
    __metadata("design:type", String)
], SpeciesIdentificationResultDto.prototype, "description", void 0);
class IdentifySpeciesResponseDto {
}
exports.IdentifySpeciesResponseDto = IdentifySpeciesResponseDto;
//# sourceMappingURL=identifier.dto.js.map