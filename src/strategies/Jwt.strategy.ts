import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { UserService } from 'src/services/user.service';

export interface JwtPayload {
  nickname: string;
  login42: string;
  isAuthenticated: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    const extractJwtFromCookie = (req: Request): string => {
      let token: string = null;

      if (req && req.cookies) {
        token = req.cookies['jwt'];
      }
      return token;
    };

    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any): Promise<any> {
    if (!payload.isAuthenticated || payload.nickname == '') {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findOneByLogin42(payload.login42);

    request.user = user;
    return user;
  }
}
