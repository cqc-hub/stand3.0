<template>
  <view class="">
    <view @click="changeCheck" class="fg-agree">
      <view
        :class="{
          'is-check': isCheck,
        }"
        class="iconfont check-box"
      >
        {{ (isCheck && '&#xe6d0;') || '&#xe6ce;' }}
      </view>
      <view class="g-break-word">
        <text>我已阅读并同意</text>
        <text @click.stop="goAgreement" class="fg-agree-name">
          《用户条款和隐私政策》
        </text>

        <!-- <text>{{ fg141 }}</text> -->
        <!-- <rich-text :nodes="fg141" /> -->
      </view>
    </view>

    <!-- <g-flag typeFg="141" v-model:value="fg141" /> -->
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  const props = defineProps<{
    isCheck: boolean;
  }>();

  const emits = defineEmits(['update:isCheck']);
  const fg141 = ref('');

  const changeCheck = () => {
    emits('update:isCheck', !props.isCheck);
  };

  const goAgreement = () => {
    uni.navigateTo({
      url: '/pagesA/mySet/userPolicy',
    });
  };
</script>

<style lang="scss" scoped>
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
      font-size: var(--h-size-40);
      margin-right: 4rpx;
      transform: translateY(-5rpx);

      &.is-check {
        color: var(--hr-brand-color-6);
      }
    }
  }
</style>
