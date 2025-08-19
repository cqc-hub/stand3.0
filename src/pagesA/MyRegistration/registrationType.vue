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
        :class="{
          'order-yun': isYunOrder,
        }"
        @click="itemClick(item)"
        class="mb24 relative"
      >
        <image :src="item.img" class="w-full" mode="widthFix"></image>
        <view class="box absolute z-0">
          <view v-if="!isYunOrder" class="safe-height"></view>
          <view class="safe-height"></view>
          <view class="safe-height"></view>
          <view class="safe-height"></view>
          <text class="color-666 pl42">{{ item.tip }}</text>
        </view>
      </view>
    </view>
    <g-message />

    <view class="pr32 pl32">
      <g-flag :typeFg="isYunOrder ? 112 : 4" isShowFgTip aaa />
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { GStores } from '@/utils';
  import { deQueryForUrl, joinQueryForUrl } from '@/common';

  const gStores = new GStores();
  const pageProps = ref(
    {} as {
      // 1 云门诊
      type: '1';
    }
  );

  const isYunOrder = computed(() => pageProps.value.type === '1');
  const list = computed(() => {
    if (isYunOrder.value) {
      return [
        {
          tip: '网络线上就诊,快递发药',
          img: `https://phsdevoss.eheren.com/pcloud/image/yylx_rjymz@2x.png`,
          value: '4',
          path: '/pagesA/MyRegistration/selDepartment?clinicalType=4&hosId=12675&hideSelHos=1',
        },
        {
          tip: '夜间网络线上就诊,快递发药',
          img: `https://phsdevoss.eheren.com/pcloud/image/yylx_yjymz@2x.png`,
          value: '3',
          path: '/pagesA/MyRegistration/selDepartment?clinicalType=3&hosId=12675&hideSelHos=1',
        },
        {
          tip: '中医重点专科网络线上就诊,快递发药',
          img: `https://phsdevoss.eheren.com/pcloud/image/yylx_zyzdzkymz.png`,
          value: '6',
          path: '/pagesA/MyRegistration/selDepartment?clinicalType=6&hosId=12675&hideSelHos=1',
        },
        {
          tip: '网络线上图文问诊医生,快递发药',
          img: `https://phsdevoss.eheren.com/pcloud/image/yylx_twwz@2x.png`,
          value: '7',
          path: '/pagesC/cloudHospital/cloudHospital',
        },
        // 院内制剂
        // {
        //   tip: ' ',
        //   img: `https://phsdevoss.eheren.com/pcloud/image/jssz_kjmy@3x.png`,
        //   value: '10',
        // },
      ];
    } else {
      return [
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
        // 在线云门诊
        {
          tip: '网络线上就诊',
          img: `https://phsdevoss.eheren.com/pcloud/image/yylx_zxymz@2x.png`,
          value: '',
          path: '/pagesA/MyRegistration/registrationType?type=1',
        },
        // 院内制剂
        // {
        //   tip: ' ',
        //   img: `https://phsdevoss.eheren.com/pcloud/image/jssz_kjmy@3x.png`,
        //   value: '7',
        // },
      ];
    }
  });

  const itemClick = (item) => {
    const { value: clinicalType, path } = item;

    let url = joinQueryForUrl('/pagesA/MyRegistration/Register', {
      _url: `/pagesA/MyRegistration/selDepartment?clinicalType=${clinicalType}`,
    });

    if (path) {
      url = path;
    }

    uni.navigateTo({
      url,
    });
  };

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
  });
</script>

<style lang="scss" scoped>
  .box {
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
</style>
