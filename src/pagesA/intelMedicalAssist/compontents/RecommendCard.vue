<template>
  
  <view class="card-item mb32">
    <view class="card-content  p32v">
      <view class="header-area">
        <view class="title g-bold f36">预约成功</view>
        <view class="warn f28">预约成功，请在就诊前完成缴费取号</view>
      </view>
      <view class="content-area pt30">
        <g-form
          :value="formData"
          forShowBodyAlign="left"
          hideRowBorder
          ref="gform"
        >
          <template #showBody="{ item, value }">
            <view
              @click="goDoctorCard(item)"
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
              <view class="location flex-normal" @click="goLocation(item)">
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
  import { formatterTemp, goLocation, goDoctorCard } from '../utils/utils';
  import type { TInstance } from '@/components/g-form/index';
  const props = defineProps<{
    formData: any;
    formList: TInstance[];
  }>();
  const gform = ref<any>('');

  onMounted(() => {
    nextTick(() => {
      formatterTemp(props.formList, false);
      gform.value.setList(props.formList);
    });
  });
</script>
<style lang="scss" scoped>
  .card-item {
    width: 100vw;
    .card-content {
      background-color: #f5f8ff;
      margin: auto;
      transform: translateY(-20rpx);
      // border: 2rpx solid #e6e6e6;
      border-radius: 12px;
      width: 90vw;
      .header-area {
        padding: 16rpx 32rpx 30rpx;
        border-bottom: 2rpx solid #e6e6e6;
        .title {
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

</style>
