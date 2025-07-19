<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <view class="swiper-item">
      <medicineDecoceList
        :list="unPayList"
        @sel-item="selPayListItem"
        :selUnPayList="selUnPayList"
        :systemModeOld="gStores.globalStore.modeOld"
        isCheck
      />
    </view>

    <view class="g-footer flex-column">
      <view class="fg-agree">
        <view
          :class="{
            'is-check': isCheck,
          }"
          @click.stop="flagClick"
          class="iconfont check-box"
        >
          {{ (isCheck && '&#xe6d0;') || '&#xe6ce;' }}
        </view>

        <view class="fg-agree-text">
          <text @click.stop="flagClick">我已阅读并同意</text>
          <text @click.stop="regDialogConfirm.show" class="fg-agree-name">
            《中草药代煎须知》
          </text>
        </view>
      </view>
      <view class="bottom">
        <view @click="chooseAll" class="footer-check flex-normal">
          <view
            :class="{
              'color-blue': isSelectAll,
            }"
            class="iconfont"
          >
            {{ isSelectAll ? '&#xe6d0;' : '&#xe6ce;' }}
          </view>
          <view>全选</view>
        </view>
        <view class="f-right flex1 flex-normal count-money">
          <text class="color-444 f28 mr8">合计</text>
          <text class="f36 g-bold color-error">{{ totalCost }}元</text>
        </view>
        <!-- @click="handlerPay" -->
        <button
          :class="{
            'btn-disabled': !selUnPayList.length,
          }"
          class="btn g-border btn-warning pay-btn"
          @click="handlerPay"
        >
          缴费
        </button>
      </view>
    </view>

    <Order-Reg-Confirm
      :headerIcon="`${global.BASE_IMG}v3-order-reg-confirm${
        gStores.globalStore.isTcmStyle ? '-tcm' : ''
      }.png`"
      :title="flagTitle9"
      @confirm="isCheck = true"
      ref="regDialogConfirm"
    >
      <g-flag
        v-model:title="flagTitle9"
        :typeFg="'66'"
        isShowFgTip
        isHideTitle
        aaa
      />
    </Order-Reg-Confirm>
    <g-message />
  </view>
</template>
<script lang="ts" setup>
  import { onMounted, ref, computed } from 'vue';
  import { onShow, onLoad } from '@dcloudio/uni-app';
  import { useTBanner } from '@/utils';
  import { deQueryForUrl } from '@/common';
  import { decryptForPage, encryptDes } from '@/common/des';
  import { payMoneyOnline, toPayPull } from '@/components/g-pay/index';
  import { usePayPage, IPayListItem } from './utils/clinicPayDetail';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import medicineDecoceList from './components/medicineDecoceList.vue';
  import global from '@/config/global';

  import api from '@/service/api';

  const { gStores } = usePayPage();
  const pageProps = ref<any>({});
  const regDialogConfirm = ref<any>('');
  const isCheck = ref(false);
  const selUnPayList = ref<any[]>([]);
  const unPayList = ref<any[]>([]);
  const flagTitle9 = ref('');

  const totalCost = computed(() => {
    const _subCount = selUnPayList.value.reduce((prev, curr) => {
      return prev + (curr.totalCost as unknown as number) * 1;
    }, 0);
    return Number((_subCount * 100).toFixed(2)) / 100;
  });

  const isSelectAll = computed(
    () =>
      selUnPayList.value.length &&
      selUnPayList.value.length === unPayList.value.length
  );
  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    if (pageProps.value.params) {
      pageProps.value.deParams = decryptForPage(pageProps.value.params);
      console.warn(
        '获取到加密参数',
        pageProps.value.params,
        pageProps.value.deParams
      );
      gStores.globalStore.onAppLaunch({});
    }
  });

  onShow(async (opt) => {
    // pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    init();
  });

  const init = async () => {
    const { cardNumber, patientId } = gStores.userStore.patChoose;
    const actionApi = pageProps.value.deParams
      ? api.getChineseMedicineListNl
      : api.getChineseMedicineList;
    const { result } = await actionApi({
      cardNumber: pageProps.value?.deParams?.cardNumber || cardNumber,
      patientId: pageProps.value?.deParams?.patientId || patientId,
    });
    unPayList.value = (result?.results || []).map((item) => {
      return {
        ...item,
        totalCost: item.drugCost,
        payState: '1',
        childOrder: item.prescId,
      };
    });
    if (unPayList.value?.length == 0) {
      useTBanner(
        {
          type: 'self',
          path: 'pagesB/medicationAssistant/medicalHelp',
          extraData: {
            params: pageProps.value.params || '',
          },
        },
        'reLaunch'
      );
    }
  };

  const selPayListItem = (item: IPayListItem) => {
    const { childOrder } = item;

    const idx = selUnPayList.value.findIndex(
      (o) => o.childOrder === childOrder
    );

    if (idx === -1) {
      selUnPayList.value.push(item);
    } else {
      selUnPayList.value.splice(idx, 1);
    }
  };

  const chooseAll = () => {
    if (isSelectAll.value) {
      selUnPayList.value = [];
    } else {
      selUnPayList.value = [...unPayList.value];
    }
  };

  const handlePayAfter = () => {
    gStores.messageStore.showMessage('药品代煎缴费成功', 3000, {
      closeCallBack: () => {
        useTBanner(
          {
            type: 'self',
            path: 'pagesB/medicationAssistant/medicalHelp',
            extraData: {
              params: pageProps.value.params || '',
            },
          },
          'reLaunch'
        );
      },
    });
  };

  const flagClick = () => {
    if (isCheck.value) {
      isCheck.value = false;
    } else {
      regDialogConfirm.value.show();
    }
  };

  const handlerPay = async () => {
    if (!selUnPayList.value.length) {
      gStores.messageStore.showMessage('请选择至少一项进行缴费', 3000);
      return;
    }
    if (!isCheck.value) {
      regDialogConfirm.value.show();
      return;
    }
    const { title, content } = await gStores.getSysAppMore('74');
    const { confirm } = await new Promise<{ confirm: boolean }>((r) => {
      gStores.messageStore.showMessage(content, 0, {
        useDialog: true,
        dialogOpt: {
          title: '江苏省中医院',
          isShowCancel: true,
          cancelText: '我再想想',
          confirmText: '继续缴费',
        },
        closeCallBack: r,
      });
    });

    if (confirm) {
      const { cardNumber, patientName, patientId } =
        gStores.userStore.patChoose;
      const { source } = gStores.globalStore.browser;
      let payType = 'WX_MINI';
      // #ifdef MP-ALIPAY
      payType = 'ALI_MINI';
      // #endif
      const params = {
        cardNumber: pageProps.value?.deParams?.cardNumber || cardNumber,
      patientId: pageProps.value?.deParams?.patientId || patientId,
        payType,
        source,
        patientName,
        fee: totalCost.value,
        openId: gStores.globalStore.openId,
        hosId: selUnPayList.value[0].hosId,
        hosName: selUnPayList.value[0].hosName,
        prescNo: selUnPayList.value.map((o) => o.prescNo).join(','),
        prescId: selUnPayList.value.map((o) => o.prescId).join(','),
        subIds: selUnPayList.value.map((o) => o.phsOrderId).join(','),
      };
      const actionApi = pageProps.value.deParams
        ? api.chineseMedicinePayNl
        : api.chineseMedicinePay;

      const {
        result: { paySign, phsOrderNo },
      } = await actionApi(params);
      const payRes = await payMoneyOnline({
        paySign,
        phsOrderNo,
        totalFee: totalCost.value,
        source,
        phsOrderSource: 5,
        hosId: params.hosId,
        patientName,
        cardNumber: cardNumber || pageProps.value.deParams.cardNumber,
      });
      await toPayPull(payRes, '中药代煎');
      handlePayAfter();
    }
  };
</script>

<style lang="scss" scoped>
  .swiper-item {
    height: 100%;
    padding: 0 32rpx;
    width: calc(100% - 64rpx);
  }
  .g-footer {
    .footer-check {
      font-size: var(--hr-font-size-xs);
      flex: 0.5;

      .iconfont {
        font-size: var(--hr-font-size-xxl);
        color: var(--hr-neutral-color-7);
        margin-right: 10rpx;
      }
    }

    .count-money {
      margin-right: 24rpx;
    }

    .f-right {
      justify-content: flex-start;
    }

    .btn {
      flex: 1;
    }

    .pay-btn {
      flex: 0.8;
    }
  }
  .fg-agree {
    display: flex;
    font-size: var(--hr-font-size-xs);
    align-items: flex-start;

    .fg-agree-name {
      color: var(--hr-brand-color-6);
    }

    .check-box {
      color: var(--hr-neutral-color-7);
      font-size: var(--hr-font-size-xxl);
      margin-right: 4rpx;
      transform: translateY(-5rpx);

      &.is-check {
        color: var(--hr-brand-color-6);
      }
    }
  }
  .bottom {
    display: flex;
  }
</style>
