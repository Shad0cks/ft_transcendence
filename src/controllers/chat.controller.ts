import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Channel } from 'src/entities/channel.entity';
import { ChatService } from '../services/chat.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CreateChannelDTO } from 'src/dto/createChannel.dto';
import { JoinChannelDTO } from 'src/dto/joinChannel.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('channels')
  @UseGuards(JwtAuthGuard)
  async findAllAction(): Promise<Channel[]> {
    return await this.chatService.findAll();
  }

  @Post('channels')
  async createChannelAction(@Body() createChannelDTO: CreateChannelDTO) {
    return this.chatService.createChannel(createChannelDTO);
  }

  @Post('join')
  async joinChannelAction(@Body() joinChannelDTO: JoinChannelDTO) {
    return this.chatService.joinChannel(joinChannelDTO);
  }

  @Get('participants')
  async getParticipantsAction(@Body('channelName') channelName: string) {
    return this.chatService.getParticipantsNickname(channelName);
  }
  // TODO
  // get messages
}
