import { NavigateFunction } from 'react-router-dom';
import { SnackbarHook } from '../../customHooks/useSnackbar';
import { UserLogout } from '../User/userDelog';

export function AddNewBlockedUser(userNickname: string) {
  console.log(userNickname);
  return fetch(process.env.REACT_APP_API_URL + '/user/blocked', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ nickname: userNickname }),
  });
}

export function addNewBlockedUser(
  userNickname: string,
  snackbar: SnackbarHook,
  navigate: NavigateFunction,
) : boolean {
  let resFunc = false;
  snackbar.setSeverity('error');
  AddNewBlockedUser(userNickname)
    .then(async (res) => {
      if (res.ok) {
        resFunc = true;
        snackbar.setMessage(userNickname + ' blocked !');
        snackbar.setSeverity('success');
      } else if (res.status === 401) {
        await UserLogout();
        navigate('/');
        resFunc = false;
      } else {
        snackbar.setMessage('Error while blocking user.');
        resFunc = false;
      }
    })
    .catch((err) => {
      resFunc = false;
      console.error(err);
      snackbar.setMessage('Error while blocking user.');
    });
  snackbar.setOpen(true);
  return (resFunc);
}
