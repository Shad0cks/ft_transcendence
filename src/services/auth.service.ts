import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDTO } from 'src/dto/user.dto';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async logUserIn(request: any): Promise<void> {
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
  }
}
