import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';
import { generateSlug } from '../../common/utils/slug.util';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService extends BaseCrudService<any> {
  protected logger = new Logger(NewsService.name);
  protected modelName = 'Noticia';

  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  get prismaDelegate() {
    return this.prisma.news;
  }

  async create(dto: CreateNewsDto, userId: string) {
    const slug = dto.slug || generateSlug(dto.title) + '-' + Date.now();
    return super.create({
      ...dto,
      slug,
      userId,
    });
  }

  async update(id: string, dto: UpdateNewsDto) {
    const data: any = { ...dto };
    if (dto.title && !dto.slug) {
      data.slug = generateSlug(dto.title) + '-' + Date.now();
    }
    return super.update(id, data);
  }

  protected buildSearchFilter(search: string) {
    return {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { excerpt: { contains: search, mode: 'insensitive' as const } },
      ],
    };
  }
}
