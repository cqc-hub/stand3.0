<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <g-flag isShowFg typeFg="79" />
    <view class="container" scroll-y>
      <view v-if="!isUseFaceVerify" class="sfz-container m32">
        <image
          :src="idCardUrl || $global.BASE_IMG + 'img_sfz_zhengmian@3x.png'"
          @click="chooseIdCard"
          class="sfz-img"
          mode="widthFix"
        />
      </view>

      <g-form
        v-model:value="formData"
        @submit="formSubmit"
        bodyBold
        ref="gform"
      />
    </view>

    <g-message />
    <!-- #ifdef MP-ALIPAY -->
    <canvas
      v-show="false"
      :width="imgCanvas.imgWidth"
      :height="imgCanvas.imgHeight"
      id="canvasForBase64"
      class="my-display-none"
    />
    <!-- #endif -->
    <view class="g-footer">
      <button @click="gform.submit" class="btn btn-primary flex1">保存</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref, nextTick, computed } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import type { TInstance } from '@/components/g-form/index';
  import { deQueryForUrl } from '@/common/utils';
  import {
    GStores,
    useOcr,
    base64Src,
    ServerStaticData,
    ISystemConfig,
    PatientUtils,
    routerJump,
  } from '@/utils';
  import { pickTempItem } from './utils';

  import api from '@/service/api';
  import { useCacheStore } from '@/stores';

  const gStores = new GStores();
  const cacheStore = useCacheStore();
  const patientUtils = new PatientUtils();

  const pageConfig = ref(<ISystemConfig['person']>{});
  const pageProps = ref(
    <
      {
        patientPhone: string;
        idCard: string;
        patientName: string;
        idType: string;
        from?: 'addMedical';
      }
    >{}
  );
  const gform = ref<any>('');
  const idCardUrl = ref('');
  let formList: TInstance[] = [];
  const imgCanvas = ref({
    imgWidth: 0,
    imgHeight: 0,
  });
  const isComplete = ref(false);
  const isUseFaceVerify = computed(() => {
    return pageConfig.value.useFaceVerifyInChangePhone === '1';
  });

  const formData = ref<BaseObject>({
    // idType: '01',
    patientName: '',
    patientPhone: '',
    idCard: '',
    idCardOcrEn: '',
    patientNameOcrEn: '',
  });
  const formSubmit = async () => {
    if (gStores.globalStore.sysCode === '1001054') {
      await dealSubmitWithXY();
    } else {
      await dealSubmit();
    }

    if (pageProps.value.from === 'addMedical') {
      await patientUtils.addRelevantPatient({
        ...cacheStore.cacheData,
        ...formData.value,
        verifyType: '1&bk',
      });

      await patientUtils.getPatCardList();
      routerJump('/pagesA/medicalCardMan/medicalCardMan');
      return;
    }

    gStores.messageStore.showMessage('信息核验成功，已为您修改手机号！', 3000, {
      closeCallBack() {
        uni.navigateBack({
          delta: 1,
        });
      },
    });
  };

  const dealSubmit = async () => {
    const { patientName, idCard, idType, patientPhone } = formData.value;
    const { source } = gStores.globalStore.browser;

    const args = {
      idCard,
      idType,
      patientName,
      patientPhone,
      source,
      pdata: '',
    };

    if (isUseFaceVerify.value) {
      const { pData } = await patientUtils.faceVerifyAndPData({
        name: patientName,
        idCardNumber: idCard,
      });

      args.pdata = pData;

      return await api.mofHosPhone(args);
    } else {
      args.pdata = formData.value.pdata;
      return await api.mofHosPhone(args);
    }

    throw new Error('未实现 ocr 功能');
  };

  // 咸阳老逻辑, 单独处理, 是 ocr 的
  const dealSubmitWithXY = async () => {
    const { source } = gStores.globalStore.browser;

    const requestArg = {
      source,
      ...formData.value,
    };

    // #ifdef MP-ALIPAY
    await api.mdPhoneById(requestArg);
    // #endif

    // #ifdef MP-WEIXIN
    await api.modifyHosPhoneByIdNum(requestArg);
    // #endif
  };

  const chooseIdCard = async () => {
    const res = await useOcr(true, {
      aliThroughByEnd: gStores.globalStore.sysCode !== '1001054',
      imgCanvas,
    });
    const { image, name, idCard, idCardOcrEn, patientNameOcrEn, pdata } = res;

    let iswx = false;
    // #ifdef MP-WEIXIN
    iswx = true;
    // #endif
    if (image) {
      if (iswx) {
        idCardUrl.value = await base64Src(image);
      } else {
        idCardUrl.value = image;
      }
      isComplete.value = true;
      formData.value.pdata = pdata;
      formData.value.idCard = idCard;
      formData.value.patientName = name;
      formData.value.idCardOcrEn = idCardOcrEn;
      formData.value.patientNameOcrEn = patientNameOcrEn;

      gform.value.clearItemWarning('idCard');
    }
  };

  const init = () => {
    formList = pickTempItem([
      'patientName',
      'idType',
      'idCard',
      'patientPhone',
    ]);

    const idTypeItem = formList.find((o) => o.key === 'idType')!;
    // idTypeItem.disabled = true;
    idTypeItem.showSuffixArrowIcon = false;

    formList.map((o) => {
      const { key } = o;

      o.disabled = true;
      o.placeholder = ' ';

      if (key == 'idCard' && !isUseFaceVerify.value) {
        o.validator = async (v) => {
          if (!isComplete.value) {
            return {
              success: false,
              message: `请先上传本人身份证再进行验证`,
            };
          }

          if (v === pageProps.value.idCard && isComplete.value) {
            return {
              success: true,
            };
          }

          return {
            success: false,
            message: `请上传${pageProps.value.patientName}的本人身份证进行验证`,
          };
        };
      }
    });

    Object.assign(formData.value, pageProps.value);

    nextTick(() => {
      gform.value.setList(formList);
    });
  };

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    pageConfig.value = await ServerStaticData.getSystemConfig('person');
  });

  onMounted(() => {
    init();
  });
</script>

<style lang="scss" scoped>
  .container {
    height: 1px;
    flex: 1;
    overflow-y: scroll;
  }

  .sfz-container {
    border-radius: 12rpx;
    overflow: hidden;
  }

  .sfz-img {
    width: 100%;
    height: 100%;
  }
</style>
