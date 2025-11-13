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

  import { onLoad } from '@dcloudio/uni-app';
  import {
    GStores,
    PatientUtils,
    TBannerConfig,
    useTBanner,
    wait,
  } from '@/utils';
  import { deQueryForUrl, joinQuery } from '@/common';
  import { BASE_IMG } from '@/config/global';

  const pageProps = ref({} as any);
  const gStores = new GStores();
  const patientUtils = new PatientUtils();
  const plugin = requirePlugin('medicalLetterPlugins');

  const pluginCloudSignData1001094 = {
    s_hosCode: 'h001',
    s_appKey: '6e6aa3995f3c4f82bcc2aa12220895c0',
    s_appSecret: '6e6aa3995f3c4f82bcc2aa12220895c0',
    s_globalUrl: 'https://canew.xjtcm.com/hospital_pre',
  };
  /** 患者实名认证页面 */
  const pluginCloudSign1001094 = async (
    data: {
      s_idCard: string;
    } & BaseObject = {} as any
  ) => {
    uni.redirectTo({
      url: joinQuery('plugin://medicalLetterPlugins/idcard', {
        s_openId: gStores.globalStore.openId,
        s_type: '3',
        ...data,
        ...pluginCloudSignData1001094,
      }),

      events: {
        async userRealNameFace({ idCard, name }) {
          const { verifyResult: s_verifyResult } =
            await patientUtils.faceVerify({
              idCardNumber: idCard,
              name,
            });

          pluginCloudSign1001094({
            s_verifyResult,
            s_idCard: idCard,
          });
        },
      },
    });
  };
  /** 患者签署文件列表页面 */
  const pluginCloudSignDocument1001094 = async (s_idCard) => {
    uni.redirectTo({
      url: joinQuery('plugin://medicalLetterPlugins/signDocumentList', {
        s_openId: gStores.globalStore.openId,
        s_type: '3',
        s_documentStatus: '0',
        s_idCard,
        ...pluginCloudSignData1001094,
      }),
    });
  };

  const init = async () => {
    const { openId: s_openId } = gStores.globalStore;
    const { s_hosCode, s_appKey, s_appSecret, s_globalUrl } =
      pluginCloudSignData1001094;

    const { idCard: s_idCard } = await patientUtils.getPatientPersonalInfo({
      idCard: true,
    });

    const { code: code_1 } = await plugin.setDefultUser(
      s_hosCode,
      s_globalUrl,
      s_openId,
      s_appKey,
      plugin.baseApiUrl(),
      s_appSecret,
      s_idCard
    );

    if (code_1 === 1) {
      pluginCloudSignDocument1001094(s_idCard);
    } else {
      // 未实名
      pluginCloudSign1001094({
        s_idCard,
      });
    }
  };

  onLoad(async (opt: any) => {
    if (opt) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    }

    console.log('获取到参数', pageProps.value);
  });

  onMounted(async () => {
    uni.showLoading({ title: '加载中' });

    await wait(600);
    uni.hideLoading();
    init();
  });
</script>
