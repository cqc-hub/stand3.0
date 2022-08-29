<template>
	<view>
		<view class="banner-grid">
			<!-- 只有一个banner时 -->
			<view
				class="uni-margin-wrap"
				v-if="
					props.leftFunctionList.length > 0 &&
					props.functionList.length == 0
				"
			>
				<swiper class="swiper" circular indicator-dots="true">
					<swiper-item
						v-for="(item, i) in props.leftFunctionList"
						:key="i"
					>
						<image mode="scaleToFill" :src="item.iconfont" />
					</swiper-item>
				</swiper>
			</view>
			<!-- 常规banner+三个入口 -->
			<!-- <view class="banner" v-if="type == 2">
				<view class="parent">
					<view class="view1">
						<swiper class="swiper" circular indicator-dots="true">
							<swiper-item
								v-for="(item, i) in props.leftFunctionList"
								:key="i"
							>
								<image
									mode="scaleToFill"
									:src="item.iconfont"
								/>
							</swiper-item>
						</swiper>
					</view>
					<view
						v-for="(item, i) in props.functionList"
						:key="i"
						:class="`view${i + 2} banner-back${
							i + 1
						} flex-between banner-common`"
					>
						<text>{{ item.title }}</text>
						<view class="iconfont icon-size1">&#xe6a0;</view>
					</view>
				</view>
			</view> -->
			<!-- 常规banner+三个入口 首页 三个纯入口 支持第一个是否是banner -->
			<view class="banner2">
				<!-- v-if="type == 3" -->
				<view class="parent">
					<!-- 只有一个入口 -->
					<view
						class="view1 banner-back1 banner-common"
						v-if="props.leftFunctionList.length == 1"
						@tap="gotoPath(props.leftFunctionList[0])"
					>
						<view class="flex-between">
							<text>{{ props.leftFunctionList[0].title }}</text>
						</view>
						<text class="details">
							{{ props.leftFunctionList[0].detail }}
						</text>
						<view class="iconfont icon-size-back1">&#xe6a5;</view>
					</view>
					<!-- 第一组是多个banner -->
					<view v-else class="view1">
						<swiper class="swiper" circular indicator-dots="true">
							<swiper-item
								v-for="(item, i) in props.leftFunctionList"
								:key="i"
								@tap="gotoPath(item)"
							>
								<image
									mode="scaleToFill"
									:src="item.iconfont"
								/>
							</swiper-item>
						</swiper>
					</view>
					<view
						v-for="(item, i) in props.functionList"
						:key="i"
						:class="`view${i + 2} banner-back${
							i + 1
						} banner-common`"
						@tap="gotoPath(item)"
					>
						<view class="flex-between">
							<text>{{ item.title }}</text>
							<view :class="`iconfont icon-size${i + 1}`">
								&#xe6a0;
							</view>
						</view>
						<text class="details">
							{{ item.detail }}
						</text>
						<view :class="`iconfont icon-size-back${i + 1}`">
							&#xe6a5;
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { withDefaults, ref, computed } from 'vue';
import { useCommonTo } from '@/common/checkJump';
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
//跳转对应地址
const gotoPath = (item) => {
	useCommonTo(item);
};

// const type = computed(() => {
// 	//type 2 常规banner+三个入口   3 首页 三个纯入口
// 	//左侧有数据
// 	if (props.leftFunctionList.length > 2 && props.functionList.length > 1) {
// 		return 2;
// 	} else {
// 		return 3;
// 	}
// });
</script>

<style lang="scss" scoped>
.banner-grid {
	.uni-margin-wrap {
		width: 100%;
		height: 160rpx;
	}

	swiper-item {
		display: block;

		image {
			width: 100%;
			height: 160rpx;
			will-change: transform;
		}
	}
	// .banner {
	// 	.parent {
	// 		display: grid;
	// 		grid-template-columns: repeat(4, 1fr);
	// 		grid-template-rows: repeat(3, 1fr);
	// 		grid-column-gap: 12rpx;
	// 		grid-row-gap: 12rpx;
	// 	}

	// 	.view1 {
	// 		grid-area: 1 / 1 / 4 / 3;
	// 		border-radius: 16rpx;
	// 	}
	// 	.view2 {
	// 		grid-area: 1 / 3 / 2 / 5;
	// 	}
	// 	.view3 {
	// 		grid-area: 2 / 3 / 3 / 5;
	// 	}
	// 	.view4 {
	// 		grid-area: 3 / 3 / 4 / 5;
	// 	}
	// }

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
	.icon-size3 {
		font-size: var(--h-size-40);
		color: var(--hr-brand-color-6);
		font-weight: 400;
	}
	.banner-back2 {
		background: #effbfa;
		border: 2rpx solid #cfeae6;
	}
	.banner-back3 {
		background: #eef3ff;
		border: 2rpx solid #d9e5ff;
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

	.icon-size-back3 {
		color: var(--hr-brand-color-6);
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
		.view4 {
			margin-top: 12rpx;
			grid-area: 3 / 3 / 4 / 5;
			position: relative;
		}
	}
}
</style>
