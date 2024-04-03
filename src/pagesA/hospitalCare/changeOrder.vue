<template>
  <view class="g-page">
    <view class="container" scroll-y>
      <g-form
        v-model:value="formData"
        @submit="formSubmit"
        @change="formChange"
        bodyBold
        ref="gform"
      />
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { deQueryForUrl } from '@/common';
  import { TInstance } from '@/components/g-form';
  import { GStores } from '@/utils';
  import dayjs from 'dayjs';

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

  const labelWidth = '250rpx';

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
      bodyStyle: 'margin-left: 12rpx;'
    },
  ];
  const formSubmit = (e) => {
    console.log(e);
  };

  const formChange = (e) => {
    console.log(e);
  };

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    console.log(pageProps.value);
    formData.value = {
      ...gStores.userStore.patChoose,
      ...pageProps.value,
    };
  });

  onMounted(async () => {
    gform.value.setList(renderListBase);
  });
</script>

<style lang="scss" scoped></style>
