import React, { useState, useEffect } from 'react';
import PongGame from '../../components/PongGame';
import '../../css/Pages/MainGame.css';
import GamePlayerChoose from './GamePlayerChoose';
import GameModChoose from './GameModChoose';
import GameMapChoose from './GameMapChoose';
import { GameObj } from '../../models/game';
import socketIOClient, { Socket } from 'socket.io-client';
import Header from '../HomePage/Header';
import { newPlayer } from '../../models/newPlayer';
import { useNavigate } from 'react-router-dom';

function MainGame() {
  const navigate = useNavigate();
  const [game, setGame] = useState<GameObj>({
    gameID: window.location.pathname,
    emiter: undefined,
    offline: false,
    computer: false,
    screen: 1,
    mapID: -1,
    botLevel: 5,
    player1: { taken: false, socket: undefined },
    player2: { taken: false, socket: undefined },
  });
  const [socket, setSocket] = useState<Socket>();
  const [username, setUsername] = useState<string | null>(null);
  const incrementGameOp = (inc: number = 1) => {
    setGame({ ...game, screen: game.screen + inc, emiter: socket?.id });
  };

  // function isPlayer() : boolean
  // {
  //     if (game.player1.socket === socket?.id || game.player2.socket === socket?.id) return true
  //     return false;
  // }

  function setPlayerSocket(playerID: number) {
    if (playerID === 1) {
      if (game.player2.socket !== socket?.id)
        setGame({
          ...game,
          player1: { ...game.player1, taken: true, socket: socket?.id },
          emiter: socket?.id,
        });
    } else {
      if (game.player1.socket !== socket?.id)
        setGame({
          ...game,
          player2: { ...game.player2, taken: true, socket: socket?.id },
          emiter: socket?.id,
        });
    }
  }

  useEffect(() => {
    socket?.on('connect', () => {
      socket.emit('newPlayer', {
        socketID: socket.id,
        gameID: window.location.pathname,
      });
    });

    //socket?.on('disconnect', () => {console.log("disco", socket.id); if (isPlayer()) setGame({...game, screen: 5, emiter: socket.id, player1: {...game.player1, socket: "disconnected"}})})
    socket?.on('gameOption', (data: GameObj) => {
      if (data.gameID === game.gameID && data.emiter !== socket.id)
        setGame(data);
    });

    return () => {
      socket?.off('connect');
      socket?.off('gameOption');
    };
  }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (socket && socket.id !== undefined) {
      if (game.emiter !== socket.id) return;
      socket.emit('gameOption', game);
    }
  }, [game]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    socket?.on('newPlayer', (data: newPlayer) => {
      if (data.gameID === game.gameID && data.socketID !== socket.id) {
        socket.emit('gameOption', { ...game, emiter: socket.id });
      }
    });
    return () => {
      socket?.off('newPlayer');
      socket?.off('disconnected');
    };
  }, [game, socket]);

  useEffect(() => {
    setSocket(
      socketIOClient('http://localhost:8080', { withCredentials: true }),
    );
    const usernameStorage = localStorage.getItem('nickname');
    setUsername(usernameStorage);
    if (usernameStorage === null) navigate('/');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setGameOp = () => {
    switch (game.screen) {
      case 1:
        return (
          <GamePlayerChoose
            game={game}
            setGame={setGame}
            nextPage={incrementGameOp}
            setSocket={setPlayerSocket}
            socket={socket}
          />
        );
      case 2:
        return (
          <GameModChoose
            game={game}
            setGame={setGame}
            nextPage={incrementGameOp}
            socket={socket}
          />
        );
      case 3:
        return (
          <GameMapChoose
            game={game}
            setGame={setGame}
            nextPage={incrementGameOp}
            socket={socket}
          />
        );
      case 4:
        return (
          <div className="mainGame_block">
            <div className="playeCont">
              <p className="playerNum">Player 1</p>
              <p className="playerNum">Player 2</p>
            </div>
            <PongGame
              width={1000}
              height={600}
              gameInfo={game}
              socket={socket!}
            />
          </div>
        );
      case 5:
        return (
          <div className="win">
            {' '}
            {game.player1.socket === 'disconnected'
              ? 'Player 1 Win'
              : 'Player 2 Win'}{' '}
          </div>
        );
      default:
        return (
          <GamePlayerChoose
            game={game}
            setGame={setGame}
            nextPage={incrementGameOp}
            setSocket={setPlayerSocket}
            socket={socket}
          />
        );
    }
  };

  return username ? (
    <div>
      <Header username={username} />
      {setGameOp()}
    </div>
  ) : null;
}

export default MainGame;
