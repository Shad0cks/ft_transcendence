import React, { useEffect, useState } from 'react';
import Header from './pages/HomePage/Header';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import Login from './pages/Login';
import { Button } from 'react-bootstrap';
import { ChechLocalStorage } from './services/checkIsLog';

function App() {
  const [searchParams] = useSearchParams();
  const [isLog, seIsLog] = useState<boolean>();
  const [username, setUsername] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await ChechLocalStorage()
      const logReq = searchParams.get('isAuthenticated');
      const usrReq = searchParams.get('nickname');
      const usernameStorage = localStorage.getItem("nickname")

      if ((logReq && logReq === 'true') || (usernameStorage !== null))
        seIsLog(true);
      else seIsLog(false);
      if (usernameStorage !== null )
        setUsername(usernameStorage);
      else if (usrReq) 
      {
        setUsername(usrReq);
        localStorage.setItem("nickname", usrReq)
      }
    })()
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
          <Header username={username} />
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
