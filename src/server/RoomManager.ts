import type { Socket } from 'socket.io';
import type Server from './server.ts';

export const events = {
    room_creation_request: '@tscratch/room_creation_request',
    room_creation_response: '@tscratch/room_creation_response',
    room_join_request: '@tscratch/room_join_request',
    room_join_response: '@tscratch/room_join_response',
    room_join_notification: '@tscratch/room_join_notification',
    room_disconnect_request: '@tscratch/room_disconnect_request',
    room_disconnect_notification: '@tscratch/room_disconnect_notification',
    room_state_update_request: '@tscratch/room_state_update_request',
    room_state_update_notification: '@tscratch/room_state_update_notification'
} as const;

const messages = {
    fullRoom: '@tscratch/room_full',
    incorrectPassword: '@tscratch/room_invalid_auth',
    notFound: '@tscratch/room_not_found'
} as const;
export type Message = (typeof messages)[keyof typeof messages];

export type ResponseStatus = 'success' | 'fail';

type Room<PlayerState> = {
    password: string | null;
    clients: Map<string, PlayerState>;
};

export default class RoomManager<PlayerState> {

    private server: Server;
    private defaultPlayerState: PlayerState;
    private allowedPlayerState: (keyof PlayerState)[];
    private blacklist: Map<string, string | null> = new Map;
    private onLeaveFunc: ((client: Socket) => void) | null = null;
    private onJoinFunc: ((client: Socket) => void) | null = null;
    private onPlayerStateUpdateFunc: ((client: Socket, playerState: PlayerState) => void) | null = null;
    public rooms: Map<string, Room<PlayerState>> = new Map;

    // Custom functions
    public onJoin(callback: (client: Socket) => void) {
        this.onJoinFunc = callback;
    }

    public onLeave(callback: (client: Socket) => void) {
        this.onLeaveFunc = callback;
    }

    public onPlayerStateUpdate(callback: (client: Socket, playerState: PlayerState) => void) {
        this.onPlayerStateUpdateFunc = callback;
    }

    // Get all the clients inside the room except one
    private getRoomClientsExcluding(room: Room<PlayerState>, excludeClientId?: string): Socket[] {
        const clients: Socket[] = [];

        for (const id of room.clients.keys()) {
            if (id === excludeClientId) continue;
            const client = Array.from(this.server.clients).find(c => c.id === id);
            if (client) clients.push(client);
        }

        return clients;
    }

    // Sanitize a partial update: only return the allowed keys present in the input
    private getSanitizedPartial(partialState: Partial<PlayerState> | undefined)  {
        const sanitizedPartial: Partial<PlayerState> = {};

        if (partialState && typeof partialState === 'object')
            for (const key of this.allowedPlayerState)
                if (key in partialState)
                    sanitizedPartial[key] = partialState[key];

        return sanitizedPartial;
    }

    // Sanitize custom state against allowed keys
    private getSanitizedPlayerState(customPlayerState: PlayerState) {

        const sanitizedPartialState = this.getSanitizedPartial(customPlayerState);

        // Merge order: defaults -> sanitized allowed custom values
        return {
            ...this.defaultPlayerState,
            ...sanitizedPartialState
        };
    }

    // Handles a disconnect
    private disconnectRequest(client: Socket) {

        // Find the room entry (room id + room) that contains this client
        const entry = Array.from(this.rooms.entries()).find(([id, room]) => room.clients.has(client.id));
        if (!entry) return;

        const [roomId, room] = entry;

        // Remove the client from the room
        room.clients.delete(client.id);

        // If the room is empty, remove it entirely
        if (room.clients.size === 0) {
            this.rooms.delete(roomId);
            return;
        }

        // Notify remaining clients in the room that this client disconnected
        const otherRoomClients = this.getRoomClientsExcluding(room, client.id);

        this.server.broadcast<{ id: string }>(events.room_disconnect_notification, { id: client.id }, otherRoomClients);

        // Run the custom onLeave function
        if (this.onLeaveFunc) this.onLeaveFunc(client);
    }

    // Kick
    public kick(clientId: string) {

        const room = Array
            .from(this.rooms.values())
            .find(room => room.clients.has(clientId));

        if (!room) return;

        room.clients.delete(clientId);
    }

    // Ban
    public ban(clientId: string, { roomId }: { roomId: string }) {
        this.kick(clientId);
        this.blacklist.set(clientId, roomId ?? null);
    }

