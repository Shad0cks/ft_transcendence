import { Module } from '@nestjs/common';
import { ChatModule } from 'src/chat.module';
import { UserService } from 'src/services/user.service';
import { ConnectedUsers } from './connectedUsers';
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
import { PrivateMessageDTO } from 'src/dto/privateMessage.dto';

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
      PrivateMessageDTO,
    ]),
    ChatModule,
    UserModule,
  ],
  providers: [SocketEvent, ConnectedUsers, UserService],
})
export class SocketModule {}
