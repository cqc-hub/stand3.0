<template>
  <view class="g-page">
    <scroll-view class="g-container" scroll-y>
      <image
        :src="$global.BASE_IMG + 'v3_doctor_card_top.png'"
        mode="widthFix"
        class="header-bg my-disabled"
      />
      <view class="content">
        <view class="header-box">
          <view class="content-box header-content-box g-border">
            <view class="header-transform">
              <view class="header mb16 flex-between">
                <image
                  :src="headerBg"
                  @click="previewImg"
                  mode="aspectFill"
                  class="doc-avatar g-border"
                />

                <view class="flex-normal header-btn">
                  <button class="btn btn-warning btn-round btn-size-small">
                    <text class="iconfont f36 mr12">&#xe700;</text>
                    <text>关注</text>
                  </button>

                  <button
                    @click="refDocShare.show"
                    class="btn btn-warning btn-round btn-size-small share-btn color-blue"
                  >
                    <text class="iconfont f36 mr12">&#xe6e0;</text>
                    <text>分享</text>
                  </button>
                </view>
              </view>

              <view class="p32c header-content">
                <view class="flex-normal">
                  <view class="doc-name mr24 f48 g-bold">
                    {{ docDetail.docName }}
                  </view>

                  <view class="color-444 f28 g-split-line mr12 pr12">
                    {{ docDetail.docTitleName }}
                  </view>
                  <view class="color-444 f28">
                    {{ docDetail.docJobName }}
                  </view>
                </view>

                <view class="flex-normal">
                  <view class="color-444 f28 g-split-line mr12 pr12">
                    浙江省人民医院
                  </view>
                  <view class="color-444 f28">
                    {{ docDetail.deptName }}
                  </view>
                </view>
              </view>

              <view class="flex-normal p32c doc-goodat">
                <image
                  :src="$global.BASE_IMG + 'v3_doctor_card_major.png'"
                  class="doc-major-goodat mr12"
                  mode="widthFix"
                />

                <view class="color-666 f28 doc-goodat-content text-ellipsis">
                  {{ docDetail.goodAt }}

                  <view
                    @click="regDialogConfirm.show"
                    class="doc-show-intro f26 color-blue"
                  >
                    <text>查看简介</text>
                    <text class="iconfont">&#xe66b;</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="f36 g-bold mb16">门诊排班</view>
        <view class="content-box">
          <view class="content-sel-date mb16">
            <Order-Sel-Date
              :value="checkedDay"
              :choose-days="chooseDays"
              :enable-days="chooseDaysEnabled"
            />
          </view>

          <text class="label-mark">
            <text class="color-fff f28 label-mark-content">到院就诊</text>
          </text>

          <view class="p32c mt12">
            <view class="f36 g-bold mb16">庆春院区</view>
          </view>

          <text class="label-mark mb8">
            <text class="color-fff f28 label-mark-content">网络就诊</text>
          </text>

          <view class="p32c mt12">
            <view class="f36 g-bold mb16">庆春院区</view>
          </view>
        </view>
      </view>

      <Order-Reg-Confirm title="医生简介" isHideFooter ref="regDialogConfirm">
        <Doc-Details :detail="docDetail" />
      </Order-Reg-Confirm>
    </scroll-view>
    <Doc-Share :pageProp="props" :detail="docDetail" ref="refDocShare" />

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { onLoad, onShareAppMessage } from '@dcloudio/uni-app';

  import { useOrder, IChooseDays } from './utils';
  import {
    UseDoctorDetail,
    type IProps,
    type IDocDetail,
  } from './utils/DoctorDetails';
  import { deQueryForUrl, joinQuery } from '@/common';
  import { previewImage } from '@/utils';

  import OrderSelDate from './components/orderSelDate/orderSelDate.vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import DocDetails from './components/DoctorDetails/docDetails.vue';
  import DocShare from './components/DoctorDetails/docShare.vue';

  /**
   * 医生名片分享:  后台新建普通链接二维码 https://h5.eheren.com/scan/${syscode}/DoctorDetails?${...props}
   */
  const props = ref({} as IProps);

  const refDocShare = ref<any>('');

  let useDoctorDetail = {} as UseDoctorDetail;

  const {
    chooseDays,
    checkedDay,
    chooseDaysEnabled,
    orderConfig,
    init: OrderInit,
  } = useOrder(props as any);
  const regDialogConfirm = ref<any>('');

  const docDetail = ref(<IDocDetail>{
    docName: props.value.docName,
    deptName: props.value.deptName,
  });
  // const docDetail = computed(() => useDoctorDetail.value.docDetail);

  const headerBg = computed(() => {
    return (
      docDetail.value.docPhoto || '/static/image/order/order-doctor-avatar.png'
    );
  });
  const previewImg = () => {
    const photo = docDetail.value.docPhoto;
    if (photo) {
      previewImage([photo]);
    }
  };

  onLoad(async (opt) => {
    props.value = deQueryForUrl(opt);
    // 扫码进来, 不处理
    if (props.value.q) {
      return;
    }

    useDoctorDetail = new UseDoctorDetail(props.value);
    init();

    setTimeout(() => {
      // regDialogConfirm.value.show();
      refDocShare.value.show();
    }, 1200);
  });

  const init = async () => {
    await OrderInit();
    useDoctorDetail.getDoctorDetail().then((r) => {
      docDetail.value = r;
    });

    useDoctorDetail.getDocSch();
  };

  onShareAppMessage((res) => {
    return {
      title: `${docDetail.value.docName}医生`,
      path: joinQuery('/pagesA/MyRegistration/DoctorDetails', props.value),
    };
  });
