<template>
  <view class="doc-info">
    <view class="doc-info-container">
      <!-- <g-login @handler-next="avatarClick"> -->
      <image
        :src="item.docPhoto || '/static/image/order/order-doctor-avatar.png'"
        @click="avatarClick"
        class="doc-info-avatar mr24"
        mode="aspectFill"
      />
      <!-- </g-login> -->

      <view @click="avatarClick" class="doc-info-introduce">
        <view class="flex-between flex1">
          <view class="doc-info-introduce-header">
            <view class="doc-info-introduce-name f36 text-no-wrap">
              <text class="text-ellipsis">{{ item.docName }}</text>
            </view>
            <view
              v-if="item.docTitleName && isAllDate"
              class="doc-info-introduce-title flex-normal"
            >
              <view
                :class="{
                  'g-split-line': item.docJobName,
                }"
                class="mr12 pr12 text-no-wrap"
              >
                {{ item.docTitleName }}
              </view>
              <view v-if="item.docJobName" class="text-ellipsis">
                {{ item.docJobName }}
              </view>
            </view>
          </view>

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
              'g-split-line':
                i !== splitSpecialDeptName(item.specialClinicName).length - 1,
            }"
            class="color-888 f28 mr12 pr12"
          >
            {{ o }}
          </text>
        </view>

        <view class="doc-info-introduce-goodat text-ellipsis">
          <view
            v-if="!item.schQukCategor"
            class="text-ellipsis ellipsis-line-clamp2"
          >
            {{ item.goodAt }}
          </view>

          <!-- 按天的荣誉职称 -->
          <block v-else>
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
          </block>
        </view>
      </view>
    </view>

    <slot name="footer" :item="item" />
  </view>
</template>

<script lang="ts" setup>
  import { IDocListAll } from '../../utils';

  const props = defineProps<{
    item: IDocListAll;
    isAllDate?: boolean;
  }>();

  const emits = defineEmits(['avatar-click', 'preregistration-click']);

  const avatarClick = () => {
    emits('avatar-click', props.item);
  };

  const preregistrationClick = () => {
    emits('preregistration-click', props.item);
  };

  const splitSpecialDeptName = (name: string) => name.split(',');
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

      .doc-info-avatar {
        border-radius: 50%;
        border: 1rpx solid var(--hr-neutral-color-3);
        width: 96rpx;
        height: 96rpx;
        flex-shrink: 0;
      }

      .doc-info-introduce {
        flex: 1;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;

        .doc-info-introduce-header {
          display: flex;
          align-items: center;
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
</style>
