<template>
  <view :class="{
    'system-mode-old': systemModeOld,
  }" class="card">
    <view v-for="(item, idx) in list" :key="item.orderId" :class="{
      mt24: !idx,
    }" class="item mb16 g-border">
      <view class="header pb18 g-bold f36">
        <view class="text-ellipsis">
          {{ item.deptName }}
        </view>
        <view :style="{
          color: getStatusConfig(item.orderStatus).cardColr,
        }" class="text-no-wrap f32">
          {{ item._statusLabel }}
        </view>
      </view>

      <view @click="goDetail(item)" class="content">
        <view class="row f28">
          <view class="label text-no-wrap color-888">就诊人</view>
          <view class="body">
            {{ item.patientNameEncry }}({{ item.cardNumber }})
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
            <text class="pr12 mr12 doc-name">
              {{ item.docName }}
            </text>
            <text>{{ item.schQukCategor || item.categorName }}</text>
          </view>
        </view>
      </view>

      <view v-if="isShowFooter(item)" class="footer flex-between btn-normal">
        <view class="f36 color-error g-bold">
          <!-- {{ item.fee }}元 -->
        </view>

        <view class="flex-normal footer-btns">
          <button v-if="isShowYWZBtn(item)" @click="goYWZ(item)"
            class="btn btn-round btn-size-small btn-border cancel-btn">
            预问诊
          </button>

          <button v-if="isShowReOrderBtn(item)" @click="goDoctorCard(item)"
            class="btn btn-round btn-size-small btn-border cancel-btn">
            复诊预约
          </button>

          <button v-if="isCancelOrder(item)" class="btn btn-round btn-size-small btn-border cancel-btn">
            取消订单
          </button>

          <button v-if="isShowPaiDui(item)" class="btn btn-round btn-size-small btn-border cancel-btn">
            排队叫号
          </button>

          <button v-if="isPayOrder(item)" class="btn btn-round btn-size-small btn-warning">
            去支付
          </button>

          <button v-if="isFW(item)" class="btn btn-round btn-size-small btn-border cancel-btn">
            服务评价
          </button>

          <block v-for="btn in getCustomBtns" :key="btn.text">
            <button v-if="isShowCustomBtn(item, btn)" @click="useTBanner(btn)"
              class="btn btn-round btn-size-small btn-border cancel-btn">
              {{ btn.text }}
            </button>
          </block>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { IRegistrationCardItem } from '../../utils/MyRegistration';
import { getStatusConfig } from '../../utils/regDetail';
import { joinQueryForUrl, joinQuery } from '@/common';
import {
  ISystemConfig,
  useTBanner,
} from '@/utils';


const props = defineProps<{
  list: IRegistrationCardItem[];
  showYuanNeiDaoHanBtn: string[];
  showPaiDuiJiaoHaoBtn: string[];
  showReOrderBtn: boolean;
  isShowYuWzBtn: boolean;
  showFWBtn: string[];
  systemModeOld?: boolean;
  config: ISystemConfig['order'];
}>();
const emits = defineEmits(['ywz-click']);

const getCustomBtns = computed(() => {
  const list = props.config.regListItemCustomButtons;

  if (list) {
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
  }

  return [];
});

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
  return false;

  // return props.showFWBtn.includes(item.orderStatus);
};

// 显示取消订单
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

const isShowYWZBtn = (item: IRegistrationCardItem) => {
  return ['0'].includes(item.orderStatus) && props.isShowYuWzBtn;
};

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

const goYWZ = (item: IRegistrationCardItem) => {
  emits('ywz-click', item);
};

const goDetail = (item: IRegistrationCardItem) => {
  uni.navigateTo({
    url: joinQueryForUrl('/pagesA/MyRegistration/RegDetail', {
      orderId: item.orderId,
      preWz: item.orderStatus === '10' && '1',
    }),
  });
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
    getCustomBtns.value.some((o) => isShowCustomBtn(item, o))
  );
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
