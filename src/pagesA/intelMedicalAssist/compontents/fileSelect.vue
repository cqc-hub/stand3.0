<template>
  <view class="flex flex-wrap container">
    <view v-for="(item, i) in list" :key="i" class="item relative">
      <image
        :src="item.path"
        class="w-full h-full rounded"
        @click="imgViewer(i)"
      />
      <view class="iconfont delete-icon color-111" @click.stop="delFile(i)">
        &#xe6fa;
      </view>
    </view>

    <view
      v-if="list.length < limit"
      @click="addFile"
      class="iconfont relative z-0 item add-icon-s rounded flex justify-center items-center g-border-right"
    >
      &#xe6c3;
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { uChooseImg } from '../utils/utils';

  const props = withDefaults(
    defineProps<{
      list: { path: string }[];
      limit?: number;
    }>(),
    {
      limit: 9,
    }
  );

  const emits = defineEmits(['file-del', 'file-add']);

  const delFile = (idx) => {
    emits('file-del', idx);
  };

  const addFile = async () => {
    const newFiles = (await uChooseImg(props.limit - props.list.length)).map(
      (o) => ({
        path: o,
      })
    );

    emits('file-add', newFiles);
  };

  const imgViewer = (current) => {
    uni.previewImage({
      current,
      urls: props.list.map((o) => o.path),
      indicator: 'number',
    });
  };
</script>

<style lang="scss" scoped>
  .container {
    gap: 24rpx;
  }

  .item {
    width: 120rpx;
    height: 120rpx;

    .delete-icon {
      font-size: var(--hr-font-size-xxl);
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  .add-icon-s {
    font-size: 48px;
    font-size: 800;
    color: #999;
    background-color: #f8f8f8;
  }
</style>
