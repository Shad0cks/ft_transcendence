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

export let statusMap: Map<string, string> = new Map();

export const socket = glbsocket.connected ? glbsocket : setup();

socket?.on('connect', function () {});

socket?.on('StatusUpdate', function (e: any) {
  statusMap = new Map(JSON.parse(e));
});

socket?.on('disconnect', function () {});
