export function GetChannels() {
  return fetch(process.env.REACT_APP_API_URL + '/chat/channels', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    credentials: 'include',
  });
}
