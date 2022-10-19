import { Body, Controller, Post } from '@nestjs/common';
import { UserDTO } from 'src/dto/user.dto';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUserAction(@Body() userDTO: UserDTO): Promise<void> {
    // TODO
    // extract the login42 from the auth token
    const login42 = 'gartaud';

    await this.userService.createUser(userDTO, login42);
  }
}
