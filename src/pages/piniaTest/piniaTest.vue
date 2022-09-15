<template>
  <view class="">
    <web-view :src="src" />
  </view>
</template>

<script setup lang="ts">
  import { onLoad } from '@dcloudio/uni-app';
  import { ref } from 'vue';
  import { getToken, getSysCode } from '@/common/useToken';
  import { joinQuery } from '@/common';
  import { GStores } from '@/utils';

  const gStores = new GStores();
  // const base = 'https://health.eheren.com/v3/#/';
  const base = 'http://10.10.83.95:3000/#/';
  // const src =
    // base +
    // 测试h5 回调
    // 'pagesC/myDoctor/myDoctor?sysCode=1001033';

    	// 'pagesA/healthAdvisory/healthAdvisory?sysCode=' + getSysCode();  // 健康咨询

    // 用药管家
    // joinQuery('pagesC/medicationManager/medicationList', {
    //   sysCode: getSysCode(),
    //   token: gStores.globalStore.token.accessToken,
    //   herenId: gStores.globalStore.herenId
    // });

    const src = 'https://gw.open.icbc.com.cn/ui/mybank/pay/digitalwallet/mobilepay/V1?app_id=Oikeclo001&msg_id=urcnl24ciutr9&format=json&charset=GBK&sign_type=RSA&sign=TRFEWHYUFCEW&%20timestamp=2016-10-29%2020:44:38&biz_content={%22prepay_id%22:%22123456789005266238%22,%22open_id%22:%222143241234%22,%22sub_openid%22:%222143241234%22,%22imei%22:%222143241234%22,%22ip%22:%222143241234%22,%22mac%22:%222143241234%22}'

  console.log(src);
</script>

<style lang="scss" scoped>
  .search-input {
    // padding: 0 40upx !important;
    margin: 40upx;
    // width: 80% !important;
  }

  input,
  textarea {
    font-size: 24px;
    padding: 10px;

    color: red;
    text-shadow: 0px 0px 0px #000;
    -webkit-text-fill-color: transparent;
  }
  input::-webkit-input-placeholder,
  textarea::-webkit-input-placeholder {
    // color:
    text-shadow: none;
    -webkit-text-fill-color: initial;
  }
</style>
