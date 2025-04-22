import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.databaseService.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
