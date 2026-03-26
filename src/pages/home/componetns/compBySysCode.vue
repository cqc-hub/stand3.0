<template>
  <view v-if="getSysCode() === '1001054'" class="mb24">
    <homeBanner :leftFunctionList="homeBanner1001054" :functionList="[]" />
  </view>
</template>
<script setup lang="ts">
  import { getSysCode } from '@/common';
  import homeBanner from './homeBanner.vue';
  const homeBanner1001054 = [
    {
      id: 163329,
      title: '眼科互联网专区',
      detail: '',
      engDetail: '',
      otherDetail: '',
      iconfont: `https://phs-v3-dev.oss-cn-hangzhou.aliyuncs.com/phs-images/PZGL1001054image/file-2026032610093537c7152e405b4d95b1445c48dda2fd10wxtp_20260326100830.png`,
      path: '/pagesC/commonHosNet/commonHosNet?returnUrl=pages%2Fv3%2FfreeClinic%2FchooseDept%3FtoSearchDoc%3D1%26receptionMode%3D8%26deptId%3DXY01',
      terminalType: 'my',
      appId: '',
      query: '',
      isRotation: '1',
      loginInterception: '0',
      patientInterception: '0',
      selectPatientPage: '0',
      gridLabel: '',
    },
  ];
</script>
<style lang="less"></style>
