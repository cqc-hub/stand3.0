<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <g-flag typeFg="29" isShowFg />
    <g-choose-pat @choose-pat="getListData()" />
    <view
      :style="{
        background: `url(${globalGl.BASE_IMG}v3-hosAccount-bj${
          gStores.globalStore.isTcmStyle ? '-tcm' : ''
        }.png) 100%/100% no-repeat`,
      }"
      class="bg"
    >
      <view class="container">
        <view class="p40">
          <view class="flex-between">
            <view class="f28 color-888">账户余额(元)</view>
            <view
              v-if="pageConfig.isOpenLookRecordBtn === '1'"
              @click="goRecord"
              class="record flex-normal"
            >
              <view class="triangle-left"></view>
              <view class="records pl12">
                <text class="text text-no-wrap">查看充值及消费记录</text>
                <view class="iconfont right">&#xe66b;</view>
              </view>
            </view>
          </view>
          <view class="f80 g-bolder">{{ lists.accountBalance }}</view>
          <view class="f28 mt24 color-444"></view>
          <text>患者：</text>
          <text>{{ lists.patientName }}</text>
          <text v-if="lists.accountNo">
            &nbsp;
            <text style="color: #e6e6e6">|</text>
            &nbsp;
            <text>账户：</text>
            <text>{{ lists.accountNo }}</text>
          </text>

          <view v-if="lists.cardList && lists.cardList.length" class="w100p">
            <view v-for="item in lists.cardList" :key="item.cardNo">
              <text>
                {{ item.cardType }}
              </text>
              &nbsp;
              <text style="color: #e6e6e6">|</text>
              &nbsp;
              <text class="g-break-word">{{ item.cardNo }}</text>
            </view>
          </view>
        </view>
        <view class="f-button p24">
          <!-- @vue-expect-error -->
          <button
            v-if="isCash == '1' && lists.accountBalance !== '0'"
            @click="confirmForm1"
            class="btn btn-primary btn-border btn-plain f-base"
          >
            {{ '原路退回' }}
          </button>

          <button
            v-if="
              isCash == '1' && lists.accountBalance !== '0' && isRefoundExist
            "
            @click="confirmForm1('refound')"
            class="btn btn-primary btn-border btn-plain w-full"
          >
            {{ '申请实名转账退款' }}
          </button>

          <button
            v-if="isCash == '2' && lists.accountBalance !== '0'"
            @click="confirmForm1('refound')"
            class="btn btn-primary btn-border btn-plain f-base"
          >
            {{ '申请退款登记' }}
          </button>

          <button
            v-if="pageConfig.isHideAccountRefillBtn !== '1'"
            @click="confirmForm"
            class="btn btn-primary f-base"
          >
            充值
          </button>

          <button
            v-if="isRefoundExist"
            @click="goRefundRecord"
            class="btn btn-primary btn-border btn-plain w-full"
          >
            查看退款申请记录
          </button>
        </view>
      </view>
    </view>
    <!-- <view class="sec-con">
        <view class="content">
          <view class="con-flex"><view class="iconfont icon-color mr8">&#xe6d6;</view><text class="color-444">您有一笔金额提现中</text></view>
          <view class="iconfont">&#xe66b;</view>
        </view>
      </view> -->
    <g-flag typeFg="30" isShowFgTip />
    <Order-Reg-Confirm
      :title="confirmFgTitle"
      @confirm="goWithdrawal"
      height="50vh"
      :confirmText="!isRefound ? '原路退回' : '申请退款'"
      cannerText="取消"
      headerIcon=""
      ref="regDialogConfirm"
      isShowCloseIcon
      footerBtnIsometric
    >
      <view>
        <view class="mb40">
          <view>
            <view class="dialog-t f32 mb32">
              <text class="dt-width color-888">
                <text v-if="isRefound">当前可退款</text>
                <text v-else>可原路退回金额</text>
              </text>
              <text class="dt-red g-bolder">
                <text v-if="isRefound">{{ lists.accountBalance }}元</text>
                <text v-else>
                  {{ lists.allowOnLineCash ? lists.allowOnLineCash : '0' }}元
                </text>
              </text>
            </view>
          </view>

          <view v-if="!isRefound" class="dialog-t f32">
            <text class="dt-width color-888">到账账户</text>
            <text class="g-bolder">原路退回</text>
          </view>

          <!-- <view v-if="isRefound">
            不可原路退回金额
            <text class="dt-red g-bolder">{{ lists.accountBalance }}元</text>
          </view> -->
        </view>
        <g-flag
          v-model:title="confirmFgTitle"
          typeFg="1017"
          isShowFgTip
          isHideTitle
          aaa
        />
      </view>
    </Order-Reg-Confirm>

    <g-select
      v-model:value="reason"
      v-model:show="isReasonPopupShow"
      :option="reasonList"
      :field="{
        label: 'label',
        value: 'value',
      }"
      @change="reasonChange"
      @update:show="reasonClose"
      title="请选择充值理由"
    />

    <Choose-Pat
      @choose-pat="choosePatHandler"
      title="选择收款人"
      ref="familyActionSheet"
    />
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref, provide } from 'vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import {
    GStores,
    debounce,
    wait,
    ServerStaticData,
    ISystemConfig,
    useTBanner,
    idValidator,
  } from '@/utils';
  import api from '@/service/api';
  import { joinQuery } from '@/common';
  import { deQueryForUrl } from '@/common/utils';
  import { type IHospitalAccountDetail } from './utils/index';
  import { joinQueryForUrl } from '../../common/utils';
  import {
    TFamilyItem,
    TFamilyList,
  } from '@/pagesC/medRecordApply/utils/recordApply';
  import globalGl from '@/config/global';

  import ChoosePat from '@/pagesC/medRecordApply/components/FamilyChooseAction.vue';

  // api.getHospitalAccountDetail = () =>
  //   Promise.resolve({
  //     result: {
  //       patientName: '王佳蓓',
  //       allowOnLineCash: '8705.94',
  //       reason: [
  //         {
  //           codeTypeId: '202504011537290001',
  //           codeTypeName: 'PRESTORE_REASON',
  //           codeName: '急诊（含留观）',
  //         },
  //         {
  //           codeTypeId: '202504011537290001',
  //           codeTypeName: 'PRESTORE_REASON',
  //           codeName:
  //             '口腔正畸、血液透析、康复理疗等需按照疗程进行多次检查或治疗',
  //         },
  //         {
  //           codeTypeId: '202504011537290001',
  //           codeTypeName: 'PRESTORE_REASON',
  //           codeName: '日间手术、门诊手术、急诊手术',
  //         },
  //         {
  //           codeTypeId: '202504011537290001',
  //           codeTypeName: 'PRESTORE_REASON',
  //           codeName: '门诊特殊疾病',
  //         },
  //         {
  //           codeTypeId: '202504011537290001',
  //           codeTypeName: 'PRESTORE_REASON',
  //           codeName: '单位或团体为个人体检预交的资金',
  //         },
  //       ],
  //       accountNo: '20250123000000005013',
  //       accountBalance: '8705.94',
  //       cardNumber: '30039971',
  //     },
  //   });

  interface IPageProps {
    hosId: string;
    // 可以退费
    isCash?: any;
    type?: 'fromSelDepartment';
  }
  const pageProps = ref(<IPageProps>{});
  const isCash = ref('');
  const gStores = new GStores();
  const confirmFgTitle = ref('');
  const lists = ref({} as IHospitalAccountDetail);
  const regDialogConfirm = ref<any>('');
  const pageConfig = ref(<ISystemConfig['hospitalCare']>{});
  const isRefound = ref(false);
  const reasonList = computed(() => {
    const list =
      lists.value.reason ||
      [
        // {
        //   codeName: '233',
        // },
        // {
        //   codeName: '大家看',
        // },
      ];
    return list.map((o) => ({
      ...o,
      label: o.codeName,
      value: o.codeName,
    }));
  });

  const familyActionSheet = ref<InstanceType<typeof ChoosePat>>();
  const familyList = ref(<TFamilyList>[]);
  const selFamilyPat = ref(<TFamilyItem>{});
  provide('familyList', () => familyList.value);
  provide('selFamilyPat', () => selFamilyPat.value);
  const choosePatHandler = ({ item }) => {
    selFamilyPat.value = item;
    _resolve();
  };
  const getFamilyList = async () => {
    const pat = gStores.userStore.patChoose;
    const { patientId, idCardEncry } = pat;
    const { source } = gStores.globalStore.browser;

    let { result } = await api.relatedFamilyInfo({
      patientId,
      type: '0',
    });

    const {
      result: { idCard },
    } = await api.rpGetPlain({
      source,
      idCardEncry,
      patientId,
    });

    result = result || [];

    result.unshift({
      ...pat,
      idCard,
    });

    selFamilyPat.value = result[0];
    familyList.value = result;
  };

  const isRefoundExist = computed(
    () => pageConfig.value.isAccountCanRefund === '1'
  );

  const reFoundWorld = computed(() => {
    let w = '提现';

    if (isRefoundExist.value) {
      w = '退款';
    }

    return w;
  });

  let getListData = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const { hosId } = pageProps.value;
    const arg = {
      patientId,
      hosId,
    };
    lists.value = <any>[];

    const { result } = await api
      .getHospitalAccountDetail<IHospitalAccountDetail>(arg)
      .finally(() => {});
    lists.value = result || [];
  };

  getListData = debounce(getListData, 80);

  let accountWithdrawal = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const { accountNo, allowOnLineCash: amount } = lists.value;
    const arg = {
      patientId,
      accountNo,
      amount,
    };
    await api
      .accountWithdrawal(arg)
      .then((res) => {
        if (res.code == '0') {
          init();
          gStores.messageStore.showMessage(
            reFoundWorld.value +
              `申请已提交，${reFoundWorld.value}金额将原路返回，请耐心等待`,
            3000
          );
        }
      })
      .catch((err) => {
        init();
      });
  };
  accountWithdrawal = debounce(accountWithdrawal, 80);

  const init = async () => {
    await getListData();
  };

  const goRecord = () => {
    uni.navigateTo({
      url: joinQueryForUrl('/pagesC/hospitalAccount/record', {
        ...pageProps.value,
      }),
    });
  };

  onLoad(async (opt) => {
    pageConfig.value = await ServerStaticData.getSystemConfig('hospitalCare');

    //针对支付宝扫普通二维码跳转的处理 一开始没拿到参数不掉接口
    const queryParams = gStores.globalStore.appLaunchData?.query?.qrCode;
    // uni.showLoading({ title: '加载中'});;
    if (queryParams && !opt?.hosId) {
      return;
    }
    if (opt) {
      if (opt.hosId) {
        gStores.globalStore.onAppLaunch({});
      }
    }
    await wait(650);

    //针对微信扫普通二维码跳转的处理 一开始没拿到参数不掉接口
    if (opt?.q) {
      return;
    }
    pageProps.value = deQueryForUrl(opt);
    isCash.value = pageProps.value.isCash;
    init();
  });

  onShow(() => {
    if (pageProps.value.hosId) {
      init();
    }
  });

  let _resolve: any = () => {
    // r
  };

  let _reject: any = () => {
    // j
  };
  const reason = ref('');
  const isReasonPopupShow = ref(false);
  const reasonChange = () => {
    _resolve(reason.value);
  };
  const reasonClose = () => {
    if (isReasonPopupShow.value === false) {
      _reject();
    }
    isReasonPopupShow.value = false;
  };

  const confirmForm = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const { cardNumber, patientName } = lists.value;
    const { hosId } = pageProps.value;
    let reason = '';
    if (reasonList.value.length) {
      // await gStores

      const { title, content } = await gStores.getSysAppMore('6701');
      const { confirm } = await new Promise<any>((closeCallBack) => {
        gStores.messageStore.showMessage(content, 0, {
          useDialog: true,
          dialogOpt: {
            title,
            isShowCancel: true,
            cancelText: '取消预存操作',
            confirmText: '同意继续办理',
            maxHeight: 900,
          },
          closeCallBack,
        });
      });
      if (!confirm) {
        return;
      }
      isReasonPopupShow.value = true;
      reason = await new Promise((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
      });
    }

    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/hospitalCare/paymentPage', {
        hosId,
        cardNumber,
        patientName,
        reason,
        hospitalAccount: '12',
        _type: pageProps.value.type,
      }),
    });
  };

  const isAllowOnLineCash = computed(
    () => ((lists.value.allowOnLineCash || 0) as unknown as number) * 1
  );

  // 提现
  const isCanRefound = computed(
    () => isAllowOnLineCash.value
    // (isRefoundExist.value && isAllowOnLineCash.value) || !isRefoundExist.value
  );

  const goRefundRecord = () => {
    uni.navigateTo({
      url: joinQueryForUrl('/pagesC/hospitalAccount/refundRecord', {
        ...pageProps.value,
      }),
    });
  };

  const confirmForm1 = (type = '') => {
    isRefound.value = type === 'refound';

    if (
      gStores.globalStore.sysCode !== '1001095' &&
      lists.value.stopIndicator === '0' &&
      isRefound.value
    ) {
      gStores.messageStore.showMessage('账户已停用，请到现场窗口咨询！', 0, {
        useDialog: true,
        dialogOpt: {
          title: '温馨提示',
          isShowCancel: false,
          confirmText: '确认',
        },
      });
      return;
    }

    if (!isCanRefound.value) {
      const c = ((lists.value.accountBalance || 0) as unknown as number) * 1;
      if (!c) {
        gStores.messageStore.showMessage('当前没有可退款金额', 1500);
        return;
      }
    }

    // if (isRefoundExist.value && !allowOnLineCash) {
    //   // 退款
    //   return
    // }
    // if(lists.value.accountNo && lists.value.allowOnLineCash != '0'){
    regDialogConfirm.value.show();
    // }else{
    //   uni.showToast({
    //     title: '当前没有可提现金额',
    //     icon: 'none',
    //   });
    // }
  };

  const goWithdrawal = async () => {
    if (!isRefound.value) {
      accountWithdrawal();
    } else {
      // 退款不存在可提现金额
      const { accountBalance: refundFee, accountNo } = lists.value;
      const { hosId, isCash } = pageProps.value;
      const {
        patientPhone: patPhone,
        patientName,
        idCard: patIdCard,
      } = gStores.userStore.patChoose;

      // if (!familyList.value.length) {
      //   await getFamilyList();
      // }
      // familyActionSheet.value!.show();

      // await new Promise((resolve, reject) => {
      //   _resolve = resolve;
      //   _reject = reject;
      // });

      // const { patientName: openAccountName, idCard: openAccountIdCard } =
      //   selFamilyPat.value;

      // if (!openAccountIdCard) {
      //   gStores.messageStore.showMessage('未查询到收款人身份证信息', 1500);
      //   return;
      // }

      // 申请实名打款
      useTBanner({
        type: 'h5',
        isSelfH5: '1',
        path: 'pagesC/hospitalAccount/hospitalAccountRefund',
        text: '申请实名打款',
        extraData: {
          refundFee,
          accountNo,
          hosId,
          isCash,
          patPhone,
          patientName,
          // openAccountName,
          // openAccountIdCard,
          patIdCard,
        },
        addition: {
          token: 'token',
          herenId: 'herenId',
          patientId: '_patientId',
        },
        isLocal: '1',
      });
    }
  };
