import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');

  app.enableCors({
    origin: corsOrigin,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = configService.get<number>('PORT', 4000);
  await app.listen(port);

  // Self-ping mechanism to keep Render free tier awake
  const renderExternalUrl = configService.get<string>('RENDER_EXTERNAL_URL');
  if (renderExternalUrl) {
    setInterval(async () => {
      try {
        // Ping our own companies endpoint just to keep traffic flowing
        await fetch(`${renderExternalUrl}/api/v1/companies?limit=1`);
        console.log('Self-ping successful to keep instance awake.');
      } catch (err) {
        console.error('Self-ping failed:', err.message);
      }
    }, 14 * 60 * 1000); // 14 minutes
  }
}
bootstrap();
