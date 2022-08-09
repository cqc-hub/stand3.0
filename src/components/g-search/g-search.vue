<template>
	<view>
		<uni-easyinput
			class="uni-mt-5"
			v-model="value"
			:suffixIcon="suffixIcon"
			:styles="styles"
			placeholder="右侧图标"
			@iconClick="iconClick"
			@focus="inputFocus"
			@blur="inputBlur"
		/>
	</view>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';

const suffixIcon = ref('search');
const value = ref('');
const styles = ref({
	color: '#2979FF',
	borderColor: '#2979FF',
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
</style>
