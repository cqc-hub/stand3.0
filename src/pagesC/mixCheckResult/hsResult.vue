<template>
	<view class="page">
		<scroll-view class="scroll-page" scroll-y>
			<g-choose-pat />
			<view class="box">
				<view class="item-box">
					<view class="item-box-top flex-between">
						<text>检测结果</text>
						<text class="label warn">阴性</text>
					</view>
					<view class="item-box-content">
						<view>
							<text class="title">报告时间：</text>
							<text>检测结果</text>
							<text>阴性</text>
						</view>
						<view>
							<text class="title">报告时间：</text>
							<text>检测结果</text>
							<text>阴性</text>
						</view>
						<view>
							<text class="title">报告时间：</text>
							<text>检测结果</text>
							<text>阳性</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.box {
	padding: 24rpx 32rpx;
	.item-box {
		margin-bottom: 18rpx;
		padding: 32rpx 32rpx 16rpx 32rpx;
		background: #ffffff;
		border-radius: 16rpx;
		.item-box-top {
			border-bottom: 2rpx solid var(--h-color-border);
			padding-bottom: 15rpx;
			margin-bottom: 18rpx;
			text {
				color: var(--hr-neutral-color-10);
				font-size: var(--hr-font-size-base);
			}
			.label {
				width: 144rpx;
				height: 56rpx;
				background: var(--hr-success-color-6);
				border-radius: 8px;
				display: inline-block;
				line-height: 56rpx;
				color: var(--h-color-white);
				text-align: center;
			}
			.warn {
				background: var(--hr-error-color-6);
			}
		}
		.item-box-content {
			view {
				margin-bottom: 16rpx;
			}
			.title {
				font-size: var(--hr-font-size-xs);
				color: var(--hr-neutral-color-7);
				line-height: 40rpx;
			}
			text {
				color: var(--hr-neutral-color-10);
				font-size: var(--hr-font-size-xs);
				margin-right: 20rpx;
			}
		}
	}
}
</style>
