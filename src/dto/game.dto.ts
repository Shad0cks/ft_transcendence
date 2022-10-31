class playerS {
  taken: boolean;
  socket: string | undefined;
}

export class GameObjDTO {
  gameID: string;
  emiter: string | undefined;
  offline: boolean;
  computer: boolean;
  screen: number;
  mapID: number;
  botLevel: number;
  player1: playerS;
  player2: playerS;
}
