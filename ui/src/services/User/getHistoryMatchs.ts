export function getHistoryMatchs(userNickname: string) {
  return fetch(
    process.env.REACT_APP_API_URL + '/user/' + userNickname + '/matches',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
      credentials: 'include',
    },
  );
}
