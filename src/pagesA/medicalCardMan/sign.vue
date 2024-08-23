<template>
  <view class="g-page">
    <view class="g-container p32">
      <view class="sign-agreement mb64">
        <rich-text :nodes="content"></rich-text>
      </view>

      <view @click="authClick" class="btn btn-primary mb32">
        同意授权，方便就诊
      </view>
      <view
        @click="routerJump('/pages/home/home')"
        class="btn btn-border btn-primary btn-plain color-blue"
      >
        不授权，更愿意排队交费
      </view>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import { onLoad, onShow } from '@dcloudio/uni-app';
  import {
    AliPayLoginHandler,
    GStores,
    routerJump,
    apiAsync,
    wait,
  } from '@/utils';
  import api from '@/service/api';

  const gStores = new GStores();
  const content = ref('');

  const authClick = async () => {
    let {
      phoneNum,
      patChoose: { patientId },
      cacheUser,
    } = gStores.userStore;
    const {
      browser: { source },
      openId,
    } = gStores.globalStore;
    let channel = 'WX_JSAPI_SIGN';
    let payType = 'WX_MINI';
    // await new AliPayLoginHandler().handlerAuth()

    // #ifdef MP-WEIXIN
    channel = 'WX_MINI_SIGN';
    // #endif

    // #ifdef MP-ALIPAY
    channel = 'ALI_MINI_SIGN';
    payType = 'ALI_MINI';

    if (!cacheUser.certNo) {
      await new AliPayLoginHandler().handlerAuth();
    }

    // #endif

    const args = {
      channel,
      openId,
      userId: openId,
      patientId,
      source,
      payType,
      phone: phoneNum,
      buyerAccount: cacheUser.mobile,
      userIdCard: cacheUser.certNo,
      userName: cacheUser.userName,
      showUrl: '/pagesA/medicalCardMan/sign?isBack=1',
    };

    const {
      result: { invokeData },
    } = await api.applyForSign(args);

    // #ifdef MP-WEIXIN
    await apiAsync(wx.navigateToMiniProgram, {
      appId: 'wxbd687630cd02ce1d',
      path: 'pages/index/index',
      extraData: invokeData,
    });

    // #endif

    // #ifdef MP-ALIPAY
    await apiAsync(my.paySignCenter, {
      signStr: encodeURIComponent(invokeData.signStr),
    });

    routerJump('/pages/home/home');
    // #endif
  };

  onShow(async () => {
    // 微信授权回来
    if (
      gStores.globalStore.appShowData.referrerInfo?.extraData?.return_code ===
      'SUCCESS'
    ) {
      gStores.globalStore.onAppShow({});
      await wait(60);
      routerJump('/pages/home/home');
    }
  });

  onLoad(async () => {
    gStores.getSysAppMore('1203').then(({ content: _content }) => {
      content.value = _content;
    });
  });
</script>

<style lang="scss" scoped>
  .sign-agreement {
    padding: 30rpx;
    border-radius: 16px;
    box-shadow: 0px 4px 16px 0px rgba(215, 215, 215, 0.6);
  }
</style>
