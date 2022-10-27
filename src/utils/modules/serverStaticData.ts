import { getLocalStorage, setLocalStorage } from '@/common';
import { ISelectOptions } from '@/components/g-form';
import { GStores } from './login';
import api from '@/service/api';

export interface ISystemConfig {
  // 预约挂号
  order: {
    // 选择科室医生页面顶部可选择的天数， chooseDay > 20 出现组件 ‘日历’
    chooseDay: number;
    // 选择号源时候显示几列
    selOrderColumn: number;
    // 精确号源?
    isOrderBlur: '0' | '1';

    // 展示号源数不为空的，超过当前时间的号源是否展示
    isHideOutTimeOrderSource?: '0' | '1';
    // 预约挂号时候付钱?
    isOrderPay: '0' | '1';
  };

  // 就诊人
  person: {
    // 新增就诊人页面 (medicalCardMan/perfectReal)页面是否有 '就诊人类型' 一行
    isHidePatientTypeInPerfect?: '0' | '1';
    // 开启短信验证？ 完善时候没有
    isSmsVerify?: '0' | '1';
    // 新增、完善就诊人时候 根据监护人证件号（身份证）判断监护人（至少 guardianAge 岁）
    ageGuardian: number;
    // 新增、完善就诊人时候 根据 生日｜身份证 判断 新生儿（至多 ageChildren 月）
    ageChildren: number;

    // 新增就诊人页面有证件且证件类型 身份证时候 小于6岁 是否监护人？
    isGuardianWithIdCard?: '0' | '1';

    ocr?: '0' | '1';
  };

  // 病案
  medRecord: {
    // 身份证上传要求 （人像、 背面、 手持）
    sfz: ('front' | 'end' | 'handler')[]; // 后端说 人像、 背面 必填 设置时候每次都加下

    // 收钱方式 0 预收 1 按项目、目的
    isItemCount?: '0' | '1';

    // 收钱方式预收的金额 ｜ 单个项目金额
    fee: number;
    hosId: string;
  }[];
}

type TEnv = 'dev' | 'test' | 'prod';
export interface IGlobalConfig {
  // 根据sysCode的全局配置
  sysCode: string;
  title: string;
  logo: string;
  env: TEnv;
}

export interface IHosInfo {
  address: string;
  aliasName: string;
  hosId: string;
  hosName: string;
  hosLevelName: string;
  hosPhoto: string;
  hosType: string;
  ifClick: string;
  intro: string;
  sender: string;
  senderAddress: string;
  senderPhone: string;
  distance?: number; // 距离 （m）
  distanceFormat?: string; // 距离 （km）
  gisLat?: number; // 经度
  gisLng?: number; // 纬度
  label: string;
  value: string;
}

const _cacheMap = new WeakMap();

const Med_Copy_Config = { name: 'Med_Copy_Config' };

const getMedRecordConfig = async <T>(result: any): Promise<T> => {
  const list = _cacheMap.get(Med_Copy_Config);

  if (list) {
    return list;
  }

  // const { result } = await api.getParamsMoreBySysCode({
  //   paramCode: 'MEDICAL_CASE_COPY',
  // });

  if (result && result.MEDICAL_CASE_COPY) {
    const _configList = JSON.parse(result.MEDICAL_CASE_COPY);

    if (_configList.length) {
      const configList: any[] = [];
      Object.entries(_configList[0]).map(([hosId, value]) => {
        const { tollMode, price, isHandPhoto } = value as any;

        const isItemCount = tollMode === '1' ? '1' : '0';

        configList.push({
          hosId,
          isItemCount,
          fee: price * 1,
          sfz:
            isHandPhoto === '1'
              ? ['front', 'end', 'handler']
              : ['front', 'end'],
        });
      });
      // _cacheMap.set(Med_Copy_Config, configList);

      return <T>configList;
    } else {
      throw new Error('未配置_medCopyList');
    }
  } else {
    throw new Error('未配置_medCopy');
  }
};

