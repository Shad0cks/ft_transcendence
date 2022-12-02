export function GetMessages(channelID: number) {
  return fetch(
    process.env.REACT_APP_API_URL + '/chat/channels/' + channelID + '/messages',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
      credentials: 'include',
    },
  );
}
