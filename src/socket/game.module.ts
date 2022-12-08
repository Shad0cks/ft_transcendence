import { Module } from '@nestjs/common';
//import { UserService } from 'src/services/user.service';
import { ConnectedUsers } from './connectedUsers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameGateway } from './game.gateway';
import { GameService } from 'src/services/game.service';
import { ballDTO } from 'src/dto/ballGame.dto';
import { GameObjDTO } from 'src/dto/game.dto';
import { newPlayerDTO } from 'src/dto/newPlayer.dto';
import { PlayerDTO } from 'src/dto/player.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([ballDTO, GameObjDTO, newPlayerDTO, PlayerDTO]),
    // ChatModule,
    // UserModule,
  ],
  providers: [GameGateway, ConnectedUsers, GameService],
})
export class GameModule {}
