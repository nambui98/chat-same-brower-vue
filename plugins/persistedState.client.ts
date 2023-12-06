import createPersistedState from 'vuex-persistedstate'

export default ({ store }: any) => {
    createPersistedState({
        key: 'chat',
        storage: window.localStorage,
        paths: ['rooms'], // Adjust paths based on your state structure
    })(store);

    createPersistedState({
        key: 'chat',
        storage: window.sessionStorage,
        paths: ['currentUser'], // Adjust paths based on your state structure
    })(store);
}