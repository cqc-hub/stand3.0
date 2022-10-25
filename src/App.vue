<script setup lang="ts">
  import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
  import { useGlobalStore } from '@/stores';
  import { beforeEach } from '@/router';
  import { joinQuery } from './common';
  import 'polyfill-object.fromentries';
  import '@/router/customRouter';
  import './styles/index.scss';

  onLaunch((opt) => {
    // console.log('App Launch', opt);
    const globalStore = useGlobalStore();
    globalStore.initBrowser();
  });
  onShow(async (opt) => {
    // console.log('App Show', opt);
    setTimeout(() => {
      const pages = getCurrentPages();

      const fullUrl: string = (pages[pages.length - 1] as any).$page.fullPath;

      beforeEach({
        url: fullUrl,
      });
    }, 600);
  });
  onHide(() => {
    // console.log('App Hide');
  });
</script>
<style lang="scss">
  @import url('~@/static/iconfont-icon.css');
</style>
