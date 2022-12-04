import React, { useEffect, useState } from 'react';
import PartyCreate from './partyCreate';
import ListeParty from './ListeParty';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import socketIOClient, { Socket } from 'socket.io-client';
import { GetUserIt } from '../../models/getUser';
import { GetUserInfo } from '../../services/User/getUserInfo';
import { UserLogout } from '../../services/User/userDelog';
import { Button } from 'react-bootstrap';

export default function PartyManage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket>();

  const [user, setUser] = useState<GetUserIt>();

  useEffect(() => {
    setSocket(
      socketIOClient('http://localhost:8080', { withCredentials: true }),
    );
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

  return username ? (
    <div style={{ fontFamily: 'Orbitron' }}>
      <Header username={username} iconUser={user?.avatar} />
      <PartyCreate username={username} socket={socket} />
      <ListeParty socket={socket} username={username} />
      <div
        style={{
          backgroundColor: '#282c34 ',
          position: 'fixed',
          width: '100%',
          height: '80px',
          bottom: 0,
          boxShadow: '0px 0 10px rgba(0, 0, 0, 0.8)',
        }}
      >
        <Button
          style={{
            position: 'relative',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
          }}
          variant="success"
          id="button-addon"
          onClick={() => navigate('/chat')}
        >
          Back to channels
        </Button>
      </div>
    </div>
  ) : null;
}
