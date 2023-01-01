import React, { SetStateAction, useState } from 'react';
import { GameObj } from '../../models/game';
import { socket } from '../../services/socket';

export default function GameModChoose({
  game,
  setGame,
  nextPage,
}: {
  setGame: React.Dispatch<SetStateAction<GameObj>>;
  game: GameObj;
  nextPage: (inc?: number) => void;
}) {
  const [clicked, setClicked] = useState(-1);

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
      <h1 className="GamePlayerChoose_title">Choose Mods</h1>
      <div className="GamePlayerChoose_box">
        <button
          type="button"
          className={
            'btn btn-outline-danger' + (clicked === 1 ? ' disabled' : '')
          }
          onClick={() => {
            if (isPlayer()) {
              setGame({
                ...game,
                // offline: true,
                // computer: false,
                emiter: socket?.id,
              });
              setClicked(1);
            }
          }}
        >
          Local
        </button>
        <button
          type="button"
          className={
            'btn btn-outline-danger' + (clicked === 0 ? ' disabled' : '')
          }
          onClick={() => {
            if (isPlayer()) {
              setGame({
                ...game,
                // offline: true,
                // computer: true,
                emiter: socket?.id,
              });
              setClicked(0);
            }
          }}
        >
          Computer
        </button>
      </div>
      {/* <div
        className="GamePlayerChoose_range"
        style={!game.computer ? { visibility: 'hidden' } : undefined}
      >
        <label className="form-label">Bot Level : {game.botLevel}</label>
        <input
          type="range"
          className="form-range"
          onChange={(e) => {
            if (isPlayer()) {
              setGame({ ...game, botLevel: +e.target.value });
              setClicked(0);
            }
          }}
          min="1"
          max="9"
          step="0.1"
          defaultValue="5"
          id="customRange2"
        />
      </div>
      {clicked !== -1 ? (
        <button
          type="button"
          className="btn btn-outline-dark"
          style={{ margin: '0 auto' }}
          onClick={() => (isPlayer() ? nextPage() : null)}
        >
          Play
        </button>
      ) : null} */}
    </div>
  );
}
