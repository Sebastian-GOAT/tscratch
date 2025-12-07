import { Socket as Client, Server as SocketIOServer } from 'socket.io';

interface ServerOptions {
    port: number;
    corsOrigin?: string;
}

type DataEventHandler<T> = (data: T, client: Client) => void;
type ClientEventHandler = (client: Client) => void;

export default class Server {

    public readonly port: number;
    public readonly corsOrigin: string;
    public readonly clients: Set<Client> = new Set();
    private io: SocketIOServer;

    constructor(options: ServerOptions) {
        this.port = options.port;
        this.corsOrigin = options.corsOrigin ?? '*';
        this.io = new SocketIOServer(this.port, { cors: { origin: this.corsOrigin }});

        this.io.on('connection', (client: Client) => {

            this.clients.add(client);
            client.on('disconnect', () => this.clients.delete(client));
        });
    }

    // Methods

    public broadcast<T = unknown>(eventName: string, data: T, clients?: Client[]) {
        if (!clients) {
            this.io.emit(eventName, data);
            return;
        }

        clients.forEach(c => c.emit(eventName, data));
    }

    public broadcastExcept<T = unknown>(eventName: string, data: T, except: Client[]) {
        
        const exclude = new Set(except);
        const targets = this.clients.difference(exclude);

        for (const client of targets)
            client.emit(eventName, data);
    }

    public on<T = unknown>(eventName: string, callback: DataEventHandler<T>) {
        this.clients.forEach(client => client.on(eventName, (data: T) => callback(data, client)));

        this.io.on('connection', (client: Client) => {
            client.on(eventName, (data: T) => callback(data, client));
        });
    }

    public onJoin(callback: ClientEventHandler) {
        this.clients.forEach(callback);
        this.io.on('connection', callback);
    }

    public onLeave(callback: ClientEventHandler) {
        this.io.on('connection', client => {
            client.on('disconnect', () => callback(client));
        });
    }
}