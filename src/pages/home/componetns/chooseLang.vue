<template>
  <view
    v-if="gStores.globalStore.selectLangs.length > 1"
    class="flex bg-white f28 font-semibold color-444 pt10 pb10 pr16 pl16 item-container"
  >
    <view
      v-for="item in gStores.globalStore.selectLangs"
      :key="item.value"
      :class="{
        'item-active color-fff': gStores.globalStore.lang === item.value,
      }"
      @click="itemClick(item.value)"
      class="item flex items-center justify-center"
    >
      {{ item.label }}
    </view>
  </view>
</template>

<script lang="ts" setup>
  import globalGl from '@/config/global';
  import { useViewerStore } from '@/stores/modules/viewer';
  import { GStores } from '@/utils';

  const gStores = new GStores();
  const viewerStore = useViewerStore();

  const itemClick = (value: any) => {
    if (value === gStores.globalStore.lang) {
      return;
    }
    gStores.globalStore.setLang(value);
  };
</script>

<style lang="scss" scoped>
  .item-container {
    gap: 8rpx;
    border-radius: 16px;
  }

  .item {
    border-radius: 99px;
    width: 24px;
    height: 24px;

    &.item-active {
      background: linear-gradient(180deg, #d6823c, #ac4b1c);
    }
  }
</style>
