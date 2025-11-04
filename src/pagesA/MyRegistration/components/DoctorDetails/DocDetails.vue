<template>
  <view class="">
    <block v-if="detail.clinicTime">
      <view class="g-bold f36 mb16">
        <!-- <text class="icon-font ico_doctor-diamond icon-size"></text> -->
        <image
          :src="$global.BASE_IMG + 'stand3-doctor-detail-clock.png'"
          class="icon-clock"
        />
        <text>就诊提醒</text>
      </view>
      <view class="color-444 f32 g-break-word mb40">
        <rich-text :nodes="HTMLParser(throughCharacterLineFeed(detail.clinicTime))" />
      </view>
    </block>

    <block v-if="detail.goodAt">
      <view class="g-bold f36 mb16">
        <text class="icon-font ico_doctor-diamond icon-size"></text>
        <text>擅长</text>
      </view>
      <view class="color-444 f32 g-break-word mb40">
        <rich-text
          :nodes="HTMLParser(throughCharacterLineFeed(detail.goodAt))"
        />
      </view>
    </block>

    <block v-if="detail.intro">
      <view class="g-bold f36 mb16">
        <text class="icon-font ico_doctor-document icon-size"></text>
        <text>简介</text>
      </view>
      <view class="color-444 f32 g-break-word mb40">
        <rich-text :nodes="HTMLParser(throughCharacterLineFeed(detail.intro))" />
      </view>
    </block>

    <block v-if="detail.academicAchievements">
      <view class="g-bold f36 mb16">
        <text class="icon-font ico_doctor-hat icon-size"></text>
        <text>学术成就</text>
      </view>
      <view class="color-444 f32 g-break-word mb40">
        <rich-text :nodes="HTMLParser(throughCharacterLineFeed(detail.academicAchievements))" />
      </view>
    </block>

    <view class="safe-height" />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { type IDocDetail } from '../../utils/DoctorDetails';
  import HTMLParser from '@/common/html-parser';
  import { throughCharacterLineFeed } from '@/utils';

  const props = defineProps<{
    detail: IDocDetail;
  }>();
</script>

<style lang="scss" scoped>
  .icon-size {
    width: 45rpx;
    height: 45rpx;
    position: relative;
    top: 8rpx;
    margin-right: 8rpx;
  }

  .icon-clock {
    @extend .icon-size;
  }
</style>
