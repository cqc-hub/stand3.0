<template>
	<view :class="props.type == 2 ? 'normal' : 'diff'">
		<uni-grid :showBorder="false" :column="4">
			<uni-grid-item v-for="(item, i) in list" :key="i">
				<view class="grid-item-box">
					<text :class="`icon-font grid-resize ${item.icon}`" />
					<view class="grid-label">{{ item.label }}</view>
				</view>

				<!-- <view class="grid-dot">
						disabled
					</view> -->
			</uni-grid-item>
		</uni-grid>
	</view>
</template>

<script lang="ts" setup>
import { withDefaults, ref } from 'vue';
interface IGridProps {
	list: IRoute[];
	type: 1 | 2; //首页图标样式1 默认2
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
	],
	type: 2
});
</script>

<style lang="scss" scoped>
// 样式一
.diff {
	.grid-item-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		// padding: 15px 0;

		.grid-resize {
			width: 88upx;
			height: 88upx;
		}

		.grid-label {
			margin-top: 8upx;
			font-size: var(--h-size-30);
			color: var(--hr-neutral-color-10);
			font-weight: var(--h-weight-2);
		}
	}
}
// 样式二
.normal {
	.grid-item-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;

		.grid-resize {
			width: 54upx;
			height: 54upx;
		}

		.grid-label {
			margin-top: 12upx;
			font-size: var(--hr-font-size-xxs);
		}
		.grid-dot {
			position: absolute;
			top: 5px;
			right: 15px;
		}
	}
}
</style>
