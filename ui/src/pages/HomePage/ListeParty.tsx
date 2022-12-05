import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import AvailableParty from '../../components/AvailableParty';
import '../../css/Pages/ListeParty.css';
import { ChannelDTO } from '../../models/channel';
import { GetChannels } from '../../services/Channel/getChannels';
import { GetInChannels } from '../../services/Channel/getInChannels';
import { UserLogout } from '../../services/User/userDelog';
import { GetUserAdmin } from '../../services/User/getUserAdmin';
import Popup from 'reactjs-popup';
import { Button, Form, InputGroup } from 'react-bootstrap';

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
  const joinPassword = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [joinWithPassSave, SetJoinWithPassSave] = useState<ChannelDTO>();

  const joinWithPass = () => {
    if (!joinWithPassSave || !joinPassword.current) return;
    const pass = (joinPassword.current as HTMLInputElement).value;

    socket?.emit('joinChannel', {
      channelName: joinWithPassSave.name,
      userNickname: username,
      isAdmin: false,
      password: pass,
    });
    setOpenModal(false);
  };

  const joinChannel = (e: ChannelDTO) => {
    if (e.privacy === 'protected') {
      SetJoinWithPassSave(e);
      setOpenModal(true);
    } else {
      socket?.emit('joinChannel', {
        channelName: e.name,
        userNickname: username,
        isAdmin: false,
        password: e.password,
      });
    }
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

    socket?.on('joinChannel', function (e) {
      if (e.userNickname === username)
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
      <Popup
        open={openModal}
        closeOnDocumentClick
        onClose={() => setOpenModal(false)}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100px',
            backgroundColor: '#282c34',
          }}
        >
          <div>
            <InputGroup className="mb-3" style={{ width: '300px' }}>
              <Form.Control
                id="imput"
                placeholder="Channel Password"
                aria-label="Recipient's token"
                aria-describedby="basic-addon2"
                ref={joinPassword}
              />
              <Button
                variant="outline-success"
                id="button-addon2"
                onClick={() => joinWithPass()}
              >
                Join
              </Button>
            </InputGroup>
          </div>
        </div>
      </Popup>
    </div>
  );
}
