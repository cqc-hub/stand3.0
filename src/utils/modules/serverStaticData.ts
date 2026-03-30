import {
  getLocalStorage,
  setLocalStorage,
  joinQueryForUrl,
  insertsObject,
  joinQuery,
} from '@/common';
// #ifdef H5
import wxH5 from 'weixin-js-sdk';
// #endif
import { ISelectOptions, TAddress } from '@/components/g-form';
import { GStores } from './login';
import { encryptDesParam } from '@/common/des';
import { beforeEach } from '@/router/index';
import { MEDICAL_PHOTOS, MEDICAL_PHOTO_MODE } from '@/static/staticData';
import { assignType, Split, Merge, FilterOptional } from '@/typeUtils';
import {
  getMiniProgramEnv,
  ApiParamsConfig,
  addHosIdForSelfH5Path,
  calculateDistance,
  openLocation,
  apiAsync,
} from '@/utils';
import {
  sysConfigEnv,
  apiConfigEnv,
  sysConfigTrial,
} from '@/config/envConfigData';
import { useCacheStore } from '@/stores';

import api from '@/service/api';
import globalGl from '@/config/global';

import type {
  TBannerConfig,
  ISystemConfig,
  IHosInfo,
  TButtonConfig,
} from '@/types';
import { useViewerStore } from '@/stores/modules/viewer';

const _cacheMap = new WeakMap();

const Med_Copy_Config = { name: 'Med_Copy_Config' };

