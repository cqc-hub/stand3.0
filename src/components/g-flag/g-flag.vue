<template>
	<view>
		<slot :title="mTitle" :text="text">
			<view v-if="isShowFg" class="real-top">
				<rich-text :nodes="text" />
			</view>

			<view v-if="isShowFgTip" class="tip">
				<view class="title">温馨提示</view>
				<rich-text :nodes="text" />
			</view>
		</slot>
	</view>
</template>

<script lang="ts" setup>
import { ref, withDefaults } from 'vue';
import api from '@/service/api';
import HTMLParser from '@/common/html-parser';

interface IProps {
	typeFg: string; //协议编号
	value?: string;
	isShowFg?: boolean; //顶部
	isShowFgTip?: boolean; //底部
}

const props = withDefaults(defineProps<IProps>(), {
	value: '',
	isShowFg: false
});

const text = ref<any>('');
const mTitle = ref('');

const emit = defineEmits(['update:value']);

api.getSysAppMore({
	typeFlag: props.typeFg
}).then(
	({ result }) => {
		const { content, title } = result;
		text.value = HTMLParser(content);
		mTitle.value = title;
		emit('update:value', text.value);
	},
	() => {
		uni.hideLoading();
		text.value = '未获取到协议' + props.typeFg;
		emit('update:value', text.value);
	}
);
</script>

<style lang="scss" scoped>
.real-top {
	// min-height: 56rpx;
	padding: 12rpx 32rpx;
	background: var(--hr-brand-color-1);
	text-align: left;
	color: var(--hr-brand-color-6);
	font-size: 28rpx;
	line-height: 40rpx;
}

.tip {
	.title {
		margin-bottom: 10rpx;
	}

	padding: 0 20rpx;
	font-size: 28rpx;
	line-height: 40rpx;
	color: #999;
	padding-bottom: 50rpx;
	word-break: break-all;
}
</style>
