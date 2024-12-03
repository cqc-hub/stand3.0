<template>
  <div class="">
    <view
      :class="{
        animate__slideInDown: visible,
        animate__slideOutUp: !visible && count,
        'my-hide': !count,
      }"
      class="animate__animated wrap-form g-page bg-white"
    >
      <view class="g-container"></view>
      <view class="g-footer">
        <button
          @click="emits('update:visible', false)"
          class="btn btn-normal btn-border flex-1"
        >
          取消
        </button>
        <button
          @click="emits('update:visible', false)"
          class="btn btn-primary flex-1"
        >
          确定
        </button>
      </view>
    </view>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';

  const props = defineProps<{
    visible: boolean;
  }>();
  const emits = defineEmits(['update:visible']);
  const count = ref(0);

  watch(
    () => props.visible,
    (v) => {
      if (v) {
        if (!count.value) {
          count.value++;
        }
        console.log('first');
      }
    }
  );
</script>

<style lang="scss" scoped>
  .wrap-form {
    position: absolute;
    z-index: 1;
    top: 0;
    width: 100vw;
    height: 100vh;

    animation-duration: 0.4s; /* don't forget to set a duration! */
  }
</style>