export class ServerStaticData {
  /**
   * 医院列表
   */
  static async getHosList(
    data = {},
    opt: { noCache: boolean } = { noCache: false }
  ): Promise<IHosInfo[]> {
    let hosList = getLocalStorage('hosList') || _cacheMap.get(this.getHosList);

    if (!(hosList && hosList.length) || opt.noCache) {
      const { result } = await api.getHospital<IHosInfo[]>(data);

      result.map((o) => {
        const { distance, hosId, hosName } = o;

        o.label = hosName;
        o.value = hosId;

        if (distance) {
          o.distanceFormat = (distance / 1000).toFixed(1);
        }
      });

      hosList = result;

      _cacheMap.set(this.getHosList, result);

      // setLocalStorage({
      //   hosList: result
      // });
    }

    return hosList;
  }

  /**
   * 选择地址的数据
   */
  static async getAddressData(): Promise<ISelectOptions[]> {
    const addressCity =
      getLocalStorage('addressCity') || _cacheMap.get(this.getAddressData);

    if (!addressCity) {
      const { result } = await api.getAllDivision({});

      if (result && result.length) {
        setLocalStorage({
          addressCity: result,
        });

        _cacheMap.set(this.getAddressData, result);

        return result;
      } else {
        return [];
      }
    } else {
      return addressCity;
    }
  }

  static async getAddMedicalData() {
    let addMedicalData = getLocalStorage('addMedicalData');

    if (!addMedicalData) {
      await api.getTermsBySysAndCode({
        domainCode:
          'USE_DRUG_UNIT|USE_DRUG_USES|USE_DRUG_WAY|USE_DRUG_FREQUENCY',
      });
    }
  }

  /**
   * label: "已预约", value: "0"
   */
  static async getSystemTerms(): Promise<ISelectOptions[]> {
    const sysTerms =
      <ISelectOptions[] | undefined>getLocalStorage('sysTerms') ||
      _cacheMap.get(this.getSystemTerms);

    if (!sysTerms) {
      const { result } = await api.getParamsMoreBySysCode({
        paramCode: 'REG_ORDER_STATUS',
      });

      const list = result && result.REG_ORDER_STATUS;

      if (list) {
        const res = JSON.parse(list).map((item) => {
          return {
            label: item.label,
            value: item.code,
          };
        });

        // setLocalStorage({
        //   sysTerms: res
        // });

        _cacheMap.set(this.getSystemTerms, res);

        return res;
      } else {
        return [];
      }
    } else {
      return sysTerms;
    }
  }

  /**
   * 民族
   */
  static async getNationTerms(): Promise<ISelectOptions[]> {
    const nationTerms =
      <ISelectOptions[] | undefined>getLocalStorage('nationTerms') ||
      _cacheMap.get(this.getNationTerms);

    if (!nationTerms) {
      const { result } = await api.getTermsBySysAndCode({
        domainCode: 'CHINESE_NATION',
      });

      const list = result && result.length && result[0].terms;

      if (list) {
        const res = list.map((o) => ({
          label: o.label,
          value: o.code,
        }));

        _cacheMap.set(this.getNationTerms, res);
        // setLocalStorage({
        //   nationTerms: res
        // });

        return res;
      } else {
        return [];
      }
    } else {
      return nationTerms;
    }
  }

  /**
   * 就诊人类型
   */
  static async getPatientTypeTerms(): Promise<ISelectOptions[]> {
    const gStores = new GStores();

    const patientTypeTerms =
      <ISelectOptions[] | undefined>getLocalStorage('patientTypeTerms') ||
      _cacheMap.get(this.getPatientTypeTerms);

    if (!patientTypeTerms) {
      const { result } = await api.getParamsMoreBySysCode({
        paramCode: 'PATIENT_TYPE',
      });
      const PATIENT_TYPE = result.PATIENT_TYPE;

      try {
        const patientTypeTerms = JSON.parse(PATIENT_TYPE);

        // setLocalStorage({
        //   patientTypeTerms
        // });
        _cacheMap.set(this.getPatientTypeTerms, patientTypeTerms);

        return patientTypeTerms;
      } catch (err) {
        gStores.messageStore.showMessage('获取就诊人类型失败');
        console.error('获取就诊人类型失败: ', err);
        return [];
      }
    } else {
      return patientTypeTerms;
    }
  }

