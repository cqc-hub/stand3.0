<template>
  <view class="">
    {{ userState.name }}
    {{ userState.age }}
    {{ userState.double }}

    {{ $global.SYS_CODE }}

    <button _type="primary" @click="ageIncre">age increment</button>
    <button _type="primary" @click="goTest">router jump</button>

    <g-message />
  </view>
</template>

<script setup lang="ts">
import { useUserStore, useMessageStore } from '@/stores';
import { onLoad } from '@dcloudio/uni-app';

const props = defineProps({
  name: String,
  p: String
});

const userState = useUserStore();
const messageStore = useMessageStore();

const ageIncre = () => {
  userState.updateAge(++userState.age);
  const d = new Date().getTime() + '';
  messageStore.showMessage(d, 2000);
};
// console.log({
//   props,
//   name: props.name
// });
const goTest = function () {
  uni.navigateTo({
    'url': '/pages/index/index'
  })
};

onLoad((opt) => {
  messageStore.showMessage('dskad的苦瓜撒接口都会感慨');
  setTimeout(() => {
    messageStore.showMessage('都会感慨', 2000);
	
  }, 2000);
});
</script>

<style lang="scss" scoped>
</style>
