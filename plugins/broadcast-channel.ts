import { Plugin } from '@nuxt/types'
import { CHANNEL_NAME_ROOMS, TypeChannelRooms } from '~/constants'
import { TMessageBroadCastRooms } from '~/types'

const broadcastChannelPlugin: Plugin = ({ app }) => {
    if (process.client) {
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel(CHANNEL_NAME_ROOMS)
            channel.addEventListener('message', (event) => {
                const data: TMessageBroadCastRooms<any> = event.data;
                // console.log("aaaaaaaaaaaaa");

                // console.log(data);

                switch (data.type) {
                    case TypeChannelRooms.REMOVE:
                        console.log("remove room :", data.data);
                        app.store?.dispatch('removeRoom', data.data)
                        break;
                    case TypeChannelRooms.ADD:
                        app.store?.dispatch('addRoom', data.data)
                        break;
                    case TypeChannelRooms.ADD_MESSAGE:
                        debugger
                        app.store?.dispatch('addMessageRooms', data.data)
                        break;
                    case TypeChannelRooms.USER_LEAVE:
                        app.store?.dispatch('leaveRoom', data.data)
                        break;
                    default:
                        break;
                }
            })
        } else {
            console.warn('BroadcastChannel is not supported in this environment.')
        }
    }

}

export default broadcastChannelPlugin
