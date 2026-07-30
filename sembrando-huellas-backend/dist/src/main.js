"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const compression = require("compression");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    const configService = app.get(config_1.ConfigService);
    const apiPrefix = configService.get('API_PREFIX', 'api/v1');
    const port = configService.get('PORT', 3000);
    const corsOrigins = configService.get('CORS_ORIGINS', 'http://localhost:5173');
    const swaggerEnabled = configService.get('SWAGGER_ENABLED', true);
    const swaggerPath = configService.get('SWAGGER_PATH', 'docs');
    app.setGlobalPrefix(apiPrefix);
    app.use((0, helmet_1.default)());
    app.use(compression());
    app.enableCors({
        origin: corsOrigins.split(',').map((o) => o.trim()),
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        errorHttpStatusCode: 422,
    }));
    if (swaggerEnabled) {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('Sembrando Huellas Perú API')
            .setDescription('API REST del Sistema de Gestión Ambiental')
            .setVersion('1.0')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Ingrese su token JWT',
            in: 'header',
        }, 'JWT-auth')
            .addTag('Auth', 'Autenticación y autorización')
            .addTag('Users', 'Gestión de usuarios')
            .addTag('Roles', 'Roles y permisos')
            .addTag('News', 'Noticias y artículos')
            .addTag('Categories', 'Categorías')
            .addTag('Programs', 'Programas')
            .addTag('Projects', 'Proyectos')
            .addTag('Species', 'Especies')
            .addTag('Gallery', 'Galería de imágenes')
            .addTag('Events', 'Eventos')
            .addTag('Resources', 'Recursos descargables')
            .addTag('Partners', 'Aliados')
            .addTag('Volunteers', 'Voluntarios')
            .addTag('FAQ', 'Preguntas frecuentes')
            .addTag('Team', 'Equipo')
            .addTag('Testimonials', 'Testimonios')
            .addTag('Organization', 'Organización')
            .addTag('Impact', 'Impacto')
            .addTag('Donations', 'Donaciones')
            .addTag('Settings', 'Configuración')
            .addTag('Uploads', 'Archivos')
            .addTag('Dashboard', 'Dashboard')
            .addTag('Audit', 'Auditoría')
            .addTag('Notifications', 'Notificaciones')
            .addTag('Health', 'Health Check')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup(swaggerPath, app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                tagsSorter: 'alpha',
                operationsSorter: 'alpha',
            },
        });
        logger.log(`Swagger docs available at /${swaggerPath}`);
    }
    await app.listen(port);
    logger.log(`Application running on http://localhost:${port}/${apiPrefix}`);
}
bootstrap();
//# sourceMappingURL=main.js.map