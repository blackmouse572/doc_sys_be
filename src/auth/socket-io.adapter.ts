import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';
import JwtUser from 'src/user/entities/jwt-user.entity';
import { UserService } from 'src/user/user.service';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly app: INestApplicationContext,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const clientPort = parseInt(this.configService.get('CLIENT_PORT'));

    const cors = {
      origin: [`http://localhost:${clientPort}`],
    };

    this.logger.log(
      'Configureing socket.io server with cors: ' + JSON.stringify(cors),
    );

    const optionsWithCORS: ServerOptions = {
      ...options,
      cookie: true,
      cors,
    };

    const jwtService = this.app.get(JwtService);
    const server: Server = super.createIOServer(port, optionsWithCORS);
    server.of('/').use(this.createTokenMiddleware(jwtService, this.logger));

    return server;
  }

  createTokenMiddleware =
    (jwtService: JwtService, logger: Logger) =>
    (socket: Socket & JwtUser, next) => {
      //For Postman testing support, fallback to token cookie
      const token = socket.handshake.auth.token;

      this.logger.debug(`Validate token before connect: ${token}`);

      try {
        const payload = jwtService.verify(token, {
          secret: this.configService.get('JWT_SECRET'),
        });
        socket.username = payload.username;
        socket.email = payload.email;
        socket.role = payload.role;
        socket.department = payload.department;
        socket.organization = payload.organization;

        logger.debug(`User connected: ${payload.username}`);
        next();
      } catch (error) {
        logger.error(error);
        logger.debug(`User connection rejected: ${token}`);
        next(new Error('Authentication error'));
      }
    };
}
