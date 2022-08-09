<template>
	<view>
		<uni-easyinput
			class="uni-mt-5"
			v-model="value"
			:suffixIcon="suffixIcon"
			:styles="styles"
			:placeholder="props.searchPlaceholder"
			@iconClick="iconClick"
			@focus="inputFocus"
			@blur="inputBlur"
		/>
	</view>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';

const props = defineProps<{
	searchPlaceholder: string;
}>();
const suffixIcon = ref('search');
const value = ref('');
const styles = ref({
	color: '#BBBBBB',
	borderColor: '#444'
});
const iconClick = () => {
	console.log('233');
};

const inputFocus = () => {
	console.log('focus');
	suffixIcon.value = '';
};

const inputBlur = () => {
	console.log('blur');
	suffixIcon.value = 'search';
};
</script>

<style lang="scss" scoped>
:deep(input.custom) {
	caret-color: red;
}
.uni-easyinput {
	// border: 3rpx solid #444444;
	border-radius: 16rpx;
}
</style>
