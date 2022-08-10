<template>
	<view
		class="wyb-action-sheet-box"
		@tap.stop.prevent
		@touchmove.stop.prevent
	>
		<!-- :bg-color="type === 'material' ? '#eaeaea' : 'rgba(0,0,0,0)'" -->
		<wyb-popup
			ref="popup"
			height="10"
			:mask-click-close="maskClickClose"
			:mask-alpha="maskAlpha"
			@show="onActionSheetShow"
			@hide="onActionSheetHide"
			bg-color="rgba(0,0,0,0)"
		>
			<view
				class="wyb-action-sheet-content"
				:style="{ paddingBottom: bottomFit + 'rpx' }"
			>
				<view v-if="title" class="wyb-action-sheet-options-title">
					{{ title }}
				</view>
				<view
					class="wyb-action-sheet-options"
					:class="
						myType !== 'choosePat' && 'wyb-action-sheet-options-arr'
					"
				>
					<scroll-view class="container" scroll-y>
						<block v-if="myType === 'choosePat'">
							<pat-List
								@pat-click="
									({ index, item }) => onItemsTap(index, item)
								"
								:list="options"
							/>
						</block>
						<block v-else>
							<view
								v-for="(item, index) in options"
								:key="index"
								@tap.stop="onItemsTap(index, item)"
								:class="autoOptionsItemClass"
								:style="{
									'--hover': item.disabled
										? type === 'ios'
											? 'rgba(255, 255, 255, 0.9)'
											: '#fff'
										: type === 'ios'
										? 'rgba(241, 241, 241, 0.9)'
										: '#f1f1f1',
									color: autoItemColor(item),
									fontSize:
										item.fontSize ||
										'var(--hr-font-size-base)',
									borderTopLeftRadius:
										index === 0 && type === 'ios'
											? '6px'
											: '0px',
									borderTopRightRadius:
										index === 0 && type === 'ios'
											? '6px'
											: '0px',
									borderBottomLeftRadius:
										index === options.length - 1 &&
										type === 'ios'
											? '6px'
											: '0px',
									borderBottomRightRadius:
										index === options.length - 1 &&
										type === 'ios'
											? '6px'
											: '0px'
								}"
							>
								{{ autoItemLabel(item) }}
							</view>
						</block>
					</scroll-view>
				</view>
				<view
					v-if="showCancel"
					@tap.stop="onCancelTap"
					:class="autoCancelClass"
					:style="{
						'--hover':
							type === 'ios'
								? 'rgba(241, 241, 241, 0.9)'
								: '#f1f1f1',
						color:
							cancelColor ||
							(type === 'ios' ? '#fa3534' : '#333'),
						fontSize: cancelFontSize
					}"
				>
					{{ cancelText }}
				</view>
			</view>
		</wyb-popup>
	</view>
</template>

