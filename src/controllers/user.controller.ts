import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDTO> {
    return this.userService.findOne(id);
  }

  @Put(':id/nickname')
  async editNicknameAction(
    @Param('id') id: string,
    @Body() userDTO: UserDTO,
  ): Promise<void> {
    return await this.userService.editNickname(id, userDTO.nickname);
  }

  @Put(':id/avatar')
  async editAvatarAction(
    @Param('id') id: string,
    @Body() userDTO: UserDTO,
  ): Promise<void> {
    return await this.userService.editAvatar(id, userDTO.avatar);
  }
}
