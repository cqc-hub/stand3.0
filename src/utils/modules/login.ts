/**
 * login.ts文档
 * 基础存储层	GStores	封装全局状态（用户 / 消息 / 路由）的懒加载，统一状态访问入口
 * 登录核心层	LoginUtils	登录通用逻辑（获取用户信息 / 人脸核验 / OpenId 绑定），作为基类被继承
 * 登录策略层	WeChatLoginHandler等	不同登录渠道的具体实现（策略模式），适配各平台差异
 * 登录入口层	Login	统一登录入口，通过LoginType分发到对应策略类
 * 就诊人管理层	PatientUtils	就诊人增删改查 / 医保升级 / 健康卡绑定等核心业务
 * 工具函数层	packageAuthParams/getH5OpenidParam	接口参数封装 / OpenId 适配，解决多端参数规范不一致问题
 */
import {
  useGlobalStore,
  useUserStore,
  useMessageStore,
  useRouterStore,
  IPat,
  isAreaProgram,
} from '@/stores';
import { getSysCode, joinQuery } from '@/common';
import { getOpenId, getOpenidTtResult } from '@/components/g-pay/index';
import { apiAsync, cacheUtil, nameConvert, ServerStaticData } from '@/utils';
import { useViewerStore } from '@/stores/modules/viewer';

import api from '@/service/api';
import globalGl from '@/config/global';
import HTMLParser from '@/common/html-parser';

export enum LoginType {
  // 微信腾讯健康
  WeChatThReg,
  WeChat,
  AliPay,
  H5,
  TouTiao,
  PassWord,
  Harmony,
}

type TAliLogin = {
  userId: string;
  accessToken: string;
  refreshToken: string;
  certNo: string;
  certType: string;
  gender: string;
  mobile: string;
  userName: string;
  authPhoneVerify: string;
  loginData: string;
};

abstract class LoginHandler {
  abstract handler(payload?: any): Promise<void>;
}

export const getH5OpenidParam = function (data) {
  const globalStore = useGlobalStore();

  // #ifdef MP-WEIXIN
  data.openIds = [
    {
      openId: globalStore.h5OpenId,
      source: '3',
    },
    {
      openId: globalStore.openId,
      source: '19',
    },
  ];
  // #endif

  // #ifdef MP-ALIPAY
  data.openIds = [
    {
      openId: globalStore.openId,
      source: '21',
    },
  ];
  // #endif

  // #ifdef MP-HARMONY
  data.openIds = [
    {
      openId: globalStore.openId,
      source: globalStore.browser.source,
    },
  ];
  // #endif

  return data;
};

export const packageAuthParams = (
  args: {},
  url: string,
  payload: {
    isOutArgs?: boolean;
  } = {}
) => {
  if (['/register/bindRegisterUser'].includes(url)) {
    getH5OpenidParam(args);
  }

  const globalStore = useGlobalStore();
  const argsDefault = {
    sysCode: globalStore.sysCode,
    ...args,
  };
  const { isOutArgs } = payload;
  let authParam = argsDefault;
  let outParam: BaseObject = {};

  if (isOutArgs) {
    (authParam as any) = undefined;
    outParam = argsDefault;
  }

  return {
    authParam: {
      args: authParam,
      ...outParam,
      token: globalStore.getToken,
    },
    sysCode: undefined,
    url,
  };
};

export class GStores {
  _messageStore = '' as unknown as ReturnType<typeof useMessageStore>;
  _userStore = '' as unknown as ReturnType<typeof useUserStore>;
  _globalStore = '' as unknown as ReturnType<typeof useGlobalStore>;
  [key: string]: any;

  get messageStore() {
    if (!this._messageStore) {
      this._messageStore = useMessageStore();
    }

    return this._messageStore;
  }

  get userStore() {
    if (!this._userStore) {
      this._userStore = useUserStore();
    }
    return this._userStore;
  }

  get globalStore() {
    if (!this._globalStore) {
      this._globalStore = useGlobalStore();
    }
    return this._globalStore;
  }

  async getSysAppMore(
    typeFlag: any
  ): Promise<{ title: string; content: string; initialText?: string }> {
    if (!typeFlag) {
      return {
        title: '',
        content: '',
        initialText: '', //初始内容
      };
    }

    let isSuccess = true;

    const oldData = this.globalStore.flagCaches[typeFlag];
    if (oldData) {
      return oldData;
    }
    let flagData: any = null;

    if (JSON.stringify(this.globalStore.flagCaches) === '{}') {
      let { result = [] } = await api.getSysAppMores({ typeFlag }).catch(() => {
        isSuccess = false;
        return {} as any;
      });
      flagData = result.find((item) => item.typeFlag === typeFlag);
      isSuccess &&
        this.globalStore.setFlagsCaches(
          result.map((item) => {
            return { ...item, initialText: item.content };
          })
        );
    }
    let content = '';
    let title = '';
    let initialText = '';
    if (!flagData) {
      title = '';
      content = '未获取到协议 ' + typeFlag;
    } else {
      title = flagData.title;
      content = HTMLParser(flagData.content);
      initialText = '';
    }
    // const initialText = flagData?.content || '';
    // const title = flagData?.title || '';
    // if (!flagData) {
    //   flagData = {
    //     title: '',
    //     content: '未获取到协议 ' + typeFlag,
    //     initialText: '',
    //   };
    // }
    // const content = HTMLParser(flagData.content);
    return { title, content, initialText };
  }

  // 作为全局基础存储层的核心Class（GStores），开放addNewMethod这种「无约束动态扩展方法」的能力，在工程化层面不符合严谨的设计逻辑
  addNewMethod(methodName, methodBody) {
    // this.constructor 获取类本身
    this.constructor.prototype[methodName] = methodBody;
    return this;
  }
}

