<template>
	<view class="">
		<view v-for="pat in list" :key="pat.patientId" class="list-container">
			<list-Item :pat="pat" />
		</view>
	</view>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { IPat } from '@/stores/type';

import listItem from './patListItem.vue';

export default defineComponent({
	components: {
		listItem
	},

	options: {
		// 微信样式穿透需要配置
		styleIsolation: 'shared'
	},

	props: {
		list: {
			type: Array as PropType<IPat[]>,
			default: (): IPat[] => []
		}
	},

	setup() {
		return {};
	}
});
</script>

<style lang="scss" scoped>
.list-container {
	margin: 0 32rpx;

	:deep(.container) {
		margin-bottom: 16rpx;
	}
}
</style>
