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
exports.VerifyObservationDto = exports.ObservationStatusAction = exports.ObservationQueryDto = exports.RegisterObservationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RegisterObservationDto {
}
exports.RegisterObservationDto = RegisterObservationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nombre común de la especie' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterObservationDto.prototype, "speciesName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nombre científico' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterObservationDto.prototype, "scientificName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cantidad observada', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RegisterObservationDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Latitud' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RegisterObservationDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Longitud' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RegisterObservationDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fecha de observación (ISO)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterObservationDto.prototype, "observedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tipo de hábitat' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterObservationDto.prototype, "habitat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Condición climática' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterObservationDto.prototype, "weather", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Comentarios' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterObservationDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'URLs de imágenes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], RegisterObservationDto.prototype, "images", void 0);
class ObservationQueryDto {
}
exports.ObservationQueryDto = ObservationQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Página', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ObservationQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Límite por página', default: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ObservationQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filtrar por estado' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ObservationQueryDto.prototype, "status", void 0);
var ObservationStatusAction;
(function (ObservationStatusAction) {
    ObservationStatusAction["VERIFIED"] = "VERIFIED";
    ObservationStatusAction["REJECTED"] = "REJECTED";
    ObservationStatusAction["NEEDS_REVIEW"] = "NEEDS_REVIEW";
})(ObservationStatusAction || (exports.ObservationStatusAction = ObservationStatusAction = {}));
class VerifyObservationDto {
}
exports.VerifyObservationDto = VerifyObservationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ObservationStatusAction }),
    (0, class_validator_1.IsEnum)(ObservationStatusAction),
    __metadata("design:type", String)
], VerifyObservationDto.prototype, "status", void 0);
//# sourceMappingURL=observatory.dto.js.map