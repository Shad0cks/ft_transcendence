import { NavigateFunction } from 'react-router-dom';
import { SnackbarHook } from '../../customHooks/useSnackbar';
import { UserLogout } from '../User/userDelog';

export function UnblockUser(userNickname: string) {
  return fetch(process.env.REACT_APP_API_URL + '/user/blocked', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ nickname: userNickname }),
  });
}

export function unblockUser(
  userNickname: string,
  snackbar: SnackbarHook,
  navigate: NavigateFunction,
) {
  snackbar.setSeverity('error');
  UnblockUser(userNickname)
    .then(async (res) => {
      if (res.ok) {
        snackbar.setMessage(userNickname + ' unblocked !');
        snackbar.setSeverity('success');
      } else if (res.status === 401) {
        await UserLogout();
        navigate('/');
      } else {
        snackbar.setMessage('Error while unblocking user.');
      }
    })
    .catch((err) => {
      console.error(err);
      snackbar.setMessage('Error while unblocking user.');
    });
  snackbar.setOpen(true);
}
