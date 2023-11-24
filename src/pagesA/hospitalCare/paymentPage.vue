<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-page"
  >
    <view class="box">
      <view class="safe-height"></view>
      <view class="title">
        {{ pageProps.hospitalAccount ? '充值金额' : '预交费用' }}
      </view>
      <view class="buttons">
        <view
          :class="list[index] == defalutMoney ? 'activeButton' : 'button'"
          v-for="(item, index) in list"
          :key="index"
          @click="checkMoney(item)"
        >
          ¥{{ item }}
        </view>
      </view>
      <view class="pay-input">
        <view class="g-border-left util-content mb8">
          <text v-if="moneyUtil" class="g-split-line mr8"></text>
          <text v-if="moneyUtil" class="color-888">{{ moneyUtil }}</text>
        </view>

        <view v-if="isConfigComplete" class="flex-normal">
          <text class="m-util">¥</text>
          <input
            class="uni-input"
            maxlength="13"
            placeholder-style="font-size:32rpx;color:#888"
            :type="getMoneyInputType"
            v-model="defalutMoney"
            @change="inputMoneyChange"
            placeholder="输入自定义金额"
          />
        </view>
      </view>
      <view>
        <button
          :disabled="defalutMoney == '' ? true : false"
          :class="defalutMoney == '' ? 'submitBtn' : 'activeSubmitBtn'"
          @click="getPay"
        >
          确定
        </button>
      </view>
    </view>
    <g-pay
      :list="refPayList"
      :autoPayArg="payArg"
      @pay-success="payAfter"
      @pay-click="getPayInfo"
      autoInOne
      ref="refPay"
    >   </g-pay>
    <g-message />
  </view>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { onLoad, onReady } from '@dcloudio/uni-app';

  import { usePayPage } from './../clinicPay/utils/clinicPayDetail';

  import api from '@/service/api';
  import { GStores, ServerStaticData, wait, ISystemConfig } from '@/utils';
  import { payMoneyOnline, toPayPull } from '@/components/g-pay/index';
  import { deQueryForUrl, joinQueryForUrl } from '@/common/utils';
  import { payOrderResult } from './utils/inpatientInfo';
  
  const {
    getIsDigitalPay,
    getDigitalPay
  } = usePayPage();

  type IPageProps = {
    hosId: string;
    hosName: string;
    patientName?: string; //扫码的时候传 支付用
    cardNumber?: string;
    hospitalAccount?: string;
    type?: string; //有值1代表预交来的 所有预缴都不传patientid
    _type?: 'fromSelDepartment';
  };

  interface IGPay {
  label: string;
  key: 'online' | 'digital';
}

  const gStores = new GStores();
  const resultHos = ref<ISystemConfig['hospitalCare']>({} as any);
  const isConfigComplete = ref(false);

  const list = ref([]);
  const defalutMoney = ref('');
  const refPay = ref<any>('');
  const payOrder = ref<payOrderResult>({} as payOrderResult);
  const pageProps = ref({} as IPageProps);

  const refPayList = ref([
    {
      label: '自费支付',
      key: 'online',
    },
  ]);
  const payArg = ref<BaseObject>({});
  const getMoneyInputType = computed(() => {
    if (resultHos.value.isMode === '1' || !resultHos.value.isMode) {
      return 'digit';
    } else {
      return 'number';
    }
  });
  const checkMoney = (item) => {
    defalutMoney.value = String(item);
  }; 

  const getPayInfo = async ({ item }: { item: IGPay }) => {
    // 自费
    if (item.key === 'online') {
      toPay();
    } else if (item.key === 'digital') {
      toDigitalPay()
    }
  };

  const getPay = async () => {
    const isDigitalPay= getIsDigitalPay(resultHos.value);

   if(isDigitalPay){
    let labelPay = '自费支付'
    // #ifdef MP-WEIXIN
    labelPay = '微信支付'
    // #endif
    // #ifdef MP-ALIPAY
    labelPay = '支付宝支付'
    // #endif
    refPayList.value = [
        {
          label: labelPay,
          key: 'online',
        },

        {
          label: '数字人民币支付',
          key: 'digital',
        },
      ];
    }

    await wait(200);
    refPay.value.show();
  };
    /**
   * 创建订单 获取支付入参数据
   */

  const payBeforeCreateData = async ()=>{
    await inputMoneyChange();
    await int();
    const payArg: BaseObject ={
      phsOrderNo: payOrder.value.phsOrderNo,
      paySign: payOrder.value.paySign,
      totalFee: defalutMoney.value,
      phsOrderSource: pageProps.value.hospitalAccount
        ? pageProps.value.hospitalAccount
        : '3',
      source: gStores.globalStore.browser.source,
      ...pageProps.value,
      patientId:
        pageProps.value.type == '1'
          ? ''
          : gStores.userStore.patChoose.patientId,
    }
    return payArg
  }

  const toPay = async () => {
    const payArg = await payBeforeCreateData()
    const res = await payMoneyOnline(payArg);

    await toPayPull(res, '住院缴费');
    payAfter();
  };
  const payAfter = async () => {
    uni.showLoading({});
    await wait(1000);
    uni.hideLoading();

    if (pageProps.value._type === 'fromSelDepartment') {
      uni.reLaunch({
        url: joinQueryForUrl('/pagesA/MyRegistration/selDepartment', {
          hosId: pageProps.value.hosId,
          noTipDialog: '1',
        }),
      });
    } else {
      uni.navigateBack({
        delta: 1,
      });
    }
  };

  /** 数字人民币支付 */
  const toDigitalPay = async ()=>{
    
    //区分下 代缴 住院 门诊充值的回调地址
    let _returnUrl = '/pagesA/hospitalCare/hospitalCare';
    if(pageProps.value.type == '1' || pageProps.value.hosId){
      _returnUrl = '/pages/home/home'
    } 
    const payArg = await payBeforeCreateData()
    getDigitalPay(resultHos.value.payList!,_returnUrl,payArg)
  }
  
  const setData = async () => {
    isConfigComplete.value = false;
    const result = await ServerStaticData.getSystemConfig(
      'hospitalCare'
    ).finally(() => {
      isConfigComplete.value = true;
    });
    resultHos.value = result;
    if (result.inPatientPrePay) {
      list.value = JSON.parse(result.inPatientPrePay as any);
    }
  };

  const inputMoneyChange = async () => {
    const { isMode } = resultHos.value;

    if (isMode === '3') {
      if (((defalutMoney.value as any) * 1) % 100 !== 0) {
        gStores.messageStore.showMessage('金额仅支持100倍数', 3000, {
          closeCallBack() {
            defalutMoney.value = '';
          },
        });

        return Promise.reject(void 0);
      }
    }
  };
  const int = async () => {
    const { patientName, cardNumber, hosId, hosName } = pageProps.value;
    const { result } = await api.createInHospitalPayOrder<payOrderResult>({
      fee: defalutMoney.value,
      orderType: pageProps.value.hospitalAccount
        ? pageProps.value.hospitalAccount
        : '3',
      patientId:
        pageProps.value.type == '1'
          ? ''
          : gStores.userStore.patChoose.patientId,
      patientName,
      cardNumber,
      hosId,
      hosName,
    });
    payOrder.value = result;
  };

  const moneyUtil = computed(() => {
    return transformUnit((defalutMoney.value as unknown as number) * 1);
  });

  const transformUnit = (val: number) => {
    if (val) {
      const unitList = [
        '',
        '千',
        '万',
        '十万',
        '百万',
        '千万',
        '亿',
        '十亿',
        '百亿',
        '千亿',
        '兆',
      ];
      const v = (Math.floor(val / 1000) * 10).toString().length - 1;

      return unitList.length > v ? unitList[v] : '兆';
    } else {
      return '';
    }
  };
  onReady(() => {
    if (pageProps.value.hospitalAccount) {
      uni.setNavigationBarTitle({
        title: '充值',
      });
    }
  });
  onLoad((opt) => {
    pageProps.value = deQueryForUrl(opt);
    setData();
  });
