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
var CategoriesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_crud_service_1 = require("../../common/base/base-crud.service");
const slug_util_1 = require("../../common/utils/slug.util");
let CategoriesService = CategoriesService_1 = class CategoriesService extends base_crud_service_1.BaseCrudService {
    constructor(prisma) {
        super(prisma);
        this.prisma = prisma;
        this.logger = new common_1.Logger(CategoriesService_1.name);
        this.modelName = 'Categoría';
    }
    get prismaDelegate() {
        return this.prisma.category;
    }
    async create(dto) {
        const slug = dto.slug || (0, slug_util_1.generateSlug)(dto.name);
        return super.create({ ...dto, slug });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = CategoriesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map