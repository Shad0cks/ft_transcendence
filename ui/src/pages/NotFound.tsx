import React, { useEffect, useState } from 'react';
import '../css/Pages/NotFound.css';
import Header from './HomePage/Header';
import { useNavigate } from 'react-router-dom';
import { GetUserIt } from '../models/getUser';
import { GetUserInfo } from '../services/User/getUserInfo';

export default function NotFound() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [user, setUser] = useState<GetUserIt>();
  useEffect(() => {
    const usernameStorage = localStorage.getItem('nickname');
    setUsername(usernameStorage);
    if (usernameStorage === null) navigate('/');
    else
      GetUserInfo(localStorage.getItem('nickname')!).then((e) => {
        if (e.ok) e.text().then((i) => setUser(JSON.parse(i)));
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return username ? (
    <div className="NotFound_block">
      <Header username={username} iconUser={user?.avatar} />
      <h1>Page Not Found</h1>
    </div>
  ) : null;
}
