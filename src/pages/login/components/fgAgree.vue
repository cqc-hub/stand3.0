<template>
  <view
    :class="{
      'system-mode-old': systemModeOld,
    }"
    class=""
  >
    <view @click="changeCheck" class="fg-agree">
      <view
        :class="{
          'is-check': isCheck,
        }"
        class="iconfont check-box"
      >
        {{ (isCheck && '&#xe6d0;') || '&#xe6ce;' }}
      </view>
      <view class="g-break-word flex1">
        <text>我已阅读并同意</text>
        <text
          v-if="content"
          @click.stop="emits('show-agree')"
          class="color-blue"
        >
          {{ content }}
        </text>

        <template v-else>
          <text
            v-for="item in cacheStore.flagList"
            :key="item.flag"
            @click="goAgreement(item)"
            class="color-blue"
          >
            《{{ item.label }}》
          </text>
        </template>

        <!-- <text>{{ fg141 }}</text> -->
        <!-- <rich-text :nodes="fg141" /> -->
      </view>
    </view>

    <!-- <g-flag typeFg="141" v-model:value="fg141" /> -->
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { useCacheStore } from '@/stores/modules/cache';
  import { joinQueryForUrl } from '@/common';

  const props = withDefaults(
    defineProps<{
      isCheck: boolean;
      systemModeOld?: boolean;
      content?: string;
      cusShowAgree?: boolean;
    }>(),
    {}
  );
  const cacheStore = useCacheStore();

  const emits = defineEmits(['update:isCheck', 'show-agree']);
  const fg141 = ref('');

  const changeCheck = () => {
    emits('update:isCheck', !props.isCheck);
  };

  const goAgreement = (item) => {
    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/mySet/userPolicy', {
        typeFg: item.flag,
      }),
    });
  };
</script>

<style lang="scss" scoped>
  .fg-agree {
    display: flex;
    font-size: var(--hr-font-size-xs);
    align-items: flex-start;

    .check-box {
      color: var(--hr-neutral-color-7);
      font-size: var(--h-size-40);
      margin-right: 4rpx;
      transform: translateY(-5rpx);

      &.is-check {
        color: var(--hr-brand-color-6);
      }
    }
  }

  .system-mode-old {
    .check-box {
      font-size: 54rpx;
    }
  }
</style>
