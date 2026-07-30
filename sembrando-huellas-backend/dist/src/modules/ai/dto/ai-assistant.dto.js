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
exports.AssistantResponseDto = exports.AssistantQueryDto = exports.AssistantContext = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var AssistantContext;
(function (AssistantContext) {
    AssistantContext["AMAZONIA"] = "amazonia";
    AssistantContext["EDUCACION"] = "educacion";
    AssistantContext["FLORA"] = "flora";
    AssistantContext["FAUNA"] = "fauna";
    AssistantContext["CLIMA"] = "clima";
    AssistantContext["CONSERVACION"] = "conservacion";
    AssistantContext["PROGRAMAS"] = "programas";
    AssistantContext["PROYECTOS"] = "proyectos";
    AssistantContext["EVENTOS"] = "eventos";
    AssistantContext["NOTICIAS"] = "noticias";
    AssistantContext["GENERAL"] = "general";
})(AssistantContext || (exports.AssistantContext = AssistantContext = {}));
class AssistantQueryDto {
}
exports.AssistantQueryDto = AssistantQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pregunta del usuario' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssistantQueryDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: AssistantContext, default: AssistantContext.GENERAL }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AssistantContext),
    __metadata("design:type", String)
], AssistantQueryDto.prototype, "context", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Historial de conversación' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], AssistantQueryDto.prototype, "history", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de sesión para mantener contexto' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssistantQueryDto.prototype, "sessionId", void 0);
class AssistantResponseDto {
}
exports.AssistantResponseDto = AssistantResponseDto;
//# sourceMappingURL=ai-assistant.dto.js.map