import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import Login from './pages/Login';
import { GetUserInfo } from './services/User/getUserInfo';
import { UserLogout } from './services/User/userDelog';
import { socket } from './services/socket'; // eslint-disable-line
import TSSnackbar from './components/TSSnackbar';
import useSnackbar from './customHooks/useSnackbar';
import useReceiveInvite from './customHooks/receiveInvite';
import Channel from './pages/ChannelPage/channel';
import Background from './components/background';

function App() {
  const [searchParams] = useSearchParams();
  const [isLog, seIsLog] = useState<boolean>();
  const [username, setUsername] = useState<string>();
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const sender = useReceiveInvite(snackbar, navigate);

  useEffect(() => {
    const logReq = searchParams.get('isAuthenticated');
    const usrReq = searchParams.get('nickname');
    let usernameStorage = localStorage.getItem('nickname');

    if ((logReq && logReq === 'true') || usernameStorage !== null)
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
        }
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {isLog && username !== undefined ? <Channel /> : <Login />}
      <Background />
      <TSSnackbar
        open={snackbar.open}
        setOpen={snackbar.setOpen}
        severity={snackbar.severity}
        message={snackbar.message}
        senderInvite={sender}
        username={username}
      />
    </div>
  );
}

export default App;
