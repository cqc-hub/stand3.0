<template>
  <view class="">
    <g-popup :maskClickClose="false" :title="title" ref="refAddDialog">
      <view class="g-page">
        <view class="g-container">
          <g-form
            :value="value"
            @update:value="change"
            @submit="submit"
            ref="refForm"
            selectInUniDataPicker
            warningInUni
            bodyBold
          />
        </view>

        <view class="g-footer">
          <button
            @click="confirmForm"
            class="btn g-border btn-primary dialog-btn"
          >
            确定
          </button>
        </view>
      </view>
    </g-popup>
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref, nextTick } from 'vue';
  import type { TInstance } from '@/components/g-form/index';
  import { ServerStaticData } from '@/utils';
  import dayjs from 'dayjs';

  const timeNow = dayjs().format('YYYY-MM-DD');
  const refAddDialog = ref<any>('');
  const refForm = ref<any>();
  const props = defineProps<{
    value: BaseObject;
    title: string;
  }>();
  const emits = defineEmits(['update:value', 'submit']);

  const tempList: TInstance[] = [
    {
      required: true,
      label: '院区',
      placeholder: '请选择',
      key: 'hosId',
      field: 'select',
      options: [],
      isForShow: true,
      showBodyStyle: 'text-align: left;margin-left:20rpx;',
      disabled: true,
    },

    {
      label: '住院号',
      field: 'input-text',
      placeholder: '请输入(选填)',
      key: 'visitNo',
    },

    {
      required: true,
      label: '病区科室',
      field: 'input-text',
      placeholder: '请输入(必填)',
      key: 'deptName',
    },

    {
      required: true,
      showSuffixArrowIcon: true,
      type: 'date',
      label: '入院日期',
      placeholder: '请选择(必填)',
      key: 'admissionTime',
      field: 'time-picker',
      end: timeNow,
    },

    {
      required: true,
      showSuffixArrowIcon: true,
      type: 'date',
      label: '出院日期',
      placeholder: '请选择(必填)',
      key: 'outTime',
      field: 'time-picker',
      end: timeNow,
      validator: async (v) => {
        const admissionTime = props.value.admissionTime;

        if (dayjs(admissionTime).isAfter(dayjs(v as string))) {
          return {
            success: false,
            message: '出院时间不能早于入院时间',
          };
        }

        return {
          success: true,
        };
      },
    },
  ];

  const show = () => {
    refAddDialog.value.show();
    setTimeout(() => {
      initForm();
    }, 200);
  };

  const hide = () => {
    refAddDialog.value.close();
  };

  const initForm = async () => {
    const hosList = await ServerStaticData.getHosList();

    tempList.map((o) => {
      const { key, field } = o;
      if (field === 'select' && key === 'hosId') {
        o.options = hosList;
      }

      o.labelWidth = '140rpx';
    });

    refForm.value.setList(tempList);
  };

  const change = (e) => {
    emits('update:value', e);
  };

  const confirmForm = () => {
    refForm.value.submit();
  };

  const submit = ({ data }) => {
    console.log(data);

    emits('submit', data);
    hide();
  };

  defineExpose({
    show,
    hide,
  });
</script>

<style lang="scss" scoped>
  .g-page {
    height: 70vh;

    .g-container {
      padding: 0 10rpx;
    }

    .dialog-btn {
      flex: 1;
    }
  }
</style>
