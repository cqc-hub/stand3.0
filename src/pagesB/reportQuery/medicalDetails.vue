<template>
  <view class="page">
    <view class="container">
      <view class="container-block">
        <view class="container-block-top">
          <view class="title">体检报告总检建议</view>
          <view class="patient-information">
            <view class="subhead"
              >患者信息<view class="subhead-detail">张三三(8764865987)</view></view
            >
            <view class="subhead"
              >报告单号<view class="subhead-detail">202209160012345678</view></view
            >
            <view class="subhead"
              >报告时间<view class="subhead-detail">2022-09-19 12:45:10</view></view
            >
            <view class="subhead">报告医生<view class="subhead-detail">汤燕</view></view>
          </view>
        </view>
        <view class="container-block-bottom">
          <view class="seen">
            <view class="title">总检结论</view>
            <view class="content">
              1.甲状腺结节2类 2.甲状腺回声改变 3.血压偏高 4.体重超重 5.高胆固醇血症
              6.低密度脂蛋白胆固醇增高 7.葡萄糖(GLU偏低 8.同型半胱氨酸偏高 9.前列腺钙化斑
              10.痔疮</view
            >
          </view>
          <view class="seen">
            <view class="title">检查汇总</view>
            <view class="content">
              <view class="item">
                <view class="item-title">1. 一般检查结论</view>
                <view class="item-content">体重超重 血压偏高</view>
              </view>
              <view class="item">
                <view class="item-title">2.内科结论</view>
                <view class="item-content">未见异常</view>
              </view>
              <view class="item">
                <view class="item-title">3.外科结论</view>
                <view class="item-content">未见异常</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="tips">
      <view>{{ tips.title }}：</view>
      <view>{{ tips.content }}</view>
    </view>
    <view class="footer">
      <button class="footer-button">
        <view class="icon-font ico_download-blue"></view
        ><view class="title">下载报告</view>
      </button>
      <text style="color: #e6e6e6">|</text>
      <button class="footer-button">
        <view class="icon-font ico_share-blue"></view><view class="title">分享报告</view>
      </button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import api from "@/service/api";
import { ref, onMounted, reactive } from "vue";
const tips = ref({
  title: "",
  content: "",
});
const getTips = async () => {
  const { result } = await api.getSysAppMore({
    typeFlag: 6,
  });
  tips.value = result;
};
onMounted(() => {
  getTips();
});
</script>

<style lang="scss" scoped>
.page {
  height: auto;
  width: 100%;
  flex-direction: column;
  background-color: #f6f6f6;
  .container {
    margin-left: 32rpx;
    width: calc(100% - 32rpx);
    .container-block {
      width: 100%;
      height: 100%;
      padding-top: 24rpx;
      .container-block-top {
        width: calc(100% - 32rpx);
        background: linear-gradient(0deg, #ffffff, #e9f0ff);
        border-radius: 16rpx 16rpx 0rpx 0rpx;
        box-shadow: 0rpx 1rpx 0rpx 0rpx #e6e6;
        border: 1rpx solid #e6e6e6;
        padding-bottom: 40rpx;
        .title {
          width: calc(100% - 32rpx);
          font-size: 44rpx;
          font-weight: 600;
          margin-left: 32rpx;
          padding-top: 40rpx;
        }
        .patient-information {
          width: calc(100% - 32rpx);
          margin-left: 32rpx;
          margin-top: 16rpx;
          font-size: 24rpx;
          .subhead {
            margin-top: 8rpx;
            color: #888888;
            display: flex;
            position: relative;
            .subhead-title {
              height: 44rpx;
              width: 112rpx;
            }
            .subhead-detail {
              margin-left: 16rpx;
              color: #444444;
              white-space: pre-wrap;
            }
            .more-button {
              height: 40rpx;
              position: absolute;
              right: 0rpx;
              background-color: rgb(0, 0, 0, 0);
              line-height: 40rpx;
              display: flex;
              .more {
                height: 40rpx;
                width: 48rpx;
                font-size: 24rpx;
                color: #888888;
              }
              .iconfont {
                font-size: 32rpx;
              }
            }
          }
        }
      }
      .container-block-bottom {
        width: calc(100% - 32rpx);
        border-radius: 0rpx 0rpx 16rpx 16rpx;
        background-color: #fff;
        border-left: 1rpx solid #e6e6e6;
        border-right: 1rpx solid #e6e6e6;
        border-bottom: 1rpx solid #e6e6e6;
        padding-bottom: 16rpx;
        .seen {
          padding-top: 40rpx;
          margin-left: 32rpx;
          white-space: pre-wrap;
          .title {
            font-size: 36rpx;
            font-weight: 600;
          }
          .content {
            margin-top: 16rpx;
            width: calc(100% - 32rpx);
            white-space: pre-wrap;
            .item {
              height: auto;
              width: calc(100% - 32rpx);
              margin-bottom: 32rpx;
              .item-title {
                font-size: 32rpx;
                font-weight: 600;
              }
              .item-content {
                margin-top: 8rpx;
                white-space: pre-wrap;
              }
            }
          }
        }
      }
    }
  }
  .tips {
    margin-left: 32rpx;
    width: calc(100% - 32rpx);
    color: #888888;
    margin-top: 40rpx;
    font-size: 28rpx;
    padding-bottom: 206rpx;
  }
  .footer {
    height: 96rpx;
    width: 100%;
    background-color: #fff;
    line-height: 96rpx;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    .footer-button {
      height: 96rpx;
      width: 100%;
      line-height: 96rpx;
      display: flex;
      justify-content: center;
      background-color: #fff;
      border-radius: 0rpx;
      .title {
        font-size: 28rpx;
        text-align: center;
      }
      .icon-font {
        width: 40rpx;
        height: 40rpx;
        margin-top: 28rpx;
      }
    }
  }
}
</style>