export class LoginUtils extends GStores {
  // 登录后 获取就诊人列表前
  async onAfterLoginAndBeforeGetPatList() {
    const { sysCode, ev, openId } = this.globalStore;

    try {
      if (sysCode === '1001067') {
        const reqData = getH5OpenidParam({
          loginData: this.globalStore.token.loginData,
          source: this.globalStore.browser.source,
        });
        await api.wfePatSync(reqData);
      }
      if (['1001086', '1001094'].includes(sysCode) && ev === 'wx') {
        const reqData = getH5OpenidParam({
          source: this.globalStore.browser.source,
          wxOpenId: openId,
        });
        await api.xjzyyPatSync(reqData);
      }
      if (['1001083'].includes(sysCode)) {
        await api.wzrmPatSync({ source: this.globalStore.browser.source });
      }

      //通过手机号同步
      if (['1001092', '1001095'].includes(sysCode)) {
        await api.patSync({ source: this.globalStore.browser.source });
      }
      // //通过微信openId去同步 type传1 ，复用老小程序则取用openId，
      // if (['1001085'].includes(sysCode)) {
      //   await api.patSync({
      //     source: this.globalStore.browser.source,
      //     type: 1,
      //     wxOpenId: openId,
      //   });
      // }
      //通过微信h5OpenId去同步 type传1 ，复用老公众号则取用h5OpenId，
      if (['1001097', '1001093', '1001085'].includes(sysCode)) {
        const reqData = {
          source: this.globalStore.browser.source,
          wxOpenId: this.globalStore.h5OpenId,
          type: 1,
        };
        await api.patSync(reqData);
      }
    } catch (error) {
      console.error(error);
    }
  }
  //判断是否需要前往手机号登录
  async judgeLoginByPhoneVerify() {
    let flag = false;
    const { isLoginByPhoneVerify } = await ServerStaticData.getSystemConfig(
      'RestOfConfig'
    );
    if (isLoginByPhoneVerify === '1') {
      // 把promise的resolve函数，赋值给messageStore的closeCallBack状态
      const { confirm } = await new Promise<any>((closeCallBack) => {
        this.messageStore.showMessage(
          '已取消一键授权登录，是否前往进行手机号登录？',
          0,
          {
            useDialog: true,
            dialogOpt: {
              isShowCancel: true,
              title: '登录',
              cancelText: '暂不登录',
              confirmText: '手机号登录',
            },
            closeCallBack, // resolve的入参会被直接作为Promise的最终结果值
          }
        );
      });
      flag = confirm;
    }
    return flag;
  }

  async getUerInfo(type?: 'alone', justGetInfo?: boolean) {
    try {
      const { source } = this.globalStore.browser;
      const { result } = await api.allinoneAuthApi(
        packageAuthParams(
          {
            source,
          },
          '/modifyUserInfo/userInfoByToken'
        )
      );

      if (result) {
        const {
          mobilePhone,
          cellPhoneNum,
          herenId,
          idNo,
          name,
          sex,
          mobilePhoneEn,
          phoneNum,
        } = result;
        const phone = mobilePhone || cellPhoneNum;
        this.userStore.updateName(name);
        this.userStore.updateSex(sex);
        this.userStore.updateIdNo(idNo);
        if (/^[\d{1,4}\*+\d{1,4}]{11}$/.test(phone)) {
          this.userStore.updatePhone({
            phone,
            phoneNum: mobilePhoneEn || phoneNum,
          });
        }

        if (mobilePhoneEn) {
          this.userStore.updatePhoneDecrypt(mobilePhoneEn);
        }

        this.globalStore.setHerenId(herenId);

        if (!herenId && !justGetInfo) {
          this.messageStore.showMessage('未完善，请先完善', 1000);
          setTimeout(() => {
            uni.reLaunch({
              url: globalGl.addPersonUrl + '?pageType=perfectReal',
            });
          }, 1200);

          return Promise.reject('未完善');
        } else {
          await this.onAfterLoginAndBeforeGetPatList();
          if (type !== 'alone') {
            //获取就诊人列表
            await new PatientUtils().getPatCardList();
          }
        }
      }
    } catch (error) {
      uni.hideLoading();
      return Promise.reject(error);
    }
  }

  async getPluginFamilyDesArgs(patientId): Promise<{
    anotherIdNo: string;
    anotherName: string;
  }> {
    const { result } = await api
      .getAliMedicalPat({
        patientId,
      })
      .catch((e) => {
        console.warn('获取亲情付字段getAliMedicalPat err', e);
        return {} as any;
      });

    return (
      result || {
        anotherIdNo: undefined,
        anotherName: undefined,
      }
    );
  }

  async faceVerify({ name, idCardNumber }) {
    // https://developers.weixin.qq.com/miniprogram/dev/platform-capabilities/cityservice/FacialRecognitionVerify.html
    if (this.globalStore.ev === 'wx') {
      const {
        result: { certifyId: verifyId, verifyResult },
      } = await api.wxFace({
        idType: '01', // 01身份证 02居民户口簿 03护照  031中国籍普通护照 032外国籍护照 04军官证 05驾驶证 06港澳居民来往内地通行证 07台湾居民来往内地通行证 99其他法定有效证件
        idCard: idCardNumber,
        patientName: name,
        source: this.globalStore.browser.source,
        openId: this.globalStore.openId,
      });

      return new Promise<{ verifyResult: string }>((resolve, reject) => {
        wx.checkIsSupportFacialRecognition({
          checkAliveType: 2,
          success: () => {
            wx.requestFacialVerify({
              // checkAliveType: 2,
              // name,
              // idCardNumber,
              verifyId,
              success: async (e) => {
                //识别成功
                console.warn('识别成功', e);
                // 识别失败微信仍然报成功 走接口认证下
                const { pData } = await this.getPData({
                  verifyResult,
                  idCard: idCardNumber,
                });
                resolve({
                  ...e,
                  verifyResult,
                  pData,
                });
              },
              fail(err) {
                //识别失败
                this.messageStore.showMessage('识别失败');
                console.error('识别失败', err);
                reject(err);
              },
            });
          },

          fail: (err) => {
            //不支持人脸检测
            this.messageStore.showMessage('该设备不支持人脸检测');
            console.error('该设备不支持人脸检测', err);

            reject(err);
          },
        });
      });
    } else if (this.globalStore.ev === 'alipay') {
      // https://opendocs.alipay.com/open/03oebe?pathHash=23ac7ae7&ref=api 本身是收费项目 BD可申请免费
      const {
        browser: { source },
        aliFaceType,
      } = this.globalStore;
      const {
        result: { url, certifyId, verifyResult },
      } = await api.alipayFace({
        source,
        patientName: name,
        idCard: idCardNumber,
        returnUrl: '/',
        idType: '01',
        type: aliFaceType,
      });
      const res = await apiAsync(my.startAPVerify, {
        url,
        certifyId,
      });
      const { result, resultStatus } = res;

      // resultStatus 6001
      if (resultStatus === '9000') {
        return {
          ...result,
          certifyId,
          verifyResult,
        };
      } else {
        // 6001 手动返回
        if (resultStatus !== '6001') {
          this.messageStore.showMessage('识别失败', 3000);
        }
      }

      throw new Error('识别失败');
    }

    throw new Error('未开通该服务');
  }

