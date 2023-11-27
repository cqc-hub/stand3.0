<template>
  <view class="g-page">
    <g-flag typeFg="29" isShowFg />
    <g-choose-pat @choose-pat="getListData()" />
    <view class="bg">
      <view class="container">
        <view class="p40">
          <view class="flex-between">
            <view class="f28 color-888">账户余额(元)</view>
            <view
              v-if="pageConfig.isOpenLookRecordBtn !== '1'"
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
          <button
            v-if="isCash == '1'"
            @click="confirmForm1"
            class="f-b1 mr8 btn btn-primary"
          >
            提现
          </button>
          <button @click="confirmForm" class="f-b2 ml8 btn btn-primary">
            充值
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
      confirmText="提现"
      cannerText="取消"
      headerIcon=""
      ref="regDialogConfirm"
      isShowCloseIcon
      footerBtnIsometric
    >
      <view>
        <view class="mb40">
          <view class="dialog-t f32 mb32">
            <text class="dt-width color-888">当前可提现</text>
            <text class="dt-red g-bolder">
              {{ lists.allowOnLineCash ? lists.allowOnLineCash : '0' }}元
            </text>
          </view>
          <view class="dialog-t f32">
            <text class="dt-width color-888">到账账户</text>
            <text class="g-bolder">原路返回</text>
          </view>
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
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import { onLoad, onPullDownRefresh, onShow } from '@dcloudio/uni-app';
  import {
    GStores,
    debounce,
    wait,
    ServerStaticData,
    ISystemConfig,
  } from '@/utils';
  import api from '@/service/api';
  import { joinQuery } from '@/common';
  import { deQueryForUrl } from '@/common/utils';
  import { type IHospitalAccountDetail } from './utils/index';
  import { joinQueryForUrl } from '../../common/utils';
  interface IPageProps {
    hosId: string;
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
            '提现申请已提交，提现金额将原路返回，请耐心等待',
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
    pageConfig.value = await ServerStaticData.getSystemConfig('hospitalCare');
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
    //针对支付宝扫普通二维码跳转的处理 一开始没拿到参数不掉接口
    const queryParams = gStores.globalStore.appLaunchData?.query?.qrCode;
    uni.showLoading({});
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

  const confirmForm = () => {
    const { patientId } = gStores.userStore.patChoose;
    const { cardNumber, patientName } = lists.value;
    const { hosId } = pageProps.value;
    uni.navigateTo({
      url: joinQuery('/pagesA/hospitalCare/paymentPage', {
        hosId,
        cardNumber,
        patientName,
        hospitalAccount: '12',
        _type: pageProps.value.type,
      }),
    });
  };
  const confirmForm1 = () => {
    // if(lists.value.accountNo && lists.value.allowOnLineCash != '0'){
    regDialogConfirm.value.show();
    // }else{
    //   uni.showToast({
    //     title: '当前没有可提现金额',
    //     icon: 'none',
    //   });
    // }
  };

  const goWithdrawal = () => {
    accountWithdrawal();
  };
</script>

<style lang="scss" scoped>
  .bg {
    background: url($base-url + 'v3-hosAccount-bj.png') 100%/100% no-repeat;
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
        .f-b1 {
          background: #e9f0ff;
          color: #296fff;
          width: 100%;
        }
        .f-b2 {
          width: 100%;
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
      width: 176rpx;
    }
    .dt-red {
      color: #ff5040;
    }
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
    background-color: #e9f0ff;

    .text {
      color: #296fff;
      font-size: var(--hr-font-size-xxxs);
      font-weight: 600;
      text-align: center;
    }
    .right {
      font-size: var(--hr-font-size-base);
      color: #296fff;
    }
  }
  .triangle-left {
    margin: auto 0;
    width: 0;
    height: 2rpx;
    border-top: 10rpx solid transparent;
    border-right: 16rpx solid #e9f0ff;
    border-bottom: 10rpx solid transparent;
  }
</style>
