import React from 'react';
import PartyCreate from './partyCreate';
import ListeParty from './ListeParty';
import Header from './Header';

export default function PartyManage() {

  return (
    <div>
        <Header username='bob'/> 
         <PartyCreate />
          <ListeParty />
    </div>
  );
}
