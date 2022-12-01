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
  async getMessagesAction(
    @ReqUser() user: User,
    @Param('name') channelName: string,
  ) {
    return this.chatService.getChannelMessages(user, channelName);
  }
}
