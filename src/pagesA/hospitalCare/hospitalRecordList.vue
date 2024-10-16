<template>
  <view class="g-page">
    <view>
      <g-choose-pat
        :pat="_pat"
        :disabled="!isCanChangePat"
        @choose-pat="patChange"
      />
    </view>

    <view class="g-container">
      <view v-for="item in list" :key="item.visitNo" class="progress">
        <view class="right">
          <view class="stick">
            <view class="time-content">
              <text class="iconfont date mr24">&#xe6c6;</text>
              <text>{{ item.beHosDate }}</text>
            </view>
          </view>
          <view @click="itemClick(item)" class="detail">
            <view class="details g-border">
              <view class="detail-item">
                <text>{{ item.hosName }}</text>
              </view>
              <view class="detail-date">
                <text>{{ item.inpatientWard }}</text>
                <text class="lines"></text>
                <text v-if="item.inpatientBed">{{ item.inpatientBed }}床</text>
              </view>
            </view>
          </view>
        </view>
        <view class="line"></view>
      </view>

      <view v-if="!list.length && isComplete" class="empty-list">
        <g-empty :current="1" />
      </view>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, defineComponent, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { decryptDes, deQueryForUrl, joinQueryForUrl } from '@/common';
  import { GStores } from '@/utils';
  import api from '@/service/api';
  import { IPat } from '@/stores';

  type TPat = {
    patientName: string;
    patientPhone: string;
    // 存在 patientId 表示通过选择就诊人进来的(登录状态)
    patientId?: string;

    // 以下忽略
    _showId?: string;
    patientSex?: string;
  };
  const gStores = new GStores();
  const pageProps = ref(
    {} as TPat & {
      // 住院服务页面tab 多个之间 , 隔开
      tab: string;
    }
  );
  const choosePat = ref({} as TPat);
  const isComplete = ref(false);
  const cardNumber = ref('');
  const isCanChangePat = computed(() => {
    const { patientId, patientName } = pageProps.value;
    return !!patientId || !patientName;
  });
  const _pat = computed(() => {
    return {
      ...choosePat.value,
      patientNameEncry: choosePat.value.patientName,
      _showId: choosePat.value._showId || cardNumber.value,
    };
  });

  const patChange = () => {
    dealPat(gStores.userStore.patChoose);
    getList();
  };

  const dealPat = (item: IPat) => {
    const { cellPhoneNumber, patientName, patientId, patientSex } = item;
    const phone = decryptDes(cellPhoneNumber, 'hrtest22');

    choosePat.value = {
      ...item,
      patientName,
      patientPhone: phone,
      patientId,
      patientSex,
    };
  };

  const list = ref<any>(
    []
    //   [
    //   {
    //     patientName: '吕香香',
    //     inpatientWard: '龙湾血液透析中心',
    //     inpatientBed: '051',
    //     hosId: '13009',
    //     patientNameDes: '**香',
    //     hosName: '龙湾院区',
    //     visitNo: '20241004004',
    //     cardNumber: '12236198',
    //     beHosDate: '2024-10-12 10:44:23',
    //   },
    //   {
    //     inpatientWard: 'L091内科（五）心血管内科',
    //     inpatientBed: '18',
    //     hosId: '13009',
    //     patientNameDes: '',
    //     hosName: '龙湾院区',
    //     visitNo: '5672106',
    //     cardNumber: '12236198',
    //     beHosDate: '2024-09-24 10:40:57',
    //   },
    // ]
  );
  const getList = async () => {
    list.value = [];
    isComplete.value = false;

    const { result = [] } = await api
      .getInHospitalList({
        ...choosePat.value,
      })
      .finally(() => {
        isComplete.value = true;
      });

    if (result.length) {
      cardNumber.value = result[0].cardNumber;
    }

    list.value = result;
  };

  const itemClick = (item) => {
    const { visitNo } = item;
    const { patientName, patientPhone } = choosePat.value;
    const { tab } = pageProps.value;

    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/hospitalCare/hospitalCare', {
        visitNo,
        patientName,
        patientPhone,
        cardNumber: cardNumber.value,
        tab,
      }),
    });
  };

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    const { patientId, patientName } = pageProps.value;
    if (patientId || !patientName) {
      let pat = patientId
        ? gStores.userStore.patList.find((o) => o.patientId === patientId)
        : gStores.userStore.patChoose;

      if (!pat) {
        pat = gStores.userStore.patChoose;
      }

      if (pat) {
        gStores.userStore.updatePatChoose(pat);
        dealPat(pat);
      }
    } else {
      choosePat.value = { ...pageProps.value };
    }

    await getList();
    if (list.value.length === 1) {
      itemClick(list.value[0]);
    }
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
        .lines {
          display: inline-block;
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
    position: sticky;
    top: -2rpx;
    z-index: 10;
    background-color: #f6f6f6;

    .time-content {
      position: relative;
      left: -56rpx;
    }
    .iconfont {
      &.date {
        color: #ddd;
        position: relative;
        font-size: var(--hr-font-size-base);
        z-index: 999;
        top: 0;
      }
    }
  }
</style>