</script>

<style lang="scss" scoped>
  .header-bg {
    width: 100%;
    position: absolute;
    z-index: 1;
  }

  .content-box {
    // padding: 0 32rpx;
    background-color: #fff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
    border-radius: 8px;

    &.header-content-box {
      height: calc(100% - 500rpx);
    }

    .content-sel-date {
      padding: 8rpx 16rpx;
    }
  }

  .content {
    position: relative;
    z-index: 2;
    padding: 0 32rpx;
  }

  .header-box {
    margin-bottom: 56rpx;
    .header-transform {
      position: relative;

      transform: translateY(-50rpx);
    }

    .header {
      padding: 0 32rpx;
      position: relative;
      z-index: 2;
      align-items: flex-start;

      .doc-avatar {
        width: 136rpx;
        height: 136rpx;
        border-radius: 50%;
        overflow: hidden;
      }

      .header-btn {
        margin-top: 20rpx;
        button {
          &:not(:last-child) {
            margin-right: 16rpx;
          }
        }
      }
    }

    &::before {
      content: '';
      display: block;
      width: 100%;
      height: 88rpx;
      background-color: transparent;
    }

    .doc-goodat {
      align-items: flex-start;
      transform: translateY(24rpx);
      .doc-major-goodat {
        width: 60rpx;
        position: relative;
        top: 5rpx;
      }

      .doc-goodat-content {
        -webkit-line-clamp: 2;
        flex: 1;

        .doc-show-intro {
          position: absolute;
          right: 32rpx;
          bottom: 0;
          z-index: 2;
          display: flex;
          padding-left: 1.5em;
          align-items: center;
          justify-content: flex-end;
          background: linear-gradient(
            270deg,
            #fff 0,
            #fff 80%,
            rgba(255, 255, 255, 0.3) 100%
          );
        }
      }
    }
  }

  .share-btn {
    background-color: var(--hr-brand-color-3-light);
  }

  .label-mark {
    position: relative;
    left: -10rpx;

    .label-mark-content {
      padding: 7rpx 24rpx;
      border-radius: 8px 40px 40px 4px;
      background-color: #22c5ae;
    }

    &::after {
      content: '';
      display: block;
      width: 10rpx;
      height: 10rpx;
      position: relative;
      top: 5rpx;
      // #ifdef MP-ALIPAY
      top: 8rpx;
      //  #endif
      background: linear-gradient(
        -135deg,
        #108f7d,
        #108f7d 50%,
        transparent 50%,
        transparent 100%
      );
    }
  }
</style>
