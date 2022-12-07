import React, { SetStateAction } from 'react';
import { GameObj } from '../../models/game';
import { socket } from '../../services/socket';

export default function GamePlayerChoose({
  game,
  setGame,
  nextPage,
  setSocket,
}: {
  setGame: React.Dispatch<SetStateAction<GameObj>>;
  game: GameObj;
  nextPage: (inc?: number) => void;
  setSocket: (playerID: number) => void;
}) {
  const changePage = () => {
    if (!game.player1.taken || !game.player2.taken) {
      setGame({ ...game, offline: true, emiter: socket?.id });
      nextPage();
    } else nextPage(2);
  };

  return (
    <div className="GamePlayerChoose_container">
      <h1 className="GamePlayerChoose_title">Choose Player</h1>
      <div className="GamePlayerChoose_box">
        <button
          type="button"
          className={
            'btn btn-outline-danger' + (game.player1.taken ? ' disabled' : '')
          }
          onClick={() => {
            setSocket(1);
          }}
        >
          Player 1
        </button>
        <button
          type="button"
          className={
            'btn btn-outline-danger' + (game.player2.taken ? ' disabled' : '')
          }
          onClick={() => {
            setSocket(2);
          }}
        >
          Player 2
        </button>
      </div>
      {(game.player1.taken && game.player1.socket === socket?.id) ||
      (game.player2.taken && game.player2.socket === socket?.id) ? (
        <button
          type="button"
          className="btn btn-outline-success"
          style={{ margin: '0 auto' }}
          onClick={() => {
            changePage();
          }}
        >
          Choose Mods
        </button>
      ) : null}
    </div>
  );
}
