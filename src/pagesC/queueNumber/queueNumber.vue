<template>
	<view class="page">
		<g-choose-pat />

		<g-tabs
			v-model:value="tabCurrent"
			:tabs="tabs"
			:scroll="false"
			:line-scale="0.18"
			field="name"
			all-blod
			@change="tabChange"
		/>

		<swiper :current="tabCurrent" @change="swiperChange" class="container">
			<swiper-item>
				<scroll-view scroll-y class="scroll-container">
					<view>cscsadsad</view>
				</scroll-view>
			</swiper-item>

			<swiper-item>
				<view class="scroll-container">
					<g-empty :current="1" />
				</view>
			</swiper-item>

			<swiper-item>
				<view class="uni-bg-red">c</view>
			</swiper-item>

			<swiper-item>
				<view class="uni-bg-red">d</view>
			</swiper-item>
		</swiper>

		<g-message />
	</view>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';

const tabs = [
	{
		name: '全部'
	},
	{
		name: '门诊'
	},
	{
		name: '检查'
	},
	{
		name: '药房'
	}
];

const tabCurrent = ref(1);
const tabChange = function (i) {
	console.log(i);
};
const swiperChange = ({ detail: { current } }) => {
	tabCurrent.value = current;
};
</script>

<style lang="scss" scoped>
.page {
	width: 100%;
	height: 100vh;
	background-color: var(--hr-neutral-color-1);

	display: flex;
	flex-direction: column;

	.container {
		flex: 1;
		height: 1px;

		.scroll-container {
			height: 100%;
		}
	}
}
</style>
