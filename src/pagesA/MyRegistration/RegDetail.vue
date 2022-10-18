<template>
  <view :class="titleStatus.headerClass" class="reg-detail">
    <scroll-view scroll-y class="scroll-container">
      <view v-if="orderRegInfo.patientId" class="box">
        <view class="reg-header flex-between">
          <view
            :style="{
              color: titleStatus.color,
            }"
            class="flex-normal"
          >
            <view
              v-if="titleStatus.headerIcon.includes('#xe6ea')"
              class="iconfont reg-header-icon"
            >
              &#xe6ea;
            </view>

            <view
              v-else-if="titleStatus.headerIcon.includes('#xe6c7')"
              class="iconfont reg-header-icon"
            >
              &#xe6c7;
            </view>

            <view
              v-else-if="titleStatus.headerIcon.includes('#xe6d5')"
              class="iconfont reg-header-icon"
            >
              &#xe6d5;
            </view>

            <view class="reg-header-label">{{ titleStatus.title }}</view>
          </view>

          <view
            :class="{
              'hide-icon': !titleStatus.headerBgIcon,
            }"
          >
            <view
              v-if="titleStatus.headerBgIcon.includes('#xe6d0')"
              class="iconfont reg-header-icon-bg"
            >
              &#xe6d0;
            </view>

            <view
              v-else-if="titleStatus.headerBgIcon.includes('#xe6de')"
              class="iconfont reg-header-icon-bg"
            >
              &#xe6de;
            </view>

            <view
              v-else-if="titleStatus.headerBgIcon.includes('#xe6d5')"
              class="iconfont reg-header-icon-bg"
            >
              &#xe6d5;
            </view>

            <view v-else class="iconfont reg-header-icon-bg">&#xe6c7;</view>
          </view>
        </view>

        <view class="container">
          <view class="container-box g-border">
            <view
              v-if="isShowQr"
              class="qr-code g-flex-rc-cc g-border-bottom m32"
            >
              <w-qrcode :options="_qrCodeOpt" />

              <w-barcode :options="_qrCodeOpt" />

              <view class="qr-code-value">{{ orderRegInfo.patientId }}</view>

              <view @click="showQrCode = !showQrCode" class="qr-code-toggle">
                <text
                  :class="{
                    'icon-reverse': showQrCode,
                  }"
                  class="iconfont qr-toggle-icon"
                >
                  &#xe6f9;
                </text>
                <text>点击切换{{ (showQrCode && '条形码') || '二维码' }}</text>
              </view>
            </view>

            <view
              v-if="hosInfo.gisLat"
              @click="openHosLocation"
              class="hos-navigation g-flex-rc-cc m32"
            >
              <view class="hos-info">
                <text class="text-ellipsis hos-name">
                  {{ hosInfo.hosName }}
                </text>
                <text class="text-ellipsis hos-address">
                  {{ hosInfo.address }}
                </text>
              </view>
            </view>
            <view class="order-info p32v">
              <g-form
                :value="orderRegInfo"
                forShowBodyAlign="left"
                bodyBold
                hideRowBorder
                ref="refForm"
              >
                <template #showBody="{ item, value }">
                  <view
                    class="flex-normal color-blue"
                    v-if="item.key === 'deptName'"
                  >
                    <text>{{ value }}</text>
                    <text class="ico_location2 icon-font size-icon"></text>
                  </view>

                  <view
                    v-else-if="item.key === 'docName'"
                    class="color-blue flex-normal doc-name"
                  >
                    <view class="g-border-right doc-name-value">
                      {{ value }}
                    </view>

                    <view>
                      {{
                        orderRegInfo.schQukCategor || orderRegInfo.categorName
                      }}
                    </view>

                    <view class="iconfont color-blue">&#xe6c8;</view>
                  </view>
                  <view v-else>{{ value }}</view>
                </template>
              </g-form>
            </view>
          </view>

          <view class="container-box order-patient g-border p32v">
            <g-form
              :value="orderRegInfo"
              forShowBodyAlign="left"
              bodyBold
              hideRowBorder
              ref="refFormPatient"
            />
          </view>

          <view class="container-box order-patient g-border">
            <g-flag typeFg="4" isShowFgTip />
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 取消、退号 是两个概念 退号要退钱， 取消是取消锁号-->
    <view
      v-if="orderRegInfo.patientId && isShowFooter"
      class="footer g-border-top"
    >
      <view @click="goHome" class="home g-flex-rc-cc">
        <view class="iconfont home-icon">&#xe6df;</view>
        <view>首页</view>
      </view>
      <button
        v-if="orderRegInfo.orderStatus === '0'"
        @click="cancelOrder"
        class="btn btn-plain btn-error g-border"
      >
        {{ orderConfig.isOrderPay === '1' ? '退号' : '取消预约' }}
      </button>

      <block v-if="orderRegInfo.orderStatus === '70'">
        <button class="btn g-border btn-normal">再次预约</button>
        <button class="btn g-border btn-primary">服务评价</button>
      </block>

      <block v-if="orderRegInfo.orderStatus === '10'">
        <button class="btn g-border btn-normal">取消订单</button>
        <button class="btn btn-warning pay-btn">
          {{ orderRegInfo.fee }}元 立即支付
        </button>
      </block>

      <button
        v-if="orderRegInfo.orderStatus === '45'"
        class="btn g-border btn-primary"
      >
        再次预约
      </button>

      <button
        v-if="orderRegInfo.orderStatus === '23'"
        class="btn g-border btn-primary"
      >
        再次预约
      </button>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref, nextTick, onMounted, reactive } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { deQueryForUrl, joinQueryForUrl } from '@/common/utils';
  import {
    GStores,
    ServerStaticData,
    IHosInfo,
    openLocation,
    ISystemConfig,
  } from '@/utils';

  import {
    IPageProps,
    IRegInfo,
    regInfoTempList,
    patientTempList,
    orderStatusMap,
  } from './utils/regDetail';
  import api from '@/service/api';

  // api.getRegOrderInfo = () =>
  //   Promise.resolve({
  //     result: {
  //       sysCode: '1001033',
  //       deptName: '眼科',
  //       hosGisLng: 121.264666,
  //       ampm: '1',
  //       orderId: '2210130519500014',
  //       patientId: '5229890130',
  //       numId: '2022102932020060500000000004513',
  //       hosDeptId: '10206000',
  //       idCard: '3303**********6713',
  //       fee: 12,
  //       ampmName: '上午',
  //       hisResult: '',
  //       orderStatus: '0',
  //       source: 19,
  //       upIdCard: '',
  //       schId: '20200605000000000045',
  //       visitingArea: '',
  //       docName: '林优',
  //       categorName: '普通',
  //       appointmentTime: '08:00',
  //       clinicalType: '1',
  //       hosName: '台州第一人民医院',
  //       patientName: '陈钦川',
  //       cardType: '19',
  //       appointmentNumber: '3',
  //       hosId: '1279',
  //       herenId: 4276138,
  //       patientPhone: '138****9891',
  //       filing: '',
  //       hosOrderId: '2022102000000003',
  //       createTime: '2022-10-13T01:26:35.000+0000',
  //       categor: '2',
  //       hosDocId: '0000003060',
  //       hosGisLat: 28.643927,
  //       appointmentDate: '2022-10-20',
  //       cardNumber: '10830963',
  //       schQukCategor: '眼科林优[普]',
  //     },
  //     timeTaken: 31,
  //     code: 0,
  //     innerMessage: '成功',
  //     message: '成功',
  //     respCode: 0,
  //   });

  const orderConfig = ref<ISystemConfig['order']>({} as ISystemConfig['order']);
  const refForm = ref<any>('');
  const refFormPatient = ref<any>('');
  const pageProps = ref<IPageProps>({} as IPageProps);
  const gStores = new GStores();
  const showQrCode = ref(false);
  const orderRegInfo = ref<IRegInfo>({} as IRegInfo);
  const hosInfo = ref<IHosInfo>({} as IHosInfo);
  const isShowQr = computed(() => {
    return ['0', '10', '100', '70', '75'].includes(
      orderRegInfo.value.orderStatus
    );
  });
  const isShowFooter = computed(() =>
    ['23', '45', '10', '70', '0'].includes(orderRegInfo.value.orderStatus)
  );

  const qrCodeOpt = computed(() => {
    return {
      // 二维码
      size: 350,

      // 条形码
      width: 600, // 宽度 单位rpx
      height: 184, // 高度 单位rpx
      code: orderRegInfo.value.patientId,
    };
  });

  const _qrCodeOpt = computed(() => {
    if (showQrCode.value) {
      return {
        ...qrCodeOpt.value,
        height: 0,
      };
    } else {
      return {
        ...qrCodeOpt.value,
        size: 0,
      };
    }
  });

  const titleStatus = computed(() => {
    const statusInfo = orderStatusMap[orderRegInfo.value.orderStatus];

    return (
      statusInfo || {
        title: '未知的状态',
        headerClass: '',
        color: 'var(--hr-error-color-6)',
        headerBgIcon: '',
        headerIcon: '&#xe6d5;',
      }
    );
  });

  const init = async () => {
    const orderId = pageProps.value.orderId;

    orderConfig.value = await ServerStaticData.getSystemConfig('order');
    const { result } = await api.getRegOrderInfo<IRegInfo>({
      orderId,
      source: gStores.globalStore.browser.source,
    });

    const hosList = await ServerStaticData.getHosList();
    const hos = hosList.find((o) => o.hosId === result.hosId);
    if (hos) {
      hosInfo.value = hos;
    }

    result._appointmentDate = `${result.appointmentDate} ${
      result.ampmName + result.appointmentTime
    }`;
    result._fee = result.fee + '元';
    orderRegInfo.value = result;
    // orderRegInfo.value.orderStatus = '23';

    setTimeout(() => {
      refForm.value.setList(regInfoTempList);
      refFormPatient.value.setList(patientTempList);
    }, 300);
  };

  const openHosLocation = () => {
    const { gisLat, gisLng, hosName, address } = hosInfo.value;

    openLocation([gisLat!, gisLng!], {
      name: hosName,
      address,
    });
  };

  const goHome = () => {
    uni.reLaunch({
      url: '/pages/home/home',
    });
  };

  const cancelOrder = () => {
    uni.reLaunch({
      url: '/aaa',
    });
  };

  onLoad((p) => {
    pageProps.value = deQueryForUrl<IPageProps>(deQueryForUrl(p));
  });

  // 执行时机比 onLoad 晚
  onMounted(() => {
    init();
  });
