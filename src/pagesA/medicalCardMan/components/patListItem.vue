<template>
	<view class="container">
		<view class="pat-profile" @click="profileClick">
			<view class="pat-label">
				<text class="pat-name">{{ pat.patientName }}</text>
				<text class="pat-sex">{{ pat.patientSex }}</text>
				<g-tag
					v-if="pat.defaultFlag === '1'"
					type="yellow"
					text="默认"
				/>
			</view>

			<view class="iconfont icon-resize">&#xe66b;</view>
		</view>

		<view class="pat-card" @click="cardClick">
			<view class="card">
				<view class="card-content">
					<view class="card-label">电子就诊卡</view>
					<view class="card-value">{{ pat.patientId }}</view>
				</view>
			</view>

			<view class="card-container">
				<image class="qr-code" src="/static/image/v-qrcode.png"></image>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { IPat } from '@/stores/type';

export default defineComponent({
	props: {
		pat: {
			type: Object as PropType<IPat>,
			default: () => ({})
		}
	},

	emits: ['profile-click', 'card-click'],

	setup(props, ctx) {
		const { emit } = ctx;

		const profileClick = () => {
			emit('profile-click', props.pat);
		};

		const cardClick = () => {
			emit('card-click', props.pat);
		};

		return {
			profileClick,
			cardClick
		};
	}
});
</script>

<style lang="scss" scoped>
.container {
	background-color: var(--h-color-white);
	border-radius: 16rpx;
	padding: 32rpx;

	-webkit-animation-name: fadeInRight;
	animation-name: fadeInRight;
	animation-duration: 0.5s;

	.pat-profile {
		color: var(--hr-neutral-color-10);
		font-size: var(--hr-font-size-xl);
		justify-content: space-between;
		display: flex;
		align-items: center;

		.pat-label {
			display: flex;
			align-items: center;

			text {
				margin-right: 20rpx;
			}
		}

		.icon-resize {
			font-size: 48rpx;
			color: var(--hr-neutral-color-7);
		}
	}

	.pat-card {
		border-radius: 16rpx;
		background-color: #f6f8ff;
		margin-top: 24rpx;
		height: 136rpx;

		display: flex;

		.card {
			width: 65%;
			display: flex;
			align-items: center;
		}

		.card-content {
			color: var(--hr-neutral-color-9);
			font-size: var(--hr-font-size-xs);
			margin-left: 32rpx;

			.card-label {
				margin-bottom: 8rpx;
			}
		}

		.card-container {
			height: 100%;
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;

			background-image: radial-gradient(
					circle at 20rpx 0,
					#fff,
					#fff 10rpx,
					transparent 11rpx
				),
				radial-gradient(
					circle at 20rpx bottom,
					#fff,
					#fff 10rpx,
					transparent 11rpx
				);

			.qr-code {
				width: 72rpx;
				height: 72rpx;
				position: relative;
				left: 10rpx;
			}

			&::before {
				content: '';
				width: 2rpx;
				height: 100%;
				position: absolute;
				left: 18rpx;
				border-left: 4rpx dashed #fff;
			}
		}
	}
}
</style>
