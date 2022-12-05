import { NavigateFunction } from 'react-router-dom';
import { SnackbarHook } from '../../customHooks/useSnackbar';
import { UserLogout } from '../User/userDelog';

export function RemoveFriend(deleteFriend: string, userNickname: string) {
  return fetch(process.env.REACT_APP_API_URL + '/user/friends', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ nickname: deleteFriend }),
  });
}

export function deleteFriend(
  friendNickname: string,
  userNickname: string,
  snackbar: SnackbarHook,
  navigate: NavigateFunction,
) {
  snackbar.setSeverity('error');
  RemoveFriend(friendNickname, userNickname!)
    .then(async (res) => {
      if (res.ok) {
        snackbar.setMessage('Friend deleted');
        snackbar.setSeverity('success');
      } else if (res.status === 401) {
        await UserLogout();
        navigate('/');
      } else {
        snackbar.setMessage('Error while deleting friend.');
      }
    })
    .catch((err) => {
      snackbar.setMessage('Error while deleting friend.');
    });
  snackbar.setOpen(true);
}
