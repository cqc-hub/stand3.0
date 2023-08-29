<template>
  <view class="g-page">
    <view class="g-container">
      <g-form
        v-model:value="formData"
        @submit="formSubmit"
        :show-require-icon="false"
        bodyBold
        ref="gform"
      />

      <button @click="gform.submit" class="btn btn-primary ml32 mr32 mt32">提交</button>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { shallowRef, ref, onMounted } from 'vue';
  import { GStores } from '@/utils';
  import type { TInstance } from '@/components/g-form/index';

  const gStores = new GStores();
  const formData = shallowRef(<BaseObject>{});
  const tempList: TInstance[] = [
    {
      required: true,
      label: '投诉人',
      field: 'input-text',
      placeholder: '请输入',
      key: 'patientName',
      labelWidth: '220rpx',
      maxlength: 50,
      validator(value) {
        const v = <string>value;

        if (v) {
          if (v.length < 2) {
            return Promise.resolve({
              success: false,
              message: '姓名需要大于2个字符',
            });
          }
          const isEng = v.match(/^[A-Za-z]+\s?[A-Za-z]+$/);

          if (isEng) {
            return Promise.resolve({
              success: true,
            });
          } else {
            if (v.length > 20) {
              return Promise.resolve({
                success: false,
                message: '姓名不能大于 20 个字符',
              });
            }
          }
        }

        return Promise.resolve({
          success: true,
        });
      },
    },

    {
      required: true,
      label: '手机号',
      field: 'input-text',
      placeholder: '请输入',
      maxlength: 11,
      key: 'patientPhone',
      rule: [
        {
          message: '请确认手机号是否有误',
          rule: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
        },
      ],
      labelWidth: '220rpx',
    },

    {
      required: true,
      label: '您投诉的部门',
      field: 'input-text',
      placeholder: '请输入',
      maxlength: 11,
      key: 'dept',
      labelWidth: '220rpx',
    },

    {
      required: true,
      inputType: 'textarea',
      label: '意见反馈',
      subLabel: '您的意见将帮助我们改进产品和服务',
      field: 'input-text',
      placeholder: '请输入',
      maxlength: 200,
      key: 'dept1',
      direction: 'horizontal',
      rowStyle: 'margin-top: 16rpx;',
      bodyStyle: 'margin-top: 12rpx;',
      labelStyle: 'color: #111111; font-size: 36rpx;font-weight: 600;',
    },
  ];

  const formSubmit = (e) => {};
  const gform = ref<any>('');

  onMounted(() => {
    gform.value.setList(tempList);
  });
</script>

<style lang="scss" scoped>
  .g-container {
    height: 1px;
    flex: 1;
    overflow-y: scroll;
  }
</style>