</script>

<style lang="scss" scoped>
  .reg-detail {
    height: 100vh;
    display: flex;
    flex-direction: column;

    .scroll-container {
      flex: 1;
      height: 1px;
      overflow-y: scroll;
      position: reactive;
      z-index: 2;
    }

    &::after {
      content: '';
      display: block;
      height: 400rpx;

      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    &.header-blue {
      &::after {
        background: linear-gradient(
          0deg,
          rgba(41, 111, 255, 0) 1%,
          #296fff 38%,
          #296fff 96%
        );
      }
    }

    &.header-green {
      &::after {
        background: linear-gradient(
          0deg,
          rgba(0, 179, 158, 0) 1%,
          #00b39e 38%,
          #00b39e 96%
        );
      }
    }

    &.header-yellow {
      &::after {
        background: linear-gradient(
          0deg,
          rgba(253, 231, 191, 0) 1%,
          #fde7bf 38%,
          #fde7bf 96%
        );
      }
    }

    &.header-dark {
      &::after {
        background: linear-gradient(
          0deg,
          rgba(106, 125, 165, 0) 1%,
          #6a7da5 38%,
          #6a7da5 96%
        );
      }
    }

    .box {
      position: relative;
      z-index: 2;

      .reg-header {
        padding: 0 32rpx;

        font-size: var(--hr-font-size-xxl);
        display: flex;
        align-items: center;
        color: #fff;
        .reg-header-label {
          font-weight: 600;
        }

        .reg-header-icon {
          font-size: 60rpx;
          margin-right: 16rpx;
        }

        .reg-header-icon-bg {
          // opacity: 0;
          font-size: 200rpx;
          right: 0;

          mask: linear-gradient(180deg, #ffffff35, rgba(255, 255, 255, 0));
        }
      }

      .container {
        transform: translateY(-80rpx);
        // #ifdef  MP-WEIXIN
        transform: translateY(-70rpx);
        // #endif

        &::before {
          content: '';
          display: block;
          height: 40rpx;
          margin: 0 12rpx;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 60rpx;
        }
      }

      .container-box {
        background-color: #fff;
        box-shadow: inset 0 18rpx 5px rgba(0, 0, 0, 0.07);
        margin: 0 32rpx;
        transform: translateY(-20rpx);
        border-radius: 0px 0px 8px 8px;

        .qr-code {
          flex-direction: column;
          font-size: var(--hr-font-size-xs);
          margin-top: 40rpx;
          .qr-code-value {
            font-size: var(--hr-font-size-xs);
            color: var(--hr-neutral-color-7);
            margin-top: 16rpx;
          }

          .qr-code-toggle {
            margin-top: 24rpx;
            margin-bottom: 40rpx;
            display: flex;
            align-items: center;

            .qr-toggle-icon {
              transition: all 0.4s;
              color: var(--hr-neutral-color-9);
              font-size: var(--hr-font-size-xxl);
              display: inline-block;
              &.icon-reverse {
                transform-origin: center center;
                transform: rotate(0.5turn);
              }
            }
          }
        }

        .hos-navigation {
          background: url($base-url + 'reg-detail-position-bg.png') 100%/100%
            no-repeat;
          height: 144rpx;
          justify-content: flex-start;
          padding-left: 32rpx;
          margin-top: 40rpx;

          .hos-info {
            max-width: 70%;
            display: flex;
            flex-direction: column;

            .hos-name {
              font-weight: 600;
            }

            .hos-address {
              color: var(--hr-neutral-color-8);
              font-size: var(--hr-font-size-xxxs);
              margin-top: 10rpx;
            }
          }
        }

        .order-info {
          margin-top: 32rpx;

          .doc-name {
            .doc-name-value {
              padding-right: 12rpx;
              margin-right: 12rpx;
            }

            .iconfont {
              font-size: var(--hr-font-size-xl);
              font-size: 400;
              margin-left: 12rpx;
            }
          }

          .color-blue {
            color: var(--hr-brand-color-6);
          }
          .size-icon {
            width: 50rpx;
            height: 40rpx;
            display: inline-block;
            margin-left: 12rpx;
          }
        }
      }

      .order-patient {
        box-shadow: none;
        margin-top: 32rpx;
        border-radius: 8px;
      }
    }

    .p32 {
      padding: 32rpx;
    }
    .p32v {
      padding-top: 32rpx;
      padding-bottom: 32rpx;
    }
    .m32 {
      margin: 32rpx;
    }

    .hide-icon {
      opacity: 0;
    }

    .footer {
      background-color: var(--h-color-white);
      padding: 24rpx 32rpx 48rpx;
      position: reactive;
      z-index: 1;
      gap: 18rpx;

      display: flex;

      .home {
        font-size: var(--hr-font-size-xxxs);
        flex-direction: column;
        margin-right: 10rpx;

        .home-icon {
          font-size: var(--hr-font-size-xxl);
        }
      }

      .btn {
        flex: 1;
      }

      .pay-btn {
        flex: 2;
      }
    }
  }
</style>
