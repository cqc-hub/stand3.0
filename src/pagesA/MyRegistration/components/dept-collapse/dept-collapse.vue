<template>
  <view class="collapse-box" :class="{ boxShadow: boxShadow, borderRadius: borderRadius }">
    <view
      class="title my-row"
      :class="{ border: border, borderRadius: borderRadius }"
      :style="{
        backgroundColor: !disabled && isShow ? activebg : '',
        color: !disabled && isShow ? activeColor : ''
      }"
      @click="headerClick"
    >
      <!-- @click="disabled ? '' : show()" -->
      <view class="title-label">{{ item.deptName }}</view>
      <view
        :class="{
          arrowBottom: isShow
        }"
        class="iconfont ico_arrow right-icon"
      >
        &#xe66b;
      </view>
    </view>
    <view class="content-box" :style="{ height: isShow ? contentHeight + 'px' : '0' }">
      <view id="content" class="content">
        <slot>{{ content }}</slot>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { PropType, ref, onMounted, getCurrentInstance, nextTick } from 'vue';
  import { isLev1, IDeptLv1, IDeptLv2 } from '../../utils';

  const props = withDefaults(
    defineProps<{
      item: IDeptLv2;
      myId: number;
      title?: string;
      content?: string;
      activebg?: string;
      fontSize?: string;
      open?: boolean;
      disabled?: boolean;
      boxShadow?: boolean;
      borderRadius?: boolean;
      border?: boolean;
      height?: string;
      activeColor?: string;
      offsetContentHeight?: number;
    }>(),
    {
      item: () => ({} as IDeptLv2),
      title: '标题',
      content: '内容',
      fontSize: '28',
      activebg: '#fff',
      activeColor: '#333',
      open: false,
      disabled: false,
      borderRadius: false,
      boxShadow: false,
      border: true,
      height: '90',
      offsetContentHeight: 0
    }
  );

  const isShow = ref(props.open);
  const contentHeight = ref(0);
  const inst = getCurrentInstance();

  const init = () => {
    nextTick(() => {
      queryRect();
    });
  };

  const queryRect = () => {
    nextTick(() => {
      const query = uni.createSelectorQuery().in(inst);
      query
        .select('#content')
        .boundingClientRect((res) => {
          if (res.height) {
            contentHeight.value = res.height + props.offsetContentHeight;
          }
        })
        .exec();
    });
  };

  const show = () => {
    isShow.value = !isShow.value;
  };

  const headerClick = () => {
    if (props.disabled) {
      return;
    }

    if (props.item.children) {
      show();
    }
  };

  onMounted(() => {
    init();
  });

  defineExpose({
    show,
    init
  });
</script>

<style lang="scss" scoped>
  .collapse-box {
  }

  .boxShadow {
    // box-shadow: 0 4rpx 6rpx rgba($color: #bbb, $alpha: 0.6);
  }

  .borderRadius {
    border-radius: 16upx;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // transition: 0.8s linear;

    &.borderRadius {
      border-radius: 16upx;
    }

    .right-icon {
      transform: rotate(90deg);
      transition: 0.4s all;
      position: relative;
      right: 10upx;
      font-size: 48rpx;

      &.arrowBottom {
        transform: rotate(-90deg);
      }
    }
  }

  .border {
    // border-bottom: 2rpx solid #eee;
  }

  .content-box {
    transition: 0.4s all;
    overflow: hidden;

    .content {
      // padding: 0 24rpx;
      // padding: 32rpx 24rpx;
    }
  }

  .my-row {
    padding: 26rpx 32rpx;
    font-size: var(--hr-font-size-base);
  }
</style>
