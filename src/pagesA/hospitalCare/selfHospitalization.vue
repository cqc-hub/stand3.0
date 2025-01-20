<template>
  <view class="g-page">
    <g-flag typeFg="1217" isShowFg />
    <view class="mb32">
      <g-choose-pat @choose-pat="getData" />
    </view>

    <view class="container" scroll-y>
      <g-form
        v-model:value="formData"
        @submit="formSubmit"
        bodyBold
        ref="gform"
      />

      <view
        v-if="isComplete && !Object.keys(formData).length"
        class="empty-list"
      >
        <g-empty :current="1" />
      </view>

      <view v-else-if="isComplete" class="p32">
        <button @click="gform.submit" class="btn btn-primary">自助入院</button>
      </view>
    </view>

    <xy-dialog
      title=""
      :show="isConfirmDialogShow"
      @cancelButton="isConfirmDialogShow = false"
      @confirmButton="resolveF"
      cancelText="不同意，线下办理"
    >
      <scroll-view scroll-y class="reg-tip">
        <g-flag isHideTitle isShowFgTip typeFg="1120" aaa />
      </scroll-view>
    </xy-dialog>
    <g-message />
  </view>
</template>
<script lang="ts" setup>
  import { onMounted, ref, computed } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { deQueryForUrl } from '@/common';
  import { TInstance } from '@/components/g-form';
  import {
    GStores,
    apiAsync,
    ServerStaticData,
    IHosInfo,
    getLocation,
    wait,
  } from '@/utils';

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
  const hosList = ref<IHosInfo[]>([]);
  const gform = ref<any>('');
  const gStores = new GStores();
  const formData = ref<BaseObject>({});
  const isComplete = ref(false);

  const isConfirmDialogShow = ref(false);
  let resolveF: any = () => {};
  const formSubmit = async ({ data }) => {
    // const { confirm } = await apiAsync(uni.showModal, {
    //   content: '确定进行提交?',
    // });

    // if (!confirm) {
    //   return;
    // }
    isConfirmDialogShow.value = true;
    await new Promise((r) => {
      resolveF = r;
    });
    const { permanentAddress, detailedAddress } = data;
    const { patientId } = gStores.userStore.patChoose;

    data.presentAddress = `${permanentAddress} ${detailedAddress}`;

    await api.saveInpVisit({ ...data, patientId });
    gStores.messageStore.showMessage(`确认信息成功`, 3000, {
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
  const labelWidth = '200rpx';
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
      disabled: true,
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
      // inputMask: (v: string) => {
      //   if (v) {
      //     const reg = /^(1[3-9][0-9])\d{4}(\d{4}$)/; // 定义手机号正则表达式
      //     return v.replace(reg, '$1****$2');
      //   }

      //   return v;
      // },
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
      showSuffixArrowIcon: true,
    },
    {
      labelWidth,
      required: true,
      showRequireIcon: true,
      label: '第二联系人',
      field: 'input-text',
      placeholder: '请输入手机号',
      rule: phoneRule,
      key: 'nextOfKin',
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

    {
      labelWidth,
      label: '请确认您的住院信息',
      // @ts-expect-error
      field: ' ',
      placeholder: '请输入',
      key: 'sbsbsbsbsbsbs',
      rowStyle: 'margin-top: 32rpx;',
    },
    {
      labelWidth,
      disabled: true,
      label: '入院院区',
      field: 'input-text',
      placeholder: ' ',
      key: 'hosName',
      isForShow: true,
      showBodyStyle: 'text-align: left;',
    },
    {
      labelWidth,
      disabled: true,
      label: '主管医生',
      field: 'input-text',
      placeholder: ' ',
      key: 'chiefDoctor',
      isForShow: true,
      showBodyStyle: 'text-align: left;',
    },
    {
      labelWidth,
      disabled: true,
      label: '入院科室',
      field: 'input-text',
      placeholder: ' ',
      key: 'deptName',
      isForShow: true,
      showBodyStyle: 'text-align: left;',
    },
    {
      labelWidth,
      disabled: true,
      label: '入院病房',
      field: 'input-text',
      placeholder: ' ',
      key: 'wardName',
      isForShow: true,
      showBodyStyle: 'text-align: left;',
    },
    {
      labelWidth,
      disabled: true,
      label: '住院时间',
      field: 'input-text',
      placeholder: ' ',
      key: 'appointAdmissionDate',
      isForShow: true,
      showBodyStyle: 'text-align: left;',
    },
    {
      labelWidth,
      disabled: true,
      label: '院前检查',
      field: 'input-text',
      placeholder: ' ',
      key: 'inAdvanceOrderFlagLabel',
      isForShow: true,
      showBodyStyle: 'text-align: left;',
    },
  ];
  const location = ref({
    latitude: '',
    longitude: '',
  });

  const getData = async () => {
    formData.value = {};
    isComplete.value = false;
    const patientId = gStores.userStore.patChoose.patientId;
    const { result } = await api
      .queryInpVisit({
        patientId,
        ...location.value,
      })
      .finally(() => [(isComplete.value = true)]);

    if (result) {
      const { inAdvanceOrderFlag, hosId, presentAddress } = result;
      if (presentAddress) {
        const [permanentAddress, ...detailedAddress] =
          presentAddress.split(' ');

        result.permanentAddress = permanentAddress;
        result.detailedAddress = detailedAddress.join('');
      }
      result.inAdvanceOrderFlagLabel =
        (inAdvanceOrderFlag === '0' && '否') || '是';
      result.hosName =
        hosList.value.find((o) => o.hosId === hosId)?.hosName || '';

      formData.value = result;

      await wait(10);
      gform.value.setList([...renderListBase]);
    } else {
      gform.value.setList([]);

      const { confirm } = await apiAsync(uni.showModal, {
        content: '患者已经入院登记，是否跳转住院预缴?',
      });

      if (confirm) {
        uni.navigateTo({ url: '/pagesA/hospitalCare/hospitalCare' });
      }
    }
  };

  const init = async () => {
    hosList.value = await ServerStaticData.getHosList();
  };

  onMounted(async () => {
    await init();
    location.value = await getLocation(true);
    await getData();
  });
</script>

<style lang="scss" scoped></style>
