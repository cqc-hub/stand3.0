<template>
  <view class="g-page page">
    <g-flag typeFg="1008" isShowFg />
    <view class="header-btn flex-normal">
      <!-- <view
        v-if="isShowAddRecord"
        @click="goAddRecord"
        class="g-flex-rc-cc g-border"
      >
        <view class="iconfont color-blue">&#xe6fb;</view>
        <view>手动添加记录</view>
      </view> -->

      <view
        v-if="pageConfig.isOpenTopBtnOrder === '1'"
        @click="goOrderList"
        class="g-flex-rc-cc g-border"
      >
        <view class="iconfont color-green">&#xe6fc;</view>
        <view>我的订单</view>
      </view>
    </view>

    <scroll-view class="g-container" scroll-y>
      <view class="container">
        <view class="content mt16" v-if="isComplete && lists?.length">
          <Service-List :list="lists" @update:value="changeNum" ref="aaa" />
        </view>
        <view class="empty-list" v-else-if="isComplete">
          <g-empty :current="1" />
        </view>
      </view>
    </scroll-view>

    <view class="g-footer">
      <view class="footer flex1">
        <view class="amount text-no-wrap" @click="regDialogConfirm.show">
          <view class="iconfont">
            <text
              :class="{
                'uni--disabled': totalNum == 0,
              }"
            >
              &#xe70a;
            </text>
            <view v-if="totalNum != 0" class="num">{{ totalNum }}</view>
          </view>

          <text class="add f28 mr8">合计</text>

          <text class="money f36 color-error g-bold">{{ totalMoney }}元</text>
        </view>
        <button class="btn g-bord btn-primary f36 flex1" @click="confirm">
          <text>确定</text>
        </button>
      </view>
    </view>

    <g-message />

    <view v-if="chooseItem?.length">
      <Choose-Popup
        title="已选项目"
        :totalNum="totalNum"
        :list="chooseItem"
        @item-click="changeNum2"
        @ezz="ezz"
        ref="regDialogConfirm"
      >
        <template #footer>
          <view class="footer2">
            <view class="amount" @click="regDialogConfirm.show">
              <view class="iconfont">
                <text
                  :class="{
                    'uni--disabled': totalNum == 0,
                  }"
                >
                  &#xe70a;
                </text>
                <view v-if="totalNum != 0" class="num">{{ totalNum }}</view>
              </view>

              <text class="add f28 mr8">合计</text>

              <text class="money f36 color-error g-bold">
                {{ totalMoney }}元
              </text>
            </view>
            <button class="btn g-bord btn-primary f36 flex1" @click="confirm">
              <text>确定</text>
            </button>
          </view>
        </template>
      </Choose-Popup>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import ChoosePopup from './components/ChoosePopup.vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { joinQuery } from '@/common';
  import { deQueryForUrl } from '@/common/utils';
  import { type IServiceList } from './utils/index';

  import {
    ApiParamsConfig,
    GStores,
    cacheUtil,
    debounce,
    useTBanner,
  } from '@/utils';

  import api from '@/service/api';

  import ServiceList from './components/ServiceList.vue';
  interface IPageProps {
    hosId: string;
    hosName: string;
    pageTitle?: string;
  }
  const pageProps = ref(<IPageProps>{});
  const aaa = ref('' as any);
  const gStores = new GStores();
  const isComplete = ref(false);
  const totalNum = ref(0);
  const totalMoney = ref(0);
  const lists = ref<IServiceList[]>([]);
  const regDialogConfirm = ref<any>('');
  const chooseItem = ref<any[]>([]);
  const pageConfig = ref(<ApiParamsConfig['ConvenienceService']>{});

  let getListData = async () => {
    const arg = {};
    isComplete.value = false;
    const { result } = await api.getConvenientServiceList(arg).finally(() => {
      isComplete.value = true;
    });
    lists.value = result || [];
    lists.value.map((item, n) => {
      lists.value[n].num = 0;
    });
  };

  getListData = debounce(getListData, 80);

  const changeNum = (o) => {
    totalNum.value = 0;
    totalMoney.value = 0;
    o.map((item: any) => {
      totalNum.value += item.num;

      totalMoney.value =
        Number(
          ((totalMoney.value + item.num * Number(item.fee)) * 100).toFixed(2)
        ) / 100;
    });
    lists.value = o;
    chooseItem.value = o.filter((item: any) => item.num != 0);
  };

  const changeNum2 = (o) => {
    totalNum.value = 0;
    totalMoney.value = 0;
    o.map((item: any) => {
      totalNum.value += item.num;
      totalMoney.value = totalMoney.value + item.num * Number(item.fee);
    });
    chooseItem.value = o.filter((item: any) => item.num != 0);
  };

  const confirm = () => {
    if (chooseItem.value.length == 0) {
      gStores.messageStore.showMessage('请先选择需要购买的项目', 2000);
      return;
    }
    //拦截一下不能合并缴费的
    const ids = new Set();
    chooseItem.value.map((item) => {
      ids.add(item.subIds);
    });
    if (ids.size > 1) {
      gStores.messageStore.showMessage('不同的项目类型不支持合并支付', 2000);
      return;
    } else {
      const { hosId, hosName } = pageProps.value;
      uni.navigateTo({
        url: joinQuery('/pagesC/convenienceService/confirmOrder', {
          totalNum: totalNum.value,
          totalMoney: totalMoney.value,
          lists: JSON.stringify(chooseItem.value),
          hosId,
          hosName,
        }),
      });
    }
  };

  const ezz = (e) => {
    regDialogConfirm.value.close();

    aaa.value.iconClick(
      e.item,
      lists.value.findIndex((o) => o.itemId === e.item.itemId)
    );
  };

  const goOrderList = () => {
    // uni.navigateTo({
    //   url: '/pagesA/MyRegistration/MyRegistration',
    // });

    useTBanner({
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/selfService/myOrder',
      extraData: {
        convenienceService: 'true',
      },
      addition: {
        patientId: '_patientId',
      },
    });
  };

  const init = async () => {
    await getListData();
  };

  onLoad(async (p) => {
    pageConfig.value = await (
      await cacheUtil.getSystemConfig('ConvenienceService')()
    ).ConvenienceService;
    pageProps.value = deQueryForUrl<IPageProps>(deQueryForUrl(p));
    uni.setNavigationBarTitle({
      title: pageProps.value.pageTitle || '便民服务',
    });
  });

  onShow(() => {
    totalNum.value = 0;
    totalMoney.value = 0;
    chooseItem.value = [];
    init();
  });
