<template>
	<view>
		<web-view :src="src" @message="handleMessage"></web-view>
	</view>
</template>
<script setup lang="ts">
//第三方h5页面入口——网络医院
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
const src = ref();
const handleMessage = (evt) => {
	// #ifdef MP-WEIXIN
	console.warn('返回数据', evt);
	var data = evt.target.data;
	var V3PageData = data[0];
	uni.openLocation({
		latitude: Number(V3PageData.gisLat),
		longitude: Number(V3PageData.gisLng),
		name: V3PageData.hosName,
		address: V3PageData.address
	});
	// #endif
};
</script>

<style scoped></style>
