import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Subscriber } from "rxjs";
import { Server, Socket } from "socket.io";
import { PlayerDTO } from "src/dto/player.dto";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketEvent{


    @WebSocketServer()
    server: Server;

    //connexion
    handleConnection(client: Socket){
        console.log(`Client Connected: ${client.id}`)
    }

    //deconnexion

    handleDisconnect(client: Socket){
        console.log(`Client disConnected: ${client.id}`)
    }

    //recevoir un event (s'abboner à un message)
    // @SubscribeMessage(`message`)
    // handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket){
    //     // envoyer un event
    //     this.server.emit('message', client.id, data);
    // }

    @SubscribeMessage('playermove') handleEvent( @MessageBody() data: PlayerDTO, @ConnectedSocket() client: Socket) 
    {
        this.server.emit('playermove', data);
    }

}
