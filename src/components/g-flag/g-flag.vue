<template>
  <view
    :class="{
      aaa: !aaa,
    }"
    class="f32"
  >
    <slot :title="mTitle" :text="text">
      <view v-if="isShowFg && text" class="real-top row">
        <rich-text :nodes="text" />
      </view>

      <view v-if="isShowFgTip && text" class="tip row">
        <view class="title" v-if="!isHideTitle">{{ mTitle }}</view>
        <rich-text :nodes="text" />
      </view>
    </slot>
  </view>
</template>

<script lang="ts" setup>
  import { ref, withDefaults, watch } from 'vue';
  import api from '@/service/api';
  import HTMLParser from '@/common/html-parser';

  interface IProps {
    typeFg: string; //协议编号
    value?: string;
    isShowFg?: boolean; //顶部
    isShowFgTip?: boolean; //底部
    isHideTitle?: boolean;
    disabledFormatterParse?: boolean;
    aaa?: boolean; // 不要 padding
  }

  const props = withDefaults(defineProps<IProps>(), {
    value: '',
    isShowFg: false,
  });

  const text = ref<any>('');
  const mTitle = ref('');

  const emit = defineEmits(['update:value', 'update:title']);

  const init = async () => {
    if (!props.typeFg) {
      return;
    }

    api
      .getSysAppMore({
        typeFlag: props.typeFg,
      })
      .then(
        ({ result }) => {
          const { content, title } = result;
          text.value = props.disabledFormatterParse
            ? content
            : HTMLParser(content);

          mTitle.value = title;
          emit('update:value', text.value);
          emit('update:title', title);
        },
        () => {
          uni.hideLoading();
          const t = '未获取到协议' + props.typeFg;
          text.value = props.disabledFormatterParse ? t : HTMLParser(t);
          emit('update:value', text.value);
        }
      );
  };

  watch(() => props.typeFg, init, {
    immediate: true,
  });
</script>

<style lang="scss" scoped>
  .real-top {
    // min-height: 56rpx;
    padding: 12rpx 32rpx;
    background: var(--hr-brand-color-1);
    text-align: left;
    color: var(--hr-brand-color-6);
    line-height: 40rpx;
  }

  .tip {
    // margin-top: 32rpx;
    line-height: 40rpx;
    color: #888;
    // padding-bottom: 50rpx;
    word-break: break-all;
    white-space: pre-line;
    text-align: left;

    .title {
      margin-bottom: 10rpx;
    }

    // padding: 0 32rpx;
  }

  .aaa {
    .tip {
      margin-top: 32rpx;
      padding: 0 32rpx;
      padding-bottom: 50rpx;
    }
  }

  .row {
    line-height: 1.5;
  }
</style>
