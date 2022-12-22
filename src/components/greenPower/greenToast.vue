<template>
  <view class="">
    <My-Popup
      :maskClick="false"
      maskBackgroundColor="transparent"
      v-model="isGreenModelShow"
    >
      <view class="content">
        <image
          class="green-power-circle"
          mode="widthFix"
          :src="$global.BASE_IMG + 'shaox_circle_绿色能量@2x.png'"
        />

        <view>{{ contentTitle }}</view>
        <view class="power-util">{{ content }}g</view>
      </view>
    </My-Popup>
  </view>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';

  import MyPopup from '@/components/uni-my-popup/uni-my-popup.vue';

  const props = withDefaults(
    defineProps<{
      content: string;
      contentTitle: string;
      duration?: number;
    }>(),
    {
      duration: 1000,
    }
  );
  const emits = defineEmits(['update:content']);

  const isGreenModelShow = ref(false);

  watch(
    () => props.content,
    (v) => {
      if (v) {
        isGreenModelShow.value = true;
      }
    }
  );

  watch(
    () => isGreenModelShow.value,
    (v) => {
      if (v) {
        setTimeout(() => {
          isGreenModelShow.value = false;
          setTimeout(() => {
            emits('update:content', '');
          }, 500);
        }, props.duration);
      }
    }
  );
</script>

<style lang="scss" scoped>
  .content {
    position: relative;
    top: -200upx;
    display: flex;
    border-radius: 16px;
    padding: 20upx;
    background-color: rgba(0, 0, 0, 0.8);

    color: #fff;

    .green-power-circle {
      width: 45upx;
      margin-right: 15upx;
      position: relative;
    }

    .power-util {
      margin: 0 10upx;
      color: #0d8c00;
      text-shadow: 1upx 1upx 2upx;
    }
  }
</style>
