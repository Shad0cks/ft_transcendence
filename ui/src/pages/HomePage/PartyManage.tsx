import React, {useEffect} from 'react';
import PartyCreate from './partyCreate';
import ListeParty from './ListeParty';
import Header from './Header';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PartyManage() {
  const {state} = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (state === null || state.username === undefined)
      navigate('/', {state :{alreadyUsername: undefined, alreadyLog: false}})
  }, [])

  return (
    state ? 
    (
      <div>
          <Header username={state.username}/> 
          <PartyCreate username={state.username}/>
          <ListeParty />
       </div>
    )
    :
    (
      null
    )
    
  );
}
