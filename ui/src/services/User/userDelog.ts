import { NavigateFunction } from 'react-router-dom';

export function UserLogout() {
  localStorage.removeItem('nickname');
  return fetch(process.env.REACT_APP_API_URL + '/auth/logout', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    credentials: 'include',
  });
}

export async function disconnect(navigate: NavigateFunction) {
  await UserLogout();
  navigate('/');
}
