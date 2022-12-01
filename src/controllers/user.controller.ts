import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReqUser } from 'src/decorators/user.decorator';
import { FriendDTO } from 'src/dto/friend.dto';
import { UserDTO } from 'src/dto/user.dto';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO remove
  @Post()
  async createUserAction(@Body() userDTO: UserDTO) {
    return this.userService.createUser(userDTO, userDTO.nickname);
  }

  @Get('channels')
  @UseGuards(JwtAuthGuard)
  async getChannelsAction(@ReqUser() user: User) {
    return this.userService.getChannels(user.nickname);
  }

  @Get(':nickname/data')
  @UseGuards(JwtAuthGuard)
  async findOneAction(@Param('nickname') nickname: string): Promise<UserDTO> {
    return this.userService.findOneByNickname(nickname, null);
  }

  @Put('nickname')
  @UseGuards(JwtAuthGuard)
  async editNicknameAction(
    @Body() userDTO: UserDTO,
    @ReqUser() user: User,
  ): Promise<User> {
    return await this.userService.editNickname(user, userDTO.nickname);
  }

  @Put('avatar')
  @UseGuards(JwtAuthGuard)
  async editAvatarAction(
    @Body() userDTO: UserDTO,
    @ReqUser() user: User,
  ): Promise<User> {
    return await this.userService.editAvatar(user, userDTO.avatar);
  }

  @Put('2fa')
  @UseGuards(JwtAuthGuard)
  async edit2faAction(
    @Body() userDTO: UserDTO,
    @ReqUser() user: User,
  ): Promise<User> {
    return await this.userService.edit2fa(
      user,
      userDTO.twofa_enabled,
      userDTO.twofa_secret,
    );
  }

  @Post('friends')
  @UseGuards(JwtAuthGuard)
  async addFriendAction(
    @Body() friendDTO: FriendDTO,
    @ReqUser() user: User,
  ): Promise<UserDTO> {
    return await this.userService.addFriend(user, friendDTO);
  }

  @Get('friends')
  @UseGuards(JwtAuthGuard)
  async getFriendsAction(@ReqUser() user: User) {
    return (
      await this.userService.findOneByNickname(user.nickname, {
        selectFriends: true,
      })
    ).friends;
  }

  @Delete('friends')
  @UseGuards(JwtAuthGuard)
  async deleteFriendAction(
    @Body() friendDTO: FriendDTO,
    @ReqUser() user: User,
  ) {
    return await this.userService.deleteFriend(user, friendDTO);
  }

  @Get(':nickname/matchs')
  @UseGuards(JwtAuthGuard)
  async getHistoryMatchs(@Param('nickname') nickname: string) {
    return (
      await this.userService.findOneByNickname(nickname, {
        selectMatchs: true,
      })
    ).matchs;
  }
}
