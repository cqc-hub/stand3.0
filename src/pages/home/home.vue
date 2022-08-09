<template>
	<view>
		首页
		<view>
			<g-search :text="searchPlaceholder"></g-search>
		</view>
	</view>
</template>

<script setup lang="ts">
const searchPlaceholder = '搜索科室、医生或疾病';
</script>

<style lang="scss" scoped></style>
