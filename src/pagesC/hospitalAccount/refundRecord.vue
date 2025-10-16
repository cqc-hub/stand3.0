<template>
  <view class="g-page">
    <!-- <g-choose-pat @choose-pat="getList" /> -->

    <view class="g-container">
      <view
        :class="{
          [gStores.globalStore.getPageClass]: true,
        }"
        class="pr24 pl24 f32"
        v-if="list && list.length > 0"
      >
        <view
          v-for="(item, n) in list"
          :key="n"
          class="details p32 bg-white g-border mt16"
        >
          <view v-if="item.openAccountName" class="flex">
            <view class="label color-888 mr12">收款人姓名</view>
            <view class="color-444 flex-1">{{ item.openAccountName }}</view>
          </view>

          <view v-if="item.openAccountBankCard" class="flex">
            <view class="label color-888 mr12">银行卡号</view>
            <view class="color-444 flex-1">{{ item.openAccountBankCard }}</view>
          </view>

          <view v-if="item.refundFee" class="flex">
            <view class="label color-888 mr12">退费金额</view>
            <view class="color-444 flex-1">{{ item.refundFee }}元</view>
          </view>

          <view v-if="item.createTime" class="flex">
            <view class="label color-888 mr12">申请时间</view>
            <view class="color-444 flex-1">{{ item.createTime }}</view>
          </view>

          <view v-if="item.status !== 0 && item.updateTime" class="flex">
            <view class="label color-888 mr12">处理时间</view>
            <view class="color-444 flex-1">{{ item.updateTime }}</view>
          </view>

          <view v-if="item.statusName" class="flex">
            <view class="label color-888 mr12">状态</view>
            <view
              :class="{
                'color-green': item.status === 1,
                'color-error': item.status === 2,
              }"
              class="color-444 flex-1"
            >
              {{ item.statusName }}
            </view>
          </view>

          <view v-if="item.status !== 0 && item.financeRemarks" class="flex">
            <view class="label color-888 mr12">备注</view>
            <view class="color-444 flex-1">{{ item.financeRemarks }}</view>
          </view>
        </view>
      </view>
      <view class="empty-box" v-else>
        <g-empty :current="1" />
      </view>
    </view>

    <g-message />
  </view>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { GStores } from '@/utils';
  import { TRefundRecord } from './utils';
  import { deQueryForUrl } from '@/common/utils';

  import api from '@/service/api';

  interface IPageProps {
    hosId: string;
  }

  const gStores = new GStores();
  const pageProps = ref(<IPageProps>{});
  const list = ref([] as TRefundRecord);

  const getList = async () => {
    const { cardNumber } = gStores.userStore.patChoose;
    list.value = [];
    const { result = [] } = await api.getRefundApplyByCardNumber({
      cardNumber,
      hosId: pageProps.value.hosId,
    });

    list.value = result;
  };

  onLoad((opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    getList();
  });
</script>

<style scoped lang="scss">
  .empty-box {
    padding-top: 200rpx;
  }

  .details {
    border-radius: 16rpx;

    .label {
      width: 5em;
    }
  }
</style>
