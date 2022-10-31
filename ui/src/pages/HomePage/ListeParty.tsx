import React, { useEffect, useState } from 'react';
import AvailableParty from '../../components/AvailableParty';
import '../../css/Pages/ListeParty.css';
import { Channel } from '../../models/channel';
import { GetChannels } from '../../services/getChannels';

export default function ListeParty() {
  let [games, setGames] = useState<Channel[]>([]);

  async function getListParty() {
    const requete = await GetChannels();
    const txt = await requete.text();
    return JSON.parse(txt);
  }

  const callLogin = () => 
  {
    window.location.replace("http://localhost:8080/auth/42/login")
  }

  useEffect(() => {
    getListParty().then((e) => setGames(e));
  }, []);

  return (
    <div className="ListeParty_block">
      <h2 className="ListeParty_title">Available Party: </h2>
      <div className="ListeParty_list">
        {games.map((e: Channel) => {
          return e.restriction !== 'private' ? (
            <AvailableParty
              name={e.name}
              password={e.restriction === 'public'}
              id={e.id.toString()}
            />
          ) : null;
        })}
      </div>
    </div>
  );
}
