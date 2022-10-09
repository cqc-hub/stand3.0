<template>
  <view class="collapse-box" :class="{ boxShadow: boxShadow, borderRadius: borderRadius }">
    <view
      class="title my-row"
      :class="{
        border: border,
        borderRadius: borderRadius,
        'my-row-active': !item.children && activeLv2.hosDeptId === item.hosDeptId
      }"
      :style="{
        backgroundColor: !disabled && isShow ? activebg : '',
        color: !disabled && isShow ? activeColor : ''
      }"
      @click="headerClick"
    >
      <view class="title-label">{{ item.deptName || '没有名字' }}</view>
      <view
        v-show="item.children"
        :class="{
          arrowBottom: isShow
        }"
        class="iconfont ico-arrow right-icon"
      >
        &#xe66b;
      </view>
    </view>
    <view class="content-box" :style="{ height: isShow ? contentHeight + 'px' : '0' }">
      <view v-if="item.children" id="content" class="content">
        <view
          v-for="_item in item.children"
          @click="itemClickLv3(_item)"
          :key="_item.hosDeptId"
          :class="{
            'my-row-active': activeLv3.hosDeptId === _item.hosDeptId
          }"
          class="my-row my-row-collapse"
        >
          {{ _item.deptName }}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { PropType, ref, onMounted, getCurrentInstance, nextTick } from 'vue';
  import { isLev1, IDeptLv1, IDeptLv2, IDeptLv3 } from '@/stores';

  const props = withDefaults(
    defineProps<{
      item: IDeptLv2;
      activeLv2: IDeptLv2;
      activeLv3: IDeptLv3;
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

  const emits = defineEmits(['show', 'item-click-lv2', 'item-click-lv3', 'open-now']);

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
        .boundingClientRect((res: any) => {
          if (res && res.height) {
            contentHeight.value = res.height + props.offsetContentHeight;
          }
        })
        .exec();
    });
  };

  const show = (type?: boolean) => {
    if (type === undefined) {
      isShow.value = !isShow.value;
    } else {
      isShow.value = type;
    }

    if (isShow.value) {
      emits('open-now', props.myId);
    }
  };

  const headerClick = () => {
    if (props.disabled) {
      return;
    }

    itemClickLv2(props.item);

    if (props.item.children) {
      show();

      if (isShow.value) {
        emits('show', props.myId);
      }
    }
  };

  const itemClickLv2 = (item: IDeptLv2) => {
    emits('item-click-lv2', item);
  };

  const itemClickLv3 = (item: IDeptLv3) => {
    emits('item-click-lv3', item);
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

  .content-box {
    transition: 0.4s all;
    overflow: hidden;

    .content {
      background-color: var(--hr-brand-color-1);
    }
  }

  .my-row {
    padding: 24rpx 32rpx;
    font-size: var(--hr-font-size-base);

    border-bottom: 1rpx solid var(--hr-neutral-color-2);

    &-active {
      color: var(--hr-brand-color-6);
      font-weight: 600;
    }
  }

  .my-row-collapse {
    margin: 0 32rpx 0 72rpx;
  }
</style>
