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
exports.ActivityRecommendDto = exports.PlanActivityDto = exports.ActivityType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var ActivityType;
(function (ActivityType) {
    ActivityType["CHARLA"] = "charla";
    ActivityType["CAMPANA"] = "campana";
    ActivityType["TALLER"] = "taller";
    ActivityType["SESION"] = "sesion_educativa";
    ActivityType["JUEGO"] = "juego";
    ActivityType["DINAMICA"] = "dinamica";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
class PlanActivityDto {
}
exports.PlanActivityDto = PlanActivityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ActivityType }),
    (0, class_validator_1.IsEnum)(ActivityType),
    __metadata("design:type", String)
], PlanActivityDto.prototype, "activityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tema de la actividad' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlanActivityDto.prototype, "topic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nivel educativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlanActivityDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Duración estimada' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlanActivityDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Número de participantes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PlanActivityDto.prototype, "participants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Objetivos específicos' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PlanActivityDto.prototype, "objectives", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contexto adicional' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlanActivityDto.prototype, "additionalContext", void 0);
class ActivityRecommendDto {
}
exports.ActivityRecommendDto = ActivityRecommendDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nivel educativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActivityRecommendDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Duración deseada' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActivityRecommendDto.prototype, "duration", void 0);
//# sourceMappingURL=activity-planner.dto.js.map