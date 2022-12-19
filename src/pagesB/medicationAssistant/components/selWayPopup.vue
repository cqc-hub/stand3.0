<template>
  <view class="">
    <g-popup :zIndex="200" :title="'选择取药方式'" ref="refAddDialog">
      <view class="g-container">233</view>
    </g-popup>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  const refAddDialog = ref<any>('');

  const show = () => {
    refAddDialog.value.show();
  };

  defineExpose({
    show,
  });
</script>

<style lang="scss" scoped></style>
