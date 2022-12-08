import {
  MessageBody,
  //MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CustomSocket } from 'src/adapters/socket.adapter';
import { ballDTO } from 'src/dto/ballGame.dto';
import { GameObjDTO } from 'src/dto/game.dto';
import { PlayerDTO } from 'src/dto/player.dto';
import { Clients } from 'src/adapters/socket.adapter';
import { GameService } from 'src/services/game.service';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(private gameService: GameService) {}

  @SubscribeMessage('playermove') handleEvent(
    @MessageBody() data: PlayerDTO,
    gameid: string,
  ) {
    const Gameviewver = this.gameService.getViewver(gameid);
    for (const viewver of Gameviewver) {
      this.server.to(viewver).emit('playermove', data);
    }
  }

  @SubscribeMessage('gameOption')
  async ongameOption(socket: CustomSocket, data: GameObjDTO, gameid: string) {
    if (data === null) return;
    const Gameviewver = this.gameService.getViewver(gameid);
    for (const viewver of Gameviewver) {
      this.server.to(viewver).emit('gameOption', data);
    }
  }

  @SubscribeMessage('ballPos') async BallEvent(
    @MessageBody() data: ballDTO,
    Gameid: string,
  ) {
    const Gameviewver = this.gameService.getViewver(Gameid);
    for (const viewver of Gameviewver) {
      this.server.to(Clients.getSocketId(viewver)).emit('ballPos', data);
    }
  }

  @SubscribeMessage('GamePause') gamePause(
    @MessageBody()
    data: {
      gameid: string;
      pausePlayer1: boolean;
      pausePlayer2: boolean;
    },
  ) {
    const Gameviewver = this.gameService.getViewver(data.gameid);
    for (const viewver of Gameviewver) {
      this.server.to(viewver).emit('GamePause', data);
    }
  }

  @SubscribeMessage('Scored')
  async onScored(socket: CustomSocket, gameid: string, player: string) {
    await this.gameService.scored(gameid, player);
    const Game = await this.gameService.get(gameid);
    if (Game.score1 === 5 || Game.score2 === 5) {
      const Gameviewver = this.gameService.getViewver(gameid);
      for (const viewver of Gameviewver) {
        this.server.to(Clients.getSocketId(viewver).emit('Scored', player));
        this.server.to(Clients.getSocketId(viewver)).emit('GameEnded', player);
      }
      this.gameService.deleteGame(gameid);
    } else {
      const Gameviewver = this.gameService.getViewver(gameid);
      for (const viewver of Gameviewver) {
        this.server.to(Clients.getSocketId(viewver).emit('Scored', player));
      }
    }
  }

  @SubscribeMessage('Addtoqueue')
  async OnAddtoqueue(socket: CustomSocket, player: string) {
    const findgame = await this.gameService.Addtoqueue(player);
    if (findgame.bo) {
      const GameID = await this.gameService.create(findgame.player, player);
      this.server.to(socket.id).emit('FindGame', GameID);
      this.server.to(findgame.player).emit('FindGame', GameID);
    }
  }

  @SubscribeMessage('LeaveQueue')
  async onLeavequeue(socket: CustomSocket, player: string) {
    this.gameService.Removetoqueue(player);
    this.server.to(socket.id).emit('QueueLeave');
  }

  @SubscribeMessage('Gameforceend')
  async onGameforceend(socket: CustomSocket, gameid: string, player: string) {
    const Gameviewver = this.gameService.getViewver(gameid);
    for (const viewver of Gameviewver) {
      this.server.to(Clients.getSocketId(viewver)).emit('Gameforceend', player);
    }
    this.gameService.deleteGame(gameid);
  }

  @SubscribeMessage('Addtoviewver')
  async onAddtoviewver(socket: CustomSocket, Gameid: string, viewver: string) {
    this.gameService.addViewver(Gameid, viewver);
  }

  @SubscribeMessage('Leaveviewver')
  async onLeaveviewver(socket: CustomSocket, Gameid: string, viewver: string) {
    this.gameService.removeViewver(Gameid, viewver);
  }

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

  @SubscribeMessage('InvitationAccepted')
  async OnInvitationAccepted(
    socket: CustomSocket,
    InvitationSender: string,
    InvitationReceiver: string,
  ) {
    const Gameid = await this.gameService.create(
      InvitationSender,
      InvitationReceiver,
    );
    this.server
      .to(Clients.getSocketId(InvitationReceiver))
      .emit('FindGame', Gameid);
    this.server
      .to(Clients.getSocketId(InvitationSender))
      .emit('FindGame', Gameid);
  }
}
