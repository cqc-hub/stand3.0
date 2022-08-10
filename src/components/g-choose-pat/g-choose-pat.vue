<template>
	<view class="choose-pat">
		<view class="container" @click="chooseAction">
			<image
				class="user-avatar"
				:src="userSore.getAvatar"
				mode="widthFix"
			/>

			<view class="user-info text-ellipsis">
				{{
					`${userSore.name}  233213235gdgdf4234233213235gdgdf4234233213235gdgdf4234233213235gdgdf4234233213235gdgdf4234233213235gdgdf4234233213235gdgdf4234233213235gdgdf4234233213235gdgdf4234233213235gdgdf4234`
				}}
			</view>

			<text :class="`icon-font icon-resize ico_arrow`" />
		</view>

		<wyb-action-sheet
			ref="actionSheet"
			:options="actionSheetOpt"
			:showCancel="false"
			:duration="100"
			@itemclick="actionSheetItemClick"
			my-type="choosePat"
			title=""
		/>
	</view>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import { useGlobalStore, useUserStore, useMessageStore } from '@/stores';
import wybActionSheet from '@/components/wyb-action-sheet/wyb-action-sheet.vue';

const userSore = useUserStore();
const actionSheet = ref<InstanceType<typeof wybActionSheet>>();

const actionSheetOpt = [
	{
		label: `大漂亮1`,
		color: '#333333',
		fontSize: '17px',
		disabled: false
	},
	{
		label: `大漂亮2`,
		color: '#333333',
		fontSize: '17px',
		disabled: false
	},
	{
		label: `大漂亮3`,
		color: '#333333',
		fontSize: '17px',
		disabled: false
	},
	{
		label: `大漂亮4`,
		color: '#333333',
		fontSize: '17px',
		disabled: false
	},
	{
		label: `大漂亮5`,
		color: '#333333',
		fontSize: '17px',
		disabled: false
	},
	{
		label: `大漂亮6`,
		color: '#333333',
		fontSize: '17px',
		disabled: false
	},
	{
		label: `大漂亮7`,
		color: '#333333',
		fontSize: '17px',
		disabled: false
	},
	{
		label: `大漂亮8`,
		color: '#333333',
		fontSize: '17px',
		disabled: false
	},
	{
		label: `大漂亮9`,
		color: '#333333',
		fontSize: '17px',
		disabled: false
	}
];

actionSheetOpt.map((o, i) => {
	(o as unknown as any).id = new Date().getTime() + i;
});

const actionSheetItemClick = (e) => {
	console.log(e);
};

const chooseAction = () => {
	if (actionSheet.value) {
		actionSheet.value.showActionSheet();
	}
};
</script>

<style lang="scss" scoped>
.choose-pat {
	&::after {
		content: '';
		display: block;
		width: 100%;
		height: 1rpx;
		background-color: #eee;
	}
}
.container {
	padding: 20rpx 40rpx;
	padding-right: 20rpx;
	background-color: var(--h-color-white);

	display: flex;
	align-items: center;

	.user-avatar {
		width: 48rpx;
		border-radius: 100px;
		margin-right: 20rpx;
	}

	.user-info {
		flex: 1;
		width: 1px;
	}

	.icon-resize {
		width: 48rpx;
		height: 48rpx;
	}
}
</style>
