<template>
  <view class="g-page">
    <view class="g-container">
      <g-flag
        isShowFg
        typeFg="1263"
        v-if="gStores.globalStore.sysCode !== '1001058'"
      />
      <g-choose-pat
        v-if="options.selectRecords === '2'"
        @choose-pat="patChange"
        v-model="formData.hosId"
      />
      <g-selhos
        v-if="isCompleteRealName"
        :value="formData.hosId"
        :autoGetData="true"
        ref="selHosRef"
        v-model:hosId="formData.hosId"
        @change="hosChange"
      />
      <g-form
        v-model:value="formData"
        @submit="formSubmit"
        @selectChange="handleSelect"
        @disabled-click="handleRowClick"
        :show-require-icon="false"
        bodyBold
        ref="gform"
      ></g-form>
      <ImgUpload
        v-if="options?.selectRecords !== '0' || options?.isAnonymous === '1'"
        v-model:uploadImgList="uploadImgList"
        :count="3"
      />
    </view>
    <!-- <ChooseDept
      v-model:show="dialogShow"
      @change="pickerChange($event, 'dept')"
      :pageType="'3'"
      :value="formData"
      title="选择科室"
    /> -->
    <xy-dialog
      :title="'选择科室'"
      :show="deptDialogShow"
      :noScroll="true"
      :isMaskClick="false"
      :isShowCancel="false"
      @confirmButton="deptDialogShow = false"
    >
      <view class="dialogContent">
        <uni-section title="请输入关键字并查询选择科室" type="line">
          <uni-data-select
            :value="formData.deptName"
            :placeholder="'请输入关键字并查询选择科室'"
            :localdata="deptList"
            @change="(e) => changeSelect('dept', e)"
            @text-change="(e) => changeSelectText('dept', e)"
            :editable="true"
          ></uni-data-select>
        </uni-section>
      </view>
    </xy-dialog>
    <xy-dialog
      :title="'选择医护人员'"
      :show="docDialogShow"
      :noScroll="true"
      :isMaskClick="false"
      :isShowCancel="false"
      @confirmButton="docDialogShow = false"
    >
      <view class="dialogContent">
        <uni-section title="请输入关键字并查询选择医护人员" type="line">
          <uni-data-select
            :placeholder="'请输入关键字并查询选择医护人员'"
            :localdata="docList"
            @change="(e) => changeSelect('doc', e)"
            @text-change="(e) => changeSelectText('doc', e)"
            :editable="true"
          ></uni-data-select>
        </uni-section>
      </view>
    </xy-dialog>
    <view class="g-footer flex">
      <button
        v-if="options?.entryType == '1'"
        @click="gotoRecord"
        class="btn btn-normal btn-border ml8 mt32 flex1"
      >
        反馈记录
      </button>
      <button @click="gform.submit" class="btn btn-primary mr8 mt32 flex2">
        提交
      </button>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { shallowRef, ref, onMounted, computed } from 'vue';
  import { onReady, onLoad } from '@dcloudio/uni-app';
  import {
    generateUuid,
    GStores,
    rulePhone,
    debounce,
    wait,
    ServerStaticData,
  } from '@/utils';
  import { useCacheStore } from '@/stores';
  import { decryptDes } from '@/common/des';
  import type { TInstance } from '@/components/g-form/index';
  import { deQueryForUrl } from '@/common';

  import api from '@/service/api';
  import ImgUpload from './components/ImgUpload.vue';
  import ChooseDept from './components/choose-dept.vue';
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
    hosId: '',
    selectType: 0, //1-选择就诊记录 0-不选择
    entryType: '', // 入口类型
  });
  const uploadImgList = ref(<string[]>[]);
  const gStores = new GStores();
  const cacheStore = useCacheStore();
  const formData = shallowRef(<BaseObject>{});
  const completeRealNameList = ref(['1001033']);
  const docDialogShow = ref(false);
  const deptList = ref([]);
  const docList = ref([]);
  const deptDialogShow = ref(false);
  const selHosRef = ref<any>(null);
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
      placeholder: '请选择',
      field: 'select',
      options: [
        {
          value: '医生',
          label: '医生',
        },
        {
          value: '护士',
          label: '护士',
        },
        {
          value: '医技人员',
          label: '医技人员',
        },
        {
          value: '后勤人员',
          label: '后勤人员',
        },
        {
          value: '其他人员',
          label: '其他人员',
        },
        {
          value: '无',
          label: '无',
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
      required: false,
      label: '您投诉的对象',
      placeholder: '请选择',
      field: 'select',
      options: [
        {
          value: '医生',
          label: '医生',
        },
        {
          value: '护士',
          label: '护士',
        },
        {
          value: '医技人员',
          label: '医技人员',
        },
        {
          value: '后勤人员',
          label: '后勤人员',
        },
        {
          value: '其他人员',
          label: '其他人员',
        },
        {
          value: '无',
          label: '无',
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
  const tempList3: TInstance[] = [
    {
      required: false,
      label: '您投诉的对象',
      placeholder: '请选择',
      field: 'select',
      options: [
        {
          value: '医生',
          label: '医生',
        },
        {
          value: '护士',
          label: '护士',
        },
        {
          value: '医技人员',
          label: '医技人员',
        },
        {
          value: '后勤人员',
          label: '后勤人员',
        },
        {
          value: '其他人员',
          label: '其他人员',
        },
        {
          value: '无',
          label: '无',
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
      required: false,
      label: '您投诉的对象',
      placeholder: '请选择',
      field: 'select',
      options: [
        {
          value: '医生',
          label: '医生',
        },
        {
          value: '护士',
          label: '护士',
        },
        {
          value: '医技人员',
          label: '医技人员',
        },
        {
          value: '后勤人员',
          label: '后勤人员',
        },
        {
          value: '其他人员',
          label: '其他人员',
        },
        {
          value: '无',
          label: '无',
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
  const tempList6: TInstance[] = [
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
      label: '科室',
      placeholder: '请选择科室',
      key: 'deptName',
      labelWidth: '220rpx',
      field: 'input-text',
      disabled: true,
      showSuffixArrowIcon: true,
    },
    {
      required: true,
      label: '医护人员',
      placeholder: '请选择医护人员',
      key: 'docName',
      labelWidth: '220rpx',
      field: 'input-text',
      disabled: true,
      showSuffixArrowIcon: true,
    },
    {
      required: false,
      label: '您投诉的对象',
      placeholder: '请选择',
      field: 'select',
      options: [
        {
          value: '医生',
          label: '医生',
        },
        {
          value: '护士',
          label: '护士',
        },
        {
          value: '医技人员',
          label: '医技人员',
        },
        {
          value: '后勤人员',
          label: '后勤人员',
        },
        {
          value: '其他人员',
          label: '其他人员',
        },
        {
          value: '无',
          label: '无',
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

  const isCompleteRealName = computed(() =>
    completeRealNameList.value.includes(gStores.globalStore.sysCode)
  );

  const formSubmit = async ({ data }) => {
    let message = '反馈成功,感谢您的支持';
    let args = {
      ...data,
      photo: uploadImgList.value.toString(),
      source: gStores.globalStore.browser.source,
    };
    if (options.value.selectRecords === '1') {
      args = {
        ...options.value,
        ...data,
        source: gStores.globalStore.browser.source,
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
        source: gStores.globalStore.browser.source,
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

  const hosChange = ({ item }) => {
    console.log(9999, item);
    formData.value.hosId = item.hosId;
    if (options.value.selectRecords === '2') {
      getListData();
    }
  };
  const patChange = () => {
    if (options.value.selectRecords === '2') {
      getListData();
    }
  };

  const dialogAssignConfirm = (type, e) => {
    if (type === 'dept') {
      // formData.value.compDept = empNoInfo.empName
    }
    // deptDialogShow.value = false;
  };
  let changeSelectText: any = async (type, text) => {
    if (!text) return;
    if (type === 'dept') {
      const { result } = await api.getUndertakerInfo({
        hosId: formData.value.hosId,
        context: text,
        type: 2,
      });
      deptList.value = result.map((item) => ({
        value: item.docName,
        ...item,
        text: ` ${item?.docName || ''} ${
          item?.deptName ? '(' + item?.deptName + ')' : ''
        }`,
      }));
    } else if (type === 'doc') {
      const { result } = await api.getUndertakerInfo({
        hosId: formData.value.hosId,
        context: text,
        deptName: formData.value.deptName,
        type: 1,
      });
      docList.value = result.map((item) => ({
        value: item.docName,
        ...item,
        text: ` ${item?.docName || ''} ${
          item?.deptName ? '(' + item?.deptName + ')' : ''
        }`,
      }));
    }
  };
  changeSelectText = debounce(changeSelectText, 500, false);

  const changeSelect = async (type, value) => {
    if (type === 'dept') {
      formData.value = {
        ...formData.value,
        deptName: value,
      };
    } else if (type === 'doc') {
      formData.value = {
        ...formData.value,
        docName: value,
      };
    }
  };

  const getListData = async () => {
    if (options.value.selectRecords === '2') {
      const { patientName } = gStores.userStore.patChoose;
      formData.value.name = patientName;
    }
    let tempList: any = [];
    try {
      const { result } = await api.getOutpatientHospitalList({
        patientId: gStores.userStore.patChoose.patientId,
        hosId: formData.value.hosId,
        type: 3,
      });
      if (!result || !result.length) {
        throw new Error();
      }
      let newTempList = isCompleteRealName.value ? tempList6 : tempList4;
      tempList = newTempList.map((item: any) => {
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

  const handleRowClick = async (item) => {
    if (item.key == 'deptName') {
      // dialogShow.value = true;
      if (isCompleteRealName.value) {
        deptDialogShow.value = true;
      }
    } else if (item.key === 'docName') {
      if (isCompleteRealName.value) {
        docDialogShow.value = true;
      }
    }
  };

  const handleSelect = ({ item, value }) => {
    if (item.key === 'visitUid') {
      const { options } = item;
      const target = options.find((e) => e.value === value);
      formData.value.visitLabel = `${target.diagnosis}-${target.admissionTime}`;
      formData.value.visitDate = target.admissionTime;
      formData.value.visitNo = target.visitNo;
      formData.value.type = target.typeLabel;
      formData.value.docName = target.docName;
      formData.value.deptName = target.deptName;
      // formData.value.compDept = target.deptName;
    }
  };

  const gotoRecord = () => {
    uni.reLaunch({
      url: `/pagesC/serviceCenter/serviceCenter?selectRecords=${
        options.value.selectRecords || (options.value.selectType ? '2' : '0')
      }`,
    });
  };

  onMounted(async () => {
    if (isCompleteRealName.value) {
      await selHosRef.value.init();
      const hosList = await ServerStaticData.getHosList();
      formData.value = { ...formData.value, hosId: hosList[0].hosId };
      console.log(1111111111, formData.value.hosId, 'hosId');
    }
    if (options.value.isAnonymous === '1') {
      gform.value.setList(tempList3);
      return;
    }
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
    } else if (options.value.selectRecords === '2') {
      getListData();
    } else if (gStores.globalStore.sysCode === '1001058') {
      gform.value.setList(tempList5);
    } else {
      gform.value.setList(tempList);
    }
  });

  onLoad(async (opt) => {
    if (opt?.selectRecords) {
      options.value = deQueryForUrl(deQueryForUrl(opt));
    } else if (opt?.isAnonymous) {
      options.value.isAnonymous = opt.isAnonymous;
    } else if (opt?.entryType) {
      options.value.entryType = opt.entryType;
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
  .dialogContent {
    height: 100%;
    text-align: justify;
    padding: 20rpx;
  }

  :deep(.xy-dialog__container) {
    overflow: initial !important;
  }
  :deep(.uni-scroll-view) {
    overflow: initial !important;
  }

  ::v-deep .uni-steps__column-text {
    max-width: 85vw;
  }

  ::v-deep .uni-card__content {
    white-space: normal;
    word-wrap: break-word;
  }

  .rectification-content {
    padding: 32rpx;
    box-sizing: border-box;

    .rectification-input {
      width: 100%;
      min-height: 200rpx;
      padding: 20rpx;
      background: #f6f6f6;
      border-radius: 16rpx;
      font-size: var(--hr-font-size-xs);
      line-height: 1.6;
      box-sizing: border-box;
    }

    .rectification-btns {
      display: flex;
      gap: 20rpx;
      margin-top: 40rpx;

      .btn {
        flex: 1;
        height: 88rpx;
        line-height: 88rpx;
        border-radius: 44rpx;
        font-size: var(--hr-font-size-md);
      }

      .btn-cancel {
        background: #f6f6f6;
        color: #333;
      }

      .btn-primary {
        background: #007aff;
        color: #fff;
      }
    }
  }
</style>
