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
import { GameService } from 'src/services/game.service';
import { Clients } from 'src/adapters/socket.adapter';
import { Socket } from 'dgram';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: Server;
  constructor(private gameService: GameService) {}

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

  @SubscribeMessage('playermove')
  async onPlayermove(
    socket: CustomSocket,
    gameid: string,
    player: string,
    otherplayer: string,
    barremoove: number,
  ) {
    this.server.to(otherplayer).emit('playermove', barremoove);
    this.gameService.playerbarremoove(gameid, player, barremoove);
  }

  @SubscribeMessage('gameOption') GameEvent(@MessageBody() data: GameObjDTO) {
    if (data === null) return;
    this.server.emit('gameOption', data);
  }

  @SubscribeMessage('GameStart') async BallEvent(gameid: string) {
    let game;
    const interval = setInterval(async () => {
      game = await this.gameService.get(gameid);
      if (game.score1 != 5 || game.score2 != 5) clearInterval(interval);
      this.server.emit('ballPos', game);
      this.gameService.updateGame(game);
    }, 1000 / 60);
  }

  @SubscribeMessage('newPlayer') PlayerJoin(@MessageBody() data: newPlayerDTO) {
    this.server.emit('newPlayer', data);
  }

  @SubscribeMessage('joinQueue')
  async onJoinQueue(socket: CustomSocket, player: string) {
    this.gameService.Addtoqueue(player);
  }

  @SubscribeMessage('leaveQueue')
  async OnLeaveQueue(socket: CustomSocket, player: string) {
    this.gameService.Removetoqueue(player);
  }
}
