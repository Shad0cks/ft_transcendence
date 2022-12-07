import { IoAdapter } from '@nestjs/platform-socket.io';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ConnectedUsers } from 'src/socket/connectedUsers';
import { JwtPayload } from 'src/strategies/Jwt.strategy';

export interface CustomSocket extends Socket {
  user: any;
}

const Clients = new ConnectedUsers();

function getCookieFromHeader(allCookies: string, toFind: string): string {
  return allCookies
    .split('; ')
    .find((cookie: string) => cookie.startsWith(toFind))
    .split('=')[1];
}

function getTokenPayload(socket: CustomSocket): JwtPayload {
  // extract jwt cookie
  const token = getCookieFromHeader(socket.handshake.headers.cookie, 'jwt');
  const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

  return payload;
}

export class WsAdapter extends IoAdapter {
  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, {
      ...options,
      cors: { origin: 'http://localhost:3000', credentials: true },
    });
    server.use((socket: CustomSocket, next: any) => {
      try {
        // authenticate the socket connection
        const payload = getTokenPayload(socket);
        if (!payload || !payload.isAuthenticated) {
          next(new Error('Unauthorized'));
        }

        // disconnect old potential instances of user socket
        // that might be left open
        if (Clients.isActive(payload.nickname)) {
          const socketId = Clients.getSocketId(payload.nickname);
          const socket: Socket = server.sockets.sockets.get(socketId);
          if (socket) {
            socket.disconnect();
          }
        }

        Clients.add(payload.nickname, socket.id);
        socket.user = { nickname: payload.nickname, login42: payload.login42 };

        // automatically updates Clients on disconnection
        socket.on('disconnect', () => {
          Clients.remove(socket.user.nickname);
        });

        next();
      } catch (error) {
        next(new Error(error));
      }
    });
    return server;
  }
}

export { Clients };
