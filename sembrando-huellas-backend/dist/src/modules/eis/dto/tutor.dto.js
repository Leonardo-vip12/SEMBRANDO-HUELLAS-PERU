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
exports.TutorAskDto = exports.UserLevel = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var UserLevel;
(function (UserLevel) {
    UserLevel["PRIMARY"] = "primaria";
    UserLevel["SECONDARY"] = "secundaria";
    UserLevel["UNIVERSITY"] = "universidad";
    UserLevel["TEACHER"] = "docente";
    UserLevel["RESEARCHER"] = "investigador";
    UserLevel["VOLUNTEER"] = "voluntario";
    UserLevel["COMPANY"] = "empresa";
    UserLevel["GENERAL"] = "general";
})(UserLevel || (exports.UserLevel = UserLevel = {}));
class TutorAskDto {
}
exports.TutorAskDto = TutorAskDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Consulta del usuario' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TutorAskDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: UserLevel, default: UserLevel.GENERAL }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(UserLevel),
    __metadata("design:type", String)
], TutorAskDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de sesión para mantener contexto' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TutorAskDto.prototype, "sessionId", void 0);
//# sourceMappingURL=tutor.dto.js.map