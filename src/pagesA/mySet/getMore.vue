<template>
  <view class="page">
    <view class="top-info">
      <image
        :src="$global.BASE_IMG + 'getmore-img_heren@3x.png'"
        mode="widthFix"
      ></image>
      <view>当前版本 {{ $global.VERSION }}</view>
    </view>
    <view class="more-content">

      <navigator
        v-for="item in cacheStore.flagList"
        :key="item.flag"
        :url="
          joinQueryForUrl('/pagesA/mySet/userPolicy', {
            typeFg: item.flag,
          })
        "
      >
        <view>
          <text>{{ item.label }}</text>
          <view class="iconfont icon-resize icon_arrow">&#xe66b;</view>
        </view>
      </navigator>

      <view @click="goInfoPage" class="flex-between">
        <text>注销账号</text>
        <view class="iconfont icon-resize icon_arrow">&#xe66b;</view>
      </view>
    </view>
    <view class="footer">浙江和仁科技股份有限公司&copy;技术支持</view>
  </view>
</template>

<script lang="ts" setup>
  import { joinQueryForUrl } from '@/common';
  import { useCacheStore } from '@/stores';

  const cacheStore = useCacheStore();
  const goInfoPage = () => {
    uni.navigateTo({
      url: '/pages/home/accountInfo',
    });
  };
</script>

<style lang="scss" scoped>
  .page {
    .top-info {
      height: 300upx;
      text-align: center;

      image {
        width: 147upx;
        // height: 77upx;
        margin: 93upx 0 10upx 0;
      }

      view {
        color: #999;
        font-size: var(--hr-font-size-xs);
        line-height: 40upx;
      }
    }

    .more-content {
      background: #fff;
      padding-left: 30upx;

      view {
        padding-right: 30upx;
        // border-bottom: 1px solid $uni-border-color;
        height: 88upx;
        color: #333;
        font-size: var(--hr-font-size-base);
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:nth-child(5) {
          border: none;
        }

        image {
          width: 21upx;
          height: 32upx;
        }
      }

      .icon-resize {
        font-size: var(--hr-font-size-xxl);
      }
    }
    .footer {
      position: fixed;
      bottom: 50upx;
      width: 100%;
      font-size: var(--hr-font-size-xs);
      color: #999999;
      text-align: center;
    }
  }
</style>
