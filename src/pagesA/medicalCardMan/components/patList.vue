<template>
	<view class="list-container">
		<view v-for="pat in list" :key="pat.patientId">
			<list-Item
				:pat="pat"
				@card-click="cardClick"
				@profile-click="profileClick"
			/>
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

	emits: ['profile-click', 'card-click'],

	props: {
		list: {
			type: Array as PropType<IPat[]>,
			default: (): IPat[] => []
		}
	},

	setup(props, ctx) {
		const { emit } = ctx;

		const profileClick = (pat: IPat) => {
			emit('profile-click', pat);
		};

		const cardClick = (pat: IPat) => {
			emit('card-click', pat);
		};

		return {
			profileClick,
			cardClick
		};
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