<script>
// https://ext.dcloud.net.cn/plugin?id=2638
import wybPopup from '@/components/wyb-popup/wyb-popup.vue';
import patList from './pat-list.vue';
export default {
	components: {
		wybPopup,
		patList
	},
	computed: {
		autoOptionsItemClass() {
			return `wyb-action-sheet-options-item-${
				this.type === 'ios' ? 'i' : 'm'
			}
						wyb-action-sheet-highlight-${this.type === 'ios' ? 'i' : 'm'}`;
		},
		autoCancelClass() {
			return `wyb-action-sheet-cancel-${this.type === 'ios' ? 'i' : 'm'}
						wyb-action-sheet-highlight-${this.type === 'ios' ? 'i' : 'm'}`;
		},
		autoItemLabel() {
			return function (item) {
				return typeof item === 'string' ? item : item.label;
			};
		},
		autoItemColor() {
			return function (item) {
				let resultColor = '';
				const level = 0.7;
				if (item.disabled) {
					if (item.color) {
						resultColor = this.RGBChange(
							item.color,
							level,
							'light'
						);
					} else {
						if (this.type === 'ios') {
							resultColor = this.RGBChange(
								'#2979ff',
								level,
								'light'
							);
						} else {
							resultColor = this.RGBChange(
								'#333',
								level,
								'light'
							);
						}
					}
				} else {
					resultColor =
						item.color ||
						(this.type === 'ios'
							? '#2979ff'
							: 'var(--hr-neutral-color-10)');
				}
				return resultColor;
			};
		}
	},
	props: {
		myType: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: 'material'
		},
		options: {
			type: Array,
			default() {
				return ['a', 'b', 'c'];
			}
		},
		maskClickClose: {
			type: Boolean,
			default: true
		},
		maskAlpha: {
			type: Number,
			default: 0.6
		},
		duration: {
			type: Number,
			default: 300
		},
		showCancel: {
			type: Boolean,
			default: true
		},
		cancelText: {
			type: String,
			default: '取消'
		},
		cancelColor: {
			type: String,
			default: ''
		},
		cancelFontSize: {
			type: String,
			default: '35rpx'
		},
		bottomFit: {
			type: [String, Number],
			default: '0'
		}
	},
	methods: {
		showActionSheet() {
			this.$refs.popup.show();
		},
		hideActionSheet() {
			this.$refs.popup.hide();
		},
		onItemsTap(index, item) {
			if (!item.disabled) {
				this.$emit('itemclick', {
					index,
					label: typeof item === 'string' ? item : item.label,
					item
				});
				this.hideActionSheet();
			}
		},
		onCancelTap() {
			this.hideActionSheet();
		},
		onActionSheetShow() {
			this.$emit('show');
		},
		onActionSheetHide() {
			this.$emit('hide');
		},
		RGBChange(color, level, type) {
			// 判断颜色类型
			let r = 0,
				g = 0,
				b = 0,
				hasAlpha = false,
				alpha = 1;
			if (color.indexOf('#') !== -1) {
				// hex转rgb
				if (color.length === 4) {
					let arr = color.split('');
					color =
						'#' +
						arr[1] +
						arr[1] +
						arr[2] +
						arr[2] +
						arr[3] +
						arr[3];
				}
				let color16List = [
					color.substring(1, 3),
					color.substring(3, 5),
					color.substring(5, 7)
				];
				r = parseInt(color16List[0], 16);
				g = parseInt(color16List[1], 16);
				b = parseInt(color16List[2], 16);
			} else {
				hasAlpha = color.indexOf('a') !== -1;
				let root = color.slice();
				let idx = root.indexOf('(') + 1;
				root = root.substring(idx);
				let firstDotIdx = root.indexOf(',');
				r = parseFloat(root.substring(0, firstDotIdx));
				root = root.substring(firstDotIdx + 1);
				let secondDotIdx = root.indexOf(',');
				g = parseFloat(root.substring(0, secondDotIdx));
				root = root.substring(secondDotIdx + 1);
				if (hasAlpha) {
					let thirdDotIdx = root.indexOf(',');
					b = parseFloat(root.substring(0, thirdDotIdx));
					alpha = parseFloat(root.substring(thirdDotIdx + 1));
				} else {
					b = parseFloat(root);
				}
			}

			let rgbc = [r, g, b];
			// 减淡或加深
			for (var i = 0; i < 3; i++)
				type === 'light'
					? (rgbc[i] = Math.floor((255 - rgbc[i]) * level + rgbc[i]))
					: (rgbc[i] = Math.floor(rgbc[i] * (1 - level)));

			if (hasAlpha) {
				return `rgba(${rgbc[0]}, ${rgbc[1]}, ${rgbc[2]}, ${alpha})`;
			} else {
				return `rgb(${rgbc[0]}, ${rgbc[1]}, ${rgbc[2]})`;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.wyb-action-sheet-content {
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
	border: none;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.wyb-action-sheet-options-title {
	font-size: 28upx;
	font-weight: 400;
	color: #666666;
	background-color: #fff;
	padding: 20upx 30upx;
	border-bottom: 1rpx solid var(--hr-neutral-color-2);
	width: 100%;
	text-align: center;
}

.wyb-action-sheet-options {
	width: 100%;
}

.wyb-action-sheet-options-arr {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.wyb-action-sheet-options-item-m {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 25rpx 0;
	background-color: #fff;
	border-bottom: 1rpx solid var(--hr-neutral-color-2);

	position: relative;

	&:first-child {
		border-radius: 20rpx 20rpx 0px 0px !important;
	}

	&:last-child {
		padding-bottom: 75rpx;

		&::after {
			content: '';
			display: block;
			position: absolute;
			right: 0;
			left: 0;
			bottom: 50rpx;
			height: 2rpx;
			background-color: var(--hr-neutral-color-2);
		}
	}
}

.wyb-action-sheet-cancel-m {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 10rpx;
	padding: 25rpx 0;
	background-color: #fff;
}

.wyb-action-sheet-options-item-i {
	width: 90%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 1px;
	padding: 25rpx 0;
	background-color: rgba(255, 255, 255, 0.9);
}

.wyb-action-sheet-cancel-i {
	width: 90%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 15rpx;
	margin-bottom: 20rpx;
	padding: 25rpx 0;
	background-color: rgba(255, 255, 255, 0.9);
	border-radius: 6px;
}

.wyb-action-sheet-highlight-i:active,
.wyb-action-sheet-highlight-m:active {
	background-color: var(--hover);
}

.container {
	width: 100%;
	max-height: 1119rpx;
}
</style>
