export function UserSetAvatar(url: string, userNickname: string) {
  return fetch(
    process.env.REACT_APP_API_URL + '/user/' + userNickname + '/avatar/',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ avatar: url }),
    },
  );
}
