<template>
  <view
    :class="{
      aaa: !aaa,
    }"
    class="f32"
  >
    <slot :title="mTitle" :text="text">
      <view
        v-if="isShowFg && text"
        :class="{
          'real-top-bg': isShowFgBg,
        }"
        class="real-top row"
      >
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
  import { ref, watch } from 'vue';
  import { GStores } from '@/utils';

  interface IProps {
    typeFg: string; //协议编号
    value?: string;
    isShowFg?: boolean; //顶部
    isShowFgBg?: boolean; // 顶部时候底色
    isShowFgTip?: boolean; //底部
    isHideTitle?: boolean;
    disabledFormatterParse?: boolean;
    aaa?: boolean; // 不要 padding
  }

  const props = withDefaults(defineProps<IProps>(), {
    value: '',
    isShowFg: false,
    isShowFgBg: true,
  });
  const gStores = new GStores();

  const text = ref<any>('');
  const mTitle = ref('');

  const emit = defineEmits(['update:value', 'update:title']);

  const init = async () => {
    if (!props.typeFg) {
      return;
    }

    const { content, title } = await gStores.getSysAppMore(props.typeFg);

    text.value = content;
    emit('update:value', text.value);
    emit('update:title', title);

    // api
    //   .getSysAppMore({
    //     typeFlag: props.typeFg,
    //   })
    //   .then(
    //     ({ result }) => {
    //       const { content, title } = result;
    //       text.value = props.disabledFormatterParse
    //         ? content
    //         : HTMLParser(content);

    //       mTitle.value = title;
    //       emit('update:value', text.value);
    //       emit('update:title', title);
    //     },
    //     () => {
    //       uni.hideLoading();
    //       const t = '未获取到协议' + props.typeFg;
    //       text.value = props.disabledFormatterParse ? t : HTMLParser(t);
    //       emit('update:value', text.value);
    //     }
    //   );
  };

  watch(() => props.typeFg, init, {
    immediate: true,
  });
</script>

<style lang="scss" scoped>
  .real-top {
    padding: 12rpx 32rpx;
    text-align: left;
    color: var(--hr-brand-color-6);
    line-height: 40rpx;
  }
  .real-top-bg {
    background: var(--hr-brand-color-1);
  }

  .tip {
    line-height: 40rpx;
    color: #888;
    word-break: break-all;
    white-space: pre-line;
    text-align: left;

    .title {
      margin-bottom: 10rpx;
    }
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
