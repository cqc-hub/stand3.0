<template>
  <view class="">
    <!-- <web-view
      :src="'http://10.10.83.88:5173/#/pagesC/queueNumber/queueNumber?sysCode=1001052&aaa=300087825&token=a6e8289c389d8ece73750fe57fc12011d87104236539ed3441400f8f4f056eef9ed7417840b83c0b1dfd57ad75a8f80951bf4308159866466a6d6b2889af0cf384e106a29dcf5f3b3afc38ec1b16a795d03da8dee446784880e5771087fc32355d6b26643002098ba2b9542db9e79ae5d70d4754ec3c9ac6d287ada3478f858c5201b9db8ff40e370206a06b7e1a28b6aa753bc8591f4a58479c20f02707792b7d5b6bfea76765d4bc83a99d54e124cc6d8c0553dfc0bef532b645d2d22008a2a099930d41236c16b5d44a2c72ea039eac0a97c9e558e841f8d8c1bb89462721d55da735ffce2c4df33ee7e81e6fefb2&herenId=4276454&_d=f9%2F7ZB3FyR2LCAP%2FF58f46LN67q087jK4sxg0qs2m0PqYoQEGKXU%2BYYSWIPvDOoj8iFGw%2Fgs%2B5N8A1%2FsiqSORA%3D%3D'"
      class="a222"
    /> -->
  </view>
</template>

<script setup lang="ts">
  import { onLoad } from '@dcloudio/uni-app';
  import { ref, onMounted } from 'vue';
  import { getToken, getSysCode } from '@/common/useToken';
  import { joinQuery } from '@/common';
  import { GStores, type TButtonConfig, useTBanner } from '@/utils';
  import globalGl from '@/config/global';

  const gStores = new GStores();
  const base = 'https://health.eheren.com/v3/#/';
  // const base = 'http://10.10.83.135:3000/#/';
  const src =
    base +
    // 测试h5 回调
    // 'pagesC/myDoctor/myDoctor?sysCode=1001033';

    // 'pagesA/healthAdvisory/healthAdvisory?sysCode=' + getSysCode();  // 健康咨询

    // 用药管家
    // joinQuery('pagesC/medicationManager/medicationList', {
    //   sysCode: getSysCode(),
    //   token: gStores.globalStore.token.accessToken,
    //   herenId: gStores.globalStore.herenId,
    // });

    // 选择就诊人
    joinQuery('/pagesC/choosePat/choosePat', {
      sysCode: getSysCode(),
      token: gStores.globalStore.token.accessToken,
      herenId: gStores.globalStore.herenId,
    });

  // const src = 'https://health.eheren.com/testicbc.html';
  //health.eheren.com/testicbc.html'

  // 电子发票
  const eletronicInvoice: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    // path: 'pagesA/eletronicInvoice/invoiceDetail',
    path: 'pagesA/eletronicInvoice/eletronicInvoice',
    text: '电子发票',
    extraData: {
      sysCode: globalGl.SYS_CODE,
    },
    addition: {
      token: 'token',
      herenId: 'herenId',
    },
    isLocal: '1',
  };

  // 排队叫号
  const queryNumber: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    // path: 'pagesA/eletronicInvoice/invoiceDetail',
    path: 'pagesC/queueNumber/queueNumber',
    text: '排队叫号',
    extraData: {
      sysCode: globalGl.SYS_CODE,
    },
    addition: {
      herenId: 'herenId',
      patientId: 'aaa',
      token: 'token',
    },
    isLocal: '1',
  };

  onMounted(() => {
    setTimeout(() => {
      useTBanner(eletronicInvoice);
    }, 1000);
  });
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
