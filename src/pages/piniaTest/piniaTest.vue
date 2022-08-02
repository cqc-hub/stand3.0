<template>
  <view class="">
    {{ userState.name }}
    {{ userState.age }}
    {{ userState.double }}

    <button @click="ageIncre">age increment</button>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores';
import { onLoad } from '@dcloudio/uni-app'


const userState = useUserStore();

const ageIncre = () => {
  userState.updateAge(++userState.age)
}

onLoad(opt => {
  console.log({
    opt
  });

})


</script>

<style lang="scss" scoped>
</style>
