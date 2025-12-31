import { TInstance } from '@/components/g-form';
import { GStores, rulePhone } from '@/utils';
import { computed, ref } from 'vue';
import { THosButlerInfo } from './hosButlerType';
import { deQueryForUrl } from '@/common';

export const useHosButlerOrder = () => {
  const gStores = new GStores();
  const stepStatus = ref('0');
  const selStepStatus = ref('0');
  const pageProps = ref({} as THosButlerInfo);
  const formData1 = ref({
    deptName: 'cqc',
  });

  const gform = ref('' as any);
  const formData = ref({});
  let isBackPoint = false;
  const formChange = (e) => {

    if (['wx', 'alipay'].includes(gStores.globalStore.ev) && !isBackPoint) {
      isBackPoint = true;
      const opt = {
        message: '当前填写的内容尚未保存，确定要离开吗？',
      };

      // #ifdef MP-WEIXIN
      wx.enableAlertBeforeUnload(opt);
      // #endif

      // #ifdef MP-ALIPAY
      my.enableAlertBeforeUnload(opt);
      // #endif
    }
  };
  const formSubmit = async (e) => {
    console.log(e);
  };
  const formTemps = ref<{
    [key: string]: TInstance[];
  }>({
    0: [
      {
        label: '入院科室',
        key: 'deptName',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '入院途径',
        key: 'deptName1',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '医疗组',
        key: 'deptName1',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '门诊医生',
        key: 'deptName1',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '病案号',
        key: 'deptName1',
        field: 'input-text',
        disabled: true,
      },
    ],

    1: [
      {
        label: '医保卡号',
        key: 'deptName',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '姓名',
        key: 'deptName',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '证件',
        key: 'deptName',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '证件号',
        key: 'deptName',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '出生日期',
        key: 'deptName',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '性别',
        key: 'deptName',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '年龄',
        key: 'deptName',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '民族',
        key: 'deptName',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '籍贯',
        key: 'deptName',
        field: 'input-text',
        disabled: true,
      },
      {
        required: true,
        label: '本人电话',
        key: 'deptName',
        field: 'input-text',
        showRequireIcon: true,

        rule: [
          {
            message: '请确认手机号是否有误',
            rule: rulePhone,
          },
        ],
      },

      {
        required: true,
        showSuffixArrowIcon: true,
        showRequireIcon: true,
        label: '国籍',
        placeholder: '请选择',
        key: 'countries',
        field: 'select',
        options: [],
        autoOptions: 'countries',
        // rowStyle: 'margin-bottom: 16rpx;',
        labelWidth: '220rpx',
        filterOptions(opt, search) {
          if (search) {
            return opt.filter((o) => {
              const {
                label,
                name_en,
                name_zh,
                pinyin,
                short_lower,
                short_upper,
              } = o;

              return (
                label.includes(search) ||
                name_en.includes(search) ||
                name_zh.includes(search) ||
                pinyin.includes(search) ||
                short_lower.includes(search) ||
                short_upper.includes(search)
              );
            });
          }
          return opt;
        },
      },

      {
        required: true,
        showSuffixArrowIcon: true,
        showRequireIcon: true,

        label: '出生地',
        placeholder: '请选择',
        key: 'address',
        field: 'address',
        labelWidth: '220rpx',
      },
      {
        label: '职业',
        key: 'deptName',
        field: 'input-text',
        placeholder: '请选择',
      },
      {
        label: '婚姻',
        key: 'deptName',
        field: 'input-text',
        placeholder: '请选择',
      },
      {
        label: '学历',
        key: 'deptName',
        field: 'input-text',
        placeholder: '请选择',
      },
      {
        label: '工作单位',
        key: 'deptName',
        field: 'input-text',
        placeholder: '请输入',
      },
      {
        label: '现住址',
        key: 'deptName',
        field: 'input-text',
        placeholder: '请输入',
      },
      {
        label: '邮编',
        key: 'deptName',
        field: 'input-text',
        placeholder: '请输入',
      },
      {
        label: '家庭联系人',
        key: 'deptName',
        field: 'input-text',
        placeholder: '请输入',

        rule: [
          {
            message: '请确认手机号是否有误',
            rule: rulePhone,
          },
        ],
      },

      {
        label: '户口地址',
        key: 'deptName',
        field: 'input-text',
        placeholder: '请输入',
      },
    ],

    2: [
      {
        label: '联系人',
        key: 'deptName',
        field: 'input-text',
        required: true,
        showRequireIcon: true,
        placeholder: '请输入',
      },

      {
        required: true,
        showSuffixArrowIcon: true,
        showRequireIcon: true,

        label: '关系',
        placeholder: '请选择',
        key: 'address',
        field: 'select',
        labelWidth: '220rpx',
        options: [],
      },

      {
        required: true,
        label: '联系人电话',
        key: 'deptName',
        field: 'input-text',
        showRequireIcon: true,

        rule: [
          {
            message: '请确认手机号是否有误',
            rule: rulePhone,
          },
        ],
      },
    ],
  });
  const initForm = () => {
    gform.value.setList(formTemps.value[selStepStatus.value] || []);
  };

  const handlerSubmit = async () => {};

  return {
    pageProps,

    gform,
    formData,
    formChange,
    formSubmit,
    initForm,

    stepStatus,
    selStepStatus,
    stepList: ref<IOptions[]>([
      {
        label: '住院信息',
        value: '0',
      },
      {
        label: '就诊人信息',
        value: '1',
      },
      {
        label: '联系人信息',
        value: '2',
      },
    ]),
    stepClick({ value }) {
      selStepStatus.value = value;
      initForm();
    },
    handlerClick() {
      const v = (selStepStatus.value as any) * 1;

      if (v === 2) {
        handlerSubmit();
      } else {
        selStepStatus.value = `${v * 1 + 1}`;
        initForm();
      }
    },
    pageLoad(opt: any) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
      console.log(pageProps.value);
    },
  };
};
