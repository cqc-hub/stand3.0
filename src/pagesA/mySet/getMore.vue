<template>
  <view class="page bg-white">
    <g-tabs
      v-model:value="tabCurrent"
      :tabs="tabField"
      :scroll="false"
      @change="tabChange"
      field="label"
      style="width: 100%"
    />
    <swiper
      :current="tabCurrent"
      :duration="300"
      @change="({ detail: { current } }) => tabChange(current)"
      class="g-container"
    >
      <swiper-item v-for="(item, index) in defaultFlagList" :key="index">
        <view class="more-content pt24">
          <view
            v-for="(flag, flagIndex) in item"
            :key="'flagIndex' + flagIndex"
            @click="goAgreement(flag)"
          >
            <view class="flex justify-between w100">
              <text>{{ flag.label }}</text>
              <view class="iconfont icon-resize icon_arrow">&#xe66b;</view>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <view class="top-info">
      <image
        :src="$global.BASE_IMG + 'img_logo@3x.png'"
        mode="widthFix"
      ></image>
      <view>
        当前首页版本 {{ getLocalStorage('systemConfigVersion')[0]?.version }}
      </view>
      <view>
        当前系统版本 {{ getLocalStorage('systemConfigVersion')[1]?.version }}
      </view>
    </view>
    <view class="g-footer">
      <button @click="goInfoPage" class="btn btn-normal flex1">注销账号</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref } from 'vue';
  import { joinQueryForUrl, getLocalStorage } from '@/common';
  import { onLoad } from '@dcloudio/uni-app';
  import { deQueryForUrl } from '@/common';
  import { useCacheStore } from '@/stores';
  import { ServerStaticData } from '@/utils';
  const cacheStore = useCacheStore();
  const pageProps = ref(
    {} as {
      type: number;
    }
  );
  const tabCurrent = ref(0);
  const tabField = ref([
    {
      label: '服务条款',
      key: '0',
    },
    {
      label: '业务条款',
      key: '1',
    },
    {
      label: '政策法规',
      key: '2',
    },
  ]);
  const defaultFlagList = ref<any[]>([
    [],
    [
      {
        label: '预约挂号须知',
        flag: '9',
      },
      {
        label: '就诊人绑定须知',
        flag: '108',
      },

      {
        label: '挂号订单查询须知',
        flag: '405',
      },
      {
        label: '归档病历资料复印须知 ',
        flag: '508',
      },
    ],
    [
      {
        label: '中华人民共和国个人信息保护法',
        flag: '1241',
      },
      {
        label: '国务院办公厅关于促进“互联网+医疗健康”发展的意见',
        flag: '1242',
      },
      {
        label: '国务院办公厅关于促进和规范健康医疗大数据应用发展的指导意见',
        flag: '1243',
      },
      {
        label: '关于深入推进“互联网+医疗健康”“五 个一”服务行动的通知',
        flag: '1244',
      },
      {
        label: '互联网诊疗监管细则(试行)',
        flag: '1245',
      },
      {
        label: '远程医疗服务管理规范(试行)',
        flag: '1246',
      },
      {
        label: '互联网医院管理办法(试行)',
        flag: '1247',
      },
      {
        label: '互联网诊疗管理办法(试行)',
        flag: '1248',
      },
    ],
  ]);
  const tabChange = (idx: number) => {
    tabCurrent.value = idx;
  };

  const goAgreement = (flag) => {
    // #ifdef  MP-WEIXIN
    if (flag.label === '小程序隐私保护指引') {
      wx.openPrivacyContract();
      return;
    }
    // #endif
    uni.navigateTo({
      url: `/pagesA/mySet/userPolicy?typeFg=${flag.flag}`,
    });
  };

  const goInfoPage = () => {
    uni.navigateTo({
      url: '/pages/home/accountInfo',
    });
  };

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    tabCurrent.value = pageProps.value.type;
    defaultFlagList.value[0] = [
      {
        label: '小程序隐私保护指引',
        flag: '1213',
      },
      ...cacheStore.flagList,
    ];
    const { policyList } =
      await ServerStaticData.getSystemConfig('RestOfConfig');
    if (policyList && policyList.length) {
      policyList[1].length && (defaultFlagList.value[1] = policyList[1]);
      policyList[2].length && (defaultFlagList.value[2] = policyList[2]);
    }
  });
</script>

<style lang="scss" scoped>
  .page {
    .top-info {
      height: 300upx;
      text-align: center;

      image {
        width: 147upx;
        // height: 77upx;
        margin: 93upx 0 10upx 0;
      }

      view {
        color: #999;
        font-size: var(--hr-font-size-xs);
        line-height: 40upx;
      }
    }

    .more-content {
      //   background: #fff;
      //   padding-left: 30upx;

      view {
        border-bottom: 1rpx solid var(--hr-neutral-color-2);
        padding: 12rpx 24rpx 12rpx 48rpx;
        height: 88upx;
        color: #333;
        font-size: var(--hr-font-size-base);
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:nth-child(5) {
          border: none;
        }

        image {
          width: 21upx;
          height: 32upx;
        }
      }

      .icon-resize {
        font-size: var(--hr-font-size-xxl);
      }
    }
    .footer {
      position: fixed;
      bottom: 50upx;
      width: 100%;
      font-size: var(--hr-font-size-xs);
      color: #999999;
      text-align: center;
    }
  }
  .g-container {
    height: calc(100vh - 540rpx);
  }
  .top-info {
    height: 250rpx;
    text-align: center;

    image {
      width: 200upx;
      // height: 77upx;
      margin: 93upx 0 10upx 0;
    }

    view {
      color: #999;
      font-size: var(--hr-font-size-xs);
      line-height: 40upx;
      opacity: 0.6;
    }
  }
</style>