</script>

<style lang="scss" scoped>
  .page {
    background-color: var(--h-color-white);
    .container {
      // width: calc(100% - 64rpx);
      margin-left: 32rpx;
      margin-bottom: 24rpx;
      .f-button {
        margin-top: 104rpx;
        display: flex;
        .f-b1 {
          background: #e9f0ff;
          color: var(--hr-brand-color-6);
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
  .footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .amount {
      display: flex;
      align-items: center;
      width: 50%;
      // margin: 24rpx 32rpx 68rpx 32rpx;
      .iconfont {
        color: var(--hr-brand-color-6);
        font-size: 80rpx;
        position: relative;
        .num {
          font-size: 24rpx;
          position: absolute;
          text-align: center;
          line-height: 32rpx;
          right: 0;
          top: 0;
          width: 32rpx;
          height: 32rpx;
          background: var(--hr-error-color-6);
          border: 1rpx solid var(--h-color-white);
          border-radius: 50%;
          color: var(--h-color-white);
        }
      }

      .add {
        color: var(--hr-neutral-color-8);
      }
    }
    .btn {
      // margin: 24rpx 32rpx 68rpx 32rpx;
      // margin-left: 120rpx;
    }
  }
  .footer2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--h-color-white);
    margin: 24rpx 0;
    margin-bottom: 68rpx;
    .amount {
      display: flex;
      align-items: center;
      // margin: 24rpx 32rpx 68rpx 0rpx;

      width: 50%;
      .iconfont {
        color: var(--hr-brand-color-6);
        font-size: 80rpx;
        position: relative;
        .num {
          position: absolute;
          text-align: center;
          line-height: 32rpx;
          right: 0;
          top: 0;
          font-size: 24rpx;
          width: 32rpx;
          height: 32rpx;
          background: var(--hr-error-color-6);
          border: 1rpx solid var(--h-color-white);
          border-radius: 50%;
          color: var(--h-color-white);
        }
      }

      .add {
        color: var(--hr-neutral-color-8);
      }
    }
  }
  .uni--disabled {
    color: #c0c0c0 !important;
    /* #ifdef H5 */
    cursor: not-allowed;
    /* #endif */
  }
  :deep(.wyb-popup-box) {
    height: 100vh !important;
  }

  .header-btn {
    margin: 16rpx 32rpx;
    margin-bottom: 0;
    gap: 14rpx;
    transition: all 0.2s linear;

    > view {
      flex: 1;
      font-size: var(--hr-font-size-s);
      border-radius: 8px;
      background-color: #fff;
      padding: 26rpx 0;

      .iconfont {
        font-size: var(--hr-font-size-xxl);
        margin-right: 14rpx;
      }
    }
  }
</style>
