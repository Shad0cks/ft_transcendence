import {
  MessageBody,
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
import { GameObjDTO } from 'src/dto/game.dto';
import { PlayerDTO } from 'src/dto/player.dto';
import { ballDTO } from 'src/dto/ballGame.dto';
import { newPlayerDTO } from 'src/dto/newPlayer.dto';

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
    //console.log(`Client Connected: ${client.id}`);
    // console.log(this.connectedUser.get());
    // const decodedtoken  = await jwt.verify(client.handshake.headers.authorization, String(process.env.JWT_SECRET));
    // const TempUsersocket = await this.userService.createUsersocket(decodedtoken.nickname, client.id);
    // client.data.user = this.userService.findOneByNickname(String(decodedtoken.nickname), null);
    // this.Usersockets.push(TempUsersocket);
    // console.log(`Client Nickname: ${TempUsersocket.nickname}`);
    this.userstat.set(client.user.login42, 'online');
    for (const user of Clients.get()) {
      this.server
        .to(Clients.getSocketId(user[0]))
        .emit('StatusUpdate', JSON.stringify(Array.from(this.userstat)));
    }
    client;
  }

  //deconnexion
  handleDisconnect(client: CustomSocket) {
    this.userstat.delete(client.user.login42);
    for (const user of Clients.get()) {
      this.server
        .to(Clients.getSocketId(user[0]))
        .emit('StatusUpdate', JSON.stringify(Array.from(this.userstat)));
    }
  }

  @SubscribeMessage('SetStatus')
  async SetStatus(client: CustomSocket, stat: string) {
    this.userstat.set(client.user.login42, stat);
    for (const user of Clients.get()) {
      this.server
        .to(Clients.getSocketId(user[0]))
        .emit('StatusUpdate', JSON.stringify(Array.from(this.userstat)));
    }
    return;
  }

  @SubscribeMessage('playermove') handleEvent(@MessageBody() data: PlayerDTO) {
    this.server.emit('playermove', data);
  }

  @SubscribeMessage('gameOption')
  async ongameOption(socket: CustomSocket, data: GameObjDTO) {
    if (data === null) return;
    this.server.emit('gameOption', data);
  }

  @SubscribeMessage('ballPos') BallEvent(@MessageBody() data: ballDTO) {
    this.server.emit('ballPos', data);
  }

  @SubscribeMessage('newPlayer') PlayerJoin(@MessageBody() data: newPlayerDTO) {
    this.server.emit('newPlayer', data);
  }

  @SubscribeMessage('GamePause') gamePause(
    @MessageBody() data: { gameID: string; pause: boolean },
  ) {
    this.server.emit('GamePause', data);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: CustomSocket, messageDTO: ChannelMessageDTO) {
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
    return;
  }

  //TODO Message privée.
  @SubscribeMessage('addMessagePrivate')
  async onAddMessagePrivate(socket: CustomSocket, message: DirectMessageDTO) {
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

  @SubscribeMessage('createChannel')
  async onCreateChannel(socket: CustomSocket, channel: CreateChannelDTO) {
    await this.chatService.createChannel(channel);
    this.server.emit('createChannel'); // Ping pour que la page re Get les channel à la création d'un channel
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
    try {
      await this.chatService.addRestriction(restriction);
    } catch (error) {
      this.server.to(socket.id).emit('error', error.message);
    }
  }

  @SubscribeMessage('AddToWhitelist')
  async onAddToWhitelist(socket: CustomSocket, whitelist: EditWhitelistDTO) {
    await this.chatService.addToWhitelist(whitelist);
    this.chatService.joinChannel({
      channelName: whitelist.channelName,
      userNickname: whitelist.userNickname,
      isAdmin: false,
      password: '',
    });
  }

  @SubscribeMessage('RemoveToWhitelist')
  async onRemoveToWhitelist(socket: CustomSocket, whitelist: EditWhitelistDTO) {
    this.chatService.removeFromWhitelist(whitelist);
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
    this.chatService.editChannelPassword(password);
  }

  //TODO Invite une game

  @SubscribeMessage('InvitationGame')
  async OnInvitationGame(
    socket: CustomSocket,
    InvitationSender: string,
    InvitationReceiver: string,
  ) {
    this.server
      .to(Clients.getSocketId(InvitationReceiver))
      .emit('InvitationGame', InvitationSender);
  }

  @SubscribeMessage('joinChannel')
  async onJoinChannel(socket: CustomSocket, channel: JoinChannelDTO) {
    await this.chatService.joinChannel(channel);
    const userfromchannel: Promise<string[]> =
      this.chatService.getParticipantsNickname(channel.channelName);
    for (const user of await userfromchannel) {
      await this.server
        .to(Clients.getSocketId(user))
        .emit('joinChannel', channel);
    }
    // await this.server.to(socket.id).emit('messages', getMessageFromChannel(channel.channelName)); // envoye les messages
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
    await this.chatService.leaveChannel(channel);
    const Userfromchannel: Promise<string[]> =
      this.chatService.getParticipantsNickname(channel.channelName);
    for (const user of await Userfromchannel) {
      this.server.to(user).emit('leaveChannel', channel);
    }
    this.server.to(socket.id).emit('leaveChannel', channel);
  }
}
