import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './controllers/chat.controller';
import { Channel } from './entities/channel.entity';
import { ChannelMessage } from './entities/channelMessage.entity';
import { ChannelParticipant } from './entities/channelParticipant.entity';
import { ChatService } from './services/chat.service';
import { UserModule } from './user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, ChannelParticipant, ChannelMessage]),
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService, TypeOrmModule],
})
export class ChatModule {}
