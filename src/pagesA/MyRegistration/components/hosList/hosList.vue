<template>
  <view class="hos-list-container">
    <view v-for="(item, i) in list" :key="i">
      <g-login
        :disabled="!login || isDisabled(item)"
        @handler-next="itemClick(item)"
      >
        <view>
          <block v-if="isShowMoreItem">
            <Item-Less
              :disabled="isDisabled(item)"
              :item="item"
              @img-click="itemClick"
              @location-click="locationClick"
              @item-click="itemClick"
              @intro-click="introClick"
            />
          </block>

          <block v-else>
            <Item-More
              :disabled="isDisabled(item)"
              :item="item"
              @img-click="itemClick"
              @location-click="locationClick"
              @item-click="itemClick"
            />
          </block>
        </view>
      </g-login>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { GStores, IHosInfo } from '@/utils';
  import ItemLess from './hosListItemLess.vue';
  import ItemMore from './hosListItemMore.vue';

  const props = defineProps<{
    list: IHosInfo[];
    isShowMoreItem: boolean;
    login?: boolean;
    disabledKey?: string;
  }>();
  const gStores = new GStores();

  const isDisabled = (item: IHosInfo) => {
    const { disabledKey } = props;

    if (disabledKey) {
      if (item[disabledKey] == '1') {
        return true;
      }
    }

    return false;
  };

  const emits = defineEmits([
    'img-click',
    'location-click',
    'item-click',
    'intro-click',
  ]);

  const itemClick = (item: IHosInfo) => {
    if (isDisabled(item)) {
      gStores.messageStore.showMessage('该院区暂未开通此功能', 3000);

      return;
    }

    emits('item-click', item);
  };

  const locationClick = (item: IHosInfo) => {
    if (isDisabled(item)) {
      gStores.messageStore.showMessage('该院区暂未开通此功能', 3000);

      return;
    }
    emits('location-click', item);
  };

  const introClick = (item: IHosInfo) => {
    emits('intro-click', item);
  };

  const imgClick = (item: IHosInfo) => {
    emits('img-click', item);
  };
</script>

<style lang="scss" scoped>
  .hos-list-container {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }
</style>
