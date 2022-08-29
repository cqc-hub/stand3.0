<template>
	<view class="home">
		<scroll-view class="scroll-page" scroll-y>
			<ls-skeleton
				:skeleton="skeletonProps.skeleton"
				:loading="skeletonProps.loading"
			>
				<view class="homePage">
					<view>
						<g-search
							:searchPlaceholder="searchPlaceholder"
						></g-search>
					</view>
					<view class="card">
						<!-- 登录之后 -->
						<block v-if="globalStore.isLogin">
							<view
								class="top-card flex-normal-between animate__animated animate__fadeIn"
							>
								<view class="flex-normal">
									<view class="iconfont icon-size">
										&#xe6a7;
									</view>
									<!-- 没有就诊人时 -->
									<!-- <text>
										{{
											userSore.name ||
											userSore.cellPhoneNum
										}}
									</text> -->
									<!-- 有就诊人时 -->
									<view class="patient">
										<text>
											{{
												gStores.userStore.patChoose
													.patientName
											}}
										</text>
										<text>
											ID：{{
												gStores.userStore.patChoose
													._showId
											}}
										</text>
									</view>
								</view>
								<view class="switchPatient" @tap="chooseAction">
									切换就诊人
								</view>
							</view>
						</block>
						<block v-else>
							<!-- 未登录 -->
							<view
								class="top-card flex-normal-between animate__animated animate__fadeIn"
							>
								<view class="flex-normal no-login">
									<text>请登录</text>
									<text>登录后享受更多服务</text>
								</view>
								<!-- #ifdef MP-ALIPAY -->
								<view
									class="switchPatient no-login-tip"
									@tap="aliLogin"
								>
									请登录
								</view>
								<!-- #endif -->
								<!-- #ifdef MP-WEIXIN -->
								<button
									open-type="getPhoneNumber"
									@getphonenumber="wxLogin"
									class="login-btn"
								>
									请登录
								</button>
								<!-- #endif -->
							</view>
						</block>

						<view class="top-menu">
							<view class="box">
								<g-grid :list="topMenuList" :type="1" />
							</view>
							<view class="notice flex-normal">
								<text
									class="icon-font img_announcement icon-size"
								></text>

								<swiper
									autoplay="true"
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
										<view class="item-box">
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
							:functionList="bannerFunctionList"
						/>
					</view>
					<view class="fun-list">
						<homeMenu :list="menuList" />
					</view>
				</view>
			</ls-skeleton>
		</scroll-view>
		<g-message />
		<choose-pat-action ref="actionSheet" @choose-pat="choosePatHandler" />
		<homeTabbar />
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import homeBanner from './componetns/homeBanner.vue';
import homeMenu from './componetns/homeMenu.vue';
import ChoosePatAction from '@/components/g-choose-pat/choose-pat-action.vue';
import homeTabbar from './componetns/homeTabbar.vue';
import { useGlobalStore, useUserStore, IPat } from '@/stores';

import { onLoad } from '@dcloudio/uni-app';
import api from '@/service/api';
import {
	aliLogin,
	wxLogin,
	ServerStaticData,
	PatientUtils,
	GStores
} from '@/utils';

const userSore = useUserStore();
const gStores = new GStores();
const globalStore = useGlobalStore();

//刷新就诊人列表
// if (globalStore.herenId) {
// 	new PatientUtils().getPatCardList();
// }

//骨架屏配置
const skeletonProps = {
	loading: true,
	skeleton: [
		'line-lg',
		24,
		'line-lg',
		'card+card+card+card',
		24,
		'card-lg+card-lg',
		32,
		'line-lg',
		'card-sm+card-sm+card-sm+card-sm',
		0,
		'card-sm+card-sm+card-sm+card-sm'
	]
};
// 就诊人

const actionSheet = ref<InstanceType<typeof ChoosePatAction>>();
const chooseAction = () => {
	if (actionSheet.value) {
		actionSheet.value.show();
	}
};
const choosePatHandler = ({ item }: { item: IPat; number: number }) => {
	gStores.userStore.updatePatChoose(item);
};

const searchPlaceholder = '搜索科室、医生或疾病';
let topMenuList = ref({}); //首页顶部menu
const noticeMenu = ref<IRoute[]>([]); //通知列表
const bannerLeftFunctionList = ref([]); //banner列表
const bannerFunctionList = ref([]); //通知列表
const menuList = ref([]); //业务模块

onLoad(() => {
	getHomeConfig();
});
//获取配置数据
const getHomeConfig = async () => {
	skeletonProps.loading = true;
	const homeConfig = await ServerStaticData.getHomeConfig();
	if (homeConfig) {
		topMenuList.value = homeConfig[0].functionList;
		noticeMenu.value = homeConfig[1].functionList;
		bannerFunctionList.value = homeConfig[2].functionList;
		bannerLeftFunctionList.value = homeConfig[2].leftFunctionList;
		menuList.value = homeConfig[3].typeList;
		skeletonProps.loading = false;
	}
};
</script>

<style lang="scss" scoped>
.home {
	width: 100%;
	height: 100vh;
	position: relative;
	flex-direction: column;
	display: flex;
	background: #ffffff;
}

.homePage {
	padding-bottom: 350rpx;

	.card {
		margin-top: var(--h-margin-24);
		.top-card {
			padding-top: var(--h-margin-24);
			margin: 0 26rpx;
			position: relative;
			box-sizing: border-box;

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

				border-radius: 24rpx 24rpx 15% 15%;

				background: var(--hr-brand-color-6);
			}
			.no-login {
				text {
					font-size: var(--hr-font-size-base);
					&:last-child {
						font-size: var(--hr-font-size-xxxs);
					}
				}
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
			view.no-login-tip {
				width: 124rpx;
			}
		}

		.login-btn {
			border: none !important;
			background-color: transparent;
			box-shadow: none !important;
			margin: 0;
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
			& button,
			& uni-button:after,
			& button:after {
				border: none !important;
				background-color: transparent;
				box-shadow: none !important;
				padding: 0;
			}
			&:after {
				background: none;
				border: none;
				padding: 0;
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
					color: var(--hr-neutral-color-9);
					font-size: var(--hr-font-size-xs);
					.item-box {
						word-break: break-all;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						width: 100%;
					}
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
