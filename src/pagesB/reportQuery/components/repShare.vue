<template>
  <view class="">
    <uni-popup ref="popup" :isMaskClick="false" @change="change">
      <view>
        <view class="g-flex-rc-cc"></view>
      </view>
    </uni-popup>
    <g-popup
      :maskAlpha="0"
      :duration="100"
      :maskClickClose="false"
      isHideNav
      ref="popupBottom"
    >
      <view class="footer">
        <view class="g-flex-rc-cc g-bold f36 footer-title">查看报告</view>
        <view class="share-content flex-normal">
          <button
            @click="operateDocument('look')"
            class="share-btn"
          >
            <view class="g-flex-rc-cc footer-btn-content">
              <view class="iconfont share-icon color-blue">&#xe6db;</view>
              <view class="color-444 f28">查看报告</view>
            </view>
          </button>

          <!-- #ifdef MP-WEIXIN -->
          <button @click="operateDocument('share')" class="share-btn">
            <view class="g-flex-rc-cc footer-btn-content">
              <view class="iconfont share-icon">&#xe704;</view>
              <view class="color-444 f28">转发给好友</view>
            </view>
          </button>
          <!-- #endif -->
        </view>

        <button @click="close" class="share-btn g-bold">
          <view class="cancel-btn g-border-top f32">取消</view>
        </button>
      </view>
    </g-popup>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { downFile,GStores } from '@/utils';

  const props = defineProps<{
    currentData: any;
  }>();

  const change = ({ show }) => {};
  const gStores = new GStores();
  const popup = ref<any>('');
  const popupBottom = ref<any>('');

  const close = () => {
    uni.hideLoading();
    popupBottom.value.close();
    popup.value.close();
  };
  const operateDocument = (type) => {
    if (props.currentData.url) {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });
      downFile(props.currentData.url).then((path) => {
        if (type == 'share') {
          wx.shareFileMessage({
            filePath: path,
            fileName: `${props.currentData.repName}.pdf`,
            success(data) {
              close();
            },
            fail(err) {
                console.log('转发失败',err)
                gStores.messageStore.showMessage('转发失败', 2000, {
                  uniToast: true,
                });
            },
          });
        } else if (type == 'look') {
          uni.openDocument({
            filePath: path, // 下载的PDF临时路径
            showMenu: true, // 显示菜单栏，允许用户保存或分享
            success: function (res) {
              close();
            },
          });
        }
      });
    } else {
      console.log('暂不支持');
    }
  };

  const show = () => {
    popup.value.open();
    popupBottom.value.show();
  };
  defineExpose({
    show,
  });
</script>

<style lang="scss" scoped>
  .footer {
    .footer-title {
      padding: 28rpx;
    }

    .share-content {
      // height: 200rpx;
      padding: 0 32rpx;

      .footer-btn-content {
        flex-direction: column;
        height: 150rpx;
      }
    }

    .share-btn {
      padding: 0;
      margin: 0;
      border: none;
      background: transparent;
      height: 500rpx;

      display: inline-block;
      line-height: 1em;
      height: 100%;
      width: 100%;
      vertical-align: middle;

      &::after {
        border: none;
      }

      .share-icon {
        color: var(--hr-success-color-6);
        font-size: 88rpx;
        padding-bottom: 40rpx;
        transform: translateY(10rpx);
      }
    }

    .cancel-btn {
      padding: 26rpx;
      margin-top: 20rpx;
      /* #ifndef H5 */
      padding-bottom: 80rpx;
      /* #endif */
      user-select: none;
    }
  }
</style>
