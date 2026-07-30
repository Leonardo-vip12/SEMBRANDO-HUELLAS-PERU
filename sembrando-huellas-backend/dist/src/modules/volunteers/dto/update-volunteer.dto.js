"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVolunteerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_volunteer_dto_1 = require("./create-volunteer.dto");
class UpdateVolunteerDto extends (0, swagger_1.PartialType)(create_volunteer_dto_1.CreateVolunteerDto) {
}
exports.UpdateVolunteerDto = UpdateVolunteerDto;
//# sourceMappingURL=update-volunteer.dto.js.map