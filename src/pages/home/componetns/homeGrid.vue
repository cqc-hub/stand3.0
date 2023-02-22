<template>
	<view>
		<g-grid :list="list" :type="type" @gridClick="useCommonTo" />
	</view>
</template>

<script setup lang="ts">
import { useCommonTo } from '@/common/checkJump';

interface IGridProps {
	list: IRoute[];
	type?: 1 | 2 | 3 ; //首页图标样式1 默认2 老人版本3
}
const props = defineProps<IGridProps>();
</script>

<style lang="scss" scoped></style>
