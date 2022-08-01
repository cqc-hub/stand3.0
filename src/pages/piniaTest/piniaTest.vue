<template>
  <view class="">
    {{ userState.name }}
    {{ userState.age }}
  </view>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import useUserStore from '@/stores/user';


const userState = useUserStore();
console.log({
  userState
});

setInterval(() => {
  userState.updateAge(++userState.age)
}, 1000)


</script>

<style lang="scss" scoped>
</style>
