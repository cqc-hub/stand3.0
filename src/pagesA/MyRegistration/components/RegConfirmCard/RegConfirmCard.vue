<template>
  <view class="card g-border">
    <view class="row-bold">
      <view>
        <text class="iconfont">&#xe6ea;</text>
      </view>

      <view class="row-title-bold">
        <text class="row-title-mr">{{ myProps.schDate }}</text>
        <text class="row-title-mr">
          {{ myProps.ampmName + myProps.timeDesc }}
        </text>
        <text>{{ myProps.disNo }}号</text>
      </view>
    </view>

    <view class="row-bold mb32">
      <view>
        <text class="iconfont">&#xe6dc;</text>
      </view>

      <view class="row-title-bold">
        <text>{{ myProps.deptName }}</text>
      </view>
    </view>

    <view class="row">
      <view class="title">预约医院</view>
      <view>{{ hosLabel }}</view>
    </view>

    <view class="row">
      <view class="title">挂号金额</view>
      <view>{{ myProps.fee }}元</view>
    </view>

    <view class="doc g-border-top">
      <image
        :src="myProps.docPhoto || '/static/image/order/order-doctor-avatar.png'"
        class="doc-avatar g-border"
        mode="aspectFill"
      />

      <view>
        <view class="row-title-bold">{{ myProps.docName }}</view>
        <view class="doc-desc">
          {{ myProps.schQukCategor || myProps.categorName }}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref, toRaw, onMounted } from 'vue';
  import { ServerStaticData, wait } from '@/utils';
  import { IPageProps } from '../../utils/regConfirm';

  const props = withDefaults(
    defineProps<{
      myProps: Pick<
        IPageProps,
        | 'schDate'
        | 'ampmName'
        | 'disNo'
        | 'deptName'
        | 'schQukCategor'
        | 'docName'
        | 'docPhoto'
        | 'hosId'
        | 'timeDesc'
        | 'fee'
        | 'categorName'
      >;
    }>(),
    {}
  );

  const hosLabel = ref('');

  onMounted(async () => {
    await wait(500);
    const hosId = props.myProps.hosId;

    if (hosId) {
      ServerStaticData.getHosList().then((list) => {
        list.map((o) => {
          if (o.hosId === hosId) {
            hosLabel.value = o.hosName;
          }
        });
      });
    }
  });
</script>

<style lang="scss" scoped>
  .card {
    background-color: #fff;
    padding: 32rpx;
    border-radius: 16rpx;

    .row-bold {
      display: grid;
      grid-template-columns: 60rpx 1fr;
      align-items: flex-start;
      padding-bottom: 12rpx;

      .iconfont {
        color: var(--hr-neutral-color-9);
        font-size: var(--hr-font-size-xxl);
      }
    }

    .row {
      margin-bottom: 12rpx;
      display: flex;
      align-items: flex-start;
      font-size: var(--hr-font-size-xs);
      .title {
        margin-right: 16rpx;
        color: var(--hr-neutral-color-7);
      }
    }

    .doc {
      margin-top: 32rpx;
      padding: 32rpx 0;
      padding-bottom: 0;

      display: flex;
      align-items: center;

      .doc-avatar {
        width: 88rpx;
        height: 88rpx;
        border-radius: 50%;
        margin-right: 24rpx;
      }

      .doc-desc {
        color: var(--hr-neutral-color-9);
        font-size: var(--hr-font-size-xxxs);
      }
    }

    .mb32 {
      margin-bottom: 32rpx;
    }

    .row-title-bold {
      font-weight: 600;
      font-size: var(--hr-font-size-xl);
      // #ifdef MP-ALIPAY
      line-height: 60rpx;
      // #endif

      .row-title-mr {
        margin-right: 30rpx;
      }
    }
  }
</style>
