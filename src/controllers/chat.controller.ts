import { Controller, Get, UseGuards } from '@nestjs/common';
import { Channel } from 'src/entities/channel.entity';
import { ChatService } from '../services/chat.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('channels')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Channel[]> {
    console.log('request');
    return await this.chatService.findAll();
  }

  // TODO
  // get messages
}
