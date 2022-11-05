import { GetUserInfo } from './User/getUserInfo';

export function ChechLocalStorage() {
  const usernameStorage = localStorage.getItem('nickname');
  if (usernameStorage === null) return;
  GetUserInfo(usernameStorage)
    .then((res) => {
      if (res.ok) return;
      else localStorage.removeItem('nickname');
    })
    .catch(() => {
      localStorage.removeItem('nickname');
    });
}
