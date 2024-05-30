<template>
  <view class="">
    <view class="topbtn">
      <view
        v-for="(btn, i) in btns"
        :key="i"
        @click="useTBanner(btn)"
        class="btn f30 nav-btn btn-border btn-normal"
      >
        <text class="iconfont mr8 color-green f36">&#xe6fc;</text>
        <text>{{ btn.text }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { type TButtonConfig, useTBanner } from '@/utils';

  withDefaults(
    defineProps<{
      btns?: TButtonConfig[];
    }>(),
    {
      btns: () => [
        {
          type: 'self',
          path: 'pagesA/MyRegistration/MyRegistration?type=waitReg',
          text: '候补预约',
          addition: {
            patientId: 'p',
          },
        },
        // {
        //   type: 'h5',
        //   isSelfH5: '1',
        //   path: 'pagesC/medicationQuery/medicationQuery',
        //   text: '用药查询',
        //   isLocal: '1',
        //   addition: {
        //     patientId: '_patientId',
        //   },
        // },

        // {
        //   type: 'h5',
        //   isSelfH5: '1',
        //   path: 'pagesA/eletronicInvoice/settleList',
        //   text: '医保结算清单',
        //   addition: {
        //     patientId: '_patientId',
        //   },
        // },
      ],
    }
  );

  onLoad(async () => {});
</script>

<style lang="scss" scoped>
  .topbtn {
    position: reactive;
    z-index: 1;
    gap: 18rpx;

    display: flex;
    flex-wrap: wrap;
    $btn-width: calc(50% - 18rpx - 32rpx - 12rpx);

    .btn {
      flex: 1 1 $btn-width;
      font-weight: 400;
      > text {
        white-space: nowrap;
      }
    }
  }
</style>
