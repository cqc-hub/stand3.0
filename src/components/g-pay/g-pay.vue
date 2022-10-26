<template>
  <view class="choose-pat">
    <g-popup title="选择支付方式" :maskClickClose="false" ref="refActionSheet">
      <view class="choose-pat-container g-flex-rc-cc">
        <view style="width: 100%">
          <pay-List :list="list" @choose-pat="choosePay" />

          <slot />
        </view>
      </view>
    </g-popup>
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { GStores } from '@/utils';
  import { IPat } from '@/stores';
  import globalGl from '@/config/global';
  import payList from './payList.vue';
  import { IGPay, payMoneyOnline, IPayRes, toPayPull } from './index';
  import api from '@/service/api';

  const refActionSheet = ref<any>('');
  const gStores = new GStores();

  const props = withDefaults(
    defineProps<{
      list?: IGPay[];
      auto?: boolean;

      // auto true 时候接口参数 (openId channel patientName patientId cardNumber source) 不用给
      autoPayArg?: BaseObject;
    }>(),
    {
      list: () => [
        {
          label: '在线支付',
          key: 'online',
        },
        {
          label: '医保支付',
          key: 'medicare',
        },
        {
          label: '到院支付',
          key: 'offline',
        },
      ],
      autoPayArg: () => ({}),
    }
  );

  const emits = defineEmits(['pay-click', 'pay-success']);

  const hide = () => {
    refActionSheet.value.close();
  };

  const show = () => {
    refActionSheet.value.show();
  };

  let requestBefore = async <T = BaseObject>(data: T): Promise<T> => {
    return data;
  };

  const payMoney = async (item: IGPay) => {
    const { key } = item;

    const { cardNumber, patientId, patientName } = gStores.userStore.patChoose;

    let requestArg: BaseObject = {
      ...props.autoPayArg,
      patientName,
      patientId,
      cardNumber,
      source: gStores.globalStore.browser.source,
    };

    // #ifdef  MP-WEIXIN
    requestArg.openId = gStores.globalStore.openId;
    requestArg.channel = 'WX_MINI';
    // #endif

    // #ifdef MP-ALIPAY
    requestArg.userId = gStores.globalStore.openId;
    requestArg.channel = 'ALI_MINI';
    // #endif

    requestArg = await requestBefore(requestArg);

    if (key === 'online') {
      const res = await payMoneyOnline(requestArg);

      await toPayPull(res);
      emits('pay-success', res);
    }
  };

  const choosePay = (e) => {
    const { index, item } = e;

    hide();

    // 自动支付
    if (props.auto) {
      payMoney(item);
    }

    emits('pay-click', {
      index,
      item,
    });
  };

  defineExpose({
    show,
    hide,
  });
</script>

<style lang="scss" scoped>
  .choose-pat {
    .choose-pat-container {
      width: 100%;
      min-height: 30vh;
      align-items: flex-start;
    }
  }
</style>
