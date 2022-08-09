<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useGlobalStore } from '@/stores';
onLaunch(() => {
	// console.log('App Launch');
	const globalStore = useGlobalStore();
	globalStore.initBrowser();
	globalStore.getSysTerm();
});
onShow(() => {
	// console.log('App Show');
});
onHide(() => {
	// console.log('App Hide');
});
</script>
<style lang="scss">
@import url('~@/static/iconfont-icon.css');
@import url('~@/styles/index.css');
</style>
