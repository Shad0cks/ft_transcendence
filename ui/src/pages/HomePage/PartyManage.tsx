import React, { useEffect, useState } from 'react';
import PartyCreate from './partyCreate';
import ListeParty from './ListeParty';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../services/socket'; // eslint-disable-line
import { GetUserIt } from '../../models/getUser';
import { GetUserInfo } from '../../services/User/getUserInfo';
import { UserLogout } from '../../services/User/userDelog';
import { Button } from 'react-bootstrap';
import { ChannelDTO } from '../../models/channel';
import useReceiveInvite from '../../customHooks/receiveInvite';
import useSnackbar from '../../customHooks/useSnackbar';
import TSSnackbar from '../../components/TSSnackbar';

export default function PartyManage() {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const sender = useReceiveInvite(snackbar);
  const [username, setUsername] = useState<string | null>(null);
  const [channelEdit, setChannelEdit] = useState<ChannelDTO>();
  const [user, setUser] = useState<GetUserIt>();

  useEffect(() => {
    const usernameStorage = localStorage.getItem('nickname');
    setUsername(usernameStorage);
    if (usernameStorage === null) navigate('/');
    else
      GetUserInfo(localStorage.getItem('nickname')!).then(async (e) => {
        if (e.status === 401) {
          await UserLogout();
          navigate('/');
        } else if (e.ok) e.text().then((i) => setUser(JSON.parse(i)));
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function EditParty(e: ChannelDTO) {
    window.scrollTo(0, 0);
    setChannelEdit(e);
  }

  return username ? (
    <div style={{ fontFamily: 'Orbitron' }}>
      <Header username={username} iconUser={user?.avatar} />
      <PartyCreate
        username={username}
        channelEdit={channelEdit}
        setChannelEdit={setChannelEdit}
      />
      <ListeParty username={username} editParty={EditParty} />
      <div
        style={{
          backgroundColor: '#282c34 ',
          position: 'fixed',
          width: '100%',
          height: '80px',
          bottom: 0,
          boxShadow: '0px 0 10px rgba(0, 0, 0, 0.8)',
        }}
      >
        <Button
          style={{
            position: 'relative',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
          }}
          variant="success"
          id="button-addon"
          onClick={() => navigate('/chat')}
        >
          Back to channels
        </Button>
      </div>
      <TSSnackbar
        open={snackbar.open}
        setOpen={snackbar.setOpen}
        severity={snackbar.severity}
        message={snackbar.message}
        senderInvite={sender}
        username={username}
      />
    </div>
  ) : null;
}