  async faceVerifyAndPDataForPat(pat: IPat) {
    const { patientName, patientId, idCardEncry, upIdCardEncry, upName } = pat;
    const { source } = this.globalStore.browser;

    const {
      result: { idCard, upIdCard },
    } = await api.rpGetPlain({
      source,
      idCardEncry,
      upIdCardEncry,
      patientId,
    });

    return this.faceVerifyAndPData({
      name: upName || patientName,
      idCardNumber: upIdCard || idCard,
    });
  }

  async faceVerifyAndPData({ name, idCardNumber }) {
    let { verifyResult, pData } = await this.faceVerify({
      name,
      idCardNumber,
    });

    if (!pData) {
      const r = await this.getPData({
        verifyResult,
        idCard: idCardNumber,
      });
      pData = r.pData;
    }

    return {
      pData,
      idCard: idCardNumber,
      name,
    };
  }

  async getPData({ verifyResult, idCard }) {
    const actionApi = this.globalStore.isLogin
      ? api.faceResultAuth
      : api.faceResultAuthPC;
    const {
      browser: { source },
      aliFaceType,
    } = this.globalStore;

    const {
      result: { pdata: pData },
    } = await actionApi({
      verifyResult,
      idCard,
      type: aliFaceType,
      source,
    });

    return {
      pData,
    };
  }

  async checkNoPublicOpenId() {
    const herenId = this.globalStore.herenId;
    herenId && (await this.sysPatOpenIdAssignment(this.globalStore.h5OpenId));
  }

  // 微信获取公众号 openid
  async getNoPublicOpenId(code: string, justGetId = false) {
    const {
      result: { openId },
    } = await api.allinoneAuthApi(
      packageAuthParams(
        {
          accountType: 1,
          code,
        },
        '/wx/getNoPublicOpenId',
        {
          isOutArgs: true,
        }
      ),
      {
        showMessage: false,
      }
    );

    this.globalStore.setH5OpenId(openId);

    if (justGetId) return;

    const herenId = this.globalStore.herenId;

    if (herenId) {
      this.sysPatOpenIdAssignment(openId);
    }
    if (this.globalStore.getToken) {
      await this.getUerInfo();
    }
  }

  /**
   * 微信绑定openid接口
   *
   * @param herenId
   * @param openId h5 openId
   */
  async sysPatOpenIdAssignment(openId) {
    const {
      openId: miniOpenId,
      browser: { source },
    } = this.globalStore;

    let openIds = [
      {
        openId: miniOpenId,
        source,
      },

      {
        openId,
        source: 3, //公众号openid
      },
    ];

    openIds = openIds.filter((o) => o.openId);

    await api.sysPatOpenIdAssignment({
      openIds,
    });
  }

  outLogin(
    options: Partial<{
      isHideMessage: boolean;
      isGoLoginPage: boolean;
    }> = {}
  ) {
    const { isHideMessage, isGoLoginPage } = options;
    this.userStore.clearStore();
    this.globalStore.clearStore();
    useRouterStore().clear();

    setTimeout(() => {
      if (!isHideMessage) {
        this.messageStore.showMessage('退出成功', 3000);
      }

      if (isGoLoginPage) {
        uni.reLaunch({
          url: '/pages/home/my',
          complete: () => {
            setTimeout(() => {
              this.messageStore.showMessage('请登录', 3000);
            }, 500);
          },
        });
      }
    }, 500);
  }

  // 注销用户
  async logoutUser() {
    await api.logoutUser({
      source: this.globalStore.browser.source,
    });
  }

  async getConfig() {
    return globalGl.sConfig.login || {};
  }

