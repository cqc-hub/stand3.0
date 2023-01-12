<template>
  <view class="">
    <!-- <web-view
      src="http://10.10.83.76:5173/#/pagesC/queryCase/queryCase?sysCode=1001033&aaa=722999831&token=a6e8289c389d8ece73750fe57fc1201165583e5b6002435d80e41fc83233e33a4f831ac26c70856ef9d57ee32e5d1efa6946b8da14c24f0d78cc1164cee615da1b1a18197ff167796b4e07584a8895d894d6b3bf6f5fd2d8f333e95302f905643f75cc3cf7626a0afdd4e41313c590d6b906cc09e33f0f497ba24121a82dcdbccb7256b7d29181639b235ab41efcf494a79de7e7eca25c37ffdfc3cea6d1c3a7ac87ea773fefacb6b89ad1f47655feba3425ac16f21d4153ceaf87d78ee5c4446a466ef179fbe331e8351e1d8421cc0f9257623562d61e3d9fefd973468269d326bd97055a259cdf0f50aa3e3c7a5874&herenId=4276454&_d=f9%2F7ZB3FyR1gdCfyhNE6t%2BvZdA34HFpg4sxg0qs2m0PqYoQEGKXU%2BYYSWIPvDOoj8iFGw%2Fgs%2B5N8A1%2FsiqSORA%3D%3D"
      :class="{
        sss: 1,
      }"
      op="cqc"
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

  // 用药管家
  const yonyao: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    // path: 'pagesA/eletronicInvoice/invoiceDetail',
    path: 'pagesC/medicationManager/medicationList',
    text: '用药管家',
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

  // 病历查询
  const queryCase: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/queryCase/queryCase',
    text: '病历查询',
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

  // 家医签约
  const qinfenSignDocTeam: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/qinfen/signDocTeam',
    text: '病历查询',
    extraData: {
      sysCode: globalGl.SYS_CODE,
    },
    addition: {
      herenId: 'herenId',
      token: 'token',
    },
    isLocal: '1',
  };

  onMounted(() => {
    setTimeout(() => {
      useTBanner(qinfenSignDocTeam);
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
