<template>
  <view class="">
    <view class="patient-information">
      <view
        v-if="pageProps._scan !== '1' && patName"
        @click.stop="isClose = !isClose"
        class="subhead"
      >
        患者信息
        <view class="subhead-detail">
          <text class="mr12">
            {{ isClose ? nameConvert(patName) : patName }}({{ patCardNumber }})
          </text>

          <text :class="`iconfont icon-resize`" class="g-split-line mr12 pr12">
            {{ isClose ? '&#xe6d4;' : '&#xe6db;' }}
          </text>

          <block v-if="!pageProps.patientName">
            <text class="g-split-line mr12 pr12">
              {{ reportInfo.sex || pat.patientSex }}
            </text>
            <text>{{ reportInfo.age || pat.patientAge }}岁</text>
          </block>
        </view>
      </view>
      <view class="subhead">
        报告单号
        <view
          class="subhead-detail"
          style="width: calc(60%); white-space: wrap"
        >
          {{ reportInfo.repId }}
        </view>
      </view>
      <view class="subhead">
        报告时间
        <view class="subhead-detail">
          {{ reportInfo.repTime }}
        </view>
        <button
          v-if="!isShow && !reportInfo.reminder"
          class="more-button g-border"
          @click="isShow = !isShow"
        >
          <template>
            <view class="more">更多</view>
            <text class="iconfont">&#xe6c4;</text>
          </template>
        </button>
      </view>
      <view class="hidden-patient-information" v-show="isShow">
        <view v-if="reportInfo.regTime" class="subhead">
          {{ globalGl.SYS_CODE === '1001067' ? '申请时间' : '采集时间' }}

          <view class="subhead-detail">
            {{ reportInfo.regTime }}
          </view>
        </view>

        <view v-if="reportInfo.serialNo" class="subhead">
          申请单号
          <view class="subhead-detail">
            {{ reportInfo.serialNo }}
          </view>
        </view>
        <view v-if="reportInfo.applyDoc" class="subhead">
          申请医生
          <view class="subhead-detail">
            {{ reportInfo.applyDoc }}
          </view>
        </view>
        <view v-if="reportInfo.reportDoc" class="subhead">
          报告医生
          <view class="subhead-detail">
            {{ reportInfo.reportDoc }}
          </view>
        </view>
        <view v-if="reportInfo.specimen" class="subhead">
          标本类型
          <view class="subhead-detail">
            {{ reportInfo.specimen }}
          </view>
        </view>

        <view class="subhead">
          <block v-if="reportInfo.passDoc">
            <text>审核医生</text>
            <view class="subhead-detail">
              {{ reportInfo.passDoc }}
            </view>
          </block>
          <button @click="isShow = !isShow" class="more-button g-border">
            <template v-if="isShow && !reportInfo.reminder">
              <view class="more">收起</view>
              <text class="iconfont">&#xe6c5;</text>
            </template>
          </button>
        </view>
      </view>
      <view v-if="reportInfo.reminder" class="subhead">
        检验提示
        <view style="color: var(--hr-brand-color-6); width: calc(60%)" class="subhead-detail">
          {{ reportInfo.reminder }}
        </view>
        <button @click="isShow = !isShow" class="more-button g-border">
          <template v-if="!isShow">
            <view class="more">更多</view>
            <text class="iconfont">&#xe6c4;</text>
          </template>
          <template v-if="isShow">
            <view class="more">收起</view>
            <text class="iconfont">&#xe6c5;</text>
          </template>
        </button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, defineComponent, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';
  import { GStores, ISystemConfig, nameConvert } from '@/utils';
  import { storeToRefs } from 'pinia';
  import globalGl from '@/config/global';

  const isClose = ref(false);
  const props = defineProps<{
    pageProps: any;
    reportInfo: any;
  }>();
  const gStores = new GStores();
  const pageConfig = ref(<ISystemConfig['reportQuery']>{});
  const { patChoose: pat } = storeToRefs(gStores.userStore);
  const isShow = ref(false);

  const patName = computed(() => {
    return (
      props.pageProps.patientName ||
      props.reportInfo.patientName ||
      pat.value.patientName
    );
  });

  const patCardNumber = computed(() => {
    return (
      props.pageProps.cardNumber ||
      props.reportInfo.cardNumber ||
      pat.value.cardNumber
    );
  });
</script>

<style lang="scss" scoped>
  .patient-information {
    // width: calc(100% - 32rpx);
    margin-left: 32rpx;
    margin-top: 16rpx;
    font-size: var(--hr-font-size-xs);
    .subhead {
      margin-top: 8rpx;
      color: #888888;
      display: flex;
      position: relative;
      .subhead-detail {
        margin-left: 16rpx;
        max-width: 400rpx;
        color: #444444;
        word-wrap: break-word;
      }
      .more-button {
        height: 40rpx;
        position: absolute;
        right: 0rpx;
        background-color: rgb(0, 0, 0, 0);
        line-height: 40rpx;
        display: flex;
        z-index: 99;
        text-align: left;
        justify-content: center;
        align-items: center;
        .more {
          height: 40rpx;
          font-size: var(--hr-font-size-xxxs);
          color: #888888;
        }
        .iconfont {
          font-size: var(--hr-font-size-base);
        }

        &::after {
          border: none;
        }
      }
    }
    // .hidden-patient-information {
    //   opacity: 0;
    //   height: 0rpx;
    //   &.showPatientInformation {
    //     height: auto;
    //     opacity: 1;
    //   }
    // }
  }
</style>
