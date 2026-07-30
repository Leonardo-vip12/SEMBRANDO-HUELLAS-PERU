"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCrudService = void 0;
const common_1 = require("@nestjs/common");
const pagination_interface_1 = require("../interfaces/pagination.interface");
class BaseCrudService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query, include, where) {
        const { page = 1, limit = 10, sort, order = 'asc', search } = query;
        const skip = (page - 1) * limit;
        const orderBy = sort ? { [sort]: order } : { createdAt: 'desc' };
        const [data, total] = await Promise.all([
            this.prismaDelegate.findMany({
                skip,
                take: limit,
                orderBy,
                where: { ...where, ...(search ? this.buildSearchFilter(search) : {}) },
                include,
            }),
            this.prismaDelegate.count({ where: { ...where, ...(search ? this.buildSearchFilter(search) : {}) } }),
        ]);
        return (0, pagination_interface_1.paginate)(data, total, query);
    }
    async findById(id, include) {
        const item = await this.prismaDelegate.findUnique({
            where: { id },
            include,
        });
        if (!item) {
            throw new common_1.NotFoundException(`${this.modelName} con ID "${id}" no encontrado`);
        }
        return item;
    }
    async findBySlug(slug, include) {
        const item = await this.prismaDelegate.findUnique({
            where: { slug },
            include,
        });
        if (!item) {
            throw new common_1.NotFoundException(`${this.modelName} con slug "${slug}" no encontrado`);
        }
        return item;
    }
    async create(data, include) {
        return this.prismaDelegate.create({ data, include });
    }
    async update(id, data, include) {
        const item = await this.prismaDelegate.findUnique({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException(`${this.modelName} con ID "${id}" no encontrado`);
        }
        return this.prismaDelegate.update({ where: { id }, data, include });
    }
    async remove(id) {
        const item = await this.prismaDelegate.findUnique({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException(`${this.modelName} con ID "${id}" no encontrado`);
        }
        await this.prismaDelegate.delete({ where: { id } });
    }
    async count(where) {
        return this.prismaDelegate.count({ where });
    }
    buildSearchFilter(search) {
        return { name: { contains: search, mode: 'insensitive' } };
    }
}
exports.BaseCrudService = BaseCrudService;
//# sourceMappingURL=base-crud.service.js.map