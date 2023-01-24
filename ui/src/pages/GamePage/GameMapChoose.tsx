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

  function checkLighness(color: string)
  {
    var c = color.substring(1);      // strip #
    var rgb = parseInt(c, 16);   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff;  // extract red
    var g = (rgb >>  8) & 0xff;  // extract green
    var b = (rgb >>  0) & 0xff;  // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    if (luma < 40) 
      return false;
    return true;
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
            if (isPlayer() && checkLighness(e.target.value))
              setGame({ ...game, mapColor: e.target.value, emiter: socket.id });
          }}
          value="#000000"
        />
      </div>
      <div
        className="GamePlayerChoose_range"
      >
        <label className="form-label">Ball Speed : {game.ballSpeed}</label>
        <input
          type="range"
          className="form-range"
          onChange={(e) => {
            if (isPlayer()) {
              setGame({ ...game, ballSpeed: parseInt(e.target.value), emiter: socket.id });
            }
          }}
          min="1"
          max="10"
          step="0.1"
          defaultValue="5"
          id="customRange2"
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
