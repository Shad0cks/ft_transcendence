import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './controllers/chat.controller';
import { Channel } from './entities/channel.entity';
import { ChatService } from './services/chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Channel])],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService, TypeOrmModule],
})
export class ChatModule {}
