import { Channel } from '../models/channel';

export function createChannel(channel: Channel) {
  return fetch(process.env.REACT_APP_API_URL + '/chat/channels', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(channel),
  });
}
