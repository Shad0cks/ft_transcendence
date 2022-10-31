import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ballDTO } from 'src/dto/ballGame.dto';
import { GameObjDTO } from 'src/dto/game.dto';
import { newPlayerDTO } from 'src/dto/newPlayer.dto';
import { PlayerDTO } from 'src/dto/player.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketEvent {
  @WebSocketServer()
  server: Server;

  //connexion
  handleConnection(client: Socket) {
    console.log(`Client Connected: ${client.id}`);
  }

  //deconnexion

  handleDisconnect(client: Socket) {
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
    if (data === null) return ;
    this.server.emit('gameOption', data);
  }

  @SubscribeMessage('ballPos') BallEvent(@MessageBody() data: ballDTO) {
    
    this.server.emit('ballPos', data);
  }

  @SubscribeMessage('newPlayer') PlayerJoin(@MessageBody() data: newPlayerDTO) {
    this.server.emit('newPlayer', data);
  }


}
