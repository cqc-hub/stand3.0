<template>
  <view class="page">
    <view class="bg-top"></view>
    <view class="container">
      <view class="hos-info">
        <view>
          <view class="tip">付款给</view>
          <view class="hos-name">{{ info.hosName }}</view>
        </view>

        <image
          class="icon"
          :src="$global.BASE_IMG + 'yuncheng-hos-icon.png'"
          mode="widthFix"
        />
      </view>

      <view class="container-box">
        <view class="container-row f-label1 mb88">
          <view class="f-label1">费用总额</view>
          <view class="f-label1">{{ uploadRes.totalFee }}元</view>
        </view>

        <view class="container-row">
          <view class="f-label2">医保基金支付</view>
          <view class="f-label2">{{ uploadRes.medicareTotalFee }}元</view>
        </view>

        <view class="container-row mb44">
          <view class="f-label2">个人账户支付</view>
          <view class="f-label2">
            {{ uploadRes.medicarePersonalFee || 0 }}元
          </view>
        </view>

        <view class="container-row">
          <view class="f-label3">现金支付</view>
          <view class="f-label3">{{ uploadRes.personalPayFee || 0 }}元</view>
        </view>
      </view>

      <view class="page-label">
        <image
          class="icon"
          :src="$global.BASE_IMG + 'yuncheng-yibao-logo-pay.png'"
          mode="heightFix"
        />
        <view class="f-label5">医保移动支付</view>
      </view>
    </view>

    <view class="footer">
      <view>
        <text class="f-label4">您还需支付：</text>
        <text class="f-label3 fs44">¥{{ uploadRes.personalPayFee || 0 }}</text>
      </view>

      <view>
        <button @click="getPay" :loading="loading" class="btn btn-primary fs44">
          去支付
        </button>
      </view>
    </view>

    <g-message />
  </view>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { storeToRefs } from 'pinia';
  import { TMedicalNationUploadRes } from './utils/clinicPayDetail';
  import { getOpenId } from '@/components/g-pay/index';

  import { GStores } from '@/utils';
  import { joinQueryForUrl } from '@/common';

  import api from '@/service/api';

  const gStores = new GStores();
  const info = ref(
    <
      {
        hosName: string;
        hosId: string;
        /** 1门诊 2住院 3挂号 */
        businessType: '1' | '2' | '3';
        phsOrderSource: '1' | '2' | '3';
        cardNumber: string;

        deptCode: string;
        deptName: string;
        docName: string;
        serialNo: string;
        // deptCode: string;
        patientId: string;
        patientName: string;
        payAuthNo: string;
        totalCost: string;
        params?: string;
      }
    >{}
  );
  const uploadRes = ref(<TMedicalNationUploadRes>{});
  const loading = ref(false);

  const getPay = async () => {
    let channel = 'ALI_MINI_INSURANCE';
    // #ifdef  MP-WEIXIN
    channel = 'WX_MINI_INSURANCE';
    // #endif

    const {
      businessType,
      cardNumber,
      serialNo: hisSerialNo,
      hosId,
      patientId,
      patientName,
      phsOrderSource,
      totalCost,
      params,
    } = info.value;
    const {
      idCard,
      idType,
      medicarePersonalFee,
      medicarePlanFee,
      medicareTotalFee,
      payOrderId,
      paySign,
      personalPayFee,
      phsOrderNo,
      requestContent,
    } = uploadRes.value;
    const { source } = gStores.globalStore.browser;

    const openId = await getOpenId();

    const returnUrl = joinQueryForUrl('/pagesA/clinicPay/clinicPayDetail', {
      tabIndex: '1',
      params,
    });

    const requestArg = {
      channel,
      businessType,
      cardNumber,
      extend: requestContent,
      hisSerialNo,
      hosId,
      idCard,
      idType,
      medicarePersonalFee,
      medicarePlanFee,
      medicareTotalFee,
      openId,
      patientId,
      patientName,
      payOrderId,
      paySign,
      personalPayFee,
      phsOrderNo,
      phsOrderSource,
      requestContent,
      source,
      returnUrl,
      totalFee: totalCost,
      userId: openId,
    };

    await api.medicalPay(requestArg);
  };

  onLoad(() => {
    // requestContent
    const { uploadRes: _uploadRes, info: _info } =
      gStores.globalStore.cacheData;
    info.value = _info;
    uploadRes.value = _uploadRes;
  });
</script>

<style lang="scss" scoped>
  .page {
    background-color: #fff;
    height: 100vh;
  }
  .bg-top {
    position: absolute;
    width: 100%;
    height: 320upx;
    background-color: #3b71e8;
    border-radius: 0 0 40upx 40upx;
    pointer-events: none;
    z-index: 1;
  }

  .container {
    position: relative;
    padding: 0 40upx;
    z-index: 2;

    .hos-info {
      color: #fff;
      padding: 52upx 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .tip {
        font-size: 28upx;
        color: #a6c1ff;
      }

      .hos-name {
        font-size: 36upx;
      }

      .icon {
        margin-right: 20upx;
        width: 80upx;
        height: 80upx;
      }
    }

    .container-box {
      background-color: #fff;
      border: 1upx solid #e6e6e6;
      border-radius: 18upx;
      box-shadow: 0px 4upx 16upx 0px rgba(0, 0, 0, 0.05);
      padding: 40upx 0;

      .container-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 0 40upx;
        position: relative;
      }

      .show-detail {
        display: flex;
        justify-content: center;
      }
    }
  }

  .mb88 {
    margin-bottom: 88upx;
  }

  .mb44 {
    margin-bottom: 44upx;
  }

  .border-b-dashed {
    margin-bottom: 80upx;
    &::after {
      content: '';
      display: block;
      position: absolute;
      bottom: -40upx;
      right: 40upx;
      left: 40upx;
      border-bottom: 2upx dashed #eff0f4;
    }
  }

  .page-label {
    margin-top: 60upx;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
      height: 24upx;
      margin-right: 12upx;
    }
  }

  .footer {
    border-top: 2upx solid #f5f5f5;
    position: fixed;
    bottom: 0;
    height: 230upx;
    right: 0;
    left: 0;

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40upx;

    .btn-primary {
      background-color: #3b71e8;
      color: #fff;
      border-radius: 50upx;
      padding: 24upx 50upx;
      display: flex;
      align-items: center;
      height: 96rpx;
    }
  }

  .f-label1 {
    font-size: 36upx;
    font-weight: 600;
    color: #606266;
  }

  .f-label2 {
    font-size: 28upx;
    color: #909399;
  }

  .f-label3 {
    font-size: 32upx;
    font-weight: 600;
    color: #3b71e8;
  }

  .f-label4 {
    font-size: 28upx;
    color: #606266;
  }

  .f-label5 {
    font-size: 28upx;
    color: #666666;
  }

  .fs44 {
    font-size: 44upx;
  }
</style>
