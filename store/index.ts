import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { TMessage, TRoom, TUser } from '~/types'

interface RootState {
    rooms: Record<string, TRoom>,
    currentUser: TUser | null,
    isInitialized: boolean
}

export const state = (): RootState => ({
    rooms: {},
    currentUser: null,
    isInitialized: false
})

export const mutations: MutationTree<RootState> = {
    SET_CURRENT_USER(state, user) {
        state.currentUser = user;
    },
    ADD_ROOM(state, room) {
        state.rooms[room.id] = {
            id: room.id,
            name: room.name,
            users: room.users,
            messages: room.messages,
        };
        state.rooms = { ...state.rooms };
    },
    REMOVE_ROOM(state, roomId) {
        delete state.rooms[roomId];
        state.rooms = { ...state.rooms };
    },

    ADD_USER_ROOM(state, room: TRoom) {
        state.rooms[room.id] = {
            ...room,
        };
    },
    ADD_MESSAGE_ROOMS(state, { roomId, message }: { roomId: TRoom['id'], message: TMessage }) {
        debugger
        const currentRoom = state.rooms[roomId];
        state.rooms[roomId] = {
            ...currentRoom,
            messages: [...(currentRoom.messages ?? []), message]
        };
        state.rooms = { ...state.rooms };
    },
    ADD_MESSAGE(state, { roomId, message }) {

        debugger
        state.rooms[roomId].messages.push(message);
        state.rooms = { ...state.rooms };
    },
    LEAVE_ROOM(state, { roomId, user }: { roomId: string, user: TUser }) {
        const users = state.rooms[roomId]?.users.filter(u => u.userName !== user.userName);
        if (state.rooms[roomId]) {
            state.rooms[roomId].users = users;
            if (users.length <= 1) {
                // debugger
                delete state.rooms[roomId];
            }

            state.rooms = { ...state.rooms };

        }
    },
}

export const actions: ActionTree<RootState, RootState> = {
    addRoom({ commit }, room: TRoom) {
        commit('ADD_ROOM', room)
    },
    removeRoom({ commit }, roomId: TRoom['id']) {
        commit('REMOVE_ROOM', roomId)
    },
    addMessageRooms({ commit }, data: { roomId: TRoom['id'], message: TMessage }) {
        commit('ADD_MESSAGE_ROOMS', data)
    },
    addUserInRoom({ commit }, room: TRoom) {
        commit("ADD_USER_ROOM", room)
    },
    addMessage({ commit }, data: { message: TMessage, roomId: TRoom['id'] }) {
        commit('ADD_MESSAGE', data)
    },
    leaveRoom({ commit }, data: { user: TUser, roomId: TRoom['id'] }) {
        commit('LEAVE_ROOM', data)
    },

}

export const getters: GetterTree<RootState, RootState> = {
    // Your getters
}
