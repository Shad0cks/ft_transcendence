export function GetBlockedUers() {
    return fetch(
      process.env.REACT_APP_API_URL + '/user/blocked',
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
        credentials: 'include',
      },
    );
  }
  