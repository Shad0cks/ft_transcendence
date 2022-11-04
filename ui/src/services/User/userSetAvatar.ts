import { newUser } from '../../models/newUser';

export function createUser(url: string, userId: string) {
  return fetch(process.env.REACT_APP_API_URL + '/user/'+userId+'/avatar/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(url),
  });
}
