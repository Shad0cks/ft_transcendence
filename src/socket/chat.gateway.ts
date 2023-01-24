import {
  //MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CustomSocket } from 'src/adapters/socket.adapter';
import { ConnectedUsers } from './connectedUsers';
import { UserService } from 'src/services/user.service';
import { ChatService } from 'src/services/chat.service';
import { ChannelMessageDTO } from 'src/dto/channelMessage.dto';
import { CreateChannelDTO } from 'src/dto/createChannel.dto';
import { ChannelAdminDTO } from 'src/dto/channelAdmin.dto';
import { ChannelRestrictionDTO } from 'src/dto/channelRestriction.dto';
import { EditWhitelistDTO } from 'src/dto/editWhitelist.dto';
import { ChannelPrivacyDTO } from 'src/dto/channelPrivacy.dto';
import { ChannelPasswordDTO } from 'src/dto/channelPassword.dto';
import { JoinChannelDTO } from 'src/dto/joinChannel.dto';
import { LeaveChannelDTO } from 'src/dto/leaveChannel.dto';
import { Clients } from 'src/adapters/socket.adapter';
import { DirectMessageDTO } from 'src/dto/directMessage.dto';
//import { GameObjDTO } from 'src/dto/game.dto';
//import { PlayerDTO } from 'src/dto/player.dto';
//import { ballDTO } from 'src/dto/ballGame.dto';
//import { newPlayerDTO } from 'src/dto/newPlayer.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private connectedUser: ConnectedUsers,
  ) {}

  private userstat = new Map<string, string>();

  //connexion
  handleConnection(client: CustomSocket) {
    this.userstat.set(client.user.nickname, 'online');
    for (const user of Clients.get()) {
      this.server
        .to(Clients.getSocketId(user[0]))
        .emit('StatusUpdate', JSON.stringify(Array.from(this.userstat)));
    }
    client;
  }

  //deconnexion
  handleDisconnect(client: CustomSocket) {
    this.userstat.delete(client.user.nickname);
    for (const user of Clients.get()) {
      this.server
        .to(Clients.getSocketId(user[0]))
        .emit('StatusUpdate', JSON.stringify(Array.from(this.userstat)));
    }
  }

  @SubscribeMessage('SetStatus')
  async SetStatus(client: CustomSocket, stat: string) {
    this.userstat.set(client.user.nickname, stat);
    for (const user of Clients.get()) {
      this.server
        .to(Clients.getSocketId(user[0]))
        .emit('StatusUpdate', JSON.stringify(Array.from(this.userstat)));
    }
    return;
  }

  @SubscribeMessage('ChangeNickname')
  async ChanegNickname(client: CustomSocket, oldnickname: string) {
    const stat = this.userstat.get(oldnickname);
    this.userstat.delete(oldnickname);
    this.userstat.set(client.user.nickname, stat);
    for (const user of Clients.get()) {
      this.server
        .to(Clients.getSocketId(user[0]))
        .emit('StatusUpdate', JSON.stringify(Array.from(this.userstat)));
    }
    return;
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: CustomSocket, messageDTO: ChannelMessageDTO) {
    if (messageDTO.message.length > 255) return;
    if (messageDTO.senderNickname === socket.user.nickname) {
      const Userfromchannel = await this.chatService.getParticipantsNickname(
        messageDTO.channelName,
      );
      const messageEntity = await this.chatService.registerChannelMessage(
        messageDTO,
      );
      messageDTO.sent_at = messageEntity.sent_at;
      for (const user of Userfromchannel) {
        const UserBlocked = this.userService.getBlockedNicknames(user);
        if (!(await UserBlocked).includes(messageDTO.senderNickname)) {
          this.server
            .to(Clients.getSocketId(user))
            .emit('messageAdded', messageDTO);
        }
      }
    }
    return;
  }

  //TODO Message privée.
  @SubscribeMessage('addMessagePrivate')
  async onAddMessagePrivate(socket: CustomSocket, message: DirectMessageDTO) {
    if (message.message.length > 255) return;
    if (message.senderNickname === socket.user.nickname) {
      try {
        const blockedUsers = await this.userService.getBlockedNicknames(
          message.receiverNickname,
        );
        if (!(await blockedUsers).includes(message.senderNickname)) {
          const messageEntity = await this.chatService.registerDirectMessage(
            message,
          );
          message.sent_at = messageEntity.sent_at;
          this.server
            .to(Clients.getSocketId(message.receiverNickname))
            .emit('messageprivateAdded', message);
        }
        this.server.to(socket.id).emit('messageprivateAdded', message);
      } catch (error) {}
    }
  }

  @SubscribeMessage('createChannel')
  async onCreateChannel(socket: CustomSocket, channel: CreateChannelDTO) {
    if (channel.creatorNickname === socket.user.nickname) {
      await this.chatService.createChannel(channel);
      this.server.emit('createChannel'); // Ping pour que la page re Get les channel à la création d'un channel
    }
  }

  @SubscribeMessage('AddAdmin')
  async onAddAdmin(socket: CustomSocket, newadmin: ChannelAdminDTO) {
    this.chatService.addAdmin(newadmin);
    const Userfromchannel = await this.chatService.getParticipantsNickname(
      newadmin.channelName,
    );
    for (const user of Userfromchannel) {
      this.server.to(Clients.getSocketId(user)).emit('NewAdmin', newadmin);
    }
  }

  @SubscribeMessage('AddRestriction')
  async onAddRestriction(
    socket: CustomSocket,
    restriction: ChannelRestrictionDTO,
  ) {
    if (restriction.userNickname === socket.user.nickname) {
      try {
        await this.chatService.addRestriction(restriction);
      } catch (error) {
        this.server.to(socket.id).emit('error', error.message);
      }
    }
  }

  @SubscribeMessage('AddToWhitelist')
  async onAddToWhitelist(socket: CustomSocket, whitelist: EditWhitelistDTO) {
    await this.chatService.addToWhitelist(whitelist);
  }

  @SubscribeMessage('RemoveToWhitelist')
  async onRemoveToWhitelist(socket: CustomSocket, whitelist: EditWhitelistDTO) {
    this.chatService.removeFromWhitelist(whitelist);
    const Userfromchannel = await this.chatService.getParticipantsNickname(
      whitelist.channelName,
    );
    if (Userfromchannel.find((x) => x === whitelist.userNickname))
      this.chatService.leaveChannel({
        channelName: whitelist.channelName,
        userNickname: whitelist.userNickname,
      });
  }

  @SubscribeMessage('ChangeChannelToPrivacy')
  async onChangeChannelToPrivacy(
    socket: CustomSocket,
    channel: ChannelPrivacyDTO,
  ) {
    this.chatService.changeChannelPrivacy(channel);
    const Userfromchannel = await this.chatService.getParticipantsNickname(
      channel.name,
    );
    for (const user of Userfromchannel) {
      this.server.to(Clients.getSocketId(user)).emit('channelEdited');
    }
  }

  @SubscribeMessage('EditChannelPassword')
  async onEditChannelPassword(
    socket: CustomSocket,
    password: ChannelPasswordDTO,
  ) {
    if (password.password.length > 10) return;
    this.chatService.editChannelPassword(password);
  }

  //TODO Invite une game

  @SubscribeMessage('joinChannel')
  async onJoinChannel(socket: CustomSocket, channel: JoinChannelDTO) {
    if (channel.userNickname === socket.user.nickname) {
      await this.chatService.joinChannel(channel);
      const userfromchannel: Promise<string[]> =
        this.chatService.getParticipantsNickname(channel.channelName);
      for (const user of await userfromchannel) {
        await this.server
          .to(Clients.getSocketId(user))
          .emit('joinChannel', channel);
      }
    }
  }

  @SubscribeMessage('GetUserFromChannel')
  async onGetUserFromChannel(socket: CustomSocket, channel: string) {
    const Userfromchannel: Promise<string[]> =
      this.chatService.getParticipantsNickname(channel);
    const Res = await Userfromchannel;
    this.server.to(socket.id).emit('GetUserFromChannel', Res);
  }

  @SubscribeMessage('leaveChannel')
  async onLeaveChannel(socket: CustomSocket, channel: LeaveChannelDTO) {
    if (channel.userNickname === socket.user.nickname) {
      await this.chatService.leaveChannel(channel);
      const Userfromchannel: Promise<string[]> =
        this.chatService.getParticipantsNickname(channel.channelName);
      for (const user of await Userfromchannel) {
        this.server.to(user).emit('leaveChannel', channel);
      }
      this.server.to(socket.id).emit('leaveChannel', channel);
    }
  }
}
