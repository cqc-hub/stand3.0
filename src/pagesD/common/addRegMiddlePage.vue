<template>
  <view class="cache">
    <view class="cache-img-container">
      <image
        mode="aspectFit"
        class="cache-img"
        :src="BASE_IMG + 'img_h5bg@3x.png'"
      />
    </view>
    <view class="cache-fixbottom">浙江和仁科技股份有限公司@技术支持</view>
  </view>
  <g-message />
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { BASE_IMG } from '@/config/global';
  import { GStores } from '@/utils';
  import { joinQuery, deQueryForUrl } from '@/common';
  import { beforeEach } from '@/router';
  import { checkLoginExpired } from '@/common/checkJump';
  import api from '@/service/api';


  const gStores = new GStores();
  const pageProps = ref(
    <
      {
        appointAdtStatus: string;
        [key: string]: any;
      }
    >{}
  );

  onLoad(async () => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));

    const pages = getCurrentPages();
    const fullPathNow = (pages[pages.length - 1] as any).$page
      .fullPath as string;
    beforeEach({
      url: fullPathNow,
      _isLogin: true,
      _isPatient: true,
    });

    const isExpired = await checkLoginExpired();
    if (isExpired) {
      uni.reLaunch({
        url: joinQuery('/pages/home/my', {
          _isOutLogin: '1',
          _url: encodeURIComponent(fullPathNow),
        }),
      });
    }
    gStores.messageStore.showMessage('正在加号请稍等...', 3000);
    await handleData();
  });

  const handleData = async () => {
    const args = {
      addFlag: '1',
      addedNum: 5,
      alternateData: 'eyJhcHBJZCI6IjEwMDEwMTciLCJwYWdlSWQiOiI2ODU3ODY1In0=',
      ampm: '1',
      cardNumber: '1398266480',
      categor: '1',
      categorName: '普通号',
      clinicalType: '1',
      deptName: '儿科',
      disNo: '001',
      docName: '张医生',
      fee: '50.00',
      herenId: 6857865,
      hisResult: 'SUCCESS',
      hosDeptId: 'A01020170000',
      hosDocId: 'D100001',
      hosId: 'H1001',
      hosOrderId: '2026020610000341',
      hrRequestId: 'REQ123456',
      numId: 'N98765',
      patientId: '1398266480',
      preInqyiry: {},
      promptMessage: '请空腹就诊',
      schDate: '2026-02-10',
      schId: 'SCH88888',
      schQukCategor: '普通门诊',
      source: '19',
      sysCode: '1001017',
      timeDesc: '13:00-13:15',
      visitingArea: '门诊楼3楼305室',
    };
    const {
      result: { orderId },
    } = await api.netAddHosSch(args);
    gStores.messageStore.showMessage('加号成功', 3000, {
      closeCallBack: () => {
        uni.reLaunch({
          url: joinQuery('pagesA/MyRegistration/RegDetail', {
            orderId,
          }),
        });
      },
    });
  };
</script>

<style scoped lang="scss">
  .cache {
    width: 100%;
    height: 100vh;
    background-color: #fff;

    .cache-img-container {
      display: flex;
      justify-content: center;
      position: relative;
      top: 240upx;
    }
    .cache-fixbottom {
      position: absolute;
      bottom: 144upx;
      width: 100%;
      text-align: center;

      font-size: var(--hr-font-size-xxxs);
      font-weight: 400;
      color: #999;
    }
  }
</style>
