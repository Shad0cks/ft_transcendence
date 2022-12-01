export function GetInChannels() {
    return fetch(process.env.REACT_APP_API_URL + '/user/channels', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
      credentials: 'include',
    });
  }
  