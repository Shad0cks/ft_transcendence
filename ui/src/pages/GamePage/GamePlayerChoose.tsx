import React, { SetStateAction } from 'react';
import { GameObj } from '../../models/game';

export default function GamePlayerChoose({game, setGame, nextPage} : {setGame: React.Dispatch<SetStateAction<GameObj>>, game: GameObj, nextPage: (inc?: number) => void}) {

  const changePage = () => 
  {
    if (!game.player2Taken || !game.player1Taken)
    {
        setGame({...game, offline:true});
        nextPage()
    }
    else
      nextPage(2)
  }

  return (
    <div className="GamePlayerChoose_container">
        <h1 className="GamePlayerChoose_title">Choose Player</h1>
         <div className="GamePlayerChoose_box">
            <button
            type="button"
            className={"btn btn-outline-danger" + (game.player1Taken ? " disabled" : "")}
            onClick={() => {setGame({...game, player1Taken:true})}}
            > 
            Player 1 
            </button>
            <button
            type="button"
            className={"btn btn-outline-danger" + (game.player2Taken ? " disabled" : "")}
            onClick={() => {setGame({...game, player2Taken:true})}}
            >
            Player 2
            </button> 
        </div>
        {
          game.player1Taken || game.player2Taken ?
        <button
        type="button"
        className="btn btn-outline-success"
        style={{margin: "0 auto"}} 
        onClick={changePage} 
        > 
        Choose Mods
        </button> 
        :
        null 
        }  
</div>
  );
}
 