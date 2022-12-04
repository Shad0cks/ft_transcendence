import React, { useEffect, useRef, useState } from 'react';
import '../../css/Pages/MainUserProfile.css';
import { useNavigate } from 'react-router-dom';
import Header from '../HomePage/Header';
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

export default function MainUserProfile() {
  const navigate = useNavigate();
  const newName = useRef(null);
  const [user, setUser] = useState<GetUserIt>();
  const [username, setUsername] = useState<string | null>(null);
  const [secret, setSecret] = useState({
    otpauth_url: '',
    ascii: '',
  });
  const [openModal, setOpenModal] = useState(false);
  const speakeasy = require('speakeasy');

  useEffect(() => {
    const usernameStorage = localStorage.getItem('nickname');
    setUsername(usernameStorage);
    if (usernameStorage === null) navigate('/');

    GetUserInfo(usernameStorage!).then(async (res) => {
      if (res.ok) {
        const requete = res.text().then((e) => JSON.parse(e));
        requete.then((e: GetUserIt) => {
          console.log(e);
          setUser(e);
          setUsername(e.nickname);
        });
      } else if (res.status === 401) {
        await UserLogout();
        navigate('/');
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function updateName() {
    if (!newName.current) {
      return;
    }
    const newValue = (newName.current as HTMLInputElement).value;
    if (user && newValue !== '') {
      SetUserNickname(user.nickname, newValue).then(async (res) => {
        if (res.status === 401) {
          await UserLogout();
          window.location.reload();
        } else if (res.ok) {
          localStorage.setItem('nickname', newValue);
          window.location.reload();
        }
      });
    }
  }

  async function generateQrCode(user_id: string) {
    const secret = speakeasy.generateSecret({ name: 'ft_transcendence' });

    if (secret) {
      setOpenModal(true);
      console.log({
        ascii: secret.ascii,
        otpauth_url: secret.otpauth_url,
      });
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
      const fileExt = file.name.substring(file.name.lastIndexOf('.'));
      const newFile = new File([file], user.id.toString() + time + fileExt);
      const blobServiceClient = new BlobServiceClient(
        `https://${account}.blob.core.windows.net/?${sas}`,
      );
      const containerClient = blobServiceClient.getContainerClient('avatarimg');
      const blobClient = containerClient.getBlockBlobClient(newFile.name);
      const uploadBlobResponse = await blobClient.uploadBrowserData(newFile);
      console.log(
        `Upload block blob avatarimg successfully`,
        uploadBlobResponse.requestId,
      );
      UserSetAvatar(
        `https://avataruserstorage.blob.core.windows.net/avatarimg/${user.id.toString()}${time}${fileExt}`,
        user.nickname,
      ).then(async (res) => {
        if (res.status === 401) {
          await UserLogout();
          window.location.reload();
        } else if (res.ok) window.location.reload();
      });
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
    if (username && user) {
      UserSettwofa(false, 'none').then(async (res) => {
        if (res.status === 401) {
          await UserLogout();
          window.location.reload();
        } else if (res.ok) window.location.reload();
      });
    }
  }

  return username && user ? (
    <>
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
            />
            <Button
              onClick={updateName}
              variant="outline-success"
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
              <button type="button" onClick={() => unsetOTP()}>
                Disable 2FA
              </button>
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
    </>
  ) : null;
}
