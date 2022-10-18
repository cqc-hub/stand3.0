<template>
  <view>
    <uni-popup
      :duration="messageStore.popupDuration"
      @maskClick="maskClick"
      ref="popup"
      mask-background-color="rgba(0,0,0,0)"
    >
      <view
        :style="containerStyle"
        class="popup-content uni-popup__wrapper center"
      >
        <text class="text">{{ messageStore.msg }}</text>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, nextTick } from 'vue';
  import { useMessageStore } from '@/stores';

  interface IQ {
    [v: `--${number}`]: any;
  }

  const o: IQ = {
    '--23': 233,
  };

  export default defineComponent({
    setup() {
      const messageStore = useMessageStore();
      const popup = ref();

      const usePopup = function (type: boolean) {
        nextTick(() => {
          const popupRef = popup.value;
          if (!popupRef) return;

          if (type) {
            popupRef.open('center');
          } else {
            popup.value.close();
          }
        });
      };

      // watch(
      // 	() => messageStore.isShow,
      // 	() => {
      // 		console.log('watch');
      // 		usePopup(messageStore.isShow);
      // 	},
      // 	{
      // 		immediate: true
      // 	}
      // );

      uni.$on('showMessage', function () {
        usePopup(messageStore.isShow);
      });

      uni.$on('closeMessage', function () {
        usePopup(messageStore.isShow);
      });

      const maskClick = function () {
        messageStore.closeMessage();
        messageStore.maskClickCallBack();
      };

      const containerStyle = `
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 40rpx;
    color: #fff;
    border-radius: 10rpx;
    background-color: rgba(0, 0, 0, 0.6);
    overflow: hidden;
    max-width: 450rpx;
    position: relative;
    top: -160rpx;
    word-break: break-all;
    `;

      return {
        popup,
        maskClick,
        messageStore,
        containerStyle,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .text {
    font-size: var(--hr-font-size-base);
    word-break: break-all;
  }
</style>
