<template>
  <view class="page">
    <view class="container">
      <view class="container-view">
        <view class="container-view-card">
          <Reg-Confirm-Card :my-props="props" />
        </view>

        <view>
          <Reg-Confirm-ChoosePat />
        </view>
      </view>

      <g-flag typeFg="4" isShowFgTip />
    </view>

    <Order-Reg-Confirm
      :title="flagTitle9"
      @confirm="isCheck = true"
      ref="regDialogConfirm"
    >
      <g-flag v-model:title="flagTitle9" typeFg="9" isShowFgTip isHideTitle />
    </Order-Reg-Confirm>

    <view class="footer">
      <view class="fg-agree">
        <view
          :class="{
            'is-check': isCheck,
          }"
          @click="isCheck = !isCheck"
          class="iconfont check-box"
        >
          {{ (isCheck && '&#xe6d0;') || '&#xe6ce;' }}
        </view>
        <view>
          <text @click="isCheck = !isCheck">我已阅读并同意</text>
          <text @click.stop="regDialogConfirm.show" class="fg-agree-name">
            《预约挂号须知》
          </text>
        </view>
      </view>
      <button class="btn btn-primary" @click="regConfirm">确定预约</button>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';

  import { IPageProps } from './utils/regConfirm';
  import { GStores } from '@/utils';
  import { deQueryForUrl } from '@/common/utils';

  import dayjs from 'dayjs';

  import OrderRegConfirm from './components/orderRegConfirm/orderRegConfirm.vue';
  import RegConfirmCard from './components/RegConfirmCard/RegConfirmCard.vue';
  import RegConfirmChoosePat from './components/RegConfirmChoosePat/RegConfirmChoosePat.vue';

  const gStores = new GStores();
  const props = ref<IPageProps>({} as IPageProps);
  const isCheck = ref(false);
  const regDialogConfirm = ref<any>('');
  const flagTitle9 = ref('');

  const regConfirm = () => {
    if (!isCheck.value) {
      regDialogConfirm.value.show();
      return;
    }

    /**
     * 未填写参数
     *
     * aliRegisterId
     * diseaseId
     * promptMessage
     * resType
     * thRegisterId
     * timePoint
     * visitingArea
     */

    const {
      ampm,
      categor,
      categorName,
      deptName,
      disNo,
      docName,
      fee,
      hosDeptId,
      hosDocId,
      hosId,
      numId,
      schDate,
      schId,
      schQukCategor,
      timeDesc,
      clinicalType,
    } = props.value;
    const { herenId, patientId } = gStores.userStore.patChoose;
    const { source } = gStores.globalStore.browser;
    // 预约类型：1.预约挂号，2.当日挂号
    const resType = (dayjs().format('YYYY-MM-DD') === schDate && '2') || '1';

    const requestArg = {
      ampm,
      categor,
      categorName,
      deptName,
      disNo,
      docName,
      fee,
      hosDeptId,
      hosDocId,
      hosId,
      numId,
      schDate,
      schId,
      schQukCategor,
      timeDesc,
      herenId,
      patientId,
      source,
      clinicalType,
      resType,
    };

    console.log({
      requestArg,
      p: props.value,
    });
  };

  onLoad((p) => {
    props.value = deQueryForUrl<IPageProps>(deQueryForUrl(p));

    console.log(props.value);
  });
</script>

<style lang="scss" scoped>
  .page {
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .container {
    height: 1px;
    flex: 1;
    overflow-y: scroll;

    .container-view {
      padding: 0 32rpx;

      .container-view-card {
        padding-top: 24rpx;
        padding-bottom: 16rpx;
      }
    }
  }

  .footer {
    background-color: var(--h-color-white);
    padding: 24rpx 32rpx 48rpx;
    position: reactive;
    z-index: 1;
  }

  .fg-agree {
    display: flex;
    font-size: var(--hr-font-size-xs);
    align-items: flex-start;
    margin-bottom: 24rpx;

    .fg-agree-name {
      color: var(--hr-brand-color-6);
    }

    .check-box {
      color: var(--hr-neutral-color-7);
      font-size: 40rpx;
      margin-right: 4rpx;
      transform: translateY(-5rpx);

      &.is-check {
        color: var(--hr-brand-color-6);
      }
    }
  }
</style>
