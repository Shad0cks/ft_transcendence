
export function GetMPsList(targetname: string) {
    return fetch(
      process.env.REACT_APP_API_URL + '/chat/direct_messages/' + targetname ,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
        credentials: 'include',
      },
    );
  }
  