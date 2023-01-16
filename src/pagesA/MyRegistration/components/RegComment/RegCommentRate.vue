<template>
  <view class="">
    <view class="comment-rate flex-normal">
      <view
        v-for="item in gradeList"
        :key="item.value"
        @click="rateClick(item)"
        class="flex-normal rate-item"
      >
        <image
          :src="getGradeSrc(item.value)"
          :class="{
            'img-filter': !getShow(item.value),
          }"
          class="rate-img mb8"
        />

        <text
          :class="{
            'my-hide': value !== item.value,
          }"
          class="color-888 f28"
        >
          {{ item.label }}
        </text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  import globalGl from '@/config/global';

  const props = defineProps<{
    value: number;
  }>();
  const emits = defineEmits(['update:value']);

  const gradeList = ref(
    <
      {
        value: number;
        label: string;
      }[]
    >[]
  );

  const labelMap = {
    1: '很不满',
    2: '不满意',
    3: '一般',
    4: '满意',
    5: '很满意',
  };

  for (let i = 0; i < 5; ) {
    gradeList.value.push({
      value: ++i,
      label: labelMap[i],
    });
  }

  const getShow = (v: number) => {
    if (props.value) {
      return v <= props.value;
    } else {
      return false;
    }
  };

  const getGradeSrc = (v: number) => {
    let idx = v;

    if (props.value && v <= props.value) {
      idx = props.value;
    }

    return globalGl.BASE_IMG + `${idx}-order-comment-sel.png`;
  };

  const rateClick = (item) => {
    emits('update:value', item.value);
  };
</script>

<style lang="scss" scoped>
  .comment-rate {
    justify-content: space-between;

    .rate-item {
      flex-direction: column;

      .rate-img {
        width: 86rpx;
        height: 86rpx;

        &.img-filter {
          -webkit-filter: grayscale(100%);
          -moz-filter: grayscale(100%);
          -o-filter: grayscale(100%);
          filter: grayscale(100%);
          filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
        }
      }
    }
  }
</style>
