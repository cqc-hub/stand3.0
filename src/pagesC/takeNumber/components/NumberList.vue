<template>
  <view class="">
    <view v-for="item in list" :key="item.visitId" class="item mb16">
      <view class="flex-between f32 g-bold mb16">
        <view class="flex-normal">
          <view class="mr12">{{ item.deptName || item.categorName }}</view>
          <view>{{ item.docName }}</view>
        </view>

        <view v-if="isShowFlagLabel()">
          <text
            :class="{
              'color-888': ['1', '2'].includes(item.reportFlag),
            }"
            class="color-blue"
          >
            <text>
              {{ getReportFlagInfo(item.reportFlag).label }}
            </text>
          </text>
        </view>
      </view>

      <view class="color-444 f28 mb32">
        <text class="mr8">{{ item.visitDate }}</text>
        <text>{{ item.ampmName }}</text>
        <text class="mr8">{{ item.timeDesc }}</text>
        <text v-if="item.queueNum">第{{ item.queueNum }}号</text>
      </view>

      <view v-if="item.visitingArea" class="tip mb32">
        <rich-text :nodes="$HTMLParser(item.visitingArea)" />
      </view>
      <!-- 咸阳签到取号功能新增2种reportFlag 4 过号签到，3 回诊签到。 -->
      <view
        v-if="
          ['0', '3', '4'].includes(item.reportFlag) ||
          (isOnlineSign && item.reportFlag === '预约未到')
        "
      >
        <view @click="takeNumber(item)" class="g-flex-rc-cc">
          <view
            :class="{
              'take-number-disabled':
                !getTakeNumberStatus(item).enabeleTakeNumber,
            }"
            class="take-number g-flex-rc-cc f36 g-bold"
          >
            {{ getTakeNumberStatus(item).showMess }}
          </view>
        </view>

        <view
          class="g-flex-rc-cc f28 mt24"
          v-if="item?.ifPay === '1' && item?.tip"
        >
          {{ item.tip }}
        </view>
        <view
          v-if="getTakeNumberStatus(item).reLocation"
          @click="refrashData"
          class="g-flex-rc-cc color-blue f28 mt24"
        >
          <image
            :src="$global.BASE_IMG + 'stand3-refresh.png'"
            :class="{
              'rotate-icon': loading,
            }"
            class="refresh-icon"
          />
          <view>点击刷新定位</view>
        </view>
      </view>

      <view v-else class="flex-normal">
        <view
          v-if="item.qrValue && pageConfig?.AfterConfirmNoShowGoPayBtn !== '1'"
          @click="goPayPage"
          class="btn btn-border btn-primary p24 flex1 mr24"
        >
          门诊缴费
        </view>

        <view
          v-if="item.qrValue && pageConfig?.AfterConfirmNoShowQRcodeBtn !== '1'"
          @click="signIn(item)"
          class="btn btn-border btn-primary btn-plain p24 flex1"
        >
          {{
            isTakeNumberAfterBtnForGoQueueNumber ? '查看排队信息' : '刷码签到'
          }}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref, onMounted, computed } from 'vue';
  import { type TTakeNumberListItem } from '../utils/takeNumber';
  import { ServerStaticData, ISystemConfig, GStores } from '@/utils';

  const props = defineProps<{
    list: TTakeNumberListItem[];
    loading: boolean;
    isOnlineSign: boolean;
    isTakeNumberAfterBtnForGoQueueNumber: boolean;
  }>();
  const pageConfig = ref(<ISystemConfig['order']>{});
  const gStores = new GStores();

  onMounted(async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('order');
  });

  const emits = defineEmits([
    'refresh-data',
    'take-number',
    'sign-in',
    'pay-page',
  ]);

  const reportFlagMap = computed(() => {
    const typeLabel = props.isOnlineSign ? '签到' : '取号';

    return {
      0: {
        label: `待${typeLabel}`,
      },
      1: {
        label: `已${typeLabel}`,
      },
      2: {
        label: `无需${typeLabel}`,
      },
      3: {
        label: `回诊${typeLabel}`,
      },
      4: {
        label: `过号${typeLabel}`,
      },
    };
  });

  const getReportFlagInfo = (flag: keyof typeof reportFlagMap.value) => {
    // 可能存在 flag = 过号签到 这样的情况
    if (isNaN(flag * 1)) {
      return {
        label: flag,
      };
    }

    const item = reportFlagMap.value[flag];
    return (
      item || {
        label: '未知',
      }
    );
  };

  const isShowFlagLabel = () => {
    if (
      props.isOnlineSign &&
      ['1001084'].includes(gStores.globalStore.sysCode)
    ) {
      return false;
    }
    return true;
  };

  const getTakeNumberStatus = (item: TTakeNumberListItem) => {
    const status = {
      enabeleTakeNumber: false,
      reLocation: false,
      showMess: '',
    };
    status.enabeleTakeNumber = item.signIn;
    status.reLocation = !item.signIn;
    let statusName = props.isOnlineSign ? '签到' : '取号';
    status.showMess = item.signIn ? statusName : `不在${statusName}范围`;
    if (item?.ifPay === '1' && item?.tip) {
      status.showMess = `不符合${statusName}条件`;
    }
    return status;
  };

  const refrashData = () => {
    emits('refresh-data');
  };

  const takeNumber = (item: TTakeNumberListItem) => {
    if (item.signIn) {
      emits('take-number', item);
    }
  };

  const signIn = (item: TTakeNumberListItem) => {
    emits('sign-in', item);
  };

  const goPayPage = () => {
    emits('pay-page');
  };
</script>

<style lang="scss" scoped>
  .item {
    background-color: #fff;
    padding: 32rpx;
    border: 1rpx solid var(--hr-neutral-color-2);
    border-radius: 8px;

    .take-number {
      width: 280rpx;
      height: 280rpx;
      padding: 20rpx;
      background: var(--hr-brand-color-6);
      border-radius: 50%;
      color: #fff;

      &.take-number-disabled {
        color: var(--hr-neutral-color-5);
        background: #eeeeee;
      }
    }
  }

  .refresh-icon {
    width: 40rpx;
    height: 40rpx;

    &.rotate-icon {
      animation: rotateIcon 2s linear infinite forwards;
    }
  }

  @keyframes rotateIcon {
    from {
      -webkit-transform: rotate(0deg);
    }

    to {
      -webkit-transform: rotate(360deg);
    }
  }
</style>
