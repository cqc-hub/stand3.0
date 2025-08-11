<template>
  <view class="mt10 lineH48">
    <view @click="goOrder" class="flex mb16 g-break-word flex-between" >
      <text class="color-111 f32 g-bold">{{ item.title }} </text>
      <view class="button">去挂号</view>
    </view>
    <view v-if="item.subTitle" class="g-break-word mb8 flex flex-between">
      <text class="color-444 f32">{{ item.subTitle }} </text>
    </view>

    <view v-if="item.phones || item.address" class="g-break-word flex flex-between lineH48 mt16">
      <view v-if="item.phones" @click="phoneClick" class="flex items-center">
        <view class="iconfont color-blue mr12 f32">&#xe66a;</view>
        <text class="f32 color-blue"> 拨打电话 </text>
        <text>请在工作时间咨询</text>
      </view>

      <view v-if="item.address" @click="locationClick(item)" class="flex items-center">
        <view class="icon-font ico_location2 right-icon guide-icon mr12 f32" />
        <text class="f32 text-no-wrap color-blue location-tip"> 带我去 </text>
        <view v-if="item.distance" class="hos-away text-ellipsis"> 距离{{ item.distance }} </view>
      </view>
    </view>
  </view>
</template>

<script>
import { openLocation, apiAsync } from "@/utils";

export default {
  data() {
    return {
      global: this.$global,
    };
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },

  methods: {
    async phoneClick() {
      const { phones } = this.item;
      const phoneLen = phones.length;
      let phoneNumber = phones[0];

      if (phoneLen > 1) {
        let tip = `以下${phoneLen}种号码均可联系到医院`;
        const { tapIndex } = await apiAsync(uni.showActionSheet, {
          title: tip,
          alertText: tip,
          itemList: phones,
        });

        phoneNumber = phones[tapIndex];
      }

      uni.makePhoneCall({
        phoneNumber,
      });
    },

    locationClick() {
      const { longitude, latitude, title, subTitle } = this.item;
      openLocation([latitude * 1, longitude * 1], {
        name: title,
        address: subTitle,
      });
    },
     async goOrder () {
     const hosList  = await ServerStaticData.getHosList();
      if(hosList.length === 1){
        uni.navigateTo({
          url: joinQueryForUrl('/pagesA/MyRegistration/selDepartment', {
            clinicalType: '1',
            hosId: hosList[0].hosId,
          }),
        });
      }else{
        uni.navigateTo({
          url: joinQueryForUrl('/pagesA/MyRegistration/Register', {
            _url: '/pagesA/MyRegistration/selDepartment?clinicalType=1',
          }),
        });
      }
  }

  },

  components: {},
};
</script>

<style lang="scss" scoped>
.s-icon {
  width: 28px;
  height: 28px;
  position: relative;
  top: -8rpx;
}

.s-icon-title {
  line-height: 32rpx;
}

.g-border-right1 {
  position: relative;

  &::after {
    content: "";
    width: 2rpx;
    display: block;
    position: absolute;
    top: 0rpx;
    bottom: 0rpx;
    background-color: #e6e6e6;
    right: 0;
  }
}

.g-border-top {
  border-color: #e6e6e6;
}
.lineH64 {
  line-height: 64rpx;
}
.lineH48 {
  line-height: 48rpx;
}
.hos-away {
  background-color: #fff;
  border-radius: 8rpx;
  padding: 4rpx 16rpx;
  color: var(--hr-neutral-color-8);
  width: fit-content;
  // min-width: 160rpx;
}
.button {
  flex: 0 0 auto;
  padding: 8rpx 16rpx;
  color: #fff;
  background-color: var(--hr-brand-color-6);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 28rpx;
}
</style>
