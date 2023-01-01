import React, { SetStateAction } from 'react';
import { GameObj } from '../../models/game';
import { socket } from '../../services/socket';

export default function GameMapChoose({
  game,
  setGame,
  nextPage,
}: {
  setGame: React.Dispatch<SetStateAction<GameObj>>;
  game: GameObj;
  nextPage: (inc?: number) => void;
}) {
  function isPlayer(): boolean {
    if (
      game.player1.socket === socket?.id ||
      game.player2.socket === socket?.id
    )
      return true;
    return false;
  }

  return (
    <div className="GamePlayerChoose_container">
      <h1 className="GamePlayerChoose_title">Choose Map Background</h1>
      <div>
        <h3>Map Color:</h3>
        <div
          style={{
            border: 'solid 2px blue',
            margin: '10px auto',
            height: '60px',
            width: '100px',
            backgroundColor:
              game.mapColor === 'null' ? '#000000' : game.mapColor,
          }}
        ></div>
      </div>
      <div>
        <label style={{ margin: '10px auto' }} htmlFor="head">
          Select:{' '}
        </label>
        <input
          style={{ display: 'block', margin: '0 auto' }}
          type="color"
          id="head"
          name="color picker"
          onChange={(e) => {
            if (isPlayer())
              setGame({ ...game, mapColor: e.target.value, emiter: socket.id });
          }}
          value="#000000"
        />
      </div>
      {game.mapColor !== 'null' ? (
        <button
          type="button"
          className="btn btn-outline-dark"
          style={{ margin: '0 auto' }}
          onClick={() => (isPlayer() ? nextPage() : null)}
        >
          Play
        </button>
      ) : null}
    </div>
  );
}
