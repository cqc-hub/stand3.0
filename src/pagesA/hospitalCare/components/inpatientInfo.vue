<template>
  <!-- 住院信息 -->
  <view>
    <view class="box" v-if="hosInfoResObj && Object.keys(hosInfoResObj).length">
      <view
        :class="
          gStores.userStore.patChoose.patientSex == '女'
            ? 'card card-lady'
            : 'card card-man'
        "
      >
        <view class="user">
          <image
            v-show="isLoad"
            class="user-avatar"
            :src="getAvatar(gStores.userStore.patChoose.patientSex)"
            mode="widthFix"
            @load="loadImg"
            lazy-load
          ></image>

          <view class="user-info">
            <text class="user-info-name">
              {{
                isNameEncry
                  ? hosInfoResObj.patientNameDes
                  : hosInfoResObj.patientName
              }}
            </text>
            <text class="user-info-id">({{ hosInfoResObj.cardNumber }})</text>
            <text @click="eyesClick" class="iconfont eyes-icon color-888">
              {{ isNameEncry ? '&#xe6d4;' : ' &#xe6db;' }}
            </text>
          </view>
        </view>
        <view class="user-del yard">
          <block v-for="(r, i) in row1" :key="i">
            <text class="g-nowrap">{{ r }}</text>
            <text v-if="i !== row1.length - 1" class="line"></text>
          </block>
        </view>
        <view class="user-del date">
          <text>{{ hosInfoResObj.beHosDate }}</text>
          <text>入院</text>
        </view>
        <view
          v-if="gStores.userStore.patChoose.patientSex == '女'"
          class="iconfont woman"
        >
          &#xe6a9;
        </view>
        <view
          v-if="gStores.userStore.patChoose.patientSex == '男'"
          class="iconfont man"
        >
          &#xe6aa;
        </view>
      </view>
      <view class="card-detail">
        <view class="card-detail-item">
          <view class="flex-normal">
            <text class="name mr16">已预交金额</text>

            <view
              class="record"
              v-if="
                props.isQueryPreRecord == '1' &&
                (pageProps.visitNo ? pageProps.patientId : true)
              "
            >
              <view class="triangle-left"></view>
              <view class="records" @click="toPayRecord">
                <text class="text text-no-wrap">查看记录</text>
                <view class="iconfont right">&#xe66b;</view>
              </view>
            </view>
          </view>

          <text class="money text-no-wrap">
            {{ hosInfoResObj.prepaidCost }}元
          </text>
        </view>
        <view class="card-detail-item">
          <text class="name">已产生费用</text>
          <text class="money">{{ hosInfoResObj.totalCost }}元</text>
        </view>
        <view class="card-detail-item" v-if="hosInfoResObj.insuranceFee">
          <text class="name">医保报销</text>
          <text class="money">{{ hosInfoResObj.insuranceFee }}元</text>
        </view>
        <view class="card-detail-item" v-if="hosInfoResObj.defrayFee">
          <text class="name">自费金额</text>
          <text class="money">{{ hosInfoResObj.defrayFee }}元</text>
        </view>
        <view v-if="hosInfoResObj.singleSelfPay" class="card-detail-item">
          <text class="name">独立结算</text>
          <text class="money">{{ hosInfoResObj.singleSelfPay }}元</text>
        </view>
        <view class="card-detail-item">
          <text class="name">账户余额</text>
          <text class="money">{{ hosInfoResObj.accountBalance }}元</text>
        </view>
        <view class="card-detail-item last">
          <text class="name">费用类型</text>
          <text class="money">{{ hosInfoResObj.costTypeName }}</text>
        </view>

        <view
          v-if="isShowPayBtn && !isShowCtypeBtn"
          class="button f36"
          @click="toPayOut"
        >
          已出院，立即结算
        </view>
        <view
          v-if="props.isHidePay !== '1' && !isShowPayBtn && !isShowCtypeBtn"
          @click="checkCount"
        >
          <view
            :class="{
              'btn-disabled': isDisabledPay,
            }"
            class="btn btn-primary btn-plain btn-border f36"
            @click="toPayPage"
          >
            预交费用
          </view>
        </view>
        <!-- #ifdef  MP-WEIXIN -->
        <view v-if="isShowCtypeBtn" class="button f36" @click="goOrder">
          住院点餐
        </view>
        <!-- #endif -->
      </view>
      <g-flag typeFg="17" isShowFgTip aaa />
    </view>
    <view v-else-if="hosCardInfoLists.length" class="p32">
      <appointment-list :list="hosCardInfoLists" />
    </view>
    <view class="empty-box" v-else>
      <g-empty :current="1" />
    </view>
    <g-message />
    <g-select
      v-model:value="selPlace"
      v-model:show="isSelShow"
      :option="selPlaces"
      :field="{
        label: 'address',
        value: 'appointRehabCode',
      }"
      @update:show="selClose"
      @change="resolve"
      ref="gSelect"
      title="选择康复地点"
      every-choose
    >
      <template #footer>
        <view class="safe-height" />

        <view class="g-flex-rc-cc">
          <view
            @click="skipChoose"
            style="height: 88rpx; width: 300rpx"
            class="btn btn-primary btn-plain btn-border"
          >
            跳过选择
          </view>
        </view>

        <view class="safe-height" />
      </template>
    </g-select>
  </view>
