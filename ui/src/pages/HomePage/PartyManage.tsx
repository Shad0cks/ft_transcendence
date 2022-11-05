import React, { useEffect, useState } from 'react';
import PartyCreate from './partyCreate';
import ListeParty from './ListeParty';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { ChechLocalStorage } from '../../services/checkIsLog';

export default function PartyManage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    (async () => {await ChechLocalStorage()})()
    const usernameStorage = localStorage.getItem("nickname")
    setUsername(usernameStorage)
    if (usernameStorage === null)
      navigate('/');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return username ? (
    <div>
      <Header username={username} />
      <PartyCreate username={username} />
      <ListeParty />
    </div>
  ) : null;
}
