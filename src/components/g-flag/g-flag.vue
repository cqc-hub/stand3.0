<template>
  <view>
    <slot :title="mTitle" :text="text">
      <view v-if="isShowFg && text" class="real-top">
        <rich-text :nodes="text" />
      </view>

      <view v-if="isShowFgTip && text" class="tip">
        <view class="title" v-if="!isHideTitle">{{ mTitle }}</view>
        <rich-text :nodes="text" />
      </view>
    </slot>
  </view>
</template>

<script lang="ts" setup>
  import { ref, withDefaults } from 'vue';
  import api from '@/service/api';
  import HTMLParser from '@/common/html-parser';

  interface IProps {
    typeFg: string; //协议编号
    value?: string;
    isShowFg?: boolean; //顶部
    isShowFgTip?: boolean; //底部
    isHideTitle?: boolean;
  }

  const props = withDefaults(defineProps<IProps>(), {
    value: '',
    isShowFg: false,
  });

  const text = ref<any>('');
  const mTitle = ref('');

  const emit = defineEmits(['update:value', 'update:title']);

  api
    .getSysAppMore({
      typeFlag: props.typeFg,
    })
    .then(
      ({ result }) => {
        const { content, title } = result;
        text.value = HTMLParser(content);
        mTitle.value = title;
        emit('update:value', text.value);
        emit('update:title', title);
      },
      () => {
        uni.hideLoading();
        text.value = HTMLParser('未获取到协议' + props.typeFg);
        emit('update:value', text.value);
      }
    );
</script>

<style lang="scss" scoped>
  .real-top {
    // min-height: 56rpx;
    padding: 12rpx 32rpx;
    background: var(--hr-brand-color-1);
    text-align: left;
    color: var(--hr-brand-color-6);
    font-size: 28rpx;
    line-height: 40rpx;
  }

  .tip {
    margin-top: 40rpx;
    .title {
      margin-bottom: 10rpx;
    }

    padding: 0 32rpx;
    font-size: 28rpx;
    line-height: 40rpx;
    color: #888;
    padding-bottom: 50rpx;
    word-break: break-all;
  }
</style>
