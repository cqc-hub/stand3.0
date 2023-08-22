<template>
	<view class="page" :class="{'page-other': otherApplets}">
		<view v-if="!otherApplets" class='wrap'>
			<view class='name'>{{hrOptions.displayData.doctorName||'医生'}}</view>
			<view class='info'>邀请通话</view>
			<view class="btns" v-if="isJumping">
				正在跳转
			</view>
			<view class='btns'>
				<view @tap="onClick" class='btn open'>打开小程序接听</view>
				<view @tap="onClickCancel" class='btn reject'>拒绝</view>
			</view>
			<view v-if="err">跳转错误:{{err}}</view>
		</view>
		<view v-else class="wrap">
			<view class="name">{{hrOptions.displayData.title}}</view>
			<view class='btns'>
				<view @tap="onClick" class='btn open'>打开小程序</view>
				<view @tap="onClickCancel" class='btn reject'>取消</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				otherApplets: false,
				hrOptions: {
					displayData: {
						doctorName: null,
						dcotorIcon: null,
						isInviteVideoCallType: null,
					},
				},
				err: null,
				isJumping: false,
			}
		},
		onLoad(options) {
			let trans = (field) => {
				try {
					opt[field] = decodeURIComponent(opt[field])
				} catch (error) {
					opt[field] = '{}';
				}
				opt[field] = JSON.parse(opt[field])
			}
			let opt = {
				...options
			};
			if (opt.otherApplets) {
				this.otherApplets = true
			}
			trans('displayData')
			trans('navigateToMiniProgram');
			this.hrOptions = opt
		},
		methods: {
			onClickCancel() {
				wx.navigateBack({
					delta: 1,
				})
			},
			onClick() {
				let me = this
				this.isJumping = true
				let navParams = this.hrOptions && this.hrOptions.navigateToMiniProgram
				wx.navigateBack({
					delta: 1,
					success() {
						wx.navigateToMiniProgram({
							...navParams,
							fail: (err) => {
								me.err = err.errMsg
								me.isJumping = false
							}
						})
					}
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.page {
		height: 100vh;
		color: white;
		background-color: rgb(82, 82, 82);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		&.page-other {
			background: #fff;
			color: #000;
			.btns {
				color: #fff;
			}
		}
	}

	.page .wrap {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.page .name {
		margin-bottom: 1em;
	}

	.page .info {
		margin-bottom: 5em;
	}

	.page .btns {
		width: 100vw;
		display: flex;
		justify-content: space-around;
	}

	.page .btns .btn {
		font-size: 0.8em;
		background-color: rgb(28, 146, 28);
		padding: 0.5em 1em;
		border-radius: 0.25em;
		min-width: 6em;
		text-align: center;
	}

	.page .btns .btn.reject {
		background-color: rgb(228, 13, 13);
	}
</style>
