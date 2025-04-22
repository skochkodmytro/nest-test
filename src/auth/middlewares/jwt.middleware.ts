import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return next();
    } else {
      console.log(token, 'token');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      req['user'] = payload;
    } catch (err) {
      console.log(err, 'err: jwt middleware');
    }

    next();
  }
}
