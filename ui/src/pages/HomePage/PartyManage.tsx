import React, { useEffect, useState } from 'react';
import PartyCreate from './partyCreate';
import ListeParty from './ListeParty';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import socketIOClient, { Socket } from 'socket.io-client';

export default function PartyManage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    setSocket(
      socketIOClient('http://localhost:8080', { withCredentials: true }),
    );
    const usernameStorage = localStorage.getItem('nickname');
    setUsername(usernameStorage);
    if (usernameStorage === null) navigate('/');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return username ? (
    <div>
      <Header username={username} />
      <PartyCreate username={username} socket={socket} />
      <ListeParty socket={socket} />
    </div>
  ) : null;
}
