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

      <button @click="gform.submit" class="btn btn-primary ml32 mr32 mt32">
        提交
      </button>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { shallowRef, ref, onMounted } from 'vue';
  import { GStores } from '@/utils';
  import { decryptDes } from '@/common/des';
  import type { TInstance } from '@/components/g-form/index';

  import api from '@/service/api';

  const gStores = new GStores();
  const formData = shallowRef(<BaseObject>{
    // name: '炒青菜',
    // phone: '13868529891',
    // compDept: '消化内科',
    // compContext: '好好好哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
  });
  const tempList: TInstance[] = [
    {
      required: true,
      label: '投诉人',
      field: 'input-text',
      placeholder: '请输入',
      key: 'name',
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
      key: 'phone',
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
      key: 'compDept',
      labelWidth: '220rpx',
    },

    {
      required: true,
      inputType: 'textarea',
      label: '意见反馈',
      subLabel: '您的意见将帮助我们改进产品和服务',
      field: 'input-text',
      placeholder: '请填写10字以上的问题描述以使我们提供更好的帮助',
      maxlength: 200,
      key: 'compContext',
      direction: 'horizontal',
      rowStyle: 'margin-top: 16rpx;',
      bodyStyle: 'margin-top: 12rpx;',
      labelStyle: 'color: #111111; font-size: 36rpx;font-weight: 600;',
      validator: async (v: any) => {
        if (v && v.length > 10) {
          return {
            success: true,
          };
        } else {
          return {
            message: '请填写10字以上的问题描述以使我们提供更好的帮助',
            success: false,
          };
        }
      },
    },
  ];

  const formSubmit = async ({ data }) => {
    await api.complainsAndSuggestions(data);
    gStores.messageStore.showMessage('反馈成功,感谢您的支持', 3000, {
      closeCallBack() {
        uni.reLaunch({
          url: '/pagesC/serviceCenter/serviceCenter',
        });
      },
    });
  };
  const gform = ref<any>('');

  onMounted(() => {
    // #ifdef MP-ALIPAY
    const { userName, mobile } = gStores.userStore.cacheUser;
    formData.value.name = userName;
    formData.value.phone = mobile;
    // #endif

    // #ifdef MP-WEIXIN
    const { cellPhoneNum, phoneNum, name } = gStores.userStore;
    const wxPhone = decryptDes(phoneNum, 'N1@ae^T:phone');

    formData.value.phone = wxPhone;
    formData.value.name = name;
    // #endif

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
