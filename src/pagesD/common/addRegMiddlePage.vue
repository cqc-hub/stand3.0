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
  import globalGl from '@/config/global';
  import { beforeEach } from '@/router';
  import {
    checkLoginExpired,
    checkLogin,
    checkPatient,
  } from '@/common/checkJump';
  import api from '@/service/api';

  const gStores = new GStores();
  const pageProps = ref(
    <
      {
        cardNumber: string;
        hosorderId: string;
        numId: string;
        [key: string]: any;
      }
    >{}
  );

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));

    const pages = getCurrentPages();
    const fullPathNow = (pages[pages.length - 1] as any).$page
      .fullPath as string;
    beforeEach({
      url: fullPathNow,
      _isLogin: true,
      _isPatient: true,
    });
    if (!gStores.globalStore.isLogin) {
      await checkLogin();
    }
    await checkPatient();
    const isExpired = await checkLoginExpired();
    if (isExpired) {
      uni.reLaunch({
        url: joinQuery('/pages/home/my', {
          _isOutLogin: '1',
          _url: encodeURIComponent(fullPathNow),
        }),
      });
    }
    const pat = gStores.userStore.patList.find(
      (item) => item.cardNumber === pageProps.value.cardNumber
    );
    if (!pat) {
      gStores.messageStore.showMessage(
        `当前账户未绑定就诊号为${pageProps.value.cardNumber}的患者，请先绑定`,
        1500,
        {
          closeCallBack: () => {
            uni.reLaunch({
              url:
                globalGl.addPersonUrl +
                '?_directUrl=' +
                encodeURIComponent(fullPathNow),
            });
          },
        }
      );
      return;
    }
    gStores.messageStore.showMessage('正在加号请稍等...', 1500);
    await handleData(pat);
  });

  const handleData = async (pat) => {
    const { patientId, cardNumber } = pat!;
    const args = {
      patientId,
      ...pageProps.value,
    };
    const {
      result: { orderId },
    } = await api.netAddHosSch(args);
    gStores.messageStore.showMessage('加号成功', 1500, {
      closeCallBack: () => {
        uni.reLaunch({
          url: joinQuery('/pagesA/MyRegistration/RegDetail', {
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
