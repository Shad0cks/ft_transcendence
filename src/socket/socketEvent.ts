import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CustomSocket } from 'src/adapters/socket.adapter';
import { ballDTO } from 'src/dto/ballGame.dto';
import { GameObjDTO } from 'src/dto/game.dto';
import { newPlayerDTO } from 'src/dto/newPlayer.dto';
import { PlayerDTO } from 'src/dto/player.dto';
import { Usersocket } from 'src/dto/user.dto';
import { ConnectedUsers } from './connectedUsers';
import { UserService } from 'src/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from 'src/services/chat.service';
import { ChannelMessageDTO } from 'src/dto/channelMessage.dto';
import { CreateChannelDTO } from 'src/dto/createChannel.dto';
import { JoinChannelDTO } from 'src/dto/joinChannel.dto';
import { ChannelAdminDTO } from 'src/dto/channelAdmin.dto';
import { ChannelRestrictionDTO } from 'src/dto/channelRestriction.dto';
import { EditWhitelistDTO } from 'src/dto/editWhitelist.dto';
import { ChannelPrivacyDTO } from 'src/dto/channelPrivacy.dto';
import { ChannelPasswordDTO } from 'src/dto/channelPassword.dto';
import { PrivateMessageDTO } from 'src/dto/privateMessage.dto';

@WebSocketGateway()
export class SocketEvent {
  @WebSocketServer()
  server: Server;
  Usersockets: Array<Usersocket> = [];

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private connectedUser: ConnectedUsers,
  ) {}

  //connexion
  handleConnection(client: CustomSocket) {
    console.log(`Client Connected: ${client.id}`);
    // console.log(this.connectedUser.get());
    // const decodedtoken  = await jwt.verify(client.handshake.headers.authorization, String(process.env.JWT_SECRET));
    // const TempUsersocket = await this.userService.createUsersocket(decodedtoken.nickname, client.id);
    // client.data.user = this.userService.findOneByNickname(String(decodedtoken.nickname), null);
    // this.Usersockets.push(TempUsersocket);
    // console.log(`Client Nickname: ${TempUsersocket.nickname}`);
  }

  //deconnexion

  handleDisconnect(client: CustomSocket) {
    console.log(`Client disConnected: ${client.id}`);
  }

  @SubscribeMessage('playermove') handleEvent(@MessageBody() data: PlayerDTO) {
    this.server.emit('playermove', data);
  }

  @SubscribeMessage('gameOption') GameEvent(@MessageBody() data: GameObjDTO) {
    if (data === null) return;
    this.server.emit('gameOption', data);
  }

  @SubscribeMessage('ballPos') BallEvent(@MessageBody() data: ballDTO) {
    this.server.emit('ballPos', data);
  }

  @SubscribeMessage('newPlayer') PlayerJoin(@MessageBody() data: newPlayerDTO) {
    this.server.emit('newPlayer', data);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: CustomSocket, message: ChannelMessageDTO) {
    // const Userfromchannel: Usersocket[] = this.chatService.getuserfromchannel(message.channel);
    // for(const user of Userfromchannel) {
    //TODO Check si le message ne parvient pas de quelqu'un bloqué.
    //   await this.server.to(user.socketid).emit('messageAdded', message);
    this.chatService.registerChannelMessage(message);
    return;
  }

  //TODO Message privée.
  @SubscribeMessage('addMessagePrivate')
  async onAddMessagePrivate(socket: CustomSocket, message: PrivateMessageDTO) {
    await this.server
      .to(this.connectedUser.getSocketId(message.receiverNickname))
      .emit('messageprivateAdded');
    
    // this.chatService.registerPrivateMessage(message);
  }

  @SubscribeMessage('createChannel')
  async onCreateChannel(socket: CustomSocket, channel: CreateChannelDTO) {
    await this.chatService.createChannel(channel);
    this.server.emit('createChannel'); // Ping pour que la page re Get les channel à la création d'un channel
  }

  @SubscribeMessage('AddAdmin')
  async onAddAdmin(
    socket: CustomSocket,
    admin: ChannelAdminDTO,
    newadmin: ChannelAdminDTO,
  ) {
    if (this.chatService.isAdmin(admin)) this.chatService.addAdmin(newadmin);
  }

  @SubscribeMessage('AddRestriction')
  async onAddRestriction(
    socket: CustomSocket,
    admin: ChannelAdminDTO,
    restriction: ChannelRestrictionDTO,
  ) {
    if (this.chatService.isAdmin(admin))
      this.chatService.addRestriction(restriction);
  }

  @SubscribeMessage('AddToWhitelist')
  async onAddToWhitelist(
    socket: CustomSocket,
    admin: ChannelAdminDTO,
    whitelist: EditWhitelistDTO,
  ) {
    if (this.chatService.isAdmin(admin))
      this.chatService.addToWhitelist(whitelist);
  }

  @SubscribeMessage('RemoveToWhitelist')
  async onRemoveToWhitelist(
    socket: CustomSocket,
    admin: ChannelAdminDTO,
    whitelist: EditWhitelistDTO,
  ) {
    if (this.chatService.isAdmin(admin))
      this.chatService.addToWhitelist(whitelist);
  }

  @SubscribeMessage('ChangeChannelToPrivacy')
  async onChangeChannelToPrivacy(
    socket: CustomSocket,
    admin: ChannelAdminDTO,
    channel: ChannelPrivacyDTO,
  ) {
    if (this.chatService.isAdmin(admin))
      this.chatService.changeChannelPrivacy(channel);
  }

  @SubscribeMessage('EditChannelPassword')
  async onEditChannelPassword(
    socket: CustomSocket,
    admin: ChannelAdminDTO,
    password: ChannelPasswordDTO,
  ) {
    if (this.chatService.isAdmin(admin))
      this.chatService.editChannelPassword(password);
  }

  //TODO Invite une game ou chat

  // @SubscribeMessage('joinChannel')
  async onJoinChannel(socket: CustomSocket, channel: JoinChannelDTO){
  // check si le channel est privé ou protected / public
  //   await this.chatService.joinChannel(channel);
  //   const Userfromchannel: Usersocket[] = getuserfromchannel(channel.channelName);
  //   for(const user of Userfromchannel) {
  //     await this.server.to(user.socketid).emit('joinChannel', channel);
    // await this.server.to(socket.id).emit('messages', getMessageFromChannel(channel.channelName)); // envoye les messages
  // }

  //   @SubscribeMessage('leaveChannel')
  //   async onLeaveChannel(socket: CustomSocket, channel: JoinChannelDTO){
  //     await this.chatService.leaveChannel(channel);
  //     const Userfromchannel: Usersocket[] = getuserfromchannel(channel);
  //     for(const user of Userfromchannel) {
  //       await this.server.to(user.socketid).emit('leaveChannel', channel);
  //   }
}
