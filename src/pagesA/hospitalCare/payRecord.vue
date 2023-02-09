<template>
  <!-- 日费用清单 -->
  <view class="page" v-if="payResList.hospitalPayResultList && payResList.hospitalPayResultList.length>0">
    <view class="progress" v-for="(item,index) in payResList.hospitalPayResultList " :key="index">
      <view class="right">
        <view class="date stick">
          <text class='iconfont date '>&#xe6c6;</text>

        {{item.date}}</view>
        <view class="detail" v-for="(i,j) in item.hospitalPay" :key="j">
          <view class="details" v-for="(m,n) in i.costListResultList" :key="n">
            <view class="detail-item">
              <text class="date">{{i.hosName}}</text>
              <text class="g-nowrap">{{m.paymentAmount}}元 </text>
            </view>
            <view class="detail-date">
              <text>{{m.payTime}}</text>
              <text class="lines"></text>
              <text>{{m.moneyType}}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="line"></view>
    </view>
  </view>
  <view class="empty-box" v-else>
    <g-empty :current="1" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';

import { GStores } from '@/utils';
import { hospitalPayResult } from './utils/inpatientInfo';
import { deQueryForUrl} from '@/common/utils';

import api from '@/service/api';

interface IPageProps {
  hosId: string;
}

const gStores = new GStores();
const pageProps = ref(<IPageProps>{});
const payResList = ref<hospitalPayResult>({} as hospitalPayResult);
const init = async () => {
  const { result } = await api.getInHospitalPayInfo<hospitalPayResult>({
    patientId: gStores.userStore.patChoose.patientId,
    hosId: pageProps.value.hosId,
  });
  payResList.value = result;
};
//下拉刷新
onPullDownRefresh(() => {
  setTimeout(() => {
    uni.stopPullDownRefresh();
    init();
  }, 1000);
});
onLoad((opt) => {
  pageProps.value = deQueryForUrl(opt);
  init();
});
</script>


<style scoped lang="scss">
.empty-box {
  padding-top: 200rpx;
}
.page {
  padding-bottom: 40rpx;
}
// 步骤样式
.progress {
  position: relative;
  padding: 0 24rpx 0px 90rpx;
  .right {
    height: 100%;
    padding-top: 30rpx;
    .detail {
      .details {
        margin-top: 16rpx;
        background: #ffffff;
        border: 1px solid #e6e6e6;
        border-radius: 16rpx;
        padding: 32rpx;
      }
    }
    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: var(--hr-font-size-xl);
      font-weight: 600;
      margin-bottom: 8rpx;
    }
    .detail-date {
      color: #888;
      font-size: var(--hr-font-size-xs);
      display: flex;
      text {
        display: block;
      }
      .lines {
        width: 2rpx;
        height: 24rpx;
        background-color: #e6e6e6;
        margin: auto 14rpx;
      }
    }
  }

  .line {
    position: absolute;
    border-right: 2px dotted #ddd;
    height: 100%;
    width: 1px;
    left: 45rpx;
    top: 50rpx;
    bottom: auto;
  }
}
.progress:last-child {
  .line {
    height: 90%;
  }
}

.stick {
  position: sticky ;
  top: -2rpx;
  z-index: 10;
  background-color: #f6f6f6;

  .iconfont {
    &.date {
      color: #ddd;
      position: relative;
      font-size: var(--hr-font-size-base);
      z-index: 999;
      top: 0;
      left: -56rpx;
    }
  }
}
</style>
