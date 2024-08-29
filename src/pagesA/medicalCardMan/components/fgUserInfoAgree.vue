<template>
  <view class="">
    <checkbox-group @change="checkboxChange">
      <label class="flex flex-wrap items-center">
        <checkbox
          :value="true"
          :checked="value"
          color="#296fff"
          style="transform: scale(0.7)"
        />
        <text class="f28 color-blue pt6">允许该平台访问院内此用户的就诊数据</text>
      </label>
    </checkbox-group>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  defineProps<{
    value: boolean;
  }>();

  const emits = defineEmits(['update:value']);

  const checkboxChange = (e) => {
    const v = e.detail.value[0];
    emits('update:value', !!v);
  };
</script>

<style lang="scss" scoped></style>
