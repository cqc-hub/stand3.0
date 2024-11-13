<template>
  <view class="content-area" >
    <p v-for="item in 200" :key="item">{{ item }}</p>
  </view>
</template>
<script setup lang="ts">
import { ref, computed, getCurrentInstance,onMounted} from 'vue';
const viewHeight=ref(0)
onMounted(()=>{

})
const getViewHeight=()=>{

}
</script>
<style lang="scss" scoped>
  .content-area {
    z-index: 0;
    padding-top: 40rpx;

  }
</style>
