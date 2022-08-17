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
	typeFg: string;
	value?: string;
	isShowFg?: boolean;
	isShowFgTip?: boolean;
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
	// min-height: 56upx;
	padding: 10upx 30upx;
	background: rgba(255, 163, 78, 0.0706);
	text-align: left;
	color: #ff8053;
	font-size: 28upx;
}

.tip {
	.title {
		margin-bottom: 10upx;
	}

	padding: 0 20upx;
	font-size: 28upx;
	line-height: 40upx;
	color: #999;
	padding-bottom: 50upx;
	word-break: break-all;
}
</style>
