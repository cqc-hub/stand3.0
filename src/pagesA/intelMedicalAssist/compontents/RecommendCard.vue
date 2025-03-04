<template>
  <view class="card-item mb32 mt18" @click="gotoGuide(formData)">
    <view class="card-content pt32 pb48">
      <view class="header-area">
        <view class="title g-bold f36">
          <view class="main">{{ formData?.statusName }}</view>
          <view class="more f24">查看更多</view>
        </view>
        <view class="warn f28">{{ formData?.statusDesciption }}</view>
      </view>
      <view class="content-area pt30" >
        <g-form
          :value="formData"
          forShowBodyAlign="left"
          hideRowBorder
          ref="gform"
          @disabled-click="gotoGuide(formData)"
        >
          <template #show-body="{ item, value }">
            <view
              @click="goDoctorCard(formData)"
              v-if="item.key === 'docName'"
              class="color-blue flex-normal doc-name"
            >
              <view class="doc-name-value">
                {{ value }}
              </view>
              <view style="font-weight: 400" class="iconfont">&#xe6c8;</view>
            </view>
            <view v-else-if="item.key === 'hosName'" class="flex-normal">
              <view class="hos-name-value">
                {{ value }}
              </view>
              <view class="location flex-normal" @click="goLocation(formData)">
                <view class="iconfont icon-location" style="font-weight: 400">
                  &#xe6d7;
                </view>
                <view class="icon-name color-blue f24">导航</view>
              </view>
            </view>
            <view
              v-else
              :class="{
                'color-blue': [
                  '_fee',
                  '_hosAccountOffsetFee',
                  '_totalCost',
                ].includes(item.key),
              }"
            >
              {{ value }}
            </view>
          </template>
        </g-form>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
  import { nextTick, ref, onMounted } from 'vue';
  import { cloneUtil } from '@/common';
  import {
    formatterTemp,
    goLocation,
    goDoctorCard,
    gotoGuide,
  } from '../utils/utils';
  import type { TInstance } from '@/components/g-form/index';
  const props = defineProps<{
    formData: any;
    formList: TInstance[];
  }>();
  const gform = ref<any>('');
  const showFormList = ref<any[]>([]);

  onMounted(() => {
    nextTick(() => {
      showFormList.value = cloneUtil(props.formList);
      formatterTemp(showFormList.value, false);
      gform.value.setList(showFormList.value);
    });
  });
</script>
<style lang="scss" scoped>
  .card-item {
    width: 100vw;
    .card-content {
      background-color: #e8f4ff;
      margin: auto;
      transform: translateY(-20rpx);
      // border: 2rpx solid #e6e6e6;
      border-radius: 12px;
      width: 90vw;
      .header-area {
        padding: 16rpx 32rpx 30rpx;
        border-bottom: 2rpx solid #e6e6e6;
        .title {
          display: flex;
          justify-content: space-between;
        }
        .warn {
          color: #ff8a00;
          padding-top: 16rpx;
        }
      }
      .content-area {
        .color-blue {
          color: var(--hr-brand-color-6);
        }
      }
    }
  }
  .iconfont {
    font-size: 36rpx;
    padding-top: 6rpx;
  }
  .icon-name {
    padding-top: 6rpx;
  }
  .icon-location {
    color: var(--hr-brand-color-6);
    margin: 0 6rpx;
    position: relative;
  }
  .more {
    color: $hr-brand-color-6;
    width: fit-content;
    display: flex;
    align-items: center;
  }
</style>
