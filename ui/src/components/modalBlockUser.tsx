import React, { useRef, useState } from 'react';
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap';
import { BsFillTrashFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { SnackbarHook } from '../customHooks/useSnackbar';
import { GetUserIt } from '../models/getUser';
import { addNewBlockedUser } from '../services/User/addNewBlockedUser';
import { GetBlockedUers } from '../services/User/getBlockedUsers';
import { unblockUser } from '../services/User/UnblockUser';
import { UserLogout } from '../services/User/userDelog';

export default function ModalBlockUser({
  open,
  setOpen,
  snackbar,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  snackbar: SnackbarHook;
}) {
  const navigate = useNavigate();
  const [blockedList, setBlockedList] = useState<string[]>([]);
  const inputRef = useRef(null);
  async function getListBlockedUsers() {
    const requete = await GetBlockedUers();
    if (requete.status === 401) {
      await UserLogout();
      navigate('/');
    }
    const txt = await requete.text();
    return JSON.parse(txt);
  }

  async function newBlockedUser() {
    if (!inputRef.current) return;
    const inputValue = (inputRef.current as HTMLInputElement).value;
    if (await addNewBlockedUser(inputValue, snackbar, navigate))
      setBlockedList((prev) => [...prev, inputValue]);
  }

  function deleteBlockedUser(user: string) {
    unblockUser(user, snackbar, navigate);
    setBlockedList((prev) => prev.filter((x) => x !== user));
  }

  return (
    <Popup
      open={open}
      closeOnDocumentClick
      onClose={() => {
        setOpen(false);
        setBlockedList([]);
      }}
      onOpen={() => {
        getListBlockedUsers().then((e) =>
          e.forEach((x: GetUserIt) =>
            setBlockedList((prev) => [...prev, x.nickname]),
          ),
        );
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
        <InputGroup className="mb-3" style={{ width: 'min(80%, 300px)' }}>
          <Form.Control
            id="imput"
            placeholder="Block new user"
            aria-label="Recipient's token"
            aria-describedby="basic-addon2"
            ref={inputRef}
            maxLength={10}
          />
          <Button
            variant="outline-warning"
            id="button-addon2"
            onClick={() => newBlockedUser()}
          >
            Block
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
            <ListGroup.Item>Blocked Users :</ListGroup.Item>
            {blockedList?.map((elem, id) => (
              <ListGroup.Item key={id}>
                <div
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
                    onClick={() => deleteBlockedUser(elem)}
                  />
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    </Popup>
  );
}
