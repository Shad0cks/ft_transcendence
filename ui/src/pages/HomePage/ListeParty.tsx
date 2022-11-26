import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import AvailableParty from '../../components/AvailableParty';
import '../../css/Pages/ListeParty.css';
import { Channel } from '../../models/channel';
import { GetChannels } from '../../services/Channel/getChannels';

export default function ListeParty({ socket }: { socket: Socket | undefined }) {
  let [games, setGames] = useState<Channel[]>([]);

  socket?.on('createChannel', function () {
    getListParty().then((e) => setGames(e));
  });

  async function getListParty() {
    const requete = await GetChannels();
    const txt = await requete.text();
    return JSON.parse(txt);
  }

  return (
    <div className="ListeParty_block">
      <h2 className="ListeParty_title">Available Channels: </h2>
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
