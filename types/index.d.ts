import { TypeChannelRoom, TypeChannelRooms } from "~/constants"

export type TUser = {
    userName: string
}

export type TMessage = {
    message: string
} & TUser

export type TRoom = {
    id: string
    name: string
    users: Array<TUser>
    messages: TMessage[]
}

export type TFormJoinChat = TUser & {
    roomName: string
}

export type TMessageBroadCast<T> = {
    type: TypeChannelRoom,
    data: T
}

export type TMessageBroadCastRooms<T> = {
    type: TypeChannelRooms,
    data: T
}
// export type TMessageBroadCastRoom<T> = {
//     type: TypeChannelRoom,
//     data: T
// }