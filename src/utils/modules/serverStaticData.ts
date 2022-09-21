import { getLocalStorage, setLocalStorage } from '@/common';
import { ISelectOptions } from '@/components/g-form';
import { GStores } from './login';
import api from '@/service/api';

export interface ISystemConfig {
  // 预约挂号
  order: {
    // 选择科室医生页面顶部可选择的天数， chooseDay > 20 出现组件 ‘日历’
    chooseDay: number;
  };
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
}
export class ServerStaticData {
  /**
   * 医院列表
   */
  static async getHosList(): Promise<IHosInfo[]> {
    let hosList = getLocalStorage('hosList');

    if (!(hosList && hosList.length)) {
      const { result } = await api.getHospital({});
      hosList = result;

      setLocalStorage({
        hosList: result
      });
    }

    return hosList;
  }

  /**
   * 选择地址的数据
   */
  static async getAddressData(): Promise<ISelectOptions[]> {
    const addressCity = getLocalStorage('addressCity');

    if (!addressCity) {
      const { result } = await api.getAllDivision({});

      if (result && result.length) {
        setLocalStorage({
          addressCity: result
        });

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
          'USE_DRUG_UNIT|USE_DRUG_USES|USE_DRUG_WAY|USE_DRUG_FREQUENCY'
      });
    }
  }

  /**
   * label: "已预约", value: "0"
   */
  static async getSystemTerms(): Promise<ISelectOptions[]> {
    const sysTerms = <ISelectOptions[] | undefined>getLocalStorage('sysTerms');

    if (!sysTerms) {
      const { result } = await api.getParamsMoreBySysCode({
        paramCode: 'REG_ORDER_STATUS'
      });

      const list = result && result.REG_ORDER_STATUS;

      if (list) {
        const res = JSON.parse(list).map((item) => {
          return {
            label: item.label,
            value: item.code
          };
        });

        setLocalStorage({
          sysTerms: res
        });

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
    const nationTerms = <ISelectOptions[] | undefined>(
      getLocalStorage('nationTerms')
    );

    if (!nationTerms) {
      const { result } = await api.getTermsBySysAndCode({
        domainCode: 'CHINESE_NATION'
      });

      const list = result && result.length && result[0].terms;

      if (list) {
        const res = list.map((o) => ({
          label: o.label,
          value: o.code
        }));

        setLocalStorage({
          nationTerms: res
        });

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

    const patientTypeTerms = <ISelectOptions[] | undefined>(
      getLocalStorage('patientTypeTerms')
    );

    if (!patientTypeTerms) {
      const { result } = await api.getParamsMoreBySysCode({
        paramCode: 'PATIENT_TYPE'
      });
      const PATIENT_TYPE = result.PATIENT_TYPE;

      try {
        const patientTypeTerms = JSON.parse(PATIENT_TYPE);

        setLocalStorage({
          patientTypeTerms
        });

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

    const idTypeTerms = <ISelectOptions[] | undefined>(
      getLocalStorage('idTypeTerms')
    );

    if (!idTypeTerms) {
      const { result } = await api.getParamsMoreBySysCode({
        paramCode: 'ID_CARD_TYPE'
      });
      const ID_CARD_TYPE = result.ID_CARD_TYPE;

      try {
        const idTypeTerms = JSON.parse(ID_CARD_TYPE);

        setLocalStorage({
          idTypeTerms
        });

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
      const { result } = await api.queryHospitalPattern({
        version: '',
        source: 1
      });

      if (result && result.length) {
        setLocalStorage({
          viewConfig: result
        });

        return result;
      } else {
        return [];
      }
    } else {
      return viewConfig;
    }
  }

  static async getSystemConfig<T extends keyof ISystemConfig>(key: T) {
    const res = {
      order: {
        chooseDay: 30
      }
    } as ISystemConfig;

    return res[key];
  }

  private constructor() {}
}
