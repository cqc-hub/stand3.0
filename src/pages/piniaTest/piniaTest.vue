<template>
  <view class="">
    {{ userState.name }}
    {{ userState.age }}
    {{ userState.double }}
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores';


const userState = useUserStore();

setInterval(() => {
  userState.updateAge(++userState.age)
}, 5000)


</script>

<style lang="scss" scoped>
</style>
