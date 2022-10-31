import React, { useEffect, useState } from 'react';
import Header from './pages/HomePage/Header';
import { useSearchParams } from 'react-router-dom';
import ListeParty from './pages/HomePage/ListeParty';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

import PartyCreate from './pages/HomePage/partyCreate';
import Login from './pages/Login';

function App() {
  const [searchParams] = useSearchParams();
  const [isLog, seIsLog] = useState<boolean>();
  const [imageProgile, setImageProgile] = useState<string>();
  const [username, setUsername] = useState<string>();

  useEffect(() => {
    const logReq = searchParams.get('isLog');
    console.log(imageProgile);
    const imReq = searchParams.get('icon');
    const usrReq = searchParams.get('username');

    if (logReq && logReq === 'true') seIsLog(true);
    else seIsLog(false);

    setImageProgile(imReq ? imReq : undefined);
    setUsername(usrReq ? usrReq : undefined);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {isLog ? (
        <div>
          <Header username={username} />
          <PartyCreate />
          <ListeParty />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
