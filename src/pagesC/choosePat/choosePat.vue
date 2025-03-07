<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-page"
  >
    <!-- <view class="icon-font icon-resize color-blue ico_arrow" /> -->
    <g-flag v-if="type === 'HKTCLJ'" typeFg="1203" isShowFg />
    <view class="g-container">
      <view class="flex-normal p32c">
        <view
          v-if="type === 'HKTCLJ'"
          @click="HK_ScanClick(pageProps)"
          class="pat-box color-blue mb16 mt24 flex1 mr24"
        >
          <view class="add-pat-box">
            <view class="add-pat g-flex-rc-cc">
              <view class="iconfont icon-resize color-blue">&#xe714;</view>
              <text>扫码直接领券</text>
            </view>
          </view>
        </view>

        <view @click="goAddPat" class="pat-box color-blue mb16 mt24 flex1">
          <view class="add-pat-box">
            <view class="add-pat g-flex-rc-cc">
              <view class="iconfont icon-resize color-blue">&#xe6ab;</view>
              <text>添加就诊人</text>
            </view>
          </view>
        </view>
      </view>

      <P-List
        v-if="gStores.userStore.patList.length"
        @choose-pat="choosePatHandler"
        :_firstIn="!_firstIn"
      />
      <view class="empty-list" v-else>
        <g-empty :current="1" />
      </view>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { GStores, useTBanner } from '@/utils';
  import { IPat } from '@/stores';
  import { deQueryForUrl } from '@/common';
  import { HK_hook, YX_hook } from './utils';
  import globalGl from '@/config/global';

  import PList from './components/list.vue';

  const pageProps = ref(
    <
      {
        type:
          | 'xx'
          // 杭口—停车领劵
          | 'HKTCLJ'
          // 宜兴检查预约
          | 'yxjcyy';
        [key: string]: any;
      }
    >{}
  );

  const gStores = new GStores();
  const type = computed(() => pageProps.value.type);
  const _firstIn = ref(true);

  const { patClick: HK_PatClick, scanClick: HK_ScanClick } = HK_hook();
  const { patClick: YX_PatClick } = YX_hook();
  const choosePatHandler = ({ item: pat }: { item: IPat; number: number }) => {
    _firstIn.value = false;
    gStores.userStore.updatePatChoose(pat);

    const { type } = pageProps.value;

    switch (type) {
      case 'HKTCLJ':
        HK_PatClick(pat, pageProps.value);
        break;

      case 'yxjcyy':
        YX_PatClick(pat);
        break;

      default:
        break;
    }
  };

  const goAddPat = () => {
    const pages = getCurrentPages();
    const fullPathNow = (pages[pages.length - 1] as any).$page
      .fullPath as string;

    uni.navigateTo({
      url: globalGl.addPersonUrl + '?_url=' + encodeURIComponent(fullPathNow),
    });
  };

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
  });
</script>

<style lang="scss" scoped>
  .add-pat-box {
    padding: 38rpx 0;
    background-color: var(--h-color-white);
    border-radius: 16rpx;
    font-weight: var(--h-weight-2);
  }

  .icon-resize {
    font-size: 48rpx;
    margin-right: 10rpx;
    font-weight: 500;
  }
</style>
