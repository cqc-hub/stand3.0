<template>
	<view class="page scroll-page">
		<g-flag class="tip" typeFg="104" isShowFg />
		<g-choose-pat @choosePat="choosePat" />
		<scroll-list
			ref="scrolList"
			:option="option"
			@load="load"
			@refresh="refresh"
		>
			<view class="box">
				<view
					class="item-box"
					v-for="(item, i) in NucleicResult"
					:key="i"
				>
					<view class="item-box-top flex-between">
						<text>检测结果</text>
						<text
							class="label"
							:class="{ warn: item.hsResult === '阳性' }"
						>
							{{ item.hsResult }}
						</text>
					</view>
					<view class="item-box-content">
						<view>
							<text class="title">报告时间：</text>
							<text>{{ item.hsDate }}</text>
						</view>
						<view>
							<text class="title">采样时间：</text>
							<text>{{ item.collectionDate }}</text>
						</view>
						<view>
							<text class="title">检测机构：</text>
							<text>{{ item.hsOrgan }}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-list>
		<g-message />
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '@/service/api';
import { onLoad } from '@dcloudio/uni-app';
import { GStores } from '@/utils';

interface INucleic {
	collectionDate: string;
	hsAmount: string;
	hsDate: string;
	hsOrgan: string;
	hsResult: '阳性' | '阴性';
	name: string;
}

const NucleicResult = ref<INucleic[]>([]);
const scrolList = ref();
const option = {
	size: 1,
	auto: true,
	showEmpty: false
};

const pageContent = {
	pageNumber: 1,
	pageSize: 5
};

const gStores = new GStores();
//切换就诊人
const choosePat = (item) => {
	console.log(888, item.patientId);
	getNucleicResult(pageContent, item.patientId);
};
onLoad(() => {
	console.log(gStores.userStore.patChoose.patientId);
});

//获取列表数据
const getNucleicResult = async (page, id?) => {
	const { result } = await api.getNucleicResult({
		// patientId: '822868244',
		patientId: id || gStores.userStore.patChoose.patientId,
		...page
	});
	NucleicResult.value = NucleicResult.value.concat(result);
};
const load = (paging) => {
	pageContent.pageNumber = paging.page;
	setTimeout(() => {
		getNucleicResult(pageContent)
			.then(() => {
				// 加载成功
				scrolList.value.loadSuccess({
					list: NucleicResult.value,
					total: 3
				});
			})
			.catch(() => {
				// 加载失败
				scrolList.value.loadFail();
			});
	}, 300);
};
const refresh = (paging) => {
	//下拉刷新最新的数据
	NucleicResult.value = [];
	pageContent.pageNumber = paging.page;
	setTimeout(() => {
		getNucleicResult(pageContent)
			.then(() => {
				// 加载成功
				scrolList.value.refreshSuccess({
					list: NucleicResult.value,
					total: 3
				});
			})
			.catch(() => {
				// 加载失败
				scrolList.value.refreshFail();
			});
	}, 300);
};
</script>

<style scoped lang="scss">
.box {
	padding: 24rpx 32rpx;
	.item-box {
		margin-bottom: 18rpx;
		padding: 32rpx 32rpx 16rpx 32rpx;
		background: #ffffff;
		border-radius: 16rpx;
		.item-box-top {
			border-bottom: 2rpx solid var(--h-color-border);
			padding-bottom: 15rpx;
			margin-bottom: 18rpx;
			text {
				color: var(--hr-neutral-color-10);
				font-size: var(--hr-font-size-base);
			}
			.label {
				width: 144rpx;
				height: 56rpx;
				background: var(--hr-success-color-6);
				border-radius: 8px;
				display: inline-block;
				line-height: 56rpx;
				color: var(--h-color-white);
				text-align: center;
			}
			.warn {
				background: var(--hr-error-color-6);
			}
		}
		.item-box-content {
			view {
				margin-bottom: 16rpx;
			}
			text.title {
				font-size: var(--hr-font-size-xs);
				color: var(--hr-neutral-color-7);
				line-height: 40rpx;
			}
			text {
				color: var(--hr-neutral-color-10);
				font-size: var(--hr-font-size-xs);
			}
		}
	}
}
</style>
