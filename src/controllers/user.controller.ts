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
import { FaSetDTO } from 'src/dto/2faSet.dto';
import { BlockedDTO } from 'src/dto/blocked.dto';
import { FriendDTO } from 'src/dto/friend.dto';
import { UserDTO } from 'src/dto/user.dto';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  async edit2faAction(@Body() FaSetDTO: FaSetDTO, @ReqUser() user: User) {
    if (FaSetDTO.data.length > 30) return;
    if (FaSetDTO.stat) {
      return await this.userService.edit2fa(user, FaSetDTO.data);
    } else {
      return await this.userService.unset2fa(user, FaSetDTO.data);
    }
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

  @Post('blocked')
  @UseGuards(JwtAuthGuard)
  async blockUserAction(
    @Body() blockedDTO: BlockedDTO,
    @ReqUser() user: User,
  ): Promise<User> {
    return await this.userService.blockUser(user, blockedDTO);
  }

  @Get('blocked')
  @UseGuards(JwtAuthGuard)
  async getBlockedAction(@ReqUser() user: User) {
    return (
      await this.userService.findOneByNickname(user.nickname, {
        selectBlocked: true,
      })
    ).blocked;
  }

  @Delete('blocked')
  @UseGuards(JwtAuthGuard)
  async unblockUserAction(
    @Body() blockedDTO: BlockedDTO,
    @ReqUser() user: User,
  ) {
    return await this.userService.unblockUser(user, blockedDTO);
  }

  @Get(':nickname/matches')
  @UseGuards(JwtAuthGuard)
  async getPongMatchesAction(@Param('nickname') nickname: string) {
    return await this.userService.getPongMatches(nickname);
  }
}
