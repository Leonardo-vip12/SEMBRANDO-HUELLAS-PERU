import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  private readonly supported = ['es', 'en', 'pt', 'qu', 'shp', 'cni', 'pug'];
  private readonly defaultLang = 'es';

  use(req: Request, _res: Response, next: NextFunction) {
    const acceptLang = req.headers['accept-language'];
    const queryLang = (req.query as any).lang;

    let lang = this.defaultLang;
    if (queryLang && this.supported.includes(queryLang)) {
      lang = queryLang;
    } else if (acceptLang) {
      const preferred = acceptLang.split(',')[0]?.split('-')[0];
      if (preferred && this.supported.includes(preferred)) {
        lang = preferred;
      }
    }

    (req as any).language = lang;
    _res.setHeader('Content-Language', lang);
    next();
  }
}
