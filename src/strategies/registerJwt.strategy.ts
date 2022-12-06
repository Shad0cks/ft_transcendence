import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { UserDTO } from 'src/dto/user.dto';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/services/user.service';

export interface JwtPayload {
  nickname: string;
  login42: string;
  isAuthenticated: boolean;
}

@Injectable()
export class registerJwtStrategy extends PassportStrategy(
  Strategy,
  'registerjwt',
) {
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
    const user: UserDTO = {
      nickname: payload.login42,
      twofa_enabled: false,
      twofa_secret: '',
      avatar: '',
      wins: 0,
      losses: 0,
    };

    request.user = user;
    return user;
  }
}
