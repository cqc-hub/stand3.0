<template>
  <view class="">
    <g-popup :zIndex="200" :title="'选择取药方式'" ref="refAddDialog">
      <view class="pat-list">
        <view
          v-for="(item, i) in optList"
          :key="i"
          :class="{
            'pat-active': selList.includes(item.value),
          }"
          @click="itemClick(item)"
          class="pat-item"
        >
          <view class="user-label color-111 f36 text-ellipsis">
            {{ item.label }}
          </view>
        </view>

        <view class="mt40">
          <g-flag typeFg="37" isShowFgTip aaa />
        </view>
      </view>
    </g-popup>
  </view>
</template>

<script lang="ts" setup>
  import { nextTick, ref } from 'vue';

  const selFiles = [
    {
      label: '医院窗口取药',
      value: '医院窗口取药',
    },
    {
      label: '快递配送到家',
      value: '快递配送到家',
    },
  ];

  const props = defineProps<{
    selList: string[];
    optList: typeof selFiles;
  }>();
  const emits = defineEmits(['item-click']);
  const refAddDialog = ref<any>('');

  const show = () => {
    if (props.optList.length === 1) {
      itemClick(props.optList[0]);
    } else {
      refAddDialog.value.show();
    }
  };

  const close = () => {
    refAddDialog.value.close();
  };

  const itemClick = (item) => {
    emits('item-click', item);

    nextTick(() => {
      close();
    });
  };

  defineExpose({
    show,
  });
</script>

<style lang="scss" scoped>
  .pat-list {
    width: calc(100% - 64rpx);
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    padding: 32rpx;
    padding-bottom: 40rpx;

    .pat-item {
      flex: 1;
      border: 2rpx solid var(--hr-neutral-color-4);
      border-radius: 16rpx;
      padding: 32rpx;
      background-color: #fff;

      display: grid;
      justify-content: center;
      align-items: center;

      .user-avatar {
        border-radius: 300rpx;
        width: 64rpx;
      }

      .user-label {
        font-weight: 700;
      }

      .ico-checkbox {
        color: var(--hr-brand-color-6);
        font-size: var(--h-size-46);
      }

      &.pat-active {
        border-color: var(--hr-brand-color-6);
        border-width: 4rpx;
      }
    }
  }
</style>
