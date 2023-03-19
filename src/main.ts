import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookies from 'cookie-parser';
import { AppModule } from './app.module';
import { SocketIOAdapter } from './auth/socket-io.adapter';
import { UserService } from './user/user.service';

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
  const socketIOAdapter = new SocketIOAdapter(
    app.get(ConfigService),
    app.get(JwtService),
    app.get(UserService),
    app,
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const document = SwaggerModule.createDocument(app, options);
  app.use(cookies());
  SwaggerModule.setup('/docs', app, document);
  app.useWebSocketAdapter(socketIOAdapter);
  await app.listen(3000);
}
bootstrap();

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
