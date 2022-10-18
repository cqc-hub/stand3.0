<template>
  <view class="page">
    <view class="header">
      <!-- class="my-display-none" -->
      <view class="g-border-bottom">
        <g-selhos
          v-model:hosId="hosId"
          @change="getOutPatientHosList"
          @get-list="getHosList"
        />
      </view>
      <g-choose-pat />
    </view>

    <view class="header-btn flex-normal">
      <view class="g-flex-rc-cc g-border">
        <view class="iconfont color-blue">&#xe6fb;</view>
        <view>手动添加记录</view>
      </view>

      <view @click="goApplyRecord" class="g-flex-rc-cc g-border">
        <view class="iconfont color-green">&#xe6fc;</view>
        <view>查看申请记录</view>
      </view>
    </view>

    <view class="container">
      <Out-Hos-List-Com :list="outHosList" :value="checkOutHosList" />
    </view>

    <view class="g-footer g-border-top">
      <view class="footer-check flex-normal">
        <view class="iconfont">&#xe6ce;</view>
        <view>全选</view>
      </view>
      <button class="btn g-border btn-primary btn-disabled">下一步</button>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import api from '@/service/api';
  import { GStores, ServerStaticData, IHosInfo } from '@/utils';
  import { TOutHosInfo } from '../utils/recordApply';

  import OutHosListCom from './components/outHosList.vue';

  const gStores = new GStores();
  const hosId = ref('');
  const isComplete = ref(false);
  const outHosList = ref<TOutHosInfo[]>([{}, {}, {}, {}, {}, {}, {}, {}, {}]);
  const checkOutHosList = ref<TOutHosInfo[]>([]);

  const getHosList = ({ list }: { list: IHosInfo[] }) => {
    if (list.length) {
      hosId.value = list[0].hosId;
      getOutPatientHosList();
    }
  };

  const getOutPatientHosList = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const requestArg = {
      patientId,
      type: '1',
      hosId: hosId.value,
    };

    isComplete.value = false;
    await api.getOutpatientHospitalList(requestArg);
    isComplete.value = true;
  };

  const goApplyRecord = () => {
    uni.navigateTo({
      url: '/pagesC/medRecordApply/_recordApply',
    });
  };

  // gStores.userStore.patChoose
</script>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .header {
      background-color: #fff;
    }

    .header-btn {
      margin: 16rpx 32rpx;
      margin-bottom: 0;
      gap: 14rpx;
      transition: all 0.2s linear;

      > view {
        flex: 1;
        font-size: var(--hr-font-size-s);
        border-radius: 8px;
        background-color: #fff;
        padding: 26rpx 0;

        .iconfont {
          font-size: var(--hr-font-size-xxl);
          margin-right: 14rpx;
        }
      }
    }

    .container {
      flex: 1;
      height: 1px;
      overflow-y: scroll;
      padding: 0 32rpx;
    }

    .g-footer {
      .footer-check {
        font-size: var(--hr-font-size-xs);
        flex: 0.7;

        .iconfont {
          font-size: var(--hr-font-size-xxl);
          color: var(--hr-neutral-color-7);
          margin-right: 10rpx;
        }
      }
      .btn {
        flex: 1;
      }
    }
  }
</style>
