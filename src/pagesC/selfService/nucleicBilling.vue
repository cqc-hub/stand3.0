<template>
  <view class="g-page">
    <g-flag typeFg="801" isShowFg />
    <g-choose-pat />
    <view v-if="tabs.length" class="g-border-bottom">
      <g-tabs
        v-model:value="tabCurrent"
        :tabs="tabs"
        :scroll="false"
        @change="initConfig"
        field="label"
        style="width: 100%"
      />
    </view>
    <scroll-view
      v-if="pageLoading && NucleResult && NucleResult.length > 0"
      class="g-container box"
      scroll-y
    >
      <view
        class="box-tips box-card"
        v-if="NucleResult[0].itemTime || NucleResult[0].itemAddress"
      >
        <view>
          <label>检测时间</label>
          <label>{{ NucleResult[0].itemTime }}</label>
        </view>
        <view>
          <label>检测地点</label>
          <label>{{ NucleResult[0].itemAddress }}</label>
        </view>
      </view>
      <!-- <view class="box-date box-card">
        <label>检测日期</label>
        <label>2022-10-27</label>
        <text :class="`iconfont icon-resize`">&#xe66b;</text>
      </view> -->
      <view class="box-list box-card mb20">
        <view
          v-for="item in NucleResult"
          :key="item.itemCode"
          @tap="clickItem(item)"
          :class="{
            active: selList.findIndex((o) => o.itemCode === item.itemCode) > -1,
          }"
          class="box-aaa"
        >
          <view class="box-item">
            <label>{{ item.itemName }}</label>
            <label>{{ item.fee }}元</label>
            <block
              v-if="selList.findIndex((o) => o.itemCode === item.itemCode) > -1"
            >
              <text class="iconfont ico-checkbox">&#xe6d0;</text>
            </block>
            <block v-else>
              <text class="iconfont">&#xe6ce;</text>
            </block>
          </view>

          <view v-if="item.tips" class="color-888 f26 g-break-word">
            <rich-text :nodes="HTMLParser(item.tips)" />
          </view>
        </view>
      </view>
      <g-flag typeFg="45" isShowFgTip aaa />
    </scroll-view>
    <view
      class="g-footer"
      v-if="pageLoading && NucleResult && NucleResult.length > 0"
    >
      <button
        v-if="pageConfig.footerBtn"
        class="btn btn-primary btn-plain btn-border flex1"
        @click="useTBanner(pageConfig.footerBtn)"
      >
        {{ pageConfig.footerBtn.text }}
      </button>
      <button
        :class="{
          'btn-disabled': isSubBtnDisabled,
        }"
        class="btn btn-primary flex1"
        @click="submit"
      >
        确定开单
      </button>
    </view>
    <view
      v-if="pageLoading && NucleResult && NucleResult.length == 0"
      class="empty-box"
    >
      <g-empty :current="1" />
    </view>

    <xy-dialog
      :title="fgTitle45"
      :show="isFgShow45"
      :isShowCancel="false"
      @confirmButton="isFgShow45 = false"
      isMaskClick
      isReverseBtn
    >
      <scroll-view scroll-y class="reg-tip">
        <g-flag
          v-model:title="fgTitle45"
          isHideTitle
          isShowFgTip
          typeFg="45"
          aaa
        />
      </scroll-view>
    </xy-dialog>
    <g-message />
  </view>
</template>

