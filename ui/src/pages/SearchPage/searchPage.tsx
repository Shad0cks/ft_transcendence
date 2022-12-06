import React, { useRef, useState } from 'react';
import Header from '../../components/Header';
import useLoggedUser from '../../customHooks/useLoggedUser.hook';
import { Button, InputGroup, Form } from 'react-bootstrap';
import { GetUserIt } from '../../models/getUser';
import UserProfile from '../../components/UserProfile';
import useSnackbar, { SnackbarHook } from '../../customHooks/useSnackbar';
import TSSnackbar from '../../components/TSSnackbar';
import { GetUserInfo } from '../../services/User/getUserInfo';

export function searchUser(
  nickname: string | undefined | null,
  setUser: (c: GetUserIt | undefined | null) => void,
  snackbar: SnackbarHook,
): void {
  if (!nickname) {
    return;
  }
  GetUserInfo(nickname).then((response) => {
    if (response.ok) {
      response.text().then((object) => {
        const user = JSON.parse(object);
        setUser(user);
      });
    } else {
      setUser(null);
      snackbar.setMessage('User not found');
      snackbar.setSeverity('error');
      snackbar.setOpen(true);
    }
  });
}

export default function SearchPage() {
  const user = useLoggedUser().user;
  const snackbar = useSnackbar();
  const searchUserNicknameInput = useRef<HTMLInputElement>(null);
  const [searchedUser, setSearchedUser] = useState<
    GetUserIt | undefined | null
  >();
  let getUserProfile;

  if (!user) {
    return <div></div>;
  }

  if (!searchedUser) {
    getUserProfile = () => {
      return <div></div>;
    };
  } else {
    getUserProfile = () => {
      return (
        <UserProfile
          searchedUser={searchedUser}
          user={user}
          snackbar={snackbar}
        />
      );
    };
  }

  return (
    <div>
      <Header username={user!.nickname} iconUser={user!.avatar} />
      <InputGroup
        className="mb-3"
        style={{ margin: '100px auto', width: '300px', alignSelf: 'center' }}
      >
        <Form.Control
          placeholder="User nickname"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          ref={searchUserNicknameInput}
        />
        <Button
          variant="outline-success"
          id="button-addon2"
          onClick={() =>
            searchUser(
              searchUserNicknameInput.current?.value,
              setSearchedUser,
              snackbar,
            )
          }
        >
          Search
        </Button>
      </InputGroup>
      <div className="containerRow">{getUserProfile()}</div>
      <TSSnackbar
        open={snackbar.open}
        setOpen={snackbar.setOpen}
        severity={snackbar.severity}
        message={snackbar.message}
      />
    </div>
  );
}
