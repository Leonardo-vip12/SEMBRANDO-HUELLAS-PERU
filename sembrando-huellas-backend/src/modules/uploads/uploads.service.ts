import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UploadsService {
  protected logger = new Logger(UploadsService.name);

  constructor(private prisma: PrismaService) {}

  async upload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó archivo');
    }

    const upload = await this.prisma.upload.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: `uploads/${file.filename}`,
        url: `/uploads/${file.filename}`,
      },
    });

    return upload;
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.upload.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.upload.count(),
    ]);
    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async remove(id: string) {
    const upload = await this.prisma.upload.findUnique({ where: { id } });
    if (!upload) {
      throw new BadRequestException('Archivo no encontrado');
    }
    await this.prisma.upload.delete({ where: { id } });
    return { message: 'Archivo eliminado' };
  }
}
