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
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap';
import { BsFillTrashFill } from 'react-icons/bs';

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
  const addUserWL = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalWhitelist, setOpenModalWhitelist] = useState(false);
  const [tmpChannel, SeTmpChannel] = useState<ChannelDTO>();

  const joinWithPass = () => {
    if (!tmpChannel || !joinPassword.current) return;
    const pass = (joinPassword.current as HTMLInputElement).value;

    socket?.emit('joinChannel', {
      channelName: tmpChannel.name,
      userNickname: username,
      isAdmin: false,
      password: pass,
    });
    setOpenModal(false);
  };

  const joinChannel = (e: ChannelDTO) => {
    if (e.privacy === 'protected') {
      SeTmpChannel(e);
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

    socket?.on('leaveChannel', function (e) {
      if (e.userNickname === username)
        setInChannel(inChannel.filter((item) => item.name !== e.channelName));
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

  const kickWhitlist = (user: string) => {
    if (!tmpChannel) return;
    socket?.emit('RemoveToWhitelist', {
      userNickname: user,
      channelName: tmpChannel.name,
    });
    SeTmpChannel({
      ...tmpChannel,
      whitelist: tmpChannel.whitelist.filter((x) => x !== user),
    });
  };

  const addUserWhitelist = () => {
    if (!tmpChannel || !addUserWL.current) return;
    let newUser = (addUserWL.current as HTMLInputElement).value;
    socket?.emit('AddToWhitelist', {
      userNickname: newUser,
      channelName: tmpChannel.name,
    });
    SeTmpChannel({
      ...tmpChannel,
      whitelist: [...tmpChannel.whitelist, newUser],
    });
  };

  const editWhitelist = (e: ChannelDTO) => {
    SeTmpChannel(e);
    setOpenModalWhitelist(true);
  };

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
          return e.privacy !== 'private' ||
            inChannel?.find((x) => x.name === e.name) ? (
            <AvailableParty
              key={i}
              name={e.name}
              password={e.privacy}
              id={e.id.toString()}
              isIn={inChannel.find((x) => x.id === e.id) !== undefined}
              joinChannel={() => joinChannel(e)}
              leaveChannel={() => leaveChannel(e)}
              editChannel={() => editParty(e)}
              isAdmin={
                admins?.find((x) => x.channelname === e.name) !== undefined
              }
              editWhitelist={() => editWhitelist(e)}
            />
          ) : null;
        })}
      </div>
      <Popup
        open={openModal}
        closeOnDocumentClick
        onClose={() => {
          setOpenModal(false);
          SeTmpChannel(undefined);
        }}
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
      <Popup
        open={openModalWhitelist}
        closeOnDocumentClick
        onClose={() => {
          setOpenModalWhitelist(false);
          getListChannel().then((e) => setChannel(e));
          getListInChannel().then((e) => setInChannel(e));
          SeTmpChannel(undefined);
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: 'auto',
            backgroundColor: '#282c34',
            paddingTop: '20px',
            paddingBottom: '20px',
            zIndex: 2,
            fontFamily: 'Orbitron',
          }}
        >
          <InputGroup className="mb-3" style={{ width: '300px' }}>
            <Form.Control
              id="imput"
              placeholder="Add user to channel"
              aria-label="Recipient's token"
              aria-describedby="basic-addon2"
              ref={addUserWL}
            />
            <Button
              variant="outline-success"
              id="button-addon2"
              onClick={() => addUserWhitelist()}
            >
              Add
            </Button>
          </InputGroup>
          <div>
            <ListGroup
              variant="flush"
              style={{
                overflow: 'scroll',
                height: '300px',
                backgroundColor: 'white',
              }}
            >
              <ListGroup.Item>Users in whitelist :</ListGroup.Item>
              {tmpChannel?.whitelist.map((elem, id) => (
                <ListGroup.Item key={id}>
                  <span
                    style={{
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }}
                  >
                    {elem}{' '}
                    <BsFillTrashFill
                      color="red"
                      style={{ cursor: 'pointer' }}
                      onClick={() => kickWhitlist(elem)}
                    />
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </Popup>
    </div>
  );
}
