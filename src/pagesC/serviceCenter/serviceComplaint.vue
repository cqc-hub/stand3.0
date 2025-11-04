<template>
  <g-flag isShowFg typeFg="1263" />
  <view class="g-page">
    <view class="g-container">
      <g-choose-pat
        v-if="options.selectRecords === '2'"
        @choose-pat="patChange"
      />
      <g-form
        v-model:value="formData"
        @submit="formSubmit"
        @selectChange="handleSelect"
        :show-require-icon="false"
        bodyBold
        ref="gform"
      />

      <ImgUpload
        v-if="options?.selectRecords === '1' || options?.isAnonymous === '1'"
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
  import { onReady, onLoad } from '@dcloudio/uni-app';
  import { generateUuid, GStores, rulePhone } from '@/utils';

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
    isAnonymous: '',
    compDept: '',
    selectType: 0, //1-选择就诊记录 0-不选择
  });
  const uploadImgList = ref(<string[]>[]);
  const gStores = new GStores();
  const formData = shallowRef(<BaseObject>{
    // name: '炒青菜',
    // phone: '13868529891',
    // compDept: '消化内科',
    // compContext: '好好好哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
  });
  const pageTitle =
    gStores.globalStore.sysCode === '1001033' ? '投诉' : '意见反馈';
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
          rule: rulePhone,
        },
      ],
      labelWidth: '220rpx',
    },

    {
      required: false,
      label: '您投诉的对象',
      field: 'input-text',
      placeholder: '请输入',
      maxlength: 11,
      key: 'compDept',
      labelWidth: '220rpx',
    },

    {
      required: true,
      inputType: 'textarea',
      label: pageTitle,
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
          rule: rulePhone,
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
      label: '您投诉的对象',
      field: 'input-text',
      placeholder: '请输入',
      maxlength: 11,
      key: 'compDept',
      labelWidth: '220rpx',
    },

    {
      required: true,
      inputType: 'textarea',
      label: pageTitle,
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
  const tempList3: TInstance[] = [
    {
      required: true,
      label: '您投诉的对象',
      field: 'input-text',
      placeholder: '请输入',
      maxlength: 11,
      key: 'compDept',
      labelWidth: '220rpx',
    },

    {
      required: true,
      inputType: 'textarea',
      label: pageTitle,
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
  const tempList4: TInstance[] = [
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
          rule: rulePhone,
        },
      ],
      labelWidth: '220rpx',
    },
    {
      required: true,
      label: '就诊记录',
      placeholder: '请选择',
      key: 'visitUid',
      labelWidth: '220rpx',
      field: 'select',
      options: [],
    },

    {
      required: true,
      label: '您投诉的对象',
      field: 'input-text',
      placeholder: '请输入',
      maxlength: 11,
      key: 'compDept',
      labelWidth: '220rpx',
    },

    {
      required: true,
      inputType: 'textarea',
      label: pageTitle,
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
  const tempList5: TInstance[] = [
    {
      required: true,
      label: '姓名',
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
      label: '性别',
      placeholder: '请选择',
      key: 'patientSex',
      labelWidth: '220rpx',
      field: 'select',
      options: [
        {
          value: '男',
          label: '男',
        },
        {
          value: '女',
          label: '女',
        },
      ],
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
          rule: rulePhone,
        },
      ],
      labelWidth: '220rpx',
    },

    {
      required: false,
      label: '意见建议类别',
      placeholder: '请选择',
      field: 'select',
      options: [
        {
          value: '就医环境',
          label: '就医环境',
        },
        {
          value: '就医流程',
          label: '就医流程',
        },
        {
          value: '医患沟通',
          label: '医患沟通',
        },
        {
          value: '诊疗水平',
          label: '诊疗水平',
        },
        {
          value: '医保政策',
          label: '医保政策',
        },
        {
          value: '医疗费用',
          label: '医疗费用',
        },
        {
          value: '其他',
          label: '其他',
        },
      ],
      key: 'compDept',
      labelWidth: '220rpx',
    },

    {
      required: true,
      inputType: 'textarea',
      label: pageTitle,
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
    let message = '反馈成功,感谢您的支持';
    let args = {
      ...data,
       photo: uploadImgList.value.toString(),
    };
    if (options.value.selectRecords === '1') {
      args = {
        ...options.value,
        ...data,
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
    } else if (options.value.selectRecords === '2') {
      args = {
        ...options.value,
        ...data,
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
    if (gStores.globalStore.sysCode === '1001058') {
      message = '感谢您的关注支持，祝您身体健康，生活愉快！';
    }
    await api.complainsAndSuggestions(args);
    gStores.messageStore.showMessage(message, 3000, {
      closeCallBack() {
        uni.reLaunch({
          url: `/pagesC/serviceCenter/serviceCenter?selectRecords=${
            options.value.selectRecords ||
            (options.value.selectType ? '2' : '0')
          }`,
        });
      },
    });
  };
  const gform = ref<any>('');

  const patChange = () => {
    getListData();
  };

  const getListData = async () => {
    let tempList: any = [];
    try {
      const { result } = await api.getOutpatientHospitalList({
        patientId: gStores.userStore.patChoose.patientId,
        type: 3,
      });
      if (!result || !result.length) {
        throw new Error();
      }
      tempList = tempList4.map((item: any) => {
        if (item.key == 'visitUid') {
          item.options = result.map((i) => {
            item.placeholder = '请选择就诊记录';
            item.disabled = false;
            return {
              ...i,
              label: `${i.admissionTime} ${i.deptName}`,
              value: generateUuid(),
            };
          });
        }
        return item;
      });
    } catch (e) {
      tempList = tempList4.map((item: any) => {
        if (item.key == 'visitUid') {
          item.placeholder = '暂未查询到您的就诊记录！';
          item.options = [];
          item.disabled = true;
        }
        return item;
      });
    }

    gform.value.setList(tempList);
  };

  const handleSelect = ({ item, value }) => {
    const { options } = item;
    const target = options.find((e) => e.value === value);
    console.log(target);
    formData.value.visitLabel = `${target.diagnosis}-${target.admissionTime}`;
    formData.value.visitDate = target.admissionTime;
    formData.value.visitNo = target.visitNo;
    formData.value.deptName = target.deptName;
    formData.value.compDept = target.deptName;
  };

  onMounted(() => {
    if (options.value.isAnonymous === '1') {
      gform.value.setList(tempList3);
      return;
    }
    // #ifdef MP-ALIPAY
    const { patientName, mobile } = gStores.userStore.patChoose||gStores.userStore.cacheUser;
    formData.value.name = patientName;
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
    } else if (options.value.selectRecords === '2') {
      getListData();
    } else if (gStores.globalStore.sysCode === '1001058') {
      gform.value.setList(tempList5);
    } else {
      gform.value.setList(tempList);
    }
  });

  onLoad(async (opt) => {
    console.log('complaint onLoad', opt);
    if (opt?.selectRecords) {
      options.value = deQueryForUrl(deQueryForUrl(opt));
    } else if (opt?.isAnonymous) {
      options.value.isAnonymous = opt.isAnonymous;
    }
  });
  onReady(() => {
    uni.setNavigationBarTitle({
      title: pageTitle,
    });
  });
</script>

<style lang="scss" scoped>
  .g-container {
    // height: 1px;
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
