export function RemoveFriend(deleteFriend: string, userNickname: string) {
  return fetch(
    process.env.REACT_APP_API_URL + '/user/' + userNickname + '/friends',
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ nickname: deleteFriend }),
    },
  );
}
