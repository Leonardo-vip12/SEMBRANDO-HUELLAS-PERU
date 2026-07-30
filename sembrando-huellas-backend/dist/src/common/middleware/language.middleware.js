"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageMiddleware = void 0;
const common_1 = require("@nestjs/common");
let LanguageMiddleware = class LanguageMiddleware {
    constructor() {
        this.supported = ['es', 'en', 'pt', 'qu', 'shp', 'cni', 'pug'];
        this.defaultLang = 'es';
    }
    use(req, _res, next) {
        const acceptLang = req.headers['accept-language'];
        const queryLang = req.query.lang;
        let lang = this.defaultLang;
        if (queryLang && this.supported.includes(queryLang)) {
            lang = queryLang;
        }
        else if (acceptLang) {
            const preferred = acceptLang.split(',')[0]?.split('-')[0];
            if (preferred && this.supported.includes(preferred)) {
                lang = preferred;
            }
        }
        req.language = lang;
        _res.setHeader('Content-Language', lang);
        next();
    }
};
exports.LanguageMiddleware = LanguageMiddleware;
exports.LanguageMiddleware = LanguageMiddleware = __decorate([
    (0, common_1.Injectable)()
], LanguageMiddleware);
//# sourceMappingURL=language.middleware.js.map