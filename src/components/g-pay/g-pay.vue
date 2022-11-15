<template>
  <view class="choose-pat">
    <g-popup title="选择支付方式" ref="refActionSheet">
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
      // 只有一个支付选择时候跳过选择
      autoInOne?: boolean;
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
    if (props.autoInOne && props.list.length === 1) {
      const item = props.list[0];

      choosePay({
        item,
        index: 0,
      });
    } else {
      refActionSheet.value.show();
    }
  };

  const payMoney = async (item: IGPay) => {
    const { key } = item;

    if (key === 'online') {
      const res = await payMoneyOnline(props.autoPayArg);
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
