<template>
  <g-popup isHideNav ref="distinctiveImagePopupRef">
    <view
      class="distinctiveImage-contanter"
      :class="{
        [gStores.globalStore.getPageClass]: true,
      }"
    >
      <view class="header flex flex-between pt12">
        <view @clcik="handelCancel" class="cancel f32 p24c">取消</view>
        <view @clcik="handelCancel"  class="title f36 g-bold">选择您的智能健康助理</view>
        <view @click="confirm" class="confirm f32 p24c">确定</view>
      </view>
      <view class="content flex flex-wrap flex3 p12 pt24">
        <view
          class="img m6 p12"
          v-for="(item, index) in distinctiveImageList"
          :key="`img${index}`"
          :class="item == currentImg ? 'selected' : ''"
          @click="currentImg = item"
        >
          <image :src="globalGl.BASE_IMG + item" mode="aspectFill" />
        </view>
      </view>
    </view>
  </g-popup>
</template>
<script setup lang="ts">
  import { ref, nextTick, computed, onMounted, onUpdated } from 'vue';
  import { GStores } from '@/utils';
  import { useGlobalStore } from '@/stores';
  import api from '@/service/api';
  import globalGl from '@/config/global';
  import {
    distinctiveImagePopupRef,
    pageConfig,
    distinctiveImage,
  } from '../utils/utils';

  const gStores = new GStores();
  const currentImg = ref<string>('');
  const distinctiveImageList = computed(() => {
    const list =
      pageConfig.value.intelMedicalAssistConfig?.distinctiveImage?.imageList;
    return list || [];
  });
  onMounted(() => {
    currentImg.value = distinctiveImage.value || '';
  });

  const confirm = async () => {
    const globalStore = useGlobalStore();
    if (gStores.globalStore.herenId) {
      const { result } = await api.intAssistantSave({
        content: currentImg.value,
      });
    }
    globalStore.setIntAssistantImg(currentImg.value);
    distinctiveImage.value=currentImg.value
    distinctiveImagePopupRef.value.hide();
  };
    const handelCancel = () => {    
    distinctiveImagePopupRef.value.hide();
  };
</script>
<style lang="scss" scoped>
  .distinctiveImage-contanter {
    .header {
      .cancel {
        color: var(--hr-neutral-color-9);
      }
      .title {
      }
      .confirm {
        color: var(--hr-brand-color-6);
      }
    }
    .content {
      justify-content: space-between;
      .img {
        border: solid 4rpx var(--hr-neutral-color-11);
        border-radius: 12rpx;
        image {
          width: 190rpx;
          height: 270rpx;
        }
      }
      .selected {
        background-color: #296fff22;
        border: solid 4rpx var(--hr-brand-color-6);
      }
    }
  }
</style>
