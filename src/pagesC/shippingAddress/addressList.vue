<template>
	<view class="page">
		<view class="address-top flex-between">
			<view class="item g-flex-rc-cc" @tap="gotoPatient">
				<text class="icon-font ico_people" />
				<text>获取就诊人地址</text>
			</view>
			<view class="item g-flex-rc-cc">
				<text class="icon-font ico_wechat" />
				<text>获取就诊人地址</text>
			</view>
		</view>
		<view class="address-box">
			<view class="box-item">
				<view class="item-title flex-between">
					<view class="item-title-left">
						<text>陆强强</text>
						<text>16544346789</text>
						<g-tag type="yellow" text="默认" />
					</view>
					<view class="item-title-right flex-normal">
						<view class="iconfont">&#xe6b9;</view>
						编辑
					</view>
				</view>
				<text class="box-content">
					浙江省杭州市滨江区新联路625号和仁科技大厦17楼
				</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
const gotoPatient = () => {
	uni.navigateTo({
		url: '/pagesC/shippingAddress/patientAddress'
	});
};
</script>

<style scoped lang="scss">
.page {
	background-color: #f6f6f6;
	padding: 24rpx 32rpx;
	.address-top {
		margin-bottom: 24rpx;
		width: 100%;
		view.item {
			width: 50%;
			height: 128rpx;
			background: var(--h-color-white);
			border: 2rpx solid #cccccc;
			border-radius: 16rpx;
			margin-right: 14rpx;
			.icon-font {
				margin-right: 14rpx;
				width: 48rpx;
				height: 48rpx;
			}
			text {
				color: var(--hr-neutral-color-10);
				font-size: var(--hr-font-size-base);
			}
		}
	}
	.address-box {
		.box-item {
			background: var(--h-color-white);
			margin-bottom: 16rpx;
			border: 2rpx solid var(--hr-neutral-color-4);
			border-radius: 16rpx;
			padding: 32rpx;
			.item-title {
				margin-bottom: 32rpx;
				.item-title-left {
					text {
						font-size: var(--hr-font-size-xs);
						color: var(--hr-neutral-color-9);
						margin-right: 16rpx;
						line-height: 44rpx;
					}
				}
				.item-title-right {
					color: var(--hr-brand-color-6);
					.iconfont {
						width: 40rpx;
						height: 40rpx;
						color: var(--hr-brand-color-6);
					}
				}
			}
			.box-content {
				font-size: var(--hr-font-size-xl);
				font-weight: var(--h-weight-2);
				text-align: left;
				color: var(--hr-neutral-color-10);
			}
		}
	}
}
</style>
