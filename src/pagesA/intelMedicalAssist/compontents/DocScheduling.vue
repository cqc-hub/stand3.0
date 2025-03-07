<template>
  <view class="doc-scheduling-container">
    <view class="msg-container">
      <view class="msg mb8 f28 pl32">
        <text>{{ props.msg }}</text>
      </view>
      <view
        class="more mb8 f28 pr32"
        @click="gotoDept"
        v-if="props?.list[0]?.hosDeptId"
      >
        <text>更多医生</text>
      </view>
    </view>
    <view
      class="doc-card-item mt40"
      v-for="(item, index) in props.list"
      :key="index"
    >
      <view class="doc-header flex-normal" @click="gotoDocCard(item)">
        <view class="photo">
          <image
            :src="
              item?.docPhoto
                ? item?.docPhoto
                : '/static/image/order/order-doctor-avatar.png'
            "
            class="doc-info-avatar"
            mode="aspectFill"
          />
        </view>
        <view class="flex-column f28 pr30">
          <view class="title-line flex-normal pb10">
            <view class="title f36 g-bold color-111">{{ item?.docName }}</view>
            <view class="subtitle flex-normal pt8">
              <view class="sub-main">{{ item?.docTitleName }}</view>
              <view class="ellipsis" v-if="item?.deptName">|</view>
              <view class="text-ellipsis">
                {{ item?.deptName }}
              </view>
            </view>
          </view>
          <view class="hos-name text-ellipsis">{{ item?.hosName }}</view>
          <view class="substr color-111 pt8">
            {{ item?.intro || item?.goodAt }}
          </view>
        </view>
      </view>
      <view class="doc-footer flex-normal">
        <view
          class="footer-conntent mt8 flex-normal"
          :class="!item?.isCollapse ? 'isCollaps' : ''"
        >
          <view class="reg-area reg-title">预约日期:</view>
          <view
            class="reg-area"
            v-for="(regItem, regIndex) in item?.date"
            :key="regIndex"
          >
            <view class="reg-item" @click="chooseDocDate(item, regIndex)">
              {{ regItem.slice(5) }}
            </view>
          </view>
          <view
            class="reg-area"
            v-for="(block, index) in 4 - (item?.date?.length % 4) - 1"
            :key="`block+${index}`"
          ></view>
        </view>
        <view class="arrow-content">
          <view
            class="icon-arrow1"
            v-if="item?.date.length > 4"
            @click="item.isCollapse = !item?.isCollapse"
          >
            <view
              :class="{ 'open-arrow': !item?.isCollapse }"
              class="iconfont ico-arrow"
            >
              &#xe6c4;
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
  import { ref, computed, getCurrentInstance, onMounted } from 'vue';
  import { deepClone } from '@/common/utils';
  import { GStores, useTBanner } from '@/utils';
  import {handleChooseSchDate} from '../utils/utils'
  const gStores = new GStores();
  const props = defineProps<{
    list: any[];
    msg: string;
  }>();


  onMounted(() => {
    console.log('DoctorCard mounted', props);
  });

  import { joinQueryForUrl } from '@/common';
  const gotoDocCard = (docInfo) => {
    // #ifndef H5
    const { hosId, hosDocId, hosDeptId, docName } = docInfo;
    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/DoctorDetails', {
        hosId,
        hosDocId,
        hosDeptId,
        docName,
      }),
    });
    // #endif

    // #ifdef H5
    const docInfoQuery = deepClone(docInfo);
    delete docInfoQuery.goodAt;
    delete docInfoQuery.date;
    switch (gStores.globalStore.sysCode) {
      case '1001035':
        const fullUrl = joinQueryForUrl(
          'https://h5.eheren.com/jiangsushengzhong/#/pagesA/MyRegistration/DoctorDetails?type=order',
          docInfoQuery
        );
        location.href = fullUrl;
        break;
      default:
        useTBanner({
          type: 'self',
          path: joinQueryForUrl(
            'pagesA/MyRegistration/DoctorDetails',
            docInfoQuery
          ),
        });
        break;
    }
    // #endif
  };
  const chooseDocDate = (docInfo, date) => {
    // #ifndef H5
    // handleChooseSchDate(docInfo, date)
    gotoDocCard(docInfo);
    // #endif
    // #ifdef H5
    gotoDocCard(docInfo);
    // #endif
  };

  const gotoDept = () => {
    const docInfo = props?.list[0];
    // #ifndef H5
    const { hosId, hosDeptId, deptName } = docInfo;
    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/order', {
        hosId,
        hosDeptId,
        deptName,
      }),
    });
    // #endif

    // #ifdef H5

    switch (gStores.globalStore.sysCode) {
      case '1001035':
        const fullUrl = joinQueryForUrl(
          'https://h5.eheren.com/jiangsushengzhong/#/pagesA/MyRegistration/order?type=order',
          { ...docInfo, deptId: docInfo.hosDeptId }
        );
        location.href = fullUrl;
        break;
      default:
        useTBanner({
          type: 'self',
          path: joinQueryForUrl(
            'pagesA/MyRegistration/order?type=order',
            docInfo
          ),
        });
        break;
    }
    // #endif
  };
</script>
<style lang="scss" scoped>
  .doc-scheduling-container {
    width: 100vw;
    transition: 0.5s;
    .msg-container {
      display: flex;
      justify-content: space-between;
      width: 100vw;
      .msg {
        // width: 95vw;

        color: $hr-neutral-color-9;
        width: fit-content;
      }
      .more {
        color: $hr-brand-color-6;
        width: fit-content;
      }
    }

    .doc-card-item {
      //   letter-spacing: 1rpx;
      width: 85vw;
      margin: auto;
      background: #e8f4ff;
      border-radius: 0px 24rpx 24rpx 24rpx;
      padding: 40rpx 32rpx;
      .doc-header {
        color: $hr-neutral-color-7;
        align-items: flex-start;
        .photo {
          .doc-info-avatar {
            border-radius: 50%;
            border: 1rpx solid var(--hr-neutral-color-3);
            width: 96rpx;
            height: 96rpx;
            margin-right: 24rpx;
          }
        }
      }
      .title-line {
        .title {
          min-width: fit-content;
        }

        .subtitle {
          .sub-main {
            min-width: fit-content;
          }
          overflow: hidden;
          view {
            padding: 0 10rpx;
          }
        }
      }
      .hos-name {
      }
      .substr {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
    .doc-footer {
      align-items: flex-start;
      .footer-conntent {
        flex: 1 1 auto;
        justify-content: flex-start;
        flex-wrap: wrap; /* 允许换行 */
        .reg-area {
          flex: 1 1 25%;
          font-size: $hr-font-size-xs;
          margin-top: 16rpx;
          height: 60rpx;
        }
        .reg-title {
          color: $hr-neutral-color-8;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .reg-item {
          color: $hr-brand-color-6;
          background-color: $h-color-white;
          border-radius: 12rpx;
          padding: 10rpx 25rpx;
          width: fit-content;
          min-width: 90rpx;
          text-align: center;
        }
      }
      .arrow-content {
        // position: absolute;
        flex: 0 0 10rpx;
        margin-top: 30rpx;
        // position: relative;
        // left: 15rpx;
        // width: 20rpx;
      }
      .ico-arrow {
        transition: all 0.1s linear;
        color: var(--hr-neutral-color-7);
        font-size: var(--hr-font-size-xxl);
        transform: rotate(-180deg);
        &.open-arrow {
          transform: rotate(0);
          // left: 0;
        }
      }
    }
  }
  .isCollaps {
    height: 80rpx;
    overflow: hidden;
  }
</style>
