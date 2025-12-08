<template>
  <view class="">
    <uni-popup :safe-area="false" :mask-click="false" ref="popup" type="bottom">
      <view class="container">
        <view class="header">
          <image
            class="power-hos-img"
            mode="widthFix"
            :src="$global.BASE_IMG + '_codePopup_img_@2x.png'"
          />

          <view class="f48 row-box mb8">
            <text class="g-bold">{{ configData.title || '欢迎关注' }}</text>
            <text
              @click="close"
              class="iconfont close-icon color-888 f48"
            >
              &#xe6cd;
            </text>
          </view>

          <view class="f44 row-box color-blue">
            {{  configData.name || $global.systemInfo.name }}{{ configData.theme || '公众号' }}
          </view>
        </view>

        <view class="content">
          <view class="g-flex-rc-cc p32">
            <view class="qr-code">
              <image
                :src="$global.BASE_IMG + configData.imageCode"
                mode="widthFix"
                class="qr-code-img"
                show-menu-by-longpress
              />
            </view>
          </view>

          <view class="g-flex-rc-cc color-444 mb32">
            {{ configData.subTitle || '长按识别二维码，关注公众号' }}
          </view>

          <view
            v-if="!configData.isHideInfo"
            class="g-flex-rc-cc flex-column pb40"
          >
            <view v-for="item in tzList" :key="item.title" class="row">
              <view
                :class="{
                  [item.icon]: 1,
                }"
                class="icon-font"
              />

              <view>
                <view class="g-bold f36 mb8">{{ item.title }}</view>
                <view class="color-444">{{ item.desc }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const emits = defineEmits(['close-pop-click']);

  const tzList = ref([
    {
      icon: 'ico_sy_paper1',
      title: '医院就诊通知',
      desc: '预约挂号、门诊缴费、报告提醒等第一时间通知',
    },
    // {
    //   icon: 'ico_sy_cost1',
    //   title: '门诊缴费通知',
    //   desc: '门诊缴费成功后将第一时间通知您',
    // },
    // {
    //   icon: 'ico_sy_card',
    //   title: '报告查询通知',
    //   desc: '报告内容出来后将第一时间通知您',
    // },
  ]);

  const popup = ref('' as any);

  const props = withDefaults(
    defineProps<{
      configData?: {
        imageCode?: string;//展示图片地址
        theme?: string;//主题 公众号
        title?: string;//主标题
        subTitle?: string;//副标题
        isHideInfo?: Boolean;//是否展示tzList内容
        name?: string; //医院名称
      };
    }>(),
    {
      configData: () => {
        return {
          imageCode: '',
          theme: '公众号',
          title: '欢迎关注',
          subTitle: '长按识别二维码，关注公众号',
          isHideInfo: false,
        };
      },
    }
  );

  const show = () => {
    popup.value.open();
  };
  const close = () => {
    popup.value.close();
    emits('close-pop-click');
  };

  defineExpose({
    show,
    close
  });
</script>

<style lang="scss" scoped>
  .container {
    .header {
      position: relative;
      padding: 0 32rpx;
      padding-top: 48rpx;
      background-color: #fff;
      background-image: linear-gradient(
        0deg,
        rgba(41, 111, 255, 0) 1%,
        rgba(41, 111, 255, 0.2) 96%
      );
      border-radius: 8px 8px 0px 0px;
      min-height: 100rpx;

      .power-hos-img {
        height: 260rpx;
        width: 260rpx;
        position: absolute;
        left: 50%;
        top: -196rpx;
        transform: translate(-50%);
      }

      .row-box {
        text-align: center;
      }

      .close-icon {
        float: right;
        font-size: 52rpx;
        position: absolute;
        right: 32rpx;
      }

      &::after {
        content: '';
        display: block;
        position: absolute;
        background-color: #fff;
        height: 2px;
        right: 0;
        left: 0;
        bottom: -1px;
      }
    }

    .content {
      background-color: #fff;
      padding-bottom: 38rpx;

      .qr-code {
        border-radius: 16rpx;
        box-sizing: border-box;
        outline: 2rpx solid rgba(230, 230, 230, 1);

        .qr-code-img {
          width: 320rpx;
          height: 320rpx;
        }
      }

      .row {
        display: flex;
        align-items: flex-start;
        padding-bottom: 48rpx;
        width: 500rpx;

        .icon-font {
          width: 48rpx;
          height: 48rpx;
          margin-top: 10rpx;
          margin-right: 20rpx;
        }
      }
    }
  }
</style>
