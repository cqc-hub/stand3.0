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
  import { onLoad } from '@dcloudio/uni-app';
  import { useTBanner } from '@/utils';
  import global from '@/config/global';
  import medicineDecoceList from './components/medicineDecoceList.vue';
  import { usePayPage, IPayListItem } from './utils/clinicPayDetail';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import { payMoneyOnline, toPayPull } from '@/components/g-pay/index';
  import api from '@/service/api';

  const { gStores } = usePayPage();
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
  onLoad(async (opt) => {
    // pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    init();
  });
  const init = async () => {
    const { cardNumber, patientId } = gStores.userStore.patChoose;
    const { result } = await api.getChineseMedicineList({
      cardNumber,
      patientId,
    });
    //@ts-expect-error
    unPayList.value = (result?.results||[]).map((item) => {
      return {
        ...item,
        totalCost: item.drugCost,
        payState: '1',
        childOrder: item.prescId,
      };
    });
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

  const isSelectAll = computed(
    () =>
      selUnPayList.value.length &&
      selUnPayList.value.length === unPayList.value.length
  );

  const chooseAll = () => {
    if (isSelectAll.value) {
      selUnPayList.value = [];
    } else {
      selUnPayList.value = [...unPayList.value];
    }
  };

  const handlePayAfter = () => {
    gStores.messageStore.showMessage('快递下单成功', 2000, {
      closeCallBack: () => {
        useTBanner({
          type: 'self',
          path: 'pagesB/medicationAssistant/medicalHelp',
          extraData: {
            tabIndex: '1',
          },
        });
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
    
    if (!isCheck.value ) {
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
      const { cardNumber, patientName } = gStores.userStore.patChoose;
      const { source } = gStores.globalStore.browser;
      let payType = 'WX_MINI';
      // #ifdef MP-ALIPAY
      payType = 'ALI_MINI';
      // #endif
      console.log('selUnPayList', selUnPayList.value);
      const params = {
        cardNumber,
        payType,
        source,
        fee: totalCost.value,
        hosId: selUnPayList.value[0].hosId,
        hosName: selUnPayList.value[0].hosName,
        prescNo: selUnPayList.value.map((o) => o.prescNo).join(','),
        prescId: selUnPayList.value.map((o) => o.prescId).join(','),
        subIds: selUnPayList.value.map((o) => o.phsOrderId).join(','),
        openId: gStores.globalStore.openId,
      };

      const {
        result: { paySign, phsOrderNo },
      } = await api.chineseMedicinePay(params);
      const payRes = await payMoneyOnline({
        paySign,
        phsOrderNo,
        totalFee: totalCost.value,
        source,
        phsOrderSource: 6,
        hosId: params.hosId,
        patientName,
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
  .bottom{

    display: flex;
  }
</style>
