import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth.module';
import { ChatModule } from 'src/chat.module';
import { ChatService } from 'src/services/chat.service';
import { UserService } from 'src/services/user.service';
import { connectedUsers } from './connectedUsers';
import { SocketEvent } from './socketEvent';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user.module';
import { ChannelAdminDTO } from 'src/dto/channelAdmin.dto';
import { CreateChannelDTO } from 'src/dto/createChannel.dto';
import { newPlayerDTO } from 'src/dto/newPlayer.dto';
import { PlayerDTO } from 'src/dto/player.dto';
import { GameObjDTO } from 'src/dto/game.dto';
import { JoinChannelDTO } from 'src/dto/joinChannel.dto';
import { ChannelRestrictionDTO } from 'src/dto/channelRestriction.dto';
import { EditWhitelistDTO } from 'src/dto/editWhitelist.dto';
import { ChannelPrivacyDTO } from 'src/dto/channelPrivacy.dto';
import { ChannelPasswordDTO } from 'src/dto/channelPassword.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChannelAdminDTO,
      CreateChannelDTO,
      newPlayerDTO,
      PlayerDTO,
      GameObjDTO,
      JoinChannelDTO,
      ChannelRestrictionDTO,
      EditWhitelistDTO,
      ChannelPrivacyDTO,
      ChannelPasswordDTO,
    ]),
    ChatModule,
    UserModule,
  ],
  providers: [SocketEvent, connectedUsers, UserService],
})
export class SocketModule {}
