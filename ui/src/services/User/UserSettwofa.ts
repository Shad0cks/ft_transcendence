export function UserSettwofa(stats: boolean, secret: string) {
  return fetch(process.env.REACT_APP_API_URL + '/user/2fa/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ stat: stats, data: secret }),
  });
}