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

export default function MainUserProfile() {

  const {state} = useLocation();
  const navigate = useNavigate();
  const [newName, setNewName] = useState<string>('')
  const [user, setUser] = useState<GetUserIt>()

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

  function updateImg ()
  {
    
  }

  return (
    state ? 
    (
      <div>
        <Header username={state.username}/>
        <div className="MainUserProfile_block">
          <h1>Edit Profile</h1> 
          <Image style={{width: "150px", cursor: "pointer"}} onClick={updateImg} src={user?.avatar} roundedCircle/>
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
        </InputGroup>
        </div>
      </div>
    )
    :
    (null)
  );
}
