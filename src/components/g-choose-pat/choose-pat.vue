<template>
	<view class="">
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

<script lang="ts">
import { defineComponent, ref } from 'vue';
import wybActionSheet from '@/components/wyb-action-sheet/wyb-action-sheet.vue';

export default defineComponent({
	components: {
		wybActionSheet
	},

	setup() {
		const actionSheet = ref();

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

		const show = () => {

			if (actionSheet.value) {
				actionSheet.value.showActionSheet();
			}
		};

		return {
			actionSheet,
			actionSheetOpt,
			actionSheetItemClick,
			show
		};
	}
});
</script>

<style lang="scss" scoped></style>
