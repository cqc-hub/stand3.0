<template>
  <view class="">
    <g-popup :title="title" ref="refAddDialog">
      <view class="pat-list">
        <view class="top mb16 f28">
          <text>已选{{ totalNum }}项</text>
          <view class="delete f28 color-888" @click="deleteClick">
            <text class="iconfont">&#xe6cf;</text>
            清空
          </view>
        </view>
        <!-- <slot name="list"/> -->
        <!-- :isNoShowMore="true" -->
        <Service-List :list="listData" @update:value="itemClick" @zzz="ezz" zzz />
        <view><slot name="footer" /></view>
      </view>
    </g-popup>
  </view>
</template>

<script lang="ts" setup>
  import { ref, watch, nextTick } from 'vue';
  import ServiceList from './ServiceList.vue';
  const props = defineProps<{
    list: any[];
    title: string;
    totalNum: string;
  }>();
  const listData = ref(props.list);
  const emits = defineEmits(['item-click', 'ezz']);
  const refAddDialog = ref<any>('');

  const show = () => {
    refAddDialog.value.show();
  };

  const close = () => {
    refAddDialog.value.close();
  };

  const itemClick = (o) => {
    emits('item-click', o);
  };
  const deleteClick = () => {
    listData.value.map((item, n) => {
      listData.value[n].num = 0;
    });
    emits('item-click', listData.value);
  };
  const ezz = (e) => {
    emits('ezz', e)
  }

  defineExpose({
    show,
    close
  });

  watch(
    () => props.list,
    (v) => {
      if (v) {
        nextTick(() => {
          listData.value = v;
        });
      }
    },
    { deep: true }
  );
</script>

<style lang="scss" scoped>
  .pat-list {
    width: calc(100% - 64rpx);
    display: flex;
    flex-direction: column;
    // gap: 16rpx;
    padding: 32rpx 32rpx 0 32rpx;
    .delete {
      display: flex;
      align-items: center;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--h-color-white);
      .amount {
        margin: 24rpx 32rpx 68rpx 32rpx;
      }
      .btn {
        width: 40%;
        margin: 24rpx 32rpx 68rpx 32rpx;
      }
    }
  }
</style>
