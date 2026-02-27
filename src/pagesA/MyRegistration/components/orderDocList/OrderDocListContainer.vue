<template>
  <view class="doc-info">
    <view
      class="doc-info-container"
      :class="!isAllDate && isPliticalDoc ? 'mb48' : ''"
    >
      <!-- <g-login @handler-next="avatarClick"> -->
      <img
        :src="
          item.docPhoto ||
          `/static/image/order/order-doctor-avatar${
            gStores.globalStore.isTcmStyle ? '-tcm' : ''
          }.png`
        "
        @click="avatarClick"
        class="doc-info-avatar mr24"
        mode="aspectFill"
        lazy-load
      />
      <!-- 2种党员样式 -->
      <image
        v-if="isPliticalDoc && pageConfig.isPartyMemberStyle === '1'"
        class="CPC-icon1"
        :src="globalGl.BASE_IMG + 'is_party_member.png'"
      ></image>
      <image
        v-if="isPliticalDoc && pageConfig.isPartyMemberStyle !== '1'"
        class="CPC-icon"
        :src="globalGl.BASE_IMG + 'CPC-icon2.png'"
      ></image>

      <!-- </g-login> -->

      <view @click="avatarClick" class="doc-info-introduce">
        <view class="flex-between flex1">
          <text class="doc-info-introduce-header">
            <text class="doc-info-introduce-name f36 text-no-wrap">
              <text class="">{{ item.docName }}</text>
            </text>

            <text
              v-for="(t, ti) in getSuffixTitle()"
              :key="t"
              :class="{
                'g-split-line1 mr12 pr12': ti !== getSuffixTitle().length - 1,
              }"
              class="color-888"
            >
              {{ t }}
            </text>
          </text>

          <view
            v-if="item.preStatus === '1'"
            @click.stop="() => {}"
            class="reg-btn"
          >
            <g-login @handler-next="preregistrationClick" patient>
              <button
                @click="preregistrationClick"
                class="btn btn-primary btn-round btn-size-small"
              >
                预约登记
              </button>
            </g-login>
          </view>
        </view>

        <!-- v-if="item.hosName && isAllDate" -->
        <view
          v-if="item.hosName"
          :class="{
            [(isShowHosNameWithDeptName && 'color-blue text-ellipsis') ||
            'color-888']: 1,
          }"
          class="doc-info-introduce-title"
        >
          <text v-if="item.deptName && isShowHosNameWithDeptName">
            {{ item.deptName }} -
          </text>
          <text v-if="gStores.globalStore.sysCode === '1001067'">
            {{ item.hosName }}
          </text>
        </view>

        <!-- <view v-if="item.clinicTime" class="text-ellipsis ellipsis-line-clamp2">
          <text>{{ '门诊时间: ' }}</text>
          <text>{{ item.clinicTime }}</text>
        </view> -->

        <view v-if="item.specialClinicName">
          <text class="mr12">出诊科室</text>
          <text
            v-for="(o, i) in splitSpecialDeptName(item.specialClinicName)"
            :key="i"
            :class="{
              'g-split-line1':
                i !== splitSpecialDeptName(item.specialClinicName).length - 1,
            }"
            class="color-888 f28 mr12 pr12"
          >
            {{ o }}
          </text>
        </view>

        <view
          v-if="item.multiplePracticeLocation"
          class="color-444 ellipsis-line-clamp2 g-break-word"
        >
          <text
            v-for="(place, pi) in getDicMultiplePracticeLocation(item)"
            :class="{
              'g-split-line':
                pi !== getDicMultiplePracticeLocation(item).length - 1,
            }"
            :key="place"
            class="color-444 mr12 pr12 g-break-world"
          >
            {{ place }}
          </text>
        </view>

        <!-- <view
          v-if="item.visitingArea"
          :class="{
            mb12: isAllDate,
          }"
          class="color-444 ellipsis-line-clamp2 g-break-word"
        >
          {{ item.visitingArea }}
        </view> -->

        <view class="doc-info-introduce-goodat text-ellipsis">
          <view
            v-if="!item.schQukCategor && item.goodAt"
            class="text-ellipsis ellipsis-line-clamp2"
          >
            <rich-text
              :nodes="HTMLParser(throughCharacterLineFeed(item.goodAt))"
            />
          </view>

          <!-- 按天的荣誉职称 -->
          <!-- <block v-else>
            <text
              :class="{
                'doc-job-name': item.docJobName,
              }"
            >
              {{ item.docJobName }}
            </text>

            <text>
              {{ item.docTitleName }}
            </text>
          </block> -->
        </view>
      </view>
    </view>

    <slot name="footer" :item="item" />
  </view>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { GStores, ISystemConfig, throughCharacterLineFeed } from '@/utils';
  import globalGl from '@/config/global';
  import HTMLParser from '@/common/html-parser';

  const props = defineProps<{
    // item: IDocListAll;
    item: any;
    isAllDate?: boolean;
    isShowHosNameWithDeptName?: boolean;
    pageConfig: ISystemConfig['order'];
  }>();
  const gStores = new GStores();

  const isPliticalDoc = computed(() => {
    return (
      props.item?.politicalStatus &&
      ['中共党员', '中共预备党员'].includes(props.item.politicalStatus)
    );
  });

  const emits = defineEmits(['avatar-click', 'preregistration-click']);

  const avatarClick = () => {
    emits('avatar-click', props.item);
  };

  const preregistrationClick = () => {
    emits('preregistration-click', props.item);
  };

  const splitSpecialDeptName = (name: string) => name.split(',');

  const getSuffixTitle = (): string[] => {
    let { docJobName, docTitleName } = props.item;
    if (props.pageConfig.isHideDocJob === '1') {
      docJobName = '';
    }
    return [docJobName, docTitleName].filter((o) => o);
  };

  const getDicMultiplePracticeLocation = (item) => {
    const { multiplePracticeLocation } = item;
    if (multiplePracticeLocation) {
      return multiplePracticeLocation.split(',');
    }

    return [];
  };
</script>

<style lang="scss" scoped>
  .doc-info {
    background-color: #fff;
    border-radius: 16rpx;

    padding: 24rpx 32rpx;
    padding-top: 40rpx;

    font-size: var(--hr-font-size-xs);

    &-container {
      display: flex;
      margin-bottom: 24rpx;
      position: relative;

      .doc-info-avatar {
        border-radius: 50%;
        border: 1rpx solid var(--hr-neutral-color-3);
        width: 96rpx;
        height: 96rpx;
        flex-shrink: 0;
        position: relative;
      }
      .CPC-icon {
        width: 126rpx;
        height: 45rpx;
        position: absolute;
        top: 78rpx;
        transform: translate(-15rpx, 0px);
      }
      .CPC-icon1 {
        position: absolute;
        width: 60rpx;
        height: 60rpx;
        transform: translate(100%, 80%);
      }

      .doc-info-introduce {
        flex: 1;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;

        .doc-info-introduce-header {
          // display: flex;
          // align-items: center;
          .doc-info-introduce-name {
            font-weight: 600;
            color: var(--hr-neutral-color-10);
            margin-right: 8rpx;
          }

          .doc-info-introduce-title {
            color: var(--hr-neutral-color-7);
          }
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
  }

  .reg-btn {
    text-align: right;
  }
  .g-split-line1 {
    &::after {
      content: '|';
      position: relative;
      left: 12rpx;
      font-size: 24rpx;
    }
  }
</style>
