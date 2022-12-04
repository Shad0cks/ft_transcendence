import { NavigateFunction } from 'react-router-dom';
import { SnackbarHook } from '../../customHooks/useSnackbar';
import { UserLogout } from '../User/userDelog';

export function AddFriend(newFriend: string, userNickname: string) {
  return fetch(process.env.REACT_APP_API_URL + '/user/friends', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ nickname: newFriend }),
  });
}

export function addFriend(
  friendNickname: string,
  userNickname: string,
  snackbar: SnackbarHook,
  navigate: NavigateFunction,
) {
  snackbar.setSeverity('error');
  AddFriend(friendNickname, userNickname!)
    .then(async (res) => {
      if (res.ok) {
        snackbar.setMessage('New friend added !');
        snackbar.setSeverity('success');
      } else if (res.status === 401) {
        await UserLogout();
        navigate('/');
      } else {
        snackbar.setMessage('Error while adding friend.');
      }
    })
    .catch((err) => {
      console.error(err);
      snackbar.setMessage('Error while adding friend.');
    });
  snackbar.setOpen(true);
}
