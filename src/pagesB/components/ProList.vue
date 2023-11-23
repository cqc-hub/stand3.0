<template>
  <view class="proList">
    <view class="list">
      <view
        v-for="(item, i) in list"
        :key="i"
        :class="'item-bg-' + (i % 3)"
        @click="itemClick(item)"
        class="item"
      >
        <view class="item-content">
          <view class="item-content-row">
            <view class="item-row-left">
              <view class="item-title text-ellipsis">
                {{ item.label }}
              </view>
              <image class="right-image" :src="img_url + 'lxfy-arraw.png'" />
            </view>

            <view class="item-row-right">
              <view class="item-cost">
                <!-- {{ item.fee }} -->
              </view>
            </view>
          </view>

          <view class="item-content-row">
            <view class="item-row-left item-describe text-ellipsis">
              {{ item.subLabel }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { type TBannerConfig, useTBanner } from '@/utils';
  import globalGl from '@/config/global';

  const img_url = globalGl.BASE_IMG;

  const props = withDefaults(
    defineProps<{
      list?: {
        label: string;
        subLabel?: string;
        config: TBannerConfig;
      }[];
    }>(),
    {
      list: () => [
        // {
        //   label: '儿童采血取号',
        //   subtitle: '副标题',
        //   config: {
        //     type: 'self',
        //     path: 'pagesC/takeNumber/takeNumber1',
        //     addition: {
        //       patientId: 'patientId',
        //     },
        //     extraData: {
        //       signType: '1',
        //     },
        //   },
        // },
        // {
        //   label: '成人采血取号',
        //   config: {
        //     type: 'self',
        //     path: 'pagesC/takeNumber/takeNumber1',
        //     addition: {
        //       patientId: 'patientId',
        //     },
        //     extraData: {
        //       signType: '3',
        //     },
        //   },
        // },
      ],
    }
  );

  const itemClick = (item: (typeof props.list)[number]) => {
    useTBanner(item.config);
  };
</script>

<style lang="scss" scoped>
  $img-url: 'https://phsdevoss.eheren.com/pcloud/phs3.0/';
  .proList {
    // height: 100%;
    // overflow: auto;
    color: #ffffff;
    .list {
      // margin-top: 40rpx;

      .item {
        height: 216upx;
        margin: 0 32upx;
        margin-bottom: 24upx;

        .item-content {
          margin: 0 30upx;
          padding-top: 40upx;
          height: calc(100% - 40upx);

          .item-content-row {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .item-row-left {
              align-items: center;
              display: flex;
            }

            .item-title {
              font-size: 44upx;
              font-weight: 600;
              max-width: 400upx;
            }

            .right-image {
              width: 44upx;
              height: 44upx;
              margin-left: 48upx;
            }

            .item-cost {
              font-size: 44upx;
              font-weight: 600;
            }

            .item-describe {
              font-size: 32upx;
              width: 100%;
            }
          }
        }

        &.item-bg-0 {
          background: url(#{$img-url} + 'lxfy-item1.png') no-repeat;
          background-size: 100% 100%;
        }
        &.item-bg-1 {
          background: url(#{$img-url} + 'lxfy-item2.png') no-repeat;
          background-size: 100% 100%;
        }
        &.item-bg-2 {
          background: url(#{$img-url} + 'lxfy-item3.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }

    .text-ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
    }
  }
</style>
