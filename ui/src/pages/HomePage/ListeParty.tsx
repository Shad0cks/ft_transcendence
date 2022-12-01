import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import AvailableParty from '../../components/AvailableParty';
import '../../css/Pages/ListeParty.css';
import { Channel } from '../../models/channel';
import { GetChannels } from '../../services/Channel/getChannels';
import { GetInChannels } from '../../services/Channel/getInChannels';
import { UserLogout } from '../../services/User/userDelog';

export default function ListeParty({
  socket,
  username,
}: {
  socket: Socket | undefined;
  username: string;
}) {
  const navigate = useNavigate();
  let [channel, setChannel] = useState<Channel[]>([]);
  let [inChannel, setInChannel] = useState<Channel[]>([]);

  socket?.on('createChannel', function () {
    getListChannel().then((e) => setChannel(e));
  });

  const joinChannel = (e: Channel) => {
    socket?.emit('joinChannel', {
      channelName: e.name,
      userNickname: username,
      isAdmin: false,
      password: e.password,
    });
    setInChannel((inChannel) => [...inChannel, e]);
  };

  const leaveChannel = (e: Channel) => {
    socket?.emit('leaveChannel', {
      channelName: e.name,
      userNickname: username,
      isAdmin: false,
      password: e.password,
    });
    setInChannel(inChannel.filter((item) => item.id !== e.id));
  };

  useEffect(() => {
    getListChannel().then((e) => setChannel(e));
    getListInChannel().then((e) => setInChannel(e));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
  console.log(channel);
  useEffect(() => {
    getListChannel().then((e) => setChannel(e));
    getListInChannel().then((e) => setInChannel(e));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="ListeParty_block">
      <h2 className="ListeParty_title">Available Channels: </h2>
      <div className="ListeParty_list">
        {channel.map((e: Channel, i: number) => {
          return e.restriction !== 'private' ? (
            <AvailableParty
              key={i}
              name={e.name}
              password={e.restriction === 'public'}
              id={e.id.toString()}
              isIn={inChannel.find((x) => x.id === e.id) !== undefined}
              joinChannel={() => joinChannel(e)}
              leaveChannel={() => leaveChannel(e)}
            />
          ) : null;
        })}
      </div>
    </div>
  );
}
