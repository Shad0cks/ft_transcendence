import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AvailableParty from '../../components/AvailableParty';
import '../../css/Pages/ListeParty.css';
import { Channel } from '../../models/channel';
import { GetChannels } from '../../services/Channel/getChannels';
import { GetInChannels } from '../../services/Channel/getInChannels';
import { UserLogout } from '../../services/User/userDelog';

export default function ListeParty() {
  const navigate = useNavigate();
  let [channel, setChannel] = useState<Channel[]>([]);
  let [inChannel, setInChannel] = useState<Channel[]>([]);

  async function getListChannel() {
    const requete = await GetChannels();
    if (requete.status === 401) {
      await UserLogout();
      navigate('/');
    }
    const txt = await requete.text();
    return JSON.parse(txt);
  }

  async function getListInChannel() {
    const requete = await GetInChannels();
    if (requete.status === 401) {
      await UserLogout();
      navigate('/');
    }
    const txt = await requete.text();
    return JSON.parse(txt);
  }

  useEffect(() => {
    getListChannel().then((e) => setChannel(e));
    getListInChannel().then((e) => setInChannel(e));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="ListeParty_block">
      <h2 className="ListeParty_title">Available Channels: </h2>
      <div className="ListeParty_list">
        {channel.map((e: Channel) => {
          return e.restriction !== 'private' ? (
            <AvailableParty
              name={e.name}
              password={e.restriction === 'public'}
              id={e.id.toString()}
              isIn={inChannel.find(x => x.id === e.id) !== undefined}
            />
          ) : null;
        })}
      </div>
    </div>
  );
}
