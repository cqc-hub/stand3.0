<template>
  <view class="g-page">
    <!-- <g-flag isShowFg typeFg="15" /> -->
    <g-choose-pat />
    <view class="g-border-bottom">
      <g-tabs
        v-model:value="tabCurrent"
        :tabs="tabField"
        :scroll="false"
        @change="tabChange"
        field="label"
        style="width: 100%"
      />
    </view>

    <swiper
      :current="tabCurrent"
      :duration="300"
      @change="({ detail: { current } }) => tabChange(current)"
      class="g-container"
    >
      <swiper-item>
        <scroll-view scroll-y class="swiper-item uni-bg-red">
          <Clinic-Pay-Detail-List :list="unPayList" />
        </scroll-view>
      </swiper-item>

      <swiper-item>
        <scroll-view scroll-y class="swiper-item uni-bg-red">A</scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { type IPayListItem } from './utils/clinicPayDetail';

  import ClinicPayDetailList from './components/clinicPayDetailList.vue';

  const tabCurrent = ref(0);
  const tabField = [
    {
      label: '待缴费',
      key: 0,
    },
    {
      label: '已缴费',
      key: 1,
    },
  ];
  const tabChange = (idx: number) => {
    tabCurrent.value = idx;
  };

  const unPayList = ref<IPayListItem[]>([{}, {}, {}, {}]);
  const payedList = ref<IPayListItem[]>([]);
</script>

<style lang="scss" scoped>
  .swiper-item {
    height: 100%;
    padding: 0 32rpx;
    width: calc(100% - 64rpx);
  }
</style>
