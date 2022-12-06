export function GetUserAdmin() {
  return fetch(process.env.REACT_APP_API_URL + '/chat/channels/imAdmin', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    credentials: 'include',
  });
}
