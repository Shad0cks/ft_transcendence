import { io, Socket } from 'socket.io-client';

const glbsocket: Socket = io(`http://localhost:8080`, {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket'],
});

function setup() {
  glbsocket.connect();
  return glbsocket;
}

export const socket = glbsocket.connected ? glbsocket : setup();

socket?.on('connect', function () {
  console.log('Socket Connected');
});

socket?.on('StatusUpdate', function (e: any) {
  console.log('Socket recv', new Map(JSON.parse(e)));
});

socket?.on('disconnect', function () {
  console.log('Socket disconnected');
});
