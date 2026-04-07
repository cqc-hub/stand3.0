<template>
  <view class="page">
    <view class="pt48">
      <hosStep
        :list="stepList"
        :status="stepStatus"
        :selStatus="selStepStatus"
        @item-click="stepClick"
      />
    </view>

    <view class="safe-height g-container">
      <g-form
        v-model:value="formData"
        @submit="formSubmit"
        @change="formChange"
        @address-change="addressChange"
        bodyBold
        ref="gform"
      />
      <view class="safe-height"></view>
      <view class="safe-height"></view>
      <view class="safe-height"></view>
      <view class="safe-height"></view>
      <view class="safe-height"></view>
      <view class="safe-height"></view>
      <view class="safe-height"></view>
      <view class="safe-height"></view>
      <view class="safe-height"></view>
    </view>

    <view class="g-footer">
      <view @click="handlerClick" class="btn btn-primary w-full">
        {{ selStepStatus === '2' ? '提交' : '下一步' }}
      </view>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { useHosButlerOrder } from './hosButler';
  import { changePatient, GStores } from '@/utils';
  import hosStep from './components/hosStep.vue';

  const gStores = new GStores();

  const {
    pageLoad,
    gform,
    formData,
    formChange,
    formSubmit,
    initForm,
    selStepStatus,
    stepStatus,
    stepList,
    stepClick,
    handlerClick,
    addressChange,
  } = useHosButlerOrder();

  onLoad(async (opt: any) => {
    const { _pd } = opt;
    if (_pd) {
      changePatient(_pd);
    }
    pageLoad(opt);
  });
  onMounted(() => {
    initForm();
  });
</script>

<style lang="scss" scoped>
  .safe-height {
    &::before {
      height: 24rpx;
    }
  }

  .page {
    height: 100vh;

    .g-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
</style>