  /**
   *  - 代开发仅手机号授权登录
   *  - 代开发授权身份证, 手机号登录
   *  - 自主开发仅手机号登录
   *
   * @returns
   */
  async getAliOpenid(
    payload: {
      /**
       * 无视配置开启身份证授权
       */
      isAuth?: boolean;
    } = {}
  ) {
    const { isSkipPerfect, isAliAuthBase, isLoginByOpenId } =
      await this.getConfig();
    const { isAuth } = payload;
    const isvAppId = globalGl.systemInfo.isvAlipayAppid;

    let encrypData = '';

    const _isAliAuthBase = isAliAuthBase === '1' && isAuth !== true;
    const codeType = (_isAliAuthBase && 1) || 2;

    if (_isAliAuthBase) {
      const getPhoneNumberOpt: BaseObject = {};
      if (isvAppId) {
        getPhoneNumberOpt.protocols = {
          isvAppId,
        };
      }
      /**
       * https://opendocs.alipay.com/isv/03l4j2
       * https://opendocs.alipay.com/isv/03kqzj#1.%20%E4%B8%BA%E6%A8%A1%E6%9D%BF%E7%94%B3%E8%AF%B7%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF
       * 待开发后台
       *  - 开发设置-应用网关
       *  - 产品绑定-绑定产品-获取会员手机号
       *
       * - 主体申请 会员手机号能力（已启用，配置isAliAuthBase）
       *
       */
      /**
       * sConfig 下配置isAliAuthBase支持直接手机号授权
       */

      const resPhone = await apiAsync(my.getPhoneNumber, getPhoneNumberOpt);
      encrypData = resPhone.response;
    }

    // 代开发 带授权身份证 手机号登录
    const { authCode } = await apiAsync(my.getAuthCode, {
      // scopes: 'auth_user',
      scopes: _isAliAuthBase ? 'auth_base' : 'auth_user',
    });

    const accountType = this.globalStore.browser.accountType;
    const reqArg: BaseObject = {
      code: authCode,
      codeType, // 授权码类型 1-部分授权 2-用户信息授权
      accountType,
      encrypData,
    };

    // console.log(JSON.stringify(reqArg));
    // return
    // 以下逻辑有问题，调用接口失败的话根据系统码判断下
    let url = '';
    if (['1001048', '1001045'].includes(this.globalStore.sysCode)) {
      url = '/aliUserLogin/getTPAlipayUserInfoShare';
    } else if (isLoginByOpenId === '1') {
      url = '/login/authLogin';
    } else {
      // 代开发
      if (isvAppId) {
        // 完善? getTPAlipayUserInfoShare
        if (isSkipPerfect === '1') {
          url = '/aliUserLogin/alipayTpLoginByPhone'; // 代开发非完善
        } else if (_isAliAuthBase) {
          url = '/aliUserLogin/getAlipayBaseEncryLogin'; // 代开发完善
        } else {
          url = '/aliUserLogin/getTPAlipayUserInfoShare'; // 代开发完善
        }
      } else {
        if (isSkipPerfect === '1') {
          url = '/aliUserLogin/alipayTpLoginByPhone'; // 自研非完善
        } else {
          url = '/aliUserLogin/alipayLoginByPhone'; // 自研完善
        }
        // 完善暂无自研
        // Base授权登录暂无自研 - 支付宝手机号密文和Base授权登录  /aliUserLogin/getAlipayBaseEncryLogin
      }
    }

    // if (_isAliAuthBase) {
    //   url =
    //     isAliIndependentDev === '1'
    //       ? '/aliUserLogin/alipayTpLoginByPhone'
    //       : '/aliUserLogin/getAlipayBaseEncryLogin';
    // } else {
    //   url =
    //     isSkipPerfect === '1'
    //       ? '/aliUserLogin/alipayLoginByPhone'
    //       : '/aliUserLogin/getTPAlipayUserInfoShare';
    // }

    const { result } = await api.allinoneAuthApi<TAliLogin>(
      packageAuthParams(reqArg, url)
    );

    return result;
  }
}

class WeChatLoginHandler extends LoginUtils implements LoginHandler {
  async getWxLoginCode() {
    uni.showLoading({
      mask: true,
    });

    const { code } = await apiAsync(wx.login, {
      complete: uni.hideLoading,
    });

    if (!code) {
      throw new Error('未获取到 wx code');
    }

    return code as string;
  }

  async handler(payload?: any): Promise<void> {
    // 微信 必然有 payload
    if (!payload) {
      throw new Error('未获取到 wx payload');
    }
    const { target, detail, onlyLogin } = payload;
    const { isSkipPerfect, isLoginByOpenId } = await this.getConfig();

    if (detail.errMsg !== 'getPhoneNumber:ok') {
      if (await this.judgeLoginByPhoneVerify()) {
        uni.navigateTo({ url: '/pages/login/h5' });
        return;
      }
      this.messageStore.showMessage('用户取消授权', 3000);
      return Promise.reject(payload);
    }

    const code = await this.getWxLoginCode();
    const accountType = this.globalStore.browser.accountType;

    const { result } = await api.allinoneAuthApi(
      packageAuthParams(
        {
          code,
          accountType,
        },
        '/wx/getWxOpenId',
        {
          isOutArgs: true,
        }
      )
    );

    if (!result) {
      throw new Error('未获取到 wx OpenId');
    }

    const { openId, sessionKeyEn, sessionKey } = result;

    this.globalStore.setOpenId(openId);

    if (isLoginByOpenId === '1') {
      return await this.handlerByOpenid(payload);
    }

    const {
      encryptedData: encrypData,
      iv: ivData,
      code: phoneNumberCode,
    } = target;

    const requestData = {
      accountType,
      openId,
      sessionKeyEn,
      sessionKey,
      phoneNumberCode,
      ivData,
      encrypData,
      code: undefined,
    };

    const url =
      isSkipPerfect === '1'
        ? '/wx/wxLoginByPhoneCode' // 免完善接口
        : '/wx/wxLoginByPhoneNumberCode';

    const { result: loginResult } = await api.allinoneAuthApi(
      packageAuthParams(requestData, url)
    );

    if (loginResult) {
      const { accessToken, refreshToken, loginData } = loginResult;
      this.globalStore.setToken({
        accessToken,
        refreshToken,
        loginData,
      });
      await this.getUerInfo(...((onlyLogin && ['alone', true]) || []));
    }
  }

  // 这个也是免完善的
  async handlerByOpenid(payload?: any) {
    // 微信 必然有 payload
    if (!payload) {
      throw new Error('未获取到 wx payload');
    }
    const { onlyLogin, target = {} } = payload;
    const {
      encryptedData: encrypData,
      iv: ivData,
      code: phoneNumberCode,
    } = target;

    const code = await this.getWxLoginCode();
    const accountType = this.globalStore.browser.accountType;

    const requestData = {
      code,
      accountType,
      encrypData,
      ivData,
      // phoneNumberCode,
      codeType: 2,
    };

    const { result: loginResult } = await api.allinoneAuthApi(
      packageAuthParams(requestData, '/login/authLogin')
    );

    if (loginResult) {
      const { accessToken, refreshToken, loginData } = loginResult;
      this.globalStore.setToken({
        accessToken,
        refreshToken,
        loginData,
      });
      // this.globalStore.setOpenId(userId);
      await this.getUerInfo(...((onlyLogin && ['alone', true]) || []));
    }
  }
}

