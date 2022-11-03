import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserDTO } from 'src/dto/user.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UserService } from '../services/user.service';

@Controller('user/:nickname')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findOneAction(@Param('nickname') nickname: string): Promise<UserDTO> {
    return this.userService.findOneByNickname(nickname);
  }

  @Put('nickname')
  @UseGuards(JwtAuthGuard)
  async editNicknameAction(
    @Param('nickname') nickname: string,
    @Body() userDTO: UserDTO,
  ): Promise<void> {
    return await this.userService.editNickname(nickname, userDTO.nickname);
  }

  @Put('avatar')
  async editAvatarAction(
    @Param('nickname') nickname: string,
    @Body() userDTO: UserDTO,
  ): Promise<void> {
    return await this.userService.editAvatar(nickname, userDTO.avatar);
  }

  @Put('2fa')
  async edit2faAction(
    @Param('id') id: string,
    @Body() userDTO: UserDTO,
  ): Promise<void> {
    await this.userService.edit2fa(id, userDTO.twofa_enabled);
  }
}
