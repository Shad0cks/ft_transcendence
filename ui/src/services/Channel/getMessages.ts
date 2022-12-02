export function GetMessages(channelID: string) {
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
