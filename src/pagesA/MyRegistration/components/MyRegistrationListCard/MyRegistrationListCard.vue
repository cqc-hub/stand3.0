<template>
  <view
    :class="{
      'system-mode-old': systemModeOld,
    }"
    class="card"
  >
    <view
      v-for="(item, idx) in list"
      :key="item.orderId"
      :class="{
        mt24: !idx,
      }"
      class="item mb16 g-border"
    >
      <view class="flex-between pb18 mb16 g-bold f36">
        <view class="text-ellipsis mr40 flex1">
          {{ item.deptName }}
        </view>
        <view
          :style="{
            color: getStatusConfig(item.orderStatus, isWaitReg).cardColor,
          }"
          class="text-no-wrap f32"
        >
          {{ item._statusLabel }}
        </view>
      </view>

      <view @click="goDetail(item)" class="content">
        <view v-if="item.patientNameEncry" class="row f28">
          <view class="label text-no-wrap color-888">就诊人</view>
          <view class="body flex-between">
            <text>
              {{ item.patientName }}
              {{ item.cardNumber && `(${item.cardNumber})` }}
            </text>
            <text v-if="item.regWay">{{ item.regWay }}</text>
          </view>
        </view>

        <view class="row f28">
          <view class="label color-888">时间</view>
          <view class="body">
            <text class="mr12">{{ item.appointmentDate }}</text>
            <text class="mr12">{{ item.ampmName }}</text>
            <text class="mr12">{{ item.appointmentTime }}</text>
            <view class="flex-normal text-no-wrap">
              <text v-if="item.appointmentNumber" class="text-no-wrap">
                第
                <text class="color-blue">{{ item.appointmentNumber }}</text>
                号
              </text>
            </view>
          </view>
        </view>

        <view class="row f28 mb10">
          <view class="label color-888">医生</view>
          <view class="body">
            <text v-if="item.docName" class="pr12 mr12 doc-name">
              {{ item.docName }}
            </text>
            <text
              v-if="item.schQukCategor || item.categorName"
              class="pr12 mr12 doc-name"
            >
              {{ item.schQukCategor || item.categorName }}
            </text>
            <text>{{ item.hosName }}</text>
          </view>
        </view>
      </view>

      <view v-if="isShowFooter(item)" class="footer flex-between btn-normal">
        <view class="f36 color-error g-bold">
          <!-- {{ item.fee }}元 -->
        </view>

        <view class="flex-normal footer-btns">
          <button
            v-if="isShowYWZBtn(item)"
            @click="goYWZ(item)"
            class="btn btn-round btn-size-small btn-border cancel-btn"
          >
            预问诊
          </button>

          <button
            v-if="isShowReOrderBtn(item)"
            @click="goDoctorCard(item)"
            class="btn btn-round btn-size-small btn-border cancel-btn"
          >
            复诊预约
          </button>

          <button
            v-if="isCancelOrder(item)"
            class="btn btn-round btn-size-small btn-border cancel-btn"
          >
            取消预约
          </button>

          <button
            v-if="isShowPaiDui(item)"
            class="btn btn-round btn-size-small btn-border cancel-btn"
          >
            排队叫号
          </button>

          <button
            v-if="isPayOrder(item)"
            class="btn btn-round btn-size-small btn-warning"
          >
            去支付
          </button>

          <button
            v-if="isFW(item)"
            @click="goComment(item)"
            class="btn btn-round btn-size-small btn-border cancel-btn"
          >
            服务评价
          </button>
          <button
            v-if="isNav(item)"
            @click="goHosNavigate(item)"
            class="btn btn-round btn-size-small btn-border cancel-btn"
          >
            院内导航
          </button>

          <block v-for="btn in getCustomBtns" :key="btn.text">
            <!-- useTBanner(btn, 'navigateTo', item) -->

            <button
              v-if="isShowCustomBtn(item, btn)"
              @click="customBtnClick(btn, item)"
              class="btn btn-round btn-size-small btn-border cancel-btn"
            >
              {{ btn.text }}
            </button>
          </block>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { IRegistrationCardItem } from '../../utils/MyRegistration';
  import {
    getStatusConfig,
    IRegInfo,
    goAskForDoc1001048,
  } from '../../utils/regDetail';
  import { joinQueryForUrl, joinQuery } from '@/common';
  import { GStores, ISystemConfig, useTBanner } from '@/utils';

  import globalGl from '@/config/global';
  import api from '@/service/api';

  const gStores = new GStores();
  const props = defineProps<{
    list: IRegistrationCardItem[];
    showYuanNeiDaoHanBtn: string[];
    showPaiDuiJiaoHaoBtn: string[];
    isWaitReg: boolean;
    showReOrderBtn: boolean;
    isShowYuWzBtn: boolean;
    anotherYwzConditions: boolean;
    showFWBtn: string[];
    systemModeOld?: boolean;
    thRegisterId?: string;
    config: ISystemConfig['order'];
  }>();
  const emits = defineEmits(['ywz-click', 'go-detail', 'go-hos-navigate']);

  const getCustomBtns = computed(() => {
    const list = [...(props.config.regListItemCustomButtons || [])];
    if (gStores.globalStore.sysCode === '1001048') {
      list.push({
        text: '预问诊',
        type: 'h5',
        path: 'ywz1001048',
        orderStatus: ['101']
      });
    }

    return list.filter(({ env }) => {
      if (env) {
        let _env: (typeof env)[number] = 'wx';
        // #ifdef MP-ALIPAY
        _env = 'alipay';
        // #endif

        // #ifdef H5
        _env = 'h5';
        // #endif

        return env.includes(_env);
      } else {
        return true;
      }
    });
  });

  const customBtnClick = (
    btn: (typeof props.config.regListItemCustomButtons)[number],
    item: IRegistrationCardItem
  ) => {
    if (btn.path === 'ywz1001048') {
      goAskForDoc1001048(item);
    } else {
      useTBanner(btn, 'navigateTo', item);
    }
  };

  const isShowCustomBtn = (
    item: IRegistrationCardItem,
    config: ISystemConfig['order']['regListItemCustomButtons'][number]
  ) => {
    const { orderStatus } = item;
    const { orderStatus: _orderStatus } = config;

    if (_orderStatus) {
      return _orderStatus.includes(orderStatus);
    }

    return true;
  };

  // 显示到院导航
  const isShowDaohan = (item: IRegistrationCardItem) => {
    return props.showYuanNeiDaoHanBtn.includes(item.orderStatus);
  };

  // 显示排队叫号
  const isShowPaiDui = (item: IRegistrationCardItem) => {
    return false;

    // return props.showPaiDuiJiaoHaoBtn.includes(item.orderStatus);
  };

  // 显示服务评价
  const isFW = (item: IRegistrationCardItem) => {
    // return false;

    return props.showFWBtn.includes(item.orderStatus) && item.orderId;
  };

  // 显示取消预约
  const isCancelOrder = (item: IRegistrationCardItem) => {
    return false;

    // return ['0'].includes(item.orderStatus);
  };

  // 显示支付
  const isPayOrder = (item: IRegistrationCardItem) => {
    // return ['10'].includes(item.orderStatus);
    return false;
  };

  const isShowReOrderBtn = (item: IRegistrationCardItem) => {
    return ['70', '82'].includes(item.orderStatus) && props.showReOrderBtn;
  };

  //显示多院区院内导航(仅绍兴)
  const isNav = (item: IRegistrationCardItem) => {
    // #ifdef  MP-WEIXIN
    return globalGl.SYS_CODE === '1001046';
    // #endif
    // #ifdef  MP-ALIPAY
    // return globalGl.SYS_CODE === '1001046' && item.hosId === '13178';
    // #endif
    return false;
  };

  // 最新消息 (濮阳) 仅 "全部挂号" 开放
  const isShowYWZBtn = (item: IRegistrationCardItem) => {
    const showYwzByOrderStauts = props.config.showYwzByOrderStauts;
    const showStatus = showYwzByOrderStauts ? showYwzByOrderStauts : ['0'];
    return (
      showStatus.includes(item.orderStatus) &&
      props.isShowYuWzBtn &&
      (item.orderId || item.hosOrderId) &&
      props.anotherYwzConditions
    );
  };

  const isShowFooter = (item: IRegistrationCardItem) => {
    return (
      isShowDaohan(item) ||
      isShowPaiDui(item) ||
      isFW(item) ||
      isCancelOrder(item) ||
      isPayOrder(item) ||
      isShowReOrderBtn(item) ||
      isShowYWZBtn(item) ||
      isNav(item) ||
      (!props.isWaitReg &&
        getCustomBtns.value.some((o) => isShowCustomBtn(item, o)))
    );
  };

  // ! 组件内部应该仅做交互, 数据展示 具体的动作行为应该事件抛出到外部处理
  const goComment = async (item: IRegistrationCardItem) => {
    const { orderId } = item;

    const { result } = await api.getRegOrderInfo<IRegInfo>({
      orderId,
    });

    const {
      deptName,
      docName,
      hosDocId,
      hosId,
      hosDeptId,
      rateFlag,
      appointmentDate,
    } = result;

    const query = {
      orderId,
      deptName,
      docName,
      hosDocId,
      hosId,
      hosDeptId,
      rateFlag,
      appointmentDate,
    };

    let url = '/pagesA/MyRegistration/RegComment';

    if (rateFlag == 0) {
      url = '/pagesA/MyRegistration/RegCommentRes';
    }

    uni.navigateTo({
      url: joinQuery(url, query),
    });
  };

  // ! 组件内部应该仅做交互, 数据展示 具体的动作行为应该事件抛出到外部处理
  const goDoctorCard = (item: IRegistrationCardItem) => {
    const { deptName, docName, hosDocId, hosId, clinicalType, hosDeptId } =
      item;

    uni.navigateTo({
      url: joinQuery('/pagesA/MyRegistration/DoctorDetails', {
        deptName,
        docName,
        hosDocId,
        hosId,
        clinicalType,
        hosDeptId,
      }),
    });
  };

  // ! 组件内部应该仅做交互, 数据展示 具体的动作行为应该事件抛出到外部处理
  const goYWZ = (item: IRegistrationCardItem) => {
    emits('ywz-click', item);
  };

  const goDetail = (item: IRegistrationCardItem) => {
    emits('go-detail', item);
  };

  const goHosNavigate = (item: IRegistrationCardItem) => {
    emits('go-hos-navigate', item);
  };