const getMedRecordConfig = async <T>(result: any): Promise<T> => {
  const list = _cacheMap.get(Med_Copy_Config);

  if (list) {
    return list;
  }

  if (result && result.MEDICAL_CASE_COPY) {
    const _configList = JSON.parse(result.MEDICAL_CASE_COPY);

    if (_configList.length) {
      const configList: any[] = [];

      _configList.map((o) => {
        Object.entries(o).map(([hosId, value]) => {
          assignType<ISystemConfig['medRecord'][number]>(value);

          const {
            tollMode,
            price = 1,
            sfz: _sfz,
            isCustomPatRecord,
            isToggleHos,
            isHandPhoto,
            purpose,
            selPurposeLen,
            isOcrSfz,
            requireSfz,
            isPurposeRadio,
            company,
            selPurposeInRecord,
            photoConfig,
            isItemCount: _isItemCount,
          } = value;

          const isItemCount = _isItemCount || tollMode;
          const sfz =
            isHandPhoto === '1'
              ? ['front', 'end', 'handler']
              : _sfz || ['front', 'end'];

          if (photoConfig) {
            sfz.length = 0;
            requireSfz && (requireSfz.length = 0);

            photoConfig.modes.map((o) => {
              const { photos, value, require, label, children } = o;

              const defaultMode = MEDICAL_PHOTO_MODE[value];
              o.photos = photos || defaultMode?.photos || [];
              o.photos.reverse();
              o.require = require || [];
              o.children = children || [];
              o.label = label || defaultMode?.label || '配置错误';
              o.photos.map((key) => {
                const photoItem = MEDICAL_PHOTOS.find((p) => p.value === key);

                if (photoItem) {
                  o.children = [photoItem, ...o.children];
                  // .push(photoItem);
                  !require && o.require.push(key);
                }
              });
            });
          }

          configList.push({
            ...value,
            hosId,
            photoConfig,
            isItemCount,
            fee: isNaN(price * 1) ? 1 : price * 1,
            sfz,
            isCustomPatRecord,
            isToggleHos,
            purpose,
            selPurposeLen,
            isOcrSfz,
            requireSfz,
            isPurposeRadio,
            company,
            selPurposeInRecord,
          });
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
const h5LoginFun = (options) => {
  const gStores = new GStores();
  const { url, _isLogin, _isPatient } = options;
  console.log(999, options, _isLogin);
  if (_isLogin) {
    if (!gStores.globalStore.token.accessToken) {
      wxH5.miniProgram.navigateTo({
        url: '/pages/home/my',
      });
      return Promise.reject('h5需要登录----');
    }
  }
};

const tBannerIntercept = async (
  extraData: BaseObject,
  inst: (...args: any[]) => any = () => {}
) => {};

export const useTBanner = async (
  config: TBannerConfig | TButtonConfig,
  routeType: 'reLaunch' | 'redirectTo' | 'navigateTo' = 'navigateTo',
  additionData: BaseObject = {}
) => {
  const gStores = new GStores();
  const cacheStore = useCacheStore();

  const { source } = gStores.globalStore.browser;
  const { openId, token, modeOld, sysCode, isTcmStyle } = gStores.globalStore;
  const {
    type,
    extraData = {},
    path,
    appId,
    envVersion = 'release',
    addition,
  } = config;
  let [isLogin, isPatient] = [false, false];

  additionData = {
    source,
    openId,
    token: token?.accessToken,
    timestamp: (new Date() as any) * 1,
    ...gStores.userStore.patChoose,
    ...additionData,
  };

  const _d = {
    _patientId: '',
    _herenId: '',
    _isHos: globalGl.systemInfo?.isSearchInHos,
    herenId: '',
  };

  if (addition) {
    const { token, patientId, herenId, cardNumber, openId } = addition;

    if (patientId) {
      isPatient = true;
    }

    if (cardNumber) {
      isPatient = true;
    }

    if (token || openId) {
      isLogin = true;
    }

    if (herenId) {
      isLogin = true;
    }
    if (config.isSelfH5 === '1' || config.type === 'h5') {
      _d._herenId = gStores.globalStore.herenId || '';
      _d.herenId = gStores.globalStore.herenId || '';
      _d._patientId = gStores.userStore.patChoose.patientId;

      patientId &&
        (extraData[patientId] = gStores.userStore.patChoose.patientId);
      cardNumber &&
        (extraData[cardNumber] = gStores.userStore.patChoose.cardNumber);
      token && (extraData[token] = gStores.globalStore.getToken);

      herenId && (extraData[herenId] = gStores.globalStore.herenId || '');
      openId && (extraData[openId] = gStores.globalStore.openId || '');
      extraData.token = gStores.globalStore.getToken;
      // extraData.isTcmStyle = (gStores.globalStore.isTcmStyle && '1') || '0';
    }

    for (const key in addition) {
      if (!['token', 'patientId', 'herenId', 'cardNumber'].includes(key)) {
        extraData[addition[key]] =
          additionData[key] === undefined
            ? extraData[addition[key]]
            : additionData[key];
      }
    }
  }

  let fullUrl = joinQueryForUrl(path, extraData);
  //  登录和就诊人拦截
  // #ifndef H5
  await beforeEach({
    _isLogin: isLogin,
    _isPatient: isPatient,
  });
  // #endif

  // #ifdef H5
  //  await h5LoginFun({
  //   url: fullUrl,
  //   _isLogin: isLogin,
  //   _isPatient: isPatient,
  // })
  // #endif

  await tBannerIntercept(extraData, () =>
    useTBanner(config, routeType, addition)
  );
  if (type === 'h5') {
    // debugger
    if (config.isSelfH5) {
      let baseUrl: string = globalGl.h5Url;
      if (
        (await getMiniProgramEnv()) === 'develop' &&
        globalGl.env !== 'prod'
      ) {
        baseUrl = h5UrlLocal;
      }

      fullUrl = baseUrl + fullUrl;
      fullUrl = addHosIdForSelfH5Path(fullUrl);

      fullUrl = joinQueryForUrl(fullUrl, {
        _d: encodeURIComponent(encryptDesParam(_d)),
        modeOld: modeOld && '1',
        isTcmStyle: (isTcmStyle && '1') || '0',
        sysCode,
      });
    }
    // #ifdef H5
    if (uni.getStorageSync('mini_v3_sysCode') === '1001035') {
      fullUrl = joinQueryForUrl(path, {
        openid: uni.getStorageSync('mini_v3_sysCode_openId'),
        token: uni.getStorageSync('mini_v3_sysCode_token'),
      });
    }
    location.href = fullUrl;
    // #endif

    // #ifndef H5
    console.log('跳转路径-----', fullUrl);
    cacheStore.changeCacheData(fullUrl);
    const url = joinQueryForUrl('/pagesA/webView/webView', {
      // https: encodeURIComponent(fullUrl),
      ...extraData,
      cache: '1',
    });
    // @ts-expect-error
    uni[routeType]({
      url,
    });
    // #endif
  } else if (type === 'self') {
    let url = `/${fullUrl}`;
    if (fullUrl.indexOf('plugin') > -1) {
      // 新增判断 如果path里面包含plugin 就不用拼接了
      url = fullUrl;
    }
    let a = true;
    // #ifdef H5
    a = false;
    try {
      wxH5.miniProgram.navigateTo({
        url: url,
      });
      my.navigateTo({
        url: url,
      });
    } catch (error) {
      a = true;
    }
    // #endif

    if (a) {
      // @ts-expect-error
      uni[routeType]({
        url,
      });
    }
  } else if (type === 'netHospital') {
    // @ts-expect-error
    uni[routeType]({
      url: joinQuery('/pagesC/cloudHospital/cloudHospital', extraData),
    });
  } else {
    console.log(
      '跳转第三方小程序appId:',
      appId,
      ';path:',
      joinQuery(path, extraData),
      ';extraData',
      extraData,
      envVersion
    );

    const opts = {
      ...(config.deepProps || {}),
      appId: appId!,
      path: joinQuery(path, extraData),
      envVersion,
      extraData,
      async fail(e) {
        const { errMsg = '' } = e;
        console.error(e);

        if (errMsg.includes('fail can only be invoked by user TAP gesture.')) {
          const { confirm } = await apiAsync(uni.showModal, {
            content: '确认跳转第三方小程序?',
          });

          if (confirm) {
            uni.navigateToMiniProgram(opts);
          }
        }
      },
    };
    uni.navigateToMiniProgram(opts);
  }
};

export const guideHos = (item: IHosInfo) => {
  const gStores = new GStores();
  const { gisLat, gisLng, hosName, address } = item;

  if (gisLat) {
    openLocation([gisLat!, gisLng!], {
      name: hosName,
      address,
    });
  } else {
    gStores.messageStore.showMessage('暂不支持导航(无该医院位置信息)', 3000);
    throw new Error('暂不支持导航 无该医院位置信息');
  }
};

export class ServerStaticData {
  /**
   * 医院列表
   */
  static async getHosList(
    data = {} as {
      gisLng?: number;
      gisLat?: number;
      type?: string;
    } & BaseObject,
    opt = {}
  ): Promise<IHosInfo[]> {
    const { gisLng: gisLng1, gisLat: gisLat1 } = data;
    let hosList = getLocalStorage('hosList') || _cacheMap.get(this.getHosList);
    const isOldData = !!hosList;

    if (!(hosList && hosList.length)) {
      const { result } = await api.getHospital<IHosInfo[]>(data);
      hosList = result;
    }

    if ((gisLng1 && gisLng1) || !isOldData) {
      hosList.map((o) => {
        const {
          distance,
          hosId,
          hosName,
          aliasName,
          gisLat: gisLat2,
          gisLng: gisLng2,
        } = o;

        o.label = aliasName || hosName;
        o.value = hosId;

        if (gisLng1 && gisLat1 && gisLat2 && gisLng2 && !distance) {
          o.distance = calculateDistance(gisLat1, gisLng1, gisLat2, gisLng2);
        }

        if (o.distance) {
          o.distanceFormat = (o.distance / 1000).toFixed(1);
        }
      });

      hosList.sort(({ distance: distance1 }, { distance: distance2 }) => {
        if (distance1 && distance2) {
          return distance1 - distance2;
        } else if (distance1) {
          return -1;
        }

        return 1;
      });

      _cacheMap.set(this.getHosList, hosList);
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

  /**
   *
   * @param upDivision
   * @param divisionType undefined -> provinces; 1 -> citys; 2 -> areas
   * @returns
   */
  static async getAddressByLevel(
    upDivision = '',
    divisionType?: '1' | '2'
  ): Promise<TAddress[]> {
    let { result = [] } = await api.getDivisionByLevel({
      upDivision,
    });
    const personConfig = await this.getSystemConfig('person');
    const { sortProvinces = [], sortCitys = [], sortAreas = [] } = personConfig;
    let sortAddress = sortProvinces;

    if (divisionType === '1') {
      sortAddress = sortCitys;
    } else if (divisionType === '2') {
      sortAddress = sortAreas;
    }
    const addressValue: string[] = result.map((o) => o.value);
    sortAddress = sortAddress.filter((v) => addressValue.includes(v));

    result.sort((c, n) => {
      const ci = sortAddress.indexOf(c.value);
      const ni = sortAddress.indexOf(n.value);

      if (ci !== -1 && ni !== -1) {
        return ci - ni;
      } else if (ci !== -1) {
        return -1;
      }

      return 1;
    });

    return result;
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
   *
   * 01 身份证
   * 02 居民户口簿
   * 03 护照
   * 031 中国籍普通护照
   * 032 外国籍护照
   * 04 军官证
   * 05 驾驶证
   * 06 港澳居民来往内地通行证
   * 061 港澳居民居住证
   * 08 港澳居民居住证
   * 07 台湾居民来往内地通行证
   * 071 台湾居民来居住证
   * 15 外国人永久居留身份证(现版）
   * 15 外国人永久居留身份证(新版）
   * 99 其他法定有效证件
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

  /** 国家籍贯 */
  static async getCountryList(): Promise<ISelectOptions[]> {
    return await api.getCountryList();
  }

  static getOptionsLabel(list: ISelectOptions[], value) {
    const item = list.find((o) => o.value === value);
    if (item) {
      return item.label;
    } else {
      return value;
    }
  }

  /**
   * 首页配置的数据
   */
  static async getHomeConfig(source = ''): Promise<any[]> {
    const gStores = new GStores();
    //type:home 首页每次都调用一下
    const arg = {
      version: '',
      source: gStores.globalStore.browser.source,
    };

    if (gStores.globalStore.modeOld) {
      arg.source = 7;
    } else {
      if (gStores.globalStore.ev === 'alipay') {
        arg.source = 2;
      } else if (gStores.globalStore.ev === 'web') {
        arg.source = 5;
      } else if (gStores.globalStore.ev === 'wx') {
        arg.source = 1;
      } else if (gStores.globalStore.ev === 'tt') {
        arg.source = 8;
      }
    }

    const { result } = await api.queryHospitalPattern(arg);

    if (result && result.length) {
      return result;
    } else {
      return [];
    }
  }

  /**
   * 小程序当前运行环境
   */
  static env: '' | 'develop' | 'trial' | 'release' = '';

  static async getSystemConfig<T extends keyof ISystemConfig>(
    key: T,
    payload: {} = {}
  ) {
    let systemConfig: ISystemConfig = getLocalStorage('systemConfig');

    if (!this.env) {
      this.env = await getMiniProgramEnv();
    }

    if (!systemConfig) {
      //PERSON_FAMILY_CARDMAN 家庭成员 预约挂号 ORDER_REGISTER 病案复印MEDICAL_CASE_COPY 住院服务 PATIENT_SERVICE_CONFIG 门诊缴费CLINIC_PAY_CONFIG
      //REPORT_QUERY_CONFIG报告查询 药品配送 DRUG_DELIVERY_CONFIG   智能陪诊 GuideConfig
      const { result } = await api.getParamsMoreBySysCode({
        paramCode:
          'PERSON_FAMILY_CARDMAN,MEDICAL_CASE_COPY,ORDER_REGISTER,PATIENT_SERVICE_CONFIG,CLINIC_PAY_CONFIG,REPORT_QUERY_CONFIG,DRUG_DELIVERY_CONFIG,SELF_BILLING,Electronic_Consultation_Sheet,FAMOUS_DOCTOR_DEPT,BusinessMenu,RestOfConfig,HEALTH_COUNSEL,GuideConfig ',
      });

      try {
        const person = JSON.parse(result.PERSON_FAMILY_CARDMAN || '{}');
        const medRecord =
          await getMedRecordConfig<ISystemConfig['medRecord']>(result);
        const order = JSON.parse(result.ORDER_REGISTER || '{}');
        const hospitalCare = JSON.parse(result.PATIENT_SERVICE_CONFIG || '{}');
        const pay = JSON.parse(result.CLINIC_PAY_CONFIG || '{}');
        const reportQuery = JSON.parse(result.REPORT_QUERY_CONFIG || '{}');
        const drugDelivery = JSON.parse(result.DRUG_DELIVERY_CONFIG || '{}');
        const selfBilling = JSON.parse(result.SELF_BILLING || '{}');
        const RestOfConfig = JSON.parse(result.RestOfConfig || '{}');
        const FAMOUS_DOCTOR_DEPT = JSON.parse(
          result.FAMOUS_DOCTOR_DEPT || '{}'
        );
        const Electronic_Consultation_Sheet = JSON.parse(
          result.Electronic_Consultation_Sheet || '{}'
        );
        const BusinessMenu = JSON.parse(result.BusinessMenu || '{}');
        const HEALTH_COUNSEL = JSON.parse(result.HEALTH_COUNSEL || '{}');
        systemConfig = <ISystemConfig>{
          person,
          order,
          medRecord,
          hospitalCare,
          pay,
          reportQuery,
          drugDelivery,
          selfBilling,
          Electronic_Consultation_Sheet,
          FAMOUS_DOCTOR_DEPT,
          BusinessMenu,
          RestOfConfig,
          HEALTH_COUNSEL,
        };

        for (const key in systemConfig) {
          const config = systemConfig[<keyof ISystemConfig>key];
          const wxConfig = config?.inWx;
          const alipayConfig = config?.inAlipay;

          // #ifdef MP-ALIPAY
          if (alipayConfig) {
            Object.assign(config, alipayConfig);
          }

          // #endif

          // #ifdef MP-WEIXIN
          if (wxConfig) {
            Object.assign(config, wxConfig);
          }
          // #endif
        }

        if (this.env === 'develop') {
          // ...
          insertsObject(sysConfigEnv, systemConfig);
        } else if (this.env === 'trial') {
          insertsObject(sysConfigTrial, systemConfig);
        }
      } catch (error) {
        console.error(error);
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

export const cacheUtil = new (class {
  wakeMap = new WeakMap();
  env: '' | 'develop' | 'trial' | 'release' = '';
  version = '';

  /**
   *  获取系统参数
   *  配合 type ApiParamsConfig 使用
   * @example
   * const res = await cacheUtil.getSystemConfig('Config_Key,Config_Key1')
   * const res1 = await cacheUtil.getSystemConfig('Config_Key,Config_Key1')<{ Config_Key: any }>()
   */
  getSystemConfig<T extends string = string>(paramCode: T) {
    return async <
      R extends Partial<Record<Split<T, ','>[number], any>> = Partial<
        Record<Split<T, ','>[number], any>
      >,
    >(): Promise<
      Required<
        Merge<
          Merge<Record<Split<T, ','>[number], BaseObject>, R>,
          FilterOptional<
            {
              [K in Split<T, ','>[number]]: K extends keyof ApiParamsConfig
                ? ApiParamsConfig[K]
                : never;
            },
            never
          >
        >
      >
    > => {
      if (!this.env) {
        this.env = await getMiniProgramEnv();
      }
      const viewerStore = useViewerStore();
      if (!this.version && this.version !== viewerStore.version) {
        this.wakeMap = new WeakMap();
      }
      this.version = viewerStore.version;

      const paramCodeArr = paramCode.split(',');

      const map: BaseObject = this.wakeMap.get(this.getSystemConfig) || {};

      if (!this.wakeMap.has(this.getSystemConfig)) {
        this.wakeMap.set(this.getSystemConfig, map);
      }

      const unRequestParamCode = paramCodeArr.reduce((p, v) => {
        return map[v] === undefined ? p + v + ',' : p;
      }, '');

      if (unRequestParamCode) {
        const { result } = await api.getParamsMoreBySysCode({
          paramCode: unRequestParamCode.slice(0, -1),
        });

        for (const key in result) {
          try {
            map[key] = JSON.parse(result[key] || '{}');
            const config = map[key];

            const wxConfig = config?.inWx;
            const alipayConfig = config?.inAlipay;

            // #ifdef MP-ALIPAY
            if (alipayConfig) {
              Object.assign(config, alipayConfig);
            }

            // #endif

            // #ifdef MP-WEIXIN
            if (wxConfig) {
              Object.assign(config, wxConfig);
            }
            // #endif
          } catch (error: any) {
            throw new Error('序列化错误: ' + key);
          }
        }
      }

      const result = paramCodeArr
        .filter((k) => k)
        .reduce<any>((p, key) => {
          p[key] = map[key] || {};
          return p;
        }, {});

      if (this.env === 'develop') {
        insertsObject(apiConfigEnv, result);
      }

      return result;
    };
  }
})();
