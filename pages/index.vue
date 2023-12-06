<template>
  <div class="container">
    <Header />
    <h1 style="text-align: center;">Rooms</h1>
    <ListRoom />
    <FormJoinChat />
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'IndexPage',
})
</script>

<style>
.container {
  max-width: 900px;
  margin: 0 auto;
  margin-bottom: 24px;
}

.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}
</style>