</template>
<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { getAvatar } from '@/stores';
  import {
    GStores,
    TButtonConfig,
    apiAsync,
    useTBanner,
    getLocation,
    ISystemConfig,
    ServerStaticData,
  } from '@/utils';
  import { joinQuery, joinQueryForUrl, encryptDes } from '@/common';
  import {
    getInHospitalInfoParam,
    getInHospitalInfoResult,
    hospitalPayResult,
  } from '../utils/inpatientInfo';
  import { onShow, onPullDownRefresh } from '@dcloudio/uni-app';

  import GSelect from '@/components/g-select/g-select.vue';
  import AppointmentList from '@/pagesA/hospitalCare/components/appointmentList.vue';
  import api from '@/service/api';

  const pageConfig = ref({} as ISystemConfig['hospitalCare']);
  const props = defineProps<{
    isQueryPreRecord?: string;
    isHidePay?: string;
    tabCurrent?: number;
    // 住院中心页面, 请求住院预约接口并且开展相关 ui
    isShowAppointment?: boolean;
    isShowCtypeBtn?: boolean;
    pageProps?: any;
  }>();
  const gStores = new GStores();
  const isLoad = ref(false);
  const isNameEncry = ref(true);
  const loadImg = () => {
    isLoad.value = true;
  };
  const _pageProps = computed(() => props.pageProps || {});

  const gSelect = ref(<any>'');
  const selPlaces = ref(<any[]>[]);
  const hosCardInfoLists = ref(<any[]>[]);
  const hosConfig = ref<ISystemConfig['hospitalCare']>(<any>{});
  const selPlace = ref('');
  const isSelShow = ref(false);
  const isShowPayBtn = ref(false);
  const selClose = () => {
    isSelShow.value = false;
    reject();
  };
  const skipChoose = () => {
    selPlace.value = '';
    isSelShow.value = false;
    resolve();
  };

  const location = ref({
    latitude: '',
    longitude: '',
  });

  const hosInfoResObj = ref({} as getInHospitalInfoResult);
  const row1 = computed(() => {
    const { hosName, inpatientWard, inpatientBed } = hosInfoResObj.value;

    return [
      hosName,
      inpatientWard,
      inpatientBed ? `${inpatientBed}床` : '',
    ].filter((o) => o);
  });
  const toPayRecord = async () => {
    const { hosId } = hosInfoResObj.value || {};
    const { visitNo } = props.pageProps || {};
    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/hospitalCare/payRecord', {
        hosId,
        visitNo,
      }),
      // url: `payRecord?hosId=${hosInfoResObj.value.hosId}`,
    });
  };

  const isDisabledPay = computed(() => {
    const maxPayNumCount = pageConfig.value.maxPayNumCount || 0;
    const c = hosInfoResObj.value.prepaymentPayCount;

    if (c && maxPayNumCount) {
      return c > maxPayNumCount;
    }

    return false;
  });
  const checkCount = () => {
    if (isDisabledPay.value) {
      gStores.messageStore.showMessage('充值次数已达上限', 1500);
    }
  };

  const eyesClick = () => {
    isNameEncry.value = !isNameEncry.value;
  };

  let resolve: (...any) => any = () => {};
  let reject: (...any) => any = () => {};

  const toPayPage = async () => {
    const {
      hosId,
      cardNumber,
      patientName,
      hosName,
      placeList,
      choosePlaceFlag,
      extend,
    } = hosInfoResObj.value;

    const args = {
      hosId,
      cardNumber,
      patientName,
      hosName,
      extend,
    };

    if (!choosePlaceFlag && placeList && placeList.length) {
      selPlaces.value = placeList;
      isSelShow.value = true;

      await new Promise((r, j) => {
        resolve = r;
        reject = j;
      });

      const selItem =
        selPlace.value &&
        placeList.find((o) => o.appointRehabCode === selPlace.value);

      if (selItem) {
        const { confirm } = await apiAsync(uni.showModal, {
          content: `确定选择 ${selItem.address} 吗?`,
        });

        if (!confirm) {
          return;
        }

        await api.inHosChosePlace({
          placeObject: selItem,
          visitNo: hosInfoResObj.value.visitNo,
        });
      }
    }

    uni.navigateTo({
      url: joinQuery('/pagesA/hospitalCare/paymentPage', args),
    });
  };

  const goOrder = () => {
    let sysCode = gStores.globalStore.sysCode;
    if (sysCode === '1001038') {
      goOrderJE();
    } else if (sysCode === '1001060') {
      goOrderSE();
    } else if (sysCode === '1001052') {
      goOrder1001052();
    }
  };
  const goOrder1001052 = () => {
    useTBanner({
      type: 'h5',
      path: joinQuery(' https://yingyang.yqrmyy.com', {
        patId: encryptDes(hosInfoResObj.value.cardNumber || '', 'phsDesKey'),
      }),
      text: '订餐',
    });
  };
  const goOrderSE = () => {
    console.log(hosInfoResObj);
    let extend: any = {};
    try {
      extend = JSON.parse(hosInfoResObj.value.extend || '');
    } catch (e) {
      gStores.messageStore.showMessage('接口返回数据extend异常');
    }
    useTBanner({
      type: 'h5',
      path: joinQuery('https://sxey-wechat.leanin.com.cn/', {
        wardCode: extend.deptId,
        bedNo: hosInfoResObj.value.inpatientBed,
      }),
      text: '订餐',
    });
  };

  const goOrderJE = () => {
    const base64Encode = (str) => {
      let CHARS =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      let out = '',
        i = 0,
        len = str.length,
        c1,
        c2,
        c3,
        enc1,
        enc2,
        enc3,
        enc4;
      while (i < len) {
        c1 = str.charCodeAt(i++);
        c2 = str.charCodeAt(i++);
        c3 = str.charCodeAt(i++);
        enc1 = c1 >> 2;
        enc2 = ((c1 & 3) << 4) | (c2 >> 4);
        enc3 = ((c2 & 15) << 2) | (c3 >> 6);
        enc4 = c3 & 63;
        if (isNaN(c2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(c3)) {
          enc4 = 64;
        }
        out +=
          CHARS.charAt(enc1) +
          CHARS.charAt(enc2) +
          CHARS.charAt(enc3) +
          CHARS.charAt(enc4);
      }
      return out;
    };
    const baseUrl = 'https://worders.eheren.com';
    const params = {
      patCode: base64Encode(hosInfoResObj.value.cardNumber),
      openId: base64Encode(gStores.globalStore.openId),
    };
    const path = joinQuery(baseUrl, params);
    const args: TButtonConfig = {
      type: 'h5',
      path,
      text: '住院点餐',
    };
    useTBanner(args, 'navigateTo');
  };

  const toPayOut = async () => {
    if (hosInfoResObj.value.costTypeName === '自费') {
      const { hosId, cardNumber, patientName, hosName, extend } =
        hosInfoResObj.value;
      const patientId = gStores.userStore.patChoose.patientId;
      const args = {
        patientId,
        hosId,
        hosName,
        cardNumber,
        patientName,
        hospitalAccount: '13',
        extend,
      };
      uni.navigateTo({
        url: joinQuery('/pagesA/hospitalCare/payConfirm', args),
      });
    } else {
      gStores.messageStore.showMessage(
        '非自费患者暂不支持线上结算，请前往住院收费处结算！',
        2000
      );
    }
  };

  onPullDownRefresh(() => {
    if (props.tabCurrent == 0) {
      setTimeout(() => {
        uni.stopPullDownRefresh();
        init();
      }, 1000);
    }
  });

  const getAppointmentList = async () => {
    const patientId = gStores.userStore.patChoose.patientId;
    console.log(888888888, hosConfig.value);
    hosConfig.value = await ServerStaticData.getSystemConfig('hospitalCare');
    if (hosConfig.value?.isSelfQueryBeforeAppoint === '1') {
      location.value = await getLocation(true);
      try {
        const { result } = await api.queryInpVisitWithNoMes({
          patientId,
          ...location.value,
        });
        if (result) {
          uni.navigateTo({
            url: joinQuery('/pagesA/hospitalCare/selfHospitalization'),
          });
        }
      } catch (err) {
        console.warn('自助入院接口', err);
      }
    }

    const {
      result: { hosCardInfoLists: _hosCardInfoLists },
    } = await api.queryHosCardInfo<any>({
      patientId,
    });

    hosCardInfoLists.value = _hosCardInfoLists;
  };

  const init = async () => {
    hosInfoResObj.value = {} as any;
    hosCardInfoLists.value = [];
    let args: any = {
      patientId: gStores.userStore.patChoose.patientId,
      cardNumber: gStores.userStore.patChoose.cardNumber,
    };
    if (_pageProps.value.visitNo) {
      const { visitNo, patientName, patientPhone, cardNumber } =
        _pageProps.value;
      args = {
        visitNo,
        patientName,
        patientPhone,
        cardNumber,
      };
    }
    const { result } =
      await api.getInHospitalInfo<getInHospitalInfoResult>(args);

    hosInfoResObj.value = result;

    //status 在院状态 1.在院 2.出院未结算
    if (result && Object.keys(result).length) {
      if (result.status === '2') {
        isShowPayBtn.value = true;
      } else {
        isShowPayBtn.value = false;
      }
    }

    if (props.isShowAppointment && (!result || !Object.keys(result).length)) {
      getAppointmentList();
    }
  };

  onMounted(async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('hospitalCare');

    init();
  });

  onShow(() => {
    init();
  });

  defineExpose({
    init,
  });
