import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  const port = configService.get<number>('PORT', 3000);
  const corsOrigins = configService.get<string>('CORS_ORIGINS', 'http://localhost:5173');
  const swaggerEnabled = configService.get<boolean>('SWAGGER_ENABLED', true);
  const swaggerPath = configService.get<string>('SWAGGER_PATH', 'docs');

  app.setGlobalPrefix(apiPrefix);

  app.use(helmet());
  app.use(compression());

  app.enableCors({
    origin: corsOrigins.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: 422,
    }),
  );

  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Sembrando Huellas Perú API')
      .setDescription('API REST del Sistema de Gestión Ambiental')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Ingrese su token JWT',
          in: 'header',
        },
        'JWT-auth',
      )
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

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPath, app, document, {
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
