<template>
  <g-popup isHideNav ref="distinctiveImagePopupRef">
      <view
      class="reportList-container page g-page"
      :class="{
        [gStores.globalStore.getPageClass]: true,
      }"
    >
    </view>
  </g-popup>
</template>
<script setup lang="ts">
  import { ref, nextTick, computed, onMounted, onUpdated } from 'vue';
    import {
    ServerStaticData,
    ISystemConfig,
    wait,
    GStores,
    apiAsync,
  } from '@/utils';
  import { distinctiveImagePopupRef } from '../utils/utils';

  const gStores=new GStores()
</script>
