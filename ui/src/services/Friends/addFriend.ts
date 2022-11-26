export function AddFriend(newFriend: string, userNickname: string) {
  return fetch(process.env.REACT_APP_API_URL + '/user/friends', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ nickname: newFriend }),
  });
}
