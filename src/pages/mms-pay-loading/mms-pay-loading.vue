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

  const gStores = new GStores();
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
    }
  );
  const resultConfig = ref(
    {} as {
      // 取消、失败
      cancelAuthRedirectUrl: string;
      // 成功
      orderStatusRedirectUrl: string;
    }
  );

  const wxRequestMedicalInsurancePay = async () => {
    const { mixTradeNo } = payParams.value;

    wx.requestMedicalInsurancePay({
      mixTradeNo,
      success(e) {
        console.log('支付成功了', e);
      },
    });

    await apiAsync(wx.requestMedicalInsurancePay, {
      mixTradeNo,
    }).catch((r) => {
      payCancel();
      console.error(r);
    });
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

  const payAfter = () => {};
  const payCancel = () => {
    console.log('我自信了');
    console.log(resultConfig.value);

    uni.reLaunch({
      url: resultConfig.value.cancelAuthRedirectUrl,
      complete(r) {
        console.log(r);
      },
    });
  };

  onLoad(async (opt) => {
    uni.showLoading({});

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

    try {
      resultConfig.value = JSON.parse(getLocalStorage('resultConfig'));
    } catch (error) {
      resultConfig.value = getLocalStorage('resultConfig');
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
    const globalStore = gStores.globalStore;

    if (
      scene === 1038 &&
      ['1001048', '1001084'].includes(globalStore.sysCode) &&
      getLocalStorage('payed1001048') &&
      getLocalStorage('resultConfig')
    ) {
      await wait(200);
      const resultConfig = JSON.parse(uni.getStorageSync('resultConfig'));
      removeLocation('resultConfig');
      removeLocation('payed1001048');

      if (
        resultConfig.orderStatusRedirectUrl ==
        '/pagesC/cloudHospital/cloudHospital'
      ) {
        const resultConfigQuery = JSON.parse(
          decodeURIComponent(uni.getStorageSync('resultConfigQuery'))
        );
        uni.removeStorage({
          key: 'resultConfigQuery',
        });

        uni.navigateTo({
          url: joinQueryForUrl(
            resultConfigQuery.path,
            resultConfigQuery.successQuery
          ),
        });
      } else {
        uni.reLaunch({
          url: resultConfig.orderStatusRedirectUrl,
        });
      }
    }
  });
</script>
