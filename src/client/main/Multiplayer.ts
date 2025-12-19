import { io, Socket } from 'socket.io-client';

export default class Multiplayer {

    private static instance: Multiplayer;
    private socket: Socket;

    public static connect(serverURL: string = 'http://localhost:3000') {
        if (!this.instance)
            this.instance = new Multiplayer(serverURL);

        return this.instance;
    }

    public disconnect() {
        this.socket.disconnect();
    }

    private constructor(serverURL: string) {
        this.socket = io(serverURL);
    }

    // Methods

    public broadcast<T = unknown>(eventName: string, data: T) {
        this.socket.emit(eventName, data);
    }

    public on<T = unknown>(eventName: string, callback: (data: T) => void) {
        this.socket.on(eventName, callback);
    }
}