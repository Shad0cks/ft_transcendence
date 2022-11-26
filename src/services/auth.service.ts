import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/strategies/Jwt.strategy';
import { Response } from 'express';
import { User } from 'src/entities/user.entity';
import { UserDTO } from 'src/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  buildRedirectUrl(host: string, path: string, payload: JwtPayload): string {
    let res = host + path + '/?';
    let first = true;

    for (const property in payload) {
      if (!first) {
        res += '&';
      }
      first = false;
      res = res + property + '=' + encodeURIComponent(payload[property]);
    }
    return res;
  }

  async logUserIn(request: any, response: Response): Promise<void> {
    if (typeof request.user == 'undefined') {
      throw new BadRequestException();
    }
    // here the nickname in the DTO is the login42
    const userDTO: UserDTO = request.user;
    userDTO.avatar =
    'https://cdn.intra.42.fr/users/medium_' + userDTO.nickname + '.jpg';
    let user: User;

    try {
      user = await this.userService.findOneByLogin42(userDTO.nickname);
    } catch (error) {
      if (error instanceof NotFoundException) {
        user = await this.userService.createUser(userDTO, userDTO.nickname);
      } else {
        throw error;
      }
    }

    const payload: JwtPayload = {
      nickname: user.nickname,
      login42: user.login42,
      isAuthenticated: !user.twofa_enabled,
    };
    const jwt = this.jwtService.sign(payload);
    response.cookie('jwt', jwt, { httpOnly: true });
    if (!user.twofa_enabled) {
      response.redirect(
        this.buildRedirectUrl('http://localhost:3000', '/callback', payload),
      );
    } else {
      response.redirect(
        this.buildRedirectUrl('http://localhost:3000', '/2fa', payload),
      );
    }
  }

  async valide2fa( request: any, response: Response ): Promise<void> {
    if (typeof request.user== 'undefined') {
      throw new BadRequestException();
    }
    const userDTO: UserDTO = request.user;
    userDTO.avatar =
    'https://cdn.intra.42.fr/users/medium_' + userDTO.nickname + '.jpg';
    let user: User;

    try {
      user = await this.userService.findOneByLogin42(userDTO.nickname);
    } catch (error) {
        throw error;
    }

    const payload: JwtPayload = {
      nickname: user.nickname,
      login42: user.login42,
      isAuthenticated: true,
    };
    const jwt = this.jwtService.sign(payload);
    response.cookie('jwt', jwt, { httpOnly: true });
    console.log(this.buildRedirectUrl('http://localhost:3000', '/callback', payload));
    response.redirect(this.buildRedirectUrl('http://localhost:3000', '/callback', payload),);
  }
}
