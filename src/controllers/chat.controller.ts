import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Channel } from 'src/entities/channel.entity';
import { ChatService } from '../services/chat.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ReqUser } from 'src/decorators/user.decorator';
import { User } from 'src/entities/user.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('channels')
  @UseGuards(JwtAuthGuard)
  async findAllAction(): Promise<Channel[]> {
    return await this.chatService.findAll();
  }

  @Get('channels/:name/messages')
  @UseGuards(JwtAuthGuard)
  async getChannelMessagesAction(
    @ReqUser() user: User,
    @Param('name') channelName: string,
  ) {
    return await this.chatService.getChannelMessages(user, channelName);
  }

  @Get('direct_messages')
  @UseGuards(JwtAuthGuard)
  async getDirectMessagesAction(@ReqUser() user: User) {
    return await this.chatService.getDirectMessages(user);
  }

  @Get('direct_messages/:senderNickname')
  @UseGuards(JwtAuthGuard)
  async getDirectMessagesFromUserAction(
    @ReqUser() user: User,
    @Param('senderNickname') senderNickname: string,
  ) {
    return await this.chatService.getDirectMessagesFromUser(
      user,
      senderNickname,
    );
  }

  @Get('channels/:channelName/admins')
  @UseGuards(JwtAuthGuard)
  async getChannelAdminsNicknamesAction(
    @ReqUser() user: User,
    @Param('channelName') channelName: string,
  ) {
    return await this.chatService.getChannelAdminsNicknames(user, channelName);
  }
}
