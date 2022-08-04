<template>
	<view class="login-center">
		{{ userSore.name }}
	</view>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import { useUserStore, useMessageStore } from '@/stores';

const userSore = useUserStore();
const messageStore = useMessageStore();
</script>

<style lang="scss" scoped>
.login-center {
	width: 100%;
	height: 100vh;
}
</style>
