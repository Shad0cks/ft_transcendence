import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserDTO } from 'src/dto/user.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':nickname')
  @UseGuards(JwtAuthGuard)
  async findOneAction(@Param('nickname') nickname: string): Promise<UserDTO> {
    return this.userService.findOneByNickname(nickname);
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

  @Put(':id/2fa')
  async edit2faAction(
    @Param('id') id: string,
    @Body() userDTO: UserDTO,
  ): Promise<void> {
    await this.userService.edit2fa(id, userDTO.twofa_enabled);
  }
}
