<template>
    <div class="container">
        <Header />
        <el-header>
            <div class="header-content">
                <h1>{{ roomName }}</h1>
                <el-button type="danger" @click="leaveRoom">Leave</el-button>
            </div>
        </el-header>

        <el-main>
            <div class="chat-box">
                <!-- Display messages here -->
                <div class="item-chat message" v-for="(message, index) in messages" :key="index">
                    <span style="color: #606266;">
                        {{ message.userName }}:
                    </span>
                    <span>

                        {{ message.message }}
                    </span>
                </div>
            </div>
        </el-main>

        <el-footer>
            <el-form ref="formMessage" @submit.native.prevent="sendMessage" :model="formMessage" status-icon :rules="rules"
                class="input-box">

                <el-form-item prop="newMessage" style="width: 100%;">
                    <el-input :autofocus="true" placeholder="Message" v-model="formMessage.newMessage"
                        type="text"></el-input>
                </el-form-item>
                <el-form-item>

                    <el-button type="primary" native-type="submit">Send</el-button>
                </el-form-item>
            </el-form>
        </el-footer>

        <p>{{ usersInRoom?.length }}</p>
        <Footer />
    </div>
</template> 
<script lang="ts">
import { defineComponent } from 'vue';
import { CHANNEL_NAME_ROOM, CHANNEL_NAME_ROOMS, TypeChannelRoom, TypeChannelRooms } from '~/constants';
import { TMessageBroadCast, TMessageBroadCastRooms, TMessage, TRoom, TUser } from '~/types';



export default defineComponent({
    asyncData({ params }) {
        const id = params.id;
        return { id }
    },
    data(): any {
        return {
            formMessage: {
                newMessage: "",
            },
            rules: {
                newMessage: [{ required: true, message: 'Please input Activity name', trigger: 'blur' }]
            },
        }
    },
    computed: {
        roomName(): string | undefined {
            return this.id;
        },
        currentUsername(): any {
            return this.$route.query.username;
        },
        // roomId(): string | undefined {
        //     return this.roomName?.replaceAll(" ", "_")
        // },
        roomId(): string | undefined {
            return this.roomName?.replaceAll(" ", "_");
        },
        currentRoom(): TRoom {
            return this.$store.state.rooms[this.roomId ?? ''];
        },
        usersInRoom(): TUser[] | undefined {
            return this.currentRoom?.users;
        },
        checkUserExists(): boolean | undefined {
            return this.usersInRoom?.some((user: TUser) => user.userName === this.currentUsername);
        },
        messages(): TMessage[] {
            return this.currentRoom?.messages ?? [];
        },
        broadcastChannelRoom(): BroadcastChannel {
            return new BroadcastChannel(`${CHANNEL_NAME_ROOM}${this.roomId}`);
        },
        broadcastChannelRooms(): BroadcastChannel {
            return new BroadcastChannel(CHANNEL_NAME_ROOMS);
        },

    },
    watch: {
        checkUserExists(newVal: boolean, oldVal: boolean) {
            if (!newVal && oldVal) {
                this.$router.push('/'); // Chuyển hướng đến '/page1'
            }
        }
    },
    mounted() {
        const isUserJoined = this.usersInRoom?.some((user: TUser) => user.userName === this.currentUsername && this.currentUsername);
        if (!this.currentUsername || !!isUserJoined === false) {
            this.$router.push('/');
        }
    },
    created() {
        if (process.client) {
            if (typeof BroadcastChannel !== 'undefined') {
                this.broadcastChannelRoom.addEventListener('message', this.handleRoomEvent);
            }
        }
    },
    beforeDestroy() {
        this.broadcastChannelRoom.removeEventListener('message', this.handleRoomEvent);
        if (this.checkUserExists) {
            this.leaveRoom();
        }
    },
    methods: {
        openMessageNotice(userName: string) {
            this.$message({
                showClose: true,
                message: `${userName} has joined the chat room`,
                type: 'success'
            });
        },
        handleRoomEvent(event: MessageEvent) {
            const message: TMessageBroadCast<any> = event.data;
            switch (message.type) {
                case TypeChannelRoom.JOIN:
                    if (message.data.userName !== this.currentUsername) {
                        this.openMessageNotice(message.data.userName);
                    }
                    break;
                case TypeChannelRoom.MESSAGE:
                    this.$store.dispatch("addMessage", message.data)
                    break;
                case TypeChannelRoom.LEAVE:
                    if (message.data.user.userName !== this.currentUsername) {
                        this.$message({
                            showClose: true,
                            message: `${message.data.user.userName} has left the chat room`,
                            type: 'warning'
                        });
                        this.$store.dispatch("leaveRoom", message.data)
                    }
                    break;
                case TypeChannelRoom.REMOVE:
                    this.$router.push("/")
                    break;
                default:
                    break;
            }
        },
        leaveRoom() {
            const dataChannelRoom: TMessageBroadCast<{ user: TUser, roomId: TRoom['id'] }> = {
                type: TypeChannelRoom.LEAVE,
                data: { user: { userName: this.currentUsername }, roomId: this.roomId ?? '' }
            }
            const dataChannelRooms: TMessageBroadCastRooms<TRoom['id']> = {
                type: TypeChannelRooms.REMOVE,
                data: this.roomId ?? ''
            }
            this.$store.dispatch("leaveRoom", dataChannelRoom.data).then(() => {
                this.broadcastChannelRoom?.postMessage(dataChannelRoom)
                console.log(this.usersInRoom);

                debugger
                if (!this.usersInRoom || (this.usersInRoom && this.usersInRoom?.length <= 1)) {
                    debugger
                    this.broadcastChannelRooms.postMessage(dataChannelRooms)
                }
            })

        },

        sendMessage() {
            const trimMessage = this.formMessage.newMessage.trim();

            if (trimMessage !== "") {
                const dataPost: { message: TMessage, roomId: string } = {
                    message: {
                        message: trimMessage,
                        userName: this.currentUsername,
                    },
                    roomId: this.roomId ?? ''
                }
                const dataChannelRooms: TMessageBroadCastRooms<{ message: TMessage, roomId: TRoom['id'] }> = {
                    type: TypeChannelRooms.ADD_MESSAGE,
                    data: dataPost
                }
                this.broadcastChannelRooms.postMessage(dataChannelRooms)
                this.formMessage.newMessage = "";
            }
        },
    },
});
</script>
<style scoped>
.container {
    max-width: 900px;
    margin: 0 auto;
    margin-bottom: 24px;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-box {
    border: 1px solid #ccc;
    padding: 10px;
    min-height: 200px;
    max-height: 400px;
    overflow-y: auto;
}

.item-chat {
    border-bottom: 1px solid #ccc;
}

.message {
    margin-bottom: 8px;
}

.input-box {
    display: flex;
    gap: 10px;
    align-items: center;
}

.el-header {
    margin-top: 24px;
    padding: 0px 16px;
    height: auto !important;
}

.el-footer {
    padding: 8px 16px;
    height: auto !important;
}
</style>