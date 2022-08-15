<template>
	<view>
		<view class="banner-grid">
			<!-- 只有一个banner时 -->
			<view v-if="type == 1" class="uni-margin-wrap">
				<swiper class="swiper" circular indicator-dots="true">
					<swiper-item>
						<image mode="scaleToFill" src="/static/logo.png" />
					</swiper-item>
					<swiper-item>
						<image mode="scaleToFill" src="/static/logo.png" />
					</swiper-item>
				</swiper>
			</view>
			<!-- 常规banner+三个入口 -->
			<view class="banner" v-if="type == 2">
				<view class="parent">
					<view class="view1">
						<swiper class="swiper" circular indicator-dots="true">
							<swiper-item>
								<image
									mode="scaleToFill"
									src="/static/logo.png"
								/>
							</swiper-item>
							<swiper-item>
								<image
									mode="scaleToFill"
									src="/static/logo.png"
								/>
							</swiper-item>
						</swiper>
					</view>
					<view class="view2 banner-back1 flex-between banner-common">
						<text>网络医院</text>
						<view class="iconfont icon-size1">&#xe6a0;</view>
					</view>
					<view class="view3 banner-back2 flex-between banner-common">
						<text>药品百科</text>
						<view class="iconfont icon-size1">&#xe6a0;</view>
					</view>
					<view class="view4 banner-back1 flex-between banner-common">
						<text>物价查询</text>
						<view class="iconfont icon-size1">&#xe6a0;</view>
					</view>
				</view>
			</view>
			<!-- 首页 三个纯入口 支持第一个是否是banner -->
			<view class="banner2" v-if="type == 3">
				<view class="parent">
					<!-- 只有一个入口 -->
					<view class="view1 banner-back1 banner-common">
						<view class="flex-between">
							<text>入口一</text>
						</view>
						<text class="details">副标题副标题</text>
						<view class="iconfont icon-size-back1">&#xe6a5;</view>
					</view>
					<!-- 第一组是多个banner -->
					<!-- <view class="view1">
						<swiper class="swiper" circular indicator-dots="true">
							<swiper-item>
								<image
									mode="scaleToFill"
									src="/static/logo.png"
								/>
							</swiper-item>
							<swiper-item>
								<image
									mode="scaleToFill"
									src="/static/logo.png"
								/>
							</swiper-item>
						</swiper>
					</view> -->
					<view class="view2 banner-back2 banner-common">
						<view class="flex-between">
							<text>入口二</text>
							<view class="iconfont icon-size2">&#xe6a0;</view>
						</view>
						<!-- <text class="details">副标题副标题</text> -->
						<view class="iconfont icon-size-back2">&#xe6a5;</view>
					</view>
					<view class="view3 banner-back1 banner-common">
						<view class="flex-between">
							<text>入口三</text>
							<view class="iconfont icon-size1">&#xe6a0;</view>
						</view>
						<!-- <text class="details">副标题副标题</text> -->
						<view class="iconfont icon-size-back1">&#xe6a5;</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { withDefaults, ref, computed } from 'vue';

// 2/3
// const type = ref(2);

const props = withDefaults(
	defineProps<{
		leftFunctionList: IRoute[];
		functionList: IRoute[];
	}>(),
	{
		//左侧轮播数组
		leftFunctionList: () => [
			{
				title: '住院助手',
				url: '/xxx',
				iconfont: 'ico_sy_calendar1'
			}
		],
		//右侧数组
		functionList: () => [
			{
				title: '住院助手',
				url: '/xxx',
				iconfont: 'ico_sy_calendar1'
			}
		]
	}
);

const type = computed(() => {
	//type 2 常规banner+三个入口   3 首页 三个纯入口
	//左侧有数据
	if (props.leftFunctionList.length > 0 && props.functionList.length == 3) {
		return 3;
	} else {
		return 2;
	}
});
</script>

<style lang="scss" scoped>
.banner-grid {
	.uni-margin-wrap {
		width: 100%;
	}

	swiper-item {
		display: block;
		// height: 160rpx;

		image {
			width: 100%;
			height: 160rpx;
			will-change: transform;
		}
	}
	.banner {
		// .swiper {
		// 	height: 324rpx;
		// 	border: 2rpx solid #d9e5ff;
		// }
		.parent {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			grid-template-rows: repeat(3, 1fr);
			grid-column-gap: 12rpx;
			grid-row-gap: 12rpx;
		}

		.view1 {
			grid-area: 1 / 1 / 4 / 3;
			border-radius: 16rpx;
		}
		.view2 {
			grid-area: 1 / 3 / 2 / 5;
		}
		.view3 {
			grid-area: 2 / 3 / 3 / 5;
		}
		.view4 {
			grid-area: 3 / 3 / 4 / 5;
		}
	}

	// 公用样式

	.swiper {
		height: 100%;
		border-radius: 16rpx;

		image {
			height: 100%;
			will-change: transform;
		}
	}
	.banner-common {
		border-radius: 16rpx;
		font-size: var(--hr-font-size-s);
		font-weight: var(--h-weight-2);
		color: var(--hr-neutral-color-10);
		padding: 32rpx 16rpx 32rpx 32rpx;
	}
	// 蓝色
	.icon-size1 {
		font-size: var(--h-size-40);
		color: var(--hr-brand-color-6);
		font-weight: 400;
	}
	.banner-back1 {
		background: #eef3ff;
		border: 2rpx solid #d9e5ff;
	}
	// 绿色
	.icon-size2 {
		font-size: var(--h-size-40);
		color: var(--hr-success-color-6);
		font-weight: 400;
	}
	.banner-back2 {
		background: #effbfa;
		border: 2rpx solid #cfeae6;
	}
	// 背景样式
	.icon-size-back1 {
		color: var(--hr-brand-color-6);
		font-size: 90rpx;
		font-weight: 400;
		opacity: 0.15;
		position: absolute;
		right: 0;
		bottom: 0;
	}
	.icon-size-back2 {
		color: var(--hr-success-color-6);
		font-size: 90rpx;
		font-weight: 400;
		opacity: 0.15;
		position: absolute;
		right: 0;
		bottom: 0;
	}

	// 副标题
	.details {
		font-size: var(--hr-font-size-xxxs);
		color: var(--hr-neutral-color-7);
		margin-top: 12rpx;
	}

	.banner2 {
		.parent {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			grid-template-rows: repeat(2, 1fr);
			grid-column-gap: 12rpx;
			grid-row-gap: 0;
		}

		.view1 {
			grid-area: 1 / 1 / 4 / 3;
			position: relative;
		}
		.view2 {
			grid-area: 1 / 3 / 2 / 5;
			margin-bottom: 6rpx;
			position: relative;
		}
		.view3 {
			margin-top: 6rpx;
			grid-area: 2 / 3 / 3 / 5;
			position: relative;
		}
	}
}
</style>
