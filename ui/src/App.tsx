import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import Login from './pages/Login';
import { Button } from 'react-bootstrap';
import { GetUserIt } from './models/getUser';
import { GetUserInfo } from './services/User/getUserInfo';
import { UserLogout } from './services/User/userDelog';
import { socket } from './services/socket';

function App() {
  const [searchParams] = useSearchParams();
  const [isLog, seIsLog] = useState<boolean>();
  const [username, setUsername] = useState<string>();
  const [user, setUser] = useState<GetUserIt>();
  const navigate = useNavigate();

  useEffect(() => {
    const logReq = searchParams.get('isAuthenticated');
    const usrReq = searchParams.get('nickname');
    let usernameStorage = localStorage.getItem('nickname');

    if (
      (logReq && logReq === 'true' && socket.connected) ||
      usernameStorage !== null
    )
      seIsLog(true);
    else seIsLog(false);
    if (usernameStorage !== null) setUsername(usernameStorage);
    else if (usrReq) {
      setUsername(usrReq);
      localStorage.setItem('nickname', usrReq);
    }
    usernameStorage = localStorage.getItem('nickname');
    if (usernameStorage !== null)
      GetUserInfo(localStorage.getItem('nickname')!).then(async (e) => {
        if (e.status === 401) {
          await UserLogout();
          seIsLog(false);
        } else if (e.ok) e.text().then((i) => setUser(JSON.parse(i)));
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {isLog && username !== undefined ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            height: '100vh',
          }}
        >
          <Header username={user?.nickname} iconUser={user?.avatar} />
          <Button
            onClick={() => {
              navigate('/game_1');
            }}
            variant="success"
          >
            Play
          </Button>
          <Button
            onClick={() => {
              navigate('/chat');
            }}
            variant="success"
          >
            Chat
          </Button>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
