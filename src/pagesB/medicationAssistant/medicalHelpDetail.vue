<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="f32 g-page"
  >
    <view class="g-container">
      <view class="head-bg head-dark" />

      <view class="content">
        <Htlp-Head-Box />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { type IWaitListItem } from './utils/medicalHelp';
  import { deQueryForUrl } from '@/common';
  import { GStores } from '@/utils';

  import HtlpHeadBox from './components/HtlpHeadBox.vue';

  const pageProps = ref(<IWaitListItem>{});
  const gStores = new GStores();

  onLoad((opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    console.log(pageProps.value);
  });
</script>

<style lang="scss" scoped>
  .g-page {
    .g-container {
      .head-bg {
        position: absolute;
        left: 0;
        right: 0;
        z-index: 1;
        pointer-events: none;

        &::after {
          content: '';
          display: block;
          height: 400rpx;

          position: absolute;
          top: 0;
          left: 0;
          right: 0;
        }

        &.head-blue {
          &::after {
            background: linear-gradient(
              0deg,
              rgba(41, 111, 255, 0) 1%,
              #296fff 38%,
              #296fff 96%
            );
          }
        }

        &.head-dark {
          &::after {
            background: linear-gradient(
              0deg,
              rgba(106, 125, 165, 0) 1%,
              #6a7da5 38%,
              #6a7da5 96%
            );
          }
        }
      }

      .content {
        position: relative;
        z-index: 2;
      }
    }
  }
</style>
