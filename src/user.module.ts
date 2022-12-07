import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { ChannelMessage } from './entities/channelMessage.entity';
import { ChannelParticipant } from './entities/channelParticipant.entity';
import { ChatRestriction } from './entities/chatRestriction.entity';
import { User } from './entities/user.entity';
import { PongMatch } from './entities/pongMatch.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ChannelParticipant,
      ChannelMessage,
      ChatRestriction,
      PongMatch,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
