import React, { useState } from 'react';
import PongGame from '../../components/PongGame';
import '../../css/Pages/MainGame.css';
import GamePlayerChoose from './GamePlayerChoose';
import GameModChoose from './GameModChoose';
import GameMapChoose from './GameMapChoose';
import { GameObj } from '../../models/game';
 
function MainGame() {
  
  const [gameOption, setGameOption] = useState<number>(1);
  
  const incrementGameOp = (inc : number = 1) => {
    setGameOption((e : number) => e + inc)
  }

  const setGameOp = () => { 
    switch (gameOption) {
      case 1:
        return <GamePlayerChoose game={game} setGame={setGame} nextPage={incrementGameOp}/>
      case 2:
        return <GameModChoose game={game} setGame={setGame} nextPage={incrementGameOp}/>
      case 3:
          return <GameMapChoose game={game} setGame={setGame} nextPage={incrementGameOp}/>
      case 4:
        console.log(game);
        return <PongGame width={1000} height={600} gameType={1} botLevel={1} playerID={1}/>
      default:
        return <GamePlayerChoose game={game} setGame={setGame} nextPage={incrementGameOp}/>
    }
  } 

  const [game, setGame] = useState<GameObj>({gameID: "url", player1Taken: false, player2Taken: false, offline: false, computer: false, mapID: -1, botLevel: 5});

  return ( 
    <div  className={gameOption === 4 ? "mainGame_block" : ""}>
      
      {setGameOp()}
      
      {/* <div> 
      <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => setPlayer(1)}
        >
          Player 1
        </button>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => setPlayer(2)}
        >
          Player 2
        </button>
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
      <div key={gameType + botLevel + player} className="mainGame_blockGame">
        <PongGame
          width={1000}
          height={600}
          gameType={gameType}
          botLevel={botLevel}
          playerID={player}
        />
      </div>
    </div> */}
    </div>
  );
}

export default MainGame;
