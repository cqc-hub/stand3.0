<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <view v-if="isSelf" class="mb24 flex flex-col items-center justify-center">
      <view class="pt70 safe-height"></view>
      <uv-qrcode :value="qrCode" :loading="false" size="380rpx" auto start />
      <!-- #ifndef H5 -->
      <button open-type="share" class="btn btn-primary mt70">
        <view class="g-flex-rc-cc footer-btn-content flex items-center">
          <view class="iconfont f48 mr24">&#xe704;</view>
          <view class="">转发给好友</view>
        </view>
      </button>

      <button
        @click="refreshPatList"
        class="btn btn-primary btn-plain btn-border mt24"
      >
        <view class="g-flex-rc-cc footer-btn-content flex items-center">
          <view class="iconfont f48 mr24">&#xe6ab;</view>
          <view class="">刷新就诊人</view>
        </view>
      </button>
      <!-- #endif -->
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  import { onLoad, onShareAppMessage } from '@dcloudio/uni-app';
  import { deQueryForUrl, joinQueryForUrl } from '@/common';
  import {
    apiAsync,
    LoginUtils,
    wait,
    GStores,
    PatientUtils,
    routerJump,
  } from '@/utils';
  import api from '@/service/api';

  const gStores = new GStores();
  const pageProps = ref(
    {} as {
      name: string;
      idCard: string;
      sign: string;
      isSelf?: '1'; // 远程人脸认证
    }
  );
  const patientUtils = new PatientUtils();

  const isSelf = computed(() => pageProps.value.isSelf === '1');
  const qrCode = ref('');

  const handlerVerify = async () => {
    const { idCard: idCardNumber, name, sign } = pageProps.value;
    const { pData } = await new LoginUtils().faceVerifyAndPData({
      idCardNumber,
      name,
    });

    await api
      .cacheAddPat({
        pData,
        sign,
      })
      .catch(async (err) => {
        const respCode = err?.respCode || err?.err?.respCode;

        if (respCode === 884801) {
          gStores.messageStore.closeMessage();
          await apiAsync(uni.showModal, {
            content:
              '患者存在建档记录但手机号不匹配，请到小程序绑定修改手机号！',
          });

          uni.reLaunch({
            url: '/pages/home/my',
          });
        }

        throw new Error(err?.message || '添加就诊人失败');
      });

    await apiAsync(uni.showModal, {
      title: '提示',
      content: '添加成功',
      showCancel: false,
    });

    uni.reLaunch({
      url: '/pages/home/home',
    });
  };

  const generateShareCode = () => {
    const { name, idCard, sign } = pageProps.value;
    qrCode.value = joinQueryForUrl(
      `https://h5.eheren.com/scan/${gStores.globalStore.sysCode}/addPatByScan`,
      {
        name,
        idCard,
        sign,
      }
    );
  };

  const refreshPatList = async () => {
    await patientUtils.getPatCardList();

    const pat = gStores.userStore.patList.find(
      (o) => o.patientName === pageProps.value.name
    );
    if (pat) {
      gStores.messageStore.showMessage('就诊人添加成功', 1500, {
        closeCallBack() {
          routerJump('/pages/home/home');
        },
      });
    } else {
      gStores.messageStore.showMessage(
        '就诊人添加失败, 请确认人脸验证时候成功',
        1500
      );
    }
  };

  onShareAppMessage((res) => {
    return {
      title: `${pageProps.value.name}的实名认证`,
      path: joinQueryForUrl('/pagesD/service/addPatByScan', {
        ...pageProps.value,
        isSelf: undefined,
      }),
    };
  });

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    uni.showLoading({});
    uni.setNavigationBarTitle({
      title: '新增就诊人',
    });
    await wait(600);

    const { name } = pageProps.value;
    if (name && !isSelf.value) {
      await handlerVerify();
    }

    uni.hideLoading();
    if (isSelf.value) {
      generateShareCode();
    }
  });
</script>

<style lang="scss" scoped></style>
