import { getLocalStorage, setLocalStorage } from '@/common';
import { ISelectOptions } from '@/components/g-form';
import { GStores } from './login';
import api from '@/service/api';

const gStores = new GStores();
export class ServerStaticData {
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

  /**
   * label: "已预约", value: "0"
   */
  static async getSystemTerms(): Promise<ISelectOptions[]> {
    const sysTerms = <ISelectOptions[] | undefined>(
      getLocalStorage('sysTerms')
    );

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
    const patientTypeTerms = <ISelectOptions[] | undefined>(
      getLocalStorage('patientTypeTerms')
    );

    if (!patientTypeTerms) {
      const { result } = await api.getParamsMoreBySysCode({
        paramCode: 'PATIENT_TYPE'
      });
      const PATIENT_TYPE = result.PATIENT_TYPE;

      try {
        const patientTypeTerms = JSON.parse(PATIENT_TYPE).map((o) => {
          return {
            label: o.value,
            value: o.code
          };
        });

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
    const idTypeTerms = <ISelectOptions[] | undefined>(
      getLocalStorage('idTypeTerms')
    );

    if (!idTypeTerms) {
      const { result } = await api.getParamsMoreBySysCode({
        paramCode: 'ID_CARD_TYPE'
      });
      const ID_CARD_TYPE = result.ID_CARD_TYPE;

      try {
        const idTypeTerms = JSON.parse(ID_CARD_TYPE)
        console.log({
          idTypeTerms
        });


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


  private constructor() { }
}
