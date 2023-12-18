// message.gateway.ts

import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({cors:true})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    // Handle a new WebSocket connection
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Handle WebSocket disconnection
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: any): void {
    // Handle incoming messages and broadcast to all connected clients
    this.server.emit('newMessage', payload);
  }
}
