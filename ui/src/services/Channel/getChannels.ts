export function GetChannels() {
  return fetch(process.env.REACT_APP_API_URL + '/chat/channels');
}
