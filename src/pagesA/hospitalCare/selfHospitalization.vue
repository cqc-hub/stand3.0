<template>
  <view class="g-page">
    <view class="mb32">
      <g-choose-pat @choose-pat="choosePat" />
    </view>

    <view class="container" scroll-y>
      <g-form
        v-model:value="formData"
        @submit="formSubmit"
        bodyBold
        ref="gform"
      />
    </view>

    <view class="p32">
      <button @click="gform.submit" class="btn btn-primary">保存预约</button>
    </view>
    <g-message />
  </view>
</template>
<script lang="ts" setup>
  import { onMounted, ref, computed } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { deQueryForUrl } from '@/common';
  import { TInstance } from '@/components/g-form';
  import { GStores, apiAsync } from '@/utils';

  import dayjs from 'dayjs';
  import api from '@/service/api';

  const pageProps = ref(
    <
      {
        appointAdtStatus: string;
        [key: string]: any;
      }
    >{}
  );
  const gform = ref<any>('');
  const gStores = new GStores();
  const formData = ref<BaseObject>({});

  const formSubmit = async ({ data }) => {
    data.isTakeAnticoagulantDrugs =
      (data.isTakeAnticoagulantDrugs && '0') || '1';
    data.maritalStatus = (data.maritalStatus && '已婚') || '未婚';

    const { confirm } = await apiAsync(uni.showModal, {
      content: '确定进行提交?',
    });

    if (!confirm) {
      return;
    }

    await api.addHosCardInfo({ ...data });
    gStores.messageStore.showMessage(`住院证成功`, 3000, {
      closeCallBack() {
        uni.navigateBack({
          delta: 1,
        });
      },
    });
  };
  const phoneRule = [
    {
      message: '请确认手机号是否有误',
      rule: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
    },
  ];
  const labelWidth = '250rpx';
  const renderListBase: TInstance[] = [
    {
      labelWidth,
      required: true,
      showRequireIcon: true,
      disabled: true,
      label: '患者姓名',
      field: 'input-text',
      placeholder: '请输入',
      key: 'patientName',
    },
    {
      labelWidth,
      required: true,
      showRequireIcon: true,
      label: '患者性别',
      field: 'select',
      placeholder: '请选择',
      key: 'sex',
      options: [
        {
          label: '男',
          value: '男',
        },
        {
          label: '女',
          value: '女',
        },
      ],
    },
    {
      labelWidth,
      required: true,
      showRequireIcon: true,
      disabled: true,
      label: '证件号码',
      field: 'input-text',
      placeholder: '请输入',
      key: 'idCard',
    },
    {
      labelWidth,
      showRequireIcon: true,
      required: true,
      disabled: true,
      label: '手机号',
      field: 'input-text',
      placeholder: '请输入',
      key: 'patientPhone',
    },
    {
      labelWidth,
      required: true,
      showRequireIcon: true,
      label: '婚姻状况',
      field: 'select',
      placeholder: '请选择',
      key: 'maritalStatus',
      options: [
        {
          label: '已婚',
          value: '已婚',
        },
        {
          label: '未婚',
          value: '未婚',
        },
      ],
    },
    {
      labelWidth,
      required: true,
      showRequireIcon: true,
      label: '第二联系人',
      field: 'input-text',
      placeholder: '请输入手机号',
      key: 'phoneNumber',
      rule: phoneRule,
    },
    {
      labelWidth,
      required: true,
      showRequireIcon: true,
      label: '工作单位',
      field: 'input-text',
      placeholder: '请输入',
      key: 'serviceAgency',
    },
    {
      labelWidth,
      required: true,
      showRequireIcon: true,
      showSuffixArrowIcon: true,
      label: '常住地址',
      placeholder: '请选择',
      key: 'permanentAddress',
      field: 'address',
    },
    {
      labelWidth,
      required: true,
      showRequireIcon: true,
      label: '详细地址',
      field: 'input-text',
      placeholder: '请输入',
      key: 'detailedAddress',
    },
  ];

  const choosePat = () => {};

  onMounted(() => {
    gform.value.setList([...renderListBase]);
  });
</script>

<style lang="scss" scoped></style>
