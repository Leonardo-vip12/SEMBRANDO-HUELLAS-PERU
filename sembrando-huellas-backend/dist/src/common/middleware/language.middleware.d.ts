import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class LanguageMiddleware implements NestMiddleware {
    private readonly supported;
    private readonly defaultLang;
    use(req: Request, _res: Response, next: NextFunction): void;
}
