<template>
	<view class="home">
		<scroll-view class="scroll-page">
			<view class="homePage">
				<view>
					<g-search :searchPlaceholder="searchPlaceholder"></g-search>
				</view>
				<view class="card">
					<view class="top-card flex-normal-between">
						<view class="flex-normal">
							<view class="iconfont icon-size">&#xe6a7;</view>
							<!-- <text>张三三</text> -->
							<view class="patient">
								<text>张三三</text>
								<text>ID：644567882</text>
							</view>
						</view>
						<view class="switchPatient" @tap="chooseAction">
							切换就诊人
						</view>
					</view>
					<view class="top-menu">
						<view class="box">
							<g-grid :list="topMenuList" :type="1" />
						</view>
						<view class="notice flex-normal">
							<text
								class="icon-font img_announcement icon-size"
							></text>
							<swiper
								autoplay="false"
								display-multiple-items="1"
								vertical="true"
								circular
								interval="3000"
								class="bar-swiper"
							>
								<swiper-item
									v-for="(item, index) in noticeMenu"
									:key="index"
									class="swiper-item"
								>
									<view class="item_box">
										{{ item.title }}
									</view>
								</swiper-item>
							</swiper>
						</view>
					</view>
				</view>
				<view class="banner-menu">
					<homeBanner
						:leftFunctionList="bannerLeftFunctionList"
						:bannerFunctionList="bannerFunctionList"
					/>
				</view>
				<view class="fun-list">
					<homeMenu />
				</view>
			</view>
		</scroll-view>

		<choose-pat-action ref="actionSheet" />
		<homeTabbar />
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import homeBanner from './componetns/homeBanner.vue';
import homeMenu from './componetns/homeMenu.vue';
import ChoosePatAction from '@/components/g-choose-pat/choose-pat-action.vue';
import homeTabbar from './componetns/homeTabbar.vue';
import { useViewConfigStore } from '@/stores';

import { onLoad } from '@dcloudio/uni-app';
import api from '@/service/api';

// 就诊人
const actionSheet = ref<InstanceType<typeof ChoosePatAction>>();
const chooseAction = () => {
	if (actionSheet.value) {
		actionSheet.value.show();
	}
};

const viewConfigStore = useViewConfigStore();

const searchPlaceholder = '搜索科室、医生或疾病';
let topMenuList = ref({}); //首页顶部menu
const noticeMenu = ref({}); //通知列表
const bannerLeftFunctionList = ref([]); //banner列表
const bannerFunctionList = ref([]); //通知列表

onLoad(() => {
	viewConfigStore.updateHomeConfig();
	const homeConfig = viewConfigStore.getHomeConfig;
	topMenuList.value = homeConfig[0].functionList;
	noticeMenu.value = homeConfig[1].functionList;
	bannerFunctionList.value = homeConfig[2].functionList;
	bannerLeftFunctionList.value = homeConfig[2].leftFunctionList;
});
</script>

<style lang="scss" scoped>
.home {
	width: 100%;
	height: 100vh;
	position: relative;
	flex-direction: column;
	display: flex;
}

.homePage {
	padding: 16rpx 32rpx;
	padding-bottom: 60rpx;
	padding-bottom: 350rpx;

	.card {
		margin-top: var(--h-margin-24);
		// color:var(--h-color-white)

		// background-color: #dfe9ff;
		.top-card {
			padding-top: var(--h-margin-24);
			margin: 0 26rpx;
			position: relative;
			box-sizing: border-box;

			// width: 100%;
			border: 2rpx solid #dfe9ff;
			backdrop-filter: blur(30rpx);
			border-radius: 24rpx;

			height: 100rpx;

			.patient {
				text {
					display: block;
					font-size: var(--hr-font-size-base);
					line-height: 44rpx;

					&:last-child {
						font-size: var(--hr-font-size-xs);
						line-height: 40rpx;
					}
				}
			}

			:after {
				width: 100%;
				height: 112rpx;
				position: absolute;
				left: 0;
				top: 0;
				z-index: -1;
				content: '';
				// border-radius: 24rpx;

				border-radius: 24rpx 24rpx 15% 15%;

				background: var(--hr-brand-color-6);
			}

			.icon-size {
				font-size: var(--h-iconfont-60);
				margin-left: 56rpx;
				display: inline-block;
				color: var(--h-color-white);
			}

			text {
				font-size: var(--h-size-40);
				font-weight: var(--h-weight-2);
				text-align: left;
				color: var(--h-color-white);
				margin-left: 24rpx;
				line-height: 60rpx;
			}

			view.switchPatient {
				// margin-right: 56rpx;
				width: 180rpx;
				height: 64rpx;
				background: linear-gradient(
					180deg,
					rgba(255, 255, 255, 0.9),
					rgba(255, 255, 255, 0.5)
				);
				border-radius: 200rpx 0 0 200rpx;
				font-size: var(--hr-font-size-xs);
				font-weight: 400;
				color: var(--hr-brand-color-6);
				line-height: 64rpx;
				text-align: center;
			}
		}

		.top-menu {
			background: #f2f6ff;
			border: 2rpx solid #dfe9ff;
			border-radius: 24rpx;
			box-shadow: 0px 8rpx 40rpx 0rpx rgba(0, 0, 0, 0.06);

			.box {
				padding: 60rpx 0 40rpx 0;
			}

			.bar-swiper {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				flex: 1;

				.swiper-item {
					display: flex;
					align-items: center;
					word-break: break-all;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					color: var(--hr-neutral-color-9);
					font-size: var(--hr-font-size-xs);
					width: 100%;
				}
			}
		}

		.notice {
			height: 78rpx;
			background: #fefefe;
			border-radius: 0 0 24rpx 24rpx;
			box-shadow: 0 2rpx 0 0 #dfe9ff inset;
			padding: 0 31rpx;

			.icon-size {
				width: 64rpx;
				height: 64rpx;
				margin-right: 16rpx;
			}

			text {
				color: var(--hr-neutral-color-9);
				font-size: var(--hr-font-size-xs);
				display: inline-block;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}

	.banner-menu {
		margin-top: var(--h-margin-24);
	}

	.fun-list {
		margin-top: var(--h-margin-24);
	}
}

.uni-noticebar {
	margin: 0;
	width: 100%;
}
</style>
+
