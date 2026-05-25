<template>
  <view class="doc-info">
    <view
      class="doc-info-container"
      :class="!isAllDate && isPliticalDoc ? 'mb48' : ''"
    >
      <!-- <g-login @handler-next="avatarClick"> -->
      <img
        :src="
          (!isError && item.docPhoto) ||
          `/static/image/order/order-doctor-avatar${
            gStores.globalStore.isTcmStyle ? '-tcm' : ''
          }.png`
        "
        @click.prevent="showdocDialogClick"
        @error="handleImgError"
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
        <view class="flex-between flex1 items-start">
          <text class="doc-info-introduce-header">
            <text
              @click.prevent="showdocDialogClick"
              class="doc-info-introduce-name f36 text-no-wrap"
            >
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

          <view>
            <view v-if="item.preStatus === '1'" @click.stop="() => {}">
              <g-login @handler-next="preregistrationClick" patient>
                <button
                  @click="preregistrationClick"
                  class="btn btn-primary btn-round btn-size-small"
                >
                  预约登记
                </button>
              </g-login>
            </view>

            <g-login v-if="netService.length" patient>
              <view
                @click.stop="() => {}"
                :class="{
                  'btn-btns': netService.length > 1,
                }"
                class="scheme-item-detail"
              >
                <button
                  v-for="s in netService"
                  :key="s.title"
                  @click="goNetService(s, { hosDocId: item.hosDocId })"
                  class="btn btn-primary btn-reg"
                >
                  {{ s.title }}
                </button>
              </view>
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

        <view
          v-if="isShowDeptName && item.deptName"
          class="doc-info-introduce-title color-888"
        >
          <text>
            {{ item.deptName }}
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

        <view
          v-if="!isHideGoodAt"
          class="doc-info-introduce-goodat text-ellipsis"
        >
          <view
            v-if="!item.schQukCategor && item.goodAt"
            class="text-ellipsis"
            :class="
              listNum === 1 ? 'ellipsis-line-clamp4' : 'ellipsis-line-clamp2'
            "
          >
            <view
              class="doc-show-intro f28 color-blue"
              @click.prevent="showdocDialogClick"
            >
              <text>查看简介</text>
            </view>
            <rich-text
              :nodes="
                HTMLParser(throughCharacterLineFeed(goodAtStr(item.goodAt)))
              "
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
  import { computed, ref } from 'vue';
  import { GStores, ISystemConfig, throughCharacterLineFeed } from '@/utils';
  import globalGl from '@/config/global';
  import HTMLParser from '@/common/html-parser';
  import { goNetService, IDocListAll } from '../../utils';

  const props = defineProps<{
    item: IDocListAll;
    isAllDate?: boolean;
    isShowDeptName?: boolean;
    isHideGoodAt?: boolean;
    isShowHosNameWithDeptName?: boolean;
    pageConfig: ISystemConfig['order'];
    listNum?: number;
  }>();
  const gStores = new GStores();
  const isError = ref(false);
  const netService = computed(() => {
    const item = props.item;
    return [
      item.jsonParam,
      item.pictureParam,
      item.videoParam,
      item.phoneParam,
      // {
      //   title: '图文问诊',
      // },
      // {
      //   title: '视频问诊',
      // },
      // {
      //   title: '电话咨询'
      // },
    ]
      .filter((o, i) => o)
      .filter((o, i) => i < 2);
  });

  const isPliticalDoc = computed(() => {
    return (
      props.item?.politicalStatus &&
      ['中共党员', '中共预备党员'].includes(props.item.politicalStatus)
    );
  });

  const emits = defineEmits([
    'avatar-click',
    'preregistration-click',
    'showdoc-dialog-click',
  ]);

  const goodAtStr = (goodAt) => {
    return `<a style="color:#fff;">查看简介</a> ${goodAt}`;
  };

  const handleImgError = () => {
    isError.value = true;
  };

  const avatarClick = () => {
    emits('avatar-click', props.item);
  };

  const preregistrationClick = () => {
    emits('preregistration-click', props.item);
  };

  const showdocDialogClick = () => {
    emits('showdoc-dialog-click', props.item);
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

  .g-split-line1 {
    &::after {
      content: '|';
      position: relative;
      left: 12rpx;
      font-size: 24rpx;
    }
  }

  .scheme-item-detail {
    display: flex;
    align-items: center;

    .btn-reg {
      font-size: var(--hr-font-size-xxs);
      height: 48rpx;
      border-radius: 28rpx;
      display: flex;
      align-items: center;
      padding: 0 24rpx;

      &.btn-old {
        padding: 30rpx;
      }
      &.border-left {
        border-left: 1rpx solid #999;
      }
    }

    &.btn-btns .btn-reg {
      $r: 8rpx;
      padding: 0 16rpx;

      &:first-child {
        border-radius: $r 0 0 $r;
      }

      &:last-child {
        border-radius: 0 $r $r 0;
      }
    }
  }
  .doc-show-intro {
    position: absolute;
  }
</style>
