<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-comment f32"
  >
    <view class="header flex-between">
      <view class="flex-normal">
        <text class="g-bold f36">患者评价</text>
        <text class="f28">({{ total }})</text>
      </view>

      <view v-if="total !== '0'" @click="showAllComment">
        <text class="f28 color-888">查看全部</text>
        <text class="iconfont color-888">&#xe66b;</text>
      </view>
    </view>

    <view v-for="(item, i) in list" :key="i">
      <Comment-Item
        :item="item"
        :tagList="tagList"
        :systemModeOld="gStores.globalStore.modeOld"
      />
    </view>

    <view v-if="!list.length" class="empty-list">
      <g-empty :current="5" text="暂无患者评价" />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { type ICommentItem } from '../../utils/DoctorDetails';

  import {
    previewImage,
    GStores,
    ServerStaticData,
    type ISystemConfig,
  } from '@/utils';

  import api from '@/service/api';

  import CommentItem from './DocCommentItem.vue';

  const gStores = new GStores();

  const emits = defineEmits(['show-all-click']);
  const tagList = ref([] as any[]);
  const getConfig = async () => {
    const { result } = await api.getTermsBySysAndCode({
      domainCode: 'DOC_EVALUATION_CONTENT',
    });

    tagList.value = (result && result[0]?.terms) || [];
  };

  const showAllComment = () => {
    emits('show-all-click');
  };

  onMounted(() => {
    getConfig();
  });

  defineProps<{
    total: string;
    list: ICommentItem[];
  }>();
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
