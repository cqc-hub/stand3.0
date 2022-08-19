<template>
	<view class="">
		<wyb-action-sheet
			ref="actionSheet"
			:options="gStores.userStore.patList"
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
import { GStores } from '@/utils';
import { IPat } from '@/stores';

export default defineComponent({
	components: {
		wybActionSheet
	},

	emits: ['choose-pat'],

	setup(props, ctx) {
		const actionSheet = ref();
		const gStores = new GStores();

		const actionSheetItemClick = (e: { index: number; item: IPat }) => {
			ctx.emit('choose-pat', e);
		};

		const show = () => {
			if (actionSheet.value) {
				actionSheet.value.showActionSheet();
			}
		};

		return {
			actionSheet,
			actionSheetItemClick,
			show,
			gStores
		};
	}
});
</script>

<style lang="scss" scoped></style>
