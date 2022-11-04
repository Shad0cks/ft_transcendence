export function GetUserInfo(id: string) {
    return fetch(process.env.REACT_APP_API_URL + '/user/' + id, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: "GET",
      credentials: "include"
    });
  }
  