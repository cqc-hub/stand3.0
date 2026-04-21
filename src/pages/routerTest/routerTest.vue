<template>
  <view class="g-page">
    <view class="safe-height"></view>
    <view class="safe-height"></view>
    <view class="safe-height"></view>
    <view class="safe-height"></view>
    <view class="safe-height"></view>
    <g-form
      v-model:value="formData"
      @submit="formSubmit"
      @change="formChange"
      bodyBold
      ref="gform"
    />
    {{ formData }}
  </view>
</template>

<script lang="ts" setup>
  import { apiAsync, GStores, wait } from '@/utils';
  import { onLoad } from '@dcloudio/uni-app';
  import { onMounted, ref } from 'vue';
  const props = withDefaults(
    defineProps<{
      color?: string;
    }>(),
    {
      color: 'var(--hr-brand-color-6)',
    }
  );
  const gStores = new GStores();
  const gform = ref<any>('');
  const formData = ref<BaseObject>({});
  const formSubmit = (e) => {
    console.log(e);
  };
  const formChange = async (e) => {
    console.log(e);
    const { item, value } = e;
    uni.setClipboardData({
      data: 'cqc',
    });

    if (item.key === 'patientType') {
      await wait(60);
      if (value === '01') {
        gform.value.setList([
          {
            required: true,
            showSuffixArrowIcon: true,
            label: '证件类型',
            placeholder: '请选择',
            key: 'patientType',
            field: 'select',
            options: [],
            autoOptions: 'idTypeTerms',
            labelWidth: '220rpx',
          },
          {
            required: true,
            label: '证件号码',
            field: 'input-text',
            placeholder: '请输入',
            key: 'idCard',
            labelWidth: '220rpx',
            disabled: false,
          },
          {
            required: true,
            label: 'name',
            field: 'input-text',
            placeholder: '请输入',
            key: 'name',
            labelWidth: '220rpx',
            disabled: true,
          },
        ]);
      } else {
        gform.value.setList([
          {
            required: true,
            showSuffixArrowIcon: true,
            label: '证件类型',
            placeholder: '请选择',
            key: 'patientType',
            field: 'select',
            options: [],
            autoOptions: 'idTypeTerms',
            labelWidth: '220rpx',
          },
          {
            required: true,
            label: '证件号码',
            field: 'input-text',
            placeholder: '请输入',
            key: 'idCard',
            labelWidth: '220rpx',
            disabled: true,
          },
          {
            required: true,
            label: 'name',
            field: 'input-text',
            placeholder: '请输入',
            key: 'name',
            labelWidth: '220rpx',
          },
        ]);
      }
    }
    console.log(formData.value);
  };

  onLoad(async () => {
    formData.value.idCard = '332039293';
    formData.value.otherData = 'oopoposss';
    await apiAsync(wx.login, {});
    const r = await apiAsync(wx.getWeRunData, {
      complete(e) {
        console.log(e);
      }
    });
    console.log(r);
  });
  onMounted(() => {
    gform.value.setList([
      {
        required: true,
        showSuffixArrowIcon: true,
        label: '证件类型',
        placeholder: '请选择',
        key: 'patientType',
        field: 'select',
        options: [],
        autoOptions: 'idTypeTerms',
        labelWidth: '220rpx',
      },
      {
        required: true,
        label: '证件号码',
        field: 'input-text',
        placeholder: '请输入',
        key: 'idCard',
        labelWidth: '220rpx',
        disabled: true,
      },
      {
        required: true,
        label: 'name',
        field: 'input-text',
        placeholder: '请输入',
        key: 'name',
        labelWidth: '220rpx',
      },
    ]);
  });
</script>
