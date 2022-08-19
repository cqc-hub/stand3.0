<template>
	<view :class="options.type == 2 ? 'normal' : 'diff'">
		<uni-grid
			:showBorder="false"
			:square="false"
			:column="type == 1 ? options.list.length : 4"
		>
			<uni-grid-item v-for="(item, i) in options.list" :key="i">
				<view class="grid-item-box" @tap="gotoPath(item)">
					<!-- 绿色能量角标 -->
					<!-- v-if="item.enabled == 0 "  -->
					<!-- gridLabel  0 默认无角标 1 绿色能量 2 立减五元 3 维护中 -->
					<view class="weihu" v-if="item.gridLabel == '3'">
						维护中
					</view>
					<view class="gree-label" v-if="item.gridLabel == '1'">
						绿色能量
					</view>

					<text :class="`icon-font grid-resize ${item.iconfont}`" />
					<view class="grid-label">{{ item.title }}</view>
					<text class="grid-title">{{ item.detail }}</text>
				</view>

				<!-- <view class="grid-dot">
						disabled
					</view> -->
			</uni-grid-item>
		</uni-grid>
	</view>
</template>

<script lang="ts" setup>
import { withDefaults, computed } from 'vue';
interface IGridProps {
	list: IRoute[];
	type?: 1 | 2; //首页图标样式1 默认2
}

const props = withDefaults(defineProps<IGridProps>(), {
	list: () => [
		{
			title: '医院介绍',
			path: '/xxx',
			iconfont: 'ico_sy_paper5'
		},
		{
			title: '医院介绍',
			path: '/xxx',
			iconfont: 'ico_sy_paper5'
		},
		{
			title: '医院介绍',
			path: '/xxx',
			iconfont: 'ico_sy_paper5'
		},
		{
			title: '医院介绍',
			path: '/xxx',
			iconfont: 'ico_sy_paper5'
		}
	],
	type: 2
});

const options = computed(() => {
	return {
		list: props.list,
		type: props.type
	};
});

//跳转对应地址
const gotoPath = (item) => {
	my.navigateToMiniProgram({
		appId: '2018070960585195',
		path: 'page/map-index/map-index?query=source=alipay_yiyuan_shengrenmin&unifiedProtocol=true',
		query: {
			source: 'alipay_yiyuan_shengrenmin',
			unifiedProtocol: true
		}
	});
	//terminalType h5 mini
	// let path = item.query ? joinQuery(item.path, item.query) : item.path;
	//支付宝小程序
	// if (miniprogram.value) {
	// 	my.navigateTo({ url: item.path });
	// } else {
	// 	if (item.terminalType == 'h5') {
	// 		window.location.href = item.path;
	// 	} else if (item.terminalType == 'mini') {
	// 		wx.miniProgram.navigateTo({
	// 			url: item.path
	// 		});
	// 	}
	// }
	// terminalType?: string;//终端类型 h5:三方h5 mini:三方微信小程序 alipay:三方支付宝小程序 my:自研
	// switch (item.terminalType) {
	// 	case 'h5':
	// 		uni.navigateTo({
	// 			url: item.path
	// 		});
	// 		break;
	// 	case 'mini':
	// 		uni.navigateToMiniProgram({
	// 			appId: item.appId,
	// 			path: item.url,
	// 			extraData: JSON.parse(item.query)
	// 		});
	// 		break;
	// 	case 'alipay':
	// 		my.navigateToMiniProgram({
	// 			appId: item.appId,
	// 			path: item.path,
	// 			query: JSON.parse(item.query)
	// 		});
	// 		break;
	// 	default:
	// 		//自研或者其他直接跳转的
	// 		uni.navigateTo({
	// 			url: item.path
	// 		});
	// 		break;
	// }
};
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

		.grid-resize {
			width: 88upx;
			height: 88upx;
			position: relative;
		}

		.grid-label {
			margin-top: 8upx;
			font-size: var(--hr-font-size-s);
			color: var(--hr-neutral-color-10);
			font-weight: var(--h-weight-2);
		}
		.grid-title {
			font-size: var(--hr-font-size-xxxs);
			text-align: center;
			color: var(--hr-neutral-color-7);
			line-height: 34rpx;
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
			position: relative;
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
.gree-label {
	position: absolute;
	background: #ffffff;
	border: 1rpx solid var(--hr-success-color-6);
	border-radius: 17rpx;
	color: var(--hr-success-color-6);
	line-height: 32rpx;
	font-size: var(--h-size-18);
	padding: 0 8rpx;
	z-index: 100;
	right: 10rpx;
	top: 5rpx;
	background-color: var(--h-color-white);
	box-sizing: border-box;
}
.weihu {
	width: 90rpx;
	height: 32rpx;
	line-height: 32rpx;
	color: var(--h-color-white);
	background: var(--hr-error-color-6);
	border: 2rpx solid var(--h-color-white);
	border-radius: 200rpx;
	// box-shadow: 0 4rpx 8rpx 0 rgba(210, 1, 1, 0.5);
	box-shadow: 0 8rpx 40rpx 0r rgba(0, 0, 0, 0.06);
	border-radius: 24rpx;
	text-align: center;
	font-size: var(--hr-font-size-xxxs);
	position: absolute;
	z-index: 100;
	right: 5rpx;
	top: 5rpx;
}
</style>
