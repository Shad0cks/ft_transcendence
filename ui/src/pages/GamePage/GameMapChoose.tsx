import React, { SetStateAction } from 'react';
import { GameObj } from '../../models/game';

export default function GameMapChoose({game, setGame, nextPage} : {setGame: React.Dispatch<SetStateAction<GameObj>>, game: GameObj, nextPage: (inc?: number) => void}) {
  
    return (

    <div className="GamePlayerChoose_container">
        <h1 className="GamePlayerChoose_title">Choose Map Background</h1>
         <div className="GamePlayerChoose_box">
            <img
            src={"https://picsum.photos/200/300"}
            className={game.mapID === 1 ? "GamePlayerChoose_sl" : ""}
             height="80px"
             width="80px"
             style={{cursor: "pointer"}}
             onClick={() => setGame({...game, mapID:1})}
             alt="background1"
            /> 
            <img
            src={"https://picsum.photos/200/300"}
            className={game.mapID === 2 ? "GamePlayerChoose_sl" : ""}
             height="80px"
             width="80px"
             style={{cursor: "pointer"}}
             onClick={() => setGame({...game, mapID:2})}
             alt="background2"
            /> 
            <img
            src={"https://picsum.photos/200/300"}
            className={game.mapID === 3 ? "GamePlayerChoose_sl" : ""}
             height="80px"
             width="80px"
             style={{cursor: "pointer"}}
             onClick={() => setGame({...game, mapID:3})}
             alt="background3"
            /> 
        </div> 
        {
            game.mapID !== -1 ?
            <button
            type="button"
            className="btn btn-outline-success"
            style={{margin: "0 auto"}} 
            onClick={() => nextPage()}
            > 
            Play
            </button> : null
        }  
</div>
  );
} 