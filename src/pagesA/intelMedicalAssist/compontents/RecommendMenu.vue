<template>
  <view class="menu-content flex-normal">
    <view
      v-for="(item, index) in list"
      :key="`recommendMenu_${index}`"
      @click="itemClick(item)"
      class="flex-normal"
    >
      <img :src="$global.BASE_IMG+item.ico" class="mr8 menu-ico" lazy-load />
      <view class="f32 color-blue">{{ item.label }}</view>
    </view>
  </view>
</template>

<script>
  import { useTBanner } from '@/utils';
  import globalGl from '@/config/global';
  export default {
    props: {
      list: {
        type: Array,
        default: () => [],
      },
    },

    data() {
      return {};
    },

    onLoad() {},

    methods: {
      itemClick({ key }) {
        switch (key) {
          case 'guideSmart':
            this.goGuideSmart();
            break;

          case 'guideMedical':
            this.goGuideMedical();
            break;

          case 'guideDisease':
            this.goGuideDisease();
            break;

          case 'guideMedical':
            this.goGuideMedical();
            break;

          case 'healthTestSelf':
            this.goHealthTestSelf();
            break;

          case 'healthCyclopaedia':
            this.goHealthCyclopaedia();
            break;

          case 'serviceCenter':
            this.goServiceCenter();
            break;

          default:
            break;
        }
      },

      goGuideSmart() {
        useTBanner({
          type: 'h5',
          path:
            globalGl.h5Url +
            'pagesC/IntelligentGuidance/select?sysCode=' +
            globalGl.SYS_CODE +
            '&mulSelect=true',
        });
      },

      goGuideMedical() {
        console.log('智能问药');
        useTBanner({
          type: 'h5',
          path:
            'https://h5.eheren.com/v3_h5/#/pagesA/diseaseCyclopedia/index?tabIndex=2&sysCode=' +
            globalGl.SYS_CODE,
        });
      },

      goGuideDisease() {
        console.log('智能问病');
        useTBanner({
          type: 'h5',
          path:
            'https://h5.eheren.com/v3_h5/#/pagesA/diseaseCyclopedia/smartChatRoom?&sysCode=' +
            globalGl.SYS_CODE,
        });
      },

      goHealthTestSelf() {
        console.log('健康自测');

        useTBanner({
          type: 'h5',
          path: 'https://h5.eheren.com/v3_h5/#/pagesA/healthSelfTest/healthSelfTest',
        });
      },

      goHealthCyclopaedia() {
        console.log('健康百科');

        useTBanner({
          type: 'h5',
          path:
            'https://h5.eheren.com/v3_h5/#/pagesA/diseaseCyclopedia/index?tabIndex=0&sysCode=' +
            globalGl.SYS_CODE,
        });
      },

      goServiceCenter() {
         // #ifndef H5
        uni.navigateTo({
          url: '/pagesA/serviceCenter/serviceCenter',
        });
         // #endif

        // #ifdef H5
        useTBanner({
          type: 'self',
          path: joinQueryForUrl('/pagesA/serviceCenter/serviceCenter', {}),
        });
        // #endif
      },
    },

    components: {},
  };
</script>

<style lang="scss" scoped>
  .menu-content {
    column-gap: 32rpx;
    row-gap: 32rpx;
    flex-wrap: wrap;

    .menu-ico {
      width: 20px;
      height: 20px;
    }
  }
</style>
