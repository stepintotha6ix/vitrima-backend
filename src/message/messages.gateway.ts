import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
	MessageBody,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { MessageService } from './messages.service'

@WebSocketGateway({ cors: true })
export class MessageGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server
	constructor(private readonly messageService: MessageService) {} // Inject MessageService

	handleConnection(client: Socket, ...args: any[]) {
		// Handle a new WebSocket connection
		console.log(`Client connected: ${client.id}`)
	}

	handleDisconnect(client: Socket) {
		// Handle WebSocket disconnection
		console.log(`Client disconnected: ${client.id}`)
	}

	@SubscribeMessage('server-path')
	handleMessage(@MessageBody() dto: any, @ConnectedSocket() client, payload: any): void {
		const res = {type: 'someType', dto}
		client.emit('client-path', res)
	}
}
