import React, { useEffect, useState } from 'react';
import Header from './pages/HomePage/Header';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import Login from './pages/Login';
import { Button } from 'react-bootstrap';

function App() {
  const [searchParams] = useSearchParams();
  const [isLog, seIsLog] = useState<boolean>();
  const [username, setUsername] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    const logReq = searchParams.get('isLog');
    const usrReq = searchParams.get('username');

    if (logReq && logReq === 'true') seIsLog(true);
    else seIsLog(false);

    setUsername(usrReq ? usrReq : undefined);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {isLog ? (
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
        <Header username='bob'/>
        <Button   variant="success">Play</Button>  
        <Button onClick={() => {navigate('/chat')}} variant="success">Chat</Button>  
      </div>
      ) : (
        <Login /> 
      )}
    </div>
  );
}

export default App;
