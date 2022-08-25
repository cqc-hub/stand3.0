<template>
	<view class="">
		<web-view :src="src" />
	</view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { getToken, getSysCode } from '@/common/useToken';

const src =
	'http://10.10.83.71:3000/#/pagesA/healthAdvisory/healthAdvisory?sysCode=' +
	getSysCode();
</script>

<style lang="scss" scoped>
.search-input {
	// padding: 0 40upx !important;
	margin: 40upx;
	// width: 80% !important;
}

input,
textarea {
	font-size: 24px;
	padding: 10px;

	color: red;
	text-shadow: 0px 0px 0px #000;
	-webkit-text-fill-color: transparent;
}
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
	// color:
	text-shadow: none;
	-webkit-text-fill-color: initial;
}
</style>