</script>

<style lang="scss" scoped>
  .card {
    .item {
      background-color: #fff;
      padding: 20rpx 32rpx;
      border-radius: 8px;

      .header {
        display: grid;
        grid-template-columns: 1fr 120rpx;
        gap: 40rpx;
        margin-bottom: 16rpx;
        border-bottom: 1rpx solid var(--hr-neutral-color-2);
      }

      .content {
        .row {
          display: flex;
          margin-bottom: 4rpx;

          .label {
            width: 100rpx;
          }

          .body {
            flex: 1;
            word-break: break-all;

            .doc-name {
              position: relative;

              &::after {
                content: '';
                display: inline-block;
                width: 1rpx;
                height: 24rpx;
                background-color: var(--hr-neutral-color-2);
                right: 0;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
              }
            }
          }

          // &:last-child {
          //   padding-bottom: 32rpx;
          //   border-bottom: 1rpx solid var(--hr-neutral-color-11);
          // }
        }
      }

      .footer {
        margin-top: 26rpx;
        align-items: center;

        padding-top: 26rpx;
        border-top: 1rpx solid var(--hr-neutral-color-11);

        .footer-btns {
          button {
            white-space: nowrap;

            &:not(:last-child) {
              margin-right: 16rpx;
            }
          }
        }

        .cancel-btn {
          background-color: #fff;
          color: var(--hr-neutral-color-10);
        }
      }
    }
  }

  .system-mode-old {
    .item {
      .content {
        .row {
          .label {
            width: 140rpx;
          }
        }
      }
    }
  }
</style>
