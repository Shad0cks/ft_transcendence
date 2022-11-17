import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './controllers/chat.controller';
import { Channel } from './entities/channel.entity';
import { ChannelMessage } from './entities/channelMessage.entity';
import { ChannelParticipant } from './entities/channelParticipant.entity';
import { ChatService } from './services/chat.service';
import { SocketEvent } from './socket/socketEvent';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, ChannelParticipant, ChannelMessage]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService, TypeOrmModule],
})
export class ChatModule {}
