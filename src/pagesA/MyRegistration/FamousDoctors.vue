<template>
    <view  :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page">
        名医汇页面

        <view class="g-container">
        
        <button
          v-for="(btn, index) in doctorList"
          :key="`doctorBtn${index}`"
          @click="clickBtn(btn)"
          class="btn btn-primary btn-border"
          :class="index === 0 ? 'btn-plain' : 'confirm-btn'"
        >
          {{ btn.label }}
        </button>
        </view>
    </view>
</template>

<script setup lang="ts">
 import { ref } from 'vue';
  import {
    type TBannerConfig,
    useTBanner,
    wait,
    GStores,
    previewImage,
    getSystemConfig,
  } from '@/utils';

    const gStores = new GStores();
    const doctorList = ref([
    {
      label: '温州名医',
      key: '0',
    },
    {
      label: '北京名医',
      key: '7',
    },
    {
      label: '上海名医',
      key: '8',
    },{
      label: '杭州名医',
      key: '9',
    },
    {
      label: '其他地区名医',
      key: '10',
    },
  ] as const);

   const clickBtn = async (btn) => {
     uni.navigateTo({
       url:`/pagesA/MyRegistration/DepartmentCard?type=hos&key=${btn.key}`,
     });
  };
</script>

<style scoped>


</style>