<script setup lang="ts">
  import api from '@/service/api';
  import { ref, computed, onMounted } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { payMoneyOnline, toPayPull } from '@/components/g-pay/index';
  import {
    GStores,
    wait,
    getTimeStamp,
    useTBanner,
    type ISystemConfig,
    ServerStaticData,
  } from '@/utils';
  import HTMLParser from '@/common/html-parser';

  interface INucle {
    billingType: string;
    fee: string;
    itemAddress: string;
    itemCode: string;
    itemName: string;
    itemTime: string;
    tips: string;
  }

  const props = defineProps<{
    hosName: string;
    hosId: string;
    isPay: string; //是否需要缴费 表示支付方式
    openId: string;
    type: number;
  }>();
  const pageConfig = ref(<ISystemConfig['selfBilling']>{});
  const tabs = computed(() => {
    return pageConfig.value.tabs || [];
  });

  const tabCurrent = ref(0);
  const isFgShow45 = ref(false);
  const fgTitle45 = ref('');

  const NucleResult = ref<INucle[]>([]);
  const selList = ref<INucle[]>([]);
  const gStores = new GStores();
  const pageLoading = ref(false);
  const isSubBtnDisabled = ref(false);

  onLoad(async (opt) => {
    //针对支付宝扫普通二维码跳转的处理 一开始没拿到参数不掉接口
    const queryParams = gStores.globalStore.appLaunchData?.query?.qrCode;

    uni.showLoading({});
    pageConfig.value = await ServerStaticData.getSystemConfig('selfBilling');

    if (queryParams && !props?.hosId) {
      return;
    }
    if (opt) {
      if (props.hosId) {
        gStores.globalStore.onAppLaunch({});
      }
    }
    await wait(650);

    //针对微信扫普通二维码跳转的处理 一开始没拿到参数不掉接口
    if (opt?.q) {
      return;
    }

    initConfig();

    // await gStores.userStore.getPatList();
  });

  onMounted(() => {
    isFgShow45.value = true;
  });

  //初始化页面数据
  const initConfig = async () => {
    pageLoading.value = false;
    let billingType = props.type ? props.type : props.isPay === '1' ? 3 : 99999; // 不配type 默认 3-需要支付 99999-去门诊不需要支付

    if (tabs.value.length) {
      billingType = tabs.value[tabCurrent.value]?.value;
    }
    selList.value.length = 0;

    const { result } = await api
      .getItemList({
        billingType,
        hosId: props.hosId,
      })
      .finally(() => {
        pageLoading.value = true;
        uni.stopPullDownRefresh();
      });

    if (result.length > 0) {
      NucleResult.value = result[0].items;
    }
  };
  const clickItem = (item) => {
    if (pageConfig.value.multi === '1') {
      const idx = selList.value.findIndex((o) => o.itemCode === item.itemCode);
      if (idx > -1) {
        selList.value.splice(idx, 1);
      } else {
        selList.value.push(item);
      }
    } else {
      selList.value = [item];
    }
  };
  //确定开单
  const submit = async () => {
    const { patientId, patientName, cardNumber } = gStores.userStore.patChoose;
    const source = gStores.globalStore.browser.source;
    const reBillingUrl = `/pagesC/selfService/nucleicBilling?hosId=${props.hosId}&isPay=${props.isPay}`;
    isSubBtnDisabled.value = true;

    const totalCost = selList.value.reduce((p, c) => {
      p += (c.fee as unknown as number) * 1;
      return p;
    }, 0);

    try {
      const res1 = await api.createBillingOrder({
        hosId: props.hosId,
        patientId: patientId,
        items: selList.value,
        totalCost,
        source: source,
        hosName: props.hosName,
        reBillingUrl: reBillingUrl, //再次开单路径
      });

      if (props.isPay == '1') {
        const data = {
          businessType: '',
          hosId: props.hosId,
          hosName: props.hosName,
          patientId: patientId,
          phsOrderNo: res1.result.phsOrderNo,
          phsOrderSource: 11,
          totalFee: totalCost,
          patientName,
          cardNumber,
        };
        const res = await payMoneyOnline(data);

        await toPayPull(res);
        payAfter(patientId);
      } else {
        gStores.messageStore.showMessage('开单成功', 1500, {
          closeCallBack: () => {
            //跳转门诊缴费页面
            uni.reLaunch({
              url: `/pagesA/clinicPay/clinicPayDetail`,
            });
          },
        });
      }
    } catch (error) {
      isSubBtnDisabled.value = false;
      throw new Error(error as string);
    }
  };
  const payAfter = async (patientId) => {
    uni.showLoading({});
    await wait(1000);
    uni.hideLoading();
    //去我的开单页面
    uni.reLaunch({
      url: `/pagesC/cloudHospital/myPath?path=/pagesC/selfService/myOrder&_pd=${patientId}&_pt=${getTimeStamp(
        6
      )}`,
    });
  };
</script>
<style lang="scss" scoped>
  .g-page {
    .empty-box {
      padding-top: 200rpx;
    }
    .box {
      box-sizing: border-box;
      padding: 24rpx 32rpx 40rpx;
      width: 100%;
      .box-card {
        background: #ffffff;
        border: 1rpx solid var(--hr-neutral-color-2);
        border-radius: 16rpx;
        box-sizing: border-box;
      }

      .iconfont {
        font-size: var(--hr-font-size-xxl);
      }
      .box-tips {
        width: 100%;
        padding: 32rpx;
        label {
          font-size: var(--hr-font-size-xs);
          text-align: left;
          color: var(--hr-neutral-color-7);
          line-height: 44rpx;
          &:last-child {
            margin-top: 8rpx;
            color: var(--hr-neutral-color-10);
            margin-left: 16rpx;
          }
        }
      }
      .box-date {
        margin-top: 16rpx;
        padding: 28rpx 32rpx;
        display: flex;
        label {
          color: -var(-hr-neutral-color-10);
          line-height: 48rpx;
          font-weight: 600;
          font-size: var(--hr-font-size-base);
          margin-right: 32rpx;

          &:nth-child(2) {
            flex: 1;
            font-weight: 400;
          }
        }
      }
      .box-list {
        margin-top: 16rpx;
        .box-aaa {
          box-shadow: 0px -1px 0px 0px #e6e6e6 inset;
          padding: 28rpx 0;
          margin: 0 32rpx;
          &:last-child {
            box-shadow: none;
          }
        }
        .box-item {
          display: flex;

          label {
            color: -var(-hr-neutral-color-10);
            line-height: 48rpx;
            font-weight: 600;
            font-size: var(--hr-font-size-base);
            margin-right: 32rpx;

            &:nth-child(2) {
              flex: 1;
              text-align: right;
              white-space: nowrap;
            }
          }
        }
        .active {
          label {
            color: var(--hr-brand-color-6);
          }
        }

        .ico-checkbox {
          color: var(--hr-brand-color-6);
        }
      }
    }
  }
</style>
