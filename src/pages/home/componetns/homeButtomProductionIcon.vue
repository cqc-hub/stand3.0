<template>
  <div class="">
    <view class="flex justify-center items-center pt30 pb20">
      <image
        v-if="restConfig.homeProductionIcon"
        :src="restConfig.homeProductionIcon"
        mode="heightFix"
        class="m-icon-heren mr32"
      />
      <image
        v-if="!globalGl.systemInfo.isHideHomeLogo"
        :src="$global.BASE_IMG + 'img_logo@3x.png'"
        mode="heightFix"
        class="m-icon-heren"
      />
    </view>
  </div>
</template>

<script lang="ts" setup>
  import globalGl from '@/config/global';
  import { ISystemConfig, ServerStaticData } from '@/utils';
  import { onMounted, ref } from 'vue';

  const restConfig = ref({} as ISystemConfig['RestOfConfig']);
  onMounted(async () => {
    restConfig.value = await ServerStaticData.getSystemConfig('RestOfConfig');
  });
</script>

<style lang="scss" scoped>
  .m-icon-heren {
    height: 80rpx;
  }
</style>
