<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <g-flag :typeFg="'1294'" isShowFg />
    <view v-if="isSelf" class="mb24 flex flex-col items-center justify-center">
      <view class="pt70 safe-height"></view>
      <uv-qrcode :value="qrCode" :loading="false" size="380rpx" auto start />
      <!-- #ifndef H5 -->
      <button open-type="share" class="btn btn-primary mt70">
        <view class="g-flex-rc-cc footer-btn-content flex items-center">
          <view class="iconfont f48 mr24">&#xe704;</view>
          <view class="">发给就诊人，请他人脸识别</view>
        </view>
      </button>

      <button
        @click="refreshPatList"
        class="btn btn-primary btn-plain btn-border mt24"
      >
        <view class="g-flex-rc-cc footer-btn-content flex items-center">
          <view class="iconfont f48 mr24">&#xe6ab;</view>
          <view class="">对方已核验，更新认证状态</view>
        </view>
      </button>
      <!-- #endif -->
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  import { onLoad, onShow,onShareAppMessage } from '@dcloudio/uni-app';
  import { deQueryForUrl, joinQueryForUrl } from '@/common';
  import {
    apiAsync,
    LoginUtils,
    wait,
    GStores,
    PatientUtils,
    routerJump,
    ISystemConfig,
    ServerStaticData,
  } from '@/utils';
  import api from '@/service/api';
  const gStores = new GStores();
  const pageProps = ref(
    {} as {
      name: string;
      idCard: string;
      sign: string;
      phone?: string;
      isSelf?: '1'; // 远程人脸认证
    }
  );
  const patientUtils = new PatientUtils();
  const pageConfig = ref(<ISystemConfig['person']>{});

  const isSelf = computed(() => pageProps.value.isSelf === '1');
  const qrCode = ref('');

  const handlerVerify = async () => {
    const { idCard: idCardNumber, name, sign } = pageProps.value;
    const { isChangeHosPhoneWay, isCanChangeHosPhone, isFaceRemote } =
      pageConfig.value;
    let flag = false;
    const { pData } = await new LoginUtils()
      .faceVerifyAndPData({
        idCardNumber,
        name,
      })
      .catch((err) => {
        gStores.messageStore.showMessage(err?.message || '人脸验证失败',3000,{
          closeCallBack: () => {
            uni.reLaunch({
          url: '/pages/home/home',
        });
          }
        });
        
        throw new Error(err);
      });
    //人脸识别修改手机号
    if (isFaceRemote !== '1' && isChangeHosPhoneWay?.includes('remoteFace')) {
      flag = await editPhone(pData);
    } else {
      //人脸识别建档
      await api
        .cacheAddPat({
          pData,
          sign,
        })
        .catch(async (err) => {
          const respCode = err?.respCode || err?.err?.respCode;

          if (respCode === 884801) {
            gStores.messageStore.closeMessage();

            //人脸识别修改手机号
            if (
              isCanChangeHosPhone === '1' &&
              isChangeHosPhoneWay?.includes('remoteFace')
            ) {
              const { confirm } = await apiAsync(uni.showModal, {
                content: '患者存在建档记录但手机号不匹配，是否立即修改？',
              });

              if (confirm) {
                flag = await editPhone(pData);
              }
            } else {
              flag = false;
              await apiAsync(uni.showModal, {
                content:
                  '患者存在建档记录但手机号不匹配，请到小程序绑定修改手机号！',
              });
            }
          }
        });
    }

    flag &&
      (await apiAsync(uni.showModal, {
        title: '提示',
        content: '添加成功',
        showCancel: false,
      }));

    uni.reLaunch({
      url: '/pages/home/home',
    });
  };

  const editPhone = async (pData) => {
    const { idCard: idCardNumber, name, sign } = pageProps.value;
    await api.mofHosPhone({
      idCard: idCardNumber,
      patientName: name,
      patientPhone: pageProps.value.phone || '',
      pdata: pData,
      source: gStores.globalStore.browser.source,
      idType: '01',
    });
    await api
      .cacheAddPat({
        pData,
        sign,
      })
      .catch(async (err) => {
        await apiAsync(uni.showModal, {
          content: err?.message || '添加就诊人失败',
        });
         routerJump('/pages/home/home');
        throw new Error(err);
      });
    return true;
  };

  const generateShareCode = () => {
    const { name, idCard, sign, phone } = pageProps.value;
    qrCode.value = joinQueryForUrl(
      `https://h5.eheren.com/scan/${gStores.globalStore.sysCode}/addPatByScan`,
      {
        name,
        idCard,
        sign,
        phone,
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

  onShow(async () => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const propsDeCode=deQueryForUrl(deQueryForUrl(currentPage.options))
    if(JSON.stringify(propsDeCode)==JSON.stringify(pageProps.value)){
      return
    }
    console.log('路由参数不同，判断从其他链接、二维码进入，重新初始化，参数：',propsDeCode)
    pageProps.value =propsDeCode;  
    pageConfig.value = await ServerStaticData.getSystemConfig('person');

    uni.showLoading({ title: '加载中' });
    uni.setNavigationBarTitle({
      title: '新增就诊人',
    });
    await wait(600);

    const { name } = pageProps.value;
    if (name && pageProps.value.isSelf !== '1') {
      await handlerVerify();
    }

    uni.hideLoading();
    if (isSelf.value) {
      generateShareCode();
    }
    
  })

  // onLoad(async (opt) => {
  //   pageProps.value = deQueryForUrl(deQueryForUrl(opt));
  //   pageConfig.value = await ServerStaticData.getSystemConfig('person');

  //   uni.showLoading({ title: '加载中' });
  //   uni.setNavigationBarTitle({
  //     title: '新增就诊人',
  //   });
  //   await wait(600);

  //   const { name } = pageProps.value;
  //   if (name && pageProps.value.isSelf !== '1') {
  //     await handlerVerify();
  //   }

  //   uni.hideLoading();
  //   if (isSelf.value) {
  //     generateShareCode();
  //   }
  // });
</script>

<style lang="scss" scoped></style>
