import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { DocumentService } from 'src/document/document.service';

declare global {
  namespace Express {
    interface Request {
      username?: string;
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  private readonly documentService: DocumentService
  async use(req: Request, res: Response, next: NextFunction) {
    const authToken = req.cookies['auth-cookie'];
    
    if (!authToken) {
      console.log('no auth token')
      
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const decoded = this.jwtService.verify(authToken.token, {
        secret: process.env.jwt_secret
      });
      if (true) {        
        // this.documentService.findOne(decoded.username,req.params[0])
        console.log(decoded.username,req.params[0])
        next();
      } else {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    } catch (err) {
      console.log(err)

      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
}