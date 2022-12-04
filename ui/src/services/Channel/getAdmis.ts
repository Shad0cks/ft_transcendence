export function GetAdmins(channelName: string) {
  return fetch(
    process.env.REACT_APP_API_URL + '/chat/channels/' + channelName + '/admins',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
      credentials: 'include',
    },
  );
}
