export function GetUserInfo(userNickname: string) {
  return fetch(process.env.REACT_APP_API_URL + '/user/' + userNickname, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    credentials: 'include',
  });
}
