"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSpeciesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_species_dto_1 = require("./create-species.dto");
class UpdateSpeciesDto extends (0, swagger_1.PartialType)(create_species_dto_1.CreateSpeciesDto) {
}
exports.UpdateSpeciesDto = UpdateSpeciesDto;
//# sourceMappingURL=update-species.dto.js.map