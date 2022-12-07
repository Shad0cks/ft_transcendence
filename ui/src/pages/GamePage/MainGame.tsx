import React, { useState, useEffect } from 'react';
import PongGame from '../../components/PongGame';
import '../../css/Pages/MainGame.css';
import GamePlayerChoose from './GamePlayerChoose';
import GameModChoose from './GameModChoose';
import GameMapChoose from './GameMapChoose';
import { GameObj } from '../../models/game';
import { socket } from '../../services/socket';
import Header from '../../components/Header';
import { newPlayer } from '../../models/newPlayer';
import { useNavigate } from 'react-router-dom';
import { GetUserInfo } from '../../services/User/getUserInfo';
import { GetUserIt } from '../../models/getUser';
import { UserLogout } from '../../services/User/userDelog';

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
  const [user, setUser] = useState<GetUserIt>();
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
    socket.emit('newPlayer', {
      socketID: socket.id,
      gameID: window.location.pathname,
    });
    socket.emit('SetStatus', 'ingame');

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
    const usernameStorage = localStorage.getItem('nickname');
    setUsername(usernameStorage);
    if (usernameStorage === null) navigate('/');
    else
      GetUserInfo(localStorage.getItem('nickname')!).then(async (e) => {
        if (e.status === 401) {
          await UserLogout();
          navigate('/');
        } else if (e.ok) e.text().then((i) => setUser(JSON.parse(i)));
      });
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
          />
        );
      case 2:
        return (
          <GameModChoose
            game={game}
            setGame={setGame}
            nextPage={incrementGameOp}
          />
        );
      case 3:
        return (
          <GameMapChoose
            game={game}
            setGame={setGame}
            nextPage={incrementGameOp}
          />
        );
      case 4:
        return (
          <div className="mainGame_block">
            <div className="playeCont">
              <p className="playerNum">Player 1</p>
              <p className="playerNum">Player 2</p>
            </div>
            <PongGame width={1000} height={600} gameInfo={game} />
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
          />
        );
    }
  };

  return username ? (
    <div>
      <Header username={username} iconUser={user?.avatar} />
      {setGameOp()}
    </div>
  ) : null;
}

export default MainGame;
