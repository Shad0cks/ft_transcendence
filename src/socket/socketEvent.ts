import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
<<<<<<< HEAD
import { Server, Socket } from 'socket.io';
=======
import { Server } from 'socket.io';
import { CustomSocket } from 'src/adapters/socket.adapter';

>>>>>>> bc91d09d18587863057eaf402160600038e58ef9
import { ballDTO } from 'src/dto/ballGame.dto';
import { ChannelMessageDTO } from 'src/dto/channelMessage.dto';
import { GameObjDTO } from 'src/dto/game.dto';
import { newPlayerDTO } from 'src/dto/newPlayer.dto';
import { PlayerDTO } from 'src/dto/player.dto';
// import { ChatService } from 'src/services/chat.service';
import { Usersocket } from 'src/dto/user.dto';
import * as jwt from 'jsonwebtoken';
// import { UserService } from 'src/services/user.service';
import { CreateChannelDTO } from 'src/dto/createChannel.dto';
import { JoinChannelDTO } from 'src/dto/joinChannel.dto';


@WebSocketGateway()
export class SocketEvent {
  @WebSocketServer()
  server: Server;
  Usersockets: Array<Usersocket> = [];

  constructor (
    // private userService: UserService,
    // private chatService: ChatService,
  ) {}

  //connexion
<<<<<<< HEAD
  async handleConnection(client: Socket) {
=======
  handleConnection(client: CustomSocket) {
>>>>>>> bc91d09d18587863057eaf402160600038e58ef9
    console.log(`Client Connected: ${client.id}`);
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

  //recevoir un event (s'abboner à un message)
  // @SubscribeMessage(`message`)
  // handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket){
  //     // envoyer un event
  //     this.server.emit('message', client.id, data);
  // }

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

  // @SubscribeMessage('addMessage')
  // async onAddMessage(socket: Socket, message: ChannelMessageDTO) {
    // const Userfromchannel: Usersocket[] = getuserfromchannel(message.channel);
    // for(const user of Userfromchannel) {
    //   await this.server.to(user.socketid).emit('messageAdded', message);
    // return;
  // }

  // @SubscribeMessage('createChannel')
  // async onCreateChannel(socket: Socket, channel: CreateChannelDTO){
  //   await this.chatService.createChannel(channel);
  //   this.server.emit('createChannel'); // Ping pour que la page re Get les channel à la création d'un channel
  // }

  // @SubscribeMessage('joinChannel')
  // async onJoinChannel(socket: Socket, channel: JoinChannelDTO){
  //   await this.chatService.joinChannel(channel);
    // const Userfromchannel: Usersocket[] = getuserfromchannel(channel);
    // for(const user of Userfromchannel) {
    // await this.server.to(user.socketid).emit('joinChannel', nickname);
    // await this.server.to(socket.id).emit('messages', getMessageFromChannel(channel.channelname)); // envoye les messages 
  // }

  // @SubscribeMessage('leaveChannel')
  // async onLeaveChannel(socket: Socket, channel: JoinChannelDTO){
    // await this.chatService.leaveChannel(channel);
    // const Userfromchannel: Usersocket[] = getuserfromchannel(channel);
    // for(const user of Userfromchannel) {
    // await this.server.to(user.socketid).emit('joinChannel', nickname);
  // }
}

