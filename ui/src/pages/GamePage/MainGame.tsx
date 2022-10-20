import React, { useEffect, useState } from 'react';
import PongGame from '../../components/PongGame';
import '../../css/Pages/MainGame.css';

function MainGame() {
  const [gameType, setGameType] = useState<number>(1);
  const [botLevel, setBotLevel] = useState<number>(3);

  useEffect(() => {}, [gameType]);

  return (
    <div className="mainGame_block">
      <h1 className="mainGame_GameTitle"> Game Page </h1>
      <div className="mainGame_selectTypeGame">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => setGameType(1)}
        >
          Local 1v1
        </button>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => setGameType(3)}
        >
          Bot
        </button>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => setGameType(2)}
        >
          Online
        </button>
      </div>
      <div
        className="mainGame_boLevel"
        style={gameType !== 3 ? { visibility: 'hidden' } : undefined}
      >
        <label className="form-label">Bot Level : {botLevel}</label>
        <input
          type="range"
          className="form-range"
          onChange={(e) => setBotLevel(+e.target.value)}
          min="1"
          max="9"
          step="0.1"
          defaultValue="3"
          id="customRange2"
        />
      </div>
      <div key={gameType + botLevel} className="mainGame_blockGame">
        <PongGame
          width={1000}
          height={600}
          gameType={gameType}
          botLevel={botLevel}
        />
      </div>
    </div>
  );
}

export default MainGame;
