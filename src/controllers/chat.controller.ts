import { Body, Controller, Post } from '@nestjs/common';
import { ChannelDTO } from 'src/dto/channel.dto';
import { ChatService } from '../services/chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('channels')
  createChannelAction(@Body() channelDTO: ChannelDTO): void {
    this.chatService.createChannel(channelDTO);
  }
}
