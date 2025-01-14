<template>
  <view class="">
    <view class="my-hide f24">占位</view>

    <view
      v-for="(item, i) in list"
      :key="item.orderId"
      :class="{
        mb24: i !== list.length - 1,
      }"
      @click="emits('go-detail', item)"
      class="bg-white g-border rounded-xl"
    >
      <view class="p32 pb24 g-border-bottom">
        <view
          :style="{
            color: getStatusConfig(item.orderStatus, false).cardColor,
          }"
          class="f40 font-semibold"
        >
          {{ item._statusLabel }}
        </view>
      </view>

      <view class="p32 pt24">
        <view
          v-if="item.hosName"
          @click.stop="emits('open-hos-location', item)"
          class="row items-center f28 mb10"
        >
          <view class="label color-888">院区</view>
          <view class="body flex items-center">
            <text class="mr16">{{ item.hosName }}</text>
            <text class="iconfont color-blue f40">&#xe6b6;</text>
            <text class="color-blue">导航</text>
          </view>
        </view>

        <view
          v-if="item.schQukCategor || item.categorName"
          @click.stop="emits('go-dept', item)"
          class="row f28 mb10"
        >
          <view class="label color-888">科室号别</view>
          <view class="body color-blue">
            {{ item.schQukCategor || item.categorName }}
          </view>
        </view>

        <view v-if="item.appointmentDate" class="row f28 mb10">
          <view class="label color-888">预约时间</view>
          <view class="body">
            {{
              `${item.appointmentDate} ${item.appointmentTime} ${item.appointmentNumber}号`
            }}
          </view>
        </view>

        <view @click.stop="emits('go-doc', item)" class="row f28 mb10">
          <view class="label color-888">医生</view>
          <view class="body color-blue">
            {{ item.docName }}
          </view>
        </view>

        <view v-if="item.visitingArea" class="row f28 mb10">
          <view class="label color-888">就诊地点</view>
          <view class="body">
            {{ item.visitingArea }}
          </view>
        </view>

        <view class="footer flex btn-normal">
          <view class="f36 color-error g-bold">
            <!-- {{ item.fee }}元 -->
          </view>

          <view class="flex-normal footer-btns flex-wrap pt24 flex-1">
            <button
              v-if="isShowYWZBtn(item)"
              @click.stop="goYWZ(item)"
              class="btn btn-round btn-size-small btn-border cancel-btn"
            >
              预问诊留言
            </button>

            <button
              v-if="['0'].includes(item.orderStatus)"
              @click.stop="refoundOrder(item)"
              class="btn btn-round btn-size-small btn-border cancel-btn"
            >
              {{ config.isOrderPay === '1' ? '退号' : '取消预约' }}
            </button>

            <block v-for="btn in getCustomBtns" :key="btn.text">
              <button
                v-if="isShowCustomBtn(item, btn)"
                @click.stop="
                  useTBanner(btn, 'navigateTo', {
                    ...gStores.userStore.patChoose,
                    ...item,
                  })
                "
                class="btn btn-round btn-size-small btn-border cancel-btn"
              >
                {{ btn.text }}
              </button>
            </block>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { IRegistrationCardItem } from '@/pagesA/MyRegistration/utils/MyRegistration';
  import { getStatusConfig } from '@/pagesA/MyRegistration/utils/regDetail';
  import { ISystemConfig } from '@/types';
  import { GStores, useTBanner } from '@/utils';
  import { computed, defineComponent, ref } from 'vue';

  const props = defineProps<{
    list: IRegistrationCardItem[];
    config: ISystemConfig['order'];
  }>();
  const gStores = new GStores();

  const emits = defineEmits([
    'ywz-click',
    'go-detail',
    'go-hos-navigate',
    'refound-order',
    'open-hos-location',
    'go-dept',
    'go-doc',
  ]);

  const isShowYWZBtn = (item: IRegistrationCardItem) => {
    return (
      ['0'].includes(item.orderStatus) &&
      props.config.isOpenPreConsultation === '1' &&
      (item.orderId || item.hosOrderId)
    );
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

  const goYWZ = (item: IRegistrationCardItem) => {
    emits('ywz-click', item);
  };

  const refoundOrder = (item: IRegistrationCardItem) => {
    emits('refound-order', item);
  };
</script>

<style lang="scss" scoped>
  .row {
    display: flex;
    margin-bottom: 4rpx;

    .label {
      width: 5em;
      // width: 100rpx;
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

  .footer {
    align-items: center;

    .footer-btns {
      gap: 24rpx 16rpx;
      button {
        white-space: nowrap;

        // &:not(:last-child) {
        //   margin-right: 16rpx;
        // }
      }
    }

    .cancel-btn {
      background-color: #fff;
      color: var(--hr-neutral-color-10);
      flex: 1;
    }
  }
</style>
