import React, { SetStateAction } from 'react';
import { GameObj } from '../../models/game';
import { Socket } from 'socket.io-client';

export default function GameMapChoose({game, setGame, nextPage, socket} : {setGame: React.Dispatch<SetStateAction<GameObj>>, game: GameObj, nextPage: (inc?: number) => void, socket: Socket | undefined}) {
  
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
             onClick={() => setGame({...game, mapID:1, emiter: socket?.id})}
             alt="background1"
            /> 
            <img
            src={"https://picsum.photos/200/300"}
            className={game.mapID === 2 ? "GamePlayerChoose_sl" : ""}
             height="80px"
             width="80px"
             style={{cursor: "pointer"}}
             onClick={() => setGame({...game, mapID:2, emiter: socket?.id})}
             alt="background2"
            /> 
            <img
            src={"https://picsum.photos/200/300"}
            className={game.mapID === 3 ? "GamePlayerChoose_sl" : ""}
             height="80px"
             width="80px"
             style={{cursor: "pointer"}}
             onClick={() => setGame({...game, mapID:3, emiter: socket?.id})}
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