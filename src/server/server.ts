import { Socket, Server as SocketIOServer } from 'socket.io';

interface ServerOptions {
    port: number;
    corsOrigin?: string;
}

type EventHandler<T> = (data: T, socket: Socket) => void;

export default class Server {

    public readonly port: number;
    public readonly corsOrigin: string;
    public readonly clients: Set<Socket> = new Set();
    private io: SocketIOServer;

    constructor(options: ServerOptions) {
        this.port = options.port;
        this.corsOrigin = options.corsOrigin ?? '*';
        this.io = new SocketIOServer(this.port, { cors: { origin: this.corsOrigin }});

        this.io.on('connection', (socket: Socket) => {

            this.clients.add(socket);
            socket.on('disconnect', () => this.clients.delete(socket));
        });
    }

    // Methods

    public broadcast<T = unknown>(eventName: string, data: T, clients?: Socket[]) {
        if (!clients) {
            this.io.emit(eventName, data);
            return;
        }

        clients.forEach(c => c.emit(eventName, data));
    }

    public on<T = unknown>(eventName: string, callback: EventHandler<T>) {
        this.clients.forEach(socket => socket.on(eventName, (data: T) => callback(data, socket)));

        this.io.on('connection', (socket: Socket) => {
            socket.on(eventName, (data: T) => callback(data, socket));
        });
    }
}