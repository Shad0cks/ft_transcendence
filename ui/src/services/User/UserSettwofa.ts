export function UserSettwofa(
  stat: boolean,
  secret: string,
  userNickname: string,
) {
  return fetch(process.env.REACT_APP_API_URL + '/user/2fa/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ twofa_enabled: stat, twofa_secret: secret }),
  });
}
