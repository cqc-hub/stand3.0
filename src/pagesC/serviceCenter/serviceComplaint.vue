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

      <ImgUpload
        v-if="options?.selectRecords === '1'"
        v-model:uploadImgList="uploadImgList"
        :count="3"
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
  import { onShow, onLoad } from '@dcloudio/uni-app';
  import { GStores } from '@/utils';
  import { decryptDes } from '@/common/des';
  import type { TInstance } from '@/components/g-form/index';
  import { deQueryForUrl } from '@/common';
  import api from '@/service/api';
  import env from '@/config/env';
  import ImgUpload from './components/ImgUpload.vue';
  const options = ref({
    selectRecords: '0',
    cardNumber: '',
    patientSex: '',
    herenId: '',
    idCard: '',
    name: '',
    type: '', //"就诊记录类型 1-门诊记录 2-住院记录 3.急诊 4体检",
    visitDate: '',
    visitNo: '',
    deptName: '',
    docName: '',
    diagnosis: '',
  });
  const uploadImgList = ref(<string[]>[]);
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
            if (v.length > 50) {
              return Promise.resolve({
                success: false,
                message: '姓名不能大于 50 个字符',
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
      placeholder: '请填写5字及以上的问题描述以使我们提供更好的帮助',
      maxlength: 200,
      key: 'compContext',
      direction: 'horizontal',
      rowStyle: 'margin-top: 16rpx;',
      bodyStyle: 'margin-top: 12rpx;',
      labelStyle: 'color: #111111; font-size: 36rpx;font-weight: 600;',
      validator: async (v: any) => {
        if (v && v.length > 4) {
          return {
            success: true,
          };
        } else {
          return {
            message: '请填写5字及以上的问题描述以使我们提供更好的帮助',
            success: false,
          };
        }
      },
    },
  ];
  const tempList2: TInstance[] = [
    {
      required: true,
      label: '投诉人',
      disabled: true,
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
            if (v.length > 50) {
              return Promise.resolve({
                success: false,
                message: '姓名不能大于 50 个字符',
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
      disabled: true,
      label: '就诊记录',
      field: 'input-text',
      placeholder: '请输入',
      key: 'visitLabel',
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
      placeholder: '请填写5字及以上的问题描述以使我们提供更好的帮助',
      maxlength: 200,
      key: 'compContext',
      direction: 'horizontal',
      rowStyle: 'margin-top: 16rpx;',
      bodyStyle: 'margin-top: 12rpx;',
      labelStyle: 'color: #111111; font-size: 36rpx;font-weight: 600;',
      validator: async (v: any) => {
        if (v && v.length > 4) {
          return {
            success: true,
          };
        } else {
          return {
            message: '请填写5字及以上的问题描述以使我们提供更好的帮助',
            success: false,
          };
        }
      },
    },
  ];

  const formSubmit = async ({ data }) => {
    let args = {
      ...data,
    };
    if (options.value.selectRecords === '1') {
      args = {
        ...options.value,
        ...data,
        photo: uploadImgList.value.toString(),
        openIds: [
          {
            source: gStores.globalStore.browser.source,
            openId: gStores.globalStore.openId,
          },
          {
            source: 3,
            openId: gStores.globalStore.h5OpenId,
          },
        ],
      };
    }
    await api.complainsAndSuggestions(args);
    gStores.messageStore.showMessage('反馈成功,感谢您的支持', 3000, {
      closeCallBack() {
        uni.reLaunch({
          url: `/pagesC/serviceCenter/serviceCenter?selectRecords=${options.value.selectRecords}`,
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
    const { phoneNum, name } = gStores.userStore;
    const wxPhone = decryptDes(phoneNum, 'N1@ae^T:phone');

    formData.value.phone = wxPhone;
    formData.value.name = name;
    // #endif
    if (options.value.selectRecords === '1') {
      formData.value.name = options.value.name;
      formData.value.visitLabel = `${options.value.diagnosis}-${options.value.visitDate}`;
      gform.value.setList(tempList2);
    } else {
      gform.value.setList(tempList);
    }
  });

  onLoad(async (opt) => {
    if (opt?.selectRecords) {
      options.value = deQueryForUrl(deQueryForUrl(opt));
    }
  });
</script>

<style lang="scss" scoped>
  .g-container {
    height: 1px;
    flex: 1;
    overflow-y: scroll;
  }
  .form-textarea {
    padding: 20rpx 30rpx;

    .title {
      color: #666;
      margin-bottom: 10rpx;
    }
  }
  .sunui-uploader-inputbox {
    position: relative;
    margin-bottom: 16rpx;
    box-sizing: border-box;
    background-color: #ededed;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    .sunui-uploader-img-wrap {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
