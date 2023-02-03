import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookies from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    preflightContinue: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const options = new DocumentBuilder()
    .setTitle('DOCSYS Backend API')
    .setDescription('Api for DOCSYS App')
    .setVersion('1.0')
    .addCookieAuth('auth-cookie', {
      type: 'apiKey',
      in: 'cookie',
      name: 'auth-cookie',
      description: 'Cookie for authentication',
    })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
  app.use(cookies());
  await app.listen(3000);
}
bootstrap();
