<template>
  <view class="">
    <view
      v-for="item in _list"
      :key="item.label"
      class="flex-between g-border-bottom item"
    >
      <view class="f32 g-bold flex1 text-ellipsis">{{ item.label }}</view>

      <view class="text-no-wrap number-box-content">
        <uni-number-box
          :value="getValue(item)"
          :disabled="getDisabled(item)"
          :min="0"
          :max="99"
          @change="boxChange(item, $event)"
          inputDisabled
        />
      </view>
    </view>

    <view
      v-if="list.length > showLen"
      @click="isShowMore = !isShowMore"
      class="show-more g-flex-rc-cc color-blue f28"
    >
      <view
        :class="{
          'icon-reverse': isShowMore,
        }"
        class="iconfont f40"
      >
        &#xe6c4;
      </view>
      <view>{{ isShowMore ? '收起' : '展开' }}更多</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  import { GStores } from '@/utils';

  const showLen = 3;
  const props = defineProps<{
    list: IOptions[];
    selectLength: number;
    value: { purpose: string; count: number }[];
  }>();

  const emits = defineEmits(['update:value']);
  const isShowMore = ref(false);
  const _list = computed(() => {
    if (isShowMore.value) {
      return props.list;
    } else {
      return props.list.filter((o, i) => i < showLen);
    }
  });

  const getValue = (item) => {
    const o = props.value.find((o) => o.purpose === item.value);

    if (o) {
      return o.count;
    } else {
      return 0;
    }
  };

  const getDisabled = (item) => {
    const idx = props.value.findIndex((o) => o.purpose === item.value);

    if (idx === -1 && props.value.length >= props.selectLength) {
      return true;
    } else {
      return false;
    }
  };

  const boxChange = (item, e) => {
    const value = [...props.value];
    const idx = value.findIndex((o) => o.purpose === item.value);

    if (idx === -1) {
      emits('update:value', [
        ...value,
        {
          purpose: item.value,
          count: e,
        },
      ]);
    } else {
      const v = value.splice(idx, 1);

      if (e) {
        emits('update:value', [
          ...value,
          {
            purpose: item.value,
            count: e,
          },
        ]);
      } else {
        emits('update:value', value);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .item {
    padding: 26rpx 0;
  }
  .number-box-content {
    width: 25 0rpx;
    display: flex;
    justify-content: flex-end;
    position: relative;
  }

  .show-more {
    padding-top: 24rpx;
    .icon-reverse {
      transform: rotate(180deg);
    }
  }
</style>