let isLoading = false;
export class AliPayLoginHandler extends LoginUtils implements LoginHandler {
  async handler(e): Promise<void> {
    // const { isAliAuthBase } = await this.getConfig();

    // if (isAliAuthBase !== '1') {
    //   return await this.handlerAuth(e);
    // }

    if (isLoading) {
      return;
    }

    uni.showLoading({
      mask: true,
    });

    try {
      isLoading = true;
      const accountType = this.globalStore.browser.accountType;
      const {
        userId,
        accessToken,
        refreshToken,
        loginData,
        certNo,
        certType,
        gender,
        mobile,
        userName,
      } = await this.getAliOpenid();

      this.userStore.updateCacheUser({
        certNo,
        certType,
        gender,
        mobile,
        userName,
      });

      if (accountType === 1) {
        this.globalStore.setH5OpenId(userId);
      } else {
        this.globalStore.setOpenId(userId);
      }

      this.globalStore.setToken({
        accessToken,
        refreshToken,
        loginData,
      });

      await this.getUerInfo();
    } catch (error: any) {
      if (error) {
        const { errorMessage } = error;

        if (errorMessage) {
          if (await this.judgeLoginByPhoneVerify()) {
            uni.navigateTo({ url: '/pages/login/h5' });
            return;
          }
          this.messageStore.showMessage(errorMessage);
        }

        throw new Error(error);
      }
    } finally {
      isLoading = false;
      uni.hideLoading();
    }
  }

  // handlerAuth
  async handlerAuth(e: any = {}): Promise<void> {
    const { onlyLogin } = e;

    uni.showLoading({
      mask: true,
    });

    try {
      const accountType = this.globalStore.browser.accountType;
      const {
        userId,
        accessToken,
        refreshToken,
        certNo,
        certType,
        gender,
        mobile,
        userName,
        authPhoneVerify,
      } = await this.getAliOpenid({
        isAuth: true,
      });

      this.userStore.updateCacheUser({
        certNo,
        certType,
        gender,
        mobile,
        userName,
      });
      this.userStore.updateAuthPhoneVerify(authPhoneVerify);

      if (accountType === 1) {
        this.globalStore.setH5OpenId(userId);
      } else {
        this.globalStore.setOpenId(userId);
      }

      this.globalStore.setToken({
        accessToken,
        refreshToken,
      });

      // await this.getUerInfo('alone', true);
      await this.getUerInfo(...((onlyLogin && ['alone', true]) || []));
    } catch (error: any) {
      if (error) {
        const { errorMessage } = error;

        if (errorMessage) {
          this.messageStore.showMessage(errorMessage);
        }

        throw new Error(error);
      }
    } finally {
      uni.hideLoading();
    }
  }
}

class WebLoginHandler extends LoginUtils implements LoginHandler {
  async handler(payload?: any): Promise<void> {
    // this.messageStore.showMessage('暂未支持 h5 登录');
    // return Promise.reject('暂未支持 h5 登录');

    const pages = getCurrentPages();

    if (pages.length) {
      const fullUrl: string = (pages[pages.length - 1] as any).$page.fullPath;
      const routeStore = useRouterStore();
      routeStore.receiveQuery({
        _url: fullUrl,
      });
    }

    uni.navigateTo({
      url: '/pages/login/h5',
    });

    throw Error('即将去往 h5 登录页');
  }
}

/** wx腾讯健康登录 */
class WeChatThRegHandler extends LoginUtils implements LoginHandler {
  async handler({ thRegisterId }): Promise<void> {
    const openId = await getOpenId();
    const { source } = this.globalStore.browser;

    const { result: loginResult } = await api.loginByThRegisterId({
      source,
      openId,
      thRegisterId,
    });

    if (loginResult) {
      const { accessToken, refreshToken } = loginResult;
      const pages = getCurrentPages();
      const fullPathNow = (pages[pages.length - 1] as any).$page
        .fullPath as string;

      this.globalStore.setToken({
        accessToken,
        refreshToken,
      });

      if (!this.globalStore.h5OpenId && globalGl.h5AppId) {
        useRouterStore().receiveQuery({
          _url: encodeURIComponent(fullPathNow),
        });
      }

      await this.getUerInfo('alone', true);

      if (!this.globalStore.herenId) {
        useRouterStore().receiveQuery({
          _url: encodeURIComponent(fullPathNow),
        });
        await this.getUerInfo('alone');
      }
    }
  }
}

/** 抖音登录 */
class TouTiaoHandler extends LoginUtils implements LoginHandler {
  async handler({ detail }): Promise<void> {
    try {
      const { encryptedData, iv } = detail;

      if (!encryptedData) {
        this.messageStore.showMessage('用户取消登录', 3000);
        return Promise.reject('用户取消登录');
      }

      uni.showLoading({
        mask: true,
        title: '登录中..',
      });

      const accountType = this.globalStore.browser.accountType;
      const { openId, sessionKeyEn, anonymousCode, code } =
        await getOpenidTtResult();

      // https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/open-capacity/basic-capacities/obtain-mobilenumber/
      // https://developer.open-douyin.com/docs/resource/zh-CN/codelabs/mini-app/microapp-login/silent-login
      // const { anonymousCode, code } = await apiAsync(uni.login, {});

      const { result } = await api.allinoneAuthApi(
        packageAuthParams(
          {
            code,
            anonymousCode,
            accountType,
            encryptedData,
            iv,
            openId,
            sessionKeyEn,
          },
          '/tikTok/tikTokLogin'
        )
      );

      if (result) {
        const { accessToken, refreshToken } = result;
        this.globalStore.setToken({
          accessToken,
          refreshToken,
        });

        await this.getUerInfo();
      } else {
        return Promise.reject('登录失败');
      }
    } catch (error) {
      console.error(error);
      throw new Error('登录失败');
    } finally {
      uni.hideLoading();
    }
  }
}

