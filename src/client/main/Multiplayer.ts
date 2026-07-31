import { io, Socket } from 'socket.io-client';
import { events, type Message, type ResponseStatus } from '@server/RoomManager.ts';

export default class Multiplayer<PlayerState = {}> {

    private static instance: Multiplayer;
    private socket: Socket;
    public roomClients: Map<string, PlayerState> = new Map;
    public id: string | null = null;
    public roomId: string | null = null;

    public static connect(serverURL: string = 'http://localhost:3000') {
        if (!this.instance)
            this.instance = new Multiplayer(serverURL);

        return this.instance;
    }

    public disconnect() {
        this.socket.disconnect();
    }

    // Methods

    public emit<T = unknown>(eventName: string, data: T) {
        this.socket.emit(eventName, data);
    }

    public on<T = unknown>(eventName: string, callback: (data: T) => void) {
        this.socket.on(eventName, callback);
    }

    // Rooms

    public createRoom(playerState: PlayerState, password?: string) {
        this.emit<{ password: string | null; customPlayerState: PlayerState; }>(events.room_creation_request, {
            password: password ?? null,
            customPlayerState: playerState
        });
    }

    public joinRoom(id: string, playerState: PlayerState, password?: string) {
        this.emit<{ password: string | null; id: string; customPlayerState: PlayerState }>(events.room_join_request, {
            customPlayerState: playerState,
            password: password ?? null,
            id
        });
    }

    public updatePlayerState(playerState: Partial<PlayerState>) {
        if (!this.id) throw new Error('The multiplayer connection has not been initialized');

        const existing = this.roomClients.get(this.id) ?? {} as PlayerState;
        this.roomClients.set(this.id, { ...existing, ...playerState });

        this.emit<{ newPlayerState: Partial<PlayerState> }>(events.room_state_update_request, {
            newPlayerState: playerState
        });
    }

    // Player state getter
    public getPlayerState() {
        if (!this.id) throw new Error('The multiplayer connection has not been initialized');

        return this.roomClients.get(this.id) ?? {} as PlayerState;
    }

    private constructor(serverURL: string) {
        this.socket = io(serverURL);
        this.socket.on('connect', () => this.id = this.socket.id ?? null);
        this.socket.on('disconnect', () => {
            this.id = null;
            this.roomId = null;
            this.roomClients.clear();
        });

        // Room server response handlers

        // Creation
        this.on<{ id: string; status: ResponseStatus; playerState: PlayerState }>(events.room_creation_response, data => {
            if (data.status === 'fail' || !this.id) throw new Error('Failed to create a new room.');

            this.roomId = data.id;
            this.roomClients.set(this.id, data.playerState);
        });

        // Join
        this.on<{ status: ResponseStatus; players: Record<string, PlayerState>; id: string; message?: Message }>(events.room_join_response, data => {
            if (data.status === 'fail') throw new Error('Couldn\'t join the room. Error: ' + data.message);

            this.roomClients.clear();
            
            for (const [clientId, playerState] of Object.entries(data.players))
                this.roomClients.set(clientId, playerState);

            this.roomId = data.id;
        });

        // Other player joins
        this.on<{ id: string; playerState: PlayerState }>(events.room_join_notification, data => {
            this.roomClients.set(data.id, data.playerState);
        });

        // Other player disconnects
        this.on<{ id: string }>(events.room_disconnect_notification, data => {
            this.roomClients.delete(data.id);
        });

        // Other player updates their state
        this.on<{ id: string; playerState: PlayerState }>(events.room_state_update_notification, data => {
            this.roomClients.set(data.id, data.playerState);
        });
    }
}