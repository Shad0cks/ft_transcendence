import React, {useEffect, useState} from 'react';
import '../../css/Pages/MainUserProfile.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../HomePage/Header';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Image from 'react-bootstrap/Image'
import { GetUserIt } from '../../models/getUser';
import { GetUserInfo } from '../../services/User/getUserInfo';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';


export default function MainUserProfile() {

  const {state} = useLocation();
  const navigate = useNavigate();
  const [newName, setNewName] = useState<string>('')
  const [user, setUser] = useState<GetUserIt>()
  const [selectedImage, setSelectedImage] = useState<string>();

  useEffect(() => {
    if (state === null || state.username === undefined)
      navigate('/', {state :{alreadyUsername: undefined, alreadyLog: false}})
    

    GetUserInfo(state.username).then((res) =>
      {
        if (res.ok)
        {
          const requete = res.text().then((e) => JSON.parse(e));
          requete.then((e: GetUserIt) => {
            setUser(e);
          })
        }
        else
        {
          console.log("err req", res.status)
        }
      }
    )
    .catch((err) => {
      navigate('/', {state :{alreadyUsername: undefined, alreadyLog: false}})
      console.log(err);
    });
  }, [])// eslint-disable-line react-hooks/exhaustive-deps

  function updateName ()
  {
    console.log(newName) 
    
  }
 
  async function updateImg (event : React.ChangeEvent<HTMLInputElement>) 
  {
    const account = process.env.REACT_APP_AZURE_ACCOUNT_NAME;
    const sas = process.env.REACT_APP_SAS_TOKEN;

    if (event.target.files && event.target.files.length === 1)
    {
      const file = event.target.files[0];
      const newFile = new File([file], state.username + file.name.substring(file.name.lastIndexOf('.')));
      const blobServiceClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net/?${sas}`,
      
      );
      const containerClient = blobServiceClient.getContainerClient("avatarimg");
      const blobClient = containerClient.getBlockBlobClient(newFile.name);
      const uploadBlobResponse = await blobClient.uploadBrowserData(newFile);
      console.log(
        `Upload block blob avatarimg successfully`,
        uploadBlobResponse.requestId,
      );
        
    } 
  }

  return (
    state ? 
    (
      <div>
        <Header username={state.username}/>
        <div className="MainUserProfile_block">
          <h1>Edit Profile</h1>  
          <Image style={{width: "150px", cursor: "pointer"}} src={"https://picsum.photos/1080/1080"} roundedCircle/> 
          <InputGroup className="mb-3" style={{width: "300px"}}>
            <Form.Control
              placeholder="Username"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              value={user?.nickname}
              onChange={(event : React.ChangeEvent<HTMLInputElement>) => setNewName(event.target.value)} 
            />
            <Button onClick={updateName} variant="outline-success" id="button-addon2">
              Update
            </Button> 
            <div style={{marginTop: "40px"}}>
              <label htmlFor="avatar">Change profile picture:</label> 
              <input  onChange={(e) => updateImg(e)} style={{marginTop: "5px"}} type="file" id='avatar' name="myImage" accept="image/png, image/jpeg" />    
            </div> 
            
        </InputGroup>
        
        </div>
      </div>
    )
    :
    (null)
  );
}
 