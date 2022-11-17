<template>
  <view v-if="isComplete" class="flex-normal">
    <view
      v-for="(item, idx) in serList"
      :key="idx"
      @click="goNetService(item)"
      class="item g-flex-rc-cc g-border"
    >
      <image :src="item.img" class="item-img" mode="" />

      <view class="g-bold f36 text-no-wrap">{{ item.title }}</view>

      <view>
        <text class="f28 text-no-wrap">
          <text class="color-error g-bold">{{ item.fee }}元</text>
          <text class="color-888">/</text>
        </text>
        <text class="color-888 f24 text-no-wrap">{{ item.util }}</text>
      </view>
    </view>

    <view class="a">233</view>
  </view>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import globalGl from '@/config/global';

  import {
    type IDocService,
    type TDocServiceItem,
  } from '../../utils/DoctorDetails';
  import { joinQuery } from '@/common';

  const burl = globalGl.BASE_IMG;
  const systemStyle = ref('normal');
  const props = defineProps<{
    docService: IDocService;
    hosDocId: string;
  }>();

  /**
   * 已上传图片(都有对应中医风格 名字后面加上_zy 即可)
   *
   * 电话 card_doctor_dhwz_n.png -> 对应中医 card_doctor_dhwz_n_zy-png
   *
   * 药品 card_doctor_mbfz_n
   *
   * 摄像机 card_doctor_spwz_n
   *
   * 问答 card_doctor_twzx_n
   *
   * 药箱 card_doctor_zxfz_n
   *
   */
  const serList = ref([
    {
      img: 'card_doctor_twzx_n',
      title: '图文咨询',
      fee: 0,
      util: '次',
      key: 'pictureParam',
      receptionMode: '1',
    },
    {
      img: 'card_doctor_dhwz_n',
      title: '电话问诊',
      fee: 0,
      util: '次',
      key: 'phoneParam',
      receptionMode: '2',
    },
    {
      img: 'card_doctor_spwz_n',
      title: '视频门诊',
      fee: 0,
      util: '次',
      key: 'videoParam',
      receptionMode: '4',
    },
    {
      img: 'card_doctor_mbfz_n',
      title: '复诊开药',
      fee: 0,
      util: '次',
      key: 'jsonParam',
      receptionMode: '8',
    },
  ]);
  const isComplete = ref(false);

  const init = (item: IDocService) => {
    isComplete.value = false;
    serList.value = serList.value.filter((o) => {
      const { key } = o;

      const v = <TDocServiceItem>item[key];
      if (v) {
        o.fee = v.servicePrice;
      }

      return v;
    });

    serList.value.map((o) => {
      o.img = burl + o.img;
      if (systemStyle.value !== 'normal') {
        o.img += '_zy';
      }

      o.img += '.png';
    });

    isComplete.value = true;
  };

  const goNetService = (item: typeof serList.value[number]) => {
    const { receptionMode } = item;

    const arg = {
      receptionMode,
      docId: props.hosDocId,
    };

    uni.navigateTo({
      url: joinQuery('/pagesC/cloudHospital/cloudHospital', arg),
    });
  };

  watch(
    () => props.docService,
    (v) => {
      init(v);
    },
    {
      immediate: true,
    }
  );
</script>

<style lang="scss" scoped>
  .item {
    flex-direction: column;

    // width: 208rpx;
    // height: 236rpx;
    margin-right: 8rpx;

    padding: 0 40rpx;
    padding-top: 32rpx;
    padding-bottom: 24rpx;

    background: #ffffff;
    border-radius: 16rpx;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);

    .item-img {
      width: 80rpx;
      height: 80rpx;
      margin-bottom: 12rpx;
    }

    &:first-child {
      margin-left: 32rpx;
    }
  }
  .a {
    height: 1px;
    opacity: 0;
  }
</style>
