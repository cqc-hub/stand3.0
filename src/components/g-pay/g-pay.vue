<template>
  <view class="choose-pat">
    <g-popup title="选择支付方式" :maskClickClose="false" ref="refActionSheet">
      <view class="choose-pat-container g-flex-rc-cc">
        <view style="width: 100%">
          <pay-List :list="list" @choose-pat="choosePay" />

          <!-- <g-flag typeFg="320" isShowFgTip /> -->
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
  import { IGPay } from './index';

  const refActionSheet = ref<any>('');

  const props = withDefaults(
    defineProps<{
      list?: IGPay[];
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
    }
  );

  const hide = () => {
    refActionSheet.value.close();
  };

  const show = () => {
    refActionSheet.value.show();
  };

  const choosePay = () => {
    hide();
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
