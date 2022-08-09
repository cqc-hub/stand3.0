<template>
	<view>
		<view class="banner-grid">
			<!-- 只有一个banner时 -->
			<view class="uni-margin-wrap">
				<swiper class="swiper" circular>
					<swiper-item>
						<image mode="scaleToFill" src="/static/logo.png" />
					</swiper-item>
					<swiper-item>
						<view class="swiper-item uni-bg-green">B</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item uni-bg-blue">C</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.banner-grid {
	.uni-margin-wrap {
		width: 100%;
	}
	.swiper {
		height: 160rpx;
		border: 2rpx solid #d9e5ff;
		border-radius: 16rpx;
	}
	swiper-item {
		display: block;
		height: 160rpx;

		image {
			width: 100%;
			height: 160rpx;
			will-change: transform;
		}
	}
	.swiper-list {
		margin-top: 40rpx;
		margin-bottom: 0;
	}
	.uni-common-mt {
		margin-top: 60rpx;
		position: relative;
	}
	.info {
		position: absolute;
		right: 20rpx;
	}
	.uni-padding-wrap {
		width: 550rpx;
		padding: 0 100rpx;
	}
}
</style>
