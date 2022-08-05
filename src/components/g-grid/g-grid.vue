<template>
	<view class="">
		<uni-grid :showBorder="false" :column="4">
			<uni-grid-item v-for="(item, i) in list" :key="i">
				<view class="grid-item-box">
					<text :class="`icon-font grid-resize ${item.icon}`"></text>
					<view class="grid-label">{{ item.label }}</view>

					<!-- <view class="grid-dot">
						disabled
					</view> -->
				</view>
			</uni-grid-item>
		</uni-grid>
	</view>
</template>

<script lang="ts" setup>
import { withDefaults, ref } from 'vue';
interface IGridProps {
	list: IRoute[];
}

const props = withDefaults(defineProps<IGridProps>(), {
	list: () => [
		{
			label: '医院介绍',
			url: '/xxx',
			icon: 'ico_sy_paper5'
		},
		{
			label: '医院介绍',
			url: '/xxx',
			icon: 'ico_sy_paper5'
		},
		{
			label: '医院介绍',
			url: '/xxx',
			icon: 'ico_sy_paper5'
		},
		{
			label: '医院介绍',
			url: '/xxx',
			icon: 'ico_sy_paper5'
		},
		{
			label: '医院介绍',
			url: '/xxx',
			icon: 'ico_sy_paper5'
		},
		{
			label: '医院介绍',
			url: '/xxx',
			icon: 'ico_sy_paper5'
		},
		{
			label: '医院介绍',
			url: '/xxx',
			icon: 'ico_sy_paper5'
		}
	]
});
</script>

<style lang="scss" scoped>
.grid-resize {
	width: 54upx;
	height: 54upx;
}

.grid-item-box {
	flex: 1;
	// position: relative;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 15px 0;

	.grid-label {
		margin-top: 12upx;
		font-size: var(--h-size-26);
	}
}

.grid-dot {
	position: absolute;
	top: 5px;
	right: 15px;
}
</style>
