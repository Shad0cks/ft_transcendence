import React, { useState, useEffect, useRef } from 'react';
import PongGame from '../../components/PongGame';
import '../../css/Pages/MainGame.css';
import GamePlayerChoose from './GamePlayerChoose';
import GameModChoose from './GameModChoose';
import GameMapChoose from './GameMapChoose';
import { GameObj } from '../../models/game';
import { socket } from '../../services/socket';
import Header from '../../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { GetUserInfo } from '../../services/User/getUserInfo';
import { GetUserIt } from '../../models/getUser';
import { UserLogout } from '../../services/User/userDelog';
import Background from '../../components/background';

function MainGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const [game, setGame] = useState<GameObj>({
    emiter: undefined,
    screen: 1,
    mapColor: 'null',
    player1: { taken: false, socket: undefined, nickname: undefined },
    player2: { taken: false, socket: undefined, nickname: undefined },
  });
  const [user, setUser] = useState<GetUserIt>();
  const [username, setUsername] = useState<string | null>(null);
  const [gameid, setGameid] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<{
    player1: string;
    player2: string;
  }>();
  const incrementGameOp = (inc: number = 1) => {
    setGame({ ...game, screen: game.screen + inc, emiter: socket?.id });
  };
  const gameRef = useRef<GameObj | null>(null);
  gameRef.current = game;

  // function isPlayer() : boolean
  // {
  //     if (game.player1.socket === socket?.id || game.player2.socket === socket?.id) return true
  //     return false;
  // }

  function checkOnline(statusMaptmp: Map<string, string>): boolean {
    if (!selectedPlayer) return false;
    return (
      statusMaptmp.get(selectedPlayer.player1) === undefined ||
      statusMaptmp.get(selectedPlayer.player2) === undefined
    );
  }

  function setPlayerSocket(playerID: number) {
    if (
      !username ||
      (username !== selectedPlayer?.player1 &&
        username !== selectedPlayer?.player2)
    )
      return;
    if (playerID === 1) {
      if (game.player2.socket !== socket?.id)
        setGame({
          ...game,
          player1: {
            ...game.player1,
            taken: true,
            socket: socket?.id,
            nickname: username,
          },
          emiter: socket?.id,
        });
    } else {
      if (game.player1.socket !== socket?.id)
        setGame({
          ...game,
          player2: {
            ...game.player2,
            taken: true,
            socket: socket?.id,
            nickname: username,
          },
          emiter: socket?.id,
        });
    }
  }

  useEffect(() => {
    if (!location.state) return;
    setGameid(location.state.gameid);
    socket.emit('SetStatus', 'ingame');
    socket.emit('getUserbyGameid', location.state.gameid);
    return () => {
      socket.emit('SetStatus', 'online');
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (socket && socket.id !== undefined) {
      if (game.emiter !== socket.id) return;
      socket.emit('gameOption', { data: game, gameid: gameid });
    }
  }, [game, gameid]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    socket?.on('gameOption', (e: { data: GameObj; gameid: string }) => {
      if (e.data.emiter !== socket.id) setGame(e.data);
    });

    socket.on('Gameforceend', (player: string | undefined) => {
      navigate('/');
    });

    socket.on('StatusUpdate', function (e: any) {
      const statusMapTmp: Map<string, string> = new Map(JSON.parse(e));
      if (checkOnline(statusMapTmp)) {
        socket.emit('Gameforceend', {
          gameid: location.state.gameid,
          player: gameRef?.current?.player2.nickname,
        });
      }
    });

    socket.on(
      'getUserbyGameid',
      (players: { player1: string; player2: string }) => {
        setSelectedPlayer(players);
      },
    );

    // socket?.on('Addtoviewver', (gameID : string, viewver: string) => {
    //   if (viewver !== socket.id) {
    //     socket.emit('gameOption', { ...game, emiter: socket.id });
    //   }
    // });
    return () => {
      // socket?.off('Addtoviewver');
      socket?.off('gameOption');
    };
  }, [game, socket, selectedPlayer]); // eslint-disable-line react-hooks/exhaustive-deps

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

    return () => {
      if (!location.state) return;
      if (
        socket.id === gameRef?.current?.player1.socket ||
        usernameStorage === selectedPlayer?.player1
      ) {
        socket.emit('Gameforceend', {
          gameid: location.state.gameid,
          player: gameRef?.current?.player1.nickname,
        });
      } else if (
        socket.id === gameRef?.current?.player2.socket ||
        selectedPlayer?.player2 === usernameStorage
      ) {
        socket.emit('Gameforceend', {
          gameid: location.state.gameid,
          player: gameRef?.current?.player2.nickname,
        });
      } else {
        // console.log(user?.nickname, "leave ", location.state.gameid);
        // socket.emit("Leaveviewver", {Gameid: location.state.gameid, viewver: user?.nickname});
      }
    };
  }, [selectedPlayer]); // eslint-disable-line react-hooks/exhaustive-deps

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
              <p className="playerNum">{game.player1.nickname}</p>
              <p className="playerNum">{game.player2.nickname}</p>
            </div>
            <PongGame
              width={1000}
              height={600}
              gameInfo={game}
              gameID={gameid!}
            />
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
      <Background />
      {setGameOp()}
    </div>
  ) : null;
}

export default MainGame;
