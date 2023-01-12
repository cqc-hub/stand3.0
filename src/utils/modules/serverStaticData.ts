import { getLocalStorage, setLocalStorage } from '@/common';
import { ISelectOptions, hosParam } from '@/components/g-form';
import { GStores } from './login';
import { joinQuery } from '@/common';
import { encryptDesParam } from '@/common/des';
import { beforeEach } from '@/router/index';

import api from '@/service/api';
import globalGl from '@/config/global';

import type { TBannerConfig, ISystemConfig, IHosInfo } from '@/types';

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
        const {
          tollMode,
          price,
          sfz,
          isCustomPatRecord,
          isToggleHos,
          isHandPhoto,
          purpose,
          selPurposeLen,
          isOcrSfz,
          requireSfz,
        } = value as any;

        const isItemCount = tollMode === '1' ? '1' : '0';

        configList.push({
          hosId,
          isItemCount,
          fee: price * 1,
          sfz:
            isHandPhoto === '1'
              ? ['front', 'end', 'handler']
              : sfz || ['front', 'end'],
          isCustomPatRecord,
          isToggleHos,
          purpose,
          selPurposeLen,
          isOcrSfz,
          requireSfz,
        });
      });
      // _cacheMap.set(Med_Copy_Config, configList);

      return <T>configList;
    } else {
      throw new Error('未配置_medCopyList');
    }
  } else {
    return <T>{};
  }
};

export const useTBanner = async (config: Omit<TBannerConfig, 'src'>) => {
  const { type, extraData = {}, path, appId, addition } = config;
  let [isLogin, isPatient] = [false, false];

  const localUrl = 'http://10.10.83.82:5173/#/';

  const _d = {
    _patientId: '',
    _herenId: '',
    _isHos: globalGl.systemInfo.isSearchInHos,
  };

  if (addition) {
    const { token, patientId, herenId } = addition;
    const gStores = new GStores();

    if (patientId) {
      extraData[patientId] = gStores.userStore.patChoose.patientId;
      _d._patientId = gStores.userStore.patChoose.patientId;
      isPatient = true;
    }

    if (token) {
      extraData[token] = gStores.globalStore.getToken;
      isLogin = true;
    }

    if (herenId) {
      isLogin = true;
      extraData[herenId] = gStores.globalStore.herenId;
      _d._herenId = gStores.globalStore.herenId;
    }
  }

  let fullUrl = joinQuery(path, extraData);

  const pages = getCurrentPages();

  if (pages.length) {
    const _fullUrl: string = (pages[pages.length - 1] as any).$page.fullPath;

    await beforeEach({
      url: _fullUrl,
      _isLogin: isLogin,
      _isPatient: isPatient,
    });
  }

  if (type === 'h5') {
    if (config.isSelfH5) {
      let baseUrl = globalGl.h5Url;

      if (config.isLocal) {
        baseUrl = localUrl;
      }

      fullUrl = baseUrl + fullUrl;

      fullUrl = joinQuery(fullUrl, {
        _d: encodeURIComponent(encryptDesParam(_d)),
      });
    }
    // #ifdef H5
    location.href = fullUrl;
    // #endif

    // #ifndef H5
    const url = joinQuery('/pagesA/webView/webView', {
      https: encodeURIComponent(fullUrl),
    });

    uni.navigateTo({
      url,
    });
    // #endif
  } else if (type === 'self') {
    const url = `/${fullUrl}`;

    uni.navigateTo({
      url,
    });
  } else {
    uni.navigateToMiniProgram({
      appId: appId!,
      path,
      extraData,
    });
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
  static async getHomeConfig(type?): Promise<any[]> {
    const viewConfig = getLocalStorage('viewConfig');
    //type:home 首页每次都调用一下
    if (!viewConfig || type) {
      const arg = {
        version: '',
        source: 1,
      };
      // #ifdef MP-ALIPAY
      arg.source = 2;
      // #endif

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
    let systemConfig: ISystemConfig = getLocalStorage('systemConfig');
    if (!systemConfig) {
      //PERSON_FAMILY_CARDMAN 家庭成员 预约挂号 ORDER_REGISTER 病案复印MEDICAL_CASE_COPY 住院服务 PATIENT_SERVICE_CONFIG 门诊缴费CLINIC_PAY_CONFIG
      //REPORT_QUERY_CONFIG报告查询 药品配送 DRUG_DELIVERY_CONFIG
      const { result } = await api.getParamsMoreBySysCode({
        paramCode:
          'PERSON_FAMILY_CARDMAN,MEDICAL_CASE_COPY,ORDER_REGISTER,PATIENT_SERVICE_CONFIG,CLINIC_PAY_CONFIG,REPORT_QUERY_CONFIG,DRUG_DELIVERY_CONFIG',
      });

      try {
        const person = JSON.parse(result.PERSON_FAMILY_CARDMAN || '{}');
        const medRecord = await getMedRecordConfig<ISystemConfig['medRecord']>(
          result
        );
        const order = JSON.parse(result.ORDER_REGISTER || '{}');
        const hospitalCare = JSON.parse(result.PATIENT_SERVICE_CONFIG || '{}');
        const pay = JSON.parse(result.CLINIC_PAY_CONFIG || '{}');
        const reportQuery = JSON.parse(result.REPORT_QUERY_CONFIG || '{}');
        const drugDelivery = JSON.parse(result.DRUG_DELIVERY_CONFIG || '{}');
        systemConfig = {
          person,
          order,
          medRecord,
          hospitalCare,
          pay,
          reportQuery,
          drugDelivery,
        };
      } catch (error) {
        throw new Error('序列化错误, 请检查全局的参数');
      }

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

export const getSystemConfig = ServerStaticData.getSystemConfig;
