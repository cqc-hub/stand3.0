<template>
  <view
    :class="{
      'system-mode-old': systemModeOld,
    }"
    class=""
  >
    <view
      :class="{
        f32: myprops.payState === '0',
        payed: myprops.payState === '0',
      }"
      class="head-content mt24 f28"
    >
      <view class="head-row flex-normal flex-start-r">
        <view class="head-row-label text-no-wrap color-888">就诊医院</view>
        <view class="head-row-value color-444">
          {{
            `${detailData.hosName || ''}${
              pageConfig.isListShowClinicType === '1'
                ? (myprops.clinicTypeName && `(${myprops.clinicTypeName})`) ||
                  ''
                : ''
            }`
          }}
        </view>
      </view>

      <view v-if="myprops.docName" class="head-row flex-normal flex-start-r">
        <view class="head-row-label text-no-wrap color-888">就诊医生</view>
        <view class="head-row-value color-444">
          {{ myprops.docName }}
        </view>
      </view>

      <view v-if="myprops.visitDate" class="head-row flex-normal flex-start-r">
        <view class="head-row-label text-no-wrap color-888">就诊时间</view>
        <view class="head-row-value color-444">
          {{ myprops.visitDate }}
        </view>
      </view>

      <view
        v-if="myprops.diseaseTypeName"
        class="head-row flex-normal flex-start-r"
      >
        <view class="head-row-label text-no-wrap color-888">病种</view>
        <view class="head-row-value color-444">
          {{ myprops.diseaseTypeName }}
        </view>
      </view>

      <view
        v-if="myprops.costTypeName"
        class="head-row flex-normal flex-start-r"
      >
        <view class="head-row-label text-no-wrap color-888">费用类型</view>
        <view class="head-row-value color-444">
          {{ myprops.costTypeName }}
        </view>
      </view>

      <view class="head-row flex-normal flex-start-r">
        <view class="head-row-label text-no-wrap color-888">就诊人</view>
        <view class="head-row-value color-444">
          <text v-if="myprops.patientName">
            {{ nameConvert(myprops.patientName) + ` (${myprops.cardNumber})` }}
          </text>

          <text v-else>
            {{
              nameConvert(gStores.userStore.patChoose.patientName) +
              `${
                gStores.userStore.patChoose._showId
                  ? ` (${gStores.userStore.patChoose._showId})`
                  : ''
              }`
            }}
          </text>
        </view>
      </view>

      <!-- 已支付 -->
      <block v-if="myprops.payState === '0'">
        <view
          v-if="detailData.totalCost"
          class="head-row flex-normal flex-start-r"
        >
          <view class="head-row-label text-no-wrap color-888">费用总额</view>
          <view class="head-row-value color-error">
            {{ detailData.totalCost }}元
          </view>
        </view>

        <view
          v-if="detailData.medicalCost"
          class="head-row flex-normal flex-start-r"
        >
          <view class="head-row-label text-no-wrap color-888">医保报销</view>
          <view class="head-row-value color-444">
            {{ detailData.medicalCost }}元
          </view>
        </view>

        <view
          v-if="detailData.hospitalCost"
          class="head-row flex-normal flex-start-r"
        >
          <view class="head-row-label text-no-wrap color-888">
            院内账户支付
          </view>
          <view class="head-row-value color-444">
            {{ detailData.hospitalCost }}元
          </view>
        </view>

        <view
          v-if="detailData.personCost"
          class="head-row flex-normal flex-start-r"
        >
          <view class="head-row-label text-no-wrap color-888">现金支付</view>
          <view class="head-row-value color-444">
            {{ detailData.personCost }}元
          </view>
        </view>

        <view
          v-if="myprops.diseaseTypeName"
          class="head-row flex-normal flex-start-r"
        >
          <view class="head-row-label text-no-wrap color-888">病种</view>
          <view class="head-row-value color-444">
            {{ myprops.diseaseTypeName }}
          </view>
        </view>

        <view
          v-if="myprops.costTypeName"
          class="head-row flex-normal flex-start-r"
        >
          <view class="head-row-label text-no-wrap color-888">费用类型</view>
          <view class="head-row-value color-444">
            {{ myprops.costTypeName }}
          </view>
        </view>

        <view
          v-if="detailData.invoiceNumber"
          class="head-row flex-normal flex-start-r"
        >
          <view class="head-row-label text-no-wrap color-888">发票号码</view>
          <view class="head-row-value color-444">
            {{ detailData.invoiceNumber }}
          </view>
        </view>
      </block>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import {
    type TPayDetailProp,
    type TPayDetailInfo,
  } from '../utils/clinicPayDetail';

  import { GStores, type ISystemConfig, nameConvert } from '@/utils';

  defineProps<{
    myprops: TPayDetailProp;
    detailData: TPayDetailInfo;
    pageConfig: ISystemConfig['pay'];
    systemModeOld?: boolean;
  }>();

  const gStores = new GStores();
</script>

<style lang="scss" scoped>
  .head-content {
    .head-row {
      margin-bottom: 4rpx;
      .head-row-label {
        width: 130rpx;
      }

      &:not(:last-child) {
        margin-bottom: 4rpx;
      }
    }

    &.payed {
      .head-row {
        margin-bottom: 4rpx;
        .head-row-label {
          width: 200rpx;
        }

        &:not(:last-child) {
          margin-bottom: 12rpx;
        }
      }
    }
  }

  .system-mode-old {
    .head-content {
      .head-row {
        .head-row-label {
          width: 160rpx;
        }
      }
    }
  }
</style>
