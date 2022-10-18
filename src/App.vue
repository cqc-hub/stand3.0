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
      beforeEach({
        url: joinQuery('/' + opt.path, opt.query || {}),
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
