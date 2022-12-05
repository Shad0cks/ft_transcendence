import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import AvailableParty from '../../components/AvailableParty';
import '../../css/Pages/ListeParty.css';
import { ChannelDTO } from '../../models/channel';
import { GetChannels } from '../../services/Channel/getChannels';
import { GetInChannels } from '../../services/Channel/getInChannels';
import { UserLogout } from '../../services/User/userDelog';
import { GetUserAdmin } from '../../services/User/getUserAdmin';

export default function ListeParty({
  socket,
  username,
  editParty,
}: {
  socket: Socket | undefined;
  username: string;
  editParty: (e: ChannelDTO) => void;
}) {
  const navigate = useNavigate();
  let [channel, setChannel] = useState<ChannelDTO[]>([]);
  let [inChannel, setInChannel] = useState<ChannelDTO[]>([]);
  const [admins, setAdmins] = useState<{ channelname: string }[]>();

  const joinChannel = (e: ChannelDTO) => {
    socket?.emit('joinChannel', {
      channelName: e.name,
      userNickname: username,
      isAdmin: false,
      password: e.password,
    });
    setInChannel((inChannel) => [...inChannel, e]);
  };

  function getAdminListChannel() {
    GetUserAdmin().then(async (e) => {
      if (e.status === 401) {
        await UserLogout();
        navigate('/');
      } else if (e.ok) e.text().then((i) => setAdmins(JSON.parse(i)));
    });
  }

  const leaveChannel = (e: ChannelDTO) => {
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

  useEffect(() => {
    socket?.on('createChannel', function () {
      getListChannel().then((e) => setChannel(e));
      getListInChannel().then((e) => setInChannel(e));
    });

    socket?.on('channelEdited', function () {
      getListChannel().then((e) => setChannel(e));
      getListInChannel().then((e) => setInChannel(e));
    });
    return () => {
      socket?.off('connect');
      socket?.off('createChannel');
    };
  }, [socket, channel]); // eslint-disable-line react-hooks/exhaustive-deps

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
    getAdminListChannel();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="ListeParty_block">
      <h2 className="ListeParty_title">Available Channels: </h2>
      <div className="ListeParty_list">
        {channel.map((e: ChannelDTO, i: number) => {
          console.log(e);
          return e.privacy !== 'private' ? (
            <AvailableParty
              key={i}
              name={e.name}
              password={e.privacy === 'public'}
              id={e.id.toString()}
              isIn={inChannel.find((x) => x.id === e.id) !== undefined}
              joinChannel={() => joinChannel(e)}
              leaveChannel={() => leaveChannel(e)}
              editChannel={() => editParty(e)}
              isAdmin={
                admins?.find((x) => x.channelname === e.name) !== undefined
              }
            />
          ) : null;
        })}
      </div>
    </div>
  );
}