class PassWordHandler extends LoginUtils implements LoginHandler {
  async handler({ password, cellPhoneNum }): Promise<void> {
    const reqArg = {
      sysCode: getSysCode(),
      password,
      cellPhoneNum,
      loginName: cellPhoneNum,
    };

    const { result } = await api.allinoneAuthApi(
      packageAuthParams(reqArg, joinQuery('/login/usePasswordLogin', reqArg))
    );

    const { accessToken, refreshToken } = result;

    this.globalStore.setToken({
      accessToken,
      refreshToken,
    });

    await this.getUerInfo();
  }
}

class HarmonyHandler extends LoginUtils implements LoginHandler {
  async handler(payload: any = {}): Promise<void> {
    const { code, errMsg } = payload.target;

    if (code) {
      const { result } = await api.allinoneAuthApi(
        packageAuthParams(
          {
            accountType: this.globalStore.browser.accountType,
            code,
          },
          '/hw/hwLoginByPhoneCode'
        )
      );

      const {
        accessToken,
        refreshToken,
        openId,
        // idNo: certNo,
        // cellPhoneNum: mobile,
        // legalName: userName,
      } = result;

      // this.userStore.updateCacheUser({
      //   mobile,
      //   userName,
      //   certNo,
      // });
      this.globalStore.setOpenId(openId);
      this.globalStore.setToken({
        accessToken,
        refreshToken,
      });

      await this.getUerInfo();
    } else {
      this.messageStore.showMessage(errMsg, 1500);
      throw new Error(errMsg);
    }
  }
}

export class Login extends LoginUtils {
  public static handlerMap: Record<LoginType, LoginHandler> = {
    [LoginType.WeChat]: new WeChatLoginHandler(),
    [LoginType.AliPay]: new AliPayLoginHandler(),
    [LoginType.H5]: new WebLoginHandler(),
    [LoginType.WeChatThReg]: new WeChatThRegHandler(),
    [LoginType.TouTiao]: new TouTiaoHandler(),
    [LoginType.PassWord]: new PassWordHandler(),
    [LoginType.Harmony]: new HarmonyHandler(),
  };

  static async handler(type: LoginType, payload?: any) {
    await Login.handlerMap[type].handler(payload);
    new LoginUtils().checkNoPublicOpenId();
  }
}

export class PatientUtils extends LoginUtils {
  usePatDynamicCode = {
    async isOpen(path: string) {
      const { GlobalConfig } = await cacheUtil.getSystemConfig(
        'GlobalConfig'
      )();

      return (GlobalConfig.refreshQrCode || []).includes(path);
    },

    getCode: async (pat: IPat): Promise<string> => {
      const {
        result: { code },
      } = await api.patDynamicCode({
        patientId: pat.patientId,
        source: this.globalStore.browser.source,
      });

      return code;
    },
  };

  // 获取当前就诊人隐私数据
  async getPatientPersonalInfo(
    opt: { phone?: boolean; idCard?: boolean; pat?: IPat } = {}
  ) {
    const { phone, idCard } = opt;
    const pat = opt.pat || this.userStore.patChoose;

    const { patientId, cellPhoneNumber, idCardEncry, upIdCardEncry } = pat;

    const arg: any = {
      source: this.globalStore.browser.source,
      upIdCardEncry,
      patientId,
    };

    if (idCard) {
      arg.idCardEncry = idCardEncry;
    }

    if (phone) {
      arg.cellPhoneNumber = cellPhoneNumber;
    }
    const {
      result: { patientPhone: _patientPhone, idCard: _idCard, upIdCard },
    } = await api.rpGetPlain(arg);

    return {
      phone: _patientPhone,
      idCard: _idCard,
      upIdCard,
    };
  }

  /** 快速预约添加就诊人 */
  async quickAppointmentAddPat(patData: {
    patientName: string;
    patientPhone: string;
    verifyCode: string;
    [key: string]: any;
  }): Promise<{
    patientId: string;
  }> {
    const args = {
      ...patData,
      // 徐要求无证件时候传入
      idType: patData.idType || '100',
      source: this.globalStore.browser.source,
    };
    getH5OpenidParam(args);
    const { result } = await api.quickAppointmentAddPat(args);

    return result;
  }

  /** 升级医保用户 */
  async upToMedicalPat(data: { pat?: IPat; cardNumber?: string }) {
    const { pat, cardNumber } = data;
    const isOpenPatToMedicalPat =
      globalGl.sConfig.medicalMHelp?.isOpenPatToMedicalPat;
    const {
      browser: { source },
    } = this.globalStore;

    if (!isOpenPatToMedicalPat) {
      return;
    }

    if (cardNumber) {
      await api.altHosMedicalInfo({
        cardNumber,
        source,
      });
    } else if (pat) {
      const { patientId, healthCardUser } = pat;
      if (healthCardUser && healthCardUser === '2') {
        return;
      }

      await api.updateHosInfo({
        patientId,
        source,
      });

      await this.getPatCardList();
      const { patChoose, patList } = this.userStore;

      if (patChoose.patientId === patientId) {
        const newPatInfo = patList.find((p) => p.patientId === patientId)!;
        this.userStore.updatePatChoose(newPatInfo);
      }
    }
  }

