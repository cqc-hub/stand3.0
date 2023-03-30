<template>
  <view class=""></view>
</template>

<script setup lang="ts">
  import { onLoad } from '@dcloudio/uni-app';
  import { ref, onMounted } from 'vue';

  import { getToken, getSysCode } from '@/common/useToken';
  import { joinQuery } from '@/common';
  import { GStores, type TButtonConfig, useTBanner } from '@/utils';
  import globalGl from '@/config/global';

  // 电子发票
  const eletronicInvoice: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
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
      patientId: '_patientId',
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
    text: '家医签约',
    extraData: {
      sysCode: globalGl.SYS_CODE,
    },
    addition: {
      herenId: 'herenId',
      token: 'token',
      patientId: 'a',
    },
    isLocal: '1',
  };

  // 健康档案
  const healthRecord: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    text: '健康档案',
    extraData: {
      rePath: 'pagesC/healthRecord/healthRecord',
    },
    addition: {
      patientId: '_patientId',
    },
    isLocal: '1',
  };

  // 智能导诊
  const smartDiseaseGuide: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    text: '智能导诊',
    extraData: {
      _type: 'taizhouZNDZ',
    },
    addition: {
      patientId: '_patientId',
    },
    isLocal: '1',
  };

  // 麻醉病历申请
  const historyAnaesthesia: TButtonConfig = {
    type: 'h5',
    isSelfH5: '1',
    path: 'pagesC/choosePat/choosePat',
    text: '麻醉病历申请',
    extraData: {
      _type: 'historyAnaesthesia',
    },
    addition: {
      patientId: '_patientId',
    },
    isLocal: '1',
  };

  onMounted(() => {
    setTimeout(() => {
      useTBanner(historyAnaesthesia);
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
