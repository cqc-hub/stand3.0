<template>
  <view
    v-if="list && list.length"
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-comment f32"
  >
    <view class="header flex-between">
      <view class="flex-normal items-center">
        <text class="f80 color-red">·</text>
        <text class="g-bold f36">病案室工作人员留言</text>
        <text class="f28">({{ total }})</text>
      </view>

      <view v-if="total !== '0'" @click="showAllComment">
        <text class="f28 color-888">查看全部</text>
        <text class="iconfont color-888">&#xe66b;</text>
      </view>
    </view>

    <view v-for="(item, i) in _list" :key="i">
      <Comment-Item
        :item="item"
        :systemModeOld="gStores.globalStore.modeOld"
        ellipsis
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';

  import { GStores } from '@/utils';

  import api from '@/service/api';

  import CommentItem from './medRecordCommentItem.vue';

  const gStores = new GStores();
  const props = defineProps<{
    total: string;
    list: any[];
  }>();

  const _list = computed(() => {
    if (props.list.length) {
      return props.list.slice(0, 1);
    }

    return [];
  });

  const showAllComment = () => {
    gStores.globalStore.assignCacheData([...props.list]);

    uni.navigateTo({
      url: '/pagesC/medRecordApply/_recordApplyCommentAll',
    });
  };
</script>

<style lang="scss" scoped>
  .g-comment {
    .header {
      align-items: center;
      padding: 16rpx 0;
    }
  }

  .empty-list {
    transform: translateY(30%);
  }
</style>
