<template>
  <view class="g-page">
    <view class="pt48">
      <hosStep
        :list="stepList"
        :status="selStepStatus"
        :selStatus="selStepStatus"
        @item-click="stepClick"
      />
    </view>

    <view class="safe-height g-container">
      <g-form
        v-model:value="formData"
        @submit="formSubmit"
        @change="formChange"
        bodyBold
        ref="gform"
      />
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
  import { onMounted, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { useHosButlerOrder } from './hosButler';
  import hosStep from './components/hosStep.vue';

  const {
    pageLoad,
    gform,
    formData,
    formChange,
    formSubmit,
    initForm,
    selStepStatus,
    stepList,
    stepClick,
    handlerClick,
  } = useHosButlerOrder();

  gform;

  onLoad(async (opt) => {
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
</style>