  /**
   * 完善
   */
  async registerUser(
    payload: BaseObject,
    options: Partial<{
      addPatInterface: 'hasBeenTreated' | 'relevantPatient';
    }> = {
      addPatInterface: 'hasBeenTreated',
    }
  ) {
    const { addPatInterface } = options;
    payload = {
      ...payload,
    };
    const {
      idCard: idNo,
      idType,
      patientName,
      patientPhone,
      patientType: patientType,
      verifyCode,
      verifyType,
      sex,
      birthday,
      wechatCode, // 微信电子健康卡时候有
      cellPhoneNumber,
      idCardEncry,
      relationship,
      relationshipCode,
    } = payload;
    const { accountType, source } = this.globalStore.browser;

    const _sex = (sex && (sex === '男' ? '1' : '2')) || '';
    const requestData: any = {
      accountType,
      idNo,
      // 统一认证不区分 国内外 护照， 只有护照
      idType: ['031', '032'].includes(idType) ? '03' : idType,
      patientType,
      name: patientName,
      cellphone: patientPhone,
      sex: _sex,
      gender: _sex,
      birthday,
      cellPhoneNumber,
      idCardEncry,
      source,
      relationship,
      relationshipCode,
    };

    uni.showLoading({
      title: '完善就诊人中...',
      mask: true,
    });

    let result: any;

    if (addPatInterface === 'hasBeenTreated') {
      const { result: r } = await api.allinoneAuthApi1(requestData);
      result = r;
    } else {
      const { result: r } = await api.allinoneAuthApi(
        packageAuthParams(requestData, '/register/bindRegisterUser')
      );
      result = r;
    }

    // .catch((err) => {
    //   return Promise.reject({
    //     errorType: 'add',
    //     err,
    //   });
    // });

    if (result) {
      const { accessToken, refreshToken } = result;
      this.globalStore.setToken({
        accessToken,
        refreshToken,
      });

      uni.showLoading({
        title: '获取就诊人数据...',
        mask: true,
      });

      await this.getUerInfo('alone');

      uni.showLoading({
        title: '添加就诊人中...',
        mask: true,
      });

      if (addPatInterface === 'hasBeenTreated') {
        await this.addPatient({
          ...payload,
          defaultFalg: '1',
          herenId: this.globalStore.herenId,
          patientName,
          patientPhone,
          patientType,
          source: this.globalStore.browser.source,
          verifyCode: verifyCode || '1',
          verifyType,
          _type: 'perfect',
        });
      } else {
        // relevantPatient
        await this.addRelevantPatient({
          ...payload,
          _type: 'perfect',
        }).catch(async (err) => {
          return Promise.reject({
            err,
            errorType: 'add',
          });
        });
      }

      await this.getPatCardList();
    }
  }

  /**
   * 新增
   */
  async addPatient(
    data: Partial<{
      defaultFalg: '0' | '1';
      herenId: number | string;
      openIds: { openId: string; source: string }[];
      patientName: string;
      patientPhone: string;
      patientType: string;
      source: string | number;
      upIdCard: string;
      upName: string;
      verifyCode: string;
      verifyType: string;
      _type?: 'perfect';
    }>
  ) {
    getH5OpenidParam(data);
    if (data._type === 'perfect') {
      const {
        result: { patientId },
      } = await api.addPatByHasBeenTreatedEncry({
        ...data,
        patientType: '',
      });

      return patientId;
    } else {
      const {
        result: { patientId },
      } = await api.addPatientByHasBeenTreated({ ...data, patientType: '' });
      return patientId;
    }
  }

  async addCachePatient(
    data: Partial<{
      _type?: 'perfect';
      _autoSetDefault: string;
      wechatCode: string; // 微信电子健康卡时候有

      addressCity: string;
      addressCounty: string;
      addressCountyCode: string;
      addressProvince: string;
      birthday: string; //非身份证类型/儿童必填
      defaultFalg: boolean;
      idCard: string;
      idType: string;
      location: string;
      nation: string;
      openIds: { openId: string; source: string }[];
      patientName: string;
      patientPhone: string;
      patientType: string;
      sex: string; // 非身份证类型/儿童必填
      upIdCard: string; // 儿童必填
      upName: string; // 儿童必填
      verifyCode: string;
      verifyType: string; // 1&bk 不开启验证  2&kq 开启验证
    }>
  ) {
    const { wechatCode } = data;

    const requestArg = {
      ...data,
      defaultFalg: data.defaultFalg ? '1' : '0',
      source: this.globalStore.browser.source,
      herenId: this.globalStore.herenId,
      verifyType: data.verifyType || '1&bk',
      healthCardId: '',
      qrCodeText: '',
    };
    const isNewMode = globalGl.systemInfo.isOpenHealthCard?.isNewMode;
    getH5OpenidParam(requestArg);
    if (wechatCode && !isNewMode) {
      const { healthCardId, qrCodeText } = await this.regHealthCardByPatInfo(
        data
      );

      requestArg.qrCodeText = qrCodeText;
      requestArg.healthCardId = healthCardId;
    }

    const { result } = await api.cachePat(requestArg);

    return result as string;
  }

  async addRelevantPatient(
    data: Partial<{
      _type?: 'perfect';
      _autoSetDefault: string;
      wechatCode: string; // 微信电子健康卡时候有

      addressCity: string;
      addressCounty: string;
      addressCountyCode: string;
      addressProvince: string;
      birthday: string; //非身份证类型/儿童必填
      defaultFalg: boolean;
      idCard: string;
      idType: string;
      location: string;
      nation: string;
      openIds: { openId: string; source: string }[];
      patientName: string;
      patientPhone: string;
      patientType: string;
      sex: string; // 非身份证类型/儿童必填
      upIdCard: string; // 儿童必填
      upName: string; // 儿童必填
      verifyCode: string;
      verifyType: string; // 1&bk 不开启验证  2&kq 开启验证
    }>
  ) {
    const { wechatCode } = data;

    const requestArg = {
      ...data,
      defaultFalg: data.defaultFalg ? '1' : '0',
      source: this.globalStore.browser.source,
      herenId: this.globalStore.herenId,
      verifyType: data.verifyType || '1&bk',
      healthCardId: '',
      qrCodeText: '',
    };
    const isNewMode = globalGl.systemInfo.isOpenHealthCard?.isNewMode;
    getH5OpenidParam(requestArg);
    if (wechatCode && !isNewMode) {
      const { healthCardId, qrCodeText } = await this.regHealthCardByPatInfo(
        data
      );

      requestArg.qrCodeText = qrCodeText;
      requestArg.healthCardId = healthCardId;
    }

    const {
      result: { patientId },
    } = await api.addPat(requestArg);

    if (data._autoSetDefault) {
      await this.changeDefault({
        patientId,
        defaultFalg: true,
      });
    } else {
      if (data.defaultFalg) {
        this.userStore.updatePatChoose({} as any);
      }

      return patientId;

      // if (wechatCode) {
      //   await this.registerHealthCard(
      //     {
      //       patientId,
      //       wechatCode,
      //     },
      //     false,
      //     false
      //   );
      // }
    }
  }

