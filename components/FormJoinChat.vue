<template>
    <el-form ref="formJoin" :rules="rules" :model="formJoin" status-icon label-width="120px" class="form"
        @submit.native.prevent="submitForm">
        <el-form-item label="Username" prop="userName">
            <el-input v-model="formJoin.userName" type="text"></el-input>
        </el-form-item>
        <el-form-item label="Room name" prop="roomName">
            <el-input v-model="formJoin.roomName" type="text"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button style="" type="danger" native-type="submit">Join</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { CHANNEL_NAME_ROOM, CHANNEL_NAME_ROOMS, TypeChannelRoom, TypeChannelRooms } from '~/constants';
import { TMessageBroadCast, TRoom } from '~/types';

export default defineComponent({
    data() {
        const validateUsername = (_rule: any, value: string, callback: Function) => {
            const usernameRegex = /^[a-zA-Z0-9]*$/;
            const isValidUsername = usernameRegex.test(value);
            if (value === '') {
                callback(new Error('Please input the username'));
            } else if (!isValidUsername) {
                callback(new Error('Username is not valid'));
            } else {
                callback();
            }
        };

        return {
            formJoin: {
                userName: '',
                roomName: '',
            },
            rules: {
                userName: [{ validator: validateUsername, required: true, message: 'Please input the username', trigger: 'blur' }],
                roomName: [
                    { required: true, message: 'Please input the room name', trigger: 'blur' }
                ],
            },
        };
    },
    methods: {
        async submitForm() {
            try {
                await (this.$refs?.formJoin as any).validate();
                const { roomName, userName } = this.formJoin;
                const idRoom = this.formJoin.roomName.replaceAll(" ", "_");
                const roomExists: TRoom | undefined = this.$store.state.rooms[idRoom];
                let newRoom: TRoom
                if (roomExists) {
                    newRoom = { ...roomExists, id: idRoom, name: this.formJoin.roomName, users: [...(roomExists?.users ?? []), { userName }] }
                    const userExists = roomExists.users.some(user => user.userName === userName);
                    if (userExists) {
                        this.$message({
                            showClose: true,
                            message: `${userName} already exists`,
                            type: 'error'
                        });
                        return;
                    }
                } else {
                    newRoom = { id: idRoom, name: this.formJoin.roomName, users: [{ userName }], messages: [] }
                }
                this.$store.dispatch('addUserInRoom', newRoom).then(() => {
                    const channelRooms = new BroadcastChannel(CHANNEL_NAME_ROOMS)
                    channelRooms.postMessage({
                        type: TypeChannelRooms.ADD,
                        data: newRoom
                    });
                    const channel = new BroadcastChannel(`${CHANNEL_NAME_ROOM}${idRoom}`);
                    const dataPostMessage: TMessageBroadCast<{ room: TRoom, userName: string }> = {
                        type: TypeChannelRoom.JOIN,
                        data: { room: newRoom, userName }
                    };
                    channel.postMessage(dataPostMessage);
                    this.$router.push("/room/" + roomName + "?username=" + userName);
                    (this.$refs?.formJoin as any).resetFields();
                });
            } catch (error) {
                console.error('Validation error', error);
            }
        },
    },
});
</script>
<style>
.form {
    margin-top: 24px;
}
</style> 