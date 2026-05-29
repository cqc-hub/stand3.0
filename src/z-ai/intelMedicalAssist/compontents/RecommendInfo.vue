<template>
  <view class="g-border-top mt18 pt18 lineH48">
    <view @click="goOrder" class="color-blue f32 g-bold mb16 g-break-word">{{ item.title }}</view>
    <view v-if="item.subTitle" class="color-444 f32 g-break-word mb8">
      {{ item.subTitle }}
    </view>

    <view v-if="item.phones">
      <template v-for="(phone, i) in item.phones" :key="`recomonendInfo-${i}`">
        <text class="f24 color-888 mr8">
          {{ phone }}
        </text>

        <text v-if="i + 1 < item.phones.length" class="f24 color-888 mr8 mb8">
          /
        </text>
      </template>
    </view>

    <view class="g-border-top g-border-bottom lineH48">
      <view class="flex-normal">
        <view
          v-if="item.latitude && item.longitude"
          @click="locationClick"
          class="flex1 g-border-right1 pt24 pb24"
        >
          <view class="g-flex-rc-cc">
            <!-- <img
              :src="global.BASE_IMG + 'srm-chat-room-location.png'"
              class="s-icon mr8"
            /> -->
            <view class="icon-font ico_location2  s-icon mr8" />
            <view>
              <view class="f36 g-bold s-icon-title">到这儿去</view>
              <view class="color-888 f24">点击开启地址导航</view>
            </view>
          </view>
        </view>

        <view
          v-if="item.phones && item.phones.length"
          @click="phoneClick"
          class="flex1 pt24 pb24 pr24 pl24"
        >
          <view class="g-flex-rc-cc">
            <!-- <img
              :src="global.BASE_IMG + 'srm-chat-room-callphone.png'"
              class="s-icon mr8"
            /> -->
             <view class="iconfont color-blue s-icon mr8">&#xe66a;</view>

            <view>
              <view class="f36 g-bold s-icon-title">打电话</view>

              <view class="color-888 f24">请在工作时间咨询</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { openLocation, apiAsync } from '@/utils';
  import { joinQueryForUrl } from '@/common';
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
      async goOrder () {
          // const hosList  = await ServerStaticData.getHosList();
          // console.log(222,hosList)
          //   if(hosList.length === 1){
          console.log(222,this.item)
              uni.navigateTo({
                url: joinQueryForUrl('/pagesA/MyRegistration/selDepartment', {
                  clinicalType: '1',
                  hosId: this.item.hosId,
                }),
              });
            // }else{
            //   uni.navigateTo({
            //     url: joinQueryForUrl('/pagesA/MyRegistration/Register', {
            //       _url: '/pagesA/MyRegistration/selDepartment?clinicalType=1',
            //     }),
            //   });
            // }
        },
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
    },

    components: {},
  };
</script>

<style lang="scss" scoped>
  .s-icon {
    font-size: 25px;
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
      content: '';
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
</style>
