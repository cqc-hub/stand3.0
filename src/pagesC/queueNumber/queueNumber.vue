<template>
	<view class="">
		<g-tabs
			v-model:value="tabCurrent"
			:tabs="tabs"
			:scroll="false"
			:line-scale="0.18"
			field="name"
			all-blod
			@change="tabChange"
		/>

		{{ tabCurrent }}
	</view>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';

const tabs = [
	{
		name: '症状',
		myKey: '0' // [0部位,1科室,2人群]
	},
	{
		name: '疾病',
		myKey: '0'
	}
];

const tabCurrent = ref(0);
const tabChange = function (i) {
	console.log(i);
};
</script>

<style lang="scss" scoped></style>
