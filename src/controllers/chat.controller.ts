import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChannelDTO } from 'src/dto/channel.dto';
import { Channel } from 'src/entities/channel.entity';
import { ChatService } from '../services/chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('channels')
  async findAll(): Promise<Channel[]> {
    return await this.chatService.findAll();
  }

  @Post('channels')
  createChannelAction(@Body() channelDTO: ChannelDTO): Promise<ChannelDTO> {
    return this.chatService.createChannel(channelDTO);
  }
}
