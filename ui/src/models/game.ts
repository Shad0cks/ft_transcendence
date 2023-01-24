interface playerS {
  taken: boolean;
  socket: string | undefined;
  nickname: string | undefined;
}

export interface GameObj {
  emiter: string | undefined;
  screen: number;
  mapColor: string;
  ballSpeed: number;
  player1: playerS;
  player2: playerS;
}
