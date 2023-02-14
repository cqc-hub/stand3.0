<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="f32 g-page"
  >
    <view class="g-container">
      <block v-if="pageProps.takenDrug === '1'">
        <view class="head-bg head-dark" />

        <view class="flex-between head-body">
          <view>
            <view class="safe-height"></view>
            <view class="safe-height"></view>

            <view class="g-bold f48">快递待发货</view>
            <view v-if="detailData.takeLocation" class="f28">
              <text class="mr12">取药地址:</text>
              <text>{{ detailData.takeLocation }}</text>
            </view>
            <view style="height: 12rpx"></view>
          </view>

          <view class="reg-header-icon-container">
            <view
              v-if="['0', '1', '2', '20'].includes(detailData.takenDrugType)"
              class="iconfont reg-header-icon-bg"
            >
              &#xe6c6;
            </view>
            <view v-else class="iconfont reg-header-icon-bg">&#xe6d0;</view>
          </view>
        </view>
      </block>
      <view v-else style="width: 1px; height: 24rpx"></view>

      <view class="content">
        <view
          v-if="['20', '50'].includes(detailData.takenDrugType)"
          class="box g-border p32 mb32"
        >
          <Express-Step
            :pointEnd="_expressInfo.pointEnd"
            :pointNow="_expressInfo.pointNow"
            :expressNo="detailData.expressNo"
            :expressCompany="detailData.expressCompany"
            @go-detail="goDetailExpress"
          />
        </view>
        <Htlp-Head-Box :item="pageProps" :detailData="detailData" />
        <Htlp-Body-Box :item="pageProps" :detailData="detailData" />
      </view>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { onLoad, onReady } from '@dcloudio/uni-app';

  import {
    isChineseMedical,
    type IWaitListItem,
    type IItemDetail,
  } from './utils/medicalHelp';
  import { deQueryForUrl } from '@/common';
  import { GStores, type TButtonConfig, useTBanner } from '@/utils';

  import api from '@/service/api';
  import dayjs from 'dayjs';

  import HtlpHeadBox from './components/HtlpHeadBox.vue';
  import HtlpBodyBox from './components/HtlpBodyBox.vue';
  import ExpressStep from './components/ExpressStep.vue';

  const pageProps = ref(<IWaitListItem>{});
  const gStores = new GStores();
  const detailData = ref({} as IItemDetail);

  const getData = async () => {
    const { cardNumber, patientId } = gStores.userStore.patChoose;
    const { hosId, prescId } = pageProps.value;

    const { result } = await api.getDrugDeliveryDetail({
      cardNumber,
      patientId,
      hosId,
      prescId,
    });

    const { expressParam, expressStatus, acceptTime } = result;

    if (expressParam) {
      const _keyMap = {
        40: '派送中',
        20: '已发货',
        50: '已签收',
        10: '待取件',
        30: '运输中',
      };

      const date = dayjs(acceptTime).format('MM-DD');

      expressInfo.value = {
        pointNow: {
          title: _keyMap[expressStatus] || '未知',
          date,
          desc: expressParam,
        },
      };
    }

    detailData.value = result;
  };

  const expressInfo = ref<{
    // pointEnd: {
    //   title: string;
    //   desc: string;
    // };

    pointNow: {
      title: string;
      desc: string;
      date: string;
    };
  }>();

  const _expressInfo = computed(() => {
    return {
      pointNow: expressInfo.value?.pointNow,
      pointEnd: {
        title: detailData.value.addresseeAddress,
        desc: `${detailData.value.addresseeName} ${detailData.value.addresseePhone}`,
      },
    };
  });

  const goDetailExpress = () => {
    const { expressNo, expressCompany } = detailData.value;
    const args: TButtonConfig = {
      type: 'h5',
      path: 'pagesC/myExpress/expressDetail',
      text: '',
      isSelfH5: '1',
      extraData: {
        expressNo,
        expressCompany,
      },
      addition: {
        token: 'token',
        herenId: 'herenId',
      },
    };

    useTBanner(args);
  };

  const init = () => {
    getData();
  };

  onReady(() => {
    if (pageProps.value.visitType === '2') {
      uni.setNavigationBarTitle({
        title: '处方明细',
      });
    }
  });

  onLoad((opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    console.log(pageProps.value);

    init();
  });
</script>

<style lang="scss" scoped>
  .g-page {
    .g-container {
      padding: 0 32rpx;

      .head-body {
        position: relative;
        z-index: 2;
        color: #fff;
        align-items: flex-start;

        .reg-header-icon-container {
          height: 140rpx;
        }

        .reg-header-icon-bg {
          // opacity: 0;
          font-size: 200rpx;
          right: 0;
          top: 24rpx;

          mask: linear-gradient(180deg, #ffffff35, rgba(255, 255, 255, 0));
        }
      }

      .head-bg {
        position: absolute;
        left: 0;
        right: 0;
        z-index: 1;
        pointer-events: none;

        &::after {
          content: '';
          display: block;
          height: 400rpx;

          position: absolute;
          top: 0;
          left: 0;
          right: 0;
        }

        &.head-blue {
          &::after {
            background: linear-gradient(
              0deg,
              rgba(41, 111, 255, 0) 1%,
              #296fff 38%,
              #296fff 96%
            );
          }
        }

        &.head-dark {
          &::after {
            background: linear-gradient(
              0deg,
              rgba(106, 125, 165, 0) 1%,
              #6a7da5 38%,
              #6a7da5 96%
            );
          }
        }
      }

      .content {
        position: relative;
        z-index: 2;
      }
    }
  }

  .box {
    background: #fff;
    border-radius: 8px;
  }
</style>
