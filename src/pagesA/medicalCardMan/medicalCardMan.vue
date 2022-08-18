<template>
	<view class="">
		<pat-List :list="gStore.userStore.patList" />
	</view>
</template>

<script lang="ts" setup>
import patList from './components/patList.vue';

import { GStores, PatientUtils } from '@/utils';

const gStore = new GStores();
</script>

<style lang="scss" scoped></style>
