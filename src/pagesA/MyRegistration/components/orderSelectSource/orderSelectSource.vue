<template>
  <view class="">
    <g-popup @hide="hide" title="请选择就诊时间" ref="popup">
      <view class="container">cqc</view>
    </g-popup>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref } from 'vue';
  import { TSchInfo } from '../../utils/index';
  import api from '@/service/api';

  const popup = ref<any>('');
  const props = defineProps<{
    show: boolean;
    selectSchInfo: TSchInfo;
  }>();
  const emits = defineEmits(['update:show']);

  const show = () => {
    popup.value.show();
  };

  const hide = () => {
    emits('update:show', false);
  };

  watch(
    () => props.show,
    (v) => {
      if (v) {
        show();
      }
    }
  );
</script>

<style lang="scss" scoped></style>
