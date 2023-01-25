import React, { useRef, useState } from 'react';
import '../css/Pages/MainUserProfile.css';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Image from 'react-bootstrap/Image';
import { BlobServiceClient } from '@azure/storage-blob';
import { Form } from 'react-bootstrap';
import 'reactjs-popup/dist/index.css';
import TSSnackbar from '../components/TSSnackbar';
import useSnackbar from '../customHooks/useSnackbar';
import Background from '../components/background';

export default function Register() {
  //const navigate = useNavigate();
  const newName = useRef(null);
  const snackbar = useSnackbar();
  const [avatar, setAvatar] = useState<string | undefined>('default.jpg');

  function Register() {
    if (!newName.current) {
      return;
    }
    const nickname = (newName.current as HTMLInputElement).value;
    const sendavatar = avatar !== 'default.jpg' ? avatar : 'default';

    if (nickname.length > 10) {
      snackbar.setMessage('Nickname max lengh : 10');
      snackbar.setSeverity('error');
      snackbar.setOpen(true);
      return;
    }

    if (nickname !== '' && sendavatar !== '') {
      window.location.replace(
        process.env.REACT_APP_API_URL +
          '/auth/42/register/' +
          nickname +
          '/' +
          sendavatar,
      );
    }
  }

  async function updateImg(event: React.ChangeEvent<HTMLInputElement>) {
    const account = process.env.REACT_APP_AZURE_ACCOUNT_NAME;
    const sas = process.env.REACT_APP_SAS_TOKEN;
    const time = Date.now();

    if (event.target.files && event.target.files.length === 1) {
      const file = event.target.files[0];
      const fileExt = file.name
        .substring(file.name.lastIndexOf('.'))
        .toLocaleLowerCase();
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
          const newFile = new File([file], 'default' + time + fileExt);
          const blobServiceClient = new BlobServiceClient(
            `https://${account}.blob.core.windows.net/?${sas}`,
          );
          const containerClient =
            blobServiceClient.getContainerClient('avatarimg');
          const blobClient = containerClient.getBlockBlobClient(newFile.name);
          await blobClient.uploadBrowserData(newFile);
          setAvatar(`${'default'}${time}${fileExt}`);
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

  return (
    <>
      <div>
        <Background />
        <div className="MainUserProfile_block">
          <h1>Setup Profile</h1>
          <Image
            style={{ width: '150px', height: '150px', cursor: 'pointer' }}
            src={
              'https://avataruserstorage.blob.core.windows.net/avatarimg/' +
              avatar
            }
            roundedCircle
          />
          <InputGroup className="mb-3" style={{ width: '300px' }}>
            <Form.Control
              placeholder="Username"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              defaultValue={''}
              ref={newName}
              maxLength={10}
            />
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
            <Button
              onClick={Register}
              variant="outline-dark"
              id="button-addon2"
            >
              Register
            </Button>
          </InputGroup>
        </div>
      </div>
      <TSSnackbar
        open={snackbar.open}
        setOpen={snackbar.setOpen}
        severity={snackbar.severity}
        message={snackbar.message}
        senderInvite={undefined}
        username={undefined}
      />
    </>
  );
}
