export function SetUserNickname(userNickname: string, newUserNick: string) {
  return fetch(
    process.env.REACT_APP_API_URL + '/user/' + userNickname + '/nickname/',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ nickname: newUserNick }),
    },
  );
}
