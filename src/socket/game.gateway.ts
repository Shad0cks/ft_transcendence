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
    @MessageBody() e: { data: PlayerDTO; gameid: string },
  ) {
    const Gameviewver = this.gameService.getViewver(e.gameid);
    if (Gameviewver) {
      for (const viewver of Gameviewver) {
        this.server.to(Clients.getSocketId(viewver)).emit('playermove', e.data);
      }
    }
  }

  @SubscribeMessage('gameOption')
  async ongameOption(
    socket: CustomSocket,
    e: { data: GameObjDTO; gameid: string },
  ) {
    if (e.data === null) return;
    const Gameviewver = this.gameService.getViewver(e.gameid);
    for (const viewver of Gameviewver) {
      this.server.to(Clients.getSocketId(viewver)).emit('gameOption', e);
    }
  }

  @SubscribeMessage('ballPos') async BallEvent(
    socket: CustomSocket,
    @MessageBody() e: { data: ballDTO; gameid: string },
  ) {
    const Gameviewver = this.gameService.getViewver(e.gameid);
    if (Gameviewver) {
      for (const viewver of Gameviewver) {
        this.server.to(Clients.getSocketId(viewver)).emit('ballPos', e.data);
      }
    }
  }

  @SubscribeMessage('GamePause') gamePause(
    @MessageBody()
    data: {
      gameid: string;
      pause: boolean;
      player: undefined | string;
    },
  ) {
    const Gameviewver = this.gameService.getViewver(data.gameid);
    if (Gameviewver) {
      for (const viewver of Gameviewver) {
        this.server.to(Clients.getSocketId(viewver)).emit('GamePause', data);
      }
    }
  }

  @SubscribeMessage('Scored')
  async onScored(socket: CustomSocket, e: { gameid: string; player: string }) {
    await this.gameService.scored(e.gameid, e.player);
    const Game = await this.gameService.get(e.gameid);
    if (Game.score1 === 5 || Game.score2 === 5) {
      console.log(e.player, 'Win');
      const Gameviewver = this.gameService.getViewver(e.gameid);
      if (Gameviewver) {
        for (const viewver of Gameviewver) {
          this.server.to(Clients.getSocketId(viewver)).emit('Scored', e.player);
          this.server
            .to(Clients.getSocketId(viewver))
            .emit('GameEnded', e.player);
        }
        this.gameService.deleteGame(e.gameid);
      }
    } else {
      const Gameviewver = this.gameService.getViewver(e.gameid);
      if (Gameviewver) {
        for (const viewver of Gameviewver) {
          this.server.to(Clients.getSocketId(viewver)).emit('Scored', e.player);
        }
      }
    }
  }

  @SubscribeMessage('Addtoqueue')
  async OnAddtoqueue(socket: CustomSocket, player: string) {
    const findgame = await this.gameService.Addtoqueue(player);
    if (findgame.bo) {
      const GameID = await this.gameService.create(findgame.player, player);
      this.server.to(socket.id).emit('FindGame', GameID);
      this.server
        .to(Clients.getSocketId(findgame.player))
        .emit('FindGame', GameID);
    }
  }

  @SubscribeMessage('LeaveQueue')
  async onLeavequeue(socket: CustomSocket, player: string) {
    this.gameService.Removetoqueue(player);
    this.server.to(socket.id).emit('QueueLeave');
  }

  @SubscribeMessage('Gameforceend')
  async onGameforceend(
    socket: CustomSocket,
    e: { gameid: string; player: string | undefined },
  ) {
    const Gameviewver = this.gameService.getViewver(e.gameid);
    if (Gameviewver) {
      for (const viewver of Gameviewver) {
        this.server
          .to(Clients.getSocketId(viewver))
          .emit('Gameforceend', e.player);
      }
      this.gameService.deleteGame(e.gameid);
    }
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
    e: { InvitationSender: string; InvitationReceiver: string },
  ) {
    console.log(
      'receive sender ',
      e.InvitationSender,
      'receiver ',
      e.InvitationReceiver,
    );

    this.server
      .to(Clients.getSocketId(e.InvitationReceiver))
      .emit('InvitationGame', e.InvitationSender);
  }

  @SubscribeMessage('InvitationAccepted')
  async OnInvitationAccepted(
    socket: CustomSocket,
    e: {
      InvitationSender: string;
      InvitationReceiver: string;
    },
  ) {
    const Gameid = await this.gameService.create(
      e.InvitationSender,
      e.InvitationReceiver,
    );
    this.server
      .to(Clients.getSocketId(e.InvitationReceiver))
      .emit('FindGame', Gameid);
    this.server
      .to(Clients.getSocketId(e.InvitationSender))
      .emit('FindGame', Gameid);
  }
}
