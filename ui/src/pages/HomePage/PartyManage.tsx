import React, { useEffect, useState } from 'react';
import PartyCreate from './partyCreate';
import ListeParty from './ListeParty';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import socketIOClient, { Socket } from 'socket.io-client';
import { GetUserIt } from '../../models/getUser';
import { GetUserInfo } from '../../services/User/getUserInfo';

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
      GetUserInfo(localStorage.getItem('nickname')!).then((e) => {
        if (e.ok) e.text().then((i) => setUser(JSON.parse(i)));
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return username ? (
    <div>
      <Header username={username} iconUser={user?.avatar} />
      <PartyCreate username={username} socket={socket} />
      <ListeParty socket={socket} />
    </div>
  ) : null;
}
