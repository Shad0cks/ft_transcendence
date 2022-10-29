import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDTO } from 'src/dto/user.dto';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/strategies/Jwt.strategy';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async logUserIn(request: any, response: Response): Promise<void> {
    if (typeof request.user == 'undefined') {
      throw new BadRequestException();
    }
    let user: UserDTO = request.user;
    try {
      user = await this.userService.findOneByNickname(user.nickname);
    } catch (error) {
      if (error instanceof NotFoundException) {
        await this.userService.createUser(user);
      } else {
        throw error;
      }
    }

    const payload: JwtPayload = {
      nickname: user.nickname,
      isAuthenticated: !user.twofa_enabled,
    };
    const jwt = this.jwtService.sign(payload);
    response.cookie('jwt', jwt, { httpOnly: true });
    response.redirect('http://localhost:3000');
  }
}
