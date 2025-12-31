import { TInstance } from '@/components/g-form';
import { rulePhone } from '@/utils';
import { computed, ref } from 'vue';

export const useHosButlerOrder = () => {
  const stepStatus = ref('2');
  const selStepStatus = ref('2');
  const formData1 = ref({
    deptName: 'cqc',
  });

  const gform = ref('' as any);
  const formData = ref({});
  const formChange = (e) => {
    console.log(e);
  };
  const formSubmit = async (e) => {
    console.log(e);
  };
  const formTemps = ref<{
    [key: string]: TInstance[];
  }>({
    1: [
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

    2: [
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
        label: '出生地',
        placeholder: '请选择',
        key: 'address',
        field: 'address',
        labelWidth: '220rpx',
      },
      {
        label: '医保卡号',
        key: 'deptName',
        field: 'input-text',
      },
      {
        label: '医保卡号',
        key: 'deptName',
        field: 'input-text',
        disabled: true,
      },
    ],
  });
  const initForm = () => {
    gform.value.setList(formTemps.value[selStepStatus.value] || []);
  };

  return {
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
        value: '1',
      },
      {
        label: '就诊人信息',
        value: '2',
      },
      {
        label: '联系人信息',
        value: '3',
      },
    ]),
  };
};
