<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-page"
  >
    <g-flag isShowFg typeFg="79" />
    <view class="container" scroll-y>
      <view class="sfz-container m32">
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
  import { onMounted, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import type { TInstance } from '@/components/g-form/index';
  import { deQueryForUrl } from '@/common/utils';
  import api from '@/service/api';

  import {
    GStores,
    routerJump,
    ServerStaticData,
    wait,
    useOcr,
    base64Src,
  } from '@/utils';

  import {
    pickTempItem,
    formKey,
    TFormKeys,
    getDefaultFormData,
    formatterSubPatientData,
    loginAuthAlipay,
  } from './utils';

  const gStores = new GStores();
  const pageProps = ref(
    <
      {
        patientPhone: string;
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

  const formData = ref<BaseObject>({
    idType: '01',
    idCardOcrEn: '',
    patientNameOcrEn: '',
  });
  const formSubmit = async () => {
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

    gStores.messageStore.showMessage('信息核验成功，已为您修改手机号！', 3000, {
      closeCallBack() {
        uni.navigateBack({
          delta: 1,
        });
      },
    });
  };

  const chooseIdCard = async () => {
    const res = await useOcr(true);
    const { image, name, idCard, idCardOcrEn, patientNameOcrEn } = res;

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

      formData.value.idCard = idCard;
      formData.value.patientName = name;
      formData.value.idCardOcrEn = idCardOcrEn;
      formData.value.patientNameOcrEn = patientNameOcrEn;
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
      o.disabled = true;
      o.placeholder = '上传身份证自动填入';
    });

    Object.assign(formData.value, pageProps.value);

    gform.value.setList(formList);
  };

  onLoad((opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
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
