<template>
	<view class="choose-pat">
		<view
			v-for="(item, i) in list"
			@tap.stop="itemClick(item, i)"
			:key="item.id"
			class="item"
		>
			<view class="container">
				<view class="label text-ellipsis">{{ item.label }}</view>
				<view class="id text-ellipsis">{{ item.id }}</view>
				<!-- <view class="iconfont icon-size suffix-icon">&#xe6a6;</view> -->
			</view>

			<view class="suffix-icon g-flex-rc-cc">
				<view v-show="i === 1" class="icon-choose" />
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		list: { label: string; id: string; [key: string]: any }[];
	}>(),
	{
		list: () => []
	}
);

const emits = defineEmits(['pat-click']);

const itemClick = function (item, index) {
	emits('pat-click', { index, item });
};
</script>

<style lang="scss" scoped>
.choose-pat {
	background-color: rgba(255, 0, 0, 0);
}
.item {
	background-color: var(--h-color-white);
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1rpx solid var(--hr-neutral-color-2);

	&:first-child {
		border-radius: 20rpx 20rpx 0px 0px;
	}

	&:last-child {
		padding-bottom: 50rpx;

		&::after {
			content: '';
			display: block;
			position: absolute;
			right: 0;
			left: 0;
			bottom: 50rpx;
			height: 1rpx;
			background-color: var(--hr-neutral-color-2);
		}
	}

	.container {
		display: flex;
		padding: 20rpx 32rpx;
		flex: 1;
    align-items: center;
	}
	.icon-size {
		font-size: 42rpx;
	}

	.label {
		width: 30%;
		font-weight: 600;
		font-size: var(--hr-font-size-xl);
    color: var(--hr-neutral-color-10);
	}

	.id {
		width: 30%;
		flex: 1;
		font-size: var(--hr-font-size-xs);
    color: var(--hr-neutral-color-10);
	}

	.suffix-icon {
		width: 10%;
		margin-right: 20rpx;
	}
}
</style>
