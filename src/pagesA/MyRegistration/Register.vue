<template>
  <view class="page">
    <scroll-view class="scroll-container" scroll-y>
      <hos-List-Vue
        :list="hosList"
        @img-click="imgClick"
        @location-click="locationClick"
        @item-click="itemClick"
      />
    </scroll-view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref, onMounted } from 'vue';
  import { ServerStaticData, IHosInfo } from '@/utils';
  import { joinQuery } from '@/common';

  import hosListVue from './components/hosList/hosList.vue';

  import api from '@/service/api';

  const props = defineProps<{
    _url: string;
  }>();

  const hosList = ref<IHosInfo[]>([]);

  const itemClick = (item: IHosInfo) => {
    const url = decodeURIComponent(props._url);
    uni.navigateTo({
      url: joinQuery(url, {
        hosId: item.hosId,
      }),
    });
  };

  const locationClick = (item: IHosInfo) => {};

  const imgClick = (item: IHosInfo) => {};

  const init = async () => {
    uni.getLocation({
      async success(e) {
        const { longitude, latitude } = e;
        const hList = await ServerStaticData.getHosList(
          {
            gisLng: longitude,
            gisLat: latitude,
          },
          { noCache: true }
        );

        hosList.value = hList;
      },

      async fail() {
        hosList.value = await ServerStaticData.getHosList();
      },
    });
  };

  init();
</script>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    background: var(--hr-neutral-color-1);

    .scroll-container {
      flex: 1;
      height: 1px;
      padding: 0 32rpx;
      padding-top: 16rpx;
      width: calc(100% - 64rpx);
    }
  }
</style>
