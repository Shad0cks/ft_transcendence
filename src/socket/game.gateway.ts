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
import { Clients } from 'src/adapters/socket.adapter';
import { Socket } from 'dgram';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: CustomSocket) {
    console.log('Game:', client.id);
  }

  handleDisconnect(client: CustomSocket) {}

  @SubscribeMessage('GameStart')
  async OnStartGame(socket: CustomSocket, player1: string, player2: string) {
    // TODO CreateGame
    // this.server.to(Clients.getSocketId(player1)).emit('GameStart', Game);
    // this.server.to(Clients.getSocketId(player2)).emit('GameStart', Game);

    // fixing style
    socket;
    player1;
    player2;
  }
}
