<template>
	<view class="">
		<view class="search-input">
			<g-input />
		</view>
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
import { useUserStore, useMessageStore, useGlobalStore } from '@/stores';
import { onLoad } from '@dcloudio/uni-app';

const props = defineProps({
	name: String,
	p: String
});

const userState = useUserStore();
const messageStore = useMessageStore();
const globalStore = useGlobalStore();

const ageIncre = () => {
	userState.updateAge(++userState.age);
	const d = new Date().getTime() + '';
	messageStore.showMessage(d, 2000);
	globalStore.updateToken({
		accessToken: '111111'
	});
};
// console.log({
//   props,
//   name: props.name
// });
const goTest = function () {
	uni.navigateTo({
		url: '/pages/index/index'
	});
};
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
textarea::-webkit-input-placeholder{
    // color:
    text-shadow: none;
    -webkit-text-fill-color: initial;
}
</style>
