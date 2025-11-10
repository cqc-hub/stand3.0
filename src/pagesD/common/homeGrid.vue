<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
  >
    <view class="container">
      <homeMenu :list="gridData" :tabIndex="0" @open-share="openShare" />
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { useViewerStore } from '@/stores/modules/viewer';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { deQueryForUrl, joinQueryForUrl } from '@/common/utils';
  import homeMenu from './components/homeMenu.vue';
  import { GStores } from '@/utils';

  const gStores = new GStores();
  const viewerStore = useViewerStore();
  const gridData = ref<Array<any>>([
    {
      sysCode: '1001036',
      functionList: [
        {
          gridLabel: '0',
          path: '/pagesA/MyRegistration/Register?_type=1',
          iconfont: 'ico_sy_hospital',
          appId: '',
          query: '',
          id: 137673,
          detail: '',
          selectPatientPage: '0',
          title: '医院指南',
          patientInterception: '0',
          loginInterception: '0',
          terminalType: 'my',
        },
        {
          iconfont: 'ico_sy_paper6',
          query: '',
          otherDetail: '',
          selectPatientPage: '0',
          title: '就诊指导',
          terminalType: 'mini',
          gridLabel: '0',
          path: 'pages/code/code?q=http%3A%2F%2Fqr61.cn%2Fo1KZUG%2FqVPfphV&scancode_time=1762601616',
          appId: 'wx5db79bd23a923e8e',
          id: 137672,
          detail: '',
          patientInterception: '0',
          loginInterception: '0',
          engDetail: '',
        },
        {
          gridLabel: '0',
          path: 'https://h5.eheren.com/V3_h5/#/pagesA/diseaseCyclopedia/index?type=showDrug',
          iconfont: 'ico_sy_file',
          appId: '',
          query: '',
          id: 137674,
          detail: '',
          selectPatientPage: '0',
          title: '健康百科',
          patientInterception: '0',
          loginInterception: '0',
          terminalType: 'h5',
        },
        {
          gridLabel: '3',
          path: 'http://children.app.shuzirc.com:8090/homepage/login.html',
          iconfont: 'ico_sy_birthcertificate',
          appId: '',
          query: '',
          id: 137675,
          detail: '',
          selectPatientPage: '0',
          title: '儿童肾病中心',
          patientInterception: '0',
          loginInterception: '0',
          terminalType: 'h5',
        },
        {
          iconfont: 'ico_sy_patient',
          query: '',
          otherDetail: '',
          selectPatientPage: '0',
          title: '花果配送',
          terminalType: 'my-h5',
          gridLabel: '3',
          path: '',
          appId: '',
          id: 137676,
          detail: '',
          patientInterception: '1',
          loginInterception: '1',
          engDetail: '',
        },
        {
          gridLabel: '0',
          path: '/pagesA/healthAdvisory/healthAdvisory',
          iconfont: 'ico_sy_paper1',
          appId: '',
          query: '',
          id: 137677,
          detail: '',
          selectPatientPage: '0',
          title: '健康资讯',
          patientInterception: '0',
          loginInterception: '0',
          terminalType: 'my-h5',
        },
        {
          gridLabel: '0',
          path: '/pagesC/commonHosNet/commonHosNet?returnUrl=pages%2Fv3%2FfreeClinic%2FchooseDept%3FhosId%3D480%26isHealthSciencePopularization%3D1',
          iconfont: 'a-ico_sy_commendatoryletter',
          appId: '',
          query: '',
          id: 137678,
          detail: '',
          selectPatientPage: '0',
          title: '健康宣教',
          patientInterception: '0',
          loginInterception: '0',
          terminalType: 'my',
        },
        {
          iconfont: 'ico_sy_elderly',
          query: '',
          otherDetail: '',
          selectPatientPage: '0',
          title: '陪诊服务',
          terminalType: 'my',
          gridLabel: '3',
          path: '',
          appId: '',
          id: 137679,
          detail: '',
          patientInterception: '0',
          loginInterception: '1',
          engDetail: '',
        },
        {
          iconfont: 'ico_hospital_zxys',
          query: '',
          otherDetail: '',
          selectPatientPage: '0',
          title: '陪护服务',
          terminalType: 'my',
          gridLabel: '3',
          path: '',
          appId: '',
          id: 137680,
          detail: '',
          patientInterception: '0',
          loginInterception: '1',
          engDetail: '',
        },
      ],
      showNo: '5',
      typeName: '便民',
      id: 11234,
      modularId: '32326',
    },
  ]);

  const pageProps = ref(<{ entryType?: string }>{});
  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
  });

  onShow(() => {});

  const openShare = (item, type?) => {
    console.log('openShare', item, type);
  };
</script>

<style lang="scss" scoped>
  .container {
    padding: 0 32rpx 188rpx;
    min-height: 100vh;
    background-color: #fff;
  }
</style>
