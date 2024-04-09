<template>
  <view class="">
    <view
      v-for="item in list"
      :key="item.applyNo"
      @click="itemClick(item)"
      class="item p32"
    >
      <view class="flex-between flex-start-r">
        <view class="g-bold f36 flex1 mr40">
          <text
            :class="{
              'pay-self': 1,
              'pay-medical': ['3', '4'].includes(item.appointAdtStatus),
            }"
            class="type-block f24 mr8 text-no-wrap"
          >
            {{
              appointAdtStatus(item.appointAdtStatus).label ||
              '未知' + item.appointAdtStatus
            }}
          </text>
          <text>
            {{ item.hosName }}
          </text>
        </view>

        <view class="g-flex-rc-cc">
          <view class="iconfont color-888 f48">&#xe66b;</view>
        </view>
      </view>

      <view class="item-box f28">
        <view v-if="item.appointAdmissionDate" class="row flex-normal">
          <view class="row-label color-888">预住院日期</view>
          <view class="row-value g-break-word color-444">
            {{ item.appointAdmissionDate }}
          </view>
        </view>

        <view v-if="item.deptAdmissionName" class="row flex-normal">
          <view class="row-label color-888">就诊科室</view>
          <view class="row-value g-break-word color-444">
            {{ item.deptAdmissionName }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { joinQueryForUrl } from '../../../common/utils';

  const props = defineProps<{
    list: any[];
  }>();

  // 住院证状态,0 审核中 1:待预约  2:预约  3:待入院  4:待入科
  /**
   * his返回
   * 待预约———显示【待预约】，
   * 已预约、审核中——显示【审核中】，
   * 待入院、待入科——显示【待入院】。
   *
   */
  const map = <const>{
    0: {
      label: '审核中',
      class: '',
    },
    1: {
      label: '待预约',
      class: '',
    },
    2: {
      label: '已预约',
      class: '',
    },
    3: {
      label: '待入院',
      class: '',
    },
    4: {
      label: '待入院',
      class: '',
    },
  };

  const appointAdtStatus = <T extends keyof typeof map>(status: T) => {
    return map[status] || {};
  };

  const itemClick = (item) => {
    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/hospitalCare/changeOrder', item),
    });
  };
</script>

<style lang="scss" scoped>
  .item {
    background: #ffffff;
    border-radius: 8px;

    .item-box {
      margin-top: 24rpx;
    }

    .row {
      margin-bottom: 8rpx;
      .row-label {
        width: 150rpx;
      }

      .row-value {
        flex: 1;
      }
    }
  }

  .type-block {
    font-weight: normal;
    border-radius: 4rpx;
    padding: 4rpx 12rpx;
    position: relative;
    top: -5rpx;

    &.pay-medical {
      background: #747c94;
      color: #ffe2c1;
    }

    &.pay-self {
      background: #ffe2c1;
      color: #51555e;
    }
  }
</style>
