<template>
  <view class="page">
    <view class="container">
      <view class="container-view">
        <view class="container-view-card">
          <Reg-Confirm-Card :my-props="props" />
        </view>
      </view>

      <g-flag typeFg="4" isShowFgTip />
    </view>

    <g-message />

    <Order-Reg-Confirm
      :title="flagTitle9"
      @confirm="isCheck = true"
      ref="regDialogConfirm"
    >
      <g-flag v-model:title="flagTitle9" typeFg="9" isShowFgTip isHideTitle />
    </Order-Reg-Confirm>

    <view class="footer">
      <view @click="isCheck = !isCheck" class="fg-agree">
        <view
          :class="{
            'is-check': isCheck,
          }"
          class="iconfont check-box"
        >
          &#xe6d0;
        </view>
        <view>
          <text>我已阅读并同意</text>
          <text @click.stop="regDialogConfirm.show" class="fg-agree-name">
            《预约挂号须知》
          </text>
        </view>
      </view>
      <button class="btn btn-primary" @click="regConfirm">确定预约</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { deQueryForUrl } from '@/common/utils';
  import { onLoad } from '@dcloudio/uni-app';

  import OrderRegConfirm from './components/orderRegConfirm/orderRegConfirm.vue';
  import RegConfirmCard from './components/RegConfirmCard/RegConfirmCard.vue';
  import { IPageProps } from './utils/regConfirm';

  const props = ref<IPageProps>({} as IPageProps);
  const isCheck = ref(false);
  const regDialogConfirm = ref<any>('');
  const flagTitle9 = ref('');

  const regConfirm = () => {
    if (!isCheck.value) {
      regDialogConfirm.value.show();
      return;
    }
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
