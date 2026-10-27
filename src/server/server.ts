import { Socket as Client, Server as SocketIOServer } from 'socket.io';
import { createServer } from 'node:http';

interface ServerOptions {
    port: number;
    host?: string;
    corsOrigin?: string;
}

type DataEventHandler<T> = (data: T, client: Client) => void;
type ClientEventHandler = (client: Client) => void;

export default class Server {

    private lastTick = performance.now();
    private loopFunc: ((dt: number) => void) | null = null;
    private interval: NodeJS.Timeout;
    public maxFPS: number = 60;

    public readonly port: number;
    public readonly host: string;
    public readonly corsOrigin: string;
    public readonly clients: Set<Client> = new Set();
    private io: SocketIOServer;

    constructor(options: ServerOptions) {
        this.port = options.port;
        this.host = options.host ?? '127.0.0.1';
        this.corsOrigin = options.corsOrigin ?? '*';

        const httpServer = createServer();
        this.io = new SocketIOServer(httpServer, { cors: { origin: this.corsOrigin } });
        httpServer.listen(this.port, this.host);

        this.io.on('connection', (client: Client) => {
            this.clients.add(client);
            client.on('disconnect', () => this.clients.delete(client));
        });

        this.interval = setInterval(() => {
            const now = performance.now();
            const dt = (now - this.lastTick) / 1000;
            this.lastTick = now;

            if (this.loopFunc) this.loopFunc(dt);
        }, 1000 / this.maxFPS);
    }

    // Loop

    public setLoop(callback: (dt: number) => void) {
        this.loopFunc = callback;
    }

    public setMaxFPS(fps: number) {
        this.maxFPS = fps;

        if (this.interval) clearInterval(this.interval);
        
        this.interval = setInterval(() => {
            const now = performance.now();
            const dt = (now - this.lastTick) / 1000;
            this.lastTick = now;

            if (this.loopFunc) this.loopFunc(dt);
            
        }, 1000 / this.maxFPS);
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
        // attach to already-connected clients
        this.clients.forEach(client => client.on('disconnect', () => callback(client)));

        // attach to future connections
        this.io.on('connection', client => {
            client.on('disconnect', () => callback(client));
        });
    }
}