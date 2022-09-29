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
      <navigator url="/pagesA/mySet/userPolicy">
        <view>
          <text>用户条款和隐私政策</text>
          <view class="iconfont icon-resize icon_arrow">&#xe66b;</view>
        </view>
      </navigator>
    </view>
    <view class="footer">浙江和仁科技股份有限公司&copy;技术支持</view>
  </view>
</template>

<script lang="ts" setup></script>

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
        font-size: 28upx;
        line-height: 40upx;
      }
    }

    .more-content {
      background: #fff;
      padding-left: 30upx;

      view {
        padding-right: 30upx;
        border-bottom: 1px solid $uni-border-color;
        height: 88upx;
        color: #333;
        font-size: 32upx;
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
        font-size: 48rpx;
      }
    }
    .footer {
      position: fixed;
      bottom: 50upx;
      width: 100%;
      font-size: 28upx;
      color: #999999;
      text-align: center;
    }
  }
</style>
