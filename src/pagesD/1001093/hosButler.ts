import { TInstance } from '@/components/g-form';
import {
  apiAsync,
  GStores,
  idCardConvert,
  idValidator,
  rulePhone,
  useTBanner,
  wait,
} from '@/utils';
import { computed, ref } from 'vue';
import { THosButlerInfo } from './hosButlerType';
import { deQueryForUrl, joinQueryForUrl } from '@/common';
import api from '@/service/api';

/**
 * 院前检查
 * 需要的配置信息
 * - 职业 yqjc_job
 * - 学历 yqjc_edu
 * - 关系 yqjc_relationship
 * - 婚姻 yqjc_marital
 * @returns
 */
export const useHosButlerOrder = () => {
  const gStores = new GStores();
  const stepStatus = ref('0');
  const selStepStatus = ref('0');
  const pageProps = ref({} as THosButlerInfo);

  const gform = ref('' as any);
  const formData = ref({} as BaseObject);

  const formData1 = ref({});
  const formData2 = ref({} as any);
  const formData3 = ref({});
  let isBackPoint = false;
  const formChange = (e) => {
    const key = selStepStatus.value;

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

  let resolve: (...any) => any = () => {};
  let reject: (...any) => any = () => {};
  const formSubmit = async (e) => {
    resolve(e);
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
        key: 'admissionWay',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '医疗组',
        key: 'groupName',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '门诊医生',
        key: 'doctorName',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '病案号',
        key: 'cardNumber',
        field: 'input-text',
        disabled: true,
      },
    ],

    1: [
      {
        label: '医保卡号',
        key: 'insuranceCardNo',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '姓名',
        key: 'patientName',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '证件',
        key: 'idType',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '证件号',
        key: 'idCard',
        field: 'input-text',
        disabled: true,
        inputMask(v) {
          return idCardConvert(v);
        },
      },
      {
        label: '出生日期',
        key: 'birthday',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '性别',
        key: 'sex',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '年龄',
        key: 'patientAge',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '民族',
        key: 'nation',
        field: 'input-text',
        disabled: true,
      },
      {
        label: '籍贯',
        key: 'nativePlaceString',
        field: 'input-text',
        disabled: true,
      },
      {
        required: true,
        label: '本人电话',
        key: 'patientPhone',
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
        key: 'citizenshipCode',
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
        key: '_address',
        field: 'address',
        labelWidth: '220rpx',
      },
      {
        label: '职业',
        showSuffixArrowIcon: true,
        key: 'occupationCode',
        field: 'select',
        options: [],
        autoOptions: 'yqjc_job',
        placeholder: '请选择',
      },
      {
        label: '婚姻',
        key: 'marital',
        showSuffixArrowIcon: true,
        autoOptions: 'yqjc_marital',
        options: [],
        field: 'select',
        placeholder: '请选择',
      },
      {
        label: '学历',
        showSuffixArrowIcon: true,
        key: 'eduCode',
        field: 'select',
        options: [],
        autoOptions: 'yqjc_edu',
        placeholder: '请选择',
      },
      {
        label: '工作单位',
        key: 'serviceAgency',
        field: 'input-text',
        placeholder: '请输入',
      },
      {
        label: '现住址',
        key: 'presentAddress',
        field: 'input-text',
        placeholder: '请输入',
      },
      {
        label: '邮编',
        key: 'postCode',
        field: 'input-text',
        placeholder: '请输入',
      },
      // {
      //   label: '家庭联系人',
      //   key: 'phone',
      //   field: 'input-text',
      //   placeholder: '请输入',

      //   rule: [
      //     {
      //       message: '请确认手机号是否有误',
      //       rule: rulePhone,
      //     },
      //   ],
      // },

      {
        label: '户口地址',
        key: 'address',
        field: 'input-text',
        placeholder: '请输入',
      },
    ],

    2: [
      {
        label: '联系人',
        key: 'membersName',
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
        key: 'relationship',
        field: 'select',
        labelWidth: '220rpx',
        autoOptions: 'yqjc_relationship',
        options: [],
      },

      {
        required: true,
        label: '联系人电话',
        key: 'membersPhone',
        field: 'input-text',
        showRequireIcon: true,
        placeholder: '请输入联系人电话',

        rule: [
          {
            message: '请确认手机号是否有误',
            rule: rulePhone,
          },
        ],

        async validator(v) {
          if (pageProps.value.patientPhone === v) {
            return {
              success: false,
              message: '联系人电话不能与本人电话一致',
            };
          }
          return {
            success: true,
          };
        },
      },

      // {
      //   label: '联系人地址',
      //   key: 'membersAddress',
      //   field: 'input-text',
      //   placeholder: '请输入',
      // },
    ],
  });
  const initForm = async () => {
    const key = selStepStatus.value;

    const {
      deptName,
      cardNumber,
      groupName,
      doctorName,
      visitNo,
      admissionWay,
      patientAge,
      nation,
      insuranceCardNo,
      patientName,
      idType,
      idCard,
      birthday,
      nativePlaceString,
      patientPhone,
      citizenship,
      citizenshipCode,
      sex,
    } = pageProps.value;

    gform.value.setList([]);

    if (key === '0') {
      formData1.value = {
        deptName,
        groupName,
        doctorName,
        visitNo,
        admissionWay,
        cardNumber,
      };
      formData.value = formData1.value;
    } else if (key === '1') {
      formData2.value = {
        patientAge,
        nation,
        insuranceCardNo,
        patientName,
        idType,
        idCard,
        birthday,
        nativePlaceString,
        patientPhone,
        citizenship,
        citizenshipCode,
        sex,
        ...formData2.value,
      };
      formData.value = formData2.value;
    } else if (key === '2') {
      formData3.value = {
        ...formData3.value,
      };
      formData.value = formData3.value;
    }

    await wait(60);
    gform.value.setList(formTemps.value[selStepStatus.value] || []);
  };

  const handlerSubmit = async () => {
    const { cardNumber, patientId } = gStores.userStore.patChoose;
    const { recommendedPrepaidCost } = pageProps.value;
    const reqArg = {
      ...pageProps.value,
      ...formData2.value,
      ...formData3.value,
      // _address: addressLLabel,
    };

    // const {
    //   result: { visitNo, cardNumber },
    // } =
    await api.submitAdmissionApplication(reqArg);

    await apiAsync(uni.showModal, {
      content: '提交成功',
      showCancel: false,
    });

    const { result: hosInfoResult = {} } = await api.getInHospitalInfo({
      cardNumber,
      patientId,
    });

    uni.redirectTo({
      url: joinQueryForUrl('/pagesA/hospitalCare/paymentPage', {
        ...hosInfoResult,
        defaultMoney: recommendedPrepaidCost,
        _type: 'fromHosButler1001093',
        disabledChangeMoney: '1',
        _pd: patientId,
      }),
    });

    // uni.redirectTo({
    //   url: joinQueryForUrl('/pagesD/1001093/hosButlerOrderAfter', {
    //     ...reqArg,
    //   }),
    // });
  };

  return {
    pageProps,
    formTemps,

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
    async handlerClick() {
      const v = (selStepStatus.value as any) * 1;

      await new Promise((r, j) => {
        gform.value.submit();
        resolve = r;
      });

      if (v === 1) {
        formData2.value = {
          ...formData.value,
        };
      } else if (v === 2) {
        formData3.value = {
          ...formData.value,
        };
      }

      if (v === 2) {
        handlerSubmit();
      } else {
        if ((stepStatus.value as any) * 1 <= v) {
          stepStatus.value = `${v * 1 + 1}`;
        }
        selStepStatus.value = `${v * 1 + 1}`;
        initForm();
      }
    },
    addressChange({ value = [] as any[] }) {
      const [birthProvince, birthCity, birthDistrict] = value;

      if (birthProvince && birthCity && birthDistrict) {
        formData.value.birthProvince = birthProvince.value;
        formData.value.birthCity = birthCity.value;
        formData.value.birthDistrict = birthDistrict.value;

        formData.value.birthProvinceName = birthProvince.text;
        formData.value.birthCityName = birthCity.text;
        formData.value.birthDistrictName = birthDistrict.text;
      }
    },
    async pageLoad(opt: any) {
      pageProps.value = deQueryForUrl(deQueryForUrl(opt));
      console.log(pageProps.value);

      const {
        admissionWay,
        deptName,
        groupName,
        idType,
        idCard,
        birthDistrict,
        birthDistrictName,
        birthCity,
        birthCityName,
        birthProvince,
        birthProvinceName,
      } = pageProps.value;

      formData1.value = {
        admissionWay,
        deptName,
        groupName,
      };

      if (birthDistrict && birthCity && birthProvince) {
        formData2.value._address = `${birthProvinceName}${birthCityName}${birthDistrictName}`;
        formData2.value.birthProvince = birthProvince;
        formData2.value.birthCity = birthCity;
        formData2.value.birthDistrict = birthDistrict;
      } else if (idType === '身份证' && idCard) {
        const res = await idValidator.getIdCardAddress('330326199908286713');
        if (res) {
          const {
            birthCity,
            birthDistrict,
            birthProvince,
            birthCityCode,
            birthDistrictCode,
            birthProvinceCode,
          } = res;
          if (birthProvinceCode && birthDistrictCode && birthCityCode) {
            formData2.value._address = `${birthProvince}${birthCity}${birthDistrict}`;
            formData2.value.birthProvince = birthProvince;
            formData2.value.birthCity = birthCity;
            formData2.value.birthDistrict = birthDistrict;

            formData.value.birthProvince = birthProvinceCode;
            formData.value.birthCity = birthCityCode;
            formData.value.birthDistrict = birthDistrictCode;

            formData.value.birthProvinceName = birthProvince;
            formData.value.birthCityName = birthCity;
            formData.value.birthDistrictName = birthDistrict;
          }
        }
      }
    },
  };
};
