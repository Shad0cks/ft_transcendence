export function Valide2Fa(userNickname: string, tokendata: string) {
  return fetch(
    process.env.REACT_APP_API_URL + '/user/' + userNickname + '/valide2fa/',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ token: tokendata }),
    },
  );
}
