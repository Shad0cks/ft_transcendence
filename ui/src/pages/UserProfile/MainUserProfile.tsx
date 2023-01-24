import React, { useEffect, useRef, useState } from 'react';
import '../../css/Pages/MainUserProfile.css';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Image from 'react-bootstrap/Image';
import { GetUserIt } from '../../models/getUser';
import { GetUserInfo } from '../../services/User/getUserInfo';
import { BlobServiceClient } from '@azure/storage-blob';
import { UserSetAvatar } from '../../services/User/userSetAvatar';
import { SetUserNickname } from '../../services/User/setUserNickname';
import { UserSettwofa } from '../../services/User/UserSettwofa';
import { Form } from 'react-bootstrap';
import TwoFactorAuth from '../../components/TwoFactorAuth';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { UserLogout } from '../../services/User/userDelog';
import TSSnackbar from '../../components/TSSnackbar';
import useSnackbar, { SnackbarHook } from '../../customHooks/useSnackbar';
import { socket } from '../../services/socket';
import useReceiveInvite from '../../customHooks/receiveInvite';
import Background from '../../components/background';

export default function MainUserProfile() {
  const navigate = useNavigate();
  const newName = useRef(null);
  const disable2fa = useRef(null);
  const [user, setUser] = useState<GetUserIt>();
  const [username, setUsername] = useState<string | null>(null);
  const [secret, setSecret] = useState({
    otpauth_url: '',
    ascii: '',
  });
  const [openModal, setOpenModal] = useState(false);
  const snackbar = useSnackbar();
  const sender = useReceiveInvite(snackbar, navigate);
  const speakeasy = require('speakeasy');

  useEffect(() => {
    const usernameStorage = localStorage.getItem('nickname');
    setUsername(usernameStorage);
    if (usernameStorage === null) navigate('/');

    GetUserInfo(usernameStorage!).then(async (res) => {
      if (res.ok) {
        const requete = res.text().then((e) => JSON.parse(e));
        requete.then((e: GetUserIt) => {
          setUser(e);
          setUsername(e.nickname);
        });
      } else if (res.status === 401) {
        await UserLogout();
        navigate('/');
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function updateName(snackbar: SnackbarHook) {
    if (!newName.current) {
      return;
    }
    const newValue = (newName.current as HTMLInputElement).value;
    if (newValue.length > 10)
    {
      snackbar.setMessage('Nickname max lengh : 10');
      snackbar.setSeverity('error');
      snackbar.setOpen(true);
      return;
    }
    if (user && newValue !== '') {
      SetUserNickname(user.nickname, newValue).then(async (res) => {
        if (res.status === 401) {
          await UserLogout();
          window.location.reload();
        } else if (res.ok) {
          localStorage.setItem('nickname', newValue);
          socket.emit('ChangeNickname', user.nickname);
          window.location.reload();
        } else {
          snackbar.setMessage('Nickname already taken');
          snackbar.setSeverity('error');
          snackbar.setOpen(true);
        }
      });
    }
  }

  async function generateQrCode(user_id: string) {
    const secret = speakeasy.generateSecret({ name: 'ft_transcendence' });

    if (secret) {
      setOpenModal(true);
      setSecret({
        ascii: secret.ascii,
        otpauth_url: secret.otpauth_url,
      });
    } else {
    }
  }

  async function updateImg(event: React.ChangeEvent<HTMLInputElement>) {
    const account = process.env.REACT_APP_AZURE_ACCOUNT_NAME;
    const sas = process.env.REACT_APP_SAS_TOKEN;
    const time = Date.now();

    if (user && event.target.files && event.target.files.length === 1) {
      const file = event.target.files[0];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLocaleLowerCase();
      if (
        (fileExt !== '.jpeg' && fileExt !== '.png') ||
        file.name.indexOf('.') === -1
      ) {
        snackbar.setMessage('Only JPEG and PNG files are allowed');
        snackbar.setSeverity('error');
        snackbar.setOpen(true);
        return;
      }
      let img = document.createElement('img');
      img.onload = async () => {
        if (img.width === img.height) {
          const newFile = new File([file], user.id.toString() + time + fileExt);
          const blobServiceClient = new BlobServiceClient(
            `https://${account}.blob.core.windows.net/?${sas}`,
          );
          const containerClient =
            blobServiceClient.getContainerClient('avatarimg');
          const blobClient = containerClient.getBlockBlobClient(newFile.name);
          await blobClient.uploadData(newFile);
          UserSetAvatar(
            `https://avataruserstorage.blob.core.windows.net/avatarimg/${user.id.toString()}${time}${fileExt}`,
            user.nickname,
          ).then(async (res) => {
            if (res.status === 401) {
              await UserLogout();
              window.location.reload();
            } else if (res.ok) window.location.reload();
          });
        } else {
          snackbar.setMessage('Image must be square (x=y)');
          snackbar.setSeverity('error');
          snackbar.setOpen(true);
          return;
        }
      };
      img.src = URL.createObjectURL(file);
    }
  }

  function setotp() {
    if (username && user && secret.ascii) {
      UserSettwofa(true, secret.ascii).then(async (res) => {
        if (res.status === 401) {
          await UserLogout();
          window.location.reload();
        } else if (res.ok) window.location.reload();
      });
    }
  }

  function unsetOTP() {
    if (!disable2fa.current)
      return;
    const token : string = (disable2fa.current as HTMLInputElement).value
    if (username && user) {
      UserSettwofa(false, token).then(async (res) => {
        if (res.status === 401) {
          await UserLogout();
          window.location.reload();
        } else if (res.ok) window.location.reload();
        else{
          snackbar.setMessage('Code not valid');
          snackbar.setSeverity('error');
          snackbar.setOpen(true);
        }
      });
    }
  }

  return username && user ? (
    <>
      <Background />
      <div>
        <Header username={username} iconUser={user?.avatar} />
        <div className="MainUserProfile_block">
          <h1>Edit Profile</h1>
          <Image
            style={{ width: '150px', height: '150px', cursor: 'pointer' }}
            src={user.avatar}
            roundedCircle
          />
          <InputGroup className="mb-3" style={{ width: '300px' }}>
            <Form.Control
              placeholder="Username"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              defaultValue={username}
              ref={newName}
              maxLength={10}
            />
            <Button
              onClick={() => updateName(snackbar)}
              variant="outline-dark"
              id="button-addon2"
            >
              Update
            </Button>
            <div style={{ marginTop: '40px' }}>
              <label htmlFor="avatar">Change profile picture:</label>
              <input
                onChange={(e) => updateImg(e)}
                style={{ marginTop: '5px' }}
                type="file"
                id="avatar"
                name="myImage"
                accept="image/png, image/jpeg"
              />
            </div>
          </InputGroup>

          <div>
            {user.twofa_enabled ? (
              <InputGroup className="mb-3" style={{ width: '300px' }}>
              <Form.Control
                placeholder="Code 2FA"
                aria-label="Recipient's 2fa"
                aria-describedby="basic-addon2"
                ref={disable2fa}
                maxLength={6}
              />
                <Button
                  onClick={() => unsetOTP()}
                  variant="outline-dark"
                  id="button-addon2"
                >
                  Disable 2FA
                </Button>
            </InputGroup>
            ) : (
              <button
                type="button"
                onClick={() => generateQrCode(user.nickname)}
              >
                Setup 2FA
              </button>
            )}
          </div>
        </div>
      </div> 
      <Popup
        open={openModal}
        closeOnDocumentClick
        onClose={() => setOpenModal(false)}
      >
        <TwoFactorAuth
          ascii={secret.ascii}
          otpauth_url={secret.otpauth_url}
          user_id={user.login42}
          closeModal={() => setOpenModal(false)}
          settwofa={() => setotp()}
        />
      </Popup>
      <TSSnackbar
        open={snackbar.open}
        setOpen={snackbar.setOpen}
        severity={snackbar.severity}
        message={snackbar.message}
        senderInvite={sender}
        username={username}
      />
    </>
  ) : null;
}
