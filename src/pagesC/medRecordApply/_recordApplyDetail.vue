<template>
  <view>
    <view
      v-if="Object.keys(info).length"
      :class="titleStatus.headerClass"
      class="reg-detail"
    >
      <scroll-view scroll-y class="scroll-container">
        <view class="box">
          <view class="reg-header flex-between">
            <view
              :style="{
                color: titleStatus.detailColor,
              }"
              class="flex-normal"
            >
              <view class="reg-header-label">
                <view class="title">{{ titleStatus.title }}</view>
                <view
                  :style="{
                    color: ['20', '21'].includes(info.orderStatus)
                      ? 'var(--hr-neutral-color-9)'
                      : '#fff',
                  }"
                  class="header-desc flex-normal"
                >
                  <view v-if="info.fee" class="mr24">
                    <text class="mr12">支付金额:</text>
                    <text>{{ info.fee }}元</text>
                  </view>

                  <view v-if="info.refundFee">
                    <text class="mr12">退还金额:</text>
                    <text class="mr12">{{ info.refundFee }}元</text>
                    <text
                      @click.stop="refRefConfirm.show"
                      class="iconfont refund-fee-icon"
                    >
                      &#xe6d6;
                    </text>
                  </view>
                </view>
              </view>
            </view>

            <view
              :class="{
                'hide-icon': ['20', '21'].includes(info.orderStatus),
              }"
              class="my-disabled"
            >
              <view
                v-if="['12', '15', '14'].includes(info.orderStatus)"
                class="iconfont reg-header-icon-bg"
              >
                &#xe6c6;
              </view>

              <view v-else class="iconfont reg-header-icon-bg">&#xe6d0;</view>
            </view>
          </view>

          <view class="container">
            <view v-if="expressInfo" class="container-box p32 mb32 g-border">
              <express-Step
                :pointEnd="_expressInfo.pointEnd"
                :pointNow="_expressInfo.pointNow"
              />
            </view>

            <view class="container-box p32 g-border">
              <block v-if="info._outInfo && info._outInfo.length">
                <view
                  v-for="(item, idx) in info._outInfo"
                  :key="idx"
                  :class="{
                    mb16: idx !== info._outInfo.length,
                  }"
                  class="container-card"
                >
                  <view
                    v-if="item.outTime"
                    class="container-card-header up-lv flex-normal g-border-bottom"
                  >
                    <view class="iconfont container-card-header-icon mr12">
                      &#xe6f3;
                    </view>

                    <view>
                      <text>{{ formatterTime(item.admissionTime) }}</text>
                      <text class="timer-split">至</text>
                      <text>{{ formatterTime(item.outTime) }}</text>
                    </view>
                  </view>

                  <view v-if="item.isOneself === '0'" class="card-self-logo">
                    <view class="_card-self-logo g-flex-rc-cc">
                      <view>手动</view>
                      <view>添加</view>
                    </view>
                  </view>

                  <view
                    v-if="item.visitNo"
                    class="container-card-row flex-normal mt16"
                  >
                    <view class="label">住院号</view>

                    <view class="content">{{ item.visitNo }}</view>
                  </view>

                  <view
                    v-if="item.diagnosis"
                    class="container-card-row flex-normal"
                  >
                    <view class="label">诊断</view>

                    <view class="content">
                      {{ item.diagnosis.join('、') }}
                    </view>
                  </view>

                  <view
                    v-if="item.attendingDoctor"
                    class="container-card-row flex-normal"
                  >
                    <view class="label">医生</view>

                    <view class="content">
                      {{ item.hosName + item.attendingDoctor }}
                    </view>
                  </view>

                  <view
                    v-if="item.deptName"
                    class="container-card-row flex-normal"
                  >
                    <view class="label">病区科室</view>

                    <view class="content">
                      {{ item.deptName }}
                    </view>
                  </view>
                </view>
              </block>

              <view v-if="info.copyAim" class="mt32 _row">
                <view class="_title">复印目的</view>
                <view class="_content">
                  {{ info.copyAim }}
                </view>
              </view>

              <view v-if="info.remark" class="mt16 _row">
                <view class="_title">备注内容</view>
                <view class="_content">{{ info.remark }}</view>
              </view>
            </view>

            <view
              v-if="info.addresseeAddress.value"
              class="container-box order-patient g-border p32"
            >
              <view class="_row">
                <view class="_content">
                  {{ patientAddress }}
                </view>
              </view>
              <view class="_row mt16">
                <view class="_title w100 _name">
                  <text class="mr12">{{ info.addresseeName.value }}</text>
                  <text>{{ info.addresseePhone.value }}</text>
                </view>
              </view>
            </view>

            <view class="container-box order-patient g-border">
              <g-flag typeFg="506" isShowFgTip />
            </view>
          </view>
        </view>
      </scroll-view>

      <view class="footer g-border-top">
        <button class="btn g-border btn-primary">再次申请</button>
        <button
          v-if="['11', '15'].includes(info.orderStatus)"
          class="btn g-border btn-plain btn-error"
        >
          取消申请
        </button>
      </view>

      <order-Reg-Confirm title="退还金额说明" height="auto" ref="refRefConfirm">
        <template #default>
          <view class="mb76 dialog-content">退还金额已原路返回，请查收。</view>
        </template>

        <template #footer>
          <button
            @click="refRefConfirm.hide"
            class="btn g-border btn-primary dialog-btn"
          >
            我知道了
          </button>
        </template>
      </order-Reg-Confirm>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';
  import { GStores, ServerStaticData, IHosInfo } from '@/utils';
  import api from '@/service/api';
  import {
    CaseCopyItem,
    applyOrderStatusMap,
    CaseCopeItemDetail,
    isExpress1,
  } from './utils/recordApply';

  import orderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import expressStep from './components/expressStep.vue';
  import dayjs from 'dayjs';

  const props = defineProps<{
    phsOrderNo: string;
  }>();
  const gStores = new GStores();

  const info = ref<CaseCopeItemDetail>({} as CaseCopeItemDetail);
  const expressInfo = ref<{
    // pointEnd: {
    //   title: string;
    //   desc: string;
    // };

    pointNow: {
      title: string;
      desc: string;
      date: string;
    };
  }>();
  const refRefConfirm = ref<any>('');
  const titleStatus = computed(() => {
    const statusInfo = applyOrderStatusMap[info.value.orderStatus];

    return (
      statusInfo || {
        title: '未知的状态',
        headerClass: 'header-yellow',
        color: 'var(--hr-error-color-6)',
        detailColor: '#fff',
        descColor: '',
      }
    );
  });

  const patientAddress = computed(() => {
    if (Object.keys(info.value).length) {
      return `${info.value.addresseeAddress.value}${info.value.detailedAddress.value}`;
    } else {
      return '';
    }
  });

  const _expressInfo = computed(() => {
    return {
      pointNow: expressInfo.value?.pointNow,
      pointEnd: {
        title: patientAddress.value,
        desc: `${info.value.addresseeName?.value} ${info.value.addresseePhone?.value}`,
      },
    };
  });

  const getData = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const arg = {
      phsOrderNo: props.phsOrderNo,
      patientId,
    };

    const { result } = await api.getCaseCopyDetail<CaseCopeItemDetail>(arg);

    const { outInfo, expressParam } = result;
    // result.orderStatus = '21';
    // result.refundFee = '21';
    if (outInfo) {
      try {
        result._outInfo = JSON.parse(outInfo);
      } catch (error) {
        gStores.messageStore.showMessage('outInfo 字段格式错误', 1500);
      }
    }

    if (expressParam) {
      try {
        result._expressParam = JSON.parse(expressParam);
      } catch (error) {
        gStores.messageStore.showMessage('expressParam 字段格式错误', 1500);
      }
    }

    if (result._expressParam) {
      // 邮政
      if (isExpress1(result._expressParam)) {
        const _date = dayjs(result._expressParam.opTime).format('MM-DD');

        let _title = result._expressParam.opName;

        if (['妥投', '试投'].includes(_title)) {
          _title = '派送中';
        }

        expressInfo.value = {
          pointNow: {
            title: _title,
            date: _date,
            desc: result._expressParam.opDesc,
          },
        };
      } else {
        // 顺丰
        const opCodeMap = {
          44: '派送中',
          50: '已收寄',
          80: '已签收',
          125: '待取件',
          31: '运输中',
          70: '派送中',
        };

        const _title = opCodeMap[result._expressParam.opcode] || '未知的状态';

        expressInfo.value = {
          pointNow: {
            title: _title,
            date: result._expressParam.accept_date,
            desc: result._expressParam.remark,
          },
        };
      }
    }

    info.value = result;
  };

  const formatterTime = (time: string) => dayjs(time).format('YYYY-MM-DD');

  const init = () => {
    getData();
  };

  init();
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
          height: 150rpx;
          .title {
            font-weight: 600;
          }

          .header-desc {
            font-size: var(--hr-font-size-xs);
            white-space: nowrap;
            position: absolute;
            // #ifdef  MP-ALIPAY
            transform: translateY(5rpx);
            // #endif

            .refund-fee-icon {
              font-size: var(--hr-font-size-xl);
              position: absolute;
              // #ifdef  MP-ALIPAY
              transform: translateY(-5rpx);
              // #endif
            }
          }
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
        transform: translateY(-60rpx);
        // #ifdef  MP-WEIXIN
        transform: translateY(-50rpx);
        // #endif

        // &::before {
        //   content: '';
        //   display: block;
        //   height: 40rpx;
        //   margin: 0 12rpx;
        //   background-color: rgba(0, 0, 0, 0.2);
        //   border-radius: 60rpx;
        // }
      }

      .container-box {
        background-color: #fff;
        // box-shadow: inset 0 18rpx 5px rgba(0, 0, 0, 0.07);
        margin: 0 32rpx;
        transform: translateY(-20rpx);
        border-radius: 8px;
      }

      .order-patient {
        box-shadow: none;
        margin-top: 32rpx;
        border-radius: 8px;
      }
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

      .btn {
        flex: 1;
      }
    }

    .container-card {
      background-color: var(--hr-neutral-color-1);
      border-radius: 4px;
      padding: 32rpx;
      padding-top: 24rpx;
      overflow: hidden;
      position: relative;

      .card-self-logo {
        color: #e9e9e9;
        font-size: var(--hr-font-size-xxl);
        border: solid 10rpx;
        display: inline-block;
        position: absolute;
        right: -10rpx;
        top: -10rpx;
        z-index: 1;
        pointer-events: none;

        transform: rotate(25deg);

        border-radius: 900rpx;
        ._card-self-logo {
          border-radius: 900rpx;
          padding: 24rpx;
          border: solid 2rpx;

          margin: 10rpx;
          flex-direction: column;

          > view {
            line-height: calc(var(--hr-font-size-xxl));
          }
        }
      }

      .container-card-header {
        font-size: var(--hr-font-size-base);
        font-weight: 600;
        padding-bottom: 16rpx;
        &-icon {
          color: #43d5c0;
          font-size: var(--hr-font-size-xl);
          font-weight: normal;
        }

        .timer-split {
          margin: 0 12rpx;
        }
      }

      .container-card-row {
        @extend .up-lv;
        font-size: var(--hr-font-size-xs);
        margin-top: 8rpx;

        .label {
          width: 120rpx;
          color: var(--hr-neutral-color-7);
        }

        .content {
          flex: 1;
        }
      }
    }
  }

  .mr24 {
    margin-right: 24rpx;
  }

  .mr12 {
    margin-right: 12rpx;
  }

  .mt16 {
    margin-top: 16rpx;
  }

  .mb76 {
    margin-bottom: 76rpx;
  }

  .mt32 {
    margin-top: 32rpx;
  }

  .up-lv {
    position: relative;
    z-index: 3;
  }

  ._row {
    display: flex;
    font-size: var(--hr-font-size-base);

    ._title {
      color: var(--hr-neutral-color-7);
      width: 140rpx;
    }

    ._content {
      flex: 1;
      word-break: break-all;
      font-weight: 600;
    }
  }

  .w100 {
    width: 100% !important;
  }

  ._name {
    font-size: var(--hr-font-size-xs);
  }

  .dialog-btn {
    margin: 0 32rpx;
    width: calc(100% - 64rpx);
  }

  .dialog-content {
    color: var(--hr-neutral-color-9);
  }
</style>
