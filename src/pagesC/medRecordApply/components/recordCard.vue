<template>
  <view class="">
    <view
      v-for="(item, idx) in list"
      :key="idx"
      :class="{
        mb16: idx !== list.length,
      }"
      class="container-card"
    >
      <view
        v-if="item.outTime"
        class="container-card-header up-lv flex-normal g-border-bottom"
      >
        <view class="iconfont container-card-header-icon mr12">&#xe6f3;</view>

        <view>
          <text>{{ formatterTime(item.admissionTime) }}</text>
          <text class="timer-split">至</text>
          <text>{{ formatterTime(item.outTime) }}</text>
        </view>
      </view>

      <view v-if="item.isOneself === '0'" class="card-self-logo">
        <view class="_card-self-logo g-flex-rc-cc g-bold">
          <view>手动</view>
          <view>添加</view>
        </view>
      </view>

      <view
        v-if="item.hosName && item.isOneself === '0'"
        class="container-card-row flex-normal mt16"
      >
        <view class="label">院区</view>

        <view class="content">{{ item.hosName }}</view>
      </view>

      <view v-if="item.visitNo" class="container-card-row flex-normal mt16">
        <view class="label">住院号</view>

        <view class="content">{{ item.visitNo }}</view>
      </view>

      <view v-if="item.diagnosis" class="container-card-row flex-normal">
        <view class="label">诊断</view>

        <view class="content">
          {{ showDiagnosis(item.diagnosis) }}
        </view>
      </view>

      <view
        v-if="
          (item.docName || item.deptName || item.hosName) &&
          item.isOneself !== '0'
        "
        class="container-card-row flex-normal"
      >
        <view class="label">医生</view>

        <view class="content text-ellipsis">
          <text
            v-if="item.docName"
            :class="{
              'g-split-line': item.hosName || item.deptName,
            }"
            class="mr12 pr12"
          >
            {{ item.docName }}
          </text>

          <text
            v-if="item.deptName"
            :class="{
              'g-split-line': item.hosName,
            }"
            class="mr12 pr12"
          >
            {{ item.deptName }}
          </text>

          <text>{{ item.hosName }}</text>
          <!-- {{ item.attendingDoctor + item.hosName }} -->
        </view>
      </view>

      <view
        v-if="item.deptName && item.isOneself === '0'"
        class="container-card-row flex-normal"
      >
        <view class="label">病区科室</view>

        <view class="content">
          {{ item.deptName }}
        </view>
      </view>

      <view
        v-if="isEdit && item.isOneself === '0'"
        class="mt24 flex-normal edit-container color-444 f28"
      >
        <view @click="delClick(item, idx)">
          <text class="iconfont">&#xe6cf;</text>
          <text>删除</text>
        </view>

        <view class="mr60" @click="editClick(item, idx)">
          <text class="iconfont">&#xe6b9;</text>
          <text>编辑</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { CaseCopeItemDetail } from '../utils/recordApply';
  import dayjs from 'dayjs';
  import { NotNullable } from '@/typeUtils';

  defineProps<{
    list: NotNullable<CaseCopeItemDetail['_outInfo']>;
    isEdit?: boolean;
  }>();

  const emits = defineEmits(['click-edit', 'click-del']);

  const formatterTime = (time: string) => dayjs(time).format('YYYY-MM-DD');

  const editClick = (item, index) => {
    emits('click-edit', { item, index });
  };

  const delClick = (item, index) => {
    emits('click-del', { item, index });
  };

  const showDiagnosis = (v: string | string[]) => {
    if (typeof v === 'string') {
      return v;
    } else {
      return v.join('、');
    }
  };
</script>

<style lang="scss" scoped>
  .container-card {
    background-color: var(--hr-neutral-color-1);
    border-radius: 4px;
    padding: 32rpx;
    padding-top: 24rpx;
    overflow: hidden;
    position: relative;

    .card-self-logo {
      color: #e9e9e9;
      font-size: var(--hr-font-size-xxl);
      border: solid 10rpx;
      display: inline-block;
      position: absolute;
      right: -10rpx;
      top: -10rpx;
      z-index: 1;
      pointer-events: none;

      transform: rotate(25deg);

      border-radius: 900rpx;
      ._card-self-logo {
        border-radius: 900rpx;
        padding: 24rpx;
        border: solid 2rpx;

        margin: 10rpx;
        flex-direction: column;

        > view {
          line-height: calc(var(--hr-font-size-xxl));
        }
      }
    }

    .container-card-header {
      font-size: var(--hr-font-size-base);
      font-weight: 600;
      padding-bottom: 16rpx;
      &-icon {
        color: #43d5c0;
        font-size: var(--hr-font-size-xl);
        font-weight: normal;
      }

      .timer-split {
        margin: 0 12rpx;
      }
    }

    .container-card-row {
      @extend .up-lv;
      font-size: var(--hr-font-size-xs);
      margin-top: 8rpx;

      .label {
        width: 120rpx;
        color: var(--hr-neutral-color-7);
      }

      .content {
        flex: 1;
      }
    }

    .edit-container {
      flex-direction: row-reverse;
      @extend .up-lv;

      .iconfont {
        line-height: var(--hr-font-size-xs);
        font-size: var(--hr-font-size-xl);
        margin-right: 5rpx;
      }
    }
  }

  .up-lv {
    position: relative;
    z-index: 3;
  }
</style>
