<template>
  <view class="g-page">
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
  import { GStores } from '@/utils';
  import dayjs from 'dayjs';
  import api from '@/service/api';
  import { apiAsync } from '../../utils/modules/utils';

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

  // 预约新增
  const isItemNew = computed(() => {
    return pageProps.value.appointAdtStatus === '1';
  });

  const labelWidth = '250rpx';

  const phoneRule = [
    {
      message: '请确认手机号是否有误',
      rule: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
    },
  ];

  const renderListBase: TInstance[] = [
    {
      labelWidth,
      required: true,
      disabled: true,
      label: '患者姓名',
      field: 'input-text',
      placeholder: '请输入',
      key: 'patientName',
    },
    {
      labelWidth,
      required: true,
      disabled: true,
      label: '预约医院',
      field: 'input-text',
      placeholder: '请输入',
      key: 'hosName',
    },
    {
      labelWidth,
      required: true,
      disabled: true,
      label: '临床科室',
      field: 'input-text',
      placeholder: '请输入',
      key: 'deptAdmissionName',
    },
    {
      labelWidth,
      disabled: true,
      label: '住院预约日期',
      field: 'input-text',
      placeholder: ' ',
      key: 'appointAdmissionDate',
    },
    {
      labelWidth,
      label: '期望住院日期',
      field: 'time-picker',
      type: 'date',
      placeholder: '请选择',
      key: 'patientAppointAdmissionDate',
      start: dayjs().format('YYYY-MM-DD'),
    },
    {
      labelWidth,
      label: '住院等待地点',
      field: 'select',
      placeholder: '请选择',
      key: 'waitingLocationHospital',
      options: [
        {
          label: '住宾馆',
          value: '0',
        },
        {
          label: '杭州亲戚家',
          value: '1',
        },
        {
          label: '杭州自己家',
          value: '2',
        },
        {
          label: '回老家',
          value: '3',
        },
      ],
    },
    {
      labelWidth,
      label: '预计到院时间',
      field: 'select',
      placeholder: '请选择',
      key: 'expectedArrivalTime',
      options: [
        {
          label: '1小时内',
          value: '0',
        },
        {
          label: '2-3小时',
          value: '1',
        },
        {
          label: '3-5小时内',
          value: '2',
        },
        {
          label: '5小时以上',
          value: '3',
        },
        {
          label: '提前一天',
          value: '4',
        },
      ],
    },
    {
      labelWidth,
      label: '是否服用抗凝药物',
      field: 'switch',
      placeholder: '请选择',
      align: 'left',
      key: 'isTakeAnticoagulantDrugs',
      // direction: 'horizontal',
      labelFormatter(v) {
        return (v && '是') || '否';
      },
      bodyStyle: 'margin-left: 12rpx;',
    },
  ];

  const renderListDetail: TInstance[] = [
    {
      labelWidth,
      label: '婚姻状况',
      field: 'switch',
      placeholder: '请选择',
      align: 'left',
      key: 'maritalStatus',
      labelFormatter(v) {
        return (v && '已婚') || '未婚';
      },
      bodyStyle: 'margin-left: 12rpx;',
      rowStyle: 'margin-top: 12rpx;',
    },

    {
      labelWidth,
      required: true,
      showRequireIcon: true,
      label: '职业',
      field: 'select',
      placeholder: '请选择',
      key: 'occupation',
      options: [],
    },

    {
      labelWidth,
      required: true,
      showRequireIcon: true,
      label: '工作单位',
      field: 'input-text',
      placeholder: '请输入工作单位',
      key: 'serviceAgency',
    },

    {
      labelWidth,
      required: true,
      showRequireIcon: true,
      label: '第一联系人',
      field: 'input-text',
      placeholder: '请输入手机号',
      key: 'mphoneNumber',
      rule: phoneRule,
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
      label: '第二联系人',
      field: 'input-text',
      placeholder: '请输入手机号',
      key: 'phoneNumber',
      rule: phoneRule,
    },
  ];

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
    gStores.messageStore.showMessage(
      `${isItemNew.value ? '新增' : '编辑'}住院证成功`,
      3000,
      {
        closeCallBack() {
          uni.navigateBack({
            delta: 1,
          });
        },
      }
    );
  };

  onLoad(async (opt) => {
    // opt.appointAdtStatus = '1';
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    console.log(pageProps.value);
    formData.value = {
      ...gStores.userStore.patChoose,
      ...pageProps.value,
    };
  });

  onMounted(async () => {
    if (isItemNew.value) {
      const { result } = await api.getTermsBySysAndCode({
        domainCode: 'USER_JOB',
      });

      const jobList = ((result && result[0]?.terms) || []).map((o) => ({
        value: o.code,
        label: o.label,
      }));

      const jobItem = renderListDetail.find((o) => o.key === 'occupation');

      // @ts-expect-error
      jobItem && (jobItem.options = jobList);
    }

    gform.value.setList([
      ...renderListBase,
      ...(isItemNew.value ? renderListDetail : []),
    ]);
  });
</script>

<style lang="scss" scoped></style>
