import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import { GetUserIt } from '../../models/getUser';
import { GetUserInfo } from '../../services/User/getUserInfo';
import { UserLogout } from '../../services/User/userDelog';
import '../../css/Pages/ListeParty.css';
import '../../css/Components/playButton.css';
import { socket } from '../../services/socket';
import TSSnackbar from '../../components/TSSnackbar';
import useSnackbar from '../../customHooks/useSnackbar';
import useReceiveInvite from '../../customHooks/receiveInvite';
import Background from '../../components/background';

type gameProp = {
  gameid: string;
  player1: string;
  player2: string;
};

export default function Games() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [user, setUser] = useState<GetUserIt>();
  const [gamesList, setGamesList] = useState<gameProp[]>();
  const snackbar = useSnackbar();
  const sender = useReceiveInvite(snackbar, navigate);
  useEffect(() => {
    setGamesList([]);
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
    socket.emit('Getallgame');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    socket.on('Getallgame', (games: gameProp[]) => {
      setGamesList(games);
    });
  }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

  return username ? (
    <>
      <Background />
      <Header username={username} iconUser={user?.avatar} />
      <div className="ListeParty_block">
        {localStorage.getItem('searcheGame') ? (
          <button
            style={{ display: 'block', margin: '150px auto', color: '#F1C40F' }}
            className="playBtn"
            onClick={() => {
              socket.emit('LeaveQueue', username);
              snackbar.setMessage('Game queue left');
              snackbar.setSeverity('error');
              snackbar.setOpen(true);
              localStorage.removeItem('searcheGame');
            }}
          >
            Quit Queue
            <svg>
              <rect style={{ stroke: '#F1C40F', strokeWidth: '0.2rem' }} />
            </svg>
          </button>
        ) : (
          <button
            style={{ display: 'block', margin: '150px auto' }}
            className="playBtn"
            onClick={() => {
              socket.emit('Addtoqueue', username);
              snackbar.setMessage('Added to Game queue');
              snackbar.setSeverity('success');
              snackbar.setOpen(true);
              localStorage.setItem('searcheGame', 'true');
            }}
          >
            Play New Game
            <svg>
              <rect />
            </svg>
          </button>
        )}
        <h2 className="ListeParty_title">Current Games: </h2>
        <div className="ListeParty_list">
          {gamesList && gamesList.length >= 1
            ? gamesList?.map((e: gameProp, i: number) => (
                <div key={i} className="card" style={{ width: '18rem' }}>
                  <div className="card-body">
                    <h5 className="card-title">
                      {e.player1} x {e.player2}{' '}
                    </h5>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        socket.emit('Addtoviewver', {
                          Gameid: e.gameid,
                          viewver: user?.nickname,
                        });
                        navigate('/game/' + e.gameid, {
                          state: { gameid: e.gameid },
                        });
                      }}
                    >
                      Spetatate
                    </button>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
      <TSSnackbar
        open={snackbar.open}
        setOpen={snackbar.setOpen}
        severity={snackbar.severity}
        message={snackbar.message}
        senderInvite={sender}
        username={username}
      />
    </>
  ) : null;
}
