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

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('GameStart')
  async OnStartGame(socket: CustomSocket, player1: string, player2: string) {
    // TODO CreateGame
    // this.server.to(Clients.getSocketId(player1)).emit('GameStart', Game);
    // this.server.to(Clients.getSocketId(player2)).emit('GameStart', Game);
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
}