</script>

<style scoped lang="scss">
  .box {
    padding: 32rpx 32rpx 0 32rpx;
  }
  .empty-box {
    padding-top: 200rpx;
  }
  .card {
    // height: 244rpx;
    position: relative;
    border: 1rpx solid #e6e6e6;
    border-radius: 16rpx;
    padding: 40rpx 32rpx;
    overflow: hidden;
    &.card-man {
      background: linear-gradient(90deg, #ffffff, var(--hr-brand-color-1) 99%);
    }
    &.card-lady {
      background: linear-gradient(90deg, #ffffff, #fff0eb 99%);
    }
    .user {
      display: flex;
      .user-avatar {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
      }
      .user-info {
        margin-left: 8rpx;
        .user-info-name {
          font-weight: 600;
          font-size: var(--h-size-40);
        }
        .user-info-id {
          color: #888;
          font-size: var(--hr-font-size-base);
          margin-left: 8rpx;
        }
      }
    }
    .user-del {
      color: #444;
      font-size: var(--hr-font-size-xs);
      display: flex;
      flex-wrap: wrap;

      &.yard {
        margin-top: 24rpx;
      }
      &.date {
        margin-top: 16rpx;
      }
      text {
        display: block;
      }
      .line {
        width: 2rpx;
        height: 24rpx;
        margin: auto 20rpx;
        background-color: #e6e6e6;
      }
    }
    .iconfont {
      font-size: 260rpx;
      position: absolute;
      right: -32rpx;
      top: 64rpx;
      // margin-top: -120rpx;
      // margin-right: -60rpx;
      // float: right;
      &.man {
        color: var(--hr-brand-color-6);
        opacity: 0.05;
      }
      &.woman {
        color: #ff5040;
        opacity: 0.05;
      }
    }

    .eyes-icon {
      font-size: var(--hr-font-size-xxl);
      position: relative;
      top: 5rpx;
    }
  }
  .card-detail {
    background-color: #fff;
    border: 1rpx solid #e6e6e6;
    border-radius: 16rpx;
    margin: 16rpx 0 20rpx;
    padding: 40rpx 32rpx;

    .card-detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32rpx;
      &.last {
        margin-bottom: 80rpx;
      }
      .name {
        color: #888;
        font-size: var(--hr-font-size-base);
        white-space: nowrap;
      }
      .triangle-left {
        margin: auto 0;
        width: 0;
        height: 2rpx;
        border-top: 10rpx solid transparent;
        border-right: 16rpx solid var(--hr-brand-color-1);
        border-bottom: 10rpx solid transparent;
      }
      .record {
        display: flex;
      }
      .records {
        // width: 152rpx;
        // height: 48rpx;
        padding: 6rpx;
        padding-right: 0;
        border-radius: 8rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--hr-brand-color-1);
        margin-right: 70rpx;

        .text {
          color: var(--hr-brand-color-6);
          font-size: var(--hr-font-size-xxxs);
          font-weight: 600;
          text-align: center;
        }
        .right {
          font-size: var(--hr-font-size-base);
          color: var(--hr-brand-color-6);
        }
      }
      .money {
        font-size: var(--hr-font-size-base);
        color: #111;
        font-weight: 600;
      }
    }
    .button {
      border: 2rpx solid var(--hr-brand-color-6);
      border-radius: 16rpx;
      height: 96rpx;
      color: var(--hr-brand-color-6);
      font-weight: 600;
      text-align: center;
      line-height: 96rpx;
      margin-top: 28rpx;
    }
  }
</style>
