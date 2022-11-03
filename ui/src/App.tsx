import React, { useEffect, useState } from 'react';
import Header from './pages/HomePage/Header';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import Login from './pages/Login';
import { Button } from 'react-bootstrap';

function App() {
  const [searchParams] = useSearchParams();
  const [isLog, seIsLog] = useState<boolean>();
  const [username, setUsername] = useState<string>();
  const navigate = useNavigate();
  const {state} = useLocation();

  useEffect(() => {
    const logReq = searchParams.get('isAuthenticated');
    const usrReq = searchParams.get('nickname');

    if ((logReq && logReq === 'true') ||  (state && state.alreadyLog === true)) seIsLog(true);
    else seIsLog(false);
    if (state && state.alreadyUsername !== undefined)
      setUsername(state.alreadyUsername);
    else
      setUsername(usrReq ? usrReq : undefined);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {isLog && username !== undefined ? (
        <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          flexDirection: "column",
          width: '100%',
          height: '100vh',
        }}
      >
        <Header username={username}/>
        <Button  onClick={() => {navigate('/game_1', { state: {username: username}})}} variant="success">Play</Button>
        <Button onClick={() => {navigate('/chat', {state : {username: username}})}} variant="success">Chat</Button>
      </div>
      ) : (
        <Login /> 
      )}
    </div>
  );
}

export default App;
