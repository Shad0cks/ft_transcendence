import React from 'react';
import Header from './pages/HomePage/Header';
import ListeParty from './pages/HomePage/ListeParty';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

import PartyCreate from './pages/HomePage/partyCreate';

function App() {
  return (
    <div>
      <Header />
      <PartyCreate />
      <ListeParty />
    </div>
  );
}

export default App;