</script>

<style scoped lang="scss">
  .g-page {
    background-color: #fff;
  }
  .box {
    padding: 0 32rpx;

    .title {
      color: #444;
      margin-bottom: 40rpx;
    }
    .buttons {
      display: flex;
      flex-wrap: wrap;
      :first-child {
        margin-right: 18rpx;
      }
      :nth-child(3) {
        margin-right: 18rpx;
      }
      :nth-child(5) {
        margin-right: 18rpx;
      }
      .button {
        width: 48%;
        height: 112rpx;
        border: 1px solid #e9f0ff;
        background-color: #e9f0ff;
        color: #444;
        font-weight: 600;
        border-radius: 16rpx;
        text-align: center;
        line-height: 112rpx;
        margin-bottom: 16rpx;
      }
      .activeButton {
        width: 48%;
        height: 112rpx;
        border: 1px solid #e9f0ff;
        background-color: #296fff;
        color: #fff;
        font-weight: 600;
        border-radius: 16rpx;
        text-align: center;
        line-height: 112rpx;
        margin-bottom: 16rpx;
      }
    }
    .pay-input {
      height: 144rpx;
      background-color: #f6f6f6;
      border-radius: 16rpx;
      .m-util {
        padding: 0 32rpx;
        font-weight: 600;
      }

      .util-content {
        // height: 64rpx;
        width: 100%;
        margin-left: 88rpx;
        &::after {
          content: '强';
          opacity: 0;
        }
      }
    }
    .submitBtn {
      height: 96rpx;
      border-radius: 16rpx;
      background-color: #9ebeff;
      color: #fff;
      text-align: center;
      line-height: 96rpx;
      margin-top: 120rpx;
      font-size: var(--hr-font-size-xl);
    }
    .activeSubmitBtn {
      height: 96rpx;
      border-radius: 16rpx;
      background-color: #296fff;
      color: #fff;
      text-align: center;
      line-height: 96rpx;
      margin-top: 120rpx;
      font-size: var(--hr-font-size-xl);
    }
    .uni-input {
      font-weight: 600;
      font-size: var(--hr-font-size-xl);
      background: #f6f6f6;
    }
  }
</style>
