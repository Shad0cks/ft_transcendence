interface playerS {
  taken: boolean;
  socket: string | undefined;
  nickname: string | undefined;
}

export interface GameObj {
  emiter: string | undefined;
  screen: number;
  mapColor: string;
  player1: playerS;
  player2: playerS;
}
