<template>
  <view>
    <view
      :class="{
        [type]: type
      }"
      class="tag-container"
    >
      {{ text }}
    </view>
  </view>
</template>

<script lang="ts">
  import { defineComponent, PropType, ref } from 'vue';

  type TText = 'yellow';
  export default defineComponent({
    props: {
      text: {
        type: String,
        default: ''
      },

      type: {
        type: String as PropType<TText>,
        default: 'yellow'
      }
    },

    setup() {
      return {};
    }
  });
</script>

<style lang="scss" scoped>
  .tag-container {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--hr-font-size-xxxs);
    padding: 2rpx 10rpx;
    border-radius: 8rpx;
    white-space: nowrap;

    &.yellow {
      background-color: var(--hr-warning-color-1);
      color: var(--hr-warning-color-6);
    }
  }
</style>
