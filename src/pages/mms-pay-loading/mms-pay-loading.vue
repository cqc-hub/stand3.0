<template>
  <view class="g-page bg-white">
    <g-message />

    <view class="g-container flex justify-center pt70">
      <image
        mode="aspectFit"
        class="cache-img pt70"
        :src="BASE_IMG + 'img_h5bg@3x.png'"
      />
    </view>
    <view class="color-888 f24 text-center pb70">
      浙江和仁科技股份有限公司@技术支持
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import {
    deQueryForUrl,
    getLocalStorage,
    joinQueryForUrl,
    removeLocation,
    setLocalStorage,
  } from '@/common';
  import { apiAsync, GStores, wait } from '@/utils';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { BASE_IMG } from '@/config/global';
  import { useCacheStore } from '@/stores';

  const gStores = new GStores();
  const cacheStore = useCacheStore();
  const pageProps = ref(
    {} as {
      payParams: string;
    }
  );

  const payParams = ref(
    {} as {
      pay_url: string;
      mixTradeNo: string;
      pay_appid: string;
      timeStamp?: string;
      nonceStr?: string;
      package?: string;
      signType?: string;
      paySign?: string;
    }
  );
  const resultConfig = ref(
    {} as {
      // 取消、失败
      cancelUrl: string;
      // 成功
      successUrl: string;
    }
  );

  const wxRequestMedicalInsurancePay = async () => {
    const {
      mixTradeNo,
      timeStamp,
      nonceStr,
      package: _package,
      signType,
      paySign,
    } = payParams.value;

    console.log('------拿到医保参数');
    console.log({
      ...payParams.value,
      mixTradeNo,
      timeStamp,
      nonceStr,
      package: _package,
      signType,
      paySign,
    });
    const { confirm } = await apiAsync(uni.showModal, {
      content: '即将打开医保支付?',
    });

    if (!confirm) {
      payCancel();
      return;
    }

    await apiAsync(wx.requestMedicalInsurancePay, {
      ...payParams.value,
      mixTradeNo,
      timeStamp,
      nonceStr,
      package: _package,
      signType,
      paySign,
    }).catch((r) => {
      payCancel();
      console.error(r);
      throw new Error(r);
    });

    payAfter();
  };

  const wxMedicalProgram = () => {
    const { pay_appid, pay_url } = payParams.value;
    wx.navigateToMiniProgram({
      appId: pay_appid,
      path: decodeURIComponent(pay_url),
      success(res) {
        // 打开成功
        console.log('navigateToMiniProgram success:', res);
        setLocalStorage({
          payed1001048: '1',
        });
      },
      fail(error) {
        console.log('navigateToMiniProgram fail:', error);
        payCancel();
      },
      complete(res) {
        console.log('navigateToMiniProgram complete:', res);
      },
    });
  };

  const suffixUrl = (url: string) => {
    if (url && !url.startsWith('/')) {
      url = `/${url}`;
    }

    return url;
  };
  const payAfter = async () => {
    uni.showLoading({});
    await wait(6000);
    uni.hideLoading();
    uni.reLaunch({
      url: resultConfig.value.successUrl,
    });
  };
  const payCancel = () => {
    uni.reLaunch({
      url: resultConfig.value.cancelUrl,
    });
  };

  onLoad(async (opt) => {
    uni.showLoading({});
    resultConfig.value = cacheStore.cacheData2;

    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));

      try {
        payParams.value = JSON.parse(
          decodeURIComponent(pageProps.value.payParams)
        );
      } catch (error) {
        payParams.value = pageProps.value.payParams as any;
      }
    }

    console.log('获取到参数', pageProps.value);
    await wait(60);
    uni.hideLoading();

    const { mixTradeNo, pay_url, pay_appid } = payParams.value;
    if (gStores.globalStore.ev === 'wx') {
      if (pay_url && pay_appid) {
        const { confirm } = await apiAsync(uni.showModal, {
          content: '即将打开医保小程序?',
        });

        if (!confirm) {
          payCancel();
          return Promise.reject('客户取消支付');
        }

        wxMedicalProgram();
      } else if (mixTradeNo) {
        wxRequestMedicalInsurancePay();
      }
    }
  });

  onShow(async () => {
    const { scene } = gStores.globalStore.appShowData;
    await wait(200);

    // 跳第三方小程序拉起支付后没法判断是否付钱了
    if (scene === 1038 && getLocalStorage('payed1001048')) {
      console.log('object');
      removeLocation('payed1001048');
      payCancel();
    }

    // if (
    //   scene === 1038 &&
    //   getLocalStorage('payed1001048') &&
    //   getLocalStorage('resultConfig')
    // ) {
    //   await wait(200);
    //   const resultConfig = JSON.parse(uni.getStorageSync('resultConfig'));
    //   removeLocation('resultConfig');
    //   removeLocation('payed1001048');

    //   if (
    //     resultConfig.orderStatusRedirectUrl ==
    //     '/pagesC/cloudHospital/cloudHospital'
    //   ) {
    //     const resultConfigQuery = JSON.parse(
    //       decodeURIComponent(uni.getStorageSync('resultConfigQuery'))
    //     );
    //     uni.removeStorage({
    //       key: 'resultConfigQuery',
    //     });

    //     uni.navigateTo({
    //       url: joinQueryForUrl(
    //         resultConfigQuery.path,
    //         resultConfigQuery.successQuery
    //       ),
    //     });
    //   } else {
    //     uni.reLaunch({
    //       url: resultConfig.orderStatusRedirectUrl,
    //     });
    //   }
    // }

    // 三方医保回来也会携带authcode参数， 但是过期..
    gStores.globalStore.onAppShow({});
  });
</script>
