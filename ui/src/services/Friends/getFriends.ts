export function GetFriends(userNickname: string) {
  return fetch(process.env.REACT_APP_API_URL + '/user/friends', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    credentials: 'include',
  });
}
