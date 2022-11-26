import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateChannelDTO } from 'src/dto/createChannel.dto';
import { ChannelDTO } from 'src/dto/channel.dto';
import { Channel } from 'src/entities/channel.entity';
import { ChatService } from '../services/chat.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('channels')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Channel[]> {
    return await this.chatService.findAll();
  }

  @Post('channels')
  @UseGuards(JwtAuthGuard)
  createChannelAction(
    @Body() createChannelDTO: CreateChannelDTO,
  ): Promise<ChannelDTO> {
    return this.chatService.createChannel(createChannelDTO);
  }

  // TODO
  // get messages
}