  async registerHealthCard(
    data: { patientId: string; wechatCode: string },
    isErr = true,
    showMessage = true
  ) {
    const { patientId, wechatCode } = data;

    await api
      .registerHealthCard(
        {
          patientId,
          wechatCode,
          source: this.globalStore.browser.source,
        },
        {
          showMessage,
        }
      )
      .catch((err) => {
        if (isErr) {
          throw new Error(err);
        } else {
          console.error('此处不抛出错误', err);
        }
      });
  }

  async regHealthCardByPatInfo(
    data: Partial<{
      _autoSetDefault: string;
      wechatCode: string; // 微信电子健康卡时候有

      addressCity: string;
      addressCounty: string;
      addressCountyCode: string;
      addressProvince: string;
      birthday: string; //非身份证类型/儿童必填
      defaultFalg: boolean;
      idCard: string;
      idType: string;
      location: string;
      nation: string;
      openIds: { openId: string; source: string }[];
      patientName: string;
      patientPhone: string;
      patientType: string;
      sex: string; // 非身份证类型/儿童必填
      upIdCard: string; // 儿童必填
      upName: string; // 儿童必填
      verifyCode: string;
      verifyType: string; // （1或空）不开启验证  2:开启验证
    }>
  ): Promise<{ healthCardId: string; qrCodeText: string }> {
    const requestArg = {
      ...data,
      defaultFalg: data.defaultFalg ? '1' : '0',
      source: this.globalStore.browser.source,
      herenId: this.globalStore.herenId,
      verifyType: data.verifyType || '1&bk',
      healthCardId: '',
      qrCodeText: '',
    };

    getH5OpenidParam(requestArg);

    const { result } = await api.regHealthCardByPatInfo(requestArg);

    return result;
  }

  async getPatCardList() {
    const requestArg = {
      herenId: this.globalStore.herenId,
      source: this.globalStore.browser.source,
    };

    const { result } = await api.getPatCardList(requestArg);

    if (result && result.length) {
      const isArea = isAreaProgram();
      result.map((o) => {
        o._showId = (isArea && o.idCard) || o.cardNumber || '';
        if (!o.patientNameEncry) {
          o.patientNameEncry = nameConvert(o.patientName);
        }
      });

      this.userStore.updatePatList(result);
      const oldPatientId = this.userStore.patChoose.patientId;

      if (oldPatientId) {
        const newPatChoose = result.find((o) => o.patientId === oldPatientId);

        newPatChoose && this.userStore.updatePatChoose(newPatChoose);
      }
    } else {
      this.userStore.updatePatList([]);
    }
  }

  /**
   * 切换默认人
   */
  async changeDefault(data: { defaultFalg: boolean; patientId: string }) {
    const { patientId, defaultFalg } = data;

    uni.showLoading({
      title: '请求中...',
      mask: true,
    });

    await api.updateDefaultPat({
      patientId,
      defaultFalg: defaultFalg ? '1' : '0',
      herenId: this.globalStore.herenId,
    });

    uni.hideLoading();

    this.userStore.updatePatListDefault({
      patientId,
      defaultFalg,
    });
  }

  /**
   * 删除就诊人
   */
  async deletePat(data: { patientId: string } & BaseObject) {
    const { patientId } = data;

    // const pat = <IPat>(
    //   this.userStore.patList.find((o) => o.patientId === patientId)
    // );

    uni.showLoading({
      title: '请求中...',
      mask: true,
    });

    await api.deletePat({
      ...data,
      patientId,
      source: this.globalStore.browser.source,
    });

    uni.hideLoading();
    this.userStore.deletePat(patientId);

    if (this.userStore.patList.length) {
      // 自动切换默认就诊人 （产品拒绝加上）
      // if (pat.defaultFlag === '1') {
      //   const newDefaultPat = this.userStore.patList[0];
      //   this.changeDefault({
      //     patientId: newDefaultPat.patientId,
      //     defaultFalg: true,
      //   });
      // }
    }
  }
}

export const aliLogin = async function () {
  await Login.handler(LoginType.AliPay);
};

export const wxLogin = async function (e) {
  await Login.handler(LoginType.WeChat, e);
};

export const handlerLogin = async (e: BaseObject = {}) => {
  const { thRegisterId } = e;
  let _env = LoginType.WeChat;

  // #ifdef MP-WEIXIN
  if (thRegisterId) {
    _env = LoginType.WeChatThReg;
  }
  // #endif

  // #ifdef MP-ALIPAY
  _env = LoginType.AliPay;
  // #endif

  // #ifdef H5
  _env = LoginType.H5;
  // #endif

  // #ifdef MP-TOUTIAO
  _env = LoginType.TouTiao;
  // #endif

  // #ifdef MP-HARMONY
  _env = LoginType.Harmony;
  // #endif

  await Login.handler(_env, e);
};

export const outLogin = function (
  payload: Partial<{
    isHideMessage: boolean;
    isGoLoginPage: boolean;
  }> = {}
) {
  new LoginUtils().outLogin(payload);
};

export const handlerWeChatThRegLogin = async function (e: {
  thRegisterId?: string;
}) {
  const { thRegisterId } = e;

  // #ifdef MP-WEIXIN
  const gStores = new GStores();

  if (thRegisterId && !gStores.globalStore.isLogin) {
    await handlerLogin(e);

    if (gStores.globalStore.herenId) {
      await new PatientUtils().getPatCardList();
    }
  }
  // #endif
};
