<template>
  <view class="comment-item">
    <view class="flex-between">
      <uni-rate :value="item.docGrade" :size="14" readonly />

      <view class="f26 flex-normal">
        <text class="mr24">{{ item.patName }}</text>
        <text class="color-888">{{ item.createTime }}</text>
      </view>
    </view>

    <view class="mt8 g-break-word color-444 f32">
      {{ item.adviseForDoc }}
    </view>

    <view class="flex-normal tag">
      <view
        v-for="(tag, idx) in tags"
        :key="tag.value"
        :class="{
          mb8: idx !== tags.length - 1,
        }"
        class="tag-item color-666 f24 mb8"
      >
        {{ tag.label }}
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  import { type ICommentItem } from '../../utils/DoctorDetails';

  const props = defineProps<{
    item: ICommentItem;
    tagList: any[];
  }>();

  // const tags = ref<IOptions[]>([
  //   {
  //     label: '医生亲切',
  //     value: '医生亲切',
  //   },
  //   {
  //     label: '认真负责',
  //     value: '认真负责',
  //   },
  //   {
  //     label: '医术高明',
  //     value: '医术高明',
  //   },
  //   {
  //     label: '有耐心',
  //     value: '有耐心',
  //   },
  //   {
  //     label: '专业',
  //     value: '专业',
  //   },
  // ]);

  const tags = computed(() => {
    const _list = props.item.docEvlContentList;
    const _labelList = props.tagList;

    if (_list && _list.length) {
      return _list.map((code) => {
        const item = _labelList.find((o) => o.code == code);

        return {
          label: item?.label,
          value: item?.code,
        };
      });
    } else {
      return [];
    }
  });
</script>

<style lang="scss" scoped>
  .comment-item {
    padding: 36rpx 0;

    box-shadow: 0 -1rpx 0 0 #e6e6e6 inset;
    background-color: #fff;

    .tag {
      margin-top: 20rpx;
      flex-wrap: wrap;
      .tag-item {
        border-radius: 8rpx;
        background-color: var(--hr-neutral-color-1);
        margin-right: 8rpx;
        padding: 4rpx 16rpx;
      }
    }
  }
</style>
