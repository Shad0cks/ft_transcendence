import { newUser } from '../../models/newUser';

export function createUser(user: newUser) {
  return fetch(process.env.REACT_APP_API_URL + '/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
}
