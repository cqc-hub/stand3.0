<template>
  <view class="flex-between pt24">
    <!-- <view class="color-888 f28 mr32">满意为您推荐的结果吗？</view>
	 -->
    <view class="flex-normal">
      <view @click="askAgain" class="color-blue mr24">重新提问</view>
      <view
        v-if="isOpenWxServiceBtn"
        @click="handeleOpenServicesChat(isOpenWxServiceBtn)"
        class="color-blue mr24"
      >
        寻求人工客服帮助
      </view>
    </view>
    <view class="flex-normal">
      <image
        :src="img_url3 + getAgreeSrc"
        @click="itemClick(1)"
        class="icon-image mr32"
      />
      <image
        :src="img_url3 + getDisagreeSrc"
        @click="itemClick(2)"
        class="icon-image"
      />
    </view>
  </view>
</template>

<script>
  import api from '@/service/api';
  import globalGl from '@/config/global';
  import { onMounted } from 'vue';
  import { openServicesChat, pageConfig } from '../utils/utils';
  export default {
    props: {
      requestId: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        img_url3: this.$global.BASE_IMG,
        clickType: 0, // 0 未点  1 点赞 2 点踩
        isOpenWxServiceBtn: null,
      };
    },
    mounted() {
      this.isOpenWxServiceBtn =
        pageConfig.value?.intelMedicalAssistConfig?.isOpenWxServiceBtn;
    },
    emits: ['askAgain'],
    computed: {
      getAgreeSrc({ clickType }) {
        return clickType === 1
          ? 'h5_srm_chatRomm_agree_active.png'
          : 'h5_srm_chatRomm_agree.png';
      },

      getDisagreeSrc({ clickType }) {
        return clickType === 2
          ? 'h5_srm_chatRomm_disagree_active.png'
          : 'h5_srm_chatRomm_disagree.png';
      },
    },

    methods: {
      handeleOpenServicesChat(query) {
        openServicesChat(query);
      },
      askAgain() {
        this.$emit('askAgain', this.requestId);
      },
      async itemClick(evaluate) {
        if (this.clickType === evaluate) {
          return;
        }

        await api.customerEvaluate({
          sysCode: globalGl.SYS_CODE,
          id: this.requestId,
          evaluate,
        });

        this.clickType = evaluate;
      },
    },

    components: {},
  };
</script>

<style lang="scss" scoped>
  .icon-image {
    width: 40rpx;
    height: 40rpx;
    // z-index: -1;
  }
  .color-blue {
    color: #296fff;
  }
</style>
