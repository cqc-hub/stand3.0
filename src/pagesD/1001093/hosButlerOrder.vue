<template>
  <view class="g-page">
    <view class="pt48">
      <hosStep
        :list="stepList"
        :status="stepStatus"
        :selStatus="selStepStatus"
      />
    </view>

    <view class="safe-height">
      <g-form
        v-model:value="formData"
        @submit="formSubmit"
        @change="formChange"
        bodyBold
        ref="gform"
      />
    </view>

    <view class="g-footer">
      <view class="btn btn-primary w-full">下一步</view>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { useHosButlerOrder } from './hosButler';
  import hosStep from './components/hosStep.vue';

  const {
    gform,
    formData,
    formChange,
    formSubmit,
    initForm,
    stepStatus,
    selStepStatus,
    stepList,
  } = useHosButlerOrder();

  onLoad(async () => {});
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
</style>
