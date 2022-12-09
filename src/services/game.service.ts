import { Injectable } from '@nestjs/common';
//import { ballDTO } from 'src/dto/ballGame.dto';
//import { GameObjDTO } from 'src/dto/game.dto';
//import { Clients } from 'src/adapters/socket.adapter';
import { GamePageDTO } from 'src/dto/gamepage.dto';

@Injectable()
export class GameService {
  Game: Map<string, GamePageDTO> = new Map<string, GamePageDTO>();
  Queue: Array<string> = new Array<string>();

  async create(player1: string, player2: string) {
    const NewGame: GamePageDTO = {
      player1: player1,
      player2: player2,
      viewver: new Array<string>(),
      score1: 0,
      score2: 0,
    };
    NewGame.viewver.push(player1);
    NewGame.viewver.push(player2);
    const IdGame = Date.now();
    this.Game.set(IdGame.toString(), NewGame);
    return IdGame.toString();
  }

  async addViewver(gameid: string, viewver: string) {
    this.Game.get(gameid).viewver.push(viewver);
  }

  async removeViewver(gameid: string, viewver: string) {
    this.Game.get(gameid).viewver.splice(
      this.Game.get(gameid).viewver.indexOf(viewver),
      1,
    );
  }

  getViewver(gameid: string) {
    return this.Game.get(gameid).viewver;
  }

  async Addtoqueue(player: string): Promise<{ bo: boolean; player: string }> {
    if (this.Queue && this.Queue.includes(player)) {
      return { bo: false, player: null };
    } else {
      this.Queue.push(player);
    }
    if (this.Queue.length > 1) {
      const player1 = this.Queue[0];
      this.Queue.splice(this.Queue.indexOf(player), 1);
      this.Queue.splice(this.Queue.indexOf(this.Queue[0]), 1);
      return { bo: true, player: player1 };
    }
    return { bo: false, player: null };
  }

  async Removetoqueue(player: string) {
    if (this.Queue.includes(player)) {
      this.Queue.splice(this.Queue.indexOf(player), 1);
    }
  }

  async deleteGame(player: string) {
    this.Game.delete(player);
  }

  async get(id: string) {
    return this.Game.get(id);
  }

  async scored(gameid: string, player: string) {
    if (this.Game.get(gameid).player1 === player) {
      this.Game.get(gameid).score1 += 1;
    } else {
      this.Game.get(gameid).score2 += 1;
    }
  }
}
