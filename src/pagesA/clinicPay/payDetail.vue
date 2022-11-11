<template>
  <view class="g-page">
    <view class="g-container">
      <view class="head-bg" />
      <view class="container">
        <view class="head-box g-border box">
          <view class="head-title g-bold f40 g-break-word">
            {{ props.deptName }}
          </view>

          <view class="head-content mt24 f28">
            <view class="head-row flex-normal flex-start-r">
              <view class="head-row-label text-no-wrap color-888 mr16">
                就诊医院
              </view>
              <view class="head-row-value color-444">
                {{
                  `${detailData.hosName || ''}${
                    pageConfig.isListShowClinicType === '1'
                      ? `(${props._clinicType})`
                      : ''
                  }`
                }}
              </view>
            </view>
          </view>
        </view>

        <view class="box info-box mt16">
          <view class="flex-between g-bold f36">
            <view>费用总额</view>
            <view class="color-error">{{ detailData.totalCost }}元</view>
          </view>

          <block v-if="detailData.costList && detailData.costList.length">
            <view class="mt8">
              <Pay-Detail-Cost-List :list="detailData.costList" />
            </view>
          </block>
        </view>
      </view>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import {
    usePayPage,
    usePayDetailPage,
    type TPayDetailProp,
  } from './utils/clinicPayDetail';
  import { deQueryForUrl } from '@/common';

  import PayDetailCostList from './components/payDetailCostList.vue';

  const props = ref({} as TPayDetailProp);

  const { getDetailData, detailData } = usePayDetailPage();
  const { pageConfig, getSysConfig } = usePayPage();

  onLoad(async (opt) => {
    props.value = deQueryForUrl(opt);
    await getSysConfig();
    getDetailData(props.value);
  });
</script>

<style lang="scss" scoped>
  .head-bg {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 1;

    &::after {
      content: '';
      display: block;
      height: 400rpx;

      position: absolute;
      top: 0;
      left: 0;
      right: 0;

      background: linear-gradient(
        0deg,
        rgba(41, 111, 255, 0) 1%,
        #296fff 38%,
        #296fff 96%
      );
    }
  }

  .container {
    position: relative;
    z-index: 2;
    padding: 0 32rpx;

    .box {
      background: #ffffff;
      border-radius: 8px;
      padding: 32rpx;
    }

    .head-box {
      margin-top: 48rpx;

      .head-content {
        .head-row {
          .head-row-label {
            width: 120rpx;
          }

          &:not(:last-child) {
            margin-bottom: 4rpx;
          }
        }
      }
    }

    .info-box {
    }
  }
</style>
