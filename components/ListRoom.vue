<template>
    <div>
        <el-row type="flex" style="flex-wrap: wrap;row-gap: 20px;" :gutter="20">
            <el-col v-for="item in rooms" :key="item.id" :span="6">
                <el-button type="primary" style="width: 100%;">
                    <i class="el-icon-s-home" style="margin-right: auto;"></i>
                    {{ item.name }}
                </el-button>
            </el-col>
        </el-row>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { TRoom } from '~/types';

export default defineComponent({
    computed: {
        rooms(): TRoom[] {
            return this.$store.state.rooms;
        }
    }
})
</script>
<style>
.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
}
