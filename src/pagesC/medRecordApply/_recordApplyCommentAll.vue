<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page bg-white"
  >
    <view class="g-container">
      <view class="pr32 pl32">
        <view v-for="(item, i) in list" :key="i">
          <CommentItem
            :item="item"
            :systemModeOld="gStores.globalStore.modeOld"
          />
        </view>
      </view>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { GStores } from '@/utils';
  import CommentItem from './components/medRecordCommentItem.vue';

  const gStores = new GStores();
  const list = ref([] as any[]);

  onLoad(() => {
    list.value = gStores.globalStore.cacheData || [];
  });
</script>

<style lang="scss" scoped></style>
