import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Channel } from 'src/entities/channel.entity';
import { ChatService } from '../services/chat.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CreateChannelDTO } from 'src/dto/createChannel.dto';
import { JoinChannelDTO } from 'src/dto/joinChannel.dto';
import { ChannelMessageDTO } from 'src/dto/channelMessage.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('channels')
  @UseGuards(JwtAuthGuard)
  async findAllAction(): Promise<Channel[]> {
    return await this.chatService.findAll();
  }

  // TODO remove
  @Post('channels')
  async createChannelAction(@Body() createChannelDTO: CreateChannelDTO) {
    return this.chatService.createChannel(createChannelDTO);
  }

  // TODO remove
  @Post('join')
  async joinChannelAction(@Body() joinChannelDTO: JoinChannelDTO) {
    return this.chatService.joinChannel(joinChannelDTO);
  }

  // TODO remove
  @Get('participants')
  async getParticipantsAction(@Body('channelName') channelName: string) {
    return this.chatService.getParticipantsNickname(channelName);
  }

  // TODO remove
  @Post('message')
  async registerChannelMessageAction(
    @Body() channelMessageDTO: ChannelMessageDTO,
  ) {
    return this.chatService.registerChannelMessage(channelMessageDTO);
  }
}
