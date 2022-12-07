import React, { useRef, useState } from 'react';
import '../css/Pages/MainUserProfile.css';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Image from 'react-bootstrap/Image';
import { BlobServiceClient } from '@azure/storage-blob';
import { Form } from 'react-bootstrap';
import 'reactjs-popup/dist/index.css';

export default function Register() {
  //const navigate = useNavigate();
  const newName = useRef(null);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);

  function Register() {
    if (!newName.current) {
      return;
    }
    const nickname = (newName.current as HTMLInputElement).value;
    const sendavatar = avatar !== undefined ? avatar : 'default';

    if (nickname !== '' && sendavatar !== '') {
      window.location.replace(
        'http://localhost:8080/auth/42/register/' + nickname + '/' + sendavatar,
      );
    }
  }

  async function updateImg(event: React.ChangeEvent<HTMLInputElement>) {
    setAvatar('');
    const account = process.env.REACT_APP_AZURE_ACCOUNT_NAME;
    const sas = process.env.REACT_APP_SAS_TOKEN;
    const time = Date.now();

    if (event.target.files && event.target.files.length === 1) {
      const file = event.target.files[0];
      const fileExt = file.name.substring(file.name.lastIndexOf('.'));
      const newFile = new File([file], 'default' + time + fileExt);
      const blobServiceClient = new BlobServiceClient(
        `https://${account}.blob.core.windows.net/?${sas}`,
      );
      const containerClient = blobServiceClient.getContainerClient('avatarimg');
      const blobClient = containerClient.getBlockBlobClient(newFile.name);
      await blobClient.uploadBrowserData(newFile);
      setAvatar(`${'default'}${time}${fileExt}`);
    }
  }

  return (
    <>
      <div>
        <div className="MainUserProfile_block">
          <h1>Setup Profile</h1>
          <Image
            style={{ width: '150px', height: '150px', cursor: 'pointer' }}
            src={avatar}
            roundedCircle
          />
          <InputGroup className="mb-3" style={{ width: '300px' }}>
            <Form.Control
              placeholder="Username"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              defaultValue={''}
              ref={newName}
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
              variant="outline-success"
              id="button-addon2"
            >
              Register
            </Button>
          </InputGroup>
        </div>
      </div>
    </>
  );
}
