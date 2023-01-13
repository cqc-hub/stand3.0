<template>
  <view class="">
    <image
      :class="{
        'sel-no': !a,
      }"
      :src="$global.BASE_IMG + '1-order-comment-sel.png'"
      class="sel"
    />
    <image
      @click="a = !a"
      :src="$global.BASE_IMG + '1-order-comment-sel.png'"
      :class="{
        'sel-no': a,
      }"
    />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  /**
   *
   * [1-5]-order-comment-sel.png
   * [1-5]-order-comment-unsel.png
   */

  const a = ref(false);
</script>

<style lang="scss" scoped>
  .sel-no {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  }
</style>