</script>

<style lang="scss" scoped>
  .f-base {
    flex: 1 1 100px;
  }
  .bg {
    // background: url($base-url + 'v3-hosAccount-bj.png') 100%/100% no-repeat;
    height: 1256rpx;
    .container {
      width: calc(100% - 64rpx);
      margin-left: 32rpx;
      margin-top: 40rpx;
      margin-bottom: 24rpx;
      background: #ffffff;
      border: 1rpx solid #e6e6e6;
      border-radius: 16rpx;
      .f-button {
        margin-top: 104rpx;
        display: flex;
        flex-wrap: wrap;
        gap: 24rpx;
        .f-b1 {
          // flex: 1 1 50%;
          background: var(--hr-brand-color-1);
          color: var(--hr-brand-color-6);
        }
      }
    }
    .sec-con {
      width: calc(100% - 64rpx);
      margin-left: 32rpx;
      margin-top: 24rpx;
      background: #ffffff;
      border: 1rpx solid #e6e6e6;
      border-radius: 8rpx;
      .content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10rpx 24rpx;
        .con-flex {
          display: flex;
          justify-content: space-between;
          align-content: center;
        }
        .icon-color {
          font-size: 40rpx;
          color: var(--hr-warning-color-6);
        }
      }
    }
  }
  .dialog-t {
    .dt-width {
      display: inline-block;
      width: 8em;
    }
  }
  .dt-red {
    color: #ff5040;
  }

  .records {
    // width: 152rpx;
    // height: 48rpx;
    padding: 6rpx;
    padding-right: 0;
    border-radius: 8rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--hr-brand-color-1);

    .text {
      color: var(--hr-brand-color-6);
      font-size: var(--hr-font-size-xxxs);
      font-weight: 600;
      text-align: center;
    }
    .right {
      font-size: var(--hr-font-size-base);
      color: var(--hr-brand-color-6);
    }
  }
  .triangle-left {
    margin: auto 0;
    width: 0;
    height: 2rpx;
    border-top: 10rpx solid transparent;
    border-right: 16rpx solid var(--hr-brand-color-1);
    border-bottom: 10rpx solid transparent;
  }
</style>
