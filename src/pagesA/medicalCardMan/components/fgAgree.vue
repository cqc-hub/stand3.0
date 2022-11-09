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
      <view>
        <text>我已阅读并同意</text>
        <text @click.stop="goAgreement" class="fg-agree-name">
          《用户条款和隐私政策》
        </text>
        <text>这个是协议配置编号待定（不支持富文本）</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  const props = defineProps<{
    isCheck: boolean;
  }>();

  const emits = defineEmits(['update:isCheck']);

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
      font-size: 40rpx;
      margin-right: 4rpx;
      transform: translateY(-5rpx);

      &.is-check {
        color: var(--hr-brand-color-6);
      }
    }
  }
</style>