    // Handle client room requests
    constructor(options: { server: Server; defaultPlayerState: PlayerState; allowedPlayerState: (keyof PlayerState)[]; }) {
        this.server = options.server;
        this.defaultPlayerState = options.defaultPlayerState;
        this.allowedPlayerState = options.allowedPlayerState;

        // Handle creation requests
        this.server.on<{ password: string | null; customPlayerState: PlayerState; }>(events.room_creation_request, (data, client) => {

            let id: string;

            do {
                id = Math.random().toString(36).substring(2, 10).padEnd(8, '0');
            } while (this.rooms.has(id))

            // Sanitize player state
            const sanitizedPlayerState = this.getSanitizedPlayerState(data.customPlayerState);

            // Create the room
            const newRoom: Room<PlayerState> = {
                password: data.password,
                clients: new Map([[ client.id, sanitizedPlayerState ]])
            };

            this.rooms.set(id, newRoom);

            // Send room ID, confirmation, and player state
            this.server.broadcast<{ id: string; status: ResponseStatus; playerState: PlayerState }>(
                events.room_creation_response,
                {
                    id,
                    status: 'success',
                    playerState: sanitizedPlayerState
                },
                [client]
            );

            // Run the custom onJoin function
            if (this.onJoinFunc) this.onJoinFunc(client);
        });

        // Handle join requests
        this.server.on<{ password: string | null; id: string; customPlayerState: PlayerState }>(events.room_join_request, (data, client) => {

            // Check blacklist
            const bannedPlayerRoom = this.blacklist.get(client.id);
            if (bannedPlayerRoom !== undefined) {
                if (!bannedPlayerRoom) return; // Banned everywhere
                if (bannedPlayerRoom === data.id) return;
            }

            // Find the room
            const room = this.rooms.get(data.id);
            if (!room) {
                this.server.broadcast<{ status: ResponseStatus; message: Message }>(events.room_join_response, {
                    status: 'fail',
                    message: messages.notFound
                }, [client]);
                return;
            }

            // Check the password
            if (room.password !== data.password) {
                this.server.broadcast<{ status: ResponseStatus; message: Message }>(events.room_join_response, {
                    status: 'fail',
                    message: messages.incorrectPassword
                }, [client]);
                return;
            }

            const sanitizedPlayerState = this.getSanitizedPlayerState(data.customPlayerState);

            room.clients.set(client.id, {
                ...sanitizedPlayerState
            });

            // Send confirmation
            this.server.broadcast<{ status: ResponseStatus; players: Record<string, PlayerState>; id: string }>(
                events.room_join_response,
                {
                    status: 'success',
                    players: Object.fromEntries(room.clients),
                    id: data.id
                },
                [client]
            );

            // Notify everyone else that the user joined
            const otherRoomClients = this.getRoomClientsExcluding(room, client.id);

            this.server.broadcast<{ id: string; playerState: PlayerState }>(events.room_join_notification, {
                playerState: sanitizedPlayerState,
                id: client.id
            }, otherRoomClients);

            // Run the custom onJoin function
            if (this.onJoinFunc) this.onJoinFunc(client);
        });

        // Handle disconnects
        this.server.onLeave(client => {
            this.disconnectRequest(client);
        });

        this.server.on(events.room_disconnect_request, (_, client) => {
            this.disconnectRequest(client);
        });

        // Handle player state updates
        this.server.on<{ newPlayerState: PlayerState }>(events.room_state_update_request, (data, client) => {

            // Sanitize input player state
            const sanitizedPartial = this.getSanitizedPartial(data.newPlayerState as Partial<PlayerState> | undefined);

            // Find the room the client is in
            const entry = Array.from(this.rooms.entries()).find(([id, room]) => room.clients.has(client.id));
            if (!entry) return;

            const [roomId, room] = entry;

            // Merge with existing state and persist
            const prev = room.clients.get(client.id) as PlayerState | undefined;
            const updatedState: PlayerState = { ...(prev ?? this.defaultPlayerState), ...sanitizedPartial };
            room.clients.set(client.id, updatedState);

            // Notify other clients in the room about the state update
            const otherRoomClients = this.getRoomClientsExcluding(room, client.id);

            this.server.broadcast<{ id: string; playerState: PlayerState }>(events.room_state_update_notification, {
                playerState: updatedState,
                id: client.id
            }, otherRoomClients);

            // Run the custom onPlayerStateUpdate function
            if (this.onPlayerStateUpdateFunc) this.onPlayerStateUpdateFunc(client, updatedState);
        });
    }
}