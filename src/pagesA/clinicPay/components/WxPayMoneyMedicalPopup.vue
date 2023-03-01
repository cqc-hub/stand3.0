<template>
  <view class="">
    <g-popup title="医保支付" ref="isDialogShow">
      <view class="popup-content">
        <view class="title">截图保存二维码或复制链接进行支付宝医保支付</view>
        <view class="popup-tki">
          <w-qrcode :options="options" />
        </view>

        <view class="popup-href">
          <text>\n链接：{{ copyValue }}</text>
        </view>

        <view class="popup-operator">
          <view v-if="isOperation" class="popup-un-operator">
            <text class="iconfont color-blue">&#xe6c7;</text>
            复制成功
          </view>

          <button
            v-else
            @click="forShare"
            style="width: 100%"
            class="btn btn-primary flex-normal"
          >
            <text class="iconfont color-fff">&#xe716;</text>
            点击复制链接
          </button>
        </view>
      </view>
    </g-popup>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { GStores } from '@/utils';

  import globalGl from '@/config/global';

  const copyValue = ref(
    'https://ulink.alipay.com/?scheme=alipays://platformapi/startapp?appId=2021003155652649'
  );

  const isDialogShow = ref('' as any);
  const isOperation = ref(false);
  const gStores = new GStores();

  const options = ref({
    // 二维码
    size: 380,
    code: '',
  });

  const forShare = () => {
    const data = copyValue.value;
    uni.setClipboardData({
      data,
      success: () => {
        isOperation.value = true;
        uni.getClipboardData({
          success: function (res) {
            gStores.messageStore.showMessage('内容已复制');
          },
        });
      },
      fail: () => {
        gStores.messageStore.showMessage('复制失败');
        isOperation.value = false;
      },
    });
  };

  const show = () => {
    isOperation.value = false;
    options.value.code = copyValue.value;
    isDialogShow.value.show();
  };

  defineExpose({
    show,
  });
</script>

<style lang="scss" scoped>
  .popup-content {
    position: relative;
    z-index: 666;
    padding: 40rpx 32rpx;
    .title {
      text-align: center;
      margin-bottom: 40rpx;
      font-size: var(--hr-font-size-base);
      color: #444444;
    }
    .popup-tki {
      display: flex;
      justify-content: center;
    }

    .popup-href {
      margin: 24rpx 0 80rpx 0;
      font-size: var(--hr-font-size-xs);
      color: #888888;
      white-space: normal;
      word-break: break-all;

      overflow-y: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }

    .popup-operator {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #296fff;
      font-size: var(--hr-font-size-xl);
      .popup-un-operator {
        display: flex;
        align-items: center;
        height: 96rpx;
      }
      .iconfont {
        font-size: 46rpx;
        margin-right: 22rpx;
      }
    }
  }
</style>