  /**
   * 01身份证 02居民户口簿 03护照 031中国籍普通护照
   */
  static async getIdTypeTerms(): Promise<ISelectOptions[]> {
    const gStores = new GStores();

    const idTypeTerms =
      <ISelectOptions[] | undefined>getLocalStorage('idTypeTerms') ||
      _cacheMap.get(this.getIdTypeTerms);

    if (!idTypeTerms) {
      const { result } = await api.getParamsMoreBySysCode({
        paramCode: 'ID_CARD_TYPE',
      });
      const ID_CARD_TYPE = result.ID_CARD_TYPE;

      try {
        const idTypeTerms = JSON.parse(ID_CARD_TYPE);

        // setLocalStorage({
        //   idTypeTerms
        // });
        _cacheMap.set(this.getIdTypeTerms, idTypeTerms);

        return idTypeTerms;
      } catch (err) {
        gStores.messageStore.showMessage('获取卡类型失败');
        console.error('获取卡类型失败: ', err);
        return [];
      }
    } else {
      return idTypeTerms;
    }
  }

  static getOptionsLabel(list: ISelectOptions[], value) {
    const item = list.find((o) => o.value === value);
    if (item) {
      return item.label;
    } else {
      return '';
    }
  }

  /**
   * 首页配置的数据
   */
  static async getHomeConfig(): Promise<any[]> {
    const viewConfig = getLocalStorage('viewConfig');

    if (!viewConfig) {
      const arg = {
        version: '',
        source: 1,
      };

      // #ifdef H5
      arg.source = 3;
      // #endif

      const { result } = await api.queryHospitalPattern(arg);

      if (result && result.length) {
        setLocalStorage({
          viewConfig: result,
        });

        return result;
      } else {
        return [];
      }
    } else {
      return viewConfig;
    }
  }

  static async getSystemConfig<T extends keyof ISystemConfig>(
    key: T,
    payload: {} = {}
  ): Promise<ISystemConfig[T]> {
    // const res: ISystemConfig = {
    //   order: {
    //     chooseDay: 30,
    //     selOrderColumn: 3,
    //     isOrderBlur: '1',
    //     isOrderPay: '0',
    //   },

    //   person: {
    //     isHidePatientTypeInPerfect: '1',
    //     ageChildren: 6,
    //     ageGuardian: 18,
    //     isGuardianWithIdCard: '1',
    //     isSmsVerify: '0',
    //     ocr: '1',
    //   },

    //   medRecord: [
    //     {
    //       sfz: ['front', 'end'],
    //       isItemCount: '1',
    //       fee: 10,
    //       hosId: '100',
    //     },
    //   ],
    // };

    // return res[key];

    let systemConfig: ISystemConfig = getLocalStorage('systemConfig');
    if (!systemConfig) {
      //PERSON_FAMILY_CARDMAN 家庭成员 order等写完再确定参数
      const { result } = await api.getParamsMoreBySysCode({
        paramCode: 'PERSON_FAMILY_CARDMAN|MEDICAL_CASE_COPY',
      });
      const person = JSON.parse(result.PERSON_FAMILY_CARDMAN);
      const medRecord = await getMedRecordConfig<ISystemConfig['medRecord']>(
        result
      );
      systemConfig = {
        person: person,
        order: {
          chooseDay: 30,
          selOrderColumn: 3,
          isOrderBlur: '1',
          isOrderPay: '0',
        },
        medRecord,
      };
      setLocalStorage({
        systemConfig,
      });
      return systemConfig[key];
    } else {
      return systemConfig[key];
    }
  }

  private constructor() {}
}

ServerStaticData.getSystemConfig('order').then((r) => {
  r;
});
