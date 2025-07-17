<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <view class="container" scroll-y>
      <view class="form-container">
        <g-form
          v-model:value="formData"
          @submit="formSubmit"
          bodyBold
          ref="gform"
        />
        {{ formData }}
      </view>

      <g-flag typeFg="65" isShowFgTip />
    </view>

    <!-- #ifdef MP-ALIPAY -->
    <canvas
      v-show="false"
      :width="imgCanvas.imgWidth"
      :height="imgCanvas.imgHeight"
      id="canvasForBase64"
      class="my-display-none"
    />
    <!-- #endif -->

    <view class="footer">
      <button @click="gform.submit" class="btn btn-primary">提交</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { GStores } from '@/utils';
  import { IPageProps } from './utils/regConfirm';
  import { deQueryForUrl } from '@/common';
  import { TInstance } from '@/components/g-form';

  const gStores = new GStores();
  const pageProps = ref({} as IPageProps);
  const imgCanvas = ref({
    imgWidth: 0,
    imgHeight: 0,
  });

  const gform = ref<any>('');
  const gformList = ref([] as TInstance[]);
  const formData = ref({} as any);
  const formSubmit = async ({ data }) => {};

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl<IPageProps>(deQueryForUrl(opt));
  });

  onMounted(() => {
    gformList.value = [
      {
        label: '所患疾病',
        required: true,
        field: 'input-text',
        key: 'illName',
        placeholder: '如未确诊请填写尚未确诊',
        showRequireIcon: true,
      },
      {
        label: '病情描述',
        required: true,
        field: 'input-text',
        inputType: 'textarea',
        key: 'illDescribe',
        placeholder: '填写病情描述,如疾病名称、症状、治疗经历及想要获得的帮助',
        direction: 'horizontal',
        showRequireIcon: true,
      },
      {
        label: '添加病历照片',
        field: 'file-image',
        key: 'ceshiData',
        imgLimit: 6,
        direction: 'horizontal',

      },
    ];
    gform.value.setList(gformList.value);
  });
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 1px;
    flex: 1;
    overflow-y: scroll;
  }

  .footer {
    background-color: var(--h-color-white);
    padding: 32rpx 32rpx 68rpx;
  }
</style>
