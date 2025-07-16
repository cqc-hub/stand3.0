<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <view class="m32">
      <view
        v-for="item in list"
        :key="item.value"
        @click="itemClick(item)"
        class="item mb24"
      >
        <image :src="item.img" class="item-image" mode="widthFix"></image>
        <text class="item-text">{{ item.tip }}</text>
      </view>
    </view>
    <g-message />

    <view class="pr32 pl32">
      <g-flag typeFg="4" isShowFgTip aaa />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { GStores } from '@/utils';
  import { BASE_IMG } from '@/config/global';
  import { joinQueryForUrl } from '@/common';

  const gStores = new GStores();
  const list = ref([
    {
      tip: '到院现场就诊',
      img: `https://phsdevoss.eheren.com/pcloud/image/yylx_mzyy@2x.png`,
      value: '1',
    },
    {
      tip: '到院现场就诊',
      img: `https://phsdevoss.eheren.com/pcloud/image/yylx_gfyy@2x.png`,
      value: '2',
    },
    // {
    //   tip: '网络线上就诊',
    //   img: `https://phsdevoss.eheren.com/pcloud/image/yylx_gfyy@2x.png`,
    //   value: '',
    //   path: '233',
    // },
    {
      tip: ' ',
      img: `https://phsdevoss.eheren.com/pcloud/image/jssz_kjmy@3x.png`,
      value: '7',
    },
  ]);

  const itemClick = (item) => {
    const { value: clinicalType, path } = item;
    let url = path;

    if (clinicalType) {
      url = joinQueryForUrl('/pagesA/MyRegistration/Register', {
        _url: `/pagesA/MyRegistration/selDepartment?clinicalType=${clinicalType}`,
      });
    }
    if (path) {
      uni.navigateTo({
        url: path,
      });
    } else {
    }

    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/Register', {
        _url: `/pagesA/MyRegistration/selDepartment?clinicalType=${clinicalType}`,
      }),
    });
  };

  onLoad(async () => {});
</script>

<style lang="scss" scoped>
  .item {
    display: flex;
    justify-content: flex-start;
    position: relative;
    height: 264upx;

    .item-image {
      position: absolute;
      display: block;
      z-index: 0;
      width: 100%;
    }

    .item-text {
      width: auto;
      z-index: 1;
      padding: 140upx 0 0 42upx;
      color: #666666;
    }
  }
</style>
