"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateResourceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_resource_dto_1 = require("./create-resource.dto");
class UpdateResourceDto extends (0, swagger_1.PartialType)(create_resource_dto_1.CreateResourceDto) {
}
exports.UpdateResourceDto = UpdateResourceDto;
//# sourceMappingURL=update-resource.dto.js.map