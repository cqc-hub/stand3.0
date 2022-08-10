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
				label: `大漂亮1`
			},
			{
				label: `大漂亮2`
			},
			{
				label: `大漂亮3`
			},
			{
				label: `大漂亮4`
			},
			{
				label: `大漂亮5`
			},
			{
				label: `大漂亮6`
			},
			{
				label: `大漂亮7`
			},
			{
				label: `大漂亮8`
			},
			{
				label: `大漂亮9`
			}
		];

		actionSheetOpt.map((o, i) => {
			(o as any).id = new Date().getTime() + i;
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
