<template>
  <view class="">
    <view
      v-for="(item, i) in list"
      :key="i"
      @click="itemClick(item)"
      class="doc-info g-border"
    >
      <view class="doc-info-container">
        <image
          :src="
            item.docPhoto ||
            `/static/image/order/order-doctor-avatar${
              gStores.globalStore.isTcmStyle ? '-tcm' : ''
            }.png`
          "
          class="doc-info-avatar"
          mode="aspectFill"
        />

        <view class="doc-info-introduce">
          <view class="doc-info-introduce-header">
            <view>
              <view class="doc-info-introduce-name f36 text-no-wrap">
                {{ item.docName || item.hosDocName }}
              </view>

              <view v-if="item.isCharge === '1'" class="charge-icon f24">
                组长
              </view>
            </view>
            <button v-if="item.docAppointStatus==='1'" class="btn btn-primary f26"  @click="itemClick(item)" >
              立即预约
            </button>
          </view>

          <view class="doc-info-introduce-goodat text-ellipsis">
            <text
              v-for="(job, j) in getJobName(item)"
              :key="j"
              :class="{
                'doc-job-name': j !== getJobName(item).length - 1,
              }"
            >
              {{ job }}
            </text>
          </view>
        </view>
      </view>

      <view>
        <view v-if="item.goodAt " class="doc-intro ellipsis-line-clamp2">
          <image
            :src="
              $global.BASE_IMG +
              `v3_doctor_card_major${
                gStores.globalStore.isTcmStyle ? '-tcm' : ''
              }.png`
            "
            mode="widthFix"
            class="logo-intro-text mr12 relative"
          />

          <text class="color-888 f28">
            {{ item.goodAt || '' }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { GStores } from '@/utils';

  defineProps<{
    list: any[];
  }>();
  const emits = defineEmits(['item-click']);
  const gStores = new GStores();

  const itemClick = (item) => {
    emits('item-click', item);
  };

  const getJobName = (item) => {
    const { docJobName, docTitleName } = item;

    return [docJobName, docTitleName].filter((o) => o);
  };
</script>

<style lang="scss" scoped>
  .doc-info {
    background-color: #fff;
    border-radius: 16rpx;

    padding: 24rpx 32rpx;
    padding-top: 40rpx;

    font-size: var(--hr-font-size-xs);

    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.04);
    margin-bottom: 16rpx;

    &-container {
      display: flex;
      margin-bottom: 24rpx;

      .doc-info-avatar {
        border-radius: 50%;
        border: 1rpx solid var(--hr-neutral-color-3);
        width: 96rpx;
        height: 96rpx;
        margin-right: 24rpx;
      }

      .doc-info-introduce {
        flex: 1;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;

        .doc-info-introduce-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .doc-info-introduce-name {
            font-weight: 600;
            color: var(--hr-neutral-color-10);
            margin-right: 8rpx;
          }

          .charge-icon {
            background-color: #747c94;
            color: #ffe2c1;
            padding: 0 12rpx;
            border-radius: 2px;
          }

          .doc-info-introduce-title {
            color: var(--hr-neutral-color-7);
          }
        }
        .btn{ 
          padding: 8rpx 24rpx;
          background: #296fff;
          border-radius: 28rpx;
          height: 56rpx;
          box-sizing: border-box;
        }

        .doc-info-introduce-goodat {
          color: var(--hr-neutral-color-9);
          font-weight: 400;

          .doc-job-name {
            margin-right: 26rpx;
            position: relative;

            &::after {
              content: '';
              display: inline-block;
              background-color: var(--hr-neutral-color-2);
              width: 1rpx;
              height: 30rpx;
              position: absolute;
              right: -14rpx;
              top: 5rpx;
            }
          }
        }
      }
    }

    .logo-intro-text {
      width: 64rpx;
      height: 64rpx;
      top: 2rpx;
    }

    .doc-intro {
      align-items: flex-start;
    }
  }
</style>
