import React, { useEffect } from 'react';
import '../css/Pages/NotFound.css';
import Header from './HomePage/Header';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (state === null || state.username === undefined)
      navigate('/', {
        state: { alreadyUsername: undefined, alreadyLog: false },
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return state ? (
    <div className="NotFound_block">
      <Header username={state.username} />
      <h1>Page Not Found</h1>
    </div>
  ) : null;
}
