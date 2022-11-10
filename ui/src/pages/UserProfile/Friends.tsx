import React, { useEffect, useState, useRef } from 'react';
import Header from '../HomePage/Header';
import { useNavigate } from 'react-router-dom';
import { ChechLocalStorage } from '../../services/checkIsLog';
import { GetFriends } from '../../services/Friends/getFriends';
import { Button, InputGroup, Card, ButtonGroup, Form } from 'react-bootstrap';
import { AddFriend } from '../../services/Friends/addFriend';
import TSSnackbar from '../../components/TSSnackbar';
import { AlertColor } from '@mui/material';
import { GetUserIt } from '../../models/getUser';
import '../../css/Pages/Friends.css';
import { RiDeleteBinLine } from 'react-icons/ri';
import { RemoveFriend } from '../../services/Friends/removeFriend';

export default function Friends() {
  const navigate = useNavigate();
  const newFriend = useRef(null);
  const [username, setUsername] = useState<string | null>(null);
  const [friendsList, setFriendsList] = useState<GetUserIt[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>('success');

  function updateName() {
    if (!newFriend.current) {
      return;
    }
    const newFriendVal = (newFriend.current as HTMLInputElement).value;

    AddFriend(newFriendVal, username!)
      .then((res) => {
        if (res.ok) {
          setSnackbarMessage('Successfully adding new friend');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          const requete = res.text().then((e) => JSON.parse(e));
          requete.then((e) => {
            setFriendsList([...friendsList, e]);
          });
        } else {
          setSnackbarMessage('Error while adding friend.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setSnackbarMessage('Error while adding friend.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
  }

  function deleteFriend(friend: string, index: number) {
    setFriendsList([
      ...friendsList.slice(0, index),
      ...friendsList.slice(index + 1),
    ]);

    RemoveFriend(friend, username!)
      .then((res) => {
        if (res.ok) {
          setSnackbarMessage('Successfully deleted friend');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
        } else {
          setSnackbarMessage('Error while deleting friend.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setSnackbarMessage('Error while deleting friend.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
  }

  useEffect(() => {
    ChechLocalStorage();
    const usernameStorage = localStorage.getItem('nickname');
    setUsername(usernameStorage);
    if (usernameStorage === null) navigate('/');
    GetFriends(usernameStorage!)
      .then((res) => {
        if (res.ok) {
          const requete = res.text().then((e) => JSON.parse(e));
          requete.then((e) => {
            setFriendsList(e);
          });
        } else {
          console.log('err req', res.status);
        }
      })
      .catch((err) => {
        navigate('/');
        console.log(err);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Header username={username!} />
      <div className="containerFriend">
        <InputGroup
          className="mb-3"
          style={{ margin: '100px auto', width: '300px', alignSelf: 'center' }}
        >
          <Form.Control
            placeholder="Add Friend"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            ref={newFriend}
          />
          <Button
            variant="outline-success"
            id="button-addon2"
            onClick={updateName}
          >
            ADD
          </Button>
        </InputGroup>

        <div className="containerRow">
          {friendsList?.map((elem, key) => (
            <Card style={{ width: '18rem' }} key={key} border="primary">
              <Card.Img variant="top" src={elem.avatar} />
              <Card.Body className="cardBody">
                <Card.Title>{elem.nickname}</Card.Title>
                <Card.Text>
                  Wins : {elem.wins} / Losses: {elem.losses}
                </Card.Text>
                <ButtonGroup aria-label="Basic example">
                  <Button variant="secondary">Play</Button>
                  <Button variant="secondary">Profile</Button>
                  <Button variant="secondary">DM</Button>
                  <span
                    style={{
                      color: 'red',
                      marginRight: '.05em',
                      display: 'inline-block',
                    }}
                  >
                    &nbsp;
                  </span>
                  <Button
                    variant="danger"
                    onClick={() => deleteFriend(elem.nickname, key)}
                  >
                    <RiDeleteBinLine />
                  </Button>
                </ButtonGroup>
              </Card.Body>
            </Card>
          ))}
        </div>
        <TSSnackbar
          open={openSnackbar}
          setOpen={setOpenSnackbar}
          severity={snackbarSeverity}
          message={snackbarMessage}
        />
      </div>
    </div>
  );
}