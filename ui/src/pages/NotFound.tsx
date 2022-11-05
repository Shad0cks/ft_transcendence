import React, { useEffect, useState } from 'react';
import '../css/Pages/NotFound.css';
import Header from './HomePage/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChechLocalStorage } from '../services/checkIsLog';

export default function NotFound() {
  const { state } = useLocation();
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
    <div className="NotFound_block">
      <Header username={username} />
      <h1>Page Not Found</h1>
    </div>
  ) : null;
}
