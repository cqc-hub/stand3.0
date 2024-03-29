<template>
	<view>
		<view v-if="loading" class="ls-page">
			<block v-for="(item, index) in elements" :key="index">
				<!-- 横向并列布局 -->
				<view class="ls_skeleton-group" v-if="item.type == 'flex'">
					<view
						:class="[inner.clas, index2 > 0 ? 'ls_ml' : '']"
						v-for="(inner, index2) in item.children"
						:key="index2"
					>
						<view
							:class="[
								el.clas,
								el.clas == 'ls_circle' ? '' : style,
								animateClass
							]"
							v-for="(el, index3) in inner.eles"
							:key="index3"
							ref="skeleton"
						></view>
					</view>
				</view>
				<!-- 扩展模板：新闻资讯模板 -->
				<!-- ps 自定义扩展说明： -->
				<!-- 如果你需要自定义模板，可以参照这个news的写法，增加一个skeleton配置类型，编写布局和样式就可以了 -->
				<!-- 注意事项：为了保证骨架效果和动态效果的一致，扩展时，在你希望实际展示在页面中的元素上加上 :class="[style, animateClass]" 和 ref="skeleton" -->
				<view class="ls_skeleton-group" v-else-if="item.type == 'news'">
					<view
						class="ls_news_img"
						:class="[style, animateClass]"
						ref="skeleton"
					></view>
					<view class="ls_news">
						<view
							class="ls_line"
							:class="[style, animateClass]"
							ref="skeleton"
						></view>
						<view
							class="ls_news_user"
							:class="[style, animateClass]"
							ref="skeleton"
						></view>
						<view
							class="ls_news_time"
							:class="[style, animateClass]"
							ref="skeleton"
						></view>
					</view>
				</view>
				<!-- 垂直高度站位 -->
				<view
					:style="{ height: item.height + 'rpx' }"
					v-else-if="item.type == 'space'"
				></view>
				<!-- 其他基本单位  line  card circle 等 -->
				<view
					:class="[
						item.clas,
						item.clas == 'ls_circle' ? '' : style,
						animateClass
					]"
					v-else
					ref="skeleton"
				></view>
			</block>
		</view>
		<view v-else>
			<slot />
		</view>
	</view>
</template>

<script>
import { getElCountsAndLayout, getElCounts } from './util';
// #ifdef APP-NVUE
const animationActuator = weex.requireModule('animation');
let interval;
// #endif

/**
 * ls-skeleton 骨架屏
 * @description 可自定义内容的骨架屏
 * @property {Boolean} loading 是否显示骨架（默认：否）
 * @property {Boolean} round 是否圆角骨架风格（默认：否）
 * @property {Boolean} animate 是否开启动画效果（默认：是）
 * @property {Array} skeleton 骨架内容 （段落：line|line-sm|line-lg| 卡片：card|card-sm|card-lg| 圆：circle|circle-sm|circle-lg 正方形：square|square-sm|square-lg）个数标识符*  横向并列连接标识符+
 * @example
 * <ls-skeleton :skeleton="skeleton" :loading="loading">
 * 	<view>好的，页面加载完了</view>
 * </ls-skeleton>
 */
export default {
	name: 'ls-skeleton',
	props: {
		// 是否显示骨架
		loading: {
			type: Boolean,
			default: true
		},
		// 是否圆角骨架风格
		round: {
			type: Boolean,
			default: false
		},
		// 骨架内容 特殊符号说明 [*代表个数 例如：line*3 意思是3个行] [+代表横向并列排列连接  例如：circ+line 意思是左侧一个圆右侧一个行] [纯数字 代表垂直间隔 例如：40 代表40前后的两个元素之间有40rpx高度的间隔]
		skeleton: {
			type: Array,
			default: () => []
		},
		// 是否开启动画效果
		animate: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			elements: []
		};
	},
	computed: {
		animateClass() {
			return this.animate ? 'ls_animation' : 'ls_static';
		},
		style() {
			if (this.round) {
				return 'ls_round';
			}
			return 'ls_radius';
		}
	},
	watch: {
		// 开始loading时，加载动画
		loading(val) {
			// #ifdef APP-NVUE
			if (val && this.animate) {
				this.createAnimation();
			}
			// #endif
		}
	},
	created() {
		this.init();
		// #ifdef APP-NVUE
		if (this.loading && this.animate) {
			setTimeout(() => {
				this.createAnimation();
			}, 40);
		}
		// #endif
	},
	methods: {
		init() {
			let elements = [];
			let elClass;
			this.skeleton.forEach((el) => {
				if (typeof el === 'string') {
					if (el.indexOf('+') > -1) {
						let group = el.split('+');
						let children = [];
						group.forEach((els) => {
							children.push(getElCountsAndLayout(els));
						});
						elements.push({
							type: 'flex',
							children: children
						});
					} else {
						elClass = getElCounts(el);
						elements = elements.concat(elClass);
					}
				} else if (typeof el === 'number') {
					elements.push({
						type: 'space',
						height: el
					});
				} else {
					console.warn(
						'[ls-skeleton]: 参数格式包含了不符合规范的内容'
					);
				}
			});
			this.elements = [...elements];
		},
		createAnimation() {
			let background = '#e6e6e6';
			clearInterval(interval);
			interval = setInterval(() => {
				background = background === '#e6e6e6' ? '#d3d3d3' : '#e6e6e6';
				this.executeAnimation(background);
			}, 1000);
		},
		executeAnimation(background) {
			// loading结束之后，移除计时器，动画不再执行
			if (!this.loading) {
				clearInterval(interval);
				return;
			}
			this.$refs.skeleton.forEach((item) => {
				animationActuator.transition(item, {
					styles: {
						backgroundColor: background
					},
					duration: 800, //ms
					timingFunction: 'linear'
				});
			});
		}
	}
};
</script>

<style scoped>
@import url('css/index.css');
/* 扩展模板news样式 */
.ls_news {
	flex: 1;
	margin-left: 20rpx;
}

.ls_news_img {
	width: 240rpx;
	height: 200rpx;
	margin-bottom: 30rpx;
}

.ls_news_user {
	height: 32rpx;
	margin-bottom: 30rpx;
	width: 260rpx;
}

.ls_news_time {
	height: 32rpx;
	margin-bottom: 30rpx;
	width: 130rpx;
}
</style>
