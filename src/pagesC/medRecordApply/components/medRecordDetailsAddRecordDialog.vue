<template>
  <view class="">
    <g-popup :maskClickClose="false" title="手动添加记录" ref="refAddDialog">
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
    },

    {
      required: true,
      label: '住院号',
      field: 'input-text',
      placeholder: '请输入(选填)',
      key: 'no',
    },

    {
      required: true,
      label: '病区科室',
      field: 'input-text',
      placeholder: '请输入(选填)',
      key: 'no1',
    },

    {
      required: true,
      showSuffixArrowIcon: true,
      type: 'date',
      label: '入院日期',
      placeholder: '请选择',
      key: 'd1',
      field: 'time-picker',
      end: timeNow,
    },

    {
      required: true,
      showSuffixArrowIcon: true,
      type: 'date',
      label: '出院日期',
      placeholder: '请选择',
      key: 'd2',
      field: 'time-picker',
      end: timeNow,
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

  const submit = (e) => {
    emits('submit', e);
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

    .g-footer {
      padding-bottom: 0;
    }

    .dialog-btn {
      flex: 1;
    }
  }
</style>
