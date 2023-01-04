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
import { UserService } from 'src/services/user.service';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private gameService: GameService,
    private userService: UserService,
  ) {}

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
    if (Gameviewver) {
      for (const viewver of Gameviewver) {
        this.server.to(Clients.getSocketId(viewver)).emit('gameOption', e);
      }
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
    if (Game) {
      if (Game.score1 === 5 || Game.score2 === 5) {
        const Gameviewver = this.gameService.getViewver(e.gameid);
        if (Gameviewver) {
          for (const viewver of Gameviewver) {
            this.server
              .to(Clients.getSocketId(viewver))
              .emit('Scored', e.player);
          }
          for (const viewver of Gameviewver) {
            this.server
              .to(Clients.getSocketId(viewver))
              .emit('GameEnded', e.player);
          }
          this.gameService.deleteGame(e.gameid);
        }
        let winner;
        if (Game.score1 === 5) winner = Game.player1;
        else winner = Game.player2;
        this.userService.registerPongMatch(
          {
            user1Nickname: Game.player1,
            user2Nickname: Game.player2,
            user1Score: Game.score1,
            user2Score: Game.score2,
          },
          winner,
        );
      } else {
        const Gameviewver = this.gameService.getViewver(e.gameid);
        if (Gameviewver) {
          for (const viewver of Gameviewver) {
            this.server
              .to(Clients.getSocketId(viewver))
              .emit('Scored', e.player);
          }
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
    const Game = await this.gameService.get(e.gameid);
    const Gameviewver = this.gameService.getViewver(e.gameid);
    if (Gameviewver) {
      for (const viewver of Gameviewver) {
        this.server
          .to(Clients.getSocketId(viewver))
          .emit('Gameforceend', e.player);
      }
      if (e.player) {
        let winner: string;
        if (Game.player1 === e.player) winner = Game.player2;
        else winner = Game.player1;
        this.userService.registerPongMatch(
          {
            user1Nickname: Game.player1,
            user2Nickname: Game.player2,
            user1Score: Game.score1,
            user2Score: Game.score2,
          },
          winner,
        );
      }
      this.gameService.deleteGame(e.gameid);
    }
  }

  @SubscribeMessage('Addtoviewver')
  async onAddtoviewver(
    socket: CustomSocket,
    e: { Gameid: string; viewver: string },
  ) {
    this.gameService.addViewver(e.Gameid, e.viewver);
    const Gameviewver = this.gameService.getViewver(e.Gameid);
    if (Gameviewver) {
      for (const viewver of Gameviewver) {
        this.server.to(Clients.getSocketId(viewver)).emit('Addtoviewver');
      }
    }
  }

  @SubscribeMessage('Leaveviewver')
  async onLeaveviewver(
    socket: CustomSocket,
    e: { Gameid: string; viewver: string },
  ) {
    this.gameService.removeViewver(e.Gameid, e.viewver);
  }

  @SubscribeMessage('InvitationGame')
  async OnInvitationGame(
    socket: CustomSocket,
    e: { InvitationSender: string; InvitationReceiver: string },
  ) {
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

  @SubscribeMessage('Getallgame')
  async onGetallgame(socket: CustomSocket) {
    const AllGame = await this.gameService.getallgame();
    this.server.to(socket.id).emit('Getallgame', AllGame);
  }

  @SubscribeMessage('getGameByPseudo')
  async onGetgamebypseudo(socket: CustomSocket, player: string) {
    const gameid = await this.gameService.getGameidbyname(player);
    this.server.to(socket.id).emit('getGameByPseudo', gameid);
  }

  @SubscribeMessage('getUserbyGameid')
  async ongetUserbyGameid(socket: CustomSocket, gameid: string) {
    const game = await this.gameService.get(gameid);
    if (game) {
      this.server.to(socket.id).emit('getUserbyGameid', {
        player1: game.player1,
        player2: game.player2,
      });
    }
  }
}
